# ASP WebForm Controls

## Validation Summary

```html
.ValidationSummary{border: 1px solid red;padding: 8px 8px;background-color :#FFFFCC;margin: 3px;}

<asp:ValidationSummary ID="ValidationSummary1" runat="server" CssClass="ValidationSummary"
	DisplayMode="List" HeaderText="&lt;b&gt;Please correct the following errors :&lt;/b&gt;&lt;br/&gt;" ForeColor="Red" />
```

```vb					
Dim err As New CustomValidator
err.IsValid = False
err.ErrorMessage = "A Cylinder Cooldown issue exists!!!"
Page.Validators.Add(err)
Exit Sub
```