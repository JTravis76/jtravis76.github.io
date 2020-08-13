#meta-start
Title:CORS Setup - .NET Framework
Created:5/12/2020
Category:netframework
#meta-end
# CORS Setup - Framework
Below are details to setting up CORS Without using any nuget packages nor helpers.

web.config

```xml
<system.webServer>
  ...
    <httpProtocol>
      <customHeaders>
        <!-- CANNOT Use wildcard when using withCredentials -->
        <!--<add name="Access-Control-Allow-Origin" value="*" />-->
        <add name="Access-Control-Allow-Origin" value="http://localhost:1337" />

        <add name="Access-Control-Allow-Headers" value="Content-Type" />
        
        <add name="Access-Control-Allow-Methods" value="*" />
        <!--<add name="Access-Control-Allow-Methods" value="GET,POST,PUT,DELETE,OPTIONS" />-->

        <add name="Access-Control-Allow-Credentials" value="true" />
      </customHeaders>
    </httpProtocol>
  ..
</system.webServer>
```

* When using wildcard "*" with `Access-Control-All-Origin`, 
	Chrome throws error that CORS policy doesn't accept wildcards.
	This happens when using `Access-Control-Allow-Credentials` is set to TRUE
* When using an actual URL, all GET methods works.
* All OPTIONS preflight fails with 405 Method Not Allowed. Even with an Authorization header
* Adding [OPTIONS] verb to controller/route (ex: [AcceptVerbs("POST","OPTIONS")]), preflight fails with 415 Unsupported Media Type


Now using CORS Delegation handler in conjunction with web.config settings

* While using both, Chrome throws a new error: The 'Access-Control-Allow-Origin' header contains multiple values...


CorsDelegateHandler.cs
```cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using System.Web;

namespace WISE.Api
{
    /// <summary>
    /// 
    /// </summary>
    public class CorsDelegateHandler : DelegatingHandler
    {
        const string Origin = "Origin";
        const string AccessControlRequestMethod = "Access-Control-Request-Method";
        const string AccessControlRequestHeaders = "Access-Control-Request-Headers";
        const string AccessControlAllowOrigin = "Access-Control-Allow-Origin";
        const string AccessControlAllowMethods = "Access-Control-Allow-Methods";
        const string AccessControlAllowHeaders = "Access-Control-Allow-Headers";

        /// <summary>
        /// 
        /// </summary>
        /// <param name="request"></param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            bool isCorsRequest = request.Headers.Contains(Origin);
            bool isPreflightRequest = request.Method == HttpMethod.Options;
            if (isCorsRequest)
            {
                if (isPreflightRequest)
                {
                    HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.NoContent);
                    /*== NOTE: cannot use Access-Control-Allow-Origin in web.config conjuction. May result in duplicate header values ==*/
                    response.Headers.Add(AccessControlAllowOrigin, request.Headers.GetValues(Origin).First());

                    /*== Not seeing this is required for preflight, since the web.config will be source of truth ==*/
                    //string accessControlRequestMethod = request.Headers.GetValues(AccessControlRequestMethod).FirstOrDefault();
                    //if (accessControlRequestMethod != null)
                    //{
                    //    response.Headers.Add(AccessControlAllowMethods, accessControlRequestMethod);
                    //}

                    //string requestedHeaders = string.Join(",", request.Headers.GetValues(AccessControlRequestHeaders));
                    //if (!string.IsNullOrEmpty(requestedHeaders))
                    //{
                    //    response.Headers.Add(AccessControlAllowHeaders, requestedHeaders);
                    //}

                    TaskCompletionSource<HttpResponseMessage> tcs = new TaskCompletionSource<HttpResponseMessage>();
                    tcs.SetResult(response);
                    return tcs.Task;
                }
                else
                {
                    return base.SendAsync(request, cancellationToken).ContinueWith<HttpResponseMessage>(t =>
                    {
                        HttpResponseMessage resp = t.Result;
                        /*== NOTE: cannot use Access-Control-Allow-Origin in web.config conjuction. May result in duplicate header values ==*/
                        resp.Headers.Add(AccessControlAllowOrigin, request.Headers.GetValues(Origin).First());
                        return resp;
                    });
                }
            }
            else
            {
                return base.SendAsync(request, cancellationToken);
            }
        }
    }

}
```


Global.asax.cs
```cs
protected void Application_Start()
{
    GlobalConfiguration.Configure(WebApiConfig.Register);
    GlobalConfiguration.Configuration.MessageHandlers.Add(new CorsDelegateHandler());
    ...
}
```