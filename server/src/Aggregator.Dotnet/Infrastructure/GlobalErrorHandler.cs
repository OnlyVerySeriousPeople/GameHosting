using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace Aggregator.Dotnet.Infrastructure
{
	public class GlobalErrorHandler : IExceptionHandler
	{
		public async ValueTask<bool> TryHandleAsync(HttpContext context, Exception exception, CancellationToken cancellationToken)
		{
			ProblemDetails problemDetails = new()
			{
				Detail = exception.Message,
				Title = exception.GetType().Name,
				Instance = context.Request.Path
			};

			problemDetails.Status = exception switch
			{
				ArgumentException => StatusCodes.Status400BadRequest,
				ValidationException => StatusCodes.Status400BadRequest,
				_ => StatusCodes.Status500InternalServerError
			};

			context.Response.StatusCode = problemDetails.Status ?? StatusCodes.Status500InternalServerError;

			await context.Response.WriteAsJsonAsync(problemDetails, cancellationToken: cancellationToken);

			return true;
		}
	}
}
