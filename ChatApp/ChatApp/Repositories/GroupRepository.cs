using System;
using ChatApp.Data;
using Domain.DTOs;
using Domain.Enums;
using Domain.Models;
using Domain.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ChatApp.Repositories
{
    public class GroupRepository : IGroupRepository
    {
        private readonly ChatDbContext _db;

        public GroupRepository(ChatDbContext db)
        {
            _db = db;
        }

        public async Task<Guid> CreateGroupAsync(string name, Guid creatorId)
        {
            var group = new ChatGroup
            {
                GroupId = Guid.NewGuid(),
                GroupName = name,
                CreatedBy = creatorId,
                CreatedAt = DateTime.UtcNow
            };

            _db.ChatGroups.Add(group);

            _db.GroupMembers.Add(new GroupMember
            {
                GroupMemberId = Guid.NewGuid(),
                GroupId = group.GroupId,
                UserId = creatorId,
                Role = GroupRoleEnum.Admin,
                JoinedAt = DateTime.UtcNow
            });

            await _db.SaveChangesAsync();
            return group.GroupId; // 🔥 IMPORTANT
        }


        public async Task<List<ChatGroup>> GetUserGroupsAsync(Guid userId)
        {
            return await _db.GroupMembers
                .Where(m => m.UserId == userId)
                .Join(_db.ChatGroups,
                      m => m.GroupId,
                      g => g.GroupId,
                      (m, g) => g)
                .ToListAsync();
        }

        public async Task AddMemberAsync(Guid groupId, Guid userId, GroupRoleEnum role)
        {
            if (await _db.GroupMembers.AnyAsync(m => m.GroupId == groupId && m.UserId == userId))
                throw new Exception("User already in group");

            _db.GroupMembers.Add(new GroupMember
            {
                GroupMemberId = Guid.NewGuid(),
                GroupId = groupId,
                UserId = userId,
                Role = role,
                JoinedAt = DateTime.UtcNow
            });

            await _db.SaveChangesAsync();
        }

        public async Task RemoveMemberAsync(Guid groupId, Guid userId, Guid adminId)
        {
            var admin = await _db.GroupMembers
                .FirstOrDefaultAsync(m => m.GroupId == groupId
                                       && m.UserId == adminId
                                       && m.Role == GroupRoleEnum.Admin);

            if (admin == null)
                throw new Exception("Only admins can remove members");

            var adminCount = await _db.GroupMembers
                .CountAsync(m => m.GroupId == groupId && m.Role == GroupRoleEnum.Admin);

            var member = await _db.GroupMembers
                .FirstOrDefaultAsync(m => m.GroupId == groupId && m.UserId == userId);

            if (member == null) return;

            if (member.Role == GroupRoleEnum.Admin && adminCount == 1)
                throw new Exception("Cannot remove last admin");

            _db.GroupMembers.Remove(member);
            await _db.SaveChangesAsync();
        }


        public async Task LeaveGroupAsync(Guid groupId, Guid userId)
        {
            var member = await _db.GroupMembers
                .FirstOrDefaultAsync(m => m.GroupId == groupId && m.UserId == userId);

            if (member == null) return;

            var adminCount = await _db.GroupMembers
                .CountAsync(m => m.GroupId == groupId && m.Role == GroupRoleEnum.Admin);

            if (member.Role == GroupRoleEnum.Admin && adminCount == 1)
                throw new Exception("Assign another admin first");

            _db.GroupMembers.Remove(member);
            await _db.SaveChangesAsync();
        }

        public async Task ChangeRoleAsync(Guid groupId, Guid userId, GroupRoleEnum role)
        {
            var member = await _db.GroupMembers
                .FirstOrDefaultAsync(m => m.GroupId == groupId && m.UserId == userId);

            if (member == null) return;

            member.Role = role;
            await _db.SaveChangesAsync();
        }

        public async Task<List<GroupMemberDto>> GetGroupMembersAsync(Guid groupId)
        {
            return await _db.GroupMembers
                .Where(gm => gm.GroupId == groupId)
                .Join(_db.Users,
                      gm => gm.UserId,
                      u => u.UserId,
                      (gm, u) => new GroupMemberDto
                      {
                          UserId = gm.UserId,
                          UserName = u.UserName,
                          Role = gm.Role,
                          JoinedAt = gm.JoinedAt
                      })
                .ToListAsync();
        }





    }
}


