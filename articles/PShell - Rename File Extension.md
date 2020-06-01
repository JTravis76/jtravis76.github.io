#meta-start
Title:Rename File Extension - Powershell
Created:6-1-2020
Category:pshell
#meta-end
#Rename File Extension

Often times I share code via email and some mail providers; like Google, will remove/reject attachments ending in .js (javascript). Even when they are zipped. So the best way to transport safely, is too renamed to the file exenstions to .ts (typescript).

```ps
$dir = Get-ChildItem "C:\Users\public\source\repos\my-project\src" -Recurse
$list = $dir | where {$_.Extension -eq ".js"}


foreach($file in $list)
{
    $file | Rename-Item -NewName { [io.path]::ChangeExtension($_.name, "ts")}
}

```