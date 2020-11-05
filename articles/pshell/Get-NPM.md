# Get-NPM - PowerShell

While looking into build an on-premise NPM server, was looking for ways to download a cache version of other npm packages. This is my attempt in PowerShell to replicate what Node NPM was doing.

```ps
#
# Author: Jeremy Travis
 
$npm = "https://registry.npmjs.org/"
$baseDir = "E:\NPM\"
 
Function Get-NPM {
[cmdletbinding()]
Param ([string]$name, [string]$version)
    Process 
    {
        Clear-Host
 
        $temp = $name
 
        #do we need to parse name??
        if ($name.Contains("/")) 
        {
            $name = $name.Split("/")[1]
        }
 
        $outFile = $baseDir + $name + ".json"
 
        Invoke-WebRequest -Uri ($npm + $temp) -OutFile $outFile
 
        Read-JSON -FilePath $outFile -Version $version        
    }
}

Function Read-JSON
{
[cmdletbinding()]
Param ([string]$FilePath, [string]$Version)
    Process
    {
        try
        {
            Write-Host ("Processing: " + $FilePath) -BackgroundColor Yellow -ForegroundColor Black
            $data = Get-Content -Raw -Path $FilePath | ConvertFrom-Json
        }
        catch
        {
            Write-Host ("(Read-JSON)Error processing JSON: " + $File) -ForegroundColor Red
            return
        }
 
        $latest = $data.'dist-tags'.latest
        #did user ask for a version??
        if ($Version -ne $null -and $Version -match '"(?<ver>\d.\d.\d)"')
        {
            #$Version = $Version.Replace("^", "").Replace("~", "")
            $latest = $Matches.ver
        }
 
        $id = $data._id.Replace("/", "_")
        $packageDir = ($baseDir + "packages\" + $id + "\")
 
        #create staging directory & copy JSON
        if(!(Test-Path $packageDir -PathType Container)) 
        {
            mkdir $packageDir
            Copy-Item -Path $FilePath -Destination $packageDir
        }
 
        $tarball = $data.versions.$latest.dist.tarball
 
        if ($tarball -eq $null)
        {
            Write-Host ($data._id + $version + " tarball, not found!") -ForegroundColor Red
            Return
        }
 
        $array = $tarball.Split("/")
 
        Download-Package -Url $tarball -Name $array[$array.length - 1]
 
        # Process-Dependencies -File $outFile -Version $latest
    }
}
 
Function Process-Dependencies {
[cmdletbinding()]
Param ([string]$File, [string]$Version)
    Process
    {
        try 
        {
            Write-Host ("    Processing Dependencies: " + $FilePath) -BackgroundColor Gray
            $data = Get-Content -Raw -Path $File | ConvertFrom-Json
        }
        catch
        {
            Write-Host ("(Process-Dependencies)Error processing JSON: " + $File) -ForegroundColor Red
            return
        }        
 
        if($data.versions.$Version.dependencies -ne $null) 
        {
            $dependencies = $data.versions.$latest.dependencies
 
            $names = $dependencies | Get-Member -MemberType NoteProperty | select Name
            $defintions = $dependencies | Get-Member -MemberType NoteProperty | select Definition
 
            foreach($nam in $names)
            {
                $defintion = $defintions | Where-Object { $_.Definition -like "*string " + $nam.Name + '*' }
                $defVersion = $defintion.Definition.Split("=")[1]
                $id = $nam.Name.Replace("/", "_")
                Write-Host ("      * " + $id + "@" + $defVersion)
 
                $packageDir = ($baseDir + "packages\" + $id + "\")
                Create-Directory -Directory $packageDir
 
                $url = $npm + $nam.Name
                $outFile = $baseDir + $id + ".json"
    
                #check root directory to see if already downloaded
                if(!(Test-Path $outFile -PathType Leaf))
                {
                    #Download json config for each dependency
                    Invoke-WebRequest -Uri $url -OutFile $outFile
                    Copy-Item -Path $outFile -Destination $packageDir
                }
 
                Read-JSON -FilePath $outFile -Version $defVersion
            }
        }
    }
}

Function Create-Directory
{
[cmdletbinding()]
Param ([string]$Directory)
    Process
    {
        if(!(Test-Path $Directory -PathType Container)) {
            mkdir $Directory
        }
    }
}
 
Function Download-Package
{
[cmdletbinding()]
Param ([string]$Url, [string]$Name)
    Process
    {
        $destination = ($packageDir + $Name)
        #check package directory to see if already downloaded
        if(!(Test-Path $destination -PathType Leaf))
        {
            Invoke-WebRequest -Uri $Url -OutFile $destination
            Write-Host ($Name + " completed.") -ForegroundColor Green
        }
    }
}
 
Function Clean-Up
{
    #TODO: Cleanup remaing json files
}





Get-NPM "@vue/cli-service" "3.0.4"
 
```


Not required for the above script. Just some additional task like unzipping with 7-zip and moving files.

```ps
#===================================================
# Extract the TAR file from the compressed TGZ file
# via 7-Zip to the root directory

$baseDir = "E:\NPM"

$dir = Get-ChildItem $baseDir
$list = $dir | where {$_.Extension -eq ".tgz"}

$exe = "C:\Program Files\7-Zip\7z.exe"

foreach($file in $list)
{
    $arg = 'e "' + $file.FullName + '" ' + ' -y -o"' + $baseDir + '\TAR"'

    Start-Process -FilePath $exe -WorkingDirectory $baseDir -ArgumentList $arg
}

#=================================================
# Extract files from the compressed TAR file
# via 7-Zip to the node_modules directory

$baseDir = "E:\NPM"

if(!(Test-Path -Path ($baseDir + "\TAR") -PathType Container ))
{
    mkdir ($baseDir + "\TAR")
}

$dir = Get-ChildItem ($baseDir + "\TAR")
$list = $dir | where {$_.Extension -eq ".tar"}

$modDir = $baseDir + "\node_modules"

if(!(Test-Path -Path $modDir -PathType Container))
{
    mkdir $modDir
}

$exe = "C:\Program Files\7-Zip\7z.exe"

foreach($file in $list)
{
    $fileDir = ($modDir + "\" + $file.Name.Replace(".tar", ""))

    $int = $fileDir.LastIndexOf("-")

    $filedir = $fileDir.Substring(0, $int)

    if(!(Test-Path -Path $fileDir -PathType Container))
    {
        mkdir $fileDir
    }

    $arg = 'x "' + $file.FullName + '"' + ' -y -o"' + $fileDir + '"'

    Start-Process -FilePath $exe -WorkingDirectory $baseDir -ArgumentList $arg

    Remove-Item -Path $file.FullName
}

#======================================================
# Move files from the Package directory up one level
# Deletes the emptied Package directory

$baseDir = "E:\NPM\node_modules"

$directories = Get-ChildItem ($baseDir) -Directory

foreach($directory in $directories)
{
    $path = ($directory.FullName + "\package")

    if ((Test-Path -Path $path -PathType Container ))
    {
        Write-Output ("Processing Directory: " + $directory.Name)

        ## Get all files and move them up one level in the directory
        Get-ChildItem -Path $path -Recurse | Move-Item -Destination ($baseDir + "\" + $directory.Name)    

        Remove-Item -Path $path -Recurse
    }
}
```