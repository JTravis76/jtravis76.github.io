# IBM Maximo - Inspection Forms
Inspection forms in Maximo is a customize form with a basic set of controls to create digital forms. Those forms can be later used against either a location or asset within Maximo. Inspection forms can be schedule or unscheduled inspection. Schedule inspection are linked to a work order.

### RESTful Authenticate via LDAP
POST https://localhost/maxrest/oslc/j_security_check

(Form-encode)  
{
  j_username: "jtravis",
  j_password: ""
}

#### Read token from response Header
{ LtpaToken2=BASE64 string }

#### Create JWT/maxauth token using LtpaToken2
This token can be used along the `maxauth` header for authentication.  

{
  "tok": "value from LtpaToken2 above",
  "usr": "jtravis",
  "ver": "V2"
}


### Fetching Inspection form by Work Order number via LDAP
This URL will return an inspection object containing the Results, Form, and Status linked to work order 983136. You may also query the `resultnum` like so; "oslc.where=resultnum=1011"

GET https://localhost/maximo/oslc/os/MXAPIINSPRESULT?lean=1&oslc.select=*&oslc.where=parent=983136  
Accept: */*  
Authorization: Basic bWF4YWRtaW46bWF4YWRtaW4=  

> NOTE! Authorization is a base64 formatted "username:password".
        EX: [maxadmin:maxadmin] bWF4YWRtaW46bWF4YWRtaW4=


### Updating an Inspection form with a Status of Completed

> Take note of the URL. It contains the ID of the inspection form.

POST https://localhost/maximo/oslc/os/MXAPIINSPRESULT/148?lean=1  
Accept: */*
Authorization: Basic bWF4YWRtaW46bWF4YWRtaW4=  
x-method-override: SYNC

> NOTE!! When using the `SYNC` as the override method, you must include the inspection form data or it will render a blank form.

BODY
```json
{
  "status": "COMPLETED",
  "siteid": "01",
  "orgid": "DLC",
  "inspformnum": "1022",
  "location": "EDGEWOOD",
  "parent": "983136",
  "referenceobject": "WORKORDER",
  "referenceobjectid": "983136",
  "resultnum": "1011",
  "inspectionform": [MUST BE POPULATED WITH ORGINAL FORM DATA OR IT WILL RENDER A BLANK FORM!!],
  "inspfieldresult": [
    {
      "inspquestionnum": "1578",
      "inspfieldnum": "2079",
      "inspformnum": "1022",
      "revision": 1,
      "enteredby": "jtravis",
      "entereddate": "2023-04-14T14:27:55.240Z",
      "doclinks": [],
      "txtresponse": "OK"
    },
    ....
  ]
}
```

#### Updating via the BULK Override
Below is listed two options to post changes to Maximo via the BULK override. The second option requires Maximo version 7608 or higher.

POST https://localhost/maximo/oslc/os/MXAPIINSPRESULT?lean=1  
Authorization: Basic bWF4YWRtaW46bWF4YWRtaW4=  
x-method-override: BULK  

BODY
```json
[
  {
    "_data": {
      "parent": "983136",
      "resultnum": "1011",
      "orgid": "DLC",
      "siteid": "01",
      "location": "EDGEWOOD",
      "inspformnum": "1022",
      "status": "COMPLETED",
      "inspfieldresult": [],
      "inspectionform": []
    },
    "_meta": {
      "uri": "http://localhost/maximo/oslc/os/mxapiinspresult/_RExDLzEwMTEvMDE-",
      "method": "PATCH",
      "patchtype": "MERGE"
    }
  }
]
```

```json
[
  {
    "_action": "Update",
    "href": "http://localhost/maximo/oslc/os/mxapiinspresult/_RExDLzEwMTEvMDE-",
    "parent": "983136",
    "resultnum": "1011",
    "orgid": "DLC",
    "siteid": "01",
    "location": "EDGEWOOD",
    "inspformnum": "1022",
    "status": "COMPLETED",
    "inspfieldresult": [],
    "inspectionform": []
  }
]
```

## Troubleshooting

### Error":{"reasonCode":null," message":"oslc#update_on_createuri", "statusCode":"400"}"
https://moremaximo.com/discussion/error-while-updating-maximo-records-using-rest-api-and-postman#bm7df73564-1e44-4e07-97b9-018479b99f97

The headers of x-method-override of PATCH & patchtype of MERGE means that you're updating the record and would be providing the href of the record to update. The error you got is when you are not providing the href.  

Depending on your version of Maximo, there are two other options. To use the _action: AddChange that's typically going to be used when you use the bulk API. To do that you would have x-method-override as BULK (with no patchtype) and you provide your data as an array of values (IE wrap your JSON object with [ ]).  

You can also use the x-method-override of SYNC and patchtype of MERGE if you don't want to provide the href and intend to add or update a single record. You would not provide the _action in the request in this scenario.  
