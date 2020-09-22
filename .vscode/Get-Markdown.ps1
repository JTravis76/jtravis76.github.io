<#
# Get-Markdown 
# Build Vue-Blogger JSON database
# Scans Markdown directory and reads information into a single database object
# Author: Jeremy Travis - 3/2020
#>
Function Get-Markdown
{
[cmdletbinding()]
Param ([string]$DirPath, [string]$OutPath)
    Process
    {
        Clear-Host

        $dir = Get-ChildItem $DirPath -Recurse
        $list = $dir | Where-Object {$_.Extension -eq ".md"}

        #= Create an empty array
        $db = @()

        foreach($file in $list)
        {
            #= Create an empty object
            $obj = @{}    

            $txt = [System.IO.File]::ReadAllText($file.FullName)
            #Remove the leading meta-data
            $v = $txt.LastIndexOf("#meta-end")
            if ($v -ne -1)
            {
                $txt = $txt.Substring($v + 11)
            }

            <# Move to download article vs storing in database - 2020-09-22 #>
            # $obj.Add("Markdown", $txt)

            $meta = 0
            foreach($line in [System.IO.File]::ReadLines($file.FullName))
            {
                if ($line -eq "#meta-end")
                {
                    $meta = 0
                    break;
                }
                if ($meta -eq 1)
                {
                    $s = $line -split ":"
                    $obj.Add($s[0], $s[1])

                    if ($s[0] -eq "Title")
                    {
                        # add alias link
                        #$obj.Add("Link", $s[1].Replace(" ", "-").ToLower())
                        $obj.Add("Link", $file.Name.Replace(".md", ""))
                    }
                }
                if ($line -eq "#meta-start")
                {
                    $meta = 1
                }
            }

            if (!$obj.Contains("Category")) 
            {
                $obj.Add("Category", "other")
                $obj.Add("Title", $file.Name)
                #$obj.Add("Link", $file.Name.Replace(" ", "-").ToLower())
                $obj.Add("Created", "")
            }

            # Add object to array
            $db += $obj
        }

        #wrap database
        $articles = @{}
        $articles.Add("Articles", $db)

        $json = $articles | ConvertTo-Json -Compress
        #Write-Host $json

        <#== Copy results into the master db.json ==#>
        New-Item -Path $OutPath -Name "articles.json" -ItemType "file" -Value $json -Force    
    }
}

$in = "articles"
$out = "db"
Get-Markdown -DirPath $in -OutPath $out