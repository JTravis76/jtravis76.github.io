# Running Multiple Sites under the Same Bindings
Open the `applicationhost.config` file. Just add another application node under the existing site. Be sure to update the virtual directory and path.

```xml
<site name="My Web Sites" id="1" serverAutoStart="true">
    <application path="/">
        <virtualDirectory path="/" physicalPath="%IIS_SITES_HOME%\My Web Sites" />
    </application>
    <application path="/api">
        <virtualDirectory path="/app" physicalPath="%IIS_SITES_HOME%\My Web Sites Api" />
    </application>
    <bindings>
        <binding protocol="http" bindingInformation=":8080:localhost" />
    </bindings>
</site>
```