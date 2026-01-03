using System.Data;
using CurriculumConstructor.Application.Interfaces;
using CurriculumConstructor.Domain.Entities;
using Dapper;

namespace CurriculumConstructor.Infrastructure.Repositories;

/// <summary>
/// Репозиторий для работы с упражнениями
/// </summary>
internal class ExerciseRepository : BaseRepository<Exercise, string>, IExerciseRepository
{
    public ExerciseRepository(IDbConnection connection) : base(connection, "Exercises", "Id")
    {
    }

    public override async Task<string> CreateAsync(Exercise entity, IDbTransaction? transaction = null)
    {
        ArgumentNullException.ThrowIfNull(entity);

        var sql = @"
            INSERT INTO Exercises (Id, StageId, Name, Duration, Description, CreatedAt, UpdatedAt)
            VALUES (@Id, @StageId, @Name, @Duration, @Description, @CreatedAt, @UpdatedAt)";

        await Connection.ExecuteAsync(sql, entity, transaction);
        return entity.Id;
    }

    public override async Task<bool> UpdateAsync(Exercise entity, IDbTransaction? transaction = null)
    {
        ArgumentNullException.ThrowIfNull(entity);

        var sql = @"
            UPDATE Exercises 
            SET Name = @Name, Duration = @Duration, Description = @Description, UpdatedAt = @UpdatedAt
            WHERE Id = @Id";

        var rowsAffected = await Connection.ExecuteAsync(sql, entity, transaction);
        return rowsAffected > 0;
    }

    public async Task<IEnumerable<Exercise>> GetByStageIdAsync(string stageId)
    {
        ArgumentNullException.ThrowIfNull(stageId);

        var sql = "SELECT * FROM Exercises WHERE StageId = @StageId ORDER BY CreatedAt";
        return await Connection.QueryAsync<Exercise>(sql, new { StageId = stageId });
    }
}

