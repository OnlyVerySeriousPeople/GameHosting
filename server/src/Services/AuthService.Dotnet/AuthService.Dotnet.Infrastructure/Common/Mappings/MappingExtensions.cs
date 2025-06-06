using AuthService.Dotnet.Domain.Entities;
using AuthService.Dotnet.Infrastructure.Models;

namespace AuthService.Dotnet.Infrastructure.Common.Mappings
{
	public static class MappingExtensions
	{
		public static UserIdentity ToIdentity(this User user) => new UserIdentity
		{
			Id = user.Id,
			PlayerId = user.PlayerId,
			UserName = user.Username,
			Email = user.Email,
			CreatedAt = user.CreatedAt
		};

		public static User ToDomain(this UserIdentity userIdentity) => new User
		{
			Id = userIdentity.Id,
			PlayerId = userIdentity.PlayerId,
			Username = userIdentity.UserName!,
			Email = userIdentity.Email!,
			CreatedAt = userIdentity.CreatedAt
		};
	}
}