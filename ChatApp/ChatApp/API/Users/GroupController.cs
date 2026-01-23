using ChatApp.Controllers;
using Domain.DTOs;
using Domain.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
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

    [HttpPost("create")]
    public async Task<IActionResult> Create(string name, Guid creatorId)
    {
        await _service.CreateGroupAsync(name, creatorId);
        return Ok("Group created");
    }


    [HttpPost("create-with-members")]
    public async Task<IActionResult> CreateWithMembers([FromBody] CreateGroupDto dto)
    {
        var userIdClaim = User.FindFirst("userId")?.Value;
        if (userIdClaim == null)
            return Unauthorized();

        var creatorId = Guid.Parse(userIdClaim);

        var groupId = await _service.CreateGroupAsync(creatorId, dto);

        return Ok(new { groupId });
    }


    [HttpGet("{userId}")]
    public async Task<IActionResult> Get(Guid userId)
    {
        return Ok(await _service.GetUserGroupsAsync(userId));
    }

    [HttpGet("{groupId}/members")]
    public async Task<IActionResult> GetMembers(Guid groupId)
    {
        return Ok(await _service.GetGroupMembersAsync(groupId));
    }

    [HttpPost("add-member")]
    public async Task<IActionResult> AddMember(Guid groupId, Guid userId)
    {
        await _service.AddMemberAsync(groupId, userId);
        return Ok();
    }

    [HttpPost("remove-member")]
    public async Task<IActionResult> RemoveMember(Guid groupId, Guid userId, Guid adminId)
    {
        await _service.RemoveMemberAsync(groupId, userId, adminId);
        return Ok();
    }

    [HttpPost("leave")]
    public async Task<IActionResult> Leave(Guid groupId, Guid userId)
    {
        await _service.LeaveGroupAsync(groupId, userId);
        return Ok();
    }

    [HttpPost("change-role")]
    public async Task<IActionResult> ChangeRole([FromBody] ChangeRoleDto dto)
    {
        await _service.ChangeRoleAsync(dto.GroupId, dto.UserId, dto.Role);
        return Ok();
    }

}
