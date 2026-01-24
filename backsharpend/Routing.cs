namespace Project;

public static class Program2
{
    public static void SetupRouting(this IEndpointRouteBuilder app)
    {
        var unsecured = app.MapGroup("/api");
        var secured = app.MapGroup("/api").RequireAuthorization();

        var authGroup = unsecured
            .MapGroup("/auth")
            .WithTags("Auth");

        authGroup
            .MapPost("sign-up", () => {})
            .WithSummary("Sign Up");
        
        authGroup
            .MapPost("sign-in", () => {})
            .WithSummary("Sign In");
    }
}