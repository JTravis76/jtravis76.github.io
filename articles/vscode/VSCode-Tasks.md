#meta-start
Title:Visual Studio Code - Common Tasks
Created:8-11-2020
Category:vscode
#meta-end
# Visual Studio Code - Common Tasks
Here are some common everyday tasks I used in VS Code.

```json
{
    // See https://go.microsoft.com/fwlink/?LinkId=733558
    // for the documentation about the tasks.json format
    "version": "2.0.0",
    "tasks": [
        {
            "label": "Build SASS",
            "type": "shell",
            "command": "sass",
            "windows": {
                "args": ["src/scss/index.scss", "src/contents/site.css", "--no-source-map", "--watch"]
            },
            "group": "build",
            "presentation": {
                "echo": true,
                "reveal": "always",
                "focus": false,
                "panel": "shared",
                "showReuseMessage": true,
                "clear": false
            }
        },
        {
            "label": "Build Typescript",
            "type": "typescript",
            "tsconfig": "tsconfig.json",
            //"option": "watch",
            "problemMatcher": [
                "$tsc"
            ],
            "group": {
                "kind": "build",
                "isDefault": true
            }
        },
        {
            "label": "Watch Typescript",
            "type": "shell",
            "command": "node",
            "windows": {
                "args": ["C:\\Program Files (x86)\\Microsoft SDKs\\TypeScript\\3.4\\tsc.js", "--watch", "-p", "${workspaceFolder}\\tsconfig.json"]
            },
            "group": "none",
            "presentation": {
                "echo": true,
                "reveal": "always",
                "focus": false,
                "panel": "shared",
                "showReuseMessage": true,
                "clear": false
            }
        },
        {
            "label": "Run IIS Express",
            "type": "process",
            "command": "C:\\Program Files (x86)\\IIS Express\\iisexpress.exe",
            "windows": {
                //"args": ["/config:..\\.vs\\config\\applicationhost.config", "/systray:true", "/siteid:2"]
                "args": ["/path:${workspaceFolder}\\src", "/port:60960", "/systray:true"]
            },
            "group": "none",
            "presentation": {
                "echo": true,
                "reveal": "always",
                "focus": false,
                "panel": "shared",
                "showReuseMessage": true,
                "clear": false
            }
        },
        {
            "label": "Rollup",
            "type": "shell",
            "command": "rollup",
            "windows": {
                "args": ["-c", "--watch"]
            },
            "group": {
                "kind": "build",
                "isDefault": true
            }
        }
    ]
}
```