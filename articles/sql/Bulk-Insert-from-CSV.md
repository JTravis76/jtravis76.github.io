# Bulk Insert from CSV

```sql
BULK INSERT dbo.Circuit
FROM 'C:\circuit.csv'
WITH
(
    FORMAT='CSV',
    FIRSTROW=2
)
GO
```
