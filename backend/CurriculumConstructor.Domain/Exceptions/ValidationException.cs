using System.Collections.Generic;
using System.Linq;

namespace CurriculumConstructor.Domain.Exceptions;

/// <summary>
/// Исключение для ошибок валидации
/// </summary>
public class ValidationException : ApiException
{
    public IReadOnlyDictionary<string, IReadOnlyCollection<string>>? Errors { get; }

    public ValidationException(string message, IReadOnlyDictionary<string, IReadOnlyCollection<string>>? errors = null) 
        : base(message, 400)
    {
        Errors = errors;
    }

    /// <summary>
    /// Создает ValidationException из Dictionary (для совместимости с FluentValidation)
    /// </summary>
    public ValidationException(string message, Dictionary<string, string[]>? errors = null) 
        : base(message, 400)
    {
        Errors = errors?.ToDictionary(
            kvp => kvp.Key,
            kvp => (IReadOnlyCollection<string>)kvp.Value.ToArray()
        );
    }
}

