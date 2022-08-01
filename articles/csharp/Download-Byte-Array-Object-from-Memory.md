# Download Byte Array Object from Memory

```csharp
// some service to load a file in memory
byte[] data = _someService();

//Download the byte data from memory
var http = System.Web.HttpContext.Current.Response;
http.Clear();
http.AddHeader("Content-disposition", "attachment;filename=" + "File.csv");
http.AddHeader("Content-Length", data.Length.ToString());
http.ContentType = "application/octet-stream";
http.BinaryWrite(data);
http.End();
```
