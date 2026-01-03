namespace CurriculumConstructor.Application.DTOs.Requests;

/// <summary>
/// Запрос на создание стадии
/// </summary>
public class CreateStageRequest
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
}

