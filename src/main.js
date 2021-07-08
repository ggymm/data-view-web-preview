import Vue from 'vue'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'
import '@/permission'

import IconSvg from '@/components/IconSvg'
import antd from 'ant-design-vue'
import bus from '@/utils/bus'

import '@/styles/animate.css'
import '@/styles/global.less'

Vue.component('icon', IconSvg)

Vue.use(antd)

Vue.prototype.$bus = bus

Vue.config.productionTip = false

window.Vue = Vue

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
