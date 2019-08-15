// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

//引用通用的js和css
import '@/assets/js/conversion.750.js' // global css
import '@/assets/css/reset.css' // global css

//自己封装的一些通用插件
import global from '@/assets/js/common'
Vue.prototype.$common = global;

//与APP之间交互的一个插件
// import shell from '@/assets/js/shell'
// Vue.prototype.$shell = shell;



/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
