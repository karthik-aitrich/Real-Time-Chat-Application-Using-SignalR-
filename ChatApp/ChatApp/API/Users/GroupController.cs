using ChatApp.Controllers;
using Domain.DTOs;
using Domain.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[Authorize]
[ApiController]
[Route("api/v1/group")]
public class GroupController : BaseAPIController<GroupController>
{
    private readonly IGroupService _service;

    public GroupController(IGroupService service)
    {
        _service = service;
    }

    // =========================================
    // CREATE GROUP (OLD – STILL SUPPORTED)
    // =========================================
    [HttpPost("create")]
    public async Task<IActionResult> Create(
        [FromQuery] string name,
        [FromQuery] Guid creatorId
    )
    {
        await _service.CreateGroupAsync(name, creatorId);
        return Ok("Group created");
    }

    [HttpPost("create-with-members")]
    public async Task<IActionResult> CreateWithMembers(
        [FromBody] CreateGroupDto dto
    )
    {
        var userIdClaim = User.FindFirst("userId")?.Value;
        if (string.IsNullOrEmpty(userIdClaim))
            return Unauthorized();

        var creatorId = Guid.Parse(userIdClaim);

        var groupId = await _service.CreateGroupAsync(creatorId, dto);

        return Ok(new { groupId });
    }

    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetUserGroups(Guid userId)
    {
        var groups = await _service.GetUserGroupsAsync(userId);
        return Ok(groups);
    }

    [HttpGet("{groupId}/members")]
    public async Task<IActionResult> GetGroupMembers(Guid groupId)
    {
        var members = await _service.GetGroupMembersAsync(groupId);

        return Ok(members.Select(m => new {
            userId = m.UserId,
            userName = m.UserName,
            role = m.Role
        }));
    }


    [HttpPost("add-member")]
    public async Task<IActionResult> AddMember([FromBody] AddMemberDto dto)
    {
        var adminIdClaim = User.FindFirst("userId")?.Value;
        if (string.IsNullOrEmpty(adminIdClaim))
            return Unauthorized();

        var adminId = Guid.Parse(adminIdClaim);

        await _service.AddMemberAsync(dto.GroupId, dto.UserId, adminId);
        return Ok();
    }


    [HttpPost("remove-member")]
    public async Task<IActionResult> RemoveMember(
        [FromBody] RemoveMemberDto dto
    )
    {
        await _service.RemoveMemberAsync(
            dto.GroupId,
            dto.UserId,
            dto.AdminId
        );

        return Ok();
    }

    // =========================================
    // LEAVE GROUP
    // =========================================
    [HttpPost("leave")]
    public async Task<IActionResult> Leave(
        [FromBody] LeaveGroupDto dto
    )
    {
        await _service.LeaveGroupAsync(
            dto.GroupId,
            dto.UserId
        );

        return Ok();
    }

    // =========================================
    // CHANGE ROLE
    // =========================================
    [HttpPost("change-role")]
    public async Task<IActionResult> ChangeRole(
        [FromBody] ChangeRoleDto dto
    )
    {
        await _service.ChangeRoleAsync(
            dto.GroupId,
            dto.UserId,
            dto.Role
        );

        return Ok();
    }
}
