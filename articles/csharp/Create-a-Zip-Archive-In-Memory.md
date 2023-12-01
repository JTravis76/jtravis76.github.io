# Create a Zip Archive in Memory
While working with a customer, they wanted the ability to export CSV files from the database.
However, opening CSV within MS Excel have a limit of around 65,000 columns. That makes it tricky to
layout the entire table and their relationships in a tabular format.

The solution is to create multiple CVS files and compress them into a zip archive.


This snippet demonstrates fetching data, building the heading based on the class type and populating data with a comma separated value. At this point the file byte array can be downloaded. But this article is about compressing.

```c#
var data = new List<Entities.Circuit>() 
{ 
    new Entities.Circuit()
    {
        Id = 1,
        Name = "Test",
        CircuitNumber = "123456"
    }
};

// == Create CSV data stream in memory
byte[] file = null;
using (var ms = new System.IO.MemoryStream())
{
    using (var sw = new System.IO.StreamWriter(ms, System.Text.Encoding.UTF8))
    {
        // Build CSV Header row via Reflection
        var headerRow = new List<string>();
        foreach (var propertyInfo in new Entities.Circuit().GetType().GetProperties())
        {
            headerRow.Add($"\"{propertyInfo.Name}\"");
        }
        sw.WriteLine(string.Join(",", headerRow));

        // Build CSV Data row and write to stream
        data
            .ToList()
            .ForEach(item =>
            {
                var rowValues = new List<string>();
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

To save some time, I skipped the creation of a second file. It's basically a repeated code from above. Could refactor to simply.

Now on to the zip archive. See below we created another memory stream and included a new ZipArchive object. We create a new entry, provide a name and open the archive to include the byte array created from the CSV.

For demonstration purposes, I created two zip entries. Probably better to build a collection of files and then loop through the collection.

Finally, we return a new `FileContentResult` passing a mime type of `application/zip`.

> `FileContentResult` is part of the Microsoft.AspNetCore.Mvc.ActionResult object.

```c#
byte[] compressedFile = null;
using (var ms = new System.IO.MemoryStream())
{
    using (var zipArchive = new ZipArchive(ms, ZipArchiveMode.Update, false))
    {
      // == add first file
        var zipEntry = zipArchive.CreateEntry("circuits.csv", CompressionLevel.Fastest);

        using (var stream = zipEntry.Open())
        {
            stream.Write(file, 0, file.Length);
        }

        // == add second file
        var zipEntry1 = zipArchive.CreateEntry("circuit-groups.csv", CompressionLevel.Fastest);

        using (var stream = zipEntry1.Open())
        {
            stream.Write(file1, 0, file1.Length);
        }
    }

    compressedFile = ms.ToArray();
    ms.Flush();
}

//return new FileContentResult(file, "application/octet-stream");
return new FileContentResult(compressedFile, "application/zip")
{
    FileDownloadName = "export.zip"
};
```