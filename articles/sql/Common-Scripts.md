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
* ALTER LOGIN
* Transfer Logins

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

## ALTER LOGIN

```sql
USE [master]
GO

ALTER LOGIN [sa] WITH PASSWORD = N'' 
GO

ALTER LOGIN [sa] ENABLE
GO
```

## Transfer Logins

```sql
EXEC master..sp_help_revlogin 'haveradm'


USE master
GO
IF OBJECT_ID ('sp_hexadecimal') IS NOT NULL
  DROP PROCEDURE sp_hexadecimal
GO
CREATE PROCEDURE sp_hexadecimal
    @binvalue varbinary(256),
    @hexvalue varchar (514) OUTPUT
AS
DECLARE @charvalue varchar (514)
DECLARE @i int
DECLARE @length int
DECLARE @hexstring char(16)
SELECT @charvalue = '0x'
SELECT @i = 1
SELECT @length = DATALENGTH (@binvalue)
SELECT @hexstring = '0123456789ABCDEF'
WHILE (@i <= @length)
BEGIN
  DECLARE @tempint int
  DECLARE @firstint int
  DECLARE @secondint int
  SELECT @tempint = CONVERT(int, SUBSTRING(@binvalue,@i,1))
  SELECT @firstint = FLOOR(@tempint/16)
  SELECT @secondint = @tempint - (@firstint*16)
  SELECT @charvalue = @charvalue +
    SUBSTRING(@hexstring, @firstint+1, 1) +
    SUBSTRING(@hexstring, @secondint+1, 1)
  SELECT @i = @i + 1
END

SELECT @hexvalue = @charvalue
GO
 
IF OBJECT_ID ('sp_help_revlogin') IS NOT NULL
  DROP PROCEDURE sp_help_revlogin
GO
CREATE PROCEDURE sp_help_revlogin @login_name sysname = NULL AS
DECLARE @name sysname
DECLARE @type varchar (1)
DECLARE @hasaccess int
DECLARE @denylogin int
DECLARE @is_disabled int
DECLARE @PWD_varbinary  varbinary (256)
DECLARE @PWD_string  varchar (514)
DECLARE @SID_varbinary varbinary (85)
DECLARE @SID_string varchar (514)
DECLARE @tmpstr  varchar (1024)
DECLARE @is_policy_checked varchar (3)
DECLARE @is_expiration_checked varchar (3)

DECLARE @defaultdb sysname
 
IF (@login_name IS NULL)
  DECLARE login_curs CURSOR FOR

      SELECT p.sid, p.name, p.type, p.is_disabled, p.default_database_name, l.hasaccess, l.denylogin FROM 
sys.server_principals p LEFT JOIN sys.syslogins l
      ON ( l.name = p.name ) WHERE p.type IN ( 'S', 'G', 'U' ) AND p.name <> 'sa'
ELSE
  DECLARE login_curs CURSOR FOR


      SELECT p.sid, p.name, p.type, p.is_disabled, p.default_database_name, l.hasaccess, l.denylogin FROM 
sys.server_principals p LEFT JOIN sys.syslogins l
      ON ( l.name = p.name ) WHERE p.type IN ( 'S', 'G', 'U' ) AND p.name = @login_name
OPEN login_curs

FETCH NEXT FROM login_curs INTO @SID_varbinary, @name, @type, @is_disabled, @defaultdb, @hasaccess, @denylogin
IF (@@fetch_status = -1)
BEGIN
  PRINT 'No login(s) found.'
  CLOSE login_curs
  DEALLOCATE login_curs
  RETURN -1
END
SET @tmpstr = '/* sp_help_revlogin script '
PRINT @tmpstr
SET @tmpstr = '** Generated ' + CONVERT (varchar, GETDATE()) + ' on ' + @@SERVERNAME + ' */'
PRINT @tmpstr
PRINT ''
WHILE (@@fetch_status <> -1)
BEGIN
  IF (@@fetch_status <> -2)
  BEGIN
    PRINT ''
    SET @tmpstr = '-- Login: ' + @name
    PRINT @tmpstr
    IF (@type IN ( 'G', 'U'))
    BEGIN -- NT authenticated account/group

      SET @tmpstr = 'CREATE LOGIN ' + QUOTENAME( @name ) + ' FROM WINDOWS WITH DEFAULT_DATABASE = [' + @defaultdb + ']'
    END
    ELSE BEGIN -- SQL Server authentication
        -- obtain password and sid
            SET @PWD_varbinary = CAST( LOGINPROPERTY( @name, 'PasswordHash' ) AS varbinary (256) )
        EXEC sp_hexadecimal @PWD_varbinary, @PWD_string OUT
        EXEC sp_hexadecimal @SID_varbinary,@SID_string OUT
 
        -- obtain password policy state
        SELECT @is_policy_checked = CASE is_policy_checked WHEN 1 THEN 'ON' WHEN 0 THEN 'OFF' ELSE NULL END FROM sys.sql_logins WHERE name = @name
        SELECT @is_expiration_checked = CASE is_expiration_checked WHEN 1 THEN 'ON' WHEN 0 THEN 'OFF' ELSE NULL END FROM sys.sql_logins WHERE name = @name
 
            SET @tmpstr = 'CREATE LOGIN ' + QUOTENAME( @name ) + ' WITH PASSWORD = ' + @PWD_string + ' HASHED, SID = ' + @SID_string + ', DEFAULT_DATABASE = [' + @defaultdb + ']'

        IF ( @is_policy_checked IS NOT NULL )
        BEGIN
          SET @tmpstr = @tmpstr + ', CHECK_POLICY = ' + @is_policy_checked
        END
        IF ( @is_expiration_checked IS NOT NULL )
        BEGIN
          SET @tmpstr = @tmpstr + ', CHECK_EXPIRATION = ' + @is_expiration_checked
        END
    END
    IF (@denylogin = 1)
    BEGIN -- login is denied access
      SET @tmpstr = @tmpstr + '; DENY CONNECT SQL TO ' + QUOTENAME( @name )
    END
    ELSE IF (@hasaccess = 0)
    BEGIN -- login exists but does not have access
      SET @tmpstr = @tmpstr + '; REVOKE CONNECT SQL TO ' + QUOTENAME( @name )
    END
    IF (@is_disabled = 1)
    BEGIN -- login is disabled
      SET @tmpstr = @tmpstr + '; ALTER LOGIN ' + QUOTENAME( @name ) + ' DISABLE'
    END
    PRINT @tmpstr
  END

  FETCH NEXT FROM login_curs INTO @SID_varbinary, @name, @type, @is_disabled, @defaultdb, @hasaccess, @denylogin
   END
CLOSE login_curs
DEALLOCATE login_curs
RETURN 0
GO
```