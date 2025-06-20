﻿using System.Net.Http.Json;
using System.Text.Json;
using AuthService.Dotnet.Application.Contracts;
using AuthService.Dotnet.Domain.Entities;
using AuthService.Dotnet.Domain.Exceptions;
using AuthService.Dotnet.Domain.Options;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;

namespace AuthService.Dotnet.Infrastructure.Helpers
{
	public class GoogleAuthHelperService : IGoogleAuthHelperService
	{
		private readonly HttpClient _httpClient;
		private readonly GoogleAuthOptions _options;
		private readonly string _redirectUri;

		public GoogleAuthHelperService(HttpClient httpClient,
			IOptions<GoogleAuthOptions> options,
			IConfiguration config)
		{
			_httpClient = httpClient;
			_options = options.Value ?? throw new ArgumentNullException(nameof(options));

			var redirectUrl = config["Gateway:Url"];
			if (string.IsNullOrEmpty(redirectUrl))
				throw new InvalidOperationException("Missing configuration for Gateway:Url.");

			_redirectUri = $"{redirectUrl}/api/login";
		}

		public async Task<Result<GoogleTokens>> RetrieveGoogleTokensAsync(string code, CancellationToken cancellationToken)
		{
			var requestContent = PrepareRetrieveTokenRequestContent(code);
			return await MakeRequestForGoogleTokensAsync(_options.TokenEndpoint, requestContent, cancellationToken);
		}

		public async Task<Result<GoogleTokens>> RefreshGoogleTokensAsync(string refreshToken,
			CancellationToken cancellationToken)
		{
			var requestContent = PrepareRefreshTokenRequestContent(refreshToken);
			return await MakeRequestForGoogleTokensAsync(_options.RefreshEndpoint, requestContent, cancellationToken);
		}

		public async Task<Result<GoogleUserInfo>> GetGoogleUserInfoAsync(string token,
			CancellationToken cancellationToken)
		{
			var queryContent = new Dictionary<string, string?> { { "access_token", token } };
			var uri = QueryHelpers.AddQueryString(_options.UserInfoEndpoint, queryContent);

			var response = await _httpClient.GetAsync(uri, cancellationToken);

			if (!response.IsSuccessStatusCode)
				return Result<GoogleUserInfo>.Failure(HttpRequestErrors.SendingFailed(
					response.StatusCode,
					await response.Content.ReadAsStringAsync(cancellationToken)));


			// TODO: set JsonProperty in model
			var jsonOptions = new JsonSerializerOptions
			{
				PropertyNamingPolicy = JsonNamingPolicy.CamelCase
			};

			var responseContent =
				await response.Content.ReadFromJsonAsync<GoogleUserInfo>(jsonOptions, cancellationToken);
			if (responseContent is null)
				return Result<GoogleUserInfo>.Failure(OperationErrors.ParsingFailed("google user profile info response"));

			return Result<GoogleUserInfo>.Success(responseContent);
		}

		public Dictionary<string, string?> PrepareGoogleAuthLinkContent() =>
			new Dictionary<string, string?>
			{
				{ "client_id", _options.ClientId },
				{ "redirect_uri", _redirectUri },
				{ "response_type", "code" },
				{ "scope", "email profile" },
				{ "access_type", "offline" },
				{ "prompt", "consent" }
			};


		private FormUrlEncodedContent PrepareRefreshTokenRequestContent(string token)
		{
			var content = new Dictionary<string, string>
			{
				{ "client_id", _options.ClientId },
				{ "client_secret", _options.ClientSecret },
				{ "grant_type", "refresh_token" },
				{ "refresh_token", token }
			};

			return new FormUrlEncodedContent(content);
		}

		private FormUrlEncodedContent PrepareRetrieveTokenRequestContent(string code)
		{
			var tokenRequest = new Dictionary<string, string>
			{
				{ "client_id", _options.ClientId },
				{ "client_secret", _options.ClientSecret },
				{ "code", code },
				{ "grant_type", "authorization_code" },
				{ "redirect_uri", _redirectUri! }
			};

			return new FormUrlEncodedContent(tokenRequest);
		}

		private async Task<Result<GoogleTokens>> MakeRequestForGoogleTokensAsync(string uri,
			FormUrlEncodedContent content, CancellationToken cancellationToken)
		{
			var response = await _httpClient.PostAsync(uri, content, cancellationToken);
			if (!response.IsSuccessStatusCode)
				return Result<GoogleTokens>.Failure(HttpRequestErrors.SendingFailed(
					response.StatusCode,
					await response.Content.ReadAsStringAsync(cancellationToken)));

			var responseContent = await response.Content.ReadFromJsonAsync<GoogleTokens>(cancellationToken);
			if (responseContent is null)
				return Result<GoogleTokens>.Failure(OperationErrors.ParsingFailed("google tokens response"));

			return Result<GoogleTokens>.Success(responseContent);
		}
	}
}