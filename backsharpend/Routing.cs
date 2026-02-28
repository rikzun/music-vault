using Microsoft.EntityFrameworkCore;
using Project.Domain;

namespace Project;

public static class RoutingExtensions
{
    public static void SetupRouting(this IEndpointRouteBuilder app)
    {
        var unsecured = app.MapGroup("api");
        var secured = app.MapGroup("api").RequireAuthorization();

        var authGroup = unsecured
            .MapGroup("auth")
            .WithTags("Auth");

        authGroup
            .MapPost("sign-up", async (HttpRequest request, AppDbContext db) =>
            {
                // db.Clients.Add(new Client
                // {
                //     Login = "rikzun",
                //     Email = "rik.zunqq@gmail.com",
                //     PasswordHash = ""
                // });

                // await db.SaveChangesAsync();

                Client client = await db.Clients.FirstAsync();
                return Results.Ok(client.ToShortData());
            })
            .WithSummary("Sign Up");
        
        authGroup
            .MapPost("sign-in", () => {})
            .WithSummary("Sign In");
    }
}