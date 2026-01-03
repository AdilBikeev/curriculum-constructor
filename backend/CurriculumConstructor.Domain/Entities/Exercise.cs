namespace CurriculumConstructor.Domain.Entities;

/// <summary>
/// Упражнение
/// </summary>
public class Exercise
{
    public string Id { get; set; } = string.Empty;
    public string StageId { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public int Duration { get; set; } // в минутах
    public string? Description { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

