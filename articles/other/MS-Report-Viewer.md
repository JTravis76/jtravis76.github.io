# Microsoft Report Viewer

Add References:
Microsoft.ReportViewer.Common
(C:\Windows\assembly\GAC_MSIL\Microsoft.ReportViewer.Common\11.0.0.0__89845dcd8080cc91\Microsoft.ReportViewer.Common.dll)
Microsoft.ReportViewer.WebForms
(C:\Windows\assembly\GAC_MSIL\Microsoft.ReportViewer.WebForms\11.0.0.0__89845dcd8080cc91\Microsoft.ReportViewer.WebForms.DLL)
Microsoft.ReportViewer.WinForms
(C:\Windows\assembly\GAC_MSIL\Microsoft.ReportViewer.WinForms\11.0.0.0__89845dcd8080cc91\Microsoft.ReportViewer.WinForms.DLL)

```html
<div style="height:1100px;width:900px;background-color:white;">
	<rsweb:ReportViewer ID="RptViewer1" runat="server" Font-Names="Verdana" Font-Size="8pt" WaitMessageFont-Names="Verdana" WaitMessageFont-Size="14pt" Width="900px" ></rsweb:ReportViewer>
</div>
```

```vb
Imports Microsoft.Reporting.WebForms
Imports Microsoft.ReportingServices
Imports Microsoft.Reporting

DataSet1 = ??? 'must match the dataset created in the rdlc report

RptViewer1.ProcessingMode = Microsoft.Reporting.WebForms.ProcessingMode.Local
RptViewer1.LocalReport.DataSources.Clear()
RptViewer1.LocalReport.DataSources.Add(New ReportDataSource("DataSet1", ds.Tables("Permits")))
RptViewer1.LocalReport.DataSources.Add(New ReportDataSource("DataSet2", ds.Tables("PermitDevices")))
RptViewer1.LocalReport.ReportPath = Server.MapPath("~/Reports/" & ddlReports.SelectedValue & ".rdlc")
RptViewer1.LocalReport.DisplayName = ""
RptViewer1.LocalReport.Refresh()
'Hide print button due to required ActiveX plugin to be install. To install require Administrative (LDA) rights
RptViewer1.ShowPrintButton = False 
RptViewer1.Visible = True
```

Web.config
```xml
<system.web>
  <httpHandlers>
    <add path="Reserved.ReportViewerWebControl.axd" verb="*" type="Microsoft.Reporting.WebForms.HttpHandler, Microsoft.ReportViewer.WebForms, Version=11.0.0.0, Culture=neutral, PublicKeyToken=89845dcd8080cc91"
      validate="false" />
  </httpHandlers>
  <compilation debug="true" strict="false" explicit="true" targetFramework="4.5">

    <buildProviders>
      <add extension=".rdlc" type="Microsoft.Reporting.RdlBuildProvider, Microsoft.ReportViewer.WebForms, Version=11.0.0.0, Culture=neutral, PublicKeyToken=89845dcd8080cc91"/>
    </buildProviders>
  
    <assemblies>
      <!-- SSRS Viewer 2012 Runtime-->
      <add assembly="Microsoft.ReportViewer.WebForms, Version=11.0.0.0, Culture=neutral PublicKeyToken=89845DCD8080CC91" />
      <add assembly="Microsoft.ReportViewer.Common, Version=11.0.0.0, Culture=neutral, PublicKeyToken=89845DCD8080CC91" />
      <add assembly="Microsoft.Build.Framework, Version=4.0.0.0, Culture=neutral, PublicKeyToken=B03F5F7F11D50A3A" />
    </assemblies>
  </compilation>

  <pages>
    <namespaces/>
    <controls>
      <add assembly="Microsoft.ReportViewer.WebForms, Version=11.0.0.0, Culture=neutral, PublicKeyToken=89845dcd8080cc91" namespace="Microsoft.Reporting.WebForms" tagPrefix="rsweb"/>
    </controls>
  </pages>
</system.web>
```