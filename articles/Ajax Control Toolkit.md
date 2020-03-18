#meta-start
Title:Ajax Control ToolKit
Link:ajax-control-toolKit
Created:9/30/2019
Category:aspdotnet
#meta-end
# Ajax Control ToolKit

## How to use the Auto-Complete Extender
The below sample is to demostrate how to setup a auto-complete feature. You may see these in textboxes for searching, etc.

```vb
Protected Sub Page_Load(ByVal sender As Object, ByVal e As System.EventArgs) Handles Me.Load
    If Not IsPostBack Then
        ...
    End If

    'below is use with AJAXToolkit to pass a third param to filter the sql results
    txtPickupFacility_AutoCompleteExtender.ContextKey = DropDown1.SelectedValue
End Sub
```

```vb
#Region "WebMethods"
    '<cc1:AutoCompleteExtender ID="txtPickupFacility_AutoCompleteExtender" runat="server" CompletionInterval="500"
    '    CompletionSetCount="25" DelimiterCharacters="" Enabled="True" MinimumPrefixLength="1"
    '    ServiceMethod="GetPickupFacilityList" TargetControlID="txtPickupFacility" UseContextKey="true" >
    '</cc1:AutoCompleteExtender>

    'THE contextKey is assigned from code-behind.
    <System.Web.Services.WebMethod(True)>
    <System.Web.Script.Services.ScriptMethod()>
    Public Shared Function GetPickupFacilityList(ByVal prefixText As String, ByVal count As Integer, ByVal contextKey As String) As System.String()
        Dim sql As String = "SELECT PickupFacility FROM Request WHERE UserId = @UserId AND (PickupFacility LIKE @PickupFacility) ORDER BY PickupFacility"


        Dim da As System.Data.SqlClient.SqlDataAdapter = New System.Data.SqlClient.SqlDataAdapter(sql, ConfigurationManager.ConnectionStrings("db").ConnectionString)
        da.SelectCommand.Parameters.Add("@UserId", SqlDbType.Int).Value = CInt(contextKey)
        da.SelectCommand.Parameters.Add("@PickupFacility", SqlDbType.VarChar, 50).Value = prefixText + "%"
        Dim dt As DataTable = New DataTable()
        da.Fill(dt)

        Dim items As String()
        ReDim items(dt.Rows.Count - 1)

        Dim i As Integer = 0
        For Each dr As DataRow In dt.Rows
            items(i) = dr(0).ToString()
            i = i + 1
        Next

        Return items
    End Function
#End Region
```