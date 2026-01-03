using System;

namespace CurriculumConstructor.Application.Converters;

/// <summary>
/// Базовый класс для конвертеров объектов
/// Предоставляет вспомогательные методы для преобразования коллекций
/// </summary>
internal static class Converter
{
    /// <summary>
    /// Преобразует коллекцию объектов
    /// </summary>
    /// <typeparam name="TSource">Тип исходных объектов</typeparam>
    /// <typeparam name="TDestination">Тип целевых объектов</typeparam>
    /// <param name="sources">Исходная коллекция</param>
    /// <param name="converter">Функция преобразования</param>
    /// <returns>Преобразованная коллекция</returns>
    public static IEnumerable<TDestination> ConvertCollection<TSource, TDestination>(
        IEnumerable<TSource> sources,
        Func<TSource, TDestination> converter)
    {
        ArgumentNullException.ThrowIfNull(sources);
        ArgumentNullException.ThrowIfNull(converter);

        return sources.Select(converter);
    }

    /// <summary>
    /// Преобразует коллекцию объектов с фильтрацией null значений
    /// </summary>
    /// <typeparam name="TSource">Тип исходных объектов</typeparam>
    /// <typeparam name="TDestination">Тип целевых объектов</typeparam>
    /// <param name="sources">Исходная коллекция</param>
    /// <param name="converter">Функция преобразования</param>
    /// <returns>Преобразованная коллекция без null значений</returns>
    public static IEnumerable<TDestination> ConvertCollectionNotNull<TSource, TDestination>(
        IEnumerable<TSource> sources,
        Func<TSource, TDestination?> converter)
        where TDestination : class
    {
        ArgumentNullException.ThrowIfNull(sources);
        ArgumentNullException.ThrowIfNull(converter);

        return sources.Select(converter).Where(x => x != null)!;
    }
}

