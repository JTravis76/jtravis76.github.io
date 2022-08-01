# Using Root URL in Web API
While attempting to setup a NPM API server in C# Framework 4.6.1,
I ran in to some few things I thought I should note down.
* Root URL
* using a period within a URL

*WebApiConfig.cs*
```c#
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;

namespace NPM
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Web API configuration and services

            // Web API routes
            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                name: "DefaultApiRoute",
                //routeTemplate: "api/{controller}/{id}",
                routeTemplate: "{controller}/{id}",
                defaults: new { controller = "Home", id = RouteParameter.Optional }
            );

        }
    }
}
```


*HomeController.cs*
```c#
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace NPM.Controllers
{
    public class HomeController : ApiController
    {
        [Route("{name}")]
        public IHttpActionResult GET(string name = null)
        {
            string txt = System.IO.File.ReadAllText(HttpContext.Current.Server.MapPath($@"~/App_Data/{name}/{name}.json"));

            return Ok(Newtonsoft.Json.JsonConvert.DeserializeObject<dynamic>(txt));
        }

        [Route("{name}/-/{filename}")]
        public IHttpActionResult GET_File(string name = null, string filename = null)
        {
            /* NOTE: 
             * To allow periods within URLs, replace path="*." with path="*" in the web.config.
             * Example:
             * <add name="ExtensionlessUrlHandler-Integrated-4.0" path="*" verb="*" type="System.Web.Handlers.TransferRequestHandler" preCondition="integratedMode,runtimeVersionv4.0"/>
             * Found here-https://stackoverflow.com/questions/11494200/can-periods-be-used-in-asp-net-web-api-routes
             */
            using (System.IO.FileStream fs = System.IO.File.OpenRead(HttpContext.Current.Server.MapPath($"~/App_Data/{name}/{filename}")))
            {
                byte[] file = new byte[fs.Length];
                fs.Read(file, 0, file.Length);

                //Download the byte data from memory
                var http = HttpContext.Current.Response; //System.Web.HttpContext.Response;
                http.Clear();
                http.AddHeader("Content-disposition", $"attachment;filename={filename}");
                http.AddHeader("Content-Length", file.Length.ToString());
                http.ContentType = "application/octet-stream";
                http.BinaryWrite(file);
                http.End();
            }
            return Ok();
        }

    }
}

```

*Web.config*
Replace `path="*."` with `path="*"` to handle periods in URLs.
```xml
  <system.webServer>
    <handlers>
      <remove name="ExtensionlessUrlHandler-Integrated-4.0"/>
      <remove name="OPTIONSVerbHandler"/>
      <remove name="TRACEVerbHandler"/>
      <add name="ExtensionlessUrlHandler-Integrated-4.0" path="*" verb="*" type="System.Web.Handlers.TransferRequestHandler"
        preCondition="integratedMode,runtimeVersionv4.0"/>
    </handlers>
  </system.webServer>
```
