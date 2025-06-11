namespace AuthService.Dotnet.Domain.Entities
{
	public record Error(string Type, string? Description, int RestCode)
	{
		public static readonly Error Empty = new(string.Empty, string.Empty, 0);
	}
}
