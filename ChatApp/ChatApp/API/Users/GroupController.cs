using ChatApp.Controllers;
using Domain.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

[Authorize]
public class GroupController : BaseAPIController<GroupController>
{
    private readonly IGroupService _groupService;

    public GroupController(IGroupService groupService)
    {
        _groupService = groupService;
    }

    [HttpPost("groups/create")]
    public async Task<IActionResult> CreateGroup(string groupName, Guid creatorId)
    {
        await _groupService.CreateGroupAsync(groupName, creatorId);
        return Ok("Group created");
    }

    [HttpGet("groups/{userId}")]
    public async Task<IActionResult> GetUserGroups(Guid userId)
    {
        var groups = await _groupService.GetUserGroupsAsync(userId);
        return Ok(groups);
    }
}
