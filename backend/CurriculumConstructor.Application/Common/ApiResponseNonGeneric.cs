using System.Collections.Generic;

namespace CurriculumConstructor.Application.Common;

/// <summary>
/// Единообразный ответ API без данных
/// </summary>
public class ApiResponse
{
    public bool Success { get; set; }
    public string? Message { get; set; }
    public IReadOnlyCollection<string>? Errors { get; set; }

    public static ApiResponse SuccessResponse(string? message = null)
    {
        return new ApiResponse
        {
            Success = true,
            Message = message
        };
    }

    public static ApiResponse ErrorResponse(string message, IReadOnlyCollection<string>? errors = null)
    {
        return new ApiResponse
        {
            Success = false,
            Message = message,
            Errors = errors
        };
    }
}

