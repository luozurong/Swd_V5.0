import http from './config'
// 测试服
//var netUrl = 'https://yun.kinglian.cn:8443/'; //.net接口
//var javaUrl = 'https://www.kinglian.cn:18090/'; //java接口
var javaUrl = 'https://nfys.kinglian.cn/'; //本地接口


//获取用户收货地址信息
export var getDeliveryInfo =  function(params){
  var url = javaUrl +'mall/zh/getDeliveryInfo';
  return http.post(url, params)
}

//获取用户收货地址信息
export var saveDeliveryInfo =  function(params){
  var url = javaUrl +'mall/zh/saveDeliveryInfo';
  return http.post(url, params)
}

//获取用户收货地址信息
export var newOrder =  function(params){
  var url = javaUrl +'mall/zh/newOrder';
  return http.post(url, params)
}
