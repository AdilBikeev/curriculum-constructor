using CurriculumConstructor.Api.Extensions;
using CurriculumConstructor.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

// Конфигурация сервисов
builder.Services.AddControllersConfiguration();
builder.Services.AddApplicationLayers(builder.Configuration); // Регистрация Application и Infrastructure слоев
builder.Services.AddCorsConfiguration(builder.Configuration);
builder.Services.AddSwaggerConfiguration();
builder.Services.AddApiVersioningConfiguration();
builder.Services.AddFluentValidationConfiguration();

// Логирование
builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.AddDebug();

var app = builder.Build();

// Инициализация базы данных
using (var scope = app.Services.CreateScope())
{
    scope.ServiceProvider.InitializeDatabase();
}

// Настройка pipeline
app.UseExceptionHandling();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "Curriculum Constructor API v1");
        options.RoutePrefix = string.Empty; // Swagger UI на корневом пути
    });
}

app.UseHttpsRedirection();
app.UseCors("DefaultPolicy");
app.UseAuthorization();
app.MapControllers();

app.Run();
