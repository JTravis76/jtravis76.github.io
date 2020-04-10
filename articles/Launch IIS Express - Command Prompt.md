#meta-start
Title:Launch IIS Express via Command Prompt
Created:3-18-2020
Category:iis
#meta-end
# Launch IIS Express via Command Prompt
---
Often times I needed to host and test a web site locally. IIS Express installs with Visual Studio, does this very thing.

Site Ids can be listed by viewing the `applicationhost.config` file.

Open command prompt.
```bat
@"C:\Program Files (x86)\IIS Express\iisexpress.exe" /systray:true /config:C:\Users\<USERPROFILE>\Documents\IISExpress\config\applicationhost.config /siteid:1
```