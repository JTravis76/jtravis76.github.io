# Using Google Calendar API

1ST: we need to build a JSON Web Token (JWT) to authenticate against Google.

_This example was taken from the `googleapis` Node client_
```ts
const jws = require("jws");

const CREDENTIALS = {
  client_email: "XXXX.iam.gserviceaccount.com",
  private_key: "-----BEGIN PRIVATE KEY-----\nXXXX\n-----END PRIVATE KEY-----\n"
};
const calendarId = "XXXX@group.calendar.google.com";
const SCOPES = "https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events";

const GOOGLE_TOKEN_URL = "https://www.googleapis.com/oauth2/v4/token";
const iat = Math.floor(new Date().getTime() / 1000);
const additionalClaims = {};
const payload = Object.assign({
  iss: CREDENTIALS.client_email,
  scope: SCOPES,
  aud: GOOGLE_TOKEN_URL,
  exp: iat + 3600,
  iat,
  sub: undefined,
}, additionalClaims);

const token = jws.sign({
  header: { alg: 'RS256' },
  payload,
  secret: CREDENTIALS.private_key,
})
console.log(token);
```

Then, we send the token to Google services so we may authenticate.
Finally, request a list of calendar events by providing a date range and time zone.

```ts
const TIMEOFFSET = "-5:00"; // Eastern Time - New York
const TIMEZONE = "America/New_York"; // "UTC"

fetch("https://www.googleapis.com/oauth2/v4/token", {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    Accept: 'application/json'
  },
  body: `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${token}`,
}).then((resp) => resp.json()).then((d) => {
  const token = `${d.token_type} ${d.access_token}`;

  // == now fetch list
  const timeMin = new Date('2022-11-01').toISOString();
  const timeMax = new Date('2022-11-02').toISOString();
  const params = `?timeMin=${timeMin}&timeMax=${timeMax}&timeZone=${this.TIMEZONE}`;
  const url = encodeURI(
    `https://www.googleapis.com/calendar/v3/calendars/${this.calendarId}/events${params}`,
  );

  fetch(url, {
    method: "GET",
    headers: {
      'x-goog-api-client': 'gdcl/5.0.5 gl-node/14.15.4 auth/7.11.0',
      'Accept-Encoding': 'gzip',
      'User-Agent': 'google-api-nodejs-client/5.0.5 (gzip)',
      'Authorization': token
    },
  }).then((resp) => resp.json()).then((d) => console.log(d));
});
```

## Node Google API
Below is a complete example how to (C)reate, (U)pdate, (R)ead, and (D)elete from Google Calendar API using Node.

First, install Google API
```
> npm i googleapis@92.00
```

_index.js_
```js
const { google } = require("googleapis");

const CREDENTIALS = {
    client_email: "XXXX.gserviceaccount.com",
    private_key: "-----BEGIN PRIVATE KEY-----\nXXXX\n-----END PRIVATE KEY-----\n"
};
const calendarId = "XXXX@group.calendar.google.com";

const SCOPES = "https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events";
const calendar = google.calendar({ version: "v3" });


const auth = new google.auth.JWT(
    CREDENTIALS.client_email,
    null,
    CREDENTIALS.private_key,
    SCOPES
);

//console.log(auth);

const TIMEOFFSET = "-5:00"; // Eastern Time - New York
const TIMEZONE = "America/New_York"; // "UTC"

// == Create ==

async function insertEvent(event) {
    try {
        let resp = await calendar.events.insert({
            auth,
            calendarId,
            requestBody: event
        });

        if (resp.status === 200 && resp.statusText === "OK") {
            return true;
        }
        
        return false;
    } catch (error) {
        console.log(error);
    }
}

const event = {
    summary: "Event 1",
    description: "some detailed description",
    colorId: "8",
    start: {
        dateTime: "2022-12-01T13:00:00",
        timeZone: TIMEZONE
    },
    end: {
        dateTime: "2022-12-01T14:00:00",
        timeZone: TIMEZONE
    }
};

// insertEvent(event).then((res) => {
//      console.log(res); // <- true
// });

// == Read ==

async function getEvents(start, end) {
    try {
        let resp = await calendar.events.list({
            auth: auth,
            calendarId: calendarId,
            timeMin: start,
            timeMax: end,
            timeZone: TIMEZONE
        });

        return resp.data.items;
    } catch (error) {
        console.log(error);
    }
}

// // == NOTE! Might need to remove "Z" from the date to force using the passing Time Zone, otherwise will use UTC/GMT
// getEvents("2022-11-20T00:00:00Z", "2022-11-30T00:00:00Z").then((resp) => {
//     //console.log(resp);
// });

// == Update ==

async function updateEvent(id, event) {
    try {
        let resp = await calendar.events.update({
            auth,
            calendarId,
            eventId: id,
            requestBody: event
        });

        return resp.data.items;
    } catch (error) {
        console.log(error);
    }
}

// == NOTE! Might need to remove "Z" from the date to force using the passing Time Zone, otherwise will use UTC/GMT
const eventUpdated = {
    id: "o4fb96iopvksejd3r4mvk5r174",
    summary: "Event 1",
    description: "Some detailed description",
    colorId: "9",
    // start: {
    //     dateTime: `2022-11-29T10:00:00${TIMEOFFSET}`,
    //     timeZone: 'UTC'
    // },
    // end: {
    //     dateTime: `2022-11-29T11:00:00${TIMEOFFSET}`,
    //     timeZone: 'UTC'
    // }
    start: {
        dateTime: "2022-11-29T10:00:00",
        timeZone: TIMEZONE
    },
    end: {
        dateTime: "2022-11-29T11:00:00",
        timeZone: TIMEZONE
    }
};

// updateEvent(eventUpdated.id, eventUpdated).then((res) => {
//     console.log(res); // <= undefined
// });

// == Delete ==

async function deleteEvent(id) {
    try {
        let resp = await calendar.events.delete({
            auth,
            calendarId,
            eventId: id
        });

        if (resp.status === 200) {
            return true;
        }
        return false;
    } catch (error) {
        console.log(error);
    }
}

// deleteEvent("bhl3l8n9bggpfeh6vnuvra8488").then((resp) => {
//     console.log(resp); // <- false
// });

// == GET Color ==

// calendar.colors.get({
//     auth: auth
// }).then((resp) => console.log(resp.data));

```