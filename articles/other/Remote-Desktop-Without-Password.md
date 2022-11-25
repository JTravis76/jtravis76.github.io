# Remote Desktop Without Password
You might what to RDP into a local workstation with setting up nor using a password. Update the registry key as shown below.

```reg
Computer\HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Lsa
LimitBlankPasswordUse = 0
```
