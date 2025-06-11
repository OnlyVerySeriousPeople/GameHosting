using AuthService.Dotnet.Application.Common.Models;
using AuthService.Dotnet.Application.Contracts;
using AuthService.Dotnet.Contracts;
using AuthService.Dotnet.Domain.Options;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Options;

namespace AuthService.Dotnet.Application.UseCases.GetGoogleAuthLink
{
	public class GetGoogleAuthLinkHandler(
		IOptions<GoogleAuthOptions> options,
		IGoogleAuthHelperService googleAuthHelper)
		: IQueryHandler<GetGoogleAuthLinkQuery, GetGoogleAuthLinkResult>
	{
		public Task<GetGoogleAuthLinkResult> Handle(GetGoogleAuthLinkQuery query,
			CancellationToken cancellationToken)
		{
			var queryContent = googleAuthHelper.PrepareGoogleAuthLinkContent();

			var url = QueryHelpers.AddQueryString(options.Value.AuthEndpoint, queryContent);

			return Task.FromResult(new GetGoogleAuthLinkResult(url));
		}
	}
}