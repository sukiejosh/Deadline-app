import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './registerServiceWorker'
import axios from "axios";
//import VueCountdown from '@chenfengyuan/vue-countdown';
import vuetify from './plugins/vuetify';


Vue.config.productionTip = false
const base = axios.create({
  baseURL: "http://10.42.0.1:4000",
  //timeout:50000
});

//Vue.component(VueCountdown.name, VueCountdown);

Vue.prototype.$http = base;

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
