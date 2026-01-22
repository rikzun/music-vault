using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("test")]
public class TestController(MyDbContext db) : ControllerBase
{

    /// <summary>
    /// Returns current time.
    /// </summary>
    [HttpGet("time")]
    public async Task<IActionResult> Text()
    {
        return Ok(DateTime.Now.ToString());
    }
}