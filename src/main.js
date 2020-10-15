import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";

Vue.config.productionTip = false;

import { post, get } from "@/plugins/axios";

Vue.prototype.$post = post;
Vue.prototype.$get = get;
new Vue({ vuetify, router, store, render: h => h(App) }).$mount("#app");
