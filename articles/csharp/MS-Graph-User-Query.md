# Microsoft Graph User Query

```csharp
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace FunctionApp1
{
    public class Function1
    {
        private readonly string clientId = "";
        private readonly string tenantId = "";
        private readonly string clientSecret = "";


        [FunctionName("Function1")]
        public async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = null)] HttpRequest req,
            ILogger log)
        {
            var users = await Users();
            return new JsonResult(users);
        }

        private async Task<GraphUserModel> Users()
        {
            var auth = await ClientCredentialAsync();

            var url = new Uri("https://graph.microsoft.com/v1.0" + "/users" + "?$select=DisplayName,Id,Mail,Surname,GivenName");
            var client = new HttpClient();
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", auth.AccessToken);
            var response = await client.GetAsync(url);
            if (response.IsSuccessStatusCode)
            {
                string result = await response1.Content.ReadAsStringAsync();
                return JsonConvert.DeserializeObject<GraphUserModel>(result);
            }
            return new GraphUserModel();
        }

        private static async Task<MsGraphAuthenticationResult> ClientCredentialAsync()
        {
            /* POST https://login.microsoftonline.com/{{TenantID}}/oauth2/v2.0/token
             * Authorization: Basic e3tDbGllbnRJRH19Ont7Q2xpZW50U2VjcmV0fX0= <= 'ClientID:ClientSecret'
             * Content-Type: application/x-www-form-urlencoded
             * 
             * Form Encode
             * { "grant_type": "client_credentials", "scope": "https://graph.microsoft.com/.default" }
             */

            var formData = new List<KeyValuePair<string, string>>
            {
                new KeyValuePair<string, string>("grant_type", "client_credentials"),
                new KeyValuePair<string, string>("scope", "https://graph.microsoft.com/.default")
            };

            byte[] encode = System.Text.Encoding.ASCII.GetBytes($"{clientId}:{clientSecret}");
            string authCode = Convert.ToBase64String(encode);

            var url = new Uri($"https://login.microsoftonline.com/{tenantId}/oauth2/v2.0/token");
            var client = new HttpClient();
            client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Basic", authCode);
            var request = new HttpRequestMessage(HttpMethod.Post, url)
            {
                Content = new FormUrlEncodedContent(formData)
            };
            var response = await client.SendAsync(request);
            if (response.IsSuccessStatusCode)
            {
                string result = await response.Content.ReadAsStringAsync();
                return JsonConvert.DeserializeObject<MsGraphAuthenticationResult>(result);
            }
            return new MsGraphAuthenticationResult();
        }
    }

    public class MsGraphAuthenticationResult
    {
        [Newtonsoft.Json.JsonProperty("token_type")]
        //[System.Text.Json.Serialization.JsonPropertyName("token_type")]
        public string TokenType { get; set; }

        [Newtonsoft.Json.JsonProperty("expires_in")]
        //[System.Text.Json.Serialization.JsonPropertyName("expires_in")]
        public int ExpiresIn { get; set; }

        [Newtonsoft.Json.JsonProperty("ext_expires_in")]
        //[System.Text.Json.Serialization.JsonPropertyName("ext_expires_in")]
        public int ExtExpiresIn { get; set; }

        [Newtonsoft.Json.JsonProperty("access_token")]
        //[System.Text.Json.Serialization.JsonPropertyName("access_token")]
        public string AccessToken { get; set; }
    }

    public class Entity
    {
        [Newtonsoft.Json.JsonProperty("@odata.type")]
        //[System.Text.Json.Serialization.JsonPropertyName("@odata.type")]
        public string ODataType { get; set; }
    }

    public class GraphUserModel : Entity
    {
        public GraphUserModel() => this.ODataType = "microsoft.graph.user";

        [Newtonsoft.Json.JsonProperty("value")]
        public List<GraphUser> Value { get; set; }
    }

    public class GraphUser
    {
        [Newtonsoft.Json.JsonProperty("id")]
        //[System.Text.Json.Serialization.JsonPropertyName("id")]
        public string Id { get; set; }

        [Newtonsoft.Json.JsonProperty("displayName")]
        //[System.Text.Json.Serialization.JsonPropertyName("displayName")]
        public string DisplayName { get; set; }

        [Newtonsoft.Json.JsonProperty("mail")]
        //[System.Text.Json.Serialization.JsonPropertyName("mail")]
        public string Mail { get; set; }

        [Newtonsoft.Json.JsonProperty("surname")]
        //[System.Text.Json.Serialization.JsonPropertyName("surname")]
        public string Surname { get; set; }

        [Newtonsoft.Json.JsonProperty("givenName")]
        //[System.Text.Json.Serialization.JsonPropertyName("givenName")]
        public string GivenName { get; set; }
    }
}

```
