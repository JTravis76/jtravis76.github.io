# Visual Studio Code Settings
This is a backup of my settings.json and extensions for Visual Studio Code.

* Deno: denoland
* ESLINT: Microsoft
* Prettier - Code Formatter: Prettier
* Redis: Dunn
* Spell Right: Bartosz Antosik
* Thunder Client: Ranga Vadhineni
* Vetur: Pine Wu
* Volar: Vue


```json
{
  "breadcrumbs.enabled": false,
  "editor.detectIndentation": false,
  "editor.quickSuggestionsDelay": 1000,
  "editor.codeActionsOnSave": {
    "source.fixAll": true,
    "source.fixAll.stylelint": true
  },
  "editor.formatOnSave": true,
  "editor.tabCompletion": "onlySnippets",
  "editor.tabSize": 2,
  "eslint.format.enable": true,
  "eslint.validate": [
    "vue",
    "html",
    "javascript",
    "typescript"
  ],
  "files.associations": {
    "*.tagui": "bat",
    "*.prg": "foxpro",
    "*.hta": "html"
  },
  "git.ignoreMissingGitWarning": true,
  "http.proxyStrictSSL": false,
  "mssql.connections": [
    {
      "connectionString": "Data Source=(localdb)\\MSSQLLocalDB;Initial Catalog=master;Integrated Security=True;Connect Timeout=30;Encrypt=False;MultipleActiveResultSets=True;Application Name=VSCODE",
      "profileName": "MSSQLLocalDB",
      "password": ""
    }
  ],
  "myRedis.list": "localhost:6379",
  "myRedis.address": "localhost:6379",
  "myRedis.password": "!Password1",
  "security.workspace.trust.untrustedFiles": "open",
  "svgPreview.style": {
    "html": {
      //"background": "#F1F1F1",
      "background-position": "0 0, 13px 13px",
      "background-size": "26px 26px",
      "background-image": "linear-gradient(45deg, #141414 25%, transparent 25%, transparent 75%, #141414 75%, #141414), linear-gradient(45deg, #141414 25%, transparent 25%, transparent 75%, #141414 75%, #141414)"
    }
  },
  "team.showWelcomeMessage": false,
  //"terminal.integrated.shell.windows": "C:\\Windows\\System32\\cmd.exe",
  "terminal.integrated.cwd": "C:\\Users\\jtravis\\repos",
  "typescript.updateImportsOnFileMove.enabled": "always",
  "vetur.format.options.tabSize": 4,
  "vetur.format.options.useTabs": true,
  "window.zoomLevel": 0,
  "workbench.colorTheme": "Default Dark+",
  "workbench.editor.enablePreview": false,
  "workbench.list.openMode": "doubleClick",
  "workbench.tree.indent": 20,
  "[vue]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescript]": {
    "editor.defaultFormatter": "vscode.typescript-language-features"
  },
  "[jsonc]": {
    "editor.defaultFormatter": "vscode.json-language-features"
  },
  "[json]": {
    "editor.defaultFormatter": "vscode.json-language-features"
  },
  "[html]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[scss]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```