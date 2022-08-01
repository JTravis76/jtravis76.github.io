# Find DNS Computer Name from IP Address

```csharp
public static string DetermineComputerName(string IP)
{
    System.Net.IPAddress myIP = System.Net.IPAddress.Parse(IP);
    System.Net.IPHostEntry GetIPHost = System.Net.Dns.GetHostEntry(myIP);
    List<string> compName = GetIPHost.HostName.ToString().Split('.').ToList();
    return compName.First();
}
```