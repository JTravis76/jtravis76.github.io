#meta-start
Title:Thycotic Setup and ASP.Core Provider
Created:6/17/2020
Category:other
#meta-end
# Thycotic Setup and ASP.Core Provider

Thycotic Secret Server is both a repository and SDK to store plain text in a safe way. This blog demostrates how to use secrets and injected them into your appsettings.json files.  
Below is also the sample Configuration provider written by Joe Moss and myself @ Fluor-BWXT.

See the following link for more info: [https://github.com/thycotic/sdk-documentation](https://github.com/thycotic/sdk-documentation)

In the main `appsettings.json`, add the Thycotic settings.

> NOTE: the RuleName and RuleKey may differ from each environment; Local, Developement, Staging, Production

```json
"Thycotic": {
  "CacheAge": 60,
  "CacheStrategy": 1,
  "SecretServerUrl": "https://DOMAIN/SecretServer/",
  "RuleName": "",
  "RuleKey": "",
  "ResetToken": "#AnyResetT0k3nHer3WillDo!",
  "SecretServerSdkConfigDirectory": "E:\\Thycotic\\MyAppName",
  "SecretServerSdkKeyDirectory": "E:\\Thycotic"
}
```

Now, build the AppSettings and/or ConnectionStrings. Below are some examples using MS SQL and Oracle connections.

> **Important!!** Thycotic strings *must* end with a question mark follow by a number. All variables must be enclosed within ${ }.

```json
"AppSettings": {
	"Secret": "${password}?587"
},
"ConnectionStrings": {
  "MSSQL": "Data Source=${server};Initial Catalog=${database};User ID=${username};Password=${password};MultipleActiveResultSets=True;Application Name=WebAppName?3412",
  "Oracle1": "User Id=${username};Password=${password};Data Source=${server}:${port}/${database};?1718",
  "Oracle2": "Data Source=(DESCRIPTION=(ADDRESS=(PROTOCOL=tcp)(HOST=${server})(PORT=${port}))(CONNECT_DATA=(SERVICE_NAME=${database})));User Id=${username};Password=${password};?1718",
  "Oracle3": "User Id=${username};Password=${password};Data Source=PEMSDEV.WORLD"
}
```

Finally, configure the Web Host Builder.

*Program.cs*

```cs
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Thycotic.Provider;

namespace MyApp
{
    public class Program
    {
        public static void Main(string[] args)
        {
            CreateWebHostBuilder(args).Build().Run();
        }

        public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
                .ConfigureAppConfiguration(ThycoticConfiguration.AddThycoticConfiguration)
                .UseStartup<Startup>();
    }
}
```

Here is a full `web.config` example.  
For Framework applications, use the following Nuget packages.
* Thycotic.SecretServer.Sdk 1.4.1
* Thycotic.SecretServer.Sdk.Extensions.Configuration 1.4.1
* Thycotic.SecretServer.Sdk.Extensions.Integration 1.4.1
* Thycotic.SecretServer.Sdk.Extensions.Integration.HttpModule 1.4.1

```xml
<appSettings>
    <!-- Thycotic -->
    <add key="tss:CacheAge" value="60" />
    <add key="tss:CacheStrategy" value="1" />
    <add key="tss:SecretServerUrl" value="https://DOMAIN/SecretServer" />
    <add key="tss:RuleName" value="" />
    <add key="tss:RuleKey" value="" />
    <add key="tss:ResetToken" value="#AnyResetT0k3nHer3WillDo!" />
    <add key="SecretServerSdkConfigDirectory" value="E:\Thycotic\MyAppName" />
    <!-- End Thycotic -->
    <add key="OtherSecret" value="${password}?587" />
</appSettings>
<connectionStrings>
    <add name="MSSQL" connectionString="Data Source=${server};Initial Catalog=WISE;User ID=${username};Password=${password};MultipleActiveResultSets=True;Application Name=MyApp?1643" providerName="System.Data.SqlClient"/>
</connectionStrings>
```

## Configuration Thycotic Provider

You will the following Nuget packages:
* Thycotic.SecretServer.Sdk 1.4.1
* Thycotic.SecretServer.Sdk.Extensions.Integration 1.4.1

```cs
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using System;
using Thycotic.SecretServer.Sdk.Areas.Secrets.Clients;
using Thycotic.SecretServer.Sdk.Extensions.Integration.Clients;
using Thycotic.SecretServer.Sdk.Extensions.Integration.Models;
using Thycotic.SecretServer.Sdk.Infrastructure.Clients;
using Thycotic.SecretServer.Sdk.Infrastructure.DataProtection;
using Thycotic.SecretServer.Sdk.Infrastructure.Factories;
using Thycotic.SecretServer.Sdk.Infrastructure.Loggers;
using Thycotic.SecretServer.Sdk.Infrastructure.Providers;

namespace Thycotic.Provider
{
    public static class ThycoticConfiguration
    {
        public static void AddThycoticConfiguration(WebHostBuilderContext context, IConfigurationBuilder builder)
        {
            var configuration = builder.Build();
            builder.AddThycoticProvider(configuration);
        }
    }

    public class ThycoticProvider : ConfigurationProvider
    {
        private ConfigSettings _thycoticConfig;
        private SecretServerClient _thycoticClient;

        public ThycoticProvider(IConfiguration root)
        {
            this._thycoticConfig = root.GetSection("Thycotic").Get<ConfigSettings>();
            if (this._thycoticConfig == null)
                throw new ArgumentNullException("Thycotic section missing from appsettings.json");

            string path = null;
            string appSetting1 = root["Thycotic:SecretServerSdkKeyDirectory"];
            if (!string.IsNullOrWhiteSpace(appSetting1))
            {
                path = appSetting1;
                if (!System.IO.Directory.Exists(path))
                    System.IO.Directory.CreateDirectory(path);
            }

            //== Build a new SecretClient vs using the built-in to allow us control over the generated cache files.
            IDataProtector idataProtector = DataProtectorFactory.Create(path);
            string appSetting2 = root["Thycotic:SecretServerSdkConfigDirectory"];
            ISdkClientConfigProvider sdkClientConfigProvider = new SdkClientConfigProvider(idataProtector, appSetting2);
            ICacheClient cacheClient = new CacheClient(idataProtector, sdkClientConfigProvider);
            IOAuthClient oAuthClient = new OAuthClient(sdkClientConfigProvider);
            ISecretClient secretClient = new SecretClient((ILogger)new NoLogger(), (IRestClient)new RestClient(sdkClientConfigProvider), oAuthClient, cacheClient);

            this._thycoticClient = new SecretServerClient(new NoLogger(), sdkClientConfigProvider, cacheClient, secretClient);
            _thycoticClient.Configure(_thycoticConfig);

            // This array contains the section names of the appsettings.json that we wish to replace.
            string[] replacementSections = { "ConnectionStrings", "AppSettings" };

            foreach (string section in replacementSections)
            {
                foreach (var item in root.GetSection(section).GetChildren())
                {
                    if (item.Value == null)
                        continue;
                    if ((!item.Value.Contains("${") ? 0 : (item.Value.Contains("?") ? 1 : 0)) == 0)
                        continue;

                    int secretId;
                    var connParts = item.Value.Split('?');

                    if (connParts.Length == 2) // Only replace if string could be split into two parts.
                    {
                        string itemValue = connParts[0];


                        bool couldParseId = int.TryParse(connParts[1], out secretId);

                        if (couldParseId) // Only replace if secret id could be parsed from string.
                        {
                            var secret = _thycoticClient.GetSecret(secretId);
                            foreach (var secretItem in secret.Items)
                            {
                                itemValue = itemValue.Replace("${" + secretItem.FieldName + "}", secretItem.ItemValue, StringComparison.CurrentCultureIgnoreCase);
                            }
                            Data.Add($"{section}:{item.Key}", itemValue);
                        }
                    }
                }
            }

            
        }
    }

    public static class ConfigurationExtensions
    {
        public static IConfigurationBuilder AddThycoticProvider(this IConfigurationBuilder configuration, IConfiguration root)

        {
            configuration.Add(new ThycoticConfigurationSource(root));
            return configuration;
        }
    }

    internal class ThycoticConfigurationSource : IConfigurationSource
    {
        private IConfiguration configuration;

        public ThycoticConfigurationSource(IConfiguration configuration)
        {
            this.configuration = configuration;
        }

        public IConfigurationProvider Build(IConfigurationBuilder builder)
        {
            return new ThycoticProvider(configuration);
        }
    }
}
```