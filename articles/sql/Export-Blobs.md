#meta-start
Title:Export Blobs
Created:8-31-2020
Category:sql
#meta-end
# Exporting Blobs - SQL
While working at Life Ambulance/First Med, I was task to move jpeg images stores in out database to a filesystem. Here is the snippet I used.

```sql
--Use to export SQLImage from DB to File (Disk)
Declare @sql varchar(500);

/*
SET @sql = 'BCP ADM_AAA.dbo.EDMS format nul -T -n -f E:\testblob1.fmt -S ' + @@SERVERNAME
select @sql 
EXEC master.dbo.xp_CmdShell @sql 
--edit format in notepad to ONLY export SQLBIN or SQLIMAGE
*/

DECLARE @i int = 1
WHILE @i < 10
	BEGIN
		SET @sql = 'BCP "SELECT Blob FROM ADM_AAA.dbo.EDMS WHERE ID='+ CONVERT(varchar,@i) +'" QUERYOUT G:\'+ CONVERT(varchar,@i) +'.jpg -T -f E:\testblob.fmt -S' + @@SERVERNAME
		EXEC master.dbo.xp_CmdShell @sql 
		SET @i = @i + 1;
	END

```