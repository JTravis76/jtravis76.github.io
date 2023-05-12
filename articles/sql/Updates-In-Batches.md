# Updates in Batches
Here is a SQL snippet to performs updates in smaller batches. I ran into trouble while running an UPDATE statement
against a linked server to a MS Access database file.

```sql
DECLARE @MinID int = 1;
DECLARE @MaxID int = 500;
DECLARE @Rows int = 12100; -- set to the max records
DECLARE @Batchsize int = 500;

WHILE (@Rows > 1)
BEGIN
  UPDATE [ROW]...[Agent Log] SET [Property Owner Phone Number] = REPLACE([Property Owner Phone Number], '-', '')
  WHERE [Log ID] BETWEEN @MinID AND @MaxID;

  UPDATE [ROW]...[Agent Log] SET [Property Owner Phone Number] = REPLACE([Property Owner Phone Number], ') ', '')
  WHERE [Log ID] BETWEEN @MinID AND @MaxID;

  UPDATE [ROW]...[Agent Log] SET [Property Owner Phone Number] = REPLACE([Property Owner Phone Number], '(', '')
  WHERE [Log ID] BETWEEN @MinID AND @MaxID;

  SET @Rows = @@ROWCOUNT
  SET @MinID = @MinID + @Batchsize
  SET @MaxID = @MaxID + @Batchsize

END
```