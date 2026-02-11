using ChatApp.Data;
using Domain.DTOs;
using Domain.Models;
using Domain.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ChatApp.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly ChatDbContext _context;

        public UserRepository(ChatDbContext context)
        {
            _context = context;
        }

        public async Task<List<User>> GetAllUsersAsync()
        {
            return await _context.Users
                .Select(u => new User
                {
                    UserId = u.UserId,
                    UserName = u.UserName,
                    Email = u.Email,
                    IsOnline = u.IsOnline,
                    LastSeen = u.LastSeen,
                    ProfilePhoto = u.ProfilePhoto   // ✅ ADD THIS
                })
                .ToListAsync();
        }

        public async Task<UserBasicDto?> GetUserBasicAsync(Guid userId)
        {
            return await _context.Users
                .Where(u => u.UserId == userId)
                .Select(u => new UserBasicDto
                {
                    UserId = u.UserId,
                    UserName = u.UserName
                })
                .AsNoTracking()
                .FirstOrDefaultAsync();
        }

        public async Task UpdateLastSeenAsync(Guid userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return;

            user.LastSeen = DateTime.UtcNow;
            user.IsOnline = true;

            await _context.SaveChangesAsync();
        }

        public async Task<List<User>> GetUsersLastSeenAfterAsync(DateTime time)
        {
            return await _context.Users
                .Where(u => u.LastSeen >= time)
                .Select(u => new User { UserId = u.UserId })
                .ToListAsync();
        }


        public async Task<UserProfileDto?> GetUserByIdAsync(Guid id)
        {
            return await _context.Users
                .Where(u => u.UserId == id)
                .Select(u => new UserProfileDto
                {
                    UserId = u.UserId,
                    UserName = u.UserName,
                    Email = u.Email,
                    ProfilePhoto = u.ProfilePhoto
                })
                .FirstOrDefaultAsync();
        }


        public async Task UpdateUserStatusAsync(Guid userId, bool isOnline)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserId == userId);

            if (user != null)
            {
                user.IsOnline = isOnline;
                user.LastSeen = DateTime.UtcNow;
                await _context.SaveChangesAsync();
            }
        }

        public async Task<UserProfileDto?> GetMyProfileAsync(Guid userId)
        {
            return await _context.Users
                .Where(u => u.UserId == userId)
                .Select(u => new UserProfileDto
                {
                    UserId = u.UserId,          // ✅ ADD THIS
                    UserName = u.UserName,
                    Email = u.Email,
                    ProfilePhoto = string.IsNullOrWhiteSpace(u.ProfilePhoto)
    ? null
    : u.ProfilePhoto

                })
                .FirstOrDefaultAsync();
        }


        public async Task SetUserOfflineAsync(Guid userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user != null)
            {
                user.IsOnline = false;
                user.LastSeen = DateTime.UtcNow;
                await _context.SaveChangesAsync();
            }
        }
        public async Task<User> viewprofile (Guid userId)
        {
            try
            {
               var user= await _context.Users.Where(e => e.UserId == userId).FirstOrDefaultAsync();
                return user;
            }
            catch (Exception ex)
            {
                throw;
            }

        }


	}
}
