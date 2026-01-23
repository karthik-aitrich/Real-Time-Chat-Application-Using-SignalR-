using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.DTOs;
using Domain.Enums;
using Domain.Models;

namespace Domain.Repositories.Interfaces
{
    public interface IGroupRepository
    {
        Task<Guid> CreateGroupAsync(string name, Guid creatorId);


        Task<List<ChatGroup>> GetUserGroupsAsync(Guid userId);
        Task AddMemberAsync(Guid groupId, Guid userId, GroupRoleEnum role);
        Task RemoveMemberAsync(Guid groupId, Guid userId, Guid adminId);
        Task LeaveGroupAsync(Guid groupId, Guid userId);
        Task ChangeRoleAsync(Guid groupId, Guid userId, GroupRoleEnum role);
        Task<List<GroupMemberDto>> GetGroupMembersAsync(Guid groupId);


    }


}

