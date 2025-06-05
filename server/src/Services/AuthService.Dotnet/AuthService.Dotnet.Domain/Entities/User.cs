namespace AuthService.Dotnet.Domain.Entities
{
	public class User
	{
		public int Id { get; set; } = default!;
		public string Username { get; set; } = default!;
		public string Email { get; set; } = default!;
		public DateTime CreatedAt { get; set; } = default!;
	}
}
