// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import 'font-awesome/css/font-awesome.css'
import Axios from 'axios'

Vue.use(Antd)
Vue.prototype.$axios = Axios;
Vue.prototype.API = process.env.NODE_ENV === 'production' ? '' : '/api';
Vue.config.productionTip = false


window.WS = null;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {App},
  template: '<App/>'
})
