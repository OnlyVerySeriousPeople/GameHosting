using AuthService.Dotnet.Contracts;

namespace AuthService.Dotnet.Application.Common.Models
{
	public record GetGoogleAuthLinkQuery
		: IQuery<GetGoogleAuthLinkResult>;
}