#meta-start
Title:Event Log - Powershell
Created:6-1-2020
Category:pshell
#meta-end
#Event Log - Powershell

While setting up logging for .NET Core, I was experimenting writing to a Window's Event Log. Below is a PowerShell example.

> Netcenter AD Sync was a Windows Service application and this logged the activities.

```ps
#-- Creates a new log and source. Expend Application in the node tree.
New-EventLog -LogName "Netcenter AD Sync" -Source NetcenterADSyncService

#-- Write a test log
Write-EventLog -LogName "Netcenter AD Sync" -Source NetcenterADSyncService -EventId 0 -Message "This is a TEST" -EntryType Information
```