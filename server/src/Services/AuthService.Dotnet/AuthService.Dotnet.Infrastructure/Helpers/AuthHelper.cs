using AuthService.Dotnet.Application.Contracts;
using AuthService.Dotnet.Domain.Entities;
using AuthService.Dotnet.Domain.Exceptions;
using AuthService.Dotnet.Infrastructure.Common.Mappings;
using AuthService.Dotnet.Infrastructure.Models;
using Microsoft.AspNetCore.Identity;

namespace AuthService.Dotnet.Infrastructure.Helpers
{
	public class AuthHelper(
		UserManager<UserIdentity> userManager,
		SignInManager<UserIdentity> signInManager,
		ITokenService tokenService)
		: IAuthHelper
	{
		public async Task<User> CreateNewUserAsync(
			string email,
			string? username,
			string? playerId,
			string? password)
		{
			var existingUser = await userManager.FindByEmailAsync(email);
			if (existingUser is not null)
				throw new UserCreationException(email, "User with such email already exists.");

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


			if (result.Succeeded) return identity.ToDomain();

			var errors = string.Join(", ", result.Errors.Select(e => e.Description));
			throw new UserCreationException(email, errors);
		}

		public async Task<User> ValidateCredentialsAsync(string email, string password)
		{
			var identity = await userManager.FindByEmailAsync(email);
			if (identity is null)
				throw new ValidateCredentialsException("User with such email not found");

			var signInResult = await signInManager.CheckPasswordSignInAsync(identity, password, false);
			if (!signInResult.Succeeded)
				throw new ValidateCredentialsException("Invalid password");

			return identity.ToDomain();
		}

		public async Task<AuthenticationResultValue> PrepareAuthenticationResultValue(User user, string prefix,
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

		public async Task<User> VerifyRefreshToken(string token, string prefix, CancellationToken cancellationToken)
		{
			var refreshToken = await tokenService.GetRefreshTokenAsync(token, prefix, cancellationToken);
			if (refreshToken is null || refreshToken.Expiration < DateTime.Now)
				throw new RefreshTokenException("Invalid or expired refresh token.");

			var identity = await userManager.FindByIdAsync(refreshToken.UserId);
			if (identity is null)
				throw new RefreshTokenException("User associated with the refresh token not found.");

			return identity.ToDomain();
		}

		public async Task RemoveAllUserDataAsync(string userId)
		{
			var user = await userManager.FindByIdAsync(userId);
			if (user is null)
				throw new UserNotFoundException(userId);

			var result = await userManager.DeleteAsync(user);
			if (!result.Succeeded)
			{
				var errors = string.Join(", ", result.Errors.Select(e => e.Description));
				throw new UserDeletionException(userId, errors);
			}

			await DropAllUserRefreshTokensAsync(userId);
		}

		public async Task DropAllUserRefreshTokensAsync(string userId)
		{
			var isRevoked = await tokenService.RevokeAllUserRefreshTokensAsync(userId);
			if (!isRevoked)
				throw new RefreshTokenRevokeException();
		}
	}
}