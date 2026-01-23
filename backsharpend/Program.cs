using Microsoft.EntityFrameworkCore;
using Project.Modules;

namespace Project;

public class Program
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
        
        var app = builder.Build();

        app.UseHttpsRedirection();
        app.MapOpenApi();
        app.MapScalar();

        app.MapGet("/time", () => DateTime.Now.ToString("dd.MM.yyyy HH:mm:ss"))
            .WithSummary("Get current time")
            .WithTags("Time");

        app.Run();
    }
}