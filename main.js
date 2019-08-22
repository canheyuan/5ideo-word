// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'//引入store

//引用通用的js和css
import '@/assets/js/conversion.750.js' // global css
import '@/assets/css/reset.css' // global css



//与APP之间交互的一个插件
import shell from '@/assets/js/shell'
Vue.prototype.$shell = shell.Shell;

//自己封装的一些通用插件
import http from '@/utils/request'
Vue.prototype.$http = http;


/* eslint-disable no-new */
var vm = new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})


export default vm;
