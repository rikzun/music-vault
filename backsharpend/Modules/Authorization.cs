using System.Security.Claims;
using System.Text.Encodings.Web;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Options;

namespace Project.Modules;

public class TokenAuthenticationHandler(
    IOptionsMonitor<AuthenticationSchemeOptions> options,
    ILoggerFactory logger,
    UrlEncoder encoder)
        : AuthenticationHandler<AuthenticationSchemeOptions>(options, logger, encoder)
{
    protected override Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        if (!Request.Headers.TryGetValue("Authorization", out Microsoft.Extensions.Primitives.StringValues value))
        {
            return Task.FromResult(AuthenticateResult.Fail("No Authorization header"));
        }

        var token = value.ToString();

        if (token != "TOKEN_VALUE")
        {
            return Task.FromResult(AuthenticateResult.Fail("Invalid token"));
        }

        var claims = new[]
        {
            new Claim(ClaimTypes.Name, "ApiUser")
        };

        var identity = new ClaimsIdentity(claims, Scheme.Name);
        var principal = new ClaimsPrincipal(identity);
        var ticket = new AuthenticationTicket(principal, Scheme.Name);

        return Task.FromResult(AuthenticateResult.Success(ticket));
    }
}
