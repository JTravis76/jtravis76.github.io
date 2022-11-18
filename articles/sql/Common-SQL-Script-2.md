# Common SQL Script 2

Table of Content
* Create/ALTER a Store Procedure that will accept two variables for filtering.
* Export All Store Procedures to Text
* Restore a SQL Server Backup to LocalDb
* Restore a SQL Server Backup WITH REPLACE
* Fix Orghan Users
* Set Default Database
* Map User to Database
* List All Views
* List All Stored Procedure
* Parent Child query
* Auto Row Number
* Close SQL Connections
* Take DATABASE Offline
* Get Table information
* Find Table Name
* How to return Primary Key after INSERT
* UPDATE and REPLACE part of string
* CONDA: One way of getting the current record from a workflow
* Add DEFAULT constraint
* Add description to column in table


#------------------------------------------
# Create/ALTER a Store Procedure that 
# will accept two variables for filtering.
#------------------------------------------
USE [AdventureWorks]
GO

SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

ALTER/CREATE PROCEDURE [dbo].[spGetProducts]
	--Adjust Search Filters here
	@productName nvarchar(50) = NULL,
	@productNumber nvarchar(25) = NULL,

	--Default Parameters
	@OrderByClause nvarchar(max),
	@OffsetClause nvarchar(max)
AS
BEGIN

-- SET NOCOUNT ON added to prevent extra result sets from
-- interfering with SELECT statements.
SET NOCOUNT ON;

--Local variables
declare @sqlCommand  nvarchar(max);

--SQL statement
set @sqlCommand=N'
SET @p1 = ''%'' + @p1 + ''%'';
SET @p2 = ''%'' + @p2 + ''%'';
SELECT COUNT(*) OVER() AS [TotalRecords], p.* FROM Production.Product AS [p] WHERE 1=1';

--Add Filters to query if NOT NULL
IF @productName IS NOT NULL SET @sqlCommand = @sqlCommand + ' AND (p.Name LIKE @p1) ';
IF @productNumber IS NOT NULL SET @sqlCommand = @sqlCommand + ' AND ([p].ProductNumber LIKE @p2)';

-- Set Default Sorting
IF @OrderByClause IS NULL SET @OrderByClause = N' ORDER BY p.Name ASC';

-- Assume only single page is needed
-- (MUST inculde ORDER BY)
--EX: OFFSET 10 ROWS (Skip first 10 rows)
--EX: OFFSET 10 ROWS FETCH NEXT 5 ONLY (SKip first 10 rows and return next 5 rows)
IF @OffsetClause IS NULL SET @OffsetClause = N'';

--Build full query string 
set @sqlCommand = @sqlCommand + ' ' + @OrderByClause --+ ' ' + @OffsetClause;

--Execute statement with parameters
EXEC sp_executesql @sqlCommand
	, N'@p1 nvarchar(50), @p2 nvarchar(25)'
	, @p1 = @productName
	, @p2 = @productNumber

END

RETURN 0

#--------------------------------------
# Export All Store Procedures to Text
#--------------------------------------

DECLARE MY_CURSOR Cursor
FOR
SELECT r.Routine_Definition
FROM INFORMATION_SCHEMA.Routines r 
OPEN MY_CURSOR
    DECLARE @sproc VARCHAR(MAX) 
    FETCH NEXT FROM MY_CURSOR INTO @sproc
    WHILE (@@FETCH_STATUS <> -1)
    BEGIN
        IF (@@FETCH_STATUS <> -2)
        PRINT @sproc
        FETCH NEXT FROM MY_CURSOR INTO @sproc
    END
CLOSE MY_CURSOR
DEALLOCATE MY_CURSOR
GO


#--------------------------------------
# Restore a SQL Server Backup to LocalDb
#--------------------------------------
http://www.alteridem.net/2016/03/24/restore-a-sql-server-backup-to-localdb/

--STEP 1:

RESTORE FILELISTONLY
FROM DISK = 'C:\downloads\CONDA_backup_2017_02_07_001907_5349765.bak'
GO

--STEP 2:

----Make Database to single user Mode
ALTER DATABASE CONDA
SET SINGLE_USER WITH
ROLLBACK IMMEDIATE
 
----Restore Database
RESTORE DATABASE CONDA
FROM DISK = 'C:\downloads\CONDA_backup_2017_02_07_001907_5349765.bak'
WITH
MOVE 'CONDA' TO 'C:\Users\KDJ\AppData\Local\Microsoft\Microsoft SQL Server Local DB\Instances\SQLSvr2016\CONDA.mdf',
MOVE 'CONDA_log' TO 'C:\Users\KDJ\AppData\Local\Microsoft\Microsoft SQL Server Local DB\Instances\SQLSvr2016\CONDA.ldf',
REPLACE

--C:\Users\<USERNAME>\AppData\Local\Microsoft\Microsoft SQL Server Local DB\Instances\MSSQLLocalDB
 
/*If there is no error in statement before database will be in multiuser
mode.
If error occurs please execute following command it will convert
database in multi user.*/
ALTER DATABASE CONDA SET MULTI_USER
GO


#--------------------------------------
# Restore a SQL Server Backup WITH REPLACE
#--------------------------------------
RESTORE DATABASE CONDA
FROM DISK = '\\ddsqldev02\G$\MSSQLSERVER\Backup\CONDA\CONDA_backup_2017_04_28_005237_6296859.bak'
WITH REPLACE
GO


#--------------------------------------
# Fix Orghan Users
#--------------------------------------
--http://www.fileformat.info/tip/microsoft/sql_orphan_user.htm

EXEC sp_change_users_login 'Report'

EXEC sp_change_users_login 'Auto_Fix', 'DELTEKCP_Owner'

--If you want to create a new login id and password for this user, fix it by doing:
EXEC sp_change_users_login 'Auto_Fix', 'user', 'login', 'password'


#--------------------------------------
# Set Default Database
#--------------------------------------
ALTER LOGIN [ControlIT_Owner]
with DEFAULT_DATABASE = ControlIT
GO

OR

Exec sp_defaultdb @loginame='ControlIT_Owner', @defdb='master' 

#--------------------------------------
# Map User to Database
#--------------------------------------
use ControlIT
exec sp_addrolemember 'db_owner', 'ControlIT_Owner';


#--------------------------------------
# List All Views
#--------------------------------------
select * from [DatabaseName].sys.views


#--------------------------------------
# List All Stored Procedure
#--------------------------------------
select * 
  from DATABASE.information_schema.routines 
 where routine_type = 'PROCEDURE'
 and Left(Routine_Name, 3) NOT IN ('sp_', 'xp_', 'ms_', 'dt_')

 

#--------------------------------------
# Parent Child query
#--------------------------------------
/*
Parent Child query from the same table
#NOTE: must join manager (parent) key to the employee (child) key
*/
SELECT TOP 20
	(c.FirstName +' '+ c.LastName) AS [Employee]
	,(P.FirstName +' '+ P.LastName) AS [Manager]
FROM [AdventureWorksDW2012].[dbo].[DimEmployee] C
	LEFT OUTER JOIN [AdventureWorksDW2012].[dbo].[DimEmployee] P 
		ON c.ParentEmployeeKey = P.EmployeeKey
--WHERE c.EmployeeKey=1
	
	
#--------------------------------------
# Auto Row Number
#--------------------------------------
If needed, you can add an additional column to your query by using ROW_NUMBER():

ROW_NUMBER() over (order by (select null)) as RowNum

Example:
SELECT t.TST_NAME, PTD_READING, PTD_READING_TEXT
,ROW_NUMBER() over (order by (select null)) as RowNum
FROM [dbo].[TRN_PT_TESTS_DET] 
JOIN [dbo].[MST_TESTS] t ON t.TST_ID = PTD_TEST_ID 
WHERE [PTD_PTH_ID] = 
(select PTD_PTH_ID 
from [dbo].[TRN_PT_TESTS_DET] WHERE [PTD_READING_TEXT]='Y31836483')


#--------------------------------------
# Close SQL Connections
#--------------------------------------
USE master
GO
ALTER DATABASE mRemoteNG
SET OFFLINE WITH ROLLBACK IMMEDIATE
GO


#--------------------------------------
# Take DATABASE Offline
#--------------------------------------
Use Master
Go

Declare @dbname sysname

Set @dbname = 'ADM_Training'

Declare @spid int
Select @spid = min(spid) from master.dbo.sysprocesses
where dbid = db_id(@dbname)
While @spid Is Not Null
Begin
        Execute ('Kill ' + @spid)
        Select @spid = min(spid) from master.dbo.sysprocesses
        where dbid = db_id(@dbname) and spid > @spid
End

exec sp_who


#--------------------------------------
# Get Table information
#--------------------------------------
--use to display column info about a selected table

SELECT 
    c.name 'Column Name',
    t.Name 'Data type',
    c.max_length 'Max Length',
    c.precision ,
    c.scale ,
    c.is_nullable,
    ISNULL(i.is_primary_key, 0) 'Primary Key'
FROM    
    sys.columns c
INNER JOIN 
    sys.types t ON c.system_type_id = t.system_type_id
LEFT OUTER JOIN 
    sys.index_columns ic ON ic.object_id = c.object_id AND ic.column_id = c.column_id
LEFT OUTER JOIN 
    sys.indexes i ON ic.object_id = i.object_id AND ic.index_id = i.index_id
WHERE
    c.object_id = OBJECT_ID('tablename')
	
	
#--------------------------------------
# Find Table Name
#--------------------------------------	
/*FInd table names that match*/
SELECT t.name AS table_name,
SCHEMA_NAME(schema_id) AS schema_name,
c.name AS column_name
FROM sys.tables AS t
INNER JOIN sys.columns c ON t.OBJECT_ID = c.OBJECT_ID
WHERE c.name LIKE '%Site%'
ORDER BY schema_name, table_name; 	




#------------------------------------------------
# How to return Primary Key after INSERT
#------------------------------------------------

-- Add new email group with members for emailing error reports
DECLARE @grouptype_id bigint;
INSERT INTO [dbo].[GroupTypes] ([grouptype_name], [created_by], [created_date], [updated_by], [updated_date], [deleted_by], [deleted_date], [is_deleted], [is_active]) VALUES (N'IT Department', N'DDPORTS\JAH', N'2017-07-27 12:39:27', NULL, NULL, NULL, NULL, NULL, NULL);
SELECT @grouptype_id = Scope_Identity();

DECLARE @group_id bigint;
INSERT INTO [dbo].[Groups] ([group_name], [group_type], [created_by], [created_date], [updated_by], [updated_date], [deleted_by], [deleted_date], [is_active], [is_deleted], [group_typeid]) VALUES (25, N'Software Developers', N'IT Department', N'DDPORTS\JAH', N'2017-07-27 12:40:10', NULL, NULL, NULL, NULL, NULL, NULL, @grouptype_id);
SELECT @group_id = Scope_Identity();

INSERT INTO [dbo].[GroupMembers] ([groupmember_id], [group_id], [groupmember_pid], [groupmember_ntusername], [groupmember_fullname], [groupmember_email], [created_by], [created_date], [updated_by], [updated_date], [deleted_by], [deleted_date], [is_active], [is_deleted], [groupmember_contact], [groupmember_badge]) VALUES (@group_id, NULL, N'DDPORTS\JAH', N'Jason Ashworth', N'Jason.Ashworth@fbports.com', N'DDPORTS\JAH', N'2017-07-27 12:40:10', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO [dbo].[GroupMembers] ([groupmember_id], [group_id], [groupmember_pid], [groupmember_ntusername], [groupmember_fullname], [groupmember_email], [created_by], [created_date], [updated_by], [updated_date], [deleted_by], [deleted_date], [is_active], [is_deleted], [groupmember_contact], [groupmember_badge]) VALUES (@group_id, NULL, N'DDPORTS\KDJ', N'Jeremy Travis', N'Jeremy.Travis@fbports.com', N'DDPORTS\JAH', N'2017-07-27 12:40:10', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO [dbo].[GroupMembers] ([groupmember_id], [group_id], [groupmember_pid], [groupmember_ntusername], [groupmember_fullname], [groupmember_email], [created_by], [created_date], [updated_by], [updated_date], [deleted_by], [deleted_date], [is_active], [is_deleted], [groupmember_contact], [groupmember_badge]) VALUES (@group_id, NULL, N'DDPORTS\BQ2', N'Mike Short', N'mike.short@fbports.com', N'DDPORTS\JAH', N'2017-07-27 12:40:10', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
GO

#------------------------------------------------
# UPDATE and REPLACE part of string
#------------------------------------------------

ID | ItemNumber                | RequestId
-------------------------------------------
1  | X-705 GSS Line 9 Item 001 | 14619

UPDATE CONDA.dbo.Items SET ItemNumber = REPLACE(ItemNumber, '-', '') WHERE RequestId = 14619;

ID | ItemNumber                | RequestId
-------------------------------------------
1  | X705 GSS Line 9 Item 001  | 14619



#------------------------------------------------
# One way of getting the current record from a workflow
#------------------------------------------------
WITH CurrentWorkflow AS (
	SELECT batchworkflow.*
	FROM batchworkflow
	WHERE BatchWorkflowId =(
		SELECT MAX(batchworkflowId)
			FROM batchworkflow AS bi
			WHERE bi.batchid=BatchWorkflow.BatchId
		)
)
...

LEFT JOIN CurrentWorkflow
	ON CurrentWorkflow.BatchId = [Batches].BatchId


#------------------------------------------------
#  Add DEFAULT constraint
#------------------------------------------------


ALTER TABLE [dbo].[BillingProvider] 
ADD  CONSTRAINT [DF_BillingProvider_CreatedDate]  DEFAULT (getdate()) FOR [CreatedDate]
GO

#------------------------------------------------
#  Add description to column in table
#------------------------------------------------
EXEC sys.sp_addextendedproperty
@name=N'MS_Description', @value=N'Primary Key.',
@level0type=N'SCHEMA',
@level0name=N'dbo',
@level1type=N'TABLE',
@level1name=N'FacilityBillingProvider',
@level2type=N'COLUMN',
@level2name=N'FacilityBillingProvider_ID'

