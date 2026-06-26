# Reading Stored Procedure Result ADO.NET

For SQL stored procedure, see [here.](/articles/sql/SQL-Pagination-Sorting.md).

```c#
public async Task<UserPagerModel> SearchUsers(string search, string sortColumn, string sortDirection, int page = 1, int pagesize = 25)
{
    using (var con = new SqlConnection(_appConnString))
    {
        con.Open();

        var userPager = new UserPagerModel()
        {
            Page = page,
            PageSize = pagesize,
            Search = search,
            SortColumn = sortColumn,
            SortDirection = sortDirection,
        };

        ICollection<SearchUsersModel> users = new Collection<SearchUsersModel>();

        using (SqlCommand cmd = CreateCommand(CommandType.StoredProcedure, "uspSearchUser"))
        {
            cmd.Connection = con;
            cmd.Parameters.Add(new SqlParameter("@Search", search));
            cmd.Parameters.Add(new SqlParameter("@SortColumn", sortColumn));
            cmd.Parameters.Add(new SqlParameter("@SortDirection", sortDirection));
            cmd.Parameters.Add(new SqlParameter("@PageIndex", page));
            cmd.Parameters.Add(new SqlParameter("@PageSize", pagesize));

            using (var reader = await cmd.ExecuteReaderAsync(CommandBehavior.CloseConnection))
            {
                while (reader.Read())
                {
                    userPager.RecordCount = reader.GetColumnValue<int>("RecordCount");
                    userPager.PageCount = reader.GetColumnValue<int>("PageCount");
                    userPager.SortColumn = reader.GetColumnValue<string>("SortColumn");
                    userPager.SortDirection = reader.GetColumnValue<string>("SortDirection");
                }
                reader.NextResult();
                while (reader.Read())
                {
                    users.Add(reader.MapToUserSearch());
                }
            }
        }

        userPager.Data = users.ToList();

        con.Close();
        return userPager;
    }
}
```

_SearchUserModel.cs_

```c#
namespace WebApp.Models
{
  public class SearchUserModel
  {
    public int RowNo { get; set; }

    public int UserId { get; set; }

    public string UserName { get; set; } = string.Empty;

    public int OaksId { get; set; }

    public string FirstName { get; set; } = string.Empty;

    public string LastName { get; set; } = string.Empty;

    public string AccountType { get; set; } = string.Empty;

    public string LocationName { get; set; } = string.Empty;

    public bool ORASUser { get; set; }

    public bool CCISUser { get; set; }
  }
}
```

_DataReaderMapperExtensions.cs_

This extension is a clean, reusable way to map results from the data reader to a class object.

```c#
using System;
using System.Data.SqlClient;
using WebApp.Models;

namespace WebApp.Extensions
{
  public static class DataReaderExtensions
  {
      public static T? ValueOrDefault<T>(this SqlDataReader reader, string columnName)
      {
          if (reader is T)
              return (T)Convert.ChangeType(reader[columnName], typeof(T));

          return default;
      }
  }

  public static class DataReaderMapperExtensions
  {
    /// <summary>
    /// Maps the data row to the SearchUser model
    /// </summary>
    /// <param name="reader"></param>
    /// <returns></returns>
    public static SearchUserModel MapToUserSearch(this SqlDataReader reader)
    {
      return new SearchUserModel()
      {
        RowNo = reader.ValueOrDefault<int>("RowNo"),
        UserId = reader.ValueOrDefault<int>("UserId"),
        UserName = reader.ValueOrDefault<string>("UserName"),
        OaksId = reader.ValueOrDefault<int>("OaksId"),
        FirstName = reader.ValueOrDefault<string>("FirstName"),
        LastName = reader.ValueOrDefault<string>("LastName"),
        LocationName = reader.ValueOrDefault<string>("LocationName"),
        AccountType = reader.ValueOrDefault<string>("AccountType"),
        ORASUser = reader.ValueOrDefault<bool>("ORASUser"),
        CCISUser = reader.ValueOrDefault<bool>("CCISUser"),
      }
    }
  }
}
```