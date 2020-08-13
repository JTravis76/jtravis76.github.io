#meta-start
Title:Common SQL Scripts
Created:8-11-2020
Category:sql
#meta-end
# Common SQL Scripts

Table of Contents
* Database Backups
* Database Restore
* Truncate Logs
* Database Offline/Online
* Create Database
* SQL Profiler
* Move TempDB
* Copy/Move Database via xp_cmdshell
* ALTER TABLE
* Linked Servers

## Database Backups

Create directory and backup database

WITH NOINIT,  *Will append backups to existing file.*

WITH FORMAT,  *Will over-write file with new backup*

```sql
-- Creates a sub-directory
EXECUTE master.dbo.xp_create_subdir N'D:\SQLbackup\master'
GO
EXECUTE master.dbo.xp_create_subdir N'D:\SQLbackup\AdventureWorks'
GO

SELECT @fileDate = CONVERT(VARCHAR(20),GETDATE(),112)

BACKUP DATABASE [master] TO  DISK = N'D:\SQLbackup\master\master_' + @fileDate + '.bak' WITH NOFORMAT, NOINIT,  NAME = N'master', SKIP, REWIND, NOUNLOAD,  STATS = 10
GO
BACKUP DATABASE [AdventureWorks] TO  DISK = N'D:\SQLbackup\AdventureWorks\AdventureWorks' + @fileDate + '.bak' WITH NOFORMAT, NOINIT,  NAME = N'AdventureWorks', SKIP, REWIND, NOUNLOAD,  STATS = 10
GO

-- another option
USE AdventureWorks;
GO
BACKUP DATABASE AdventureWorks
TO DISK = 'C:\Program Files\Microsoft SQL Server\MSSQL10\MSSQL\Backup\AdventureWorks.Bak'
   WITH NOINIT,
      MEDIANAME = 'AdventureWorks-Full Database Backup',
      NAME = 'AdventureWorks-Full Database Backup';
GO
```

Backup ALL databases

```sql
DECLARE @name VARCHAR(50) -- database name 
DECLARE @path VARCHAR(256) -- path for backup files 
DECLARE @fileName VARCHAR(256) -- filename for backup 
DECLARE @fileDate VARCHAR(20) -- used for file name

SET @path = 'C:\Database Backups\' 

SELECT @fileDate = CONVERT(VARCHAR(20),GETDATE(),112)

DECLARE db_cursor CURSOR FOR 
SELECT name 
FROM master.dbo.sysdatabases 
WHERE name NOT IN ('tempdb') 

OPEN db_cursor  
FETCH NEXT FROM db_cursor INTO @name  

WHILE @@FETCH_STATUS = 0  
BEGIN  
       SET @fileName = @path + @name + '_' + @fileDate + '.BAK' 
       BACKUP DATABASE @name TO DISK = @fileName 

       FETCH NEXT FROM db_cursor INTO @name  
END  

CLOSE db_cursor  
DEALLOCATE db_cursor
```

## Database Restore

```sql
-- STEP 1:

USE [master]
GO

RESTORE FILELISTONLY
FROM DISK = 'C:\SQ_Bckup\AdventureWorks_backup_2019_10_16_235809_3284914.bak'
GO

--STEP 2:

----Make Database to single user Mode
ALTER DATABASE AdventureWorks
SET SINGLE_USER WITH
ROLLBACK IMMEDIATE
 
----Restore Database
RESTORE DATABASE AdventureWorks
FROM DISK = 'C:\SQ_Bckup\AdventureWorks_backup_2019_10_16_235809_3284914.bak'
WITH
MOVE 'AdventureWorks' TO 'C:\Users\<USERNAME>\AppData\Local\Microsoft\Microsoft SQL Server Local DB\Instances\MSSQLLocalDB\AdventureWorks.mdf',
MOVE 'AdventureWorks_log' TO 'C:\Users\<USERNAME>\AppData\Local\Microsoft\Microsoft SQL Server Local DB\Instances\MSSQLLocalDB\AdventureWorks.ldf',
REPLACE --, RECOVERY --force restore 


/* ====
 * If there is no error in statement before database will be in multiuser mode.
 * If error occurs please execute following command it will convert database in multi user.
 */
ALTER DATABASE AdventureWorks SET MULTI_USER
GO


--STEP 3: CHECK INTEGRITY (optional)
DBCC CHECKDB('AdventureWorks')
```

## Truncate Logs

```sql
-- Check file size BEFORE truncating..
exec sp_helpfile

--Pre SQL 2008 cmd
USE AdventureWorks 
GO
--BACKUP LOG AdventureWorks WITH TRUNCATE_ONLY
GO
DBCC SHRINKFILE (AdventureWorks_log, 1)
GO
DBCC SHRINKFILE (AdventureWorks, 1)
GO
exec sp_helpfile
 
 
--SQL 2008 cmd
USE AdventureWorks;
GO
-- Truncate the log by changing the database recovery model to SIMPLE.
ALTER DATABASE AdventureWorks
SET RECOVERY SIMPLE;
GO
-- Shrink the truncated log file to 1 MB.
DBCC SHRINKFILE (2, 1);  -- here 2 is the file ID for trasaction log file,you can also mention the log file name (dbname_log)
GO
-- Reset the database recovery model.
ALTER DATABASE AdventureWorks
SET RECOVERY FULL;
GO
exec sp_helpfile
```

## Database Offline/Online

```sql
use [master]
go

ALTER DATABASE [AdventureWorks] SET OFFLINE WITH
ROLLBACK IMMEDIATE
GO

ALTER DATABASE [AdventureWorks] SET ONLINE
GO
```

## Create Database

```sql
-- May comment Log file has SQL server will create a new one
CREATE DATABASE AdventureWorks   
    ON (FILENAME = 'C:\Users\KDJ\AppData\Local\Microsoft\Microsoft SQL Server Local DB\Instances\MSSQLLocalDB\AdventureWorks2012.mdf'),   
       (FILENAME = 'C:\Users\KDJ\AppData\Local\Microsoft\Microsoft SQL Server Local DB\Instances\MSSQLLocalDB\AdventureWorks_Log.ldf')   
    FOR ATTACH;
```

## SQL Profiler

```sql
USE Master;
GO
CREATE LOGIN profiler
    WITH PASSWORD = 'SomeStrongPassword';
GO

USE AdventureWorks
GO
CREATE USER profiler FOR LOGIN profiler
GO 

exec sp_addrolemember 'db_owner', 'profiler';
GO


sp_helplogins profiler

USE Master;
GO
GRANT ALTER TRACE TO profiler
GO
```

## Move TempDB

```sql
USE TempDB
GO
EXEC sp_helpfile
GO

USE master
GO
ALTER DATABASE TempDB MODIFY FILE
(NAME = tempdev, FILENAME = 'E:\MSSQL\tempdb.mdf')
GO
ALTER DATABASE TempDB MODIFY FILE
(NAME = templog, FILENAME = 'E:\MSSQL\templog.ldf')
GO
```

## Copy/Move Database via xp_cmdshell

```sql
/*
--Enable xp_cmdshell
EXEC sp_configure 'show advanced options', 1
GO
-- To update the currently configured value for advanced options.
RECONFIGURE
GO
-- To enable the feature.
EXEC sp_configure 'xp_cmdshell', 1
GO
-- To update the currently configured value for this feature.
RECONFIGURE
GO 
*/

-- 1.-SET DATABASE OFFLINE
ALTER DATABASE [TestDB] SET OFFLINE WITH ROLLBACK IMMEDIATE
GO
--2.- MOVE FILES TO NEW LOCATION
EXEC xp_cmdshell 'COPY "F:\MSSQL\DATA\AdventureWorks_log.ldf" "E:\MSSQL\DATA\AdventureWorks_log.ldf"'
GO
EXEC xp_cmdshell 'COPY "F:\MSSQL\DATA\AdventureWorks.mdf" "E:\MSSQL\DATA\AdventureWorks.mdf"'
GO
-- 3.- ALTER DATABASE MODIFY FILE NAME
-- 3.- LOG
ALTER DATABASE [AdventureWorks] MODIFY FILE ( NAME = 'AdventureWorks_log', FILENAME = 'E:\MSSQL\DATA\AdventureWorks_log.ldf' )
GO
--3.- DATA
ALTER DATABASE [AdventureWorks] MODIFY FILE ( NAME = 'AdventureWorks', FILENAME = 'E:\MSSQL\DATA\AdventureWorks.mdf' )
GO
--4.- SET DATABASE ONLINE
ALTER DATABASE [AdventureWorks] SET ONLINE
GO
--OPTIONAL
-- 5.- CHECK INTEGRITY
DBCC CHECKDB('AdventureWorks')
GO
-- 6.- DELETE THE OLD DATABASE FILES
/*
EXEC xp_cmdshell 'DEL /Q 'F:\MSSQL\DATA\AdventureWorks_log.ldf"'
GO
EXEC xp_cmdshell 'DEL /Q 'F:\MSSQL\DATA\AdventureWorks.mdf"'
*/
```

## ALTER TABLE

```sql
ALTER TABLE [TableName]
ADD [ColumnName] VARCHAR(50)
--ALTER COLUMN [ColumnName] DataType
--DROP COLUMN [column_name]

ALTER TABLE [Users]
ADD UNIQUE (name)

--Rename column
EXEC sp_rename 'MaterialList.StoreNumber', 'EquipNumber', 'COLUMN';

-- Primary Key
ALTER TABLE dbo.TableName
ADD CONSTRAINT [PK_TableName] PRIMARY KEY (Id);
--  CONSTRAINT [PK_TableName] PRIMARY KEY CLUSTERED ([ColumnName] ASC, [ColumnName] ASC)

-- Foreign Key
ALTER TABLE dbo.TableName
ADD CONSTRAINT [FK_CurrentTable_ParentTable] FOREIGN KEY ([ColumnName]) REFERENCES [ParentTable]([ColumnName])
--DROP CONSTRAINT [FK_CurrentTable_ParentTable]
GO


ALTER TABLE TableName
ALTER COLUMN ColumnName DataType CONSTRAINT [DF_TableName_ColumnName] DEFAULT 0
```

## Linked Servers

This example was use on a job where I needed to link SQL Server and a MS Access database file.

```sql
--On your Server Objects > Linked Servers > Providers, 
--Right Click on Microsoft.ACE.OLEDB.12.0 and select Options. Check the option Allow inprocess

EXEC sp_addlinkedserver 
    @server = N'MSAccessDB', 
    @provider = N'Microsoft.ACE.OLEDB.12.0', 
    @srvproduct = N'Access2010',
    @datasrc = N'Z:\MSAccessDB.accdb'
GO

-- Set up login mapping using current user's security context
EXEC sp_addlinkedsrvlogin 
    @rmtsrvname = N'MSAccessDB',
    @useself = N'TRUE',
    @locallogin = NULL, 
    @rmtuser = N'MSAccessDB', 
    @rmtpassword = ''
GO

-- List the tables on the linked server
EXEC sp_tables_ex N'MSAccessDB'
GO

-- Select all the rows from table1
SELECT * FROM [MSAccessDB]...table1
```