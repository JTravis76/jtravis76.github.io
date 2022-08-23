# .NET Core CORS with Window Authentication

## Setup Configuration and Tools
* Visual Studio 2017 15.9.18
* ASP.NET Core 2.1(.510) LTS
* Chrome Browser 80.0.3987.100 (with company-control policies)
	* IIS Express - port 8080
* Fetch API client
* Axios v0.18.0 client

> NOTE: when using credential mode, CANNOT use wildcard "*" in `Access-Control-Allow-Origin` header

## Full Working Example
*launchSettings.json*
```json
{
  "iisSettings": {
    "windowsAuthentication": true,
    "anonymousAuthentication": false,
    "iisExpress": {
      "applicationUrl": "http://localhost:0000",
      "sslPort": 0
    }
  }
  ...
}
```

*Startup.cs*
```cs
public class Startup
{
    public IConfiguration Configuration { get; }

    public Startup(IConfiguration configuration)
    {
        Configuration = configuration;
    }

    public void ConfigureServices(IServiceCollection services)
    {
        services.AddCors(opt =>
        {
            opt.AddPolicy("CorsPolicy",
                builder => builder.WithOrigins(Configuration["AllowedHosts"]) // .AllowAnyOrigin()
                .AllowAnyMethod()
                .AllowAnyHeader()
                .AllowCredentials()); // <- MUST USE WITH Windows Authentication
        });

        services.AddMvc();
    }

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    public void Configure(IApplicationBuilder app, IHostingEnvironment env)
    {
        if (env.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
        }

        app.UseCors("CorsPolicy");

        app.UseMvc();
    }
}
```

*DefaultController.cs*
Seems like the EnableCors() attribute is not required to work
```cs
[Authorize]
//[Microsoft.AspNetCore.Cors.EnableCors("CorsPolicy")]
[Route("api")]
[ApiController]
public class DefaultController : ControllerBase
{
    [AllowAnonymous]
    [HttpGet("aboutme")]
    public IActionResult AboutMe_GET()
    {
        bool auth = User.Identity.IsAuthenticated;
        string name = User.Identity.Name;

        return Ok(new { auth, name });
    }
}
```

*index.html*
Sample HTML page using both Fetch API and Axios client to test CORS.  
Full working code.
```html
<!DOCTYPE html>
<html>
    <head>
        <title>CORS Policy Example</title>
    </head>
    <body>
        <h1>GET</h1>
        <button type="button" onclick="getFetch()">Fetch</button>
        <button type="button" onclick="getAxios()">Axios</button>
        <hr />
        <h1>POST</h1>
        <button type="button" onclick="postFetch()">Fetch</button>
        <button type="button" onclick="postAxios()">Axios</button>

        <script>
            var data = {
                FirstName: "Jeremy",
                LastName: "Travis"
            };
            var url = "http://localhost:80/cors/api/aboutme";

            
            var getFetch = function() {
                console.clear();

                fetch(url, { method: "GET", cache: "no-cache", mode: "cors", credentials: 'include' })
                .then(resp => {
                    if (!resp.ok)                        
                        console.warn(resp);
                    else {
                        console.log(resp);
                        return resp.json();
                    }
                })
                .then(data => {
                    if (data !== undefined)
                        console.log(data);
                })
                .catch(e => {
                    console.error(e);
                });
            }

            var postFetch = function() {
                console.clear();

                /* Edge: either credentials: "include" or "same-origin" works .
                   Chrome: must be "include".
                */
                fetch(url, { 
                    method: "POST", 
                    cache: "no-cache", 
                    mode: "cors",
                    body: JSON.stringify(data),
                    // headers: new Headers(),
                    headers: {
                      'Content-Type': 'application/json',
                      // 'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    credentials: 'include'//"same-origin"  
                })
                .then(resp => {
                    if (!resp.ok)                        
                        console.warn(resp);
                    else {
                        console.log(resp);
                        return resp.json();
                    }
                })
                .then(data => {
                    if (data !== undefined)
                        console.log(data);
                })
                .catch(e => {
                    console.error(e);
                });
            }

            function getAxios() {
                console.clear();

                /*== NOTE: using this header will break CORS ==*/
                //axios.defaults.headers.common = { 'Access-Control-Allow-Origin': '*' };
                axios.defaults.withCredentials = true;

                const config = {
                    url: url,
                    method: "GET",
                    //withCredentials: true
                };

                axios(config)
                .then(resp => {
                    console.log(resp);
                    console.log(resp.data);
                });
            }

            function postAxios() {
                console.clear();

                axios.defaults.withCredentials = true;                

                const config = {
                    url: url,
                    method: "POST",
                    data: JSON.stringify(data),
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                };

                axios(config)
                .then(resp => {
                    console.log(resp);
                    console.log(resp.data);
                });
            }
        </script>

        <script src="./axios.min.js"></script>
    </body>
</html>
```

Seem like I was able to figure out the `GET` methods to work easily, but `POST` methods required additonal setup.  
IIS CORS Module
https://www.iis.net/downloads/microsoft/iis-cors-module

Here is a working web.config sample.
```xml
<?xml version="1.0"?>
<configuration>
    <system.web>
        <authentication mode="Windows"/>
    </system.web>
    <system.webServer>
        <cors enabled="true">
            <add origin="http://localhost:8080" allowCredentials="true" >
                <allowHeaders allowAllRequestedHeaders="true"></allowHeaders>
            </add>
        </cors>
    </system.webServer>
</configuration>
```

# Framework Api

```xml
<system.webServer>
  ...
    <httpProtocol>
      <customHeaders>
        <add name="Access-Control-Allow-Origin" value="*" />
        <add name="Access-Control-Allow-Headers" value="Content-Type" />
        <add name="Access-Control-Allow-Methods" value="GET,POST,PUT,DELETE,OPTIONS" />
        <add name="Access-Control-Allow-Credentials" value="true" />
      </customHeaders>
    </httpProtocol>
  ...
</system.webServer>
```