using CurriculumConstructor.Application;
using CurriculumConstructor.Infrastructure;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Versioning;
using Microsoft.OpenApi.Models;

namespace CurriculumConstructor.Api.Extensions;

/// <summary>
/// Расширения для настройки сервисов API слоя
/// </summary>
public static class ServiceCollectionExtensions
{

    /// <summary>
    /// Настройка CORS
    /// </summary>
    public static IServiceCollection AddCorsConfiguration(this IServiceCollection services, IConfiguration configuration)
    {
        var allowedOrigins = configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() 
            ?? new[] { "http://localhost:3000", "http://localhost:5173" };

        services.AddCors(options =>
        {
            options.AddPolicy("DefaultPolicy", policy =>
            {
                policy.WithOrigins(allowedOrigins)
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                    .AllowCredentials();
            });
        });

        return services;
    }

    /// <summary>
    /// Настройка Swagger
    /// </summary>
    public static IServiceCollection AddSwaggerConfiguration(this IServiceCollection services)
    {
        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen(options =>
        {
            options.SwaggerDoc("v1", new OpenApiInfo
            {
                Version = "v1",
                Title = "Curriculum Constructor API",
                Description = "API для конструктора учебных программ",
                Contact = new OpenApiContact
                {
                    Name = "Curriculum Constructor",
                }
            });

            // Включение XML комментариев
            var xmlFile = $"{System.Reflection.Assembly.GetExecutingAssembly().GetName().Name}.xml";
            var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
            if (File.Exists(xmlPath))
            {
                options.IncludeXmlComments(xmlPath);
            }
        });

        return services;
    }

    /// <summary>
    /// Настройка версионирования API
    /// </summary>
    public static IServiceCollection AddApiVersioningConfiguration(this IServiceCollection services)
    {
        services.AddApiVersioning(options =>
        {
            options.DefaultApiVersion = new ApiVersion(1, 0);
            options.AssumeDefaultVersionWhenUnspecified = true;
            options.ReportApiVersions = true;
        });

        services.AddVersionedApiExplorer(options =>
        {
            options.GroupNameFormat = "'v'VVV";
            options.SubstituteApiVersionInUrl = true;
        });

        return services;
    }

    /// <summary>
    /// Настройка FluentValidation для ASP.NET Core
    /// </summary>
    public static IServiceCollection AddFluentValidationConfiguration(this IServiceCollection services)
    {
        services.AddFluentValidationAutoValidation();
        services.AddFluentValidationClientsideAdapters();

        return services;
    }

    /// <summary>
    /// Добавление всех слоев приложения
    /// </summary>
    public static IServiceCollection AddApplicationLayers(this IServiceCollection services, IConfiguration configuration)
    {
        // Регистрация слоев в правильном порядке
        services.AddApplication(); // Application слой
        services.AddInfrastructure(configuration); // Infrastructure слой

        return services;
    }

    /// <summary>
    /// Настройка контроллеров
    /// </summary>
    public static IServiceCollection AddControllersConfiguration(this IServiceCollection services)
    {
        services.AddControllers(options =>
        {
            // Настройка фильтров, если необходимо
        })
        .ConfigureApiBehaviorOptions(options =>
        {
            // Настройка поведения API
            options.SuppressModelStateInvalidFilter = false;
        });

        return services;
    }
}
