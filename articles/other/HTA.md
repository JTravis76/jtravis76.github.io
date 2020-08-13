#meta-start
Title:Create a HTA Application
Created:8-11-2020
Category:other
#meta-end
# Create a HTA Application

```html
<html>
    <head>
        <title>API Tester</title>
        <meta http-equiv="x-ua-compatible" content="ie=10"/>
        <hta:application id="oHTA" applicationname="API Tester" version="1.0" singleinstance="yes"></hta:application>
        <script type="text/javascript" src="jquery-3.1.1.js"></script>
    </head>
    <body>

        <script language="VBScript" type="text/vbscript">
            Sub Alert()
                Msgbox "This is a test"
            End Sub
        </script>

    </body>
</html>
```