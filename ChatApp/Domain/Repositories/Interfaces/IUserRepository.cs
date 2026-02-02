using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.DTOs;
using Domain.Models;

namespace Domain.Repositories.Interfaces
{
    public interface IUserRepository
    {
        Task<List<User>> GetAllUsersAsync();
        Task<UserProfileDto?> GetUserByIdAsync(Guid userId);
        Task UpdateUserStatusAsync(Guid userId, bool isOnline);

        Task SetUserOfflineAsync(Guid userId);
        Task<User> viewprofile(Guid userId);
        Task<UserProfileDto?> GetMyProfileAsync(Guid userId);
        Task<UserBasicDto?> GetUserBasicAsync(Guid userId);


    }
}
