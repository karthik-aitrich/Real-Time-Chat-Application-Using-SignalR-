using System.Security.Cryptography;
using System.Text;
using ChatApp.Data;
using ChatApp.Services;
using Domain.DTOs;
using Domain.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ChatApp.Controllers
{
    public class AuthController : BaseAPIController<AuthController>
    {
        private readonly ChatDbContext _context;
        private readonly JwtService _jwtService;

        public AuthController(ChatDbContext context, JwtService jwtService)
        {
            _context = context;
            _jwtService = jwtService;
        }

        // POST: api/v1/auth/register
        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto dto)
        {
            var exists = await _context.Users.AnyAsync(u => u.Email == dto.Email);
            if (exists)
                return BadRequest("Email already exists");

            var user = new User
            {
                UserId = Guid.NewGuid(),
                UserName = dto.UserName,
                Email = dto.Email,
                PasswordHash = HashPassword(dto.Password),
                IsOnline = false,
                LastSeen = DateTime.Now
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            //return Ok("Registration successful");
            return Ok(new { message = "Registration successful" });

        }

        // POST: api/v1/auth/login
        [HttpPost("login")]

        public async Task<IActionResult> Login(LoginDto dto)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == dto.Email);

            if (user == null)
                return Unauthorized("Invalid email");

            if (user.PasswordHash != HashPassword(dto.Password))
                return Unauthorized("Invalid password");

            user.IsOnline = true;
            user.LastSeen = DateTime.Now;
            await _context.SaveChangesAsync();

            var token = _jwtService.GenerateToken(user);

            return Ok(new
            {
                token,
                user.UserId,
                user.UserName,
                user.Email
            });
        }


        private string HashPassword(string password)
        {
            using var sha = SHA256.Create();
            var bytes = sha.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(bytes);
        }
    }
}
