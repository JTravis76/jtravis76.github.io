# SSL Certificates
I was looking to setup IIS Express for HTTPS and a certificate. Also some link to assist with digital signatures.

> NOTE: this document is not complete!



## SSL IIS Express
https://docs.microsoft.com/en-us/powershell/module/pkiclient/new-selfsignedcertificate?WT.mc_id=ES-MVP-5003445&view=win10-ps  
https://medium.com/the-new-control-plane/generating-self-signed-certificates-on-windows-7812a600c2d8  
https://improveandrepeat.com/2020/05/how-to-change-the-https-certificate-in-iis-express/  

## Attempting to read Cert from MS CA Store
https://docs.microsoft.com/en-us/windows/win32/api/certview/nn-certview-icertview?redirectedfrom=MSDN  

https://stackoverflow.com/questions/7512610/howto-successfully-register-certadm-dll-in-order-to-be-able-to-use-icertview2-in  

https://social.technet.microsoft.com/Forums/windowsserver/en-US/6d84a679-e241-4010-910b-912ea9d366e2/0x8007007e-win32http-126-errormodnotfound-certadmdll  

Certs on smart cards and copied upon use to the Personal store. Their private key is non-exportable, so a pin is
required to authenticate with the public key to sign/verify any documents, etc.

```powershell
$date_now = Get-Date
$extended_date = $date_now.AddYears(2)
New-SelfSignedCertificate -DnsName "*.deno.land" -NotAfter $extended_date -KeyAlgorithm RSA -KeyLength 2048 -CertStoreLocation "cert:LocalMachine\My"

$pwd = ConvertTo-SecureString -String "password1234" -Force -AsPlainText
$path = ("cert:\localMachine\my\" + "A43879F1C8CEE69A805FB3DFF0664A39C78349B4")
Export-PfxCertificate -cert $path -FilePath c:\selfsigned.pfx -Password $pwd
```


https://www.websupergoo.com/abcpdf-pdf-digital-signatures.aspx  

https://docs.microsoft.com/en-us/previous-versions/windows/it-pro/windows-server-2012-R2-and-2012/cc732443(v=ws.11)?redirectedfrom=MSDN  

```powershell
$key = (Get-PfxCertificate -FilePath "C:\KDJ.pfx").GetPublicKey()
Set-Content -Path "C:\kdj.key" -Value $key

(Get-PfxCertificate -FilePath "C:\KDJ.pfx").GetRawCertData()
https://docs.microsoft.com/en-us/previous-versions/windows/it-pro/windows-server-2012-R2-and-2012/cc732443(v=ws.11)?redirectedfrom=MSDN  


# Use this command to fetch thumbprint
# EX: 20FF94DFC6A365F66B232CC6D61FEA8C691B3808
(Get-PfxData -FilePath "C:\KDJ.pfx").EndEntityCertificates

# This cmd will export a new file while setting the private key
certutil -exportPFX -p "password1234" -privatekey -user my 42810B21FA76EF22E7C3AD9143B3CF7ACE160614 C:\deploy\JeremyTravis.pfx

# 42810B21FA76EF22E7C3AD9143B3CF7ACE160614

$store = New-Object System.Security.Cryptography.X509Certificates.X509Store([System.Security.Cryptography.X509Certificates.StoreName]::My,"CurrentUser") #LocalMachine
$store.Open("MaxAllowed")
#$store.Certificates
$cert = $store.Certificates | ?{$_.subject -match "^CN=JEREMY R. TRAVIS"}
$cert.PrivateKey
$cert.PrivateKey.ToXmlString($false)
$store.Close()

certutil -mergepfx "C:\JeremyTravis.cer" "C:\JeremyTravis.pfx"

$pwd = ConvertTo-SecureString -String "password1234" -Force -AsPlainText
Get-ChildItem -Path Cert:\CurrentUser\My\42810B21FA76EF22E7C3AD9143B3CF7ACE160614 | Export-PfxCertificate -FilePath "C:\JT.pfx" -Password $pwd
```


## Using Localhost cert for Vite/Node
Since Visual Studio already installed a localhost certificate, I thought is would best to reuse for Vite.

Below are the steps to create the cert + key in Node format.
* Open mmc -> Certificates (Local Computer)
* Expand to `Personal -> Certificates`. Look for localhost.
* Right-click -> All Tasks.. -> Export
* Select "Yes, export the private key" and provide a password
* Using OpenSSL to split the pfx into cert + key

```ps
# Export the Key (must have password!)
openssl pkcs12 -in localhost.pfx -nocerts -passin pass:password -out localhostkey.pem -noenc

openssl pkcs12 -in localhost.pfx -nokeys -passin pass:password -out localhostcert.pem -noenc
```