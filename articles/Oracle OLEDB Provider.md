#meta-start
Title:Oracle OLEDB provider for MSSQLLOCALDB
Created:6/22/2020
Category:visualstudio
#meta-end
# Oracle OLEDB provider for MSSQLLOCALDB
Once I was tasked to convert an Excel project into a web application. Often times, I like to build a local database with SQL project to track changes and to ease local development. However, this Excel application was a monster. VBA macros and Store Procedures everywhere. Thankfully, the original developer use a Ms SQL server as the back-end data store. Boy, as this monster unfold, there was a Oracle link server hided in the wild.

Below is how I was able to add the Oracle OLEDB provider to MS SQL LocalDB.  
Here is error message I recieved:
```
(644,1): SQL72014: .Net SqlClient Data Provider: 
Msg 7438, Level 16, State 1, Procedure sp_RADAR_SDG_MASTER_LIST_VIEW_SELECT_Compare_To_ADAT, 
Line 48 The 32-bit OLE DB provider "OraOLEDB.Oracle" cannot be loaded 
in-process on a 64-bit SQL Server
```

First download the provider
* https://www.oracle.com/database/technologies/odac-downloads.html
* Download ODAC122010Xcopy_x64.zip
* use login from bugmennot.com to download
  * login.oracle.com
  * ikigigiadtaxhhsgjn@awdrt.org
  * jnsdfsKuhd&-45
* unzip contents
* Run cmd prompt as Administrator
* CD to unzipped directory
* run `install.bat OLEDB C:\app odac`
* Set OraOLEDB.Oracle provider to `Allow inprocess`
  * Due to permissions, had to allow access to registry or use reg import

```reg
Windows Registry Editor Version 5.00

[HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Microsoft SQL Server\MSSQL13E.LOCALDB\Providers\OraOLEDB.Oracle]
"AllowInProcess"=dword:00000001
```

* Restart MSSQLLOCALDB services
* sqllocaldb stop mssqllocaldb
* sqllocaldb start mssqllocaldb

Now after that was installed, able to confirm installation by connecting to MSSQLOCALDB via SSMM. 

Hit the query again and got a new error message.
```
Msg 7302, Level 16, State 1, Procedure sp_RADAR_SDG_MASTER_LIST_VIEW_SELECT_Compare_To_ADAT, Line 644
Cannot create an instance of OLE DB provider "OraOLEDB.Oracle" for linked server "RADAR".
** An error was encountered during execution of batch. Exiting.
```

Details how to correct this error was found here:
https://fullparam.wordpress.com/2011/05/05/cannot-create-an-instance-of-ole-db-provider-oraoledb-oracle-for-linked-server/

In-short, had to add the proper directory to the lookup path.
* Since I installed the OLEDB provider to C:\app directory, hade to add both;
  C:\app and c:\app\bin to the System Path Environment variable,
* Restart computer