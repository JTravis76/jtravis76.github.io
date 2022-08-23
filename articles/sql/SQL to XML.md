# SQL to XML

```sql
select 
    id,
    descr,
    createdBy,
    createdDate
 from mic.auditLog
WHERE id BETWEEN 25 AND 35
FOR XML PATH('auditLog'), ROOT('db')

SELECT * FROM mic.auditLog
FOR XML AUTO
```
