#meta-start
Title:On-Premise Nuget Server
Created:3-18-2020
Category:nuget
#meta-end
# On-Premise Nuget Server

NuGet Instructions
NuGet has now gone live at the PORTS plant. Instruction below will get you up and going quickly.
STEP 1: Nuget setup for Visual Studio
This step will guide you in the setup of Visual Studio by fetching packages from the Ports.Nuget repository.
Open Visual Studio
From the menu, click Tools -> Options
On left pane, click NuGet Package Manager - > Package Sources
Click the green plus button
Name: Ports.Nuget
Source: http://devapps2/Ports.Nuget/nuget

![fig-1](./articles/nuget/img/fig-1.png)
 
NOTE:  For testing Nuget packages, it’s recommend that you create a local repository. Simply repeat the steps above and for the Name/Source. Point to your local directory.
![fig-2](./articles/nuget/img/fig-2.png) 

Viewing NuGet packages by change the package source options.
![fig-3](./articles/nuget/img/fig-3.png)
 

STEP 2: Download Nuget.exe
If don’t already have, visit this link to download a version of nuget.exe.
https://dist.nuget.org/index.html 

STEP 3: Creating a nuspec file
A .nuspec file is an XML manifest that contains package metadata. This is used both to build the package and to provide information to consumers. The manifest is always included in a package.
I found a few ways of creating these files, but this option in my opinion, is much more flexible by starting with a basic template.
Open Command Prompt
Browse to where you saved your nuget.exe
Run following command to create a basic “Package.nuspec”
C:\>Nuget spec

![fig-4](./articles/nuget/img/fig-4.png)
 
NOTE: You could build this file directly from the project folder where your .csproj is located, but it seem to grab more/less files than expected. Could do this, if ONLY packaging a single assembly (DLL) file.


STEP 4: Editing a nuspec file
Once the basic Package.nuspec created, now open the file with Notepad++ or your favorite text editor to edit the default contents. Update the Title, Version, etc. to match your application.
NOTE:  When editing the NUSPEC file, to maintain consistency, please use the suffix PORTS.namespace or PORTS.application.

Adding files manually:
Files can be added via the <files> tags. Should follow directly behind the <metadata> tag. Basic schema is the following: 

```xml
<?xml version="1.0"?>
<package >
  <metadata>
    ..
  </metadata>
  	<files>
	   <file src="C:\Users\Public\Visual Studio 2015\Projects\PORTS\PORTS.Extensions\bin\Release\PORTS.Extensions.dll" target="lib\PORTS.Extensions.dll" />
	   <file src="C:\Users\Public\Visual Studio 2015\Projects\PORTS\PORTS.Extensions\Readme.txt" target="Readme.txt" />
	</files>
</package>
```

Full NUSPEC schema can be found here. Especially dealing with Dependencies.
https://docs.nuget.org/ndocs/schema/nuspec
NOTE:  Add a Readme.txt to the root, will auto-open upon install to provide users with descriptions or code examples, etc. (see example above)

STEP 5: Creating a Nuget Package
Open Command Prompt
Browse to where you saved your nuget.exe
Run following command to pack files.
C:\>nuget.exe pack C:\Users\KDJ\Desktop\Package.nuspec  

![fig-5](./articles/nuget/img/fig-5.png)

You will notice a warning about a framework folder. Since this project doesn’t have any MS Framework dependencies, you can safety ignore this message.







STEP 6: Viewing a Nuget Package
Nuget packages can be opened with 7-zip manager. Can also add/remove files by drag n’ drop to further customize the package.
![fig-6](./articles/nuget/img/fig-6.png) 


STEP 7: Testing a Nuget Package from local repository
It is recommend to test the packages before uploading to Ports.Nuget central repository. See step 1 for local NuGet repository setup for Visual Studio.

STEP 8: Uploading a Nuget Package to Ports.Nuget
This step will upload your Nuget package to Ports.Nuget to be share among your co-workers. Pushing packages require a password. nugget_owner1 (all lower-case).
Open Command Prompt
Browse to where you saved your nuget.exe
Run following command to pack files.
C:\> nuget.exe push PORTS.Extensions.1.0.0.0.nupkg nuget_owner1 -Source http://devapps2/Ports.Nuget/api/v2/package  


```
:: PACK
nuget.exe pack C:\Users\KDJ\Desktop\PORTS.Sample.nuspec

:: PUBLISH
::nuget.exe push {package file} {apikey} -Source http://devapps2/Ports.Nuget/nuget

nuget.exe push PORTS.Sample.1.0.0.nupkg nuget_owner1 -Source http://devapps2/Ports.Nuget/nuget

```