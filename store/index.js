import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

import langData from '@/assets/data/lang.js' //加载语言包

const state={//要设置的全局访问的state对象
    apiUrl: '/api',   //接口地址前缀
    source: 'app',  //使用来源（app,h5）,默认没传h5
    lan:'zh',
    sid:'',
    headerData: {   //app加载的头部信息
        //'5idea-sid': 'aab99cac85776427bcb467990a75f149', //用户请求sid
        '5idea-sid': '', //用户请求sid
        'accept-language': '',   //设备语言
        'app-type': '',    //app类型 e.g. IOS, ANDROID
        'app-version': '', //app版本
        'device-type': '', //设备型号
        'device-id': '', //设备id
        'lan': '', //语言
    },
    subjectTypeActData: '', //当前题目类目数据存储，供词卡结果页获取
    langData:langData
};

const getters = {   //实时监听state值的变化(最新状态)
    sidChange(state) { return state.sid },  //sid
    headerData(state) {  return state.headerData },
    lanChange(state) {  return state.lan },
    sourchChange(state) {  return state.source },
    subjectTypeActData(state) {  return state.subjectTypeActData },   
};

const mutations = {
    sidChange(state,sid) {   
        state.sid = sid;
    },
    changeHeader(state,headerData) {  
        state.headerData = headerData;
    },
    lanChange(state,lan) {  
        state.lan = lan;
    },
    sourceChange(state,source) {  
        state.source = source;
    },
    subjectTypeActData(state,data) {  
        state.subjectTypeActData = data;
    }
};

const store = new Vuex.Store({
    state,
    getters,
    mutations
});
 
export default store;