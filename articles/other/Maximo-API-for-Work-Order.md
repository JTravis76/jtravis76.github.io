# Maximo API for Work Orders


## Fetching Work Order
%2D - ASC
%2B - DESC

* GET /maxrest/rest/mbo/workorder?_lid=maxadmin&_lpwd=maxadmin&_rsStart=0&_maxItems=1&_format=json&_compact=1&wonum=810322

* GET /maximo/oslc/os/MXAPIWO?_lid=maxadmin&_lpwd=maxadmin&lean=1&oslc.select=workorderid,parent,statusdate,wonum,wopriority,description&oslc.where=taskid=120 and status="WAPPR" and description="%ROW%"&oslc.pageSize=10&pageno=1&oslc.orderBy=%2Dparent

* GET /maximo/oslc/os/MXAPIWOHIER?_lid=maxadmin&_lpwd=maxadmin&lean=1&oslc.select=workorderid,wonum,wopriority,status,description,workorder{taskid,status,wopriority_description,statusdate,description,workorderid}&oslc.where=wonum=897089&ignorecollectionref=1

* GET /maximo/oslc/os/MXAPIWO/1351761?_lid=maxadmin&_lpwd=maxadmin&lean=1



## Update Status of a Work Order
POST /maximo/oslc/os/mxwo/1207534?lean=1
Accept: application/json, text/plain, */*
User-Agent: Thunder Client (https://www.thunderclient.com)
x-method-override: PATCH
Content-Type: application/json
maxauth: <JWT TOKEN>
properties: *
patchtype: MERGE

Body:
```json
{
  "status": "COMP"
}
```

## Additional Links
GET /maximo/api.html
GET /maximo/oslc/jsonschemas/MXAPIWO
GET /maximo/oslc/apimeta?_lid=maxadmin&_lpwd=maxadmin&lean=1
GET /oslc/products?_lid=maxadmin&_lpwd=maxadmin&lean=1
GET /oslc/os/mxwo/{{workorderid}}/getlist~status?oslc.select=value&lean=1

# More (maybe) Helpful Links
* https://www.ibm.com/support/pages/how-use-json-api-change-status-work-order
* https://www.maximotimes.com/maximo/mif/query-data-with-the-maximo-rest-api/
* https://studylib.net/doc/25661557/maximo-rest-api-guide
vhttps://www.ibm.com/docs/en/memao/1.1.0?topic=imam-downloading-work-orders-by-using-maximo-mxapiwodetail-api
* https://www.ibm.com/support/pages/using-prerequisite-tasks-maximo-utilities#:~:text=Prerequisite%20tasks%20are%20defined%20when,and%20Tasks%20(T%26D)%20application
* https://www.ibm.com/support/pages/work-order-operations-are-now-tasks-overview-and-faq