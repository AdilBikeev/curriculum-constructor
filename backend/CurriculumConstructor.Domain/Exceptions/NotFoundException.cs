namespace CurriculumConstructor.Domain.Exceptions;

/// <summary>
/// Исключение для ошибок "Не найдено"
/// </summary>
public class NotFoundException : ApiException
{
    public NotFoundException(string message) : base(message, 404)
    {
    }
}

