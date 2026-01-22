using Microsoft.EntityFrameworkCore;
using NSwag;
using Project.Middleware;

namespace Project;

public class Program
{
    
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        builder.Services.AddCors();
        builder.Services.AddControllers();

        builder.Services.AddOpenApiDocument((options) =>
        {
            options.PostProcess = (document) =>
            {
                document.Info = new OpenApiInfo
                {
                    Title = "Music Vault",
                    Version = DateTime.Now.ToString("dd.MM.yyyy HH:mm")
                };

                document.Components.SecuritySchemes["Token"] = new OpenApiSecurityScheme
                {
                    Type = OpenApiSecuritySchemeType.ApiKey,
                    Name = "Authorization",
                    In = OpenApiSecurityApiKeyLocation.Header,
                };

                document.Security = [
                    new OpenApiSecurityRequirement
                    {
                        { "Token", Array.Empty<string>() }
                    }
                ];
            };
        });

        builder.Services.AddDbContext<MyDbContext>((options) =>
        {
            options
                .UseNpgsql(builder.Configuration.GetConnectionString("Default"))
                .UseSnakeCaseNamingConvention();
        }); 
        
        var app = builder.Build();

        app.UseHttpsRedirection();
        app.MapControllers();

        app.UseOpenApi((options) =>
        {
            options.Path = "/openapi.json";
        });

        app.UseSwaggerUIWrapper("/openapi.json");
        
        app.Run();
    }
}