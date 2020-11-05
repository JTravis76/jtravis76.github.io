<#
# Get-Articles 
# Build Vue-Blogger JSON database
# Scans Markdown directory and reads information into a single database object
# Author: Jeremy Travis - 3/2020
#>
Function Get-Articles
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

            $data = $file.FullName.split('\')
            $category = $data[$data.length - 2]
            $link = $data[$data.length - 1].Replace(".md", "").ToLower()
            $created = $file.CreationTime
            $title = ""

            foreach($line in [System.IO.File]::ReadLines($file.FullName))
            {
                if ($line.StartsWith("# "))
                {
                    $title = $line.Replace("# ", "")

                    $obj.Add("Category", $category)
                    $obj.Add("Title", $title)
                    $obj.Add("Link", $link)
                    $obj.Add("Created", $created)

                    break
                }
            }

            # Add object to array
            $db += $obj
        }

        #wrap database
        $articles = @{}
        $articles.Add("Articles", $db)

        $json = $articles | ConvertTo-Json -Compress

        <#== Copy results into the master db.json ==#>
        New-Item -Path $OutPath -Name "articles.json" -ItemType "file" -Value $json -Force    
    }
}

$in = "articles"
$out = "./db"
Get-Articles -DirPath $in -OutPath $out