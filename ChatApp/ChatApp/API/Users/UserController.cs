using System.Security.Claims;
using Domain.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ChatApp.Controllers
{
    [Authorize]
    public class UserController : BaseAPIController<UserController>
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        // GET: api/v1/users
        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _userService.GetAllUsersAsync();
            return Ok(users);
        }


        [Authorize]
        [HttpGet("users/me")]
        public async Task<IActionResult> GetMyProfile()
        {
            var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var user = await _userService.GetMyProfileAsync(userId);

            if (user == null) return NotFound();

            return Ok(user); // ✅ return DTO directly
        }



    }
}
