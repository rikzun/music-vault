namespace Project.Middleware;

public static class SwaggerUIWrapper
{
    /// <summary>
    /// Register the SwaggerUI middleware and my custom wrapper.
    /// </summary>
    public static IApplicationBuilder UseSwaggerUIWrapper(this IApplicationBuilder app, string openApiUrl)
    {
        return app.UseSwaggerUI((options) =>
        {
            options.HeadContent = """
                <style>
                    .scheme-container,
                    .download-url-wrapper > .select-label {
                        display: none !important;
                    }

                    .info > .main > .title {
                        display: flex
                    }

                    .auth-wrapper > button {
                        margin: unset !important;
                    }

                    .swagger-ui .opblock .opblock-summary .view-line-link.copy-to-clipboard {
                        display: none;
                        transition: unset;
                        background: unset;
                        border: 2px solid;
                        width: 3rem !important;
                        margin: unset !important;
                    }

                    .swagger-ui .opblock .opblock-summary:hover .view-line-link.copy-to-clipboard {
                        display: flex;
                    }

                    .swagger-ui .opblock .opblock-summary .view-line-link.copy-to-clipboard::after {
                        content: "Copy";
                        font-size: 14px;
                        font-weight: 700;
                    }

                    .swagger-ui .opblock .opblock-summary:hover .view-line-link.copy-to-clipboard > svg {
                        position: absolute;
                        height: 26px;
                        width: 48px;
                        opacity: 0;
                    }
                </style>

                <script>
                    const intervalID = setInterval(() => {
                        const titleBlock = document.querySelector(".info > .main > .title")
                        const authButton = document.querySelector(".auth-wrapper")

                        if (authButton != null && titleBlock != null) {
                            clearInterval(intervalID)

                            titleBlock.appendChild(authButton)
                        }
                    }, 10)
                </script>
            """.TrimStart();

            options.SwaggerEndpoint(openApiUrl, "");
        });
    }
}