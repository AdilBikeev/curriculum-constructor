using Microsoft.Data.Sqlite;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace CurriculumConstructor.Infrastructure.Database;

/// <summary>
/// Инициализатор базы данных
/// </summary>
public class DatabaseInitializer
{
    private readonly string _connectionString;
    private readonly ILogger<DatabaseInitializer> _logger;

    public DatabaseInitializer(IConfiguration configuration, ILogger<DatabaseInitializer> logger)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection") 
            ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
        _logger = logger;
    }

    /// <summary>
    /// Инициализирует базу данных (создает таблицы, если их нет)
    /// </summary>
    public void Initialize()
    {
        try
        {
            var schemaSql = GetSchemaSql();
            
            using var connection = new SqliteConnection(_connectionString);
            connection.Open();

            using var command = connection.CreateCommand();
            command.CommandText = schemaSql;
            command.ExecuteNonQuery();

            _logger.LogInformation("Database initialized successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error initializing database");
            throw;
        }
    }

    private static string GetSchemaSql()
    {
        return @"
            -- Таблица стадий уроков
            CREATE TABLE IF NOT EXISTS LessonStages (
                Id TEXT PRIMARY KEY,
                Name TEXT NOT NULL,
                Description TEXT,
                CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                UpdatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
            );

            -- Таблица упражнений
            CREATE TABLE IF NOT EXISTS Exercises (
                Id TEXT PRIMARY KEY,
                StageId TEXT NOT NULL,
                Name TEXT NOT NULL,
                Duration INTEGER NOT NULL,
                Description TEXT,
                CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                UpdatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (StageId) REFERENCES LessonStages(Id) ON DELETE CASCADE
            );

            -- Индексы для быстрого поиска
            CREATE INDEX IF NOT EXISTS IX_Exercises_StageId ON Exercises(StageId);
            CREATE INDEX IF NOT EXISTS IX_LessonStages_Name ON LessonStages(Name);
        ";
    }
}

