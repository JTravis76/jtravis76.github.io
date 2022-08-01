# Reading Data from WebClient
Needed a way to read the data from a HTTP endpoint. Below can be use for many applications.

```csharp
/*
 * If directly invoking a WebService, MUST use a FQDN such as; http://my.domain.com/Service1.asmx
 * CNAME is NOT supported!
 */

// Fetch URL from web.config appSettings
string host = ConfigurationManager.AppSettings["AppUrl"].ToString();

// Download a finished HTML page rendered with Razor
string htmlHeader = New System.Net.WebClient().DownloadString(host + "/Header.aspx");

// Could return a blob if PDF document
byte[] report = New System.Net.WebClient().DownloadString(host + "/report?id=123");
```