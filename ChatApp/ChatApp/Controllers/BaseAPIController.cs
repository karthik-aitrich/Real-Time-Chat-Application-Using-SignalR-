using Microsoft.AspNetCore.Mvc;

namespace ChatApp.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class BaseAPIController<T> : ControllerBase
    {
    }
}
