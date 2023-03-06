# Maximo API for Service Requests
Below are some details on how to create/update a Maximo Service Request w/attachment via Maximo's RESTful Api.
In this situation, the company has built a proxy application that relay the request between the internet and intranet.
This proxy application is a Azure Function app hosting in Azure. Was able to use this application locally
for testing.


## CREATE Service Request
=========================
POST http://localhost:7071/api/mxapisr?lean=1
Accept: application/json, text/plain, */*
Content-Type: application/json
maxauth: <BASE64-token>
properties: *

Body:
```json
{
  "description": "Field Issue Reporter",
  "description_longdescription": "<div>An issue has been filed via Field Issue Reporter. Below are the details of that report.</div><br /><div><b>Longitude</b>: -80.0000</div><div><b>Latitude:</b> 40.000</div><div><b>Pole Number:</b> 1234M</div><br /><div><b>Is there a vegetation issue?</b> No</div><div><b>Is something broken or leaning past 30 degrees?</b> No</div><div><b>Are there signs of leaking?</b> No</div><div><b>Is anything external contacting a DLC asset?</b> No</div><div><b>High or Low Priority?</b> No</div><div><b>Comments:</b> no comment at this time</div>",
  "classstructureid": 1479,
  "reportedpriority": 2,
  "reportedby": "",
  "status": "NEW"
}
```

> NOTE! including `"ticketid": "0",` in the JSON body will result in a new service request.
        But the ticket id is set to "0", which is difficult to search against.


### Attachments can be included along with the initial creation.

> NOTE!: the `documentdata` must be a base64 encoded document

Body:
```json
{
  "description": "Field Issue Reporter w/ Attachment",
  "description_longdescription": "<div>An issue has been filed via Field Issue Reporter. Below are the details of that report.</div><br /><div><b>Longitude</b>: -80.0000</div><div><b>Latitude:</b> 40.000</div><div><b>Pole Number:</b> 1234M</div><br /><div><b>Is there a vegetation issue?</b> No</div><div><b>Is something broken or leaning past 30 degrees?</b> No</div><div><b>Are there signs of leaking?</b> No</div><div><b>Is anything external contacting a DLC asset?</b> No</div><div><b>High or Low Priority?</b> No</div><div><b>Comments:</b> no comment at this time</div>",
  "classstructureid": 1479,
  "reportedpriority": 2,
  "reportedby": "",
  "status": "NEW",
  "doclinks":[
    {
    "urltype":"FILE",
    "documentdata":"aGV5IGhvdyBhcmUgeW91",
    "doctype":"Attachments",
    "urlname":"greetingsabcd.txt"
    },
    {
    "urltype":"FILE",
    "documentdata":"aGV5IGhvdyBpcyB0aGF0",
    "doctype":"Attachments",
    "urlname":"howisthatfor.txt"
    }
  ]
}
```

### UPDATE Service Request
==========================
POST http://localhost:7071/api/mxapisr/64462?lean=1
Accept: application/json, text/plain, */*
Content-Type: application/json
maxauth: <BASE64-token>
properties: *
x-method-override: PATCH

Body:
```json
{
  "ticketuid": 64462,
  "ticketid": "23415",
  "description": "Field Issue Reporter",
  "description_longdescription": "<div>An issue has been filed via Field Issue Reporter. Below are the details of that report.</div><br /><div><b>Longitude</b>: -80.0000</div><div><b>Latitude:</b> 40.000</div><div><b>Pole Number:</b> 1234M</div><br /><div><b>Is there a vegetation issue?</b> No</div><div><b>Is something broken or leaning past 30 degrees?</b> No</div><div><b>Are there signs of leaking?</b> No</div><div><b>Is anything external contacting a DLC asset?</b> No</div><div><b>High or Low Priority?</b> No</div><div><b>Comments:</b> no comment at this time</div>",
  "classstructureid": 1479,
  "reportedpriority": 2,
  "reportedby": "",
  "status": "NEW"
}
```

> !! Take notice to the URL id that matches the `ticketuid`.
     The `ticketuid` is NOT require within the JSON body to update the record.


## Other Information
status = [NEW, PENDING, INPROG, QUEUED, REJECTED, RESOLVED, CLOSED, CANCELLED]

reportedpriority (1-4) = [Low, Medium, High, Urgent]

reportedby = this is a user from the 'Person' table, not 'User' table


* Swagger
    * https://{server}:{port}/maximo/api.html
    * https://{server}:{port}/maximo/oslc/oas?includeaction=1

* JSON Schemas
    * https://{server}:{port}/maximo/oslc/jsonschemas/%OBJECT_STRUCTURE%
    * https://{server}:{port}/maximo/oslc/jsonschemas/MXAPISR

* (Maybe) Userful Links
https://www.ibm.com/docs/en/mam/7.6.1.2?topic=structure-creating-object-structures
https://www.ibm.com/docs/en/mam/7.6.0?topic=ra-rest-api-framework
https://developer.ibm.com/components/maximo/
https://www.ibm.com/mysupport/s/forumshome?language=en_US

https://www.ibm.com/docs/en/control-desk/7.6.1?topic=desk-service-requests
https://www.ibm.com/docs/en/control-desk/7.6.1?topic=requests-creating-service-request



### 

```html
<HTML>
 <form name="input" action="http://SERVER/maxrest/rest/os/DOCLINK?_lid=maxadmin&_lpwd=maxadmin" method="POST">
 <p> ADDINFO 	<input name="ADDINFO" 		value="1" 			type="text"> <p/> 
 <p> DOCUMENT 	<input name="DOCUMENT" 		value="REST FILE " 		type="text"> <p/>
 <p> DESCRIPTION 	<input name="DESCRIPTION" 	value="TESTING REST DOC 2" 	type="text"> <p/>
 <p> OWNERTABLE	<input name="OWNERTABLE" 	value="WORKORDER" 			type="text"> <p/>
 <p> OWNERID	<input name="OWNERID" 		value="1662" 		type="text"> <p/>
 <p> DOCTYPE	<input name="DOCTYPE" 		value="Attachments" 		type="text"> <p/>
 <p> NEWURLNAME	<input name="NEWURLNAME" 	value="www.ibm.com" 		type="text"> <p/>
 <p> URLNAME	<input name="URLNAME" 	value="C:\doclinks\attachments\MXPO_Attachment.txt" 		type="text"> <p/>
 <p> URLTYPE	<input name="URLTYPE" 		value="FILE" 			type="text"> <p/>
 <p> DOCUMENTDATA	
 <input name="DOCUMENTDATA"	
value="PT09PT09PT09PT09PT09PT09PT09PT0NCkludGVncmF0aW9uIEZyYW1ld29yaw0KPT09PT09PT09PT09PT09PT09PT09PT0NCg0KUHVyY2hhc2UgT3JkZXIgYXR0YWNobWVudCBURVNU"
                 type="text"> <p/>
	   <input type="submit" value="Submit">
	</form>
</HTML>
```