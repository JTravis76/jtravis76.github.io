# Memory Stream from Physical File

```csharp
using(System.IO.Stream ms = new System.IO.MemoryStream())
{
	using(FileStream fs = File.OpenRead(@"C:\TestFile.docx"))
	{            
		ms.SetLength(fs.Length);
		fs.Position = 0;
		fs.Seek(0, SeekOrigin.Begin);
		
		fs.CopyTo(ms);

		ms.Position = 0;
		ms.Seek(0, SeekOrigin.Begin);
		byte[] buf = new byte[fs.Length];
		ms.Read(buf, 0, buf.Length);
		fs.Read(buf, 0, buf.Length);                    
	}
}
```
