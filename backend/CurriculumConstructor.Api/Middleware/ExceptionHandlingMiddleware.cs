using System.Net;
using System.Text.Json;
using CurriculumConstructor.Application.Common;
using CurriculumConstructor.Domain.Exceptions;

namespace CurriculumConstructor.Api.Middleware;

/// <summary>
/// Middleware для глобальной обработки исключений
/// </summary>
internal class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(context, ex);
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";
        var response = context.Response;

        var errorResponse = new ApiResponse<object>();

        switch (exception)
        {
            case ValidationException validationException:
                response.StatusCode = (int)HttpStatusCode.BadRequest;
                errorResponse = ApiResponse<object>.ErrorResponse(
                    validationException.Message,
                    validationException.Errors?.SelectMany(e => e.Value).ToArray()
                );
                _logger.LogWarning(exception, "Validation Exception: {Message}", validationException.Message);
                break;

            case NotFoundException notFoundException:
                response.StatusCode = (int)HttpStatusCode.NotFound;
                errorResponse = ApiResponse<object>.ErrorResponse(notFoundException.Message);
                _logger.LogWarning(exception, "Not Found Exception: {Message}", notFoundException.Message);
                break;

            case UnauthorizedException unauthorizedException:
                response.StatusCode = (int)HttpStatusCode.Unauthorized;
                errorResponse = ApiResponse<object>.ErrorResponse(unauthorizedException.Message);
                _logger.LogWarning(exception, "Unauthorized Exception: {Message}", unauthorizedException.Message);
                break;

            case ForbiddenException forbiddenException:
                response.StatusCode = (int)HttpStatusCode.Forbidden;
                errorResponse = ApiResponse<object>.ErrorResponse(forbiddenException.Message);
                _logger.LogWarning(exception, "Forbidden Exception: {Message}", forbiddenException.Message);
                break;

            case ApiException apiException:
                response.StatusCode = apiException.StatusCode;
                errorResponse = ApiResponse<object>.ErrorResponse(apiException.Message);
                _logger.LogWarning(exception, "API Exception: {Message}", apiException.Message);
                break;

            default:
                response.StatusCode = (int)HttpStatusCode.InternalServerError;
                errorResponse = ApiResponse<object>.ErrorResponse("An error occurred while processing your request.");
                _logger.LogError(exception, "Unhandled Exception: {Message}", exception.Message);
                break;
        }

        var options = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };

        var jsonResponse = JsonSerializer.Serialize(errorResponse, options);
        await response.WriteAsync(jsonResponse);
    }
}

