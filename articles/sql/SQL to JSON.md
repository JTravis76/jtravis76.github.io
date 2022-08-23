# SQL to JSON

```sql
﻿--Convert SQL data to XML data
SELECT * FROM SalesERPDB.dbo.TblEmployee
FOR XML path, root;

--STOP, execute code below first!
DECLARE @xmlData xml;
SET @xmlData =
'<paste xml data here';



-- Function for Conversion | XML to JSON
SELECT Stuff(  
  (SELECT * from  
    (SELECT ',
    {'+  
      Stuff((SELECT ',"'+coalesce(b.c.value('local-name(.)', 'NVARCHAR(MAX)'),'')+'":"'+
                    b.c.value('text()[1]','NVARCHAR(MAX)') +'"'
               
             from x.a.nodes('*') b(c)  
             for xml path(''),TYPE).value('(./text())[1]','NVARCHAR(MAX)')
        ,1,1,'')+'}' 
   from @xmlData.nodes('/root/*') x(a)  
   ) JSON(theLine)  
  for xml path(''),TYPE).value('.','NVARCHAR(MAX)' )
,1,1,'')
```
