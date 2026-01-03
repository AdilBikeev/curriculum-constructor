using System.Data;
using CurriculumConstructor.Application.Interfaces;
using Dapper;

namespace CurriculumConstructor.Infrastructure.Repositories;

/// <summary>
/// Базовый репозиторий с использованием Dapper
/// </summary>
/// <typeparam name="T">Тип сущности</typeparam>
/// <typeparam name="TId">Тип идентификатора</typeparam>
internal abstract class BaseRepository<T, TId> : IRepository<T, TId> where T : class
{
    protected readonly IDbConnection Connection;
    protected readonly string TableName;
    protected readonly string IdColumnName;

    protected BaseRepository(IDbConnection connection, string tableName, string idColumnName = "Id")
    {
        ArgumentNullException.ThrowIfNull(connection);
        ArgumentNullException.ThrowIfNull(tableName);

        Connection = connection;
        TableName = tableName;
        IdColumnName = idColumnName;
    }

    public virtual async Task<T?> GetByIdAsync(TId id, IDbTransaction? transaction = null)
    {
        var sql = $"SELECT * FROM {TableName} WHERE {IdColumnName} = @Id";
        return await Connection.QueryFirstOrDefaultAsync<T>(sql, new { Id = id }, transaction);
    }

    public virtual async Task<IEnumerable<T>> GetAllAsync(IDbTransaction? transaction = null)
    {
        var sql = $"SELECT * FROM {TableName}";
        return await Connection.QueryAsync<T>(sql, transaction: transaction);
    }

    public abstract Task<TId> CreateAsync(T entity, IDbTransaction? transaction = null);

    public abstract Task<bool> UpdateAsync(T entity, IDbTransaction? transaction = null);

    public virtual async Task<bool> DeleteAsync(TId id, IDbTransaction? transaction = null)
    {
        var sql = $"DELETE FROM {TableName} WHERE {IdColumnName} = @Id";
        var rowsAffected = await Connection.ExecuteAsync(sql, new { Id = id }, transaction);
        return rowsAffected > 0;
    }

    public virtual async Task<bool> ExistsAsync(TId id, IDbTransaction? transaction = null)
    {
        var sql = $"SELECT COUNT(1) FROM {TableName} WHERE {IdColumnName} = @Id";
        var count = await Connection.QuerySingleAsync<int>(sql, new { Id = id }, transaction);
        return count > 0;
    }
}

