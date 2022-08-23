# Role-Based Authentication with JWT

Demo how to use the `[Authorize(Roles ="Admin,User")]` attribute.

*appsettings.json*

```json
"Jwt": {
    "Key": "SomeSuperSecretKey",
    "Issuer":  "sub.domain.net"
}
```

*Startup.cs*

Setup the JWT Bearer token.
```csharp
public void ConfigureServices(IServiceCollection services)
{
    services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
        .AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = Configuration["Jwt:Issuer"],
                ValidAudience = Configuration["Jwt:Issuer"],
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["Jwt:Key"]))
            };
        });
}
```

Tell web application to use authentication.
```csharp
public void Configure(IApplicationBuilder app, IHostingEnvironment env)
{
    app.UseAuthentication();
}
```

*LoginController.cs*

Create a controller named `LoginController` and insert sample below.

```csharp
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace CommandTower.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly IConfiguration _config;

        public LoginController(IConfiguration configuration)
        {
            _config = configuration;
        }

        [AllowAnonymous]
        [HttpPost]
        public IActionResult Login_POST([FromBody]UserModel user)
        {
            Claim[] claims = null;

            //TODO: check against some authentication service with a backing-store.
            if (user.Username == "jtravis" && user.Password == "pwd")
            {                
                claims = new[] {
                    new Claim(JwtRegisteredClaimNames.Email, "user@domain.com"),
                    //new Claim("CustomClaim", "myCustomValue"),
                    new Claim(ClaimTypes.Role, "Admin"),
                    new Claim(ClaimTypes.Role, "HR")
                };
            }

            if (claims != null)
            {
                var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
                var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

                var token = new JwtSecurityToken(_config["Jwt:Issuer"],
                        _config["Jwt:Issuer"],
                        claims,
                        expires: DateTime.Now.AddMinutes(2),
                        signingCredentials: credentials);

                return Ok(new { token = new JwtSecurityTokenHandler().WriteToken(token) });
            }

            return StatusCode(403, "Username or password incorrect");
        }

        [Authorize(Roles = "Admin")]
        //[Authorize]
        [HttpGet]
        public ActionResult<IEnumerable<string>> Values_GET()
        {
            //if (User.HasClaim(x => x.Type == ClaimTypes.Role))
            //{
            //    //Return Admin role data
            //    if (User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Role).Value.Split(',').Contains("Admin"))
            //    {
            //        return new string[] { "Admin-Value1", "Admin-Value2" };
            //    }
            //}

            //Return HR role data
            if (User.IsInRole("HR"))
            {
                return new string[] { "HR-Value3", "HR-Value4", "HR-Value5" };
            }

            //return default data
            return new string[] { "value1", "value2" };
        }

    }

    public class UserModel
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }
}
```

## Postman
---
### **POST** Setup
Be sure to set the body content-type to `application/json` or you with get **415** status code message.

Enter the following in the body;
```json
{username:"jtravis", password:"pwd"}
```

Should recieve a JSON response like so;
```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImplcmVteS50cmF2aXNAZG9tYWluLmNvbSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6WyJBZG1pbiIsIkhSIl0sImV4cCI6MTU2NTI4MTg3NCwiaXNzIjoiamVyZW15dHJhdmlzLmF6dXJld2Vic2l0ZXMubmV0IiwiYXVkIjoiamVyZW15dHJhdmlzLmF6dXJld2Vic2l0ZXMubmV0In0.GpnwGHQsb6EpASX2avBm13IugUIObcqZN69T-k1O704"
}
```

### **GET** Setup
Add the `Authorization` header and include the token.
```
Authorization:Bearer myTokenHere
```