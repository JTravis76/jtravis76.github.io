# Visual Studio Code Settings
This is a backup of my settings.json for Visual Studio Code.

```json
{
    "workbench.editor.enablePreview": false,
    "workbench.list.openMode": "doubleClick",
    "breadcrumbs.enabled": false,
    "team.showWelcomeMessage": false,
    "http.proxyStrictSSL": false,
    //"terminal.integrated.shell.windows": "C:\\Windows\\System32\\cmd.exe",
    "terminal.integrated.cwd": "C:\\Users\\KDJ\\source\\repos",
    "git.ignoreMissingGitWarning": true,
    "mssql.connections": [
        {
            "connectionString": "Data Source=(localdb)\\MSSQLLocalDB;Initial Catalog=master;Integrated Security=True;Connect Timeout=30;Encrypt=False;MultipleActiveResultSets=True;Application Name=VSCODE",
            "profileName": "MSSQLLocalDB",
            "password": ""
        }
    ],
    "svgPreview.style": {
        "html": {
            //"background": "#F1F1F1",
            "background-position": "0 0, 13px 13px",
            "background-size": "26px 26px",
            "background-image": "linear-gradient(45deg, #141414 25%, transparent 25%, transparent 75%, #141414 75%, #141414), linear-gradient(45deg, #141414 25%, transparent 25%, transparent 75%, #141414 75%, #141414)"
        }
    },
    "vetur.format.options.tabSize": 4,
	"vetur.format.options.useTabs": true,
	"editor.detectIndentation": false,
    "workbench.tree.indent": 20,
    "editor.tabCompletion": "onlySnippets",
    "window.zoomLevel": 0,
    "workbench.colorTheme": "PowerShell ISE"
    "typescript.updateImportsOnFileMove.enabled": "always",
    "files.associations": {
        "*.tagui": "bat","*.prg": "foxpro","*.hta":"html"
    }
}
```