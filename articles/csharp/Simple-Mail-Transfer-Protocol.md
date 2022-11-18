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

.NET Core using either System.Net.Mail or SendGrid.SendGridMessage

```csharp
string EmailFromAddress = "no-reply@domain.com";
string EmailFromName = "Help Desk";

var mailMessage = new System.Net.Mail.MailMessage()
{
    Subject = message.Subject,
    Body = message.HtmlContent,
    IsBodyHtml = true,
    From = new System.Net.Mail.MailAddress(EmailFromAddress, EmailFromName ?? EmailFromAddress),
};

/* == Copied the contacts from SendGrid object to MS Mail Message object */
// SendGridMessage message = 
// message.Personalizations.ForEach(p =>
// {
//     p.Ccs.ForEach(c =>
//     {
//         mailMessage.CC.Add(new System.Net.Mail.MailAddress(c.Email, c.Name));
//     });

//     p.Tos.ForEach(t =>
//     {
//         mailMessage.To.Add(new System.Net.Mail.MailAddress(t.Email, t.Name));
//     });
// });

System.Net.Mail.SmtpClient smtpClient = new()
{
    Host = "127.0.0.1",
    Port = 25,
    UseDefaultCredentials = true
};
await smtpClient.SendMailAsync(mailMessage);
```

One idea I had was to combine the Display name and the Email into a single string value. This would avoid creating two variables to store each string.

```csharp
string str = "(User 1)user1@domain.com;(User 2)user2@domain.com";
// Are they more than one email?
string[] emailAddresses = str.Split(";");
foreach (string email in emailAddresses)
{
    string displayName = null;
    string emailAddress = null;
    if (email.Trim().StartsWith('(') && email.Contains(')'))
    {
        // parse Display name
        string[] emailParts = email.Split(')');
        if (emailParts.Length > 1)
        {
            displayName = emailParts[0].Trim().Replace("(", "");
            emailAddress = emailParts[1].Trim();
        }
    }
    else
    {
        emailAddress = email;
    }

    sendGridMessage.AddTo(new EmailAddress(emailAddress, displayName));
}
```