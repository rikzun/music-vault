using Scalar.AspNetCore;

namespace Project.Modules;

public static class Scalar
{
    public static IEndpointConventionBuilder MapScalar(this IEndpointRouteBuilder endpoints)
    {
        return endpoints.MapScalarApiReference((options) =>
        {
            options.Telemetry = false;
            options.Title = "API Reference";
            options.OpenApiRoutePattern = "/openapi.json";
            options.Theme = ScalarTheme.Purple;
            options.DocumentDownloadType = DocumentDownloadType.Json;
            options.HideClientButton = true;
            options.DefaultOpenAllTags = true;
            options.DefaultHttpClient = new(ScalarTarget.JavaScript, ScalarClient.Fetch);
            options.HeaderContent = """
                <style>
                    .tag-section-container > .section {
                        padding-block: 2rem;
                    }

                    .tag-section-container > .section > .section-header-wrapper > .section-header {
                        margin: unset !important;
                    }

                    .tag-section-container > .section > .section-content {
                        display: none;
                    }
                </style>
            """.TrimStart();
        });
    }
}