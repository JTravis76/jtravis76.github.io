# SQL Pagination with Sorting
Once I was tasked by my team lead to create a SQL script that has pagination along with column sorting. Although the team lead didn't approve of dynamic queries, and I understand why. It's difficult to piece together the strings to test/debug the query. But here it is anyways.

This first snippet is how I would set a general query for designing and testing purposes.

```sql
DECLARE
  @SEARCH AS VARCHAR(100) = '',
  @PAGE_INDEX AS INT = 1,
  @PAGE_SIZE AS INT = 20,
  @SORT_COLUMN AS VARCHAR(100) = '',
  @SORT_DIRECTION AS VARCHAR(4) = '';

--== BODY ==--
-- prevent extra result sets from interfering with SELECT statements
SET NOCOUNT ON;

SET @Search = ISNULL(@Search, '');
SET @SORT_DIRECTION = ISNULL(@SORT_DIRECTION, 'ASC');

-- Set default sorting
IF (ISNULL(@SORT_COLUMN, '') = '')
BEGIN
  SET @SORT_COLUMN = 'UserName'; 
  SET @SORT_DIRECTION = 'ASC';
END

DECLARE @SKIP AS INT = 0;
SET @SKIP = (@PAGE_INDEX * @PAGE_SIZE) - @PAGE_SIZE;

SELECT
	ROW_NUMBER() OVER (ORDER BY UserName) AS [RowNo],
	u.UserId, u.UserName,
	CASE
		WHEN u.UserAccountType = 1 THEN 'DRC'
		WHEN u.UserAccountType = 2 THEN 'Community'
		ELSE ''
	END AS [AccountType], 
	u.FirstName, u.LastName,
	ue.ORASUser, ue.CCISUser
FROM [dbo].[Users](NOLOCK) AS u
LEFT JOIN [dbo].[UserExtensions](NOLOCK) AS ue
	ON ue.UserExtensionId = u.UserId
WHERE u.UserName LIKE '%'+ @SEARCH +'%'
ORDER BY u.UserName ASC
OFFSET @SKIP ROWS
FETCH NEXT @PAGE_SIZE ROWS ONLY
```

Now comes the creation of the stored procedure with dynamic queries.

```sql
-- =============================================
-- Author: Jeremy Travis
-- Create date: 04/04/2024
-- Description:	To search, paginate and fetch a set of users
-- TEST 1: EXEC uspSearchUser NULL, 1, 25, NULL, NULL, NULL
-- TEST 2: EXEC uspSearchUser NULL, 1, 25, 'u.FirstName', 'DESC', NULL
-- TEST 3: DECLARE @COUNT AS INT; EXEC uspSearchUser 'alex', 1, 25, 'u.LastName', 'ASC', @COUNT OUTPUT; SELECT @COUNT AS [RecordCount];
-- =============================================
CREATE PROCEDURE [dbo].[uspSearchUser]
	@SEARCH AS VARCHAR(100) = '',
	@PAGE_INDEX AS INT = 1,
	@PAGE_SIZE AS INT = 20,
	@SORT_COLUMN AS VARCHAR(100) = '',
	@SORT_DIRECTION AS VARCHAR(4) = 'ASC', -- ASC || DESC
  @RESULT_COUNT AS INT OUT
AS
BEGIN
  SET NOCOUNT ON;
  DECLARE @QUERY AS VARCHAR(MAX) = '';
	DECLARE @ORDER_BY AS VARCHAR(MAX) = ' ORDER BY u.UserName ASC';
	DECLARE @SKIP AS INT = 0;

	-- set the base query
	SET @QUERY = ' FROM [dbo].[Users](NOLOCK) AS u
				LEFT JOIN [dbo].[UserExtensions](NOLOCK) AS ue
	            ON ue.UserExtensionId = u.UserId';

	IF(ISNULL(@SEARCH, '') <> '')
	BEGIN
		SET @QUERY += ' WHERE [UserName] LIKE ''%'+ @SEARCH +'%''';
	END

	-- fetch and store record count based on search criteria, if any
	DECLARE @ResultTable TABLE (ResultCount int)
	INSERT  @ResultTable EXEC  ('SELECT COUNT(*) AS [TotalRecords]' + @QUERY);
	SELECT @RESULT_COUNT = ResultCount FROM @ResultTable

	-- set sort if one is provided, otherwise use default
	IF(ISNULL(@SORT_COLUMN, '') <> '' AND ISNULL(@SORT_DIRECTION, '') <> '')
	BEGIN
		SET @ORDER_BY = ' ORDER BY ' + @SORT_COLUMN + ' ' + @SORT_DIRECTION;
	END
	
	SET @QUERY += @ORDER_BY

	IF (@PAGE_SIZE > 0)
		BEGIN
			SET @SKIP = (@PAGE_INDEX * @PAGE_SIZE) - @PAGE_SIZE;
			SET @QUERY += ' OFFSET '+ (CAST(@SKIP AS VARCHAR(10))) +' ROWS';
			SET @QUERY += ' FETCH NEXT '+ (CAST(@PAGE_SIZE AS VARCHAR(10))) +' ROWS ONLY';
		END
 
	EXEC ('SELECT ROW_NUMBER() OVER (ORDER BY UserName) AS [RowNo],
		u.UserId, u.UserName,
		CASE
			WHEN u.UserAccountType = 1 THEN ''DRC''
			WHEN u.UserAccountType = 2 THEN ''Community''
			ELSE ''''
		END AS [AccountType], 
		u.FirstName, u.LastName,
		ue.ORASUser, ue.CCISUser' + @QUERY)
END
```

Instead of returning the record count as an output, you could also set the return type to be the record count.

```sql
-- =============================================
-- Author: Jeremy Travis
-- Create date: 04/04/2024
-- Description:	To search, paginate and fetch a set of users
-- TEST 1: EXEC uspSearchUser NULL, 1, 25, NULL, NULL
-- TEST 2: EXEC uspSearchUser NULL, 1, 25, 'u.FirstName', 'DESC'
-- =============================================
CREATE PROCEDURE [dbo].[uspSearchUser]
	@SEARCH AS VARCHAR(100) = '',
	@PAGE_INDEX AS INT = 1,
	@PAGE_SIZE AS INT = 20,
	@SORT_COLUMN AS VARCHAR(100) = '',
	@SORT_DIRECTION AS VARCHAR(4) = 'ASC', -- ASC || DESC
AS
BEGIN
  SET NOCOUNT ON;
  DECLARE @QUERY AS VARCHAR(MAX) = '';
	DECLARE @ORDER_BY AS VARCHAR(MAX) = ' ORDER BY u.UserName ASC';
	DECLARE @SKIP AS INT = 0,
    @RECORD_COUNT AS INT = 0;

	-- set the base query
	SET @QUERY = ' FROM [dbo].[Users](NOLOCK) AS u
				LEFT JOIN [dbo].[UserExtensions](NOLOCK) AS ue
	            ON ue.UserExtensionId = u.UserId';

	IF(ISNULL(@SEARCH, '') <> '')
	BEGIN
		SET @QUERY += ' WHERE [UserName] LIKE ''%'+ @SEARCH +'%''';
	END

	-- fetch and store record count based on search criteria, if any
	DECLARE @ResultTable TABLE (ResultCount int)
	INSERT  @ResultTable EXEC  ('SELECT COUNT(*) AS [TotalRecords]' + @QUERY);
  --(OPTIONAL) SET @RECORD_COUNT = @@ROWCOUNT;
	SET @RECORD_COUNT = ResultCount FROM @ResultCountTable

	-- set sort if one is provided, otherwise use default
	IF(ISNULL(@SORT_COLUMN, '') <> '' AND ISNULL(@SORT_DIRECTION, '') <> '')
	BEGIN
		SET @ORDER_BY = ' ORDER BY ' + @SORT_COLUMN + ' ' + @SORT_DIRECTION;
	END
	
	SET @QUERY += @ORDER_BY

	IF (@PAGE_SIZE > 0)
		BEGIN
			SET @SKIP = (@PAGE_INDEX * @PAGE_SIZE) - @PAGE_SIZE;
			SET @QUERY += ' OFFSET '+ (CAST(@SKIP AS VARCHAR(10))) +' ROWS';
			SET @QUERY += ' FETCH NEXT '+ (CAST(@PAGE_SIZE AS VARCHAR(10))) +' ROWS ONLY';
		END
 
	EXEC ('SELECT ROW_NUMBER() OVER (ORDER BY UserName) AS [RowNo],
		u.UserId, u.UserName,
		CASE
			WHEN u.UserAccountType = 1 THEN ''DRC''
			WHEN u.UserAccountType = 2 THEN ''Community''
			ELSE ''''
		END AS [AccountType], 
		u.FirstName, u.LastName,
		ue.ORASUser, ue.CCISUser' + @QUERY);
  
  RETURN @RECORD_COUNT
```

Now, let's demonstrate how to do this without dynamic queries.
You will see in the stored procedure, we created a temp table to stored the data. Within the temp table,
there is a ROW_NUMBER which is sorted by the passing @SortColumn and @SortDirection values.

Lastly, we paginate on the ROW_NUMBER using the passing @PageIndex and @PageSize values.

```sql
-- =============================================
-- Author: Jeremy Travis
-- Create date: 04/10/2024
-- Description:	To search, paginate and fetch a set of users
-- TEST 1:EXEC uspSearchUser NULL, NULL, NULL, 1, 10
-- TEST 2: EXEC uspSearchUser 'alex', NULL, NULL, 2, 10
-- TEST 2: EXEC uspSearchUser '10140789', NULL, NULL, 1, 10
-- TEST 3: EXEC uspSearchUser NULL, 'LastName', 'ASC', 1, 5
-- =============================================
CREATE PROCEDURE [dbo].[uspSearchUser2]
	@Search AS VARCHAR(100) = NULL,
	@SortColumn AS VARCHAR(50) = '',
	@SortDirection AS VARCHAR(4) = 'ASC', -- ASC || DESC
	@PageIndex AS INT = 1,
	@PageSize AS INT = 20
AS
BEGIN
	SET NOCOUNT ON;

	SET @Search = ISNULL(@Search, '');
	SET @SortDirection = ISNULL(@SortDirection, 'ASC');

	-- Set default sorting
	IF (ISNULL(@SortColumn, '') = '')
	BEGIN
		SET @SortColumn = 'UserName'; 
		SET @SortDirection = 'ASC';
	END

	IF OBJECT_ID('tempdb..#SearchUserTable') IS NOT NULL
    DROP TABLE #SearchUserTable

  CREATE TABLE #SearchUserTable
  (
    RowNo INT,
    UserId INT,
    UserName VARCHAR(100),
    OaksId INT,
    AccountType VARCHAR(50),
    FirstName VARCHAR(100),
    LastName VARCHAR(100),
    ORASUser BIT,
    CISUser BIT
  )
  INSERT INTO #SearchUserTable
    SELECT 
      ROW_NUMBER() OVER
      (
        ORDER BY
          CASE WHEN @SortColumn = 'UserName' AND @SortDirection = 'ASC' THEN UserName ELSE NULL END ASC,
          CASE WHEN @SortColumn = 'UserName' AND @SortDirection = 'DESC' THEN UserName ELSE NULL END DESC
          CASE WHEN @SortColumn = 'AccountType' AND @SortDirection = 'ASC' THEN UserAccountType ELSE NULL END ASC,
          CASE WHEN @SortColumn = 'AccountType' AND @SortDirection = 'DESC' THEN UserAccountType ELSE NULL END DESC,
          CASE WHEN @SortColumn = 'FirstName' AND @SortDirection = 'ASC' THEN FirstName ELSE NULL END ASC,
          CASE WHEN @SortColumn = 'FirstName' AND @SortDirection = 'DESC' THEN FirstName ELSE NULL END DESC,
          CASE WHEN @SortColumn = 'LastName' AND @SortDirection = 'ASC' THEN LastName ELSE NULL END ASC,
          CASE WHEN @SortColumn = 'LastName' AND @SortDirection = 'DESC' THEN LastName ELSE NULL END DESC,
          CASE WHEN @SortColumn = 'ORASUser' AND @SortDirection = 'ASC' THEN ORASUser ELSE NULL END ASC,
          CASE WHEN @SortColumn = 'ORASUser' AND @SortDirection = 'DESC' THEN ORASUser ELSE NULL END DESC,
          CASE WHEN @SortColumn = 'CCISUser' AND @SortDirection = 'ASC' THEN CCISUser ELSE NULL END ASC,
          CASE WHEN @SortColumn = 'CCISUser' AND @SortDirection = 'DESC' THEN CCISUser ELSE NULL END DESC
      ) AS [RowNo],
      u.UserId, u.UserName, u.OaksId,
      CASE
        WHEN u.UserAccountType = 1 THEN 'DRC'
        WHEN u.UserAccountType = 2 THEN 'Community'
        ELSE ''
      END AS [AccountType], 
      u.FirstName, u.LastName,
      ue.ORASUser, ue.CCISUser
    FROM [dbo].[Users](NOLOCK) AS u
    LEFT JOIN [dbo].[UserExtensions](NOLOCK) AS ue
      ON ue.UserExtensionId = u.UserId
    WHERE [UserName] LIKE '%'+ @Search +'%' OR [OaksId] LIKE '%'+ @Search +'%';

  --## PAGINATION STATS
	WITH ReportData AS (
		SELECT COUNT(*) AS [RecordCount] FROM #SearchUserTable
	)
	SELECT
		@PageIndex AS [PageIndex],
		RecordCount,
		(RecordCount / @PageSize) AS [PageCount],
    @SortColumn AS [SortColumn],
    @SortDirection AS [SortDirection]
	FROM ReportData

  --## PAGINATION DATA
  SELECT * FROM #SearchUserTable
    WHERE RowNo BETWEEN (@PageIndex - 1) * @PageSize + 1 
    AND (((@PageIndex - 1) * @PageSize + 1) + @PageSize) - 1;

  DROP TABLE #SearchUserTable
END
```