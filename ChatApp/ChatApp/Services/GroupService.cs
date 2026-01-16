using Domain.Models;
using Domain.Repositories.Interfaces;
using Domain.Services.Interfaces;
using Domain.Enums;

namespace ChatApp.Services
{
    public class GroupService : IGroupService
    {
        private readonly IGroupRepository _groupRepo;

        public GroupService(IGroupRepository groupRepo)
        {
            _groupRepo = groupRepo;
        }

        public async Task CreateGroupAsync(string groupName, Guid creatorId)
        {
            var group = new ChatGroup
            {
                GroupId = Guid.NewGuid(),
                GroupName = groupName,
                CreatedBy = creatorId,
                CreatedAt = DateTime.UtcNow
            };

            await _groupRepo.CreateGroupAsync(group);

            var admin = new GroupMember
            {
                GroupMemberId = Guid.NewGuid(),
                GroupId = group.GroupId,
                UserId = creatorId,
                Role = GroupRoleEnum.Admin,
                JoinedAt = DateTime.UtcNow
            };

            await _groupRepo.AddMemberAsync(admin);
        }

        public async Task<List<ChatGroup>> GetUserGroupsAsync(Guid userId)
        {
            return await _groupRepo.GetUserGroupsAsync(userId);
        }
    }
}
