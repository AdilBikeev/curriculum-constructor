using System.Data;

namespace CurriculumConstructor.Application.Interfaces;

/// <summary>
/// Базовый интерфейс репозитория
/// </summary>
/// <typeparam name="T">Тип сущности</typeparam>
/// <typeparam name="TId">Тип идентификатора</typeparam>
public interface IRepository<T, TId> where T : class
{
    Task<T?> GetByIdAsync(TId id, IDbTransaction? transaction = null);
    Task<IEnumerable<T>> GetAllAsync(IDbTransaction? transaction = null);
    Task<TId> CreateAsync(T entity, IDbTransaction? transaction = null);
    Task<bool> UpdateAsync(T entity, IDbTransaction? transaction = null);
    Task<bool> DeleteAsync(TId id, IDbTransaction? transaction = null);
    Task<bool> ExistsAsync(TId id, IDbTransaction? transaction = null);
}

