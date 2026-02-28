using Microsoft.AspNetCore.Authentication;
using Microsoft.EntityFrameworkCore;
using Project.Modules;

namespace Project;

public static class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateSlimBuilder(args);

        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddOpenApiGen();

        builder.Services.AddDbContext<AppDbContext>((options) =>
        {
            options
                .UseNpgsql(builder.Configuration.GetConnectionString("Default"))
                .UseSnakeCaseNamingConvention();
        });

        builder.Services
            .AddAuthentication("Token")
            .AddScheme<AuthenticationSchemeOptions, TokenAuthenticationHandler>("Token", null);
        
        builder.Services.AddAuthorization();
        
        var app = builder.Build();

        using (var scope = app.Services.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            db.Database.Migrate();
        }

        app.UseAuthentication();
        app.UseAuthorization();

        app.UseHttpsRedirection();
        app.MapOpenApi();
        app.MapScalar();

        app.SetupRouting();

        app.Run();
    }
}