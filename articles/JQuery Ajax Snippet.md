#meta-start
Title:JQuery Ajax Snippet
Created:4-22-2020
Category:visualstudio
#meta-end
# JQuery Ajax Snippet

Code snippets is a feature in Visual Studio to help speed development by providing common used function.

> Shortcut menu can be displayed by pressing `Ctrl+K` `Ctrl+X` within an open document in Visual Studio.

Below is a custom Typescript snippet for Visual Studio to generate code for a JQuery Ajax function.  
Create a `jQueryAjax.snippet` file and paste content below. 
Then move file to `~\Documents\Visual Studio NNNN\Code Snippets\TypeScript\My Code Snippets`.

```xml
<?xml version="1.0" encoding="utf-8"?>  
<CodeSnippets  xmlns="http://schemas.microsoft.com/VisualStudio/2005/CodeSnippet">  
    <CodeSnippet Format="1.0.0">  
        <Header>  
          <Title>jQuery Ajax</Title>
			    <Author>Jeremy Travis</Author>  
			    <Description>Code snippet for jQuery Ajax with basic options</Description>
			    <Shortcut>ajax</Shortcut>
          <SnippetTypes>
            <SnippetType>Expansion</SnippetType>
            <SnippetType>SurroundsWith</SnippetType>
          </SnippetTypes>
        </Header>  
        <Snippet>
          <Declarations>
            <Literal>
              <ID>type</ID>
              <ToolTip>Type</ToolTip>
              <Default>POST</Default>
            </Literal>
            <Literal>
              <ID>var</ID>
              <ToolTip>Some model variable</ToolTip>
              <Default>myModel</Default>
            </Literal>
          </Declarations>
            <Code Language="TypeScript" Kind="any" Delimiter="%"> 
              <![CDATA[
$.ajax({
    url: '@Url.Action("ACTION", "CONTROLLER")',
	type: "%type%",
	cache: false,
	async: true,
	data: { model: %var% },
	
	//Optional
	contentType: "application/json; charset=utf-8", //inform the server what data type you are sending to the server
	dataType: "json", //This specifies the type of data you are expecting from the server. (i.e. not the datatype that you are sending to the server)
				
	beforeSend: function() { },
	complete: function () { },
	success: function (data) {
		console.log(data);
    if (data.success === undefined) {
        DisplayHtmlError(data);
    }
    else if (!data.success) {
        DisplayVaildationSummary("div-err", data.message);
    }
    else 
        window.location.reload();
        %selected%
	},
	error: function (xhr, ajaxOptions, error) {
      alert(xhr.responseText);
    }
});
              ]]>  
            </Code>  
        </Snippet>  
    </CodeSnippet>  
</CodeSnippets>  
```