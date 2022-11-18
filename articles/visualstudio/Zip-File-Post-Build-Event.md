# Zip File On Post Build Event

copy/paste code into project's Properties -> Build Events.

> MUST have 7zip command line exe installed!!

Tested in Visual Studio 2015

Below snippet will collect the desired files and zip into a compress directory.

```
if $(ConfigurationName) == Release (
"C:\Program Files (x86)\7-Zip\7z.exe" a -tzip "$(TargetDir)SomeProjectName-v1.0.0.0.zip" "$(TargetDir)*.dll" "$(TargetDir)*.config" "$(TargetDir)SomeProject.exe" "$(TargetDir)x64" "$(TargetDir)x86"
)
```