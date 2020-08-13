#meta-start
Title:Get-FileHash - Powershell
Created:6-1-2020
Category:pshell
#meta-end
#Get-FileHash - Powershell

While testing with NPM tarballs, wanted a way to test the file hash. This is how you would do that in PowerShell.

```ps
Get-FileHash "C:\addressbook-1.0.0.tgz" -Algorithm SHA1 | Format-List

# Output: E7A679539C32C66FE23281F3727081D3AE5077CB
```