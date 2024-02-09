# Fetching Files from Kudu via PowerShell - Azure

As it turns out, I have been using Azure Kudu to manage my websites for years and didn't know they offer an API.
Today we are going to demonstrate how I was able to create a powershell task to copy files from one Web App slot to another Web App slot.

In this example, I needed to copy the uploaded help documents and restore them AFTER the new deployment pipeline has ran. See, the client uploaded the help article in a form of markdown files. And since the deployment slot are swapped, I needed a way to restore those files to the current web app directory.

> The username and password is located in the publish file.

> $(webAppName) in this context is something like; my-web-app-dev.

Fetch Help Files

```ps
$Username = ('$' + '$(webAppName)')
$Password = '$(publishPwd)'

$token = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("$($Username):$($Password)"))
Invoke-RestMethod https://$(webAppName).scm.azurewebsites.net/api/zip/site/wwwroot/help/ `
    -Headers @{ 'Authorization' = "Basic $Token"; 'If-Match' = '*' } `
    -Method GET `
    -ContentType "multipart/form-data" `
    -OutFile $(System.DefaultWorkingDirectory)/extracted/help.zip
```

Restore Help files

```ps
$Username = ('$' + '$(webAppName)')
$Password = '$(publishPwd)'

$token = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("$($Username):$($Password)"))
Invoke-RestMethod https://$(webAppName).scm.azurewebsites.net/api/zip/site/wwwroot/help/ `
    -Headers @{ 'Authorization' = "Basic $token"; 'If-Match' = '*' } `
    -Method PUT `
    -UserAgent "powershell/1.0" `
    -ContentType "multipart/form-data" `
    -InFile $(System.DefaultWorkingDirectory)/extracted/help.zip
```
