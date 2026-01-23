using NSwag;
using NSwag.Generation.AspNetCore;
using NSwag.Generation.Processors;
using NSwag.Generation.Processors.Contexts;

namespace Project.Modules;

public static class OpenApi
{
    public static IServiceCollection AddOpenApiGen(this IServiceCollection serviceCollection)
	{
        return serviceCollection.AddOpenApiDocument((options) =>
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

            options.OperationProcessors.Add(new DotnetOpenApiProcessor());
        });
	}

    public class DotnetOpenApiProcessor : IOperationProcessor
    {
        public bool Process(OperationProcessorContext context)
        {
            if (context is not AspNetCoreOperationProcessorContext aspnetContext)
            {
                return true;
            }

            foreach (var metadata in aspnetContext.ApiDescription.ActionDescriptor.EndpointMetadata)
            {
                if (metadata is OpenApiOperation openApiMetadata)
                {
                    context.OperationDescription.Operation.OperationId = openApiMetadata.OperationId;
                    context.OperationDescription.Operation.IsDeprecated = openApiMetadata.IsDeprecated;
                    context.OperationDescription.Operation.Summary = openApiMetadata.Summary;
                    context.OperationDescription.Operation.Description = openApiMetadata.Description;
                }
                else if (metadata is EndpointSummaryAttribute summaryAttribute)
                {
                    context.OperationDescription.Operation.Summary = summaryAttribute.Summary;
                }
                else if (metadata is EndpointDescriptionAttribute descriptionAttribute)
                {
                    context.OperationDescription.Operation.Description = descriptionAttribute.Description;
                }
                else if (metadata is EndpointNameAttribute nameAttribute)
                {
                    context.OperationDescription.Operation.OperationId = nameAttribute.EndpointName;
                }
            }

            return true;
        }
    }

    public static IApplicationBuilder MapOpenApi(this IApplicationBuilder app)
    {
        return app.UseOpenApi((options) =>
        {
            options.Path = "/openapi.json";
        });
    }
}