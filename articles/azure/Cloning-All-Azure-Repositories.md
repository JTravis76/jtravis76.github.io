# Cloning All Azure Repositories
I was once task to scan all repositories within an Azure project. This scanning would require searching for keywords. I felt it would be best to download to my computer and use a search utility. Here is a nice snippet I found using PowerShell that worked nicely.

To set things up, you first need to create a personal token within Azure. Be sure to set the permission.  
* Code: Read

> TIP: Be should to CD into your repo directory before executing this script

```ps
$personalAccessToken = '%enter-your-person-token-here%'
$base64AuthInfo = [System.Convert]::ToBase64String([System.Text.Encoding]::ASCII.GetBytes(":$($personalAccessToken)"))
$headers = @{Authorization=("Basic {0}" -f $base64AuthInfo)}

$result = Invoke-RestMethod -Uri "https://dev.azure.com/{ORG}/{PROJECT}/_apis/git/repositories?api-version=6.0" -Method Get -Headers $headers

$result.value.webUrl | ForEach-Object {
  git clone $_
}
```