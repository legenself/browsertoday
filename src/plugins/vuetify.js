import Vue from "vue";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";
import "@fortawesome/fontawesome-free/css/all.css";

Vue.use(Vuetify);

const opts = {
  icons: {
    iconfont: "fa"
  },
  lang: {
    current: "zhHans"
  }
};

export default new Vuetify(opts);
