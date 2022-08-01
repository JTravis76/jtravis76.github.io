# System Admin Command Tips

## Grant Read/Write permission to a folder
icacls "C:\Program Files\nodejs" /grant fred.flintstone:F /T
icacls "C:\Program Files\Microsoft SQL Server\MSSQL15.MSSQLSERVER\MSSQL\DATA"  /grant fred.flintstone:F /T


## Uninstall a Program
>wmic

>product get name

>product where name="???" call uninstall