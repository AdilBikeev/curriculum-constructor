using CurriculumConstructor.Application.Common;
using CurriculumConstructor.Application.DTOs.Requests;
using CurriculumConstructor.Application.DTOs.Responses;
using CurriculumConstructor.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace CurriculumConstructor.Api.Controllers;

/// <summary>
/// Контроллер для работы со стадиями уроков
/// </summary>
[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/stages")]
public class StagesController : ControllerBase
{
    private readonly ILessonStageService _stageService;
    private readonly ILogger<StagesController> _logger;

    public StagesController(ILessonStageService stageService, ILogger<StagesController> logger)
    {
        _stageService = stageService;
        _logger = logger;
    }

    /// <summary>
    /// Получить все стадии
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<StageDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll()
    {
        var stages = await _stageService.GetAllAsync();
        return Ok(ApiResponse<IEnumerable<StageDto>>.SuccessResponse(stages));
    }

    /// <summary>
    /// Получить стадию по идентификатору
    /// </summary>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(ApiResponse<StageDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(string id)
    {
        var stage = await _stageService.GetByIdAsync(id);
        if (stage == null)
        {
            return NotFound(ApiResponse<object>.ErrorResponse($"Stage with id {id} not found"));
        }

        return Ok(ApiResponse<StageDto>.SuccessResponse(stage));
    }

    /// <summary>
    /// Создать новую стадию
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(ApiResponse<StageDto>), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create([FromBody] CreateStageRequest request)
    {
        var stage = await _stageService.CreateAsync(request);
        return CreatedAtAction(nameof(GetById), new { id = stage.Id }, 
            ApiResponse<StageDto>.SuccessResponse(stage));
    }

    /// <summary>
    /// Удалить стадию
    /// </summary>
    [HttpDelete("{id}")]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(string id)
    {
        var deleted = await _stageService.DeleteAsync(id);
        if (!deleted)
        {
            return NotFound(ApiResponse<object>.ErrorResponse($"Stage with id {id} not found"));
        }

        return Ok(ApiResponse.SuccessResponse("Stage deleted successfully"));
    }
}

