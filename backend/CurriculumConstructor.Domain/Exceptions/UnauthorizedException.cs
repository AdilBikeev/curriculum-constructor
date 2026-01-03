namespace CurriculumConstructor.Domain.Exceptions;

/// <summary>
/// Исключение для ошибок авторизации
/// </summary>
public class UnauthorizedException : ApiException
{
    public UnauthorizedException(string message = "Unauthorized") : base(message, 401)
    {
    }
}

