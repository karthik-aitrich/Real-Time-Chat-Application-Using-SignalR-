using Domain.DTOs;
using Domain.Enums;
using Domain.Models;
using Domain.Repositories.Interfaces;
using Domain.Services.Interfaces;

public class GroupService : IGroupService
{
    private readonly IGroupRepository _repo;

    public GroupService(IGroupRepository repo)
    {
        _repo = repo;
    }

    public async Task CreateGroupAsync(string name, Guid creatorId)
    {
        await _repo.CreateGroupAsync(name, creatorId);
    }

    public async Task<List<ChatGroup>> GetUserGroupsAsync(Guid userId)
    {
        return await _repo.GetUserGroupsAsync(userId);
    }

    public async Task<Guid> CreateGroupAsync(Guid creatorId, CreateGroupDto dto)
    {
        var members = dto.MemberIds
            .Append(creatorId)
            .Distinct()
            .ToList();

        if (members.Count < 3)
            throw new Exception("A group must have at least 3 members");

        var groupId = await _repo.CreateGroupAsync(dto.Name, creatorId);

        foreach (var userId in members)
        {
            if (userId == creatorId) continue;
            await _repo.AddMemberAsync(groupId, userId, GroupRoleEnum.Member);
        }

        return groupId;
    }


    public async Task AddMemberAsync(Guid groupId, Guid userId)
    {
        await _repo.AddMemberAsync(groupId, userId, GroupRoleEnum.Member);
    }

    public async Task RemoveMemberAsync(Guid groupId, Guid userId, Guid adminId)
    {
        await _repo.RemoveMemberAsync(groupId, userId, adminId);
    }

    public async Task LeaveGroupAsync(Guid groupId, Guid userId)
    {
        await _repo.LeaveGroupAsync(groupId, userId);
    }

    public async Task ChangeRoleAsync(Guid groupId, Guid userId, int role)
    {
        await _repo.ChangeRoleAsync(groupId, userId, (GroupRoleEnum)role);
    }

    public async Task<List<GroupMemberDto>> GetGroupMembersAsync(Guid groupId)
    {
        return await _repo.GetGroupMembersAsync(groupId);
    }


}
