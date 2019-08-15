import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router);

import wordIndex from '@/views/word-index';
import topicResult from '@/views/topic-result';
import topicIndex from '@/views/word-topic';



var routers = new Router({
  //mode:'history',
  base:'',
  routes: [
    {
      path: '/wordIndex',
      name: 'wordIndex',
      component: wordIndex,
      meta: {
        title: '词卡首页'
      },
    },
    {
      path: '/topicIndex/:listId',
      name: 'topicIndex',
      component: topicIndex,
      meta: {
        title: '趣味词卡练习'
      }
    },
    {
      path: '/topicResult',
      name: 'topicResult',
      component: topicResult,
      meta: {
        title: '成绩单'
      },
    },
    {
      path: '/',
      name: 'wordIndex',
      component: wordIndex,
      meta: {
        title: '词卡首页'
      },
    }
  ]
})

//全局钩子函数，改变页面title
routers.beforeEach((to,from,next)=>{
  //console.log('to',to)
  var title = '词卡';
  if(to.meta && to.meta.title){
    title = to.meta.title;
  }else if(to.matched.length>0 && [0].meta && to.matched[0].meta.title){
    title = to.matched[0].meta.title
  }
  document.title = title;
  next();
});

export default routers;
