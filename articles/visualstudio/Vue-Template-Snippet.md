#meta-start
Title:Vue Template Snippet
Created:4-22-2020
Category:visualstudio
#meta-end
# Vue Template Snippet

Code snippets is a feature in Visual Studio to help speed development by providing common used function.

> Shortcut menu can be displayed by pressing `Ctrl+K` `Ctrl+X` within an open document in Visual Studio.

Below is a custom Typescript snippet for Visual Studio to generate code for a Vue template.  
Create a `FileName.snippet` file and paste content below. 
Then move file to `~\Documents\Visual Studio NNNN\Code Snippets\Custom`.

Had to copy to the Custom folder to work it a `.vue` file type.

```xml
<?xml version="1.0" encoding="utf-8"?>  
<CodeSnippets  xmlns="http://schemas.microsoft.com/VisualStudio/2005/CodeSnippet">  
    <CodeSnippet Format="1.0.0">  
        <Header>  
          <Title>Vue Template</Title>
			    <Author>Jeremy Travis</Author>  
			    <Description>Code snippet for Vue template</Description>
			    <Shortcut>vuecomp</Shortcut>
          <SnippetTypes>
            <SnippetType>Expansion</SnippetType>
            <SnippetType>SurroundsWith</SnippetType>
          </SnippetTypes>
        </Header>  
        <Snippet>
          <Declarations>
            <Literal>
              <ID>name</ID>
              <ToolTip>Class Name</ToolTip>
              <Default>MyClass</Default>
            </Literal>
          </Declarations>
            <Code Language="HTML" Kind="any" Delimiter="%"> 
<![CDATA[<template>
    <div></div>
</template>

<script lang="ts">
    import { Component, Vue } from "vue-property-decorator";

    @Component({})
    export default class %name% extends Vue { }
</script>

<style lang="scss"></style>]]>  
            </Code>  
        </Snippet>  
    </CodeSnippet>  
</CodeSnippets>   
```