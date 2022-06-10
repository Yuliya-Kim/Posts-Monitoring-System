import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// import axios from 'axios'
import vuetify from './plugins/vuetify'
import apexChart from '@/plugins/apexCharts'

require('@/store/subscriber')

Vue.config.debug = true;Vue.config.devtools = true;
Vue.config.productionTip = false


if (localStorage.getItem('token')) {
  store.dispatch('auth/attempt', localStorage.getItem('token'))
}


new Vue({
  router,
  store,
  vuetify,
  apexChart,
  render: h => h(App)
}).$mount('#app')
