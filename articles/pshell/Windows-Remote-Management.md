#meta-start
Title:Windows Remote Management (WinRM)
Created:10-29-2020
Category:pshell
#meta-end
# Windows Remote Management (WinRM)
Here is a starting script for remote PowerShell commands.

```powershell
Clear-Host

<# WinRM uses ports 5985 (HTTP) and 5986 (HTTPS) #>

## Activate the WinRM Service
#Enable-PSRemoting -Force

## Check if WinRM is enabled
$result = Test-WSMan DDDWEB05
Write-Host $result.wsmid

$cred = New-Object System.Management.Automation.PSCredential -ArgumentList @(‘USERNAME’,(ConvertTo-SecureString -String ‘PASSWORD’ -AsPlainText -Force))

## Run command on remote computer
Invoke-Command -ComputerName "DDDWEB05" -ScriptBlock { ping localhost } -Credential $cred

#Get-Credential -Credential $cred
#Enter-PSSession -ComputerName "" -Credential $cred
```