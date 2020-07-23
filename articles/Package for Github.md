#meta-start
Title:Building and Publishing ASP.NET Core to Nuget & Github
Created:7-23-2020
Category:other
#meta-end
# Building and Publishing ASP.NET Core to Nuget & Github

* CD into directory with *.csproj
* dotnet restore
* dotnet pack -c Release
* dotnet nuget push bin\Release\EntityGraphQL.0.60.2.nupkg -k nuget_owner1 -s http://devapps2/Ports.Nuget/nuget
* Github requires additional authentication. Must obtain a token key from your Github profile.
* Create a file; `nuget.config` in the project directory if one is not present.
* dotnet command will bubble up the directory to locate the nearest one.
* In the nuget.config, paste in the following, replacing <UserName> and <TokenPWd>:
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
        <clear />
        <add key="nuget.org" value="https://www.nuget.org/api/v2/" />
        <add key="PORTS.Nuget" value="http://devapps2/Ports.Nuget/nuget/" />
        <add key="GH:<UserName>" value="https://nuget.pkg.github.com/<UserName>/index.json" />
    </packageSources>
    <packageSourceCredentials>
        <github>
            <add key="Username" value="<LoginName>" />
            <add key="ClearTextPassword" value="<TokenPwd>" />
        </github>
    </packageSourceCredentials>
</configuration>
```
* NOTE: must use nuget.exe, not dotnet.exe
* nuget push bin\Release\EntityGraphQL.0.60.2.nupkg -ApiKey <TokenPwd> -src GH:<UserName>


## Other Things:

You can add sources to the global nuget.config.

```
nuget.exe sources Add -Name "GH:jtravis76" -Source https://nuget.pkg.github.com/jtravis76/index.json
```