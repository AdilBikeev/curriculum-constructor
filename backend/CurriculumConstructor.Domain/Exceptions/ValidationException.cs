namespace CurriculumConstructor.Domain.Exceptions;

/// <summary>
/// Исключение для ошибок валидации
/// </summary>
public class ValidationException : ApiException
{
    public Dictionary<string, string[]>? Errors { get; }

    public ValidationException(string message, Dictionary<string, string[]>? errors = null) 
        : base(message, 400)
    {
        Errors = errors;
    }
}

