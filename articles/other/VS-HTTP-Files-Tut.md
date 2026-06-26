# Using HTTP files in Visual Studio

Prerequisites
VS 2022 version 17.8 with the ASP.NET and web development workload installed.

## Endpoints Explorer

View -> Other Windows -> Endpoints Explorer

## Anatomy of HTTP file

- Variables lines starting with @ followed by double curly braces {{ }}
- HTTP Methods/Verbs
- URL
- Comments
- Result viewer
- Multiple requests by using lines with ### as delimiters

> PRO TIP! Adjust timeout: Tools -> Options -> Text Editor -> Rest -> Advanced

## Creating a new HTTP file

- Person.http

```
###
POST {{HostAddress}}/api/person/Authenticate
Content-Type: application/json
{
  "EmailAddress":"kohlstest@sbdinc.com",
  "Password":"VGVzdGluZzEyMyE="
}

###
POST {{HostAddress}}/api/person/Logout


// Recently Viewed Locations
###
POST {{HostAddress}}/api/RecentlyViewed/GetLocations
Content-Type: application/json
{
  "PageSize": 5
}

// Recently Viewed People
###
POST {{HostAddress}}/api/RecentlyViewed/GetPeople
Content-Type: application/json
{
  "PageSize": 5
}

###
POST {{HostAddress}}/api/Incident/GetActiveAlarms
Content-Type: application/json
{
  "PageSize":500,
  "IncludeAllPages":false,
  "LocationID":null,
  "IsFollowed":false
}

###
POST {{HostAddress}}/api/Event/GetEvents
Content-Type: application/json
{
   "EventTypeCategory":"Open Close",
   "EventTypeID":[
      "2001003",
      "2001004",
      "2001999",
      "2002003",
      "2002004",
      "2002999",
      "2020000",
      "2999999",
      "2013000",
      "2020000"
   ],
   "IsFollowed":false,
   "MinimumStartTime":"2025-02-10T16:50:17Z",
   "PageNumber":1,
   "PageSize":10,
   "SearchString":""
}
```

## Online References

- [Microsoft HTTP files](https://learn.microsoft.com/en-us/aspnet/core/test/http-files)

## Pros vs Cons

_PROs_

- files sit along with project
- files can be source controlled
- files could be grouped by controllers or related endpoints
- endpoints are easy to read and maintain
- environment file to ease switching variables
- optional comment to help explain the endpoint

_CONs_

- 'generated' file are dump at the root of project directory
- authentication session is not shared across files.
- no find option; CTRL+F for result pane
- no collapse option for JSON results
- automated test feature
