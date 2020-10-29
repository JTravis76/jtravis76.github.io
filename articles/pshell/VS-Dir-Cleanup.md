#meta-start
Title:Visual Studio Project Directory Cleanup
Created:10-29-2020
Category:pshell
#meta-end
# Visual Studio Project Directory Cleanup
In my main VS project named; `JT-Toolbox`, contains many example projects of things I figured out, just playing with, or tips from the internet. Sometimes, I needed to zip the entire solution folder when transporting. This PowerShell snippet with delete all the `bin` and `obj` directories in every projects.

```powershell
Clear-Host

$directories = Get-ChildItem -Path "%USERPROFILE%\source\repos\JT-Toolbox" -Directory -Recurse

foreach ($directory in $directories)
{
    if ($directory.Name -eq "bin" -or $directory.Name -eq "obj")
    {
        Remove-Item -Path $directory.FullName -Recurse
    }
}
```