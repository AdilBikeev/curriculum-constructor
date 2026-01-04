using System.Data;
using CurriculumConstructor.Application.Interfaces;
using CurriculumConstructor.Domain.Entities;
using Dapper;

namespace CurriculumConstructor.Infrastructure.Repositories;

/// <summary>
/// Репозиторий для работы с планами занятий
/// </summary>
internal class LessonPlanRepository : BaseRepository<LessonPlan, string>, ILessonPlanRepository
{
    public LessonPlanRepository(IDbConnection connection) : base(connection, "LessonPlans", "Id")
    {
    }

    public override async Task<string> CreateAsync(LessonPlan entity, IDbTransaction? transaction = null)
    {
        ArgumentNullException.ThrowIfNull(entity);

        var sql = @"
            INSERT INTO LessonPlans (Id, Title, TotalDuration, CreatedAt, UpdatedAt)
            VALUES (@Id, @Title, @TotalDuration, @CreatedAt, @UpdatedAt)";

        await Connection.ExecuteAsync(sql, entity, transaction);
        return entity.Id;
    }

    public override async Task<bool> UpdateAsync(LessonPlan entity, IDbTransaction? transaction = null)
    {
        ArgumentNullException.ThrowIfNull(entity);

        var sql = @"
            UPDATE LessonPlans 
            SET Title = @Title, TotalDuration = @TotalDuration, UpdatedAt = @UpdatedAt
            WHERE Id = @Id";

        var rowsAffected = await Connection.ExecuteAsync(sql, entity, transaction);
        return rowsAffected > 0;
    }

    public async Task<bool> ExistsByTitleAsync(string title, string? excludeId = null)
    {
        ArgumentNullException.ThrowIfNull(title);

        var sql = excludeId == null
            ? "SELECT COUNT(1) FROM LessonPlans WHERE Title = @Title"
            : "SELECT COUNT(1) FROM LessonPlans WHERE Title = @Title AND Id != @ExcludeId";

        var count = await Connection.QuerySingleAsync<int>(sql, new { Title = title, ExcludeId = excludeId });
        return count > 0;
    }

    public async Task<IEnumerable<LessonPlanItem>> GetItemsByPlanIdAsync(string planId)
    {
        ArgumentNullException.ThrowIfNull(planId);

        var sql = "SELECT * FROM LessonPlanItems WHERE PlanId = @PlanId ORDER BY [Order]";
        return await Connection.QueryAsync<LessonPlanItem>(sql, new { PlanId = planId });
    }

    public async Task<bool> DeleteItemsByPlanIdAsync(string planId)
    {
        ArgumentNullException.ThrowIfNull(planId);

        var sql = "DELETE FROM LessonPlanItems WHERE PlanId = @PlanId";
        var rowsAffected = await Connection.ExecuteAsync(sql, new { PlanId = planId });
        return rowsAffected >= 0; // >= 0 потому что может быть 0 элементов
    }
}

