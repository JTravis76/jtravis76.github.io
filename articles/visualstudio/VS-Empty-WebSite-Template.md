#meta-start
Title:Empty WebSite Template
Created:10-29-2020
Category:visualstudio
#meta-end
# Empty WebSite Template - Visual Studio

In Visual Studio 2019, the Empty Website template seem to be missing. Below is how to setup manually
in the solution.

*yourSolution.sln*  
Below we created in VS 2017. The main parts between the `Project(` and `EndProject` section.

> NOTE: Be sure to change the port number used

```

Microsoft Visual Studio Solution File, Format Version 12.00
# Visual Studio 15
VisualStudioVersion = 15.0.28307.960
MinimumVisualStudioVersion = 10.0.40219.1
Project("{E24C65DC-7377-472B-9ABA-BC803B73C61A}") = "WebSite1", "WebSite\", "{EECC4E67-CD46-4FA4-B170-F935ADAD0DA5}"
	ProjectSection(WebsiteProperties) = preProject
		TargetFrameworkMoniker = ".NETFramework,Version%3Dv4.7.2"
		Debug.AspNetCompiler.VirtualPath = "/localhost_54343"
		Debug.AspNetCompiler.PhysicalPath = "WebSite1\"
		Debug.AspNetCompiler.TargetPath = "PrecompiledWeb\localhost_54343\"
		Debug.AspNetCompiler.Updateable = "true"
		Debug.AspNetCompiler.ForceOverwrite = "true"
		Debug.AspNetCompiler.FixedNames = "false"
		Debug.AspNetCompiler.Debug = "True"
		Release.AspNetCompiler.VirtualPath = "/localhost_54343"
		Release.AspNetCompiler.PhysicalPath = "WebSite1\"
		Release.AspNetCompiler.TargetPath = "PrecompiledWeb\localhost_54343\"
		Release.AspNetCompiler.Updateable = "true"
		Release.AspNetCompiler.ForceOverwrite = "true"
		Release.AspNetCompiler.FixedNames = "false"
		Release.AspNetCompiler.Debug = "False"
		VWDPort = "54343"
		SlnRelativePath = "WebSite1\"
		DefaultWebSiteLanguage = "Visual C#"
	EndProjectSection
EndProject
Global
	GlobalSection(SolutionConfigurationPlatforms) = preSolution
		Debug|Any CPU = Debug|Any CPU
	EndGlobalSection
	GlobalSection(ProjectConfigurationPlatforms) = postSolution
		{EECC4E67-CD46-4FA4-B170-F935ADAD0DA5}.Debug|Any CPU.ActiveCfg = Debug|Any CPU
		{EECC4E67-CD46-4FA4-B170-F935ADAD0DA5}.Debug|Any CPU.Build.0 = Debug|Any CPU
	EndGlobalSection
	GlobalSection(SolutionProperties) = preSolution
		HideSolutionNode = FALSE
	EndGlobalSection
	GlobalSection(ExtensibilityGlobals) = postSolution
		SolutionGuid = {8A05846C-91F7-4036-9919-89E820BF521D}
	EndGlobalSection
EndGlobal
```