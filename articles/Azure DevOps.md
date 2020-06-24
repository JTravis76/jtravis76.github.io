#meta-start
Title:Azure Devops CI CD
Created:5/12/2020
Category:azure
#meta-end
# Azure Devops CI/CD

## Agents: Build | Release

Agents can be use for both Build or Release defintions.

* Build Definition
  * setup tasks required for build
  * setup triggers for auto building upon commits
* Release Definition
  * Setup rules for Artifacts and Enviroments
  * Auto | Manual deployment with tags

[Predefined Agent Variables](https://docs.microsoft.com/en-us/azure/devops/pipelines/build/variables?view=azure-devops&tabs=yaml)\
[Self-hosted Windows Agents](https://docs.microsoft.com/en-us/azure/devops/pipelines/agents/v2-windows?view=azure-devops)
___
## Installing Agents

Below sample script will install an agent named `PA13078-A1` in Agent Pool `PA13078` ans run as a service.
```ps
.\config.cmd --pool "PA13078" --agent "PA13078-A1" --runasservice --work '_work' --url 'http://ddptfs01:8080/tfs/' --auth Integrated
```

Deployment Groups\
_(Deployment Pools => Deployment Group => Project)_

> NOTE: Deployment Groups are for parallel installs for multi-servers. IIS Deployment tasks can ONLY be ran local to the IIS server. Cannot be push to remote IIS web servers.

```ps
.\config.cmd --deploymentgroup --deploymentgroupname "Deployment Pool 1" --agent $env:COMPUTERNAME --runasservice --work '_work' --url 'http://ddptfs01:8080/tfs/' --collectionname 'DefaultCollection' --projectname 'Toolbox' --auth Integrated;
```

### `_WORK` Directory:

The `_work` directory consist many folders to divide the work.

* `_tasks` - downloaded tasks to be perform by agent based on pipline
* `_tool` - a cache copy of Nuget and/or Node
* `1` - first **build** project executed by agent
  * `a` - publish artifacts folder
  * `s` - project source from TFS
* `r1` - first **release** project executed by agent
  * `a` - downloaded artifacts folder

### `_TOOL` Directory
The `_tool` directory consist of tools to assist in many building tasks, such as; nuget package restore, node/npm commands, etc;

Depending on your corporate firewall policy, may need to add tools to the agent directory manually. Below are example for Nuget and NodeJs.

>**NOTE:** x64.complete is a empty file with the extension `.complete`

```
+ _tools

+-- Nuget
+---- 5.3.0
+------ x64
+-------- nuget.exe
+------ x64.complete

+-- Node
+---- 12.13.1
+------ x64
+-------- node_modules
+-------- node.exe
+-------- npm
+-------- npm.cmd
+------ x64.complete
```

To set a Enviroment path temporary, use the following Powershell.

```powershell
Clear-Host
# note the leading comma
$env:Path += ";$(Agent.ToolsDirectory)\Sass\1.15.3\x64";

#optional way, this will not append
[System.Environment]::SetEnvironmentVariable("Path", "$(Agent.ToolsDirectory)\_tool\Sass\1.15.3\x64", [System.EnvironmentVariableTarget]::Process);
```
___
## Nuget

If a build requires restoring Nuget packages, must include `Nuget.config` in your project with the following package feeds.

>**Note:** `Nuget.config` is better place at root of repo to be shared across all branches. 
_This would resulting in downloading the root repo and cloaking other branches._ May also result in cloaking newly added branches 

```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <solution>
    <add key="disableSourceControlIntegration" value="true" />
  </solution>
  <config>
    <add key="repositoryPath" value=".\packages" />
  </config>
  <packageSources>
    <add key="nuget.org" value="https://www.nuget.org/api/v2/" />
    <add key="PORTS.Nuget" value="http://devapps2/Ports.Nuget/nuget/" />
  </packageSources>
</configuration>
```

### Nuget Restore vs. Dotnet Restore
Both restore works a bit differently. Nuget restore can restore packages for both Framework and Core projects, but Framework requires there is a `packages` directory within the solution for successful builds.

Dotnet restore is a wrapper around nuget.exe, but Core application reference packages from the `.nuget` folder of the user's profile. Therefore, does nnot need to be copied to solution prior to building. This action mainly updates the cache directory.

Azure DevOps (on-premise) server needs access to download Nuget.exe and Packages.
* https://dist.nuget.org/win-x86-commandline/v5.3.0/nuget.exe
* https://www.nuget.org/api/v2 

> When working off-line or disconnected from internet, MUST use a cache directory. _This directory can be quite large, several GB+_

Nuget.exe cache directory for agents.
```
- _work
-- _tool
--- NuGet
---- 5.3.0
----- x64.complete (empty file)
----- x64
------ nuget.exe
```

> If desire a certain Nuget.exe version used by Visual Studio. Click Help-> About Microsoft Visual Studio  scroll to `Nuget Package Manager`

**Nuget Package Cache**

Pre-downloaded packages can be placed in the following user's directory running the agent service.

```
C:\Users\<USER>\.nuget\packages
```

___
## NPM Powershell Tasks

When using a service account to run NPM related tasks, need to update the `.npmrc` file located here: C:\Users\<NAME>\.npmrc

> NOTE: when using an on premise NPM server, you may scope the registry for additional downloads.

*.npmrc*
```
@ports:registry=http://devapps2:8080/
registry=https://registry.npmjs.org/
strict-ssl=false
```

Below task will create a NPM shrinkwrap file due to security risk with tar@2.0.0.
Install packages and finally execute NPM scripts

> NOTE: the `npm ci` command. This will restore packages from the package-lock.json
```ps
New-Item -Path . -Name "npm-shrinkwrap.json" -ItemType "file" -Value '{"lockfileVersion": 1,"dependencies": {"tar": {"version": "2.0.0","from": "tar@^2.0.0","dependencies": {"connect": {"version": "3.0.0","from": "tar@^2.0.0"}}}}}';
npm install node-sass@4.13.0 rollup@1.27.8
npm ci
npm run tsc
npm run build
```

May need to remove the VUEX type definition when using strongly-typed store.

```ps
# remove VUEX type definition
$path = "$(Build.SourcesDirectory)\node_modules\vuex\types\vue.d.ts"

if (Test-Path -Path $path -PathType Leaf) 
{
    Remove-Item -Path $path -Force
}
```

Update assembly information with Build and Revision (ChangeSet) numbers.
```ps
$path = "$(Build.SourcesDirectory)\$(Build.DefinitionName)\Source\WISE.Api\Properties\AssemblyInfo.cs"
$a = Get-Content -Raw -Path $path

if ($a -match '\d+.\d+.\d+.\d+')
{
    $b = $Matches[0].Split('.')

    if ($b.Count -gt 0)
    {
        $z = ""
        # Get ONLY the Major and Minor Version
        for ($c = 0; $c -lt $b.Length - 2; $c++)
        {
            $z += ($b.Item($c) + ".")
        }

        # Add Build and Revision (ChangeSet)
        $z += ("$(Build.BuildNumber)" + "." + "$(Build.SourceVersion)")

        $a = $a.Replace($Matches[0], $z)
    }
}
else
{
    # Writes an error to build summary and log it in red text
    Write-Host  "##vso[task.LogIssue type=error;]Fail to update version"
    exit 1
}

Set-Content -Path $path -Value $a -Force -Encoding UTF8
```

Update Vue JS configuration information with Build and Revision (ChangeSet) numbers.
```ps
$path = "$(Build.SourcesDirectory)\src\store\modules\configuration.ts"
$a = Get-Content -Raw -Path $path

# Update Base URL with port pattern
$a = $a -replace 'http://localhost:\d+/', $Env:BaseApi

# Update Enviroment
$a = $a.Replace('LOCAL', $Env:Enviroment)

# Update Netcenter API
$a = $a.Replace('http://netcenterapidev/', $Env:NetcenterApi)

# Update Version with Build & Revision (ChangeSet) number
if ($a -match '\d+.\d+.\d+.\d+')
{
    $b = $Matches[0].Split('.')

    if ($b.Count -gt 0) 
    {
        $z = ""
        # Only fetch the Major and Minor version
        for ($d = 0; $d -lt ($b.Length - 2); $d++)
        {
            $z += ($b.item($d) + ".")
        }
        $z += ("$(Build.BuildNumber)" + '.' + "$(Build.SourceVersion)")

        $a = $a.Replace($Matches[0], $z)
    }
}
else
{
    # Writes an error to build summary and to log in red text
    Write-Host  "##vso[task.LogIssue type=error;]Fail to update version"
    exit 1
}

Set-Content -Path $path -Value $a -Force -Encoding UTF8
```

When publishing a front-end web application in the public folder.
> This script is use BEFORE any MSBUILD task to pack a website with a `*.publishproj`

```ps
Clear-Host
$name = "*.publishproj"
$path = ("$(Build.SourcesDirectory)\" + $name)
$dest = ("$(Build.SourcesDirectory)\public\")

Move-Item -Path $path -Destination $dest -Force

# Clean publish folder
if (Test-Path -Path "$(Build.SourcesDirectory)\App_Data\publish" -PathType Container)
{
    Remove-Item -Path "$(Build.SourcesDirectory)\App_Data\publish" -Recurse
}
```

Setup a temporary enviroment path to a tool.

```ps
Clear-Host
# NOTE the leading comma
$env:Path += ";$(Agent.ToolsDirectory)\Sass\1.15.3\x64";

# now able to run the command
sass "\wwwroot\scss\index.scss" "\wwwroot\css\site.css" --no-source-map
```

Setup vue to use minified version for QA/Prod depolyments:

> NOTE: this currently for requiredjs config

```ps
Clear-Host

$path = "$(Build.SourcesDirectory)\index.html"
$a = Get-Content -Raw -Path $path

<# Look for vue in a requirejs.config() object 
    and set to use minified version
#>
if ($a -match '("vue": "vue",)')
{
    $a = $a -replace '"vue": "vue",', '"vue": "vue.min",'
    $a = $a -replace 'urlArgs:', '//urlArgs:'
}
else
{
    # Writes to build summary
    Write-Host  "##vso[task.LogIssue type=warning;]Fail to set requirejs config."
    #exit 1
}

Set-Content -Path $path -Value $a -Force -Encoding UTF8
```
___
## MSBUILD
MSBuild is use to compile project codes into assemblies.

Here are some basic properties switches:
```
/p:DeployOnBuild=true 
/p:WebPublishMethod=Package | FileSystem
/p:PackageAsSingleFile=true 
/p:SkipInvalidConfigurations=true 
/p:PackageLocation="$(build.artifactstagingdirectory)\\"
/p:PublishUrl="$(build.artifactstagingdirectory)\\"
/p:OutputPath="$(build.artifactstagingdirectory)\\"
/p:DeleteExistingFiles=True

/p:LastUsedBuildConfiguration="Release" 
/p:LastUsedPlatform="Any CPU"

# SLN files
/p:Configuration=Release /p:Platform="Any CPU"

# Use a Publishing profile
/p:PublishProfile="**\App_Data\PublishProfiles\Website.pubxml"
```

### Build specific targets in solutions by using MSBuild.exe
[MS weblink](https://docs.microsoft.com/en-us/visualstudio/msbuild/how-to-build-specific-targets-in-solutions-by-using-msbuild-exe?view=vs-2019)

> Specify the target after the -target: switch in the format <ProjectName>:<TargetName>. If the project name contains any of the characters %, $, @, ;, ., (, ), or ', replace them with an _ in the specified target name.

```
msbuild.exe <SolutionName>.sln -target:Database\Toolbox_DB:Rebuild;Database\Toolbox_DB:Clean
```

___
## DotNet Core

Assembly version is stored in the *.csproj file.

> NOTE: if project version is default `1.0.0`, it is ignored from this file.

To meet the requirements for proper versioning, add the additional Revision.

```xml
  <PropertyGroup>
    <TargetFramework>netcoreapp2.1</TargetFramework>
    <Version>1.0.0.0</Version>
  </PropertyGroup>
```

When using MSBUILD to publish, must first run `dotnet restore` before running `msbuild /m `

>Note: when working with mutiple SDK of Net Core, place a `global.json` file at root of branch.

```json
{
  "sdk": {
    "version": "2.1.510"
  }
}
```

### Known Issues
Build was failing when executed from another drive (E:) instead of (C:) where the SDK installed.

Could be related to a fallback path not reachable.
```xml
<ItemGroup>
    <Reference Include="Microsoft.AspNetCore.Http.Features">
        <HintPath>..\..\..\..\..\..\..\..\Program Files\dotnet\sdk\NuGetFallbackFolder\microsoft.aspnetcore.http.features\2.1.1\lib\netstandard2.0\Microsoft.AspNetCore.Http.Features.dll</HintPath>
    </Reference>
</ItemGroup>
```

[Solution] Replacing with a Nuget package.
```xml
<ItemGroup>
    <PackageReference Include="Microsoft.AspNetCore.Http.Features" Version="2.1.1" />
</ItemGroup>
```  

```
Build FAILED.

    "E:\agents\A2\_work\5\s\UMAS-DEV-CI\Development\Source\UMAS.sln" (UMAS_Api target) (1) ->
    "E:\agents\A2\_work\5\s\UMAS-DEV-CI\Development\Source\UMAS.Api\UMAS.Api.csproj" (default target) (2) ->
    "E:\agents\A2\_work\5\s\UMAS-DEV-CI\Development\Source\UMAS.Infrastructure\UMAS.Infrastructure.csproj" (default
    target) (4:2) ->
    (ResolveAssemblyReferences target) ->
        C:\Program Files (x86)\Microsoft Visual Studio\2017\Professional\MSBuild\15.0\Bin\Microsoft.Common.CurrentVers
    ion.targets(2110,5): warning MSB3245: Could not resolve this reference. Could not locate the assembly "Microsoft
    .AspNetCore.Http.Features". Check to make sure the assembly exists on disk. If this reference is required by you
    r code, you may get compilation errors. [E:\agents\A2\_work\5\s\UMAS-DEV-CI\Development\Source\UMAS.Infrastructu
    re\UMAS.Infrastructure.csproj]


    "E:\agents\A2\_work\5\s\UMAS-DEV-CI\Development\Source\UMAS.sln" (UMAS_Api target) (1) ->
    "E:\agents\A2\_work\5\s\UMAS-DEV-CI\Development\Source\UMAS.Api\UMAS.Api.csproj" (default target) (2) ->
    "E:\agents\A2\_work\5\s\UMAS-DEV-CI\Development\Source\UMAS.Infrastructure\UMAS.Infrastructure.csproj" (default
    target) (4:2) ->
    (CoreCompile target) ->
        Interfaces\IMedia.cs(28,36): error CS0234: The type or namespace name 'AspNetCore' does not exist in the names
    pace 'Microsoft' (are you missing an assembly reference?) [E:\agents\A2\_work\5\s\UMAS-DEV-CI\Development\Source
    \UMAS.Infrastructure\UMAS.Infrastructure.csproj]
        Services\Documentum\DocumentumSvc.cs(261,43): error CS0234: The type or namespace name 'AspNetCore' does not e
    xist in the namespace 'Microsoft' (are you missing an assembly reference?) [E:\agents\A2\_work\5\s\UMAS-DEV-CI\D
    evelopment\Source\UMAS.Infrastructure\UMAS.Infrastructure.csproj]
```

## Appcmd.exe
---

Appcmd.exe is located at this directory; `C:\Windows\System32\inetsrv`

To set windows authentication

```cmd
appcmd.exe set config "Default Web Site/SiteName" /section:windowsAuthentication /enabled:true /commit:apphost
```

To set binding on a Site

> NOTE: may also use DNS CNAME

```cmd
appcmd.exe set site "SiteName" /bindings:http/*:80:yourcustomdomain.com
```

___
## Deploying DACPAC with SqlPackage.exe

> Be sure to have the latest release build of DACPAC before beginning.

```
msbuild "C:\Users\<%USERPROFILE%>\source\Workspaces\WasteContainer\Development\Source\WasteContainer.sln" -target:Database\WasteContainer_DB /p:Configuration=Release /p:Platform="Any CPU"
```

Once installed on the computer/SQL server, located here: "C:\Program Files\Microsoft SQL Server\150\DAC\bin\SqlPackage.exe".
Was able to test against the (localdb)\MSSQLLocalDB version.
When passing a profile XML as one of the command switches, the following results were noted:

_Test results from Azure Devops CD_
* publish.xml -> TargetConnectionString with `Integrated Security=True;` passed successfully but could **not** located the database nor table on SQL server.
* publish.xml -> TargetConnectionString with `User ID=sa;Password=****;` failed with error that "Login failed for user 'sa'"

However, running the command locally on the computer/SQL Server worked both ways.

> NOTE. Before running the below command, could generate the insert scripts prior to publishing.  
This was performed in DEV to restore the existing data after the DACPAC updates were applied.

Full example of command:
```
"C:\Program Files\Microsoft SQL Server\150\DAC\bin\SqlPackage.exe" /action:publish /sourcefile:"E:\Toolbox.DB.dacpac" /profile:"E:\Toolbox.DB.publish.xml"
```

**Drawbacks:**
* Agent would need to be installed on each SQL Server.
* Although DACPAC can create new database, may need to pre-setup with desired user id and password to control permissions.

## Further local testing with DACPAC

Found that DACPAC with Create, Update, and apply post-scripts. Also provide errors if attempting to change a column
name, apply the same script to insert records on table with constraints


# WimRM - Sql DacpacDeploy

WinRM HTTP port: 5985
WinRM HTTPS port: 5986




agent.diagnostic = true


# Release - Continous Delivery CD

## Variable Library

> NOTE: when using a variable library in a Release, the values are copied. In an event of an error, will need to create a new Release once the error has been corrected.

When using service account for release tasks, based on company policies. Could prevent internet firewall proxy from working.