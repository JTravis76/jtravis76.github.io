#meta-start
Title:Adding Mime Types to IIS Express
Created:8/27/2019
Category:iis
#meta-end
# Adding Mime Types to IIS Express

Open command prompt with administrator privilages.
Change Directory to either;

`C:\Program Files\IIS Express` or `C:\Program Files (x86)\IIS Express`

Run following command to add `JSON` file extension.

```bat
appcmd set config /section:staticContent /+[fileExtension='.json',mimeType='application/x-javascript']
```

Also, could browse and edit file located here: 

`C:\Users\<USERPROFILE>\Documents\IISExpress\config\applicationhost.config`

Search for `staticContent` and add the following to allow JSON files to be process.

```xml
<staticContent>
    ...
    <mimeMap fileExtension=".json" mimeType="text/x-javascript" />
</staticContent>    
```

> Might see an error this in the browser console.

```
HTTP404: NOT FOUND - The server has not found anything matching the requested URI (Uniform Resource Identifier).
GET - http://WebApp/fonts/bootstrap/glyphicons-halflings-regular.woff2
```

*web.config*
```xml
<system.webServer>
    <staticContent>
        <clientCache cacheControlCustom="public" cacheControlMode="UseMaxAge" cacheControlMaxAge="365.00:00:00" />
        <remove fileExtension=".woff" />
        <remove fileExtension=".woff2" />
        <mimeMap fileExtension=".woff" mimeType="application/x-font-woff" />
        <mimeMap fileExtension=".woff2" mimeType="application/font-woff2" />
    </staticContent>
</system.webServer>
```