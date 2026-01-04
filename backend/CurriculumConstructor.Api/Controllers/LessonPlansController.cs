using CurriculumConstructor.Application.Common;
using CurriculumConstructor.Application.DTOs.Requests;
using CurriculumConstructor.Application.DTOs.Responses;
using CurriculumConstructor.Application.Services;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;

namespace CurriculumConstructor.Api.Controllers;

/// <summary>
/// Контроллер для работы с планами занятий
/// </summary>
[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/lesson-plans")]
public class LessonPlansController : ControllerBase
{
    private readonly ILessonPlanService _planService;
    private readonly ILogger<LessonPlansController> _logger;

    public LessonPlansController(ILessonPlanService planService, ILogger<LessonPlansController> logger)
    {
        _planService = planService;
        _logger = logger;
    }

    /// <summary>
    /// Получить все планы занятий
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<LessonPlanDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll()
    {
        var plans = await _planService.GetAllAsync();
        return Ok(ApiResponse<IEnumerable<LessonPlanDto>>.SuccessResponse(plans));
    }

    /// <summary>
    /// Получить план занятия по идентификатору
    /// </summary>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(ApiResponse<LessonPlanDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(string id)
    {
        var plan = await _planService.GetByIdAsync(id);
        if (plan == null)
        {
            return NotFound(ApiResponse<object>.ErrorResponse($"Plan with id {id} not found"));
        }

        return Ok(ApiResponse<LessonPlanDto>.SuccessResponse(plan));
    }

    /// <summary>
    /// Проверить существование плана с указанным названием
    /// </summary>
    [HttpGet("check-title")]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    public async Task<IActionResult> CheckTitle([FromQuery] string title, [FromQuery] string? excludeId = null)
    {
        if (string.IsNullOrWhiteSpace(title))
        {
            return BadRequest(ApiResponse<object>.ErrorResponse("Title is required"));
        }

        var exists = await _planService.ExistsByTitleAsync(title, excludeId);
        return Ok(ApiResponse<object>.SuccessResponse(new { exists }));
    }

    /// <summary>
    /// Создать новый план занятия
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(ApiResponse<LessonPlanDto>), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create([FromBody] CreateLessonPlanRequest request)
    {
        var plan = await _planService.CreateAsync(request);
        return CreatedAtAction(nameof(GetById), new { id = plan.Id }, 
            ApiResponse<LessonPlanDto>.SuccessResponse(plan));
    }

    /// <summary>
    /// Обновить план занятия (только для Development среды)
    /// </summary>
    [HttpPut("{id}")]
    [ProducesResponseType(typeof(ApiResponse<LessonPlanDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> Update(string id, [FromBody] UpdateLessonPlanRequest request, [FromServices] IWebHostEnvironment environment)
    {
        // Проверка среды - только для Development
        if (!environment.IsDevelopment())
        {
            return StatusCode(StatusCodes.Status403Forbidden, 
                ApiResponse<object>.ErrorResponse("Update is only available in Development environment"));
        }

        try
        {
            var plan = await _planService.UpdateAsync(id, request);
            return Ok(ApiResponse<LessonPlanDto>.SuccessResponse(plan));
        }
        catch (Domain.Exceptions.NotFoundException ex)
        {
            return NotFound(ApiResponse<object>.ErrorResponse(ex.Message));
        }
        catch (Domain.Exceptions.ValidationException ex)
        {
            return BadRequest(ApiResponse<object>.ErrorResponse(ex.Message));
        }
    }

    /// <summary>
    /// Удалить план занятия
    /// </summary>
    [HttpDelete("{id}")]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(string id)
    {
        var deleted = await _planService.DeleteAsync(id);
        if (!deleted)
        {
            return NotFound(ApiResponse<object>.ErrorResponse($"Plan with id {id} not found"));
        }

        return Ok(ApiResponse.SuccessResponse("Plan deleted successfully"));
    }
}

