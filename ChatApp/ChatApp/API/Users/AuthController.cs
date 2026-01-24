using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using ChatApp.Data;
using ChatApp.Services;
using Domain.DTOs;
using Domain.Models;
using Domain.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ChatApp.Controllers
{
    public class AuthController : BaseAPIController<AuthController>
    {
        private readonly ChatDbContext _context;
        private readonly JwtService _jwtService;
        private readonly IUserService _userService;

        public AuthController(ChatDbContext context, JwtService jwtService, IUserService userService)
        {
            _context = context;
            _jwtService = jwtService;
            _userService = userService;
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

        [Authorize]
        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            await _userService.SetUserOfflineAsync(userId);

            return Ok(new { message = "Logged out successfully" });
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

        [Authorize]
        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword(ChangePasswordDto dto)
        {
            var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                return Unauthorized();

            var currentHash = HashPassword(dto.CurrentPassword);

            if (user.PasswordHash != currentHash)
                return BadRequest("Current password is incorrect");

            user.PasswordHash = HashPassword(dto.NewPassword);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Password changed successfully" });
        }


        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword(ForgotPasswordDto dto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);

            if (user == null)
                return Ok(); // security: don't reveal user existence

            var token = Convert.ToBase64String(RandomNumberGenerator.GetBytes(32));

            user.ResetToken = token;
            user.ResetTokenExpiry = DateTime.UtcNow.AddMinutes(15);

            await _context.SaveChangesAsync();

            // TODO: send email (for now log it)
            Console.WriteLine($"RESET TOKEN: {token}");

            return Ok(new { message = "Password reset link sent" });
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword(ResetPasswordDto dto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u =>
                u.ResetToken == dto.Token &&
                u.ResetTokenExpiry > DateTime.UtcNow
            );

            if (user == null)
                return BadRequest("Invalid or expired token");

            user.PasswordHash = HashPassword(dto.NewPassword);
            user.ResetToken = null;
            user.ResetTokenExpiry = null;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Password reset successful" });
        }



        private string HashPassword(string password)
        {
            using var sha = SHA256.Create();
            var bytes = sha.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(bytes);
        }
    }
}
