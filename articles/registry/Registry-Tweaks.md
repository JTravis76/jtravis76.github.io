#meta-start
Title:Windows Registry Tweaks
Created:8-11-2020
Category:registry
#meta-end
# Windows Registry Tweaks

Table of Contents
* Reset `Document` folder
* Open JSON result in IE 11
* Chrome Extension

## Reset `Document` folder

A company I worked for, pushed a GPO policy that would map a shared folder as a replacement to the Window's Document directory. Which is fine in most cases. But often see
issues when using Visual Studio/ IIS Express application during network slow downs. This is because some application use variable path to find special directories like; %USERPROFILE%, or %SYSTEMDRIVE%.

Below snippet will reset the Document path back to the default.

> NOTE! the Hex string is currently set to: `%USERPORFILE%\Document`

```reg
Windows Registry Editor Version 5.00

[HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Explorer\User Shell Folders]
"Personal"=hex(2):25,00,55,00,53,00,45,00,52,00,50,00,52,00,4f,00,46,00,49,00,\
  4c,00,45,00,25,00,5c,00,44,00,6f,00,63,00,75,00,6d,00,65,00,6e,00,74,00,73,\
  00,00,00
"{F42EE2D3-909F-4907-8871-4C22FC0BF756}"=hex(2):25,00,55,00,53,00,45,00,52,00,\
  50,00,52,00,4f,00,46,00,49,00,4c,00,45,00,25,00,5c,00,44,00,6f,00,63,00,75,\
  00,6d,00,65,00,6e,00,74,00,73,00,00,00
"Documents"=hex(2):25,00,55,00,53,00,45,00,52,00,50,00,52,00,4f,00,46,00,49,00,\
  4c,00,45,00,25,00,5c,00,44,00,6f,00,63,00,75,00,6d,00,65,00,6e,00,74,00,73,\
  00,00,00

[HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Explorer\Shell Folders]
"Personal"="C:\\Users\\KDJ\\Documents"
"Documents"="C:\\Users\\KDJ\\Documents"
```

### Additional Tip

Create a batch `reset-doc.bat` and copy/paste the following.

> Note: Windows is not updated until you restart the explorer.exe

```bat
@Echo Off
:: Import the registry file
REG IMPORT DocumentFolder.reg
:: Stop the application
taskkill /F /IM explorer.exe
:: Start the application
explorer.exe
```

## Open JSON result in IE 11

```reg
Windows Registry Editor Version 5.00;
; Tell IE 7,8,9,10,11 to open JSON documents in the browser on Windows XP and later.
; 25336920-03F9-11cf-8FD0-00AA00686F13 is the CLSID for the "Browse in place" .
;
[HKEY_CLASSES_ROOT\MIME\Database\Content Type\application/json]
"CLSID"="{25336920-03F9-11cf-8FD0-00AA00686F13}"
"Encoding"=hex:08,00,00,00
```

## Chrome Extension

Often time companies will use Google's Admin console to administer the Chrome browser. If they blacklist [ALL] extensions from allowing install, below will add extension id to whitelist to allow installation.

> NOTE: Extenstion ID `nhdogjmejiglipccpnnnanhbledajbpd` is for Vue.JS Dev Tools

```reg
Windows Registry Editor Version 5.00

[HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Google\Chrome\ExtensionInstallWhitelist]
"2"="nhdogjmejiglipccpnnnanhbledajbpd"

[HKEY_LOCAL_MACHINE\SOFTWARE\WOW6432Node\Policies\Google\Chrome\ExtensionInstallWhitelist]
"2"="nhdogjmejiglipccpnnnanhbledajbpd"
```