using ChatApp.Repositories;
using Domain.DTOs;
using Domain.Models;
using Domain.Repositories.Interfaces;
using Domain.Services.Interfaces;

namespace ChatApp.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepo;

        public UserService(IUserRepository userRepo)
        {
            _userRepo = userRepo;
        }
        public async Task UpdateLastSeenAsync(Guid userId)
        {
            await _userRepo.UpdateLastSeenAsync(userId);
        }


        public async Task<List<Guid>> GetOnlineUserIdsAsync()
        {
            var cutoff = DateTime.UtcNow.AddSeconds(-30); // 30s window

            var users = await _userRepo.GetUsersLastSeenAfterAsync(cutoff);

            return users.Select(u => u.UserId).ToList();
        }


        public async Task<UserBasicDto?> GetUserBasicAsync(Guid userId)
        {
            return await _userRepo.GetUserBasicAsync(userId);
        }
        public async Task<List<User>> GetAllUsersAsync()
        {
            return await _userRepo.GetAllUsersAsync();
        }
        public async Task<UserProfileDto?> GetMyProfileAsync(Guid userId)
        {
            return await _userRepo.GetMyProfileAsync(userId);
        }

        public async Task SetUserOnlineAsync(Guid userId)
        {
            await _userRepo.UpdateUserStatusAsync(userId, true);
        }

        public async Task SetUserOfflineAsync(Guid userId)
        {
            await _userRepo.UpdateUserStatusAsync(userId, false);
        }
        public async Task<User> viewprofile(Guid userId)
        { 
           return await _userRepo.viewprofile(userId);
        }
    }
}
