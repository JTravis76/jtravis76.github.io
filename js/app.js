(function (Vue, VueRouter, Vuex, axios, markdownit, hljs) {
  "use strict";

  Vue = Vue && Vue.hasOwnProperty("default") ? Vue["default"] : Vue;
  VueRouter =
    VueRouter && VueRouter.hasOwnProperty("default")
      ? VueRouter["default"]
      : VueRouter;
  Vuex = Vuex && Vuex.hasOwnProperty("default") ? Vuex["default"] : Vuex;
  axios = axios && axios.hasOwnProperty("default") ? axios["default"] : axios;
  markdownit =
    markdownit && markdownit.hasOwnProperty("default")
      ? markdownit["default"]
      : markdownit;

  var isDev = window.location.hostname.indexOf("localhost") > -1;
  var config = {
    state: {
      AppName: "Vue-Blogger",
      FullAppName: "Vue Blogger",
      Description: "Blogging site built upon Vue Js",
      BaseURL: isDev ? "./" : "https://jtravis76.github.io/",
      Version: "0.0.0.0",
      VersionDate: "2020-01-01T00:00:00Z",
      Environment: "== LOCAL == LOCAL == LOCAL ==",
    },
    getters: {
      baseURL: function (state) {
        return state.BaseURL;
      },
    },
  };
  const fontPlayingCards = {
    name: "FontPlayingCard",
    template: `<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
        viewBox="0 0 463.644 463.644" style="enable-background:new 0 0 463.644 463.644;" xml:space="preserve">
       <path id="XMLID_1_" d="M463.164,146.031l-77.369,288.746c-1.677,6.26-7.362,10.4-13.556,10.401c-1.198,0-2.414-0.155-3.625-0.479
       l-189.261-50.712c-7.472-2.003-11.922-9.711-9.919-17.183l2.041-7.616c1.287-4.801,6.222-7.647,11.023-6.363
       c4.801,1.287,7.65,6.222,6.363,11.023l-1.013,3.78l181.587,48.656l75.314-281.076l-77.031-20.64
       c-4.801-1.287-7.651-6.222-6.364-11.023s6.225-7.648,11.022-6.364l80.869,21.668C460.718,130.853,465.167,138.56,463.164,146.031z
        M166.128,56.029c-4.971,0-9,4.029-9,9v8.565c0,4.971,4.029,9,9,9s9-4.029,9-9v-8.565C175.128,60.058,171.099,56.029,166.128,56.029
       z M280.889,176.762c2.202,3.114,2.202,7.278,0,10.393l-41.716,58.996c-1.687,2.385-4.427,3.804-7.349,3.804
       c-2.921,0-5.662-1.418-7.348-3.804l-41.718-58.996c-2.202-3.114-2.202-7.278,0-10.393l41.718-58.996
       c1.687-2.385,4.427-3.804,7.348-3.804c2.922,0,5.662,1.418,7.349,3.804L280.889,176.762z M262.518,181.958l-30.694-43.408
       l-30.694,43.408l30.694,43.407L262.518,181.958z M343.016,380.764l-2.216,8.273c-1.286,4.801,1.563,9.736,6.365,11.022
       c0.78,0.209,1.563,0.309,2.334,0.309c3.974,0,7.611-2.653,8.688-6.674l2.216-8.273c1.286-4.801-1.563-9.736-6.365-11.022
       C349.237,373.111,344.302,375.963,343.016,380.764z M112.375,215.913c2.577-0.69,5.056-1.089,7.454-1.195V32.492
       c0-7.736,6.293-14.029,14.028-14.029h195.935c7.736,0,14.03,6.293,14.03,14.029v182.225c2.396,0.106,4.875,0.505,7.45,1.195
       c16.511,4.424,26.346,21.457,21.922,37.968c-4.28,15.974-17.951,28.108-29.372,36.404v41.139c0,7.736-6.294,14.03-14.03,14.03
       H133.857c-7.735,0-14.028-6.294-14.028-14.03v-41.137c-11.422-8.295-25.093-20.428-29.376-36.405
       c-2.143-7.996-1.042-16.35,3.1-23.523C97.695,223.186,104.38,218.055,112.375,215.913z M343.821,267.05
       c6.531-6.172,10.424-12,11.985-17.828c1.855-6.924-2.27-14.067-9.194-15.923c-1.047-0.281-1.97-0.451-2.791-0.538V267.05z
        M137.829,327.454h187.992v-41.7c-0.001-0.08-0.001-0.161,0-0.241v-59.907c-0.003-0.13-0.003-0.261,0-0.391V36.463H137.829v188.755
       c0.003,0.13,0.003,0.261,0,0.392v59.898c0.001,0.084,0.001,0.168,0,0.252V327.454z M107.84,249.222
       c1.563,5.83,5.457,11.66,11.989,17.832v-34.292c-0.822,0.086-1.746,0.256-2.794,0.537c-3.353,0.898-6.156,3.051-7.894,6.061
       C107.404,242.369,106.942,245.871,107.84,249.222z M173.576,405.019l-79.363,21.265L18.897,145.209l77.031-20.641
       c4.801-1.287,7.651-6.222,6.364-11.023c-1.287-4.801-6.225-7.65-11.022-6.364L10.402,128.85c-3.614,0.968-6.637,3.29-8.512,6.538
       c-1.876,3.249-2.376,7.029-1.407,10.644l77.37,288.743c0.968,3.616,3.29,6.641,6.54,8.518c2.166,1.25,4.567,1.89,7,1.89
       c1.216,0,2.439-0.16,3.644-0.482l83.199-22.293c4.801-1.287,7.651-6.222,6.364-11.022
       C183.312,406.581,178.377,403.734,173.576,405.019z M51.298,156.782c-4.801,1.287-7.65,6.222-6.364,11.023l2.217,8.274
       c1.078,4.021,4.714,6.673,8.688,6.673c0.771,0,1.555-0.1,2.335-0.309c4.801-1.287,7.65-6.222,6.364-11.023l-2.217-8.274
       C61.034,158.344,56.101,155.496,51.298,156.782z M297.52,281.322c-4.971,0-9,4.029-9,9v8.565c0,4.971,4.029,9,9,9s9-4.029,9-9
       v-8.565C306.52,285.352,302.491,281.322,297.52,281.322z"/><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>`,
  };
  var HomePage = {
    name: "home-page",
    template:
      '<div> <div class="container"> <div class="columns"> <div class="column is-one-third"> <div class="pic" style="padding:5px;"> <img id="profile-pic" class="tilt" src="./img/me.png"> </div> <!-- <aside class="menu" style="padding-top: 50px;"> <p class="menu-label"> General </p> <ul class="menu-list"> <li><a>Dashboard</a></li> <li><a>Customers</a></li> </ul> <p class="menu-label"> Administration </p> <ul class="menu-list"> <li><a>Team Settings</a></li> <li> <a class="is-active">Manage Your Team</a> <ul> <li><a>Members</a></li> <li><a>Plugins</a></li> <li><a>Add a member</a></li> </ul> </li> <li><a>Invitations</a></li> <li><a>Cloud Storage Environment Settings</a></li> <li><a>Authentication</a></li> </ul> <p class="menu-label"> Transactions </p> <ul class="menu-list"> <li><a>Payments</a></li> <li><a>Transfers</a></li> <li><a>Balance</a></li> </ul> </aside> --> </div> <div class="column"> <div class="title">Jeremy R. Travis</div> <div class="bio" style="font-family:\'Happy Monkey\',cursive; font-size: 20px;"> <p> Out of high school, I worked a few plant labor jobs until the year of 2004; when I was ask for an office position. After learning the ropes of a new job, I began finding interest in database and ASP.NET. Been experimenting with Visual Studio C++ prior to this, thinking I wanted to be a game developer. </p> <p> Working as an Office Professional, my boss had given me the liberty to improve a few processes. I quickly began to develop a dashboard to display our daily metrics using web form to save data entered by another employee. This replaces most of those boring spreadsheet. </p> <p> Later learn, how powerful and useful VBA macros were in Microsoft Excel. I became a macro writing wizard. Soon, everyone wanted me to write scripts to help their daily tasks. </p> <p> All that ended the year of 2009, as the plant was closing it door due to a buyout. I started working at Life Ambulance as a Tier I helpdesk. In a few months of quality work, I was promoted to Network / System Administrator. Two years later, First Med bought out Life Ambulance in July of 2011. Through hard work and willing to help the company, I developed a HR portal to integrate with in-house dispatch software. Which the portal eased in many Human Resource related tasks, mainly exporting employee hours into third-party vendor software for payroll. </p> <p> In August 2012, I was promoted to .NET Developer / IT Specialist. Join the Development team to help write enhancement to the company\'s dispatch software. Later, other projects such as; document management system, improvement in other portals for employees, billing department, etc. </p> <p>&nbsp;</p> <h3 class="title">I design and build amazing things.</h3> </div> </div> </div> </div> <section class="section"> <div class="container"> <h1 class="title has-text-centered">Portfolio</h1> <div class="columns"><div class="column has-text-centered"><h4 class="portfolio-title">JQuery Modal Picker</h4><a href="https://jtravis76.github.io/Modal-Picker/" target="blank"><div class="portfolio-item"><span class="fa fa-plug"></span></div></a></div><div class="column has-text-centered"><h4 class="portfolio-title">Card Shuffle</h4><router-link to="/cards"><div class="portfolio-item"><FontPlayingCards width="200" style="padding: 20px; fill: #3273dc"></FontPlayingCards></div></router-link></router-link></div><div class="column has-text-centered"><h4 class="portfolio-title">Coming Soon</h4><a href="#" target="blank"><div class="portfolio-item"><i class="fa fa-code"></i></div></a></div><div class="column has-text-centered">&nbsp;</div><div class="column has-text-centered">&nbsp;</div></div></div></section> </div>',
    components: { FontPlayingCards: fontPlayingCards },
  };
  var NotFound = {
    name: "not-found",
    template:
      '<section> <div class="container"> <h1><span class="fa fa-file"></span> OOP! We broken a link.</h1> <h2> This page was not found. </h2> <p>&nbsp;</p> <router-link to="/" class="button is-primary"><span class="fa fa-home"></span> Take me home.</router-link> </div> </section>',
  };
  var About = {
    name: "about-page",
    template: '<div class="container"> About </div>',
  };
  var Categories = {
    name: "categories-page",
    template:
      '<div> <div style="text-align:center; margin-bottom:20px; font-size:x-large;"><span class="tag is-dark">{{categories.length}}</span> categories with <span class="tag is-dark">{{articleCnt}}</span> articles. Wow, that\'s a lot of great knowledges!</div> <div class="columns is-multiline"> <template v-for="cat in categories"> <div class="column"> <router-link :to="{ path: \'/categories/\' + cat.Link }"> <div class="category">{{cat.Name}}</div> </router-link> </div> </template> </div> <router-view></router-view> </div>',
    computed: {
      categories: function () {
        return this.$store.state.Categories;
      },
      articleCnt: function () {
        return this.$store.state.Articles.length;
      },
    },
  };
  var CategoryArticles = {
    name: "category-articles",
    template:
      '<div class="container"> <h1 class="title is-1">{{category.Name}}</h1> <section class="section"> <ul> <li v-for="art in articles"> <span class="fa fa-file" style="font-size:30px;"></span> <router-link :to="{path:\'/categories/\' + category.Link + \'/\' + art.Link}" class="blog-title">{{art.Title}}</router-link> <br /><small><span class="fa fa-calendar-1"></span> {{art.Created | toDateString }}</small> </li> </ul> </section> </div>',
    computed: {
      category: function () {
        if (this.$store.state.Categories.length > 0) {
          let vm = this;
          return this.$store.state.Categories.firstOrDefault(function (x) {
            return x.Link === vm.$route.params.cat;
          });
        }
        return { Name: "", Link: "" };
      },
      articles: function () {
        if (this.$store.state.Articles.length > 0) {
          let vm = this;
          return this.$store.state.Articles.where(function (x) {
            return x.Category === vm.$route.params.cat;
          });
        }
        return new Array();
      },
    },
  };
  var HighlightCode = function () {
    document.querySelectorAll("pre code").forEach((block) => {
      hljs.highlightBlock(block);
    });
  };
  var Article = {
    name: "article-page",
    template:
      '<div class="container"> <div class="columns"> <div class="column is-12"> <article class="markdown-body" v-html="markdown"></article> </div> </div> </div>',
    data: function () {
      return {
        markdown: "",
      };
    },
    // computed: {
    //     markdown: function() {
    //         let vm = this;
    //         let article = this.$store.state.Articles.firstOrDefault(function(x) {
    //             return x.Link === vm.$route.params.art;
    //         });
    //         if (article !== null) {
    //             return markdownit().render(article.Markdown);
    //         }
    //     }
    // },
    created: function () {
      let vm = this;
      let base = isDev
        ? "."
        : "https://raw.githubusercontent.com/JTravis76/jtravis76.github.io/master";
      this.$http
        .get(
          `${base}/articles/${vm.$route.params.cat}/${vm.$route.params.art}.md`
        )
        .then((resp) => {
          let article = resp.data;
          if (article !== null && article.length > 0) {
            let startIdx = article.indexOf("#meta-end") + 9;
            vm.markdown = markdownit().render(
              article.substr(startIdx, article.length)
            );
          }
        })
        .catch((err) => {
          console.log(err);
          vm.markdown =
            '<div class="error">ERROR: Article link is broken</div>';
        });
      // fetch(`${base}/articles/${vm.$route.params.cat}/${vm.$route.params.art}.md`,
      // {
      //     cache: "no-cache",
      //     method: "GET"
      // }).then(async resp => {
      //     let article = await resp.text();

      //     if (article !== null && article.length > 0) {
      //         let startIdx = article.indexOf("#meta-end") + 9;
      //         vm.markdown = markdownit().render(article.substr(startIdx, article.length));
      //     }
      // })
      // .catch(err => {
      //     console.log(err);
      //     //vm.markdown = "<div class=\"error\">ERROR: Article link is broken</div>"
      // });

      this.$nextTick(() => {
        HighlightCode();
      });
    },
    updated: function () {
      this.$nextTick(() => {
        HighlightCode();
      });
    },
  };
  //Credit goes //https://medium.com/fullstackio/tutorial-shuffle-a-deck-of-cards-in-vue-js-b65da4c59b1\
  var CardSuffle = {
    name: "card-shuffle",
    template:
      '<div class="columns card-table"> <div class="column is-12"> <div class="count-section"> # of Shuffles: {{shuffleCount}} </div> <div class="speed-buttons"> <button v-for="type in shuffleTypes" class="button is-dark" v-bind:disabled="shuffleSpeed == \'shuffle\'+type" @click="shuffleSpeed = \'shuffle\'+type">{{type}}</button> </div> <div class="main-buttons"> <button v-if="isDeckShuffled" @click="displayInitialDeck" class="button is-warning">Reset &nbsp;<i class="fa fa-undo"></i></button> <button @click="shuffleDeck" class="button is-primary">Shuffle &nbsp;<i class="fa fa-random"></i></button> </div> <transition-group :name="shuffleSpeed" tag="div" class="deck"> <div class="card" v-for="card in cards" :key="card.id" v-bind:class="suitColor[card.suit]"> <span class="card-suit card-suit-top">{{card.suit}}</span> <span class="card-number">{{card.rank}} </span> <span class="card-suit card-suit-bottom">{{card.suit}}</span> </div> </transition-group> </div> </div>',
    data: function () {
      return {
        ranks: [
          "A",
          "2",
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          "10",
          "J",
          "Q",
          "K",
        ],
        suits: ["♥", "♦", "♠", "♣"],
        cards: [],
        suitColor: { "♠": "black", "♣": "black", "♦": "red", "♥": "red" },
        shuffleSpeed: "shuffleMedium",
        shuffleTypes: ["Slow", "Medium", "Fast"],
        isDeckShuffled: false,
        shuffleCount: 0,
      };
    },
    created() {
      this.displayInitialDeck();
    },
    methods: {
      displayInitialDeck() {
        let id = 1;
        this.cards = [];

        for (let s = 0; s < this.suits.length; s++) {
          for (let r = 0; r < this.ranks.length; r++) {
            let card = {
              id: id,
              rank: this.ranks[r],
              suit: this.suits[s],
            };

            this.cards.push(card);
            id++;
          }
        }
      },
      shuffleDeck() {
        for (let i = this.cards.length - 1; i > 0; i--) {
          let randomIndex = Math.floor(Math.random() * i);

          let temp = this.cards[i];
          this.$set(this.cards, i, this.cards[randomIndex]);
          this.$set(this.cards, randomIndex, temp);
        }

        this.isDeckShuffled = true;
        this.shuffleCount = this.shuffleCount + 1;
      },
    },
  };
  var BinaryClock = {
    name: "binary-clock",
    template: `<div class="clock-wrapper">
        <div class="binary-clock">
            <div>
                <img alt="0" src="./img/clock/off.png" />
                <img alt="0" src="./img/clock/off.png" />
            </div>
            <div>
                <img alt="0" src="./img/clock/off.png" />
                <img alt="0" src="./img/clock/off.png" />
            </div>
            <div>
                <img alt="0" src="./img/clock/off.png" />
                <img alt="0" src="./img/clock/off.png" />
            </div>
        </div>
        <br />
        <template v-for="part in timeParts">
          <img :alt="part" :src="'./img/clock/' + part + '.gif'" />
        </template>
        </div>`,
    data() {
      return {
        timeParts: ["8", "8", "dgc", "8", "8", "dgc", "8", "8", "am"],
        timerIdx: 0,
      };
    },
    created() {
      this.timerIdx = window.setInterval(() => {
        const d = new Date();
        let hr = d.getHours() + 100;
        const mn = d.getMinutes() + 100;
        const se = d.getSeconds() + 100;
        let am_pm = "am";
        if (hr === 100) {
          hr = 112;
          am_pm = "am";
        } else if (hr < 112) am_pm = "am";
        else if (hr === 112) am_pm = "pm";
        else if (hr > 112) {
          am_pm = "pm";
          hr = hr - 12;
        }
        const timeStr = "" + hr.toString() + mn.toString() + se.toString();
        this.$set(this.timeParts, 0, timeStr.substring(1, 2));
        this.$set(this.timeParts, 1, timeStr.substring(2, 3));
        this.$set(this.timeParts, 3, timeStr.substring(4, 5));
        this.$set(this.timeParts, 4, timeStr.substring(5, 6));
        this.$set(this.timeParts, 6, timeStr.substring(7, 8));
        this.$set(this.timeParts, 7, timeStr.substring(8, 9));
        this.$set(this.timeParts, 8, am_pm);
      }, 1000);
    },
    beforeDestory() {
      window.clearInterval(this.timerIdx);
    },
  };
  const MetronomePlayer = {
    name: "MetronomePlayer",
    template: "",
  };
  var MyResume = {
    name: "my-resume",
    template: `<div>
    <button type='button' class='button' title='print resume' @click='printMe()'><span class="fa fa-print"></button>
    <iframe ref='iframe' src="/resume.html" width='100%' height='100%' title='my resume'></iframe></div>`,
    mounted() {
      const iframe = this.$refs.iframe;
      iframe.onload = function () {
        iframe.style.height =
          (iframe.contentWindow.document.body.scrollHeight + 20).toString() +
          "px";

        iframe.style.width =
          (iframe.contentWindow.document.body.scrollWidth + 20).toString() +
          "px";
      };
    },
    methods: {
      printMe() {
        const iframe = this.$refs.iframe;
        iframe.contentWindow.print();
      },
    },
  };
  // var MyApp = {
  //     name: "my-app",
  //     template: "<div>Welcome! Use this to build a starting layout with Vue render option</div>"
  // };

  var Http = {
    install: function (vue, name) {
      if (name === void 0) {
        name = "$http";
      }
      axios.defaults.baseURL = store.getters.baseURL;
      //axios.defaults.withCredentials = true;
      axios.interceptors.request.use(function (config) {
        // store.commit('addconnection');
        return config;
      });
      axios.interceptors.response.use(
        function (config) {
          // store.commit('removeconnection');
          // if (store.state.httpConnections == 0)
          //     store.commit('pageloader', false);
          return config;
        },
        function (err) {
          // store.commit('removeconnection');
          // if (store.state.httpConnections == 0)
          //     store.commit('pageloader', false);
          // switch (err.response.status) {
          //     case 400:
          //         store.commit("validationSummary/Errors", err.response.data);
          //         break;
          //     default:
          //         store.dispatch("validationSummary/OnError", err)
          //             .then(function () {
          //             router.push("/error");
          //         });
          //         break;
          // }
          console.error(err);
          return Promise.reject(err);
        }
      );
      Object.defineProperty(vue.prototype, name, { value: axios });
    },
  };

  Vue.use(VueRouter);
  var ChildRouterView = {
    name: "child-router-view",
    template: "<router-view></router-view>",
  };
  var routes = [
    { path: "/", redirect: "/home" },
    { path: "*", component: NotFound },
    { path: "/home", component: HomePage },
    { path: "/about", component: About },
    {
      path: "/categories",
      component: ChildRouterView,
      children: [
        { path: "", name: "Categories", component: Categories },
        {
          path: "/categories/:cat",
          name: "Categories ",
          component: CategoryArticles,
        },
        {
          path: "/categories/:cat/:art",
          name: "Categories  ",
          component: Article,
        },
      ],
    },
    { path: "/cards", component: CardSuffle },
    { path: "/binaryclock", component: BinaryClock },
    { path: "/metronomeplayer", component: MetronomePlayer },
    { path: "/resume", component: MyResume },
  ];
  var router = new VueRouter({
    routes: routes,
    mode: "hash",
    //linkActiveClass: "active"
    linkExactActiveClass: "active",
  });
  router.beforeEach(function (to, from, next) {
    store.commit("AdjustBreadcrumb", to.path);
    next();
  });

  Vue.use(Vuex);
  var store = new Vuex.Store({
    modules: {
      config: config,
    },
    state: {
      Breadcrumbs: [{ Name: "Home", Link: "/" }],
      Categories: [],
      Articles: [],
    },
    mutations: {
      Categories: function (state, payload) {
        state.Categories = payload.Categories;
      },
      Articles: function (state, payload) {
        state.Articles = payload.Articles;
      },
      AdjustBreadcrumb: function (state, payload) {
        state.Breadcrumbs = [{ Name: "Home", Link: "/" }];
        switch (payload) {
          case "/home":
            break;
          case "/categories":
            state.Breadcrumbs.push({ Name: "Categories", Link: "/categories" });
            break;
          default:
            let stringArray = payload.split("/");
            if (stringArray.length > 2) {
              state.Breadcrumbs.push({
                Name: "Categories",
                Link: "/" + stringArray[1],
              });
              //add next level(s)
              for (let i = 2; i < stringArray.length; i++) {
                const item = stringArray[i];
                let c = state.Categories.firstOrDefault(function (x) {
                  return x.Link === item;
                });
                if (c !== null)
                  state.Breadcrumbs.push({
                    Name: c.Name,
                    Link: "/" + stringArray[1] + "/" + stringArray[2],
                  });
                else {
                  let a = state.Articles.firstOrDefault(function (x) {
                    return x.Link === item;
                  });
                  if (a !== null)
                    state.Breadcrumbs.push({
                      Name: a.Title,
                      Link:
                        "/" +
                        stringArray[1] +
                        "/" +
                        stringArray[2] +
                        "/" +
                        item,
                    });
                  else state.Breadcrumbs.push({ Name: item, Link: payload });
                }
              }
            }
            break;
        }
      },
    },
    actions: {},
  });

  Vue.filter("toDateString", function (value) {
    if (value) {
      if (value.indexOf("/Date(") > -1) {
        value = parseInt(value.replace("/Date(", "").replace(")/", ""));
      }
      return new Date(value).toDateString();
    }
  });

  Vue.use(Http);
  Vue.config.productionTip = false;
  new Vue({
    data: function () {
      return {
        year: new Date().getFullYear(),
      };
    },
    created: function () {
      let vm = this;
      this.$http
        .all([
          this.$http.get("db/categories.json"),
          this.$http.get("db/articles.json"),
        ])
        .then(
          vm.$http.spread(function (cat, art) {
            vm.$store.commit("Categories", cat.data);
            vm.$store.commit("Articles", art.data);
          })
        );
    },
    router: router,
    store: store,
    //render: function (h) { return h(MyApp); }
  }).$mount("#app");

  document.addEventListener("DOMContentLoaded", () => {
    // Get all "navbar-burger" elements
    const $navbarBurgers = Array.prototype.slice.call(
      document.querySelectorAll(".navbar-burger"),
      0
    );

    // Check if there are any navbar burgers
    if ($navbarBurgers.length > 0) {
      // Add a click event on each of them
      $navbarBurgers.forEach((el) => {
        el.addEventListener("click", () => {
          // Get the target from the "data-target" attribute
          const target = el.dataset.target;
          const $target = document.getElementById(target);

          // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
          el.classList.toggle("is-active");
          $target.classList.toggle("is-active");
        });
      });
    }
  });
})(Vue, VueRouter, Vuex, axios, markdownit, hljs);
