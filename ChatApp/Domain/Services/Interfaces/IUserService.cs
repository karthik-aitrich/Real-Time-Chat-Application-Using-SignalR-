using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.DTOs;
using Domain.Models;

namespace Domain.Services.Interfaces
{
    public interface IUserService
    {
        Task<List<User>> GetAllUsersAsync();
        Task SetUserOnlineAsync(Guid userId);
        Task SetUserOfflineAsync(Guid userId);
        Task<User> viewprofile(Guid userid);

        Task<UserProfileDto?> GetMyProfileAsync(Guid userId);

        Task<UserBasicDto?> GetUserBasicAsync(Guid userId);

    }
}

