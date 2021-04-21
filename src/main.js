import Vue from "vue";
import App from "./App.vue";
import "./plugins/element.js";
import router from "./router";
import axios from "axios";
import * as echarts from 'echarts'
axios.defaults.baseURL = "/api";
axios.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";

Vue.prototype.axios = axios;
Vue.config.productionTip = false;
Vue.use(echarts)

new Vue({
  render: (h) => h(App),
  router,
}).$mount("#app");
