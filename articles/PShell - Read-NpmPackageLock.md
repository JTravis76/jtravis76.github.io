#meta-start
Title:Read-NpmPackageLock - Powershell
Created:6-1-2020
Category:pshell
#meta-end
#Read-NpmPackageLock - Powershell

This script was use to restore NPM packages by parsing the NPM package-lock.json file. The download tarballs were saved to an on-permise NPM server.

```ps
#
# Author: Jeremy Travis
# version 1.0.0 - 11/12/2019
# This script reads the package-lock.json 
# and downloads the tgz and the package json files

$npm = "https://registry.npmjs.org/"
$baseDir = "E:\NPM\"
$packageDir = ($baseDir + "packages\")

Function Read-NpmPackageLock
{
    Process
    {
        Clear-Host

        $FilePath = ($baseDir + "package-lock.json")
        $data = Get-Content -Raw -Path $FilePath | ConvertFrom-Json

        $names = $data.dependencies | Get-Member -MemberType NoteProperty | Select-Object Name

        foreach ($name in $names)
        {
            $n = $name.Name
            $directory = ($packageDir + $n)
            if(!(Test-Path $directory -PathType Container)) {
                mkdir $directory
            }

            $idx = 0
            $a = $n.Split('/')

            if ($a.count -gt 1)
            {
                $idx = 1
            }            
            
            $outFile = ($directory.Replace("/", "\") + "\" + $a[$idx] + ".json")
            Invoke-WebRequest -Uri ($npm + $n) -OutFile $outFile
                           
            Get-NpmPackage -Url $data.dependencies.$n.resolved -Name $n
        }    
    }
}

Function Get-NpmPackage
{
[cmdletbinding()]
Param ([string]$Url, [string]$Name)
    Process
    {
        $destination = ($packageDir + $Name.Replace("/", "\"))
        #check package directory to see if already downloaded
        if(!(Test-Path $destination -PathType Leaf))
        {
            $a = $Url.Split('/')
            $outFile = ($destination + "\" + $a[$a.length - 1])
            Invoke-WebRequest -Uri $Url -OutFile $outFile
            Write-Host ("[" + $Name + "] download completed.") -ForegroundColor Green
        }
    }
}

Read-NpmPackageLock
```