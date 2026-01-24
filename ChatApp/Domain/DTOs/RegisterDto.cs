using Microsoft.AspNetCore.Http;

namespace Domain.DTOs
{
    public class RegisterDto
    {
        public string UserName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
		public IFormFile? ProfilePhoto { get; set; } = null!;
	}
}
