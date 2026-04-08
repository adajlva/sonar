import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import i18n from './plugins/i18n'
import '@/icons'

import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'
import 'bootstrap/scss/bootstrap.scss'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import VueMask from 'v-mask'
import VueTelInput from 'vue-tel-input'
import 'vue-tel-input/dist/vue-tel-input.css'

import Vuelidate from 'vuelidate'
import AsyncComputed from 'vue-async-computed'
import infiniteScroll from 'vue-infinite-scroll'

import Multiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.min.css'

import { abilitiesPlugin } from '@casl/vue'
import { defineAbilities } from './config/ability'

import Autocomplete from '@trevoreyre/autocomplete-vue'
import '@trevoreyre/autocomplete-vue/dist/style.css'
import '@/styles/index.scss'

Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)
Vue.component('multiselect', Multiselect)
Vue.use(ElementUI)
Vue.use(VueMask)
Vue.use(VueTelInput)
Vue.use(Vuelidate)
Vue.use(AsyncComputed)
Vue.use(infiniteScroll)
Vue.use(abilitiesPlugin, defineAbilities())
Vue.use(Autocomplete)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
