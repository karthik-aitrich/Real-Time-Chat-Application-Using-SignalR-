using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Models;

namespace Domain.Services.Interfaces
{
    public interface IGroupService
    {

        Task CreateGroupAsync(string groupName, Guid creatorId);
        Task<List<ChatGroup>> GetUserGroupsAsync(Guid userId);
    }
}
