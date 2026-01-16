using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Models;

namespace Domain.Repositories.Interfaces
{
    public interface IGroupRepository
    {
        Task CreateGroupAsync(ChatGroup group);
        Task AddMemberAsync(GroupMember member);
        Task<List<ChatGroup>> GetUserGroupsAsync(Guid userId);
    }
}

