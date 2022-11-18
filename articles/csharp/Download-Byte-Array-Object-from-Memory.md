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

Here is another example I used within an Azure Function to download a CSV file. This samples below contains both File Stream and Base64 methods.

```csharp
byte[] file = _someService.GetReport();

// This style would require a new browser tab/window to handle the download
// Caution! during a new tab/pop-up window, the authentication header make NOT be supplied
string filename = $"attachment;filename=report-{System.DateTime.Now}.csv";
request.HttpContext.Response.Headers.Add("Content-disposition", filename);
request.HttpContext.Response.Headers.Add("Content-Length", file.Length.ToString());
return new FileContentResult(file, "application/octet-stream");
```

```csharp
byte[] file = _someService.GetReport();

// == This approach converts the byte array into a base64
// One benefit to this approach, is passing the authentication token into the API end-point
string base64 = $"data:application/octet-stream;base64,{System.Convert.ToBase64String(file, 0, file.Length)}";
request.HttpContext.Response.Headers.Add("Content-Length", base64.Length.ToString());
return new OkObjectResult(base64);
```

When using the Base64 method, you can trigger a download via the web UI using this snippet.

```ts
fetch("api-url", {
    method: "GET"
}).then(async (resp) => {
    const data = await resp.text();
    // download directly
    const date = new Date().toLocaleDateString().replaceAll("/", "-");
    const link = document.createElement("a");
    link.href = data;
    link.download = `report_${date}.csv`;
    link.click();
});
```