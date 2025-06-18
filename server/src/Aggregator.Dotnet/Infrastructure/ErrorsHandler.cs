using AuthService.Dotnet.Grpc;
using Microsoft.AspNetCore.Mvc;

namespace Aggregator.Dotnet.Infrastructure
{
	public static class ErrorsHandler
	{
		public static IResult HandleServiceErrorResponse(Error error)
		{
			var problemDetails = new ProblemDetails
			{
				Detail = error.Description,
				Title = error.Type,
				Status = error.RestCode switch
				{
					400 => StatusCodes.Status400BadRequest,
					401 => StatusCodes.Status401Unauthorized,
					403 => StatusCodes.Status403Forbidden,
					404 => StatusCodes.Status404NotFound,
					_ => StatusCodes.Status500InternalServerError
				}
			};

			return TypedResults.Problem(problemDetails);
		}
	}
}