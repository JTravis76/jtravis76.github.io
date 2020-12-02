# Simple Mail Transfer Protocol
Often times, there is a request to send emails from an application. Below are some snippets for both NET Framework and NET Core.


Using Framework, add the following to the Web or App config.

> NOTE: when using in a web application, defaultCredentials should be used with the `ApplicationPoolIdentity` account in the App Pool.  
Remove it if using a domain service account.

```xml
<mailSettings>
    <smtp deliveryMethod="Network" from="no-reply@domain.com">
        <network host="exmail.domain.com" port="587" enableSsl="false" defaultCredentials="true" />
    </smtp>
</mailSettings>
```

Here is the basic SMTP Client for NET Framework.

```csharp
try
{
    System.Net.Mail.MailMessage msg = new System.Net.Mail.MailMessage
    {
        From = new System.Net.Mail.MailAddress(from);
        To.Add(to);
        Subject = subject;
        IsBodyHtml = IsBodyHtml;
        Body = body;
    };

    System.Net.Mail.SmtpClient client = new System.Net.Mail.SmtpClient();
    client.Send(msg);

    return true;
}
catch (Exception)
{
    return false;
}
```