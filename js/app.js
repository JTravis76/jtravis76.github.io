(function (Vue, VueRouter, Vuex, axios, markdownit) {
    'use strict';

    Vue = Vue && Vue.hasOwnProperty('default') ? Vue['default'] : Vue;
    VueRouter = VueRouter && VueRouter.hasOwnProperty('default') ? VueRouter['default'] : VueRouter;
    Vuex = Vuex && Vuex.hasOwnProperty('default') ? Vuex['default'] : Vuex;
    axios = axios && axios.hasOwnProperty('default') ? axios['default'] : axios;
    markdownit = markdownit && markdownit.hasOwnProperty('default') ? markdownit['default'] : markdownit;

    var config = {
        state: {
            AppName: "Vue-Blogger",
            FullAppName: "Vue Blogger",
            Description: "Blogging site built upon Vue Js",
            BaseURL: "http://localhost:8080/",
            Version: "0.0.0.0",
            VersionDate: "2020-01-01T00:00:00Z",
            Enviroment: "== LOCAL == LOCAL == LOCAL =="
        },
        getters: {
            baseURL: function (state) { return state.BaseURL; }
        }
    };
    var HomePage = {
        name: "home-page",
        template: "<div> <div class=\"container\"> <div class=\"columns\"> <div class=\"column is-one-third\"> <div class=\"pic\" style=\"padding:5px;\"> <img id=\"profile-pic\" class=\"tilt\" src=\"./img/me.png\"> </div> <!-- <aside class=\"menu\" style=\"padding-top: 50px;\"> <p class=\"menu-label\"> General </p> <ul class=\"menu-list\"> <li><a>Dashboard</a></li> <li><a>Customers</a></li> </ul> <p class=\"menu-label\"> Administration </p> <ul class=\"menu-list\"> <li><a>Team Settings</a></li> <li> <a class=\"is-active\">Manage Your Team</a> <ul> <li><a>Members</a></li> <li><a>Plugins</a></li> <li><a>Add a member</a></li> </ul> </li> <li><a>Invitations</a></li> <li><a>Cloud Storage Environment Settings</a></li> <li><a>Authentication</a></li> </ul> <p class=\"menu-label\"> Transactions </p> <ul class=\"menu-list\"> <li><a>Payments</a></li> <li><a>Transfers</a></li> <li><a>Balance</a></li> </ul> </aside> --> </div> <div class=\"column\"> <div class=\"title\">Jeremy R. Travis</div> <div class=\"bio\" style=\"font-family:'Happy Monkey',cursive; font-size: 20px;\"> <p> Out of high school, I worked a few plant labor jobs until the year of 2004; when I was ask for an office position. After learning the ropes of a new job, I began finding interest in database and ASP.NET. Been experimenting with Visual Studio C++ prior to this, thinking I wanted to be a game developer. </p> <p> Working as an Office Professional, my boss had given me the liberty to improve a few processes. I quickly began to develop a dashboard to display our daily metrics using web form to save data entered by another employee. This replaces most of those boring spreadsheet. </p> <p> Later learn, how powerful and useful VBA macros were in Microsoft Excel. I became a macro writing wizard. Soon, everyone wanted me to write scripts to help their daily tasks. </p> <p> All that ended the year of 2009, as the plant was closing it door due to a buyout. I started working at Life Ambulance as a Tier I helpdesk. In a few months of quality work, I was promoted to Network / System Administrator. Two years later, First Med bought out Life Ambulance in July of 2011. Through hard work and willing to help the company, I developed a HR portal to integrate with in-house dispatch software. Which the portal eased in many Human Resource related tasks, mainly exporting employee hours into third-party vendor software for payroll. </p> <p> In August 2012, I was promoted to .NET Developer / IT Specialist. Join the Development team to help write enhancement to the company\'s dispatch software. Later, other projects such as; document management system, improvement in other portals for employees, billing department, etc. </p> <p>&nbsp;</p> <h3 class=\"title\">I design and build amazing things.</h3> </div> </div> </div> </div> <section class=\"section\"> <div class=\"container\"> <h1 class=\"title has-text-centered\">Portfolio</h1> <div class=\"columns\"> <div class=\"column has-text-centered\"> <h4 class=\"portfolio-title\">JQuery Modal Picker</h4> <a href=\"https://jtravis76.github.io/Modal-Picker/\" target=\"blank\"> <div class=\"portfolio-item\"> <span class=\"fa fa-plug\"></span> </div> </a> </div> <div class=\"column has-text-centered\"> <h4 class=\"portfolio-title\">Coming Soon</h4> <a href=\"#\" target=\"blank\"> <div class=portfolio-item> <i class=\"fa fa-code\"></i> </div> </a> </div> <div class=\"column has-text-centered\">&nbsp;</div> <div class=\"column has-text-centered\">&nbsp;</div> <div class=\"column has-text-centered\">&nbsp;</div> </div> </div> </section> </div>"
    };
    var NotFound = {
        name: "not-found",
        template: "<section> <div class=\"container\"> <h1><span class=\"fa fa-file\"></span> OOP! We broken a link.</h1> <h2> This page was not found. </h2> <p>&nbsp;</p> <router-link to=\"/\" class=\"button is-primary\"><span class=\"fa fa-home\"></span> Take me home.</router-link> </div> </section>"
    };
    var About = {
        name: "about-page",
        template: "<div class=\"container\"> About </div>"
    };
    var Categories = {
        name: "categories-page",
        template: "<div> <div class=\"columns\"> <template v-for=\"cat in categories\"> <div class=\"column\"> <router-link :to=\"{ path: '/categories/' + cat.Link }\"> <div class=\"category\">{{cat.Name}}</div> </router-link> </div> </template> </div> <router-view></router-view> </div>",
        computed: {
            categories: function() {
                return this.$store.state.Categories;
            }
        }
    };
    var CategoryArticles = {
        name: "category-articles",
        template: "<div class=\"container\"> <h1 class=\"title is-1\">{{category.Name}}</h1> <section class=\"section\"> <ul> <li v-for=\"art in articles\"> <span class=\"fa fa-file\" style=\"font-size:30px;\"></span> <router-link :to=\"{path:'/categories/' + category.Link + '/' + art.Link}\" class=\"blog-title\">{{art.Title}}</router-link> <br /><small><span class=\"fa fa-calendar\"></span> {{art.Created | toDateString }}</small> </li> </ul> </section> </div>",
        computed: {
            category: function() {
                if (this.$store.state.Categories.length > 0) {
                    let vm = this;
                    return this.$store.state.Categories.firstOrDefault(function(x) {
                        return x.Link === vm.$route.params.cat;
                    });
                }
                return { Name: "", Link: "" };
            },
            articles: function() {
                if (this.$store.state.Articles.length > 0) {
                    let vm = this;
                    return this.$store.state.Articles.where(function(x) {
                        return x.Category === vm.$route.params.cat;
                    });
                }
                return new Array();
            }
        }
    };
    var Article = {
        name: "article-page",
        template: "<div class=\"container\"> <div class=\"columns\"> <div class=\"column is-12\"> <div class=\"markdown\" v-html=\"markdown\"></div> </div> </div> </div>",
        computed: {
            markdown: function() {
                let vm = this;
                let article = this.$store.state.Articles.firstOrDefault(function(x) {
                    return x.Link === vm.$route.params.art;
                });
                if (article !== null) {
                    return markdownit().render(article.Markdown);
                }
                return "<div>ERROR: Article link is broken</div>"
            }
        }
    };
    // var MyApp = {
    //     name: "my-app",
    //     template: "<div>Welcome! Use this to build a starting layout with Vue render option</div>"
    // };

    var Http = {
        install: function (vue, name) {
            if (name === void 0) { name = "$http"; }
            axios.defaults.baseURL = store.getters.baseURL;
            //axios.defaults.withCredentials = true;
            axios.interceptors.request.use(function (config) {
                // store.commit('addconnection');
                return config;
            });
            axios.interceptors.response.use(function (config) {
                // store.commit('removeconnection');
                // if (store.state.httpConnections == 0)
                //     store.commit('pageloader', false);
                return config;
            }, function (err) {
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
            });
            Object.defineProperty(vue.prototype, name, { value: axios });
        }
    };

    Vue.use(VueRouter);
    var ChildRouterView = {
        name: "child-router-view",
        template: "<router-view></router-view>"
    };
    var routes = [
        { path: "/", redirect: "/home" },
        { path: "*", component: NotFound },
        { path: "/home", component: HomePage },
        { path: "/about", component: About },
        {
            path: "/categories", component: ChildRouterView,
            children: [
                { path: "", name: "Categories", component: Categories },
                { path: "/categories/:cat", name: "Categories ", component: CategoryArticles },
                { path: "/categories/:cat/:art", name: "Categories  ", component: Article }
            ]
        }
    ];
    var router = new VueRouter({
        routes: routes,
        mode: "hash",
        //linkActiveClass: "active"
        linkExactActiveClass: "active"
    });
    router.beforeEach(function (to, from, next) {
        store.commit("AdjustBreadcrumb", to.path);
        next();
    });

    Vue.use(Vuex);
    var store = new Vuex.Store({
        modules: {
            config: config
        },
        state: {
            Breadcrumbs: [{Name: "Home", Link: "/"}],
            Categories: [],
            Articles: []
        },
        mutations: {
            UpdateState: function(state, payload) {
                state.Categories = payload.Categories;
                state.Articles = payload.Articles;
            },
            AdjustBreadcrumb: function(state, payload) {
                state.Breadcrumbs = [{Name: "Home", Link: "/"}];
                switch (payload) {
                    case "/home":
                        break;
                    case "/categories":
                        state.Breadcrumbs.push({Name: "Categories", Link: "/categories"});
                        break;
                    default:
                        let stringArray = payload.split("/");
                        if (stringArray.length > 2) {
                            state.Breadcrumbs.push({ Name: "Categories", Link: "/" + stringArray[1] });
                            //add next level(s)
                            for (let i = 2; i < stringArray.length; i++) {
                                const item = stringArray[i];
                                let c = state.Categories.firstOrDefault(function(x) { return x.Link === item });
                                if (c !== null)
                                    state.Breadcrumbs.push({Name: c.Name, Link: "/" + stringArray[1] + "/" + stringArray[2] });
                                else {
                                    let a = state.Articles.firstOrDefault(function(x) { return x.Link === item });
                                    if (a !== null)
                                        state.Breadcrumbs.push({ Name: a.Title, Link: "/" + stringArray[1] + "/" + stringArray[2] + "/" + item });
                                    else
                                        state.Breadcrumbs.push({ Name: item, Link: payload });
                                }
                            }
                        }
                        break;
                }
            }
        },
        actions: {}
    });

    Vue.filter("toDateString", function (value) {
        if (value) {
            return new Date(value).toDateString();
        }
    });

    Vue.use(Http);
    Vue.config.productionTip = false;
    new Vue({
        data: function() {
            return {
                year: new Date().getFullYear()
            }
        },
        created: function() {
            let vm = this;
            this.$http.get("db/data.json").then(function(resp) {
                vm.$store.commit("UpdateState", resp.data);
            });
        },
        router: router,
        store: store,
        //render: function (h) { return h(MyApp); }
    }).$mount("#app");
}(Vue, VueRouter, Vuex, axios, markdownit));