import Vue from 'vue'
import App from './App.vue'
import './plugins/element.js'
import router from './router'
import VueCodemirror from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
Vue.use(VueCodemirror)
Vue.config.productionTip = false
new Vue({
  render: h => h(App),
  router
}).$mount('#app')
