using System.Data;
using CurriculumConstructor.Infrastructure.Database;
using Microsoft.Data.Sqlite;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace CurriculumConstructor.Infrastructure;

/// <summary>
/// Регистрация зависимостей слоя Infrastructure
/// </summary>
public static class DependencyInjection
{
    /// <summary>
    /// Добавление сервисов Infrastructure слоя
    /// </summary>
    /// <param name="services">Коллекция сервисов</param>
    /// <param name="configuration">Конфигурация</param>
    /// <returns>Коллекция сервисов</returns>
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDatabase(configuration);
        services.AddDatabaseInitializer();
        services.AddRepositories();

        return services;
    }

    /// <summary>
    /// Регистрация репозиториев
    /// </summary>
    private static IServiceCollection AddRepositories(this IServiceCollection services)
    {
        services.AddScoped<Application.Interfaces.ILessonStageRepository, Repositories.LessonStageRepository>();
        services.AddScoped<Application.Interfaces.IExerciseRepository, Repositories.ExerciseRepository>();

        return services;
    }

    /// <summary>
    /// Настройка базы данных SQLite
    /// </summary>
    private static IServiceCollection AddDatabase(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("DefaultConnection");
        
        if (string.IsNullOrEmpty(connectionString))
        {
            throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
        }

        // Регистрация IDbConnection для SQLite
        services.AddScoped<IDbConnection>(provider => new SqliteConnection(connectionString));

        return services;
    }

    /// <summary>
    /// Регистрация инициализатора базы данных
    /// </summary>
    private static IServiceCollection AddDatabaseInitializer(this IServiceCollection services)
    {
        services.AddScoped<DatabaseInitializer>();
        return services;
    }
}

