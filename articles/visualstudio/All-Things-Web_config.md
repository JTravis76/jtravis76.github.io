# All Things Web.config


## To directly access WebService via URL

URL string:
http://localhost:port/WebService1.asmx/MethodName?id=1&pg=2

```xml
  </system.web>
...
    <webServices>
      <protocols>
        <add name="HttpGet"/>
        <add name="HttpPost"/>
      </protocols>
    </webServices>
  </system.web>
```

## SMTP setting

```xml
<configuration>
...

  <system.net>
    <mailSettings>
      <smtp deliveryMethod="Network" from="no-reply@fbports.com">
        <network host="127.0.0.1"
                 port="25"
                 enableSsl="false"
                 defaultCredentials="true" />
      </smtp>
    </mailSettings>
  </system.net>
...
</configuration>
```
OR  
```xml
<mailSettings>
  <smtp deliveryMethod="SpecifiedPickupDirectory" from="signup@roadkillwiki.net">
    <!-- Roadkill caters for relative (~) paths in the drop folder -->
    <specifiedPickupDirectory pickupDirectoryLocation="~/App_Data/TempSmtp" />
  </smtp>
</mailSettings>
```

For the Release Web.config, use the xdt:Transorm="Replace"
```xml
  <system.net>
    <mailSettings>
      <smtp deliveryMethod="Network" from="no-reply@fbports.com">
        <network host="192.168.12.26" port="587" xdt:Transform="Replace" />
      </smtp>
    </mailSettings>
  </system.net>
```

## Include custom ASP tags

```xml
<system.web>
...
    <pages>
      <namespaces/>
      <controls>
        <add assembly="AjaxControlToolkit" namespace="AjaxControlToolkit" tagPrefix="ajaxToolkit"/>
        <add assembly="Microsoft.ReportViewer.WebForms, Version=11.0.0.0, Culture=neutral, PublicKeyToken=89845dcd8080cc91" namespace="Microsoft.Reporting.WebForms" tagPrefix="rsweb"/>
        <add assembly="System.Web.DataVisualization, Version=4.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35" namespace="System.Web.UI.DataVisualization.Charting" tagPrefix="asp"/>
      </controls>
    </pages>
...
</system.web>
```


## Encrypt / Decrypting ConnectionString


### Encrypting Connection String

1. Open Command Prompt with Administrator privileges
2. At the Command Prompt, enter: 
	cd C:\Windows\Microsoft.NET\Framework\v4.0.30319

3. In case your web Config is located in "D:\Articles\EncryptWebConfig" directory path, then enter the following to encrypt the ConnectionString: 
	ASPNET_REGIIS -pef "connectionStrings" "D:\Articles\EncryptWebConfig"

Use Aspnet_regiis.exe tool with the –pef option and specify the application path as shown above.

> Note: The parameter "connectionStrings" is case sensitive.


### Decrypting the Connection String

Simply perform the following command to decrypt the connectionStrings element in the Web.config file.
Only works on active computer that encryted the file.

ASPNET_REGIIS -pdf "connectionStrings" "D:\Articles\EncryptWebConfig"
