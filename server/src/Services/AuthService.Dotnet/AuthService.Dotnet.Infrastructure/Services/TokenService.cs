using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using AuthService.Dotnet.Application.Contracts;
using AuthService.Dotnet.Domain.Entities;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using StackExchange.Redis;

namespace AuthService.Dotnet.Infrastructure.Services
{
	public class TokenService(
		IDistributedCache cache,
		IConnectionMultiplexer redis,
		IConfiguration config,
		ILogger<TokenService> logger)
		: ITokenService
	{
		private readonly int _jwtExpirationMinutes = int.Parse(config["Jwt:ExpirationInMinutes"] ?? "15");
		private readonly int _refreshExpirationDays = int.Parse(config["Refresh:ExpirationInDays"] ?? "7");

		private readonly string _jwtKey =
			config["Jwt:Key"] ?? throw new InvalidOperationException("Jwt:Key is not configured");

		public (string, DateTime) GenerateJwtToken(User user)
		{
			var claims = new List<Claim>()
			{
				new Claim(ClaimTypes.Email, user.Email),
				new Claim("username", user.Username),
				new Claim("playerId", user.PlayerId),
			};

			var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtKey));
			var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
			var expireDate = DateTime.UtcNow.AddMinutes(_jwtExpirationMinutes);

			var token = new JwtSecurityToken(
				claims: claims,
				expires: expireDate,
				signingCredentials: creds
			);

			return (new JwtSecurityTokenHandler().WriteToken(token), expireDate);
		}

		public (string, DateTime) GenerateRefreshToken()
		{
			var token = Convert.ToBase64String(RandomNumberGenerator.GetBytes(32));
			var expireDate = DateTime.UtcNow.AddDays(_refreshExpirationDays);
			return (token, expireDate);
		}

		public async Task<bool> StoreRefreshTokenAsync(RefreshToken refreshToken, string prefix,
			CancellationToken cancellationToken = default)
		{
			try
			{
				var token = refreshToken.Token;
				var key = $"{prefix}:{token}";
				var serializedRefreshToken = JsonSerializer.Serialize(refreshToken);

				var options = new DistributedCacheEntryOptions
				{
					AbsoluteExpiration = refreshToken.Expiration
				};

				await cache.SetStringAsync(key, serializedRefreshToken, options, cancellationToken);

				var redisDb = redis.GetDatabase();
				await redisDb.SetAddAsync(refreshToken.UserId, token);
				await redisDb.KeyExpireAsync(refreshToken.UserId, refreshToken.Expiration);

				return true;
			}
			catch (Exception ex)
			{
				logger.LogError(ex, "Failed to store refresh token");
				return false;
			}
		}

		public async Task<RefreshToken?> GetRefreshTokenAsync(string token, string prefix,
			CancellationToken cancellationToken = default)
		{
			try
			{
				var key = $"{prefix}:{token}";
				var serializedRefreshToken = await cache.GetStringAsync(key, cancellationToken);
				if (string.IsNullOrEmpty(serializedRefreshToken)) return null;
				return JsonSerializer.Deserialize<RefreshToken>(serializedRefreshToken);
			}
			catch (Exception ex)
			{
				logger.LogError(ex, "Failed to retrieve refresh token");
				return null;
			}
		}

		public async Task<bool> RevokeRefreshTokenAsync(string token, string prefix,
			CancellationToken cancellationToken = default)
		{
			try
			{
				var refreshToken = await GetRefreshTokenAsync(token, prefix, cancellationToken);
				if (refreshToken is null) return true;

				var key = $"{prefix}:{token}";
				await cache.RemoveAsync(key, cancellationToken);
				var redisDb = redis.GetDatabase();
				await redisDb.SetRemoveAsync(refreshToken.UserId, token);
				return true;
			}
			catch (Exception ex)
			{
				logger.LogError(ex, "Failed to revoke refresh token");
				return false;
			}
		}

		public async Task<bool> RevokeAllUserRefreshTokensAsync(string userId,
			CancellationToken cancellationToken = default)
		{
			try
			{
				var redisDb = redis.GetDatabase();
				var tokens = await redisDb.SetMembersAsync(userId);

				if (tokens.Length == 0) return true;
				var task = tokens.Select(async token =>
					await cache.RemoveAsync(token.ToString(), cancellationToken));

				await Task.WhenAll(task);

				await redisDb.KeyDeleteAsync(userId);
				return true;
			}
			catch (Exception ex)
			{
				logger.LogError(ex, "Failed to revoke all user refresh tokens");
				return false;
			}
		}

		public async Task<bool> IsRefreshTokenValidAsync(string token, string prefix,
			CancellationToken cancellationToken = default)
		{
			var refreshToken = await GetRefreshTokenAsync(token, prefix, cancellationToken);
			return refreshToken is not null && refreshToken.Expiration > DateTime.Now;
		}
	}
}