﻿namespace AuthService.Dotnet.Domain.Entities
{
	public class GoogleUserInfo
	{
		public string Id { get; set; } = default!;
		public string Email { get; set; } = default!;
		public string Name { get; set; } = default!;
	}
}