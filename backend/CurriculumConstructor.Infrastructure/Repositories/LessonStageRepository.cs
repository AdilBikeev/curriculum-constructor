using System.Data;
using CurriculumConstructor.Application.Interfaces;
using CurriculumConstructor.Domain.Entities;
using Dapper;

namespace CurriculumConstructor.Infrastructure.Repositories;

/// <summary>
/// Репозиторий для работы со стадиями уроков
/// </summary>
internal class LessonStageRepository : BaseRepository<LessonStage, string>, ILessonStageRepository
{
    public LessonStageRepository(IDbConnection connection) : base(connection, "LessonStages", "Id")
    {
    }

    public override async Task<string> CreateAsync(LessonStage entity, IDbTransaction? transaction = null)
    {
        ArgumentNullException.ThrowIfNull(entity);

        var sql = @"
            INSERT INTO LessonStages (Id, Name, Description, CreatedAt, UpdatedAt)
            VALUES (@Id, @Name, @Description, @CreatedAt, @UpdatedAt)";

        await Connection.ExecuteAsync(sql, entity, transaction);
        return entity.Id;
    }

    public override async Task<bool> UpdateAsync(LessonStage entity, IDbTransaction? transaction = null)
    {
        ArgumentNullException.ThrowIfNull(entity);

        var sql = @"
            UPDATE LessonStages 
            SET Name = @Name, Description = @Description, UpdatedAt = @UpdatedAt
            WHERE Id = @Id";

        var rowsAffected = await Connection.ExecuteAsync(sql, entity, transaction);
        return rowsAffected > 0;
    }
}

