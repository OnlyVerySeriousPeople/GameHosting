using AuthService.Dotnet.Application.Contracts;
using AuthService.Dotnet.Domain.Entities;
using AuthService.Dotnet.Domain.Exceptions;
using AuthService.Dotnet.Infrastructure.Common.Mappings;
using AuthService.Dotnet.Infrastructure.Models;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace AuthService.Dotnet.Infrastructure.Helpers
{
	public class AuthHelperService(
		UserManager<UserIdentity> userManager,
		SignInManager<UserIdentity> signInManager,
		ITokenService tokenService)
		: IAuthHelperService
	{
		public async Task<Result<User>> CreateNewUserAsync(
			string email,
			string? username,
			string? playerId,
			string? password)
		{
			var existingUser = await userManager.FindByEmailAsync(email);
			if (existingUser is not null) 
				return Result<User>.Failure(UserErrors.AlreadyExist(email));

			var identity = new UserIdentity()
			{
				Email = email,
				UserName = username,
				PlayerId = playerId,
				CreatedAt = DateTime.UtcNow,
			};

			IdentityResult result;

			if (password is null)
				result = await userManager.CreateAsync(identity);
			else
				result = await userManager.CreateAsync(identity, password);


			if (result.Succeeded) return
				Result<User>.Success(identity.ToDomain());

			var errors = string.Join(", ", result.Errors.Select(e => e.Description));
			return Result<User>.Failure(UserErrors.CreationFailed(email, errors));
		}

		public async Task<Result<User>> ValidateCredentialsAsync(string email, string password)
		{
			var identity = await userManager.FindByEmailAsync(email);
			if (identity is null)
				return Result<User>.Failure(UserErrors.NotFound(email));

			var signInResult = await signInManager.CheckPasswordSignInAsync(identity, password, false);
			if (!signInResult.Succeeded)
				return Result<User>.Failure(UserErrors.InvalidPassword());

			return Result<User>.Success(identity.ToDomain());
		}

		public async Task<AuthenticationResultValue> PrepareAuthenticationResultValueAsync(User user, string prefix,
			CancellationToken cancellationToken)
		{
			var (jwtToken, jwtExpirationDate) = tokenService.GenerateJwtToken(user);
			var (refreshToken, refreshExpirationDate) = tokenService.GenerateRefreshToken();

			var refreshTokenEntity = new RefreshToken
			{
				Token = refreshToken,
				CreatedAt = DateTime.UtcNow,
				Expiration = refreshExpirationDate,
				UserId = user.Id
			};

			var isTokenStored = await tokenService.StoreRefreshTokenAsync(refreshTokenEntity,
				prefix, cancellationToken);

			if (!isTokenStored)
				throw new StoreRefreshTokenException(user.Id);

			return new AuthenticationResultValue()
			{
				JwtToken = jwtToken,
				JwtTokenExpiresAt = jwtExpirationDate,
				RefreshToken = refreshToken,
				RefreshTokenExpiresAt = refreshExpirationDate
			};
		}

		public async Task<User> VerifyRefreshTokenAsync(string token, string prefix, CancellationToken cancellationToken)
		{
			var refreshToken = await tokenService.GetRefreshTokenAsync(token, prefix, cancellationToken);
			if (refreshToken is null || refreshToken.Expiration < DateTime.Now)
				throw new RefreshTokenException("Invalid or expired refresh token.");

			var identity = await userManager.FindByIdAsync(refreshToken.UserId);
			if (identity is null)
				throw new RefreshTokenException("User associated with the refresh token not found.");

			return identity.ToDomain();
		}

		public async Task<Result<Unit>> RemoveAllUserDataAsync(string userId, CancellationToken cancellationToken)
		{
			var user = await userManager.FindByIdAsync(userId);
			if (user is null) 
				return Result<Unit>.Failure(UserErrors.NotFound(userId));

			var result = await userManager.DeleteAsync(user);
			if (!result.Succeeded)
			{
				var errors = string.Join(", ", result.Errors.Select(e => e.Description));
				return Result<Unit>.Failure(UserErrors.DeletionFailed(userId, errors));
			}

			await DropAllUserRefreshTokensAsync(userId, cancellationToken);
			return Result<Unit>.Success(Unit.Value);
		}

		public async Task DropAllUserRefreshTokensAsync(string userId, CancellationToken cancellationToken)
		{
			var isRevoked = await tokenService.RevokeAllUserRefreshTokensAsync(userId, cancellationToken);
			if (!isRevoked)
				throw new RefreshTokenRevokeException();
		}
	}
}