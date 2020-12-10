# Testing Firewall Ports
Often times I find myself needing to test to see if a network port is open or closed. Here is two great ways.

```bat
tnc exmail.ports.pppo.gov -Port 587
```

```powershell
New-Object System.Net.Sockets.TcpClient("exmail.domain.net", 587)
```