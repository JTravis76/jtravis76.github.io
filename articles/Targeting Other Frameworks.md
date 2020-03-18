#meta-start
Title:Conditional Targeting Other Frameworks
Link:conditional-targeting-other-frameworks
Created:3-18-2020
Category:dotnetcore
#meta-end
# Conditional Targeting other frameworks
Below are some example how to conditionaling target other frameworks when building in .NET Core

```xml
<ItemGroup Condition=" '$(TargetFramework)' == 'net461' OR '$(TargetFramework)' == 'net46' OR '$(TargetFramework)' == 'net452' OR '$(TargetFramework)' == 'net451' OR '$(TargetFramework)' == 'net45'">
<!-- // HttpClient for full .NET -->
<Reference Include="System.Net.Http" />
<Reference Include="System.Web" />
</ItemGroup>

<ItemGroup Condition=" '$(TargetFramework)' == 'netstandard2.0' OR '$(TargetFramework)' == 'netcoreapp2.1' ">
<!-- // HttpClient for .NET Core -->
<!--<PackageReference Include="System.Net.Http" Version="4.3.3" />-->
</ItemGroup>
```