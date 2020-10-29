#meta-start
Title:Thycotic SDK
Created:10-29-2020
Category:pshell
#meta-end
# Thycotic SDK
While building an Azure DevOps Build/Release task, I found that I need to use Thycotic Secret Server SDK to fetch various user account prior to performing scripts on a remote server.

```powershell
Clear-Host

$thycoticServer = "https://thycotic.local/SecretServer/"
$thycoticRule = "RuleName"
$thycoticKey = "KeyValue"
$thycoticSecretId = "0000"

# Supress output by passing into variable
$v = tss remove -c
Write-Verbose $v[0]
$v = tss init -u $thycoticServer -r $thycoticRule -k $thycoticKey
if ($v[0] -eq "400 - Bad Request")
{
    throw "Failed to init Thycotic SDK. Could check if Rule and Key are not flipped."
    exit 1
}
$secret = tss secret -s $thycoticSecretId

<# Other examples from fetching fields from Thycotic
$domain = tss secret -s $thycoticSecretId -f domain
$password = tss secret -s $thycoticSecretId -f password
write-output "$username $password"
#>

if ($secret[0] -eq "400 - Bad Request")
{
    throw "Access Denied to secret id: $thycoticSecretId"
}

$domain = ""
$username = ""
$password = ""
$fqdn = ""

$thycotic = $secret | ConvertFrom-Json
foreach ($i in $thycotic.items)
{
    if ($i.fieldName -eq "Domain")
    {
        $domain = $i.itemValue
    }
    if ($i.fieldName -eq "Username")
    {
        $username = $i.itemValue
    }
    if ($i.fieldName -eq "Password")
    {
        $password = $i.itemValue
    }
} 

$fqdn = ($username + "@" + $domain)
#write-output "$fqdn $password"

#write-output "Setting Thycotic's environment variables."

#Write-Host "##vso[task.setvariable variable=thycoticpwd]$password"
#Write-Host "##vso[task.setvariable variable=thycoticuser]$fqdn"


<##>
$secretPassword = "$password" | ConvertTo-SecureString -AsPlainText -Force
$credentials = New-Object System.Management.Automation.PSCredential ("$fqdn", $secretPassword)

#======================================================#
#New-PSSession "dddweb05.ddports.ports.local" -Credential $credentials
#Enter-PSSession -ComputerName SVC01 -Credential $creds
#Exit-PSSession
#======================================================#
#$result = Invoke-Command -Credential $credentials -ComputerName "SVC01" -ScriptBlock { $Env:ASPNETCORE_ENVIRONMENT }
#Write-Output $result


#$result = Invoke-Command -Credential $credentials -ComputerName "SVC01" -ScriptBlock { [System.Environment]::GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT", [System.EnvironmentVariableTarget]::Machine) }
#Write-Output $result


#Invoke-Command -Credential $credentials -ComputerName "SVC01" -ScriptBlock { [System.Environment]::SetEnvironmentVariable("ASPNETCORE_ENVIRONMENT", "FooBar", [System.EnvironmentVariableTarget]::Machine) }


#Invoke-Command -Credential $credentials -ComputerName "SVC01" -ScriptBlock { dotnet --info }


# https://docs.microsoft.com/en-us/dotnet/framework/migration-guide/how-to-determine-which-versions-are-installed

Invoke-Command -Credential $credentials -ComputerName "SVC01" -ScriptBlock {
    (Get-ItemProperty "HKLM:SOFTWARE\Microsoft\NET Framework Setup\NDP\v4\Full").Release -ge 461808
}


<#
.NET Framework version | Minimum value
--------------------------------------
.NET Framework 4.5     | 378389
.NET Framework 4.5.1   | 378675
.NET Framework 4.5.2   | 379893
.NET Framework 4.6     | 393295
.NET Framework 4.6.1   | 394254
.NET Framework 4.6.2   | 394802
.NET Framework 4.7     | 460798
.NET Framework 4.7.1   | 461308
.NET Framework 4.7.2   | 461808
.NET Framework 4.8     | 528040
#>
```