#meta-start
Title:Vue Template - VS Code Snippet
Created:8-11-2020
Category:vscode
#meta-end
# Vue Template - VS Code Snippet


```json
"vue template": {
    "prefix": ["vue-template"],
    "body": ["<template></template>\n\n<script lang=\"ts\">\n    import { Component, Vue } from \"vue-property-decorator\";\n\n    @Component({})\n    export default class MyClass extends Vue { }\n</script>\n\n<style lang=\"scss\"></style>"],
    "description": "create a vue template with TS support",
    "scope": "vue"
}
```