using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.DTOs;
using Domain.Enums;
using Domain.Models;

namespace Domain.Services.Interfaces
{
    public interface IGroupService
    {
        Task CreateGroupAsync(string name, Guid creatorId);
        Task<List<ChatGroup>> GetUserGroupsAsync(Guid userId);
        Task AddMemberAsync(Guid groupId, Guid userId);
        Task RemoveMemberAsync(Guid groupId, Guid userId, Guid adminId);

        Task<Guid> CreateGroupAsync(Guid creatorId, CreateGroupDto dto);

        Task LeaveGroupAsync(Guid groupId, Guid userId);
        Task ChangeRoleAsync(Guid groupId, Guid userId, int role);
        Task<List<GroupMemberDto>> GetGroupMembersAsync(Guid groupId);
    }

}
