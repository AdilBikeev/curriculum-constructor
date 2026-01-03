namespace CurriculumConstructor.Application.DTOs.Requests;

/// <summary>
/// Запрос на создание стадии
/// </summary>
public sealed record CreateStageRequest
{
    public required string Name { get; init; }
    public string? Description { get; init; }
}

