using CurriculumConstructor.Api.Middleware;

namespace CurriculumConstructor.Api.Extensions;

/// <summary>
/// Расширения для настройки приложения
/// </summary>
public static class ApplicationBuilderExtensions
{
    /// <summary>
    /// Использование глобальной обработки исключений
    /// </summary>
    public static IApplicationBuilder UseExceptionHandling(this IApplicationBuilder app)
    {
        app.UseMiddleware<ExceptionHandlingMiddleware>();
        return app;
    }
}

