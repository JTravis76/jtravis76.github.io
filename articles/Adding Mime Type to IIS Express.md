#meta-start
Title:Adding Mime Types to IIS Express
Link:adding-mime-types-to-iis-express
Created:8/27/2019
Category:iis
#meta-end
# Adding Mime Types to IIS Express
---

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