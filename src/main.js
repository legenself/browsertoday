import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";

import VueTour from 'vue-tour'

require('vue-tour/dist/vue-tour.css')

Vue.use(VueTour)


Vue.config.productionTip = false; 
 
new Vue({ vuetify, router, store, render: h => h(App) }).$mount("#app");
