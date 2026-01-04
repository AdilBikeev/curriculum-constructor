using System.Data;
using CurriculumConstructor.Application.Interfaces;
using CurriculumConstructor.Domain.Entities;
using Dapper;

namespace CurriculumConstructor.Infrastructure.Repositories;

/// <summary>
/// Репозиторий для работы с элементами планов занятий
/// </summary>
internal class LessonPlanItemRepository : BaseRepository<LessonPlanItem, string>, IRepository<LessonPlanItem, string>
{
    public LessonPlanItemRepository(IDbConnection connection) : base(connection, "LessonPlanItems", "Id")
    {
    }

    public override async Task<string> CreateAsync(LessonPlanItem entity, IDbTransaction? transaction = null)
    {
        ArgumentNullException.ThrowIfNull(entity);

        var sql = @"
            INSERT INTO LessonPlanItems (Id, PlanId, StageId, StageName, ExerciseId, ExerciseName, Duration, [Order])
            VALUES (@Id, @PlanId, @StageId, @StageName, @ExerciseId, @ExerciseName, @Duration, @Order)";

        await Connection.ExecuteAsync(sql, entity, transaction);
        return entity.Id;
    }

    public override async Task<bool> UpdateAsync(LessonPlanItem entity, IDbTransaction? transaction = null)
    {
        ArgumentNullException.ThrowIfNull(entity);

        var sql = @"
            UPDATE LessonPlanItems 
            SET StageId = @StageId, StageName = @StageName, ExerciseId = @ExerciseId, 
                ExerciseName = @ExerciseName, Duration = @Duration, [Order] = @Order
            WHERE Id = @Id";

        var rowsAffected = await Connection.ExecuteAsync(sql, entity, transaction);
        return rowsAffected > 0;
    }
}

