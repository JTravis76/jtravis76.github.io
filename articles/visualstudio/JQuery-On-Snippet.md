#meta-start
Title:JQuery On Snippet
Created:4-22-2020
Category:visualstudio
#meta-end
# JQuery On Snippet

Code snippets is a feature in Visual Studio to help speed development by providing common used function.

> Shortcut menu can be displayed by pressing `Ctrl+K` `Ctrl+X` within an open document in Visual Studio.

Below is a custom Typescript snippet for Visual Studio to generate code for a JQuery OnClick function.  
Create a `FileName.snippet` file and paste content below. 
Then move file to `~\Documents\Visual Studio NNNN\Code Snippets\TypeScript\My Code Snippets`.

Personally, find it better to bind the click event to the document with a selector to match. This allows events to be trigger from multiple HTML elements.

```xml
<?xml version="1.0" encoding="utf-8"?>  
<CodeSnippets  xmlns="http://schemas.microsoft.com/VisualStudio/2005/CodeSnippet">  
    <CodeSnippet Format="1.0.0">  
        <Header>  
          <Title>jQuery OnClick</Title>
			    <Author>Jeremy Travis</Author>  
			    <Description>Code snippet for jQuery OnClick</Description>
			    <Shortcut>jqon</Shortcut>
          <SnippetTypes>
            <SnippetType>Expansion</SnippetType>
            <SnippetType>SurroundsWith</SnippetType>
          </SnippetTypes>
        </Header>  
        <Snippet>
          <Declarations>
            <Literal>
              <ID>event</ID>
              <ToolTip>event type</ToolTip>
              <Default>click</Default>
            </Literal>
            <Literal>
              <ID>selector</ID>
              <ToolTip>JQuery Selector</ToolTip>
              <Default>#btn-</Default>
            </Literal>
          </Declarations>
            <Code Language="TypeScript" Kind="any" Delimiter="%"> 
              <![CDATA[
$(document).on('%event%', '%selector%', function (e) {
    e.stopImmediatePropagation();
    let id = $(this).attr('data-id');
});
              ]]>  
            </Code>  
        </Snippet>  
    </CodeSnippet>  
</CodeSnippets>  
```