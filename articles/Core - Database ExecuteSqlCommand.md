#meta-start
Title:Raw SQL Statement in NET Core and EntityFrameworkCore
Created:7-23-2020
Category:other
#meta-end
# Raw SQL Statement in NET Core and EntityFrameworkCore
When working with ASP.NET Core 2.1 and EntityFrameworkCore 2.1.14, you may want to run raw SQL
statements to your database. Using a statement like this may fail the compiler.

```cs
db.Database.ExecuteSqlCommand("DELETE FROM GroupMembers WHERE GroupId = @p0", group.Id);
```

To resolve, add nuget reference: `Microsoft.EntityFrameworkCore.Relational` 2.1.4
