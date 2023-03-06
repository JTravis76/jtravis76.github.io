# SQLite - Reseed Auto-Increment Column
The snippet below is an equivalent example of truncating and reseeding a database table in SQLite.

```sql
SELECT * FROM SQLITE_SEQUENCE;

DELETE FROM TableName
DELETE FROM SQLITE_SEQUENCE WHERE NAME = 'TableName';
```