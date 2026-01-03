using FluentValidation;
using Microsoft.Extensions.DependencyInjection;
using System.Reflection;

namespace CurriculumConstructor.Application;

/// <summary>
/// Регистрация зависимостей слоя Application
/// </summary>
public static class DependencyInjection
{
    /// <summary>
    /// Добавление сервисов Application слоя
    /// </summary>
    /// <param name="services">Коллекция сервисов</param>
    /// <returns>Коллекция сервисов</returns>
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        // Регистрация валидаторов FluentValidation из текущей сборки
        services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());

        // Здесь будет регистрация сервисов приложения, когда они появятся
        // services.AddServices();
        // services.AddMappers();

        return services;
    }
}

