# Create a CSV Object in Memory
Below is a sample on how to create a CVS file on-the-fly within memory. This memory object can later be downloaded or saved to a flay file.

`SomeEntityModel()` is a C# class that represents the data being collected for the CSV report.

```csharp
// a collection of SomeEntityModel
var data = _someCollectionOfData();

// Create CSV data stream in memory
byte[] file = null;
using (System.IO.MemoryStream ms = new System.IO.MemoryStream())
{
    using (System.IO.StreamWriter sw = new System.IO.StreamWriter(ms, System.Text.Encoding.UTF8))
    {
        // Build CSV Header row via Reflection
        List<string> headerRow = new List<string>();
        foreach (var propertyInfo in new SomeEntityModel().GetType().GetProperties())
        {
            headerRow.Add($"\"{propertyInfo.Name}\"");
        }
        sw.WriteLine(string.Join(",", headerRow));

        // Build CSV Data row and write to stream
        data
            .ToList()
            .ForEach(item =>
            {
                List<string> rowValues = new List<string>();
                foreach (var propertyInfo in item.GetType().GetProperties())
                {
                    object info = item.GetType().GetProperty(propertyInfo.Name)
                        .GetValue(item, null);
                    rowValues.Add($"\"{info}\"");
                }
                sw.WriteLine(string.Join(",", rowValues));
            });
        sw.Flush();

        ms.Position = 0;
        file = ms.ToArray();
    }

    ms.Flush();
}
```