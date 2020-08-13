#meta-start
Title:Netcenter Roles DI Extension
Created:5-12-2020
Category:dotnetcore
#meta-end
# Netcenter Roles DI Extension

While setting up Windows Authentication and Authorization via .Net Core API application with EntityGraphQL (GraphQL service by Luke Murray), I needed to apply custom Security Claims to the User's identity.  
Below is example of how I wired up both middleware and application service to fetch roles then merge into the Windows Authenticated claims.

Netcenter is an in-house API use to provide a centralized services for various task among our applications.

This option shows how we extend the application service.

*Extensions/ApplicationEx.cs*
```cs
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Http;
using System.Net;
using Microsoft.Extensions.DependencyInjection;
using System.Security.Claims;
using System.Linq;

namespace WebApplication1.Api.Extensions
{
    public static class ApplicationExt
    {
        /// <summary>
        /// Add Netcenter Roles to User's Identity
        /// </summary>
        /// <param name="app"></param>
        public static void UseNetcenterRoles(this IApplicationBuilder app)
        {
            app.Use(async (context, next) =>
            {
                if (context.User != null && context.User.Identity.IsAuthenticated)
                {
                    var claims = new System.Collections.Generic.List<System.Security.Claims.Claim>();

                    //== Could fetch svc from app builder
                    //var a = app.ApplicationServices.GetService<Netcenter.Sdk.INetcenterSDK>();

                    var netcenter = context.RequestServices.GetService<Netcenter.Sdk.INetcenterSDK>();
                    netcenter.UserAppRoleNames(context.User.Identity.Name)
                        .ForEach(delegate (string role) {
                            claims.Add(new Claim(ClaimTypes.Role, role));
                        });

                    // Doing this will require devs to merge identities in controller or services
                    //var claimsIdentity = new System.Security.Claims.ClaimsIdentity(claims);
                    //context.User.AddIdentity(claimsIdentity);

                    //add new Role claims directly to default identity
                    context.User.Identities.FirstOrDefault().AddClaims(claims);
                }

                await next();
            });
        }

    }
}

```

This option uses a middleware class within the `ApplicationBuilder` that injects on every incoming route.

*Extensions/NetcenterRoles.cs*
```cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;

namespace WebApplication1.Api.Extensions
{
    public class NetcenterRoles
    {
        private readonly Microsoft.AspNetCore.Http.RequestDelegate _next;

        /// <summary>
        /// Middleware to add Netcenter Roles to User's Identity
        /// </summary>
        /// <param name="next"></param>
        public NetcenterRoles(Microsoft.AspNetCore.Http.RequestDelegate next)
        {
            _next = next;
        }

        public async System.Threading.Tasks.Task InvokeAsync(Microsoft.AspNetCore.Http.HttpContext httpContext)
        {
            if (httpContext.User != null && httpContext.User.Identity.IsAuthenticated)
            {
                var claims = new System.Collections.Generic.List<System.Security.Claims.Claim>();

                var netcenter = httpContext.RequestServices.GetService<Netcenter.Sdk.INetcenterSDK>();
                netcenter.UserAppRoleNames(httpContext.User.Identity.Name)
                    .ForEach(delegate (string role) {
                        claims.Add(new Claim(ClaimTypes.Role, role));
                    });

                // Doing this will require devs to merge identities in controller or services
                //var claimsIdentity = new System.Security.Claims.ClaimsIdentity(claims);
                //httpContext.User.AddIdentity(claimsIdentity);

                //add new Role claims directly to default identity
                httpContext.User.Identities.FirstOrDefault().AddClaims(claims);

                await _next(httpContext);
            }
        }
    }
}

```

Finally, we add/use the middleware in our `Startup.cs`.

```cs
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using WebApplication1.Api.Extensions;

namespace WebApplication1.Api
{
    public class Startup
    {
        public IConfiguration Configuration { get; }


        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddNetcenter(Configuration);
            services.AddMVC();
        }

        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            /*== Could use either method here ==*/
            //app.UseMiddleware<NetcenterRoles>();
            app.UseNetcenterRoles();

            app.UseMvc();
        }
    }
}

```