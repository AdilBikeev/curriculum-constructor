namespace CurriculumConstructor.Domain.Exceptions;

/// <summary>
/// Исключение для ошибок доступа
/// </summary>
public class ForbiddenException : ApiException
{
    public ForbiddenException(string message = "Forbidden") : base(message, 403)
    {
    }
}

