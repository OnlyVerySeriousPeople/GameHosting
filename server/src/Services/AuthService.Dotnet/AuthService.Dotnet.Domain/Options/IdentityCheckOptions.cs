namespace AuthService.Dotnet.Domain.Options
{
	public class IdentityCheckOptions
	{
		public bool RequireDigit { get; set; } = true;
		public int RequiredLength { get; set; } = 8;
		public bool RequireLowercase { get; set; } = false;
		public bool RequireUppercase { get; set; } = false;
		public bool RequireNonAlphanumeric { get; set; } = false;
		public int RequireUniqueChars { get; set; } = 1;
		public bool RequireUniqueEmail { get; set; } = true;
		public int MaxFailedAccessAttempts { get; set; } = 10;
		public int DefaultLockout { get; set; } = 5;
	}
}