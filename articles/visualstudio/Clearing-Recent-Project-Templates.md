#meta-start
Title:Clearing the Recent Project Templates in Visual Studio 2017
Created:8-13-2020
Category:visualstudio
#meta-end

# Clearing the Recent Project Templates in Visual Studio 2017

Often times when exploring other project templates in Visual Studio 2017, the recent template list gets a bit overwhelming. Here are some instructions how to clear the list to start over.

![vs-fig1](./articles/visualstudio/img/vs-fig1.png)

* First and most important, close all instances of Visual Studios
* Locate the `privateregistry.bin` file in the following directory; %USERPROFILE%\AppData\Local\Microsoft\VisualStudio\15.0_21b5ff65
    * NOTE: your exact instance may differ from 15.0_21b5ff65
* Open Registry (RegEdit) as Administrator
* In the left pane, click and highlight `HKEY_LOCAL_MACHINE`
* From menu, click File -> Load Hive...
* Browse to above file path and select `privateregistry.bin`. Click OK
* Enter a key name; VS2017
* Expand HKEY_LOCAL_MACHINE to see new key VS2017
> NOTE !! do not attempt to open Visual while connected to hive !!
* Browse to the two node listed in the REG snippet below and edit values
    * OR may create a *.reg of the snippet below and import into Registry
* Select and highlight key VS2017
* Click File -> Unload Hive...
* Open Visual Studio 2017

```reg
Windows Registry Editor Version 5.00

; !! Important !! Must update 15.0_21b5ff65 to match your instance == !!

[HKEY_LOCAL_MACHINE\VS2017\Software\Microsoft\VisualStudio\15.0_21b5ff65\ApplicationPrivateSettings\Platform\ProjectMRU]
"MRUTemplates"="0[]"

[HKEY_LOCAL_MACHINE\VS2017\Software\Microsoft\VisualStudio\15.0_21b5ff65\ApplicationPrivateSettings\_metadata\baselines\Platform\ProjectMRU]
"MRUTemplates"="1[]"
```

![vs-fig2](./articles/visualstudio/img/vs-fig2.png)