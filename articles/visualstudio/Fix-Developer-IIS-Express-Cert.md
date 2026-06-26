## Fix Developer IIS Express Cert - Connection reset

Run VS as administrator
Tools -> Command Line -> Developer Command Line

> update the %PORT% to match your web application

```bat
"C:\Program Files (x86)\IIS Express\IisExpressAdminCmd.exe" deleteSslUrl -url:https://localhost:%PORT%/

"C:\Program Files (x86)\IIS Express\IisExpressAdminCmd.exe" setupSslUrl -url:https://localhost:%PORT%/ -UseSelfSigned
```
Restart Visual Studio and attempt to run the application.
You should get a message to add IIS cert to store. Click Yes

At this point, you could attempt to run the application. You may get a untrusted cert warning.
Restart the computer and try again corrected the problem.


Below where some other commands I tried. May be useful for different scenarios.

netsh http delete sslcert ipport=0.0.0.0:%PORT%
netsh http add sslcert ipport=0.0.0.0:%PORT% certhash=%THUMBPRINT% appid={9A19103F-16F7-4668-BE54-9A1E7A4F7556}

dotnet dev-certs https --check
dotnet dev-certs https --clean
dotnet dev-certs https --trust