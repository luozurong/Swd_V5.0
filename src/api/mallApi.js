import http from './config'
import store from '../store/index'
//var commonHeader = store.state.header;
// 测试服
//var netUrl = 'https://yun.kinglian.cn:8443/'; //.net接口
//var javaUrl = 'https://www.kinglian.cn:18090/'; //java接口
//var javaUrl = 'http://192.168.52.73:2032/'; //huanxc本地接口
//var javaUrl = 'https://nfys-test.kinglian.cn/'; //测试平台


//商城首页商品列表
export var classiCommodityList =  function(params){
  //params.header = commonHeader;
  //var url = javaUrl +'mall/appMall/classiCommodityList?size=' + params.size +"&current=" + params.current+"&id=" + params.id;
  var url = javaUrl +'mall/appMall/classiCommodityList';
  return http.post(url, params)
}

//商城首页商品分类
export var homeClassification =  function(params){
  //params.header = commonHeader;
  ///var url = javaUrl +'mall/appMall/homeClassification';
  var url = javaUrl +'mall/appMall/homeClassification';
  return http.post(url, params)
}
//不同栏目的商品
export var getColumnCommodity =  function(params){
  //params.header = commonHeader;
  ///var url = javaUrl +'mall/appMall/homeClassification';
  var url = javaUrl +'mall/appMall/getColumnCommodity';
  return http.post(url, params)
}

//购物车数量
export var getShopCarNum =  function(params){
  //params.header = commonHeader;
  //var url = javaUrl +'mall/appMall/getShopCarNum?userId=' + params.userId;
  var url = javaUrl +'mall/appMall/getShopCarNum';
  return http.post(url, params)
}

//添加商品到购物车
export var saveComToCar =  function(params){
  //params.header = commonHeader;
  var url = javaUrl +'mall/appMall/saveComToCar'
  return http.post(url, params)
}

//全选购物车商品
export var chooseAll =  function(params){
  //params.header = commonHeader;
  //var url = javaUrl +'mall/appMall/chooseAll?ids=' + params.ids + '&isSelect=' + params.isSelect;
  var url = javaUrl +'mall/appMall/chooseAll';
  return http.post(url, params)
}

//商品详情
export var commodityDetil =  function(params){
  //params.header = commonHeader;
  //console.log(params);
  //var url = javaUrl +'mall/appMall/commodityDetil?id='+ params.id + '&columnId='+ params.columnId;
  var url = javaUrl +'mall/appMall/commodityDetil';
  return http.post(url, params)
}

//购物车列表
export var getShopCarList =  function(params){
  //params.header = commonHeader;
  //var url = javaUrl +'mall/appMall/getShopCarList?userId='+ params.userId + '&pageSize='+ params.pageSize+ '&pageNum='+ params.pageNum;
  var url = javaUrl +'mall/appMall/getShopCarList';
  return http.post(url, params)
}

//修改购物车对应商品数量
export var changeCarNum =  function(params){
  //params.header = commonHeader;
  //var url = javaUrl +'mall/appMall/changeCarNum?carComId='+ params.carComId + '&num='+ params.num;
  var url = javaUrl +'mall/appMall/changeCarNum';
  return http.post(url, params)
}

//更改购物车商品选中状态
export var changeSelect =  function(params){
  //params.header = commonHeader;
  //var url = javaUrl +'mall/appMall/changeSelect?carComId='+ params.carComId + '&flag='+ params.flag;
  var url = javaUrl +'mall/appMall/changeSelect';
  return http.post(url, params)
}

//删除购物车商品
export var delShopCar =  function(params){
  //params.header = commonHeader; 
  //var url = javaUrl +'mall/appMall/delShopCar?id=' + params.id;
  var url = javaUrl +'mall/appMall/delShopCar'
  return http.post(url, params)
}

//搜索商品
export var searchCommodity =  function(params){
  //params.header = commonHeader;
  //var url = javaUrl +'mall/appMall/searchCommodity?name='+ params.name + '&size='+ params.size+ '&current='+ params.current;
  var url = javaUrl +'mall/appMall/searchCommodity';
  return http.post(url, params)
}

//保存收获地址
export var addReciveSite =  function(params){
  params.header = commonHeader;
  var url = javaUrl +'mall/appMall/addReciveSite';
  return http.post(url, params)
}

//获取地址列表
export var getAddressList =  function(params){
  //params.header = commonHeader;
  // var url = javaUrl +'mall/appMall/getReciveSite?userId=' + params.id + '&pageSize=' + params.pageSize + '&pageNum=' + params.pageNum;
  var url = javaUrl +'mall/appMall/getReciveSite';
  return http.post(url,params)
}

//获取地址详细信息
export var getAddressDetail =  function(params){
  // params.header = commonHeader;
  var url = javaUrl +'mall/appMall/getSiteDetail';
  return http.post(url,params)
}

//修改收获地址
export var updateAddress =  function(params){
  // params.header = commonHeader;
  var url = javaUrl +'mall/appMall/updateSite';
  return http.post(url, params)
}


//删除地址
export var deleteAddress =  function(params){
  // params.header = commonHeader;
  var url = javaUrl +'mall/appMall/delSite';
  return http.post(url,params)
}

//预下单
export var perOrder =  function(params){
  //params.header = commonHeader;
  var url = javaUrl +'mall/appMall/perOrder';
  return http.post(url,params)
}

//提交订单
export var placeOrder =  function(params){
  //params.header = commonHeader;
  var url = javaUrl +'mall/appMall/placeOrder';
  return http.post(url,params)
}
//获取健康分享
export var getHealthMeasure =  function(params){
  var url = javaUrl +'appService/deviceMeasuredData/getHealthMeasureData';
  return http.post(url, params)
}