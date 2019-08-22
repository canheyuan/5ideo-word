import axios from 'axios' //导入axios读取接口

//读取数据接口
var http = (option,vue) => {
  
  let opt = option ? option : null;
  var headerData = vue.$store.state.headerData
  let opt_default = {
    isLoading: true,  //是否加载loading
    isCloseLoading: true,  //是否关闭Loading
    loadTitle: '数据加载中',
    url: '', //前缀不用写
    method: 'get',  //接口类型
    headerData: {},
    data: {}, //data参数
    params: {}, //params参数
    dataType: 'json',   //数据返回类型
    success: null,  //成功回调函数
    error: null,     //失败回调函数
    complete: null   //调用接口完回调函数
  };
  opt = opt ? Object.assign(opt_default, opt) : opt_default;
  headerData = headerData ? Object.assign(opt.headerData, headerData) : opt.headerData; //合并header参数
  //alert('加载axios'+JSON.stringify(headerData))
  axios({
    method: opt.method,
    url: vue.$store.state.apiUrl + opt.url,
    headers: headerData,
    data: opt.data,
    params: opt.params
  }).then((res) => {
    //alert('成功code:'+res.data.code)
    if (res.data.code == 0) {
      opt.success && opt.success(res.data);
    }
  }).catch((res) => {
    //alert('失败啊啊:'+res)
    opt.error && opt.error(res);
  })
}


//输出
export default http

