# Axios Fake
Once the Project Manager ask to clone a front-end of an application, but the new application didn't have a backend API. It was going to be updated from NET 4.8 to NET Core. As a temporary solution, I created a fake Axios object to serve data objects and arrays. This satisfied the front-end components and allow the site to run.

_axios-fake.ts_
```ts
// A static data object (normally) provided by API
const LoggedInUserData = {
  firstName: 'Fred',
  lastName: 'Flintstone',
  reports: [
    'ARSReport',
    'BusinessReport',
    'DealerProfile'
  ],
  roles: [
    {
      role: '1',
      division: 'L',
      dealerID: '1454120636'
    },
    {
      role: '1',
      division: 'F',
      dealerID: '1346520636'
    }
  ],
  dealership: [
    {
      id: '1346520636',
      name: 'Schultz Ford',
      address: '80 Route 304',
      city: 'Nanuet',
      state: 'NY',
      zip: '10954',
      enrolled: true,
      acceptedTC: '',
      pa: '20636',
      userId: 'testUser',
      dealerCode: '13465',
      division: 'F',
      dealershipPhone: '8456243600',
      remoteDelivery: true
    },
    {
      id: '1454120636',
      name: 'Schultz Lincoln',
      address: '80 Route 304',
      city: 'Nanuet',
      state: 'NY',
      zip: '10954',
      enrolled: false,
      acceptedTC: '',
      pa: '20636',
      dealerCode: '14541',
      division: 'L',
      dealershipPhone: '8456243600',
      remoteDelivery: false
    }
  ]
};

// Fake Axios object
export default {
  defaults: {
    headers: {
      common: { sessionId: null, token: null },
    },
  },
  interceptors: {
    response: {
      use(success, failure) {
        // fake placeholder
      }
    },
  },
  get(opt) {
    return new Promise((resolve, reject) => {
      const routeName = opt.split('?')[0].toLowerCase();
      const obj = { data: null };
      switch (routeName) {
        case 'loggedinuser':
          obj.data = LoggedInUserData;
          break;

        default:
          break;
      }
      if (obj.data === null) {
        return reject(new Error(`Fake Route [${routeName}] not provisioned!!`));
      }
      return resolve(obj);
    });
  },
  post(url, data, config) {
    return new Promise((resolve, reject) => {
      // console.log(url, data, config);
      resolve({ data: null });
    });
  }
};
```

_api/index.ts_
```ts
// import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import axiosFake from "../axios-fake";
import LoggedInUser from "./loggedinuser";

const success = (response: AxiosResponse) => {
  // ...
  return response;
};
const failure = (error: AxiosError) => {
  if (!error.response) {
    throw error;
  }

  switch (error.response.status) {
    case 400: // Bad Request
      break;
    case 401: // Unauthorized
      break;
    case 404: // Not Found
      break;
    case 500: // Internal Server Error
      break;
    default:
  }

  throw error;
};

class ApiManger {
  constructor() {
    // == axios FAKE data and object
    this.axiosObject = axiosFake;
    // this.axiosObject = axios.create({
    //   baseURL: `${import.meta.env.VITE_API_URL}api/`,
    // });
    this.axiosObject.interceptors.request.use((config) => {
      /// ...
      return config;
    });
    this.axiosObject.interceptors.response.use(success, failure);

    this.loggedinuser = new LoggedInUser(this.axiosObject);
  }
  axiosObject: AxiosInstance;
  loggedinuser: LoggedInUser;

  setSessionHeader(session: string) {
    this.axiosObject.defaults.headers.common.sessionId = session;
  }

  setTokenHeader(token: string) {
    this.axiosObject.defaults.headers.common.token = token;
  }

  setAuthorizationHeader(token: string) {
    this.axiosObject.defaults.headers.common.Authorization = `Bearer ${token}`;
  }

  setReferrer() {
    let referrer = "";
    if (import.meta.env.MODE === "development") {
      referrer = "http://localhost:8080/login";
    }
    this.axiosObject.defaults.headers.common.referrer = referrer;
  }
}

export default new ApiManger();

```
