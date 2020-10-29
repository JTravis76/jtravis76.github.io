#meta-start
Title:Publish Rollup JS Project
Created:10-29-2020
Category:pshell
#meta-end
# Publish Rollup JS Project
This PowerShell utility is used to prep a Rollup JS project for a release build. By copying files from the `node_modules` listed in the index.html file.
Then updating the source links to the new location.

One use-case, is during an Azure DevOps build pipeline. Had to setup the project *before* I was able to create a release build for Dev, Staging, or Production.

*index.html BEFORE updating*
```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <meta http-equiv="x-ua-compatible" content="ie=edge">
        <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
        <title>WebApp</title>
        <link rel="icon" type="image/x-icon" href="./favicon.ico">
        <link href="./css/site.css" rel="stylesheet" />
    </head>
    <body>
        <noscript>
            <strong>We're sorry but this application doesn't work properly without JavaScript enabled. Please enable it to continue.</strong>
        </noscript>
        <div id="app"></div>

        <script type="text/javascript" src="../node_modules/vue/dist/vue.js"></script>
        <script type="text/javascript" src="../node_modules/vue-router/dist/vue-router.min.js"></script>
        <script type="text/javascript" src="../node_modules/vuex/dist/vuex.min.js"></script>
        <script type="text/javascript" src="../node_modules/vue-class-component/dist/vue-class-component.min.js"></script>
        <script type="text/javascript" src="../node_modules/axios/dist/axios.min.js"></script>

        <script type="text/javascript" src="./js/bootstrap-native.js"></script>
        <script type="text/javascript" src="./js/chartjs-2.7.2.min.js"></script>
        <script type="text/javascript" defer src="./js/app.js"></script>
    </body>
</html>
```

```powershell
$dest = "./dist/js/"
$html = "./dist/index.html"
#----
Write-Output "Prepping for release build..."

$c = Get-Content -Path $html -Raw
$m = Select-String -InputObject $f -Pattern 'src=.+"' -AllMatches

foreach ($match in $m.Matches)
{
    if ($match.Value -like "*node_modules*")
    {
        $src = $match.Value
        $link = $src.Replace('src=', '').Replace('"', '')
        
        # Copy file : Had to adjust for directory depth
        Copy-Item -Path $link.Remove(0,1) -Destination $dest -Force
        
        # Update link in HTML
        $d = $link.Split('/')
        $filename = $d[$d.Length - 1]
        $c = $c.Replace($link, ('./js/' + $filename) )
    }
}

Set-Content -Path $html -Value $c -Force -Encoding UTF8

# Thought it would be cool to use HTML object, maybe another day.
#$html = New-Object -ComObject "HTMLFile"
#$html.IHTMLDocument2_write($($c))
#$html.all.tags("script") | % src
```