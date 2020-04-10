#meta-start
Title:FileSystemWatcher
Created:3-18-2020
Category:dotnetframework
#meta-end
# FileSystemWatcher
---
FileSystemWatcher is a Microsoft [class](https://docs.microsoft.com/en-us/dotnet/api/system.io.filesystemwatcher?view=netframework-4.8). 

Needed the ability to watch changes for a directory of Typescript files. Below is an example from a console application I was playing with.

> NOTE: FileSystemWatcher will not fired when both Modfied Date and Last Access date are update together

```csharp
[System.Security.Permissions.PermissionSet(System.Security.Permissions.SecurityAction.Demand, Name = "FullTrust")]
static void Main(string[] args)
{
    System.IO.FileSystemWatcher watcher = new System.IO.FileSystemWatcher
    {
        Path = @"C:\Directory\",
        NotifyFilter = System.IO.NotifyFilters.LastWrite,
        Filter = "*.txt",
        IncludeSubdirectories = false
    };

    watcher.Error += OnError;
    watcher.Changed += new System.IO.FileSystemEventHandler(OnChanged);
    watcher.EnableRaisingEvents = true;


    // Wait for the user to quit the program.
    System.Console.WriteLine("Press \'q\' to quit the sample.");
    while (System.Console.Read() != 'q') ;
}


private static void OnChanged(object source, System.IO.FileSystemEventArgs e)
{
    watcher.EnableRaisingEvents = false;

    //TODO: Your Code Here ---->

    watcher.EnableRaisingEvents = true;
}

static void OnError(object sender, System.IO.ErrorEventArgs e)
{
    System.Exception ex = e.GetException();
    System.Console.WriteLine(ex.Message);
    if (ex.InnerException != null)
    {
        System.Console.WriteLine(ex.InnerException);
    }
}
```