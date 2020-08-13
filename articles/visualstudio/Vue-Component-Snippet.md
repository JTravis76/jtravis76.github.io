#meta-start
Title:Vue Component Snippet
Created:4-22-2020
Category:visualstudio
#meta-end
# Vue Component Snippet

Code snippets is a feature in Visual Studio to help speed development by providing common used function.

> Shortcut menu can be displayed by pressing `Ctrl+K` `Ctrl+X` within an open document in Visual Studio.

Below is a custom Typescript snippet for Visual Studio to generate code for a Vue component mixin.  
Create a `FileName.snippet` file and paste content below. 
Then move file to `~\Documents\Visual Studio NNNN\Code Snippets\TypeScript\My Code Snippets`.

```xml
<?xml version="1.0" encoding="utf-8"?>  
<CodeSnippets  xmlns="http://schemas.microsoft.com/VisualStudio/2005/CodeSnippet">  
    <CodeSnippet Format="1.0.0">  
        <Header>  
          <Title>Vue Component</Title>
			    <Author>Jeremy Travis</Author>  
			    <Description>Code snippet for Vue Component</Description>
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
              <ToolTip>Component Name</ToolTip>
              <Default>new-component</Default>
            </Literal>
          </Declarations>
            <Code Language="TypeScript" Kind="any" Delimiter="%"> 
              <![CDATA[
import { ComponentOptions } from "vue";

export default {
    name: "%name%",
    components: { },
    template: `<div></div>`,
    data() {
        return {}
    },
    props: {
        someProps: {
            type: String,
            required: false,
            default: ""
        }
    },
    methods: {
        MyAction(e: KeyboardEvent) {
        }
    }
} as ComponentOptions<any>
              ]]>  
            </Code>  
        </Snippet>  
    </CodeSnippet>  
</CodeSnippets>    
```