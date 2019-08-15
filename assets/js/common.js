import Vue from 'vue'
import axios from 'axios'

let config = {
  apiUrl : '/api',   //接口地址前缀
  lang : 'zh',  //当前语言版本
  source:'H5',  //使用来源（app,H5）
  headerData:{
    '5idea-sid':'00024dda1a190db8984b616250a2b2e3', //用户请求sid
    'accept-language':'',   //设备语言
    'app-type':'',    //app类型 e.g. IOS, ANDROID
    'app-version':'', //app版本
    'device-type':'', //设备型号
    'device-id':'', //设备id
    'lan':'', //语言
  }
 
}

function axiosFn(option){
  let opt = option ? option : null;
  var headerData = config.headerData;
  let opt_default = {
      isLoading       : true,  //是否加载loading
      isCloseLoading  : true,  //是否关闭Loading
      loadTitle       : '数据加载中',
      url             : '', //前缀不用写
      method          : 'get',  //接口类型
      headerData      : {},
      data            : {}, //data参数
      params          : {}, //params参数
      dataType        : 'json',   //数据返回类型
      success         : null,  //成功回调函数
      error           : null,     //失败回调函数
      complete        : null   //调用接口完回调函数
  };
  opt = opt ? Object.assign(opt_default, opt) : opt_default;
  headerData = headerData ? Object.assign(opt.headerData, headerData) : opt.headerData; //合并header参数

  axios({
      method  : opt.method,
      url     : config.apiUrl + opt.url,
      headers : headerData,
      data    : opt.data,
      params  : opt.params
  }).then((res)=>{
    console.log('res',res);
      if(res.data.code==0){
        opt.success && opt.success(res.data);
      }
  }).catch((res)=>{
    opt.error && opt.error(res);
  })
}


//输出
export default {
  config,
  axiosFn
}

