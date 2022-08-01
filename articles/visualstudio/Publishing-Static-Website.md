# Publishing Static Website in Visual Studio
To remove Folders and Files from Publish Deployment, you will need to edit website.publishproj (in VS 2017)

Locate `PropertyGroup` node and add the following:
* ExcludeFoldersFromDeployment
* ExcludeFilesFromDeployment

```xml
<PropertyGroup>
  ...
  <AssemblyVersion Condition="'$(AssemblyVersion)' == ''">1.0.0.0</AssemblyVersion>

  <ExcludeFoldersFromDeployment>
    src\scss;src\typings;src\typescripts;App_Data;node_modules;lib;.vscode;
  </ExcludeFoldersFromDeployment>

  <ExcludeFilesFromDeployment>
    packages.config;Readme.md;tsconfig.json;package.json;package-lock.json;rollup.config.js
  </ExcludeFilesFromDeployment>
    
</PropertyGroup>
```

Full example: *website.publishproj*
```xml
<Project ToolsVersion="4.0" xmlns="http://schemas.microsoft.com/developer/msbuild/2003">
  <PropertyGroup>
    <Configuration Condition=" '$(Configuration)' == '' ">Debug</Configuration>
    <Platform Condition=" '$(Platform)' == '' ">AnyCPU</Platform>
    <ProductVersion>10.0.30319</ProductVersion>
    <SchemaVersion>2.0</SchemaVersion>
    <ProjectGuid>{4dd2519d-af9f-40f0-9290-e3fd378edecd}</ProjectGuid>
    <SourceWebPhysicalPath>$(MSBuildThisFileDirectory)</SourceWebPhysicalPath>
    <SourceWebVirtualPath>/WISE</SourceWebVirtualPath>
    <TargetFrameworkVersion>v4.6.1</TargetFrameworkVersion>
    <SourceWebProject></SourceWebProject>
    <SourceWebMetabasePath></SourceWebMetabasePath>
  </PropertyGroup>
  <PropertyGroup>
    <VisualStudioVersion Condition="'$(VisualStudioVersion)' == ''">10.0</VisualStudioVersion>
    <!-- for VS2010 we need to use 10.5 but for VS2012+ we should use VisualStudioVersion -->
    <WebPublishTargetsVersion Condition=" '$(WebPublishTargetsVersion)' =='' and '$(VisualStudioVersion)' == 10.0 ">10.5</WebPublishTargetsVersion>
    <WebPublishTargetsVersion Condition=" '$(WebPublishTargetsVersion)'=='' ">$(VisualStudioVersion)</WebPublishTargetsVersion>

    <VSToolsPath Condition="'$(VSToolsPath)' == ''">$(MSBuildExtensionsPath32)\Microsoft\VisualStudio\v$(WebPublishTargetsVersion)</VSToolsPath>
    <_WebPublishTargetsPath Condition=" '$(_WebPublishTargetsPath)'=='' ">$(VSToolsPath)</_WebPublishTargetsPath>
    <AssemblyFileVersion Condition="'$(AssemblyFileVersion)' == ''">1.0.0.0</AssemblyFileVersion>
    <AssemblyVersion Condition="'$(AssemblyVersion)' == ''">1.0.0.0</AssemblyVersion>

    <ExcludeFoldersFromDeployment>
      src\scss;src\typings;src\typescripts;App_Data;node_modules;lib;.vscode;
    </ExcludeFoldersFromDeployment>

    <ExcludeFilesFromDeployment>
      packages.config;Readme.md;tsconfig.json;package.json;package-lock.json;rollup.config.js
    </ExcludeFilesFromDeployment>
    
  </PropertyGroup>

  <ItemGroup>
    <AssemblyAttributes Include="AssemblyFileVersion">
      <Value>$(AssemblyFileVersion)</Value>
    </AssemblyAttributes>
    <AssemblyAttributes Include="AssemblyVersion">
      <Value>$(AssemblyVersion)</Value>
    </AssemblyAttributes>
  </ItemGroup>
  <Import Project="$(_WebPublishTargetsPath)\Web\Microsoft.WebSite.Publishing.targets" />
</Project>
```

> For site that are in a sub-directory like `src`, try removing the `web.config`
and/or setting the Start URL: in the Property Pages to: 
[http://localhost:PORT/src]()
