using ChatApp.Controllers;
using ChatApp.Services;
using Domain.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

public class GroupChatController : BaseAPIController<GroupChatController>
{
    private readonly IGroupChatService _service;

    public GroupChatController(IGroupChatService service)
    {
        _service = service;
    }

    [HttpGet("group/{groupId}")]
    public async Task<IActionResult> GetGroupMessages(Guid groupId)
    {
        return Ok(await _service.GetGroupMessagesAsync(groupId));
    }

    [HttpPost("group/add-member")]
    public async Task<IActionResult> AddMember(Guid groupId, Guid userId, int role)
    {
        await _service.AddMemberAsync(groupId, userId, role);
        return Ok();
    }

}

