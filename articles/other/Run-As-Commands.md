#meta-start
Title:Run As Commands
Created:10-22-2020
Category:other
#meta-end
# Run As and Test Login Commands
Often time I find myself needing to test or execute an application under a different user. Here are some various techniques to achieve this.

Windows built-in command; RunAs.
```bat
runas /u:yourdomain\a_test_user notepad.exe
```

A PowerShell cmdlet.
```powershell
#usage: Test-UserCredential -username UserNameToTest -password (Read-Host)

Function Test-UserCredential { 
    Param($username, $password) 
    Add-Type -AssemblyName System.DirectoryServices.AccountManagement 
    $ct = [System.DirectoryServices.AccountManagement.ContextType]::Machine, $env:computername 
    $opt = [System.DirectoryServices.AccountManagement.ContextOptions]::SimpleBind 
    $pc = New-Object System.DirectoryServices.AccountManagement.PrincipalContext -ArgumentList $ct 
    $Result = $pc.ValidateCredentials($username, $password).ToString() 
    $Result 
}
```

Creates a UNC share with access under another login.
```bat
net use \\computername\sharename [password] /USER:]username]
```

Test authentic using Visual Basic Script
```vb
Function GoodPassword(strAdminUsername, strAdminPassword, strNTDomain)
    Const ADS_SECURE_AUTHENTICATION = 1

    On Error Resume Next
    Set objIADS = GetObject("WinNT:").OpenDSObject("WinNT://" & _
                        strNTDomain, strAdminUserame, _
                        strAdminPassword, _
                        ADS_SECURE_AUTHENTICATION)
    if err.number = 0 then
       GoodPassword = True
    Else
       GoodPassword = False
    End If
    On Error GoTO 0
End Function
```