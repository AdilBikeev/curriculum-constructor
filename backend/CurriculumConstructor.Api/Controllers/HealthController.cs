using Microsoft.AspNetCore.Mvc;
using CurriculumConstructor.Application.Common;

namespace CurriculumConstructor.Api.Controllers;

/// <summary>
/// Контроллер для проверки работоспособности API
/// </summary>
[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/health")]
public class HealthController : ControllerBase
{
    private readonly ILogger<HealthController> _logger;

    public HealthController(ILogger<HealthController> logger)
    {
        _logger = logger;
    }

    /// <summary>
    /// Проверка работоспособности API
    /// </summary>
    /// <returns>Статус API</returns>
    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    public IActionResult Get()
    {
        _logger.LogInformation("Health check requested");
        
        return Ok(ApiResponse<object>.SuccessResponse(new
        {
            Status = "Healthy",
            Timestamp = DateTime.UtcNow,
            Version = "1.0"
        }, "API is running"));
    }
}

