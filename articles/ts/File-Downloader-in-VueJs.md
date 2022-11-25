# File Downloader in VueJs
I once was tasked to prevent users from downloading PDFs without first being authenticated. Since out site
use OAuth/SAML to generate a session id and token within the browser's cookies, the team thought it was best
to force all users to the page in the Vue SPA to verified the user is authenticate and finally provide a requested document.

Here are the snippets to get things wired up.

First in our router, create a custom route that will force user to pur Assets page. Also, using a props
to break all the last part of route into a passing property. This is optional.

_router/index.ts_
```ts
import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import FileDownload from "../views/FileDownload.vue";

Vue.use(VueRouter);

const loginRedirect = async (to, from, next) => {
  const cookie = CookieManager.get(process.env.VUE_APP_COOKIE_NAME);
  const sessionId = (cookie && cookie.sessionId) ? cookie.sessionId : '';
  const token = (cookie && cookie.token) ? cookie.token : '';

  if (sessionId === '' || token === '') {
    return next({ name: 'Login', params: { redirectRoute: to } });
  }

  return null;
};

const routes: RouteConfig[] = [
  {
    // wildcard matching + params
    path: '/Assets/*/:id',
    name: 'Assets',
    props: true,
    beforeEnter: (to, from, next) => {
      loginRedirect(to, from, next);
      return next();
    },
    component: FileDownload,
  }
];
```

> Note: the ApiManager is a wrapper for axios HTTP library.

The goal here is to create a link element and bind the download file into a Blob.
Then click the link to start the download and finally close the current tab. Since we closing the
the tab window, best to open a new tab/window in the browser before the downloading begins.

_FileDownload.vue_
```vue
<template>
  <div style="text-align:center;">
    <h2>Loading...</h2>
  </div>
</template>

<script lang="ts">
import Vue, { ComponentOptions } from 'vue';
import ApiManager from "../api/index";

export default {
  name: 'assets',
  props: {
    id: {
      type: String,
      required: false,
      default: "",
    },
  },
  created() {
    /* !! needed to change base url of the ApiManger due to routing to
     * API as default, instead of the current site.
     * Note: accessing file from public staging url require CORS setup.
    */
    const p = this.$route.params;
    // TODO: need to find relative path in Staging vs local development
    const u = `${window.location.origin}/${p.pathMatch}/${p.id}`;
    
    ApiManager.axiosObject.get(u, {
      responseType: "blob",
      headers: {
        'Content-Type': 'application/octet-stream'
      }
    }).then((resp) => {
      const type = resp.headers['content-type'];
      const blob = new Blob([resp.data], { type: type, endings: "native"  });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = this.id;
      link.click();

      window.setTimeout(() => window.close(), 1000);
    });
  },
} as ComponentOptions<Assets>;

interface Assets extends Vue {
  id: string;
}
</script>
```

Another way I found to download a file via axios, is to use the `download` attribute. Although, not supported in older browser. A great way
to download a file from a Base64 string.

This example is using Vuex store to trigger the download from an API endpoint.
Goal here was to dispatch a payload to the store with `title` and `href`. The href is a URL path like "./assets/static/documents/TermsAndConditions.pdf.
We allow this path vs a straight filename to prevent us from updating all the existing components.

_pdf.ts_
```ts
import apiManager from '../../api/index';

const pdfStore = {
  namespaced: true,
  state: {
    pdf: '',
    fileName: '',
    title: '',
  },
  mutations: {
    setPdf: (state, payload) => {
      state.pdf = payload;
    },
    resetPdf: (state) => {
      state.pdf = '';
      state.fileName = '';
      state.title = '';
    },
  },
  actions: {
    fetchPdf({ state, commit }, payload) {
      state.title = payload.title;
      const pathParts = payload.href.split('/');
      state.fileName = pathParts[pathParts.length - 1];

      apiManager.document.getBase64(state.fileName).then((data) => {
        if (state.fileName.lastIndexOf('.pdf') > -1) {
          commit('setPdf', data);
        } else {
          // download directly
          const link = document.createElement('a');
          link.href = data;
          link.download = state.fileName;
          link.click();
        }
      });
    },
    clear({ commit }) {
      commit('resetPdf');
    },
  },
  getters: {
    pdf: (state) => state.pdf,
  },
};

export default pdfStore;

```


Various ways to trigger the download from a Vue/TS component.

```ts
ApiManager.axiosObject.get(this.doc, {
  responseType: 'blob',
  headers: {
    'Content-Type': 'application/octet-stream',
  },
}).then((resp) => {
  const type = resp.headers['content-type'];
  const blob = new Blob([resp.data], { type, endings: 'native' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = this.fileName;
  link.click();
});

// == Download file using Base64 string via HTTP Client with API end-point
ApiManager.document.getBase64(this.fileName).then((data) => {
  const link = document.createElement('a');
  link.href = data;
  link.download = this.fileName;
  link.click();
});

// // == Download file using Base64 string via HTTP Client
// // side-effect: doesn't show progress in the browser tray
// // May need to add spinner to button to show working??
// ApiManager.axiosObject.get('./DocumentDownloadBase64', {
//   params: {
//     doc: this.fileName,
//   },
//   headers: {
//     'Content-Type': 'text/plain',
//   },
// }).then((resp) => {
//   const link = document.createElement('a');
//   link.href = resp.data;
//   link.download = this.fileName;
//   link.click();
// });
```