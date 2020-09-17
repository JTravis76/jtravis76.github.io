#meta-start
Title:NPM Shrink-wrap
Created:9-1-2020
Category:node
#meta-end
# NPM Shrinkwrap
I ran into an issues download NPM packages on my strict corporate network. One of the dependency packages would fail to download; tar@2.0.0. This package was a dependency for node-sass and would fail the build during the Azure DevOps pipeline. NPM offered a solution to force a newer package to replace the original version.

Create a file named; `npm-shrinkwrap.json` and paste in the following content. It can be along side of `package.json`.

> This example would download tar 3.0 in place of tar 2.0

```json
{
  "lockfileVersion": 1,
  "dependencies": {
    "tar": {
      "version": "2.0.0",
      "from": "tar@^2.0.0",
      "dependencies": {
        "connect": {
          "version": "3.0.0",
          "from": "tar@^2.0.0"
        }
      }
    }
  }
}
```