#meta-start
Title:Sql Connection Snippet
Created:4-22-2020
Category:visualstudio
#meta-end
# Sql Connection Snippet

Code snippets is a feature in Visual Studio to help speed development by providing common used function.

> Shortcut menu can be displayed by pressing `Ctrl+K` `Ctrl+X` within an open document in Visual Studio.

Below is a custom C# snippet for Visual Studio to generate code for a SQL Connection.  
Create a `FileName.snippet` file and paste content below. 
Then move file to `~\Documents\Visual Studio NNNN\Code Snippets\Visual C#\My Code Snippets`.

```xml
<?xml version="1.0" encoding="utf-8"?>  
<CodeSnippets  xmlns="http://schemas.microsoft.com/VisualStudio/2005/CodeSnippet">  
    <CodeSnippet Format="1.0.0">  
        <Header>  
          <Title>SQL Connection</Title>
			    <Author>Jeremy Travis</Author>  
			    <Description>Code snippet for SQL Connection and Query</Description>
			    <Shortcut>sqlconn</Shortcut>
          <SnippetTypes>
            <SnippetType>Expansion</SnippetType>
            <SnippetType>SurroundsWith</SnippetType>
          </SnippetTypes>
        </Header>  
        <Snippet>
          <Declarations>
            <Literal>
              <ID>SomeConnectionString</ID>
              <ToolTip>Replace with your SQL connection string</ToolTip>
              <Default>SomeConnectionString</Default>
            </Literal>
          </Declarations>
            <Code Language="CSharp" Kind="any" Delimiter="%"> 
              <![CDATA[
string ConStr = System.Configuration.ConfigurationManager.ConnectionStrings["%SomeConnectionString%"].ConnectionString;
using(System.Data.SqlClient.SqlConnection con = new System.Data.SqlClient.SqlConnection(ConStr))
{
	con.Open();

	System.Text.StringBuilder sQuery = new System.Text.StringBuilder();
	sQuery.Append("SELECT * FROM [table]");

	System.Data.SqlClient.SqlCommand cmd = new System.Data.SqlClient.SqlCommand(sQuery.ToString(), con);
	using (System.Data.SqlClient.SqlDataAdapter adp = new System.Data.SqlClient.SqlDataAdapter(cmd))
	{
		System.Data.DataTable dt = new System.Data.DataTable("Query");
		adp.Fill(dt);
	}

	con.Close();
}
              ]]>  
            </Code>  
        </Snippet>  
    </CodeSnippet>  
</CodeSnippets>  
```