# Setup IIS for Smart Card with SSL

* Install IIS - World Wide Web Services
    * Be sure to select `Client Certificate Mapping  Authentication` under Security
        * This module will allow user mapping to Active Directory
* Open IIS Manager
    * View Authentication (make certain you select the top-most node in left pane)
        * Enable *Active Directory Client Certificate*
        * All other set to disabled
    * View SSL Certificates
    * Click *Create Self-Signed Certificate...*
    * Enter friendly name and select *Web-Hosting*
    * Highlight *Default Web Site*
        * Double-click *SSL Settings*
        * Check *Require SSL* and select *Require* then click Apply
            * Ignore - will skip the certificate-based authentication and fallback to Authentication settings; Anonymous, Windows, Forms, etc. type authentication
            * Accept - will prompt to select a smart-card certificate. If canceled, error is provided: *ERR_SSL_CLIENT_AUTH_SIGNATURE_FAILED*
                * When using Window Authentication, when user cancels the certificate, user will be prompt for a username and password
            * Require - user must provide a certificate, will not fallback to Windows Authentication
        * (Optional) Double-click *Authentication*
            * Disable all but *Window Authentication*
    * Right-click *Default web Site* -> *Edit Bindings...*
        * Click Add button
        * Select type: https
        * Hostname optional, but must match name on certificate
        * Select SSL Certificate that we created earlier
* Run command prompt as administrator
    * >iisreset
* Open browser to FQDN from the certificate
    * EX: https://mycomputername.domain.local

## IISExpress and ApplicationHost.config

> Custom Hostname binding can be used, IISExpress command must be elevated.

```xml
<site name="WebSite1" id="1" serverAutoStart="true">
    <application path="/" >
        <virtualDirectory path="/" physicalPath="%IIS_SITES_HOME%\WebSite1" />
    </application>
    <bindings>
        <binding protocol="http" bindingInformation="*:8080:localhost" />
        <binding protocol="https" bindingInformation="*:44339:localhost" sslFlags="0" />
    </bindings>
</site>
...
<security>
    <!-- <access sslFlags="None" /> -->
    <!-- <access sslFlags="Ssl" /> -->
    <!-- <access sslFlags="Ssl, SslNegotiateCert" /> -->
    <access sslFlags="Ssl, SslNegotiateCert, SslRequireCert" />

    <applicationDependencies>
        <application name="Active Server Pages" groupId="ASP" />
    </applicationDependencies>

    <authentication>
        <anonymousAuthentication enabled="true" userName="" />
        <basicAuthentication enabled="false" />
        <clientCertificateMappingAuthentication enabled="true" />
        <digestAuthentication enabled="false" />
        <iisClientCertificateMappingAuthentication enabled="false"></iisClientCertificateMappingAuthentication>

        <windowsAuthentication enabled="false">
            <providers>
                <add value="Negotiate" />
                <add value="NTLM" />
            </providers>
        </windowsAuthentication>

    </authentication>
```

## Other Tips
Some folks suggested that you cannot have invalid certificates in the *Trusted Root Certification Authorities* store.  
The script below will move them to the *Intermediate Certification Authorities*.

```powershell
Get-ChildItem -Path "cert:\LocalMachine\root" -Recurse | Where-Object {$_.Issuer -ne $_.Subject} | Move-Item -Destination Cert:\LocalMachine\CA
```

> When using HTTPS with localhost, the certificate must be located in the *Personal* under the Computer Account.

### View Certificate Store
Run mmc.exe as administrator  
File -> Add/Remove Snap-ins...  
Select Certifications  
Click Add  
Select Computer Account  
Click Finish  
Click OK  

## References

[link](https://docs.microsoft.com/en-us/iis/configuration/system.webserver/security/authentication/clientcertificatemappingauthentication)

https://docs.microsoft.com/en-us/previous-versions/windows/it-pro/windows-server-2008-R2-and-2008/cc732116(v=ws.11)?redirectedfrom=MSDN

https://forums.iis.net/t/1165336.aspx

https://forums.iis.net/t/1242328.aspx?Smartcard+Authentication+non+AD+accounts

https://support.oneidentity.com/active-roles/kb/225324/how-to-configure-iis-to-leverage-smart-card-authentication

https://docs.microsoft.com/en-us/previous-versions/windows/it-pro/windows-server-2008-R2-and-2008/cc732996(v=ws.10)?redirectedfrom=MSDN