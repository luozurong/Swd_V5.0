import http from './config'
import store from '../store/index'
var commonHeader = store.state.header;
var userId = store.state.userInfo.userId;
var body = {
  "clinicId": "90000",
  "roleType": "1",
  "roleId": userId,
};
// 测试服
var netUrl = 'https://nfys-test.kinglian.cn:8443/'; //.net 测试接口
// var netUrl = 'https://yun.kinglian.net'; //.net 正式接口

// var javaUrl = 'https://nfys.kinglian.cn'; //java接口
 var javaUrl = 'https://nfys-test.kinglian.cn'; //java测试服接口

//登录接口
export var postUserLogin = function (params) {
  params.header = commonHeader;
  var url = netUrl + '/ehealth.portalapi/api/User/UserLogin';
  return http.post(url, params)
}

//获取用户账号信息
export var getUserAccountInfo = function (params) {
  params.header = commonHeader;
  var url = javaUrl + '/appService/accountInfo/getUserAccountInfo';
  return http.post(url, params)
}

// 获取健康报告列表
export var getHealthReportList = function (params) {
  params.header = commonHeader;
  var url = javaUrl + '/appService/healthData/getHealthReportList';
  return http.post(url, params)
}

// 获取健康报告详情
export var getEvaluationReportDetail = function (params) {
  params.header = commonHeader;
  var url = javaUrl + '/appService/healthData/getEvaluationReportDetail';
  return http.post(url, params)
}

// 公益活动*获取活动列表【慢阻肺】
export var getActivitesList = function (params) {
  params.header = commonHeader;
  params.header.token = 'kinglian';
  var url = javaUrl + '/swd.portalApi/api/Activity/GetActivitesList';
  return http.post(url, params)
}

// 公益活动*活动报名
export var signUpActivity = function (params, type) {
  params.header = commonHeader;
  params.header.token = 'kinglian';
  var url = javaUrl + '/swd.portalApi/api/Activity/SignUpActivity';
  return http.post(url, params)
}

//获取社区信息
export var postGetVillages = function (params) {
  params.header = commonHeader;
  var url = 'https://www.kinglian.cn:18090' + '/connector/village/getVillages';
  return http.post(url, params)
}

// 公益活动*获取报名详情列表
export var getActivityRegList = function (params) {
  params.header = commonHeader;
  params.header.token = 'kinglian';
  var url = javaUrl + '/swd.portalApi/API/Activity/GetActivityRegList';
  return http.post(url, params)
}

// 公益活动*获取检查报告详情【慢阻肺】
export var getActivityReport = function (params) {
  params.header = commonHeader;
  params.header.token = 'kinglian';
  var url = javaUrl + '/swd.portalApi/api/Activity/GetActivityReport';
  return http.post(url, params)
}

//获取频道列表
export var getCategoryList = function (params) {
  params.header = commonHeader;
  var url = javaUrl + '/news/infoCategory/getCategoryList';
  return http.post(url, params)
}

//获取频道内容
export var getCategoryContent = function (params) {
  params.header = commonHeader;
  var url = javaUrl + '/news/infoCategory/getDataPage';
  return http.post(url, params)
}

//通过标题查询
export var searchByTitle = function (params) {
  params.header = commonHeader;
  var url = javaUrl + '/news/infoCategory/getSearchPage';
  return http.post(url, params)
}

//查询文章详情
export var getArticle = function (params) {
  params.header = commonHeader;
  var url = javaUrl + '/news/infoDetail/getArticle';
  return http.post(url, params)
}

//查询相关阅读
export var getRelationArticle = function (params) {
  params.header = commonHeader;
  var url = javaUrl + '/news/infoDetail/getRelationArticle';
  return http.post(url, params)
}

// //增加阅读量
// export var updateView = function (params) {
//     params.header = commonHeader;
//     var url = javaUrl+'/news/infoDetail/updateView';
//     return http.post(url, params)
// }

//点赞或者取消点赞
export var giveAlikeOrCancel = function (params) {
  params.header = commonHeader;
  // var url = javaUrl +'/news/infoCategory/getCategoryList';
  var url = javaUrl + '/news/infoDetail/updateNumber';
  return http.post(url, params)
}
// 获取趣味自测首页列表
export var getHaqList = function (params, token) {
  params.header = commonHeader;
  if (token) {
    params.header.token = token;
  }
  var url = javaUrl + '/haq/getList';
  return http.post(url, params)
}

// 获取趣味自测题目详情
export var getInterestDetail = function (params, token) {
  params.header = commonHeader;
  if (token) {
    params.header.token = token;
  }
  var url = javaUrl + '/haq/getSubject';
  return http.post(url, params)
}

// 提交趣味自测
export var submitResult = function (params, token) {
  params.header = commonHeader;
  if (token) {
    params.header.token = token;
  }
  var url = javaUrl + '/haq/submitResult';
  return http.post(url, params)
}

//获取自测结果
export var getInterestResult = function (params, token) {
  params.header = commonHeader;
  if (token) {
    params.header.token = token;
  }
  var url = javaUrl + '/haq/getResult';
  return http.post(url, params)
}

//获取自测历史结果列表
export var getHistoryList = function (params, token) {
  params.header = commonHeader;
  if (token) {
    params.header.token = token;
  }
  var url = javaUrl + '/haq/getHistory';
  return http.post(url, params)
}

//删除自测历史结果
export var deleteInterestHistory = function (params, token) {
  params.header = commonHeader;
  if (token) {
    params.header.token = token;
  }
  var url = javaUrl + '/haq/delHistory';
  return http.post(url, params)
}

//获取订单状态
export var getVisitOrderState = function (params, orderId) {
  params.header = commonHeader;
  params.body = body;
  params.body.orderId = orderId;
  var url = javaUrl + '/appService/inquiryOrder/getInquiryOrderDetails';
  return http.post(url, params)
}

//获取病人信息
export var getVisitPatient = function (params,orderId) {
  params.header = commonHeader;
  params.body = body;
  params.body.orderId = orderId;
  var url = javaUrl + '/appService/inquiryOrder/visitPatientDetail';
  return http.post(url, params)
}

//医生评价
export var evaluateDoctor = function (params) {
  params.header = commonHeader;
  var url = javaUrl +'/appService/officeVisitEvaluate/evaluateDoctor';
  return http.post(url, params)
}


//上传图片
export var chatImgUpload = function (params) {
  params.header = commonHeader;
  var url = javaUrl +'/oss/oss/upload';
  return http.post(url, params, { headers: { "Content-Type":'multipart/form-data','processData':false } })
}


// 获取验证码
export var sendMesForReg = function (params) {
  params.header = commonHeader;
  var url = javaUrl + '/appService/app/sendMesForReg';
  return http.post(url, params)

}

//查询验证码是否失效
export var queryOverdue = function (params) {
  params.header = commonHeader;
  var url = javaUrl + '/appService/userFamilyRelationship/qrCodeIsLose';
  return http.post(url, params)
}


//商城首页商品列表
export var classiCommodityList = function (params) {
  params.header = commonHeader;
  //var url = javaUrl +'mall/appMall/classiCommodityList?size=' + params.size +"&current=" + params.current+"&id=" + params.id;
  var url = javaUrl + '/mall/appMall/classiCommodityList';
  return http.post(url, params)
}

//商城首页商品分类
export var homeClassification = function (params) {
  params.header = commonHeader;
  ///var url = javaUrl +'mall/appMall/homeClassification';
  var url = javaUrl + '/mall/appMall/homeClassification';
  return http.post(url, params)
}
//不同栏目的商品
export var getColumnCommodity = function (params) {
  params.header = commonHeader;
  ///var url = javaUrl +'mall/appMall/homeClassification';
  var url = javaUrl + '/mall/appMall/getColumnCommodity';
  return http.post(url, params)
}

//购物车数量
export var getShopCarNum = function (params) {
  params.header = commonHeader;
  //var url = javaUrl +'mall/appMall/getShopCarNum?userId=' + params.userId;
  var url = javaUrl + '/mall/appMall/getShopCarNum';
  return http.post(url, params)
}

//添加商品到购物车
export var saveComToCar = function (params) {
  params.header = commonHeader;
  var url = javaUrl + '/mall/appMall/saveComToCar'
  return http.post(url, params)
}

//全选购物车商品
export var chooseAll = function (params) {
  params.header = commonHeader;
  //var url = javaUrl +'mall/appMall/chooseAll?ids=' + params.ids + '&isSelect=' + params.isSelect;
  var url = javaUrl + '/mall/appMall/chooseAll';
  return http.post(url, params)
}

//商品详情
export var commodityDetil = function (params) {
  params.header = commonHeader;
  //console.log(params);
  //var url = javaUrl +'mall/appMall/commodityDetil?id='+ params.id + '&columnId='+ params.columnId;
  var url = javaUrl + '/mall/appMall/commodityDetil';
  return http.post(url, params)
}

//获取需求清单数量requirementList/saveRequirementCom
export var getRequirementListNum = function (params) {
  params.header = commonHeader;
  var url = javaUrl + '/mall/requirementList/getRequirementListNum';
  return http.post(url, params)
}

//加入需求清单
export var saveRequirementCom = function (params) {
  params.header = commonHeader;
  var url = javaUrl + '/mall/requirementList/saveRequirementCom';
  return http.post(url, params)
}

//需求清单列表
export var getRequirementList = function (params) {
  params.header = commonHeader;
  var url = javaUrl + '/mall/requirementList/getRequirementList';
  return http.post(url, params)
}

//修改清单商品数量
export var changeRequirementNum = function (params) {
  params.header = commonHeader;
  var url = javaUrl + '/mall/requirementList/changeRequirementNum';
  return http.post(url, params)
}

//删除清单商品
export var delRequirement = function (params) {
  params.header = commonHeader;
  var url = javaUrl + '/mall/requirementList/delRequirement';
  return http.post(url, params)
}

//更改清单商品选中状态
export var requirementListChangeSelect = function (params) {
  params.header = commonHeader;
  var url = javaUrl + '/mall/requirementList/changeSelect';
  return http.post(url, params)
}

//购物车列表
export var getShopCarList = function (params) {
  params.header = commonHeader;
  //var url = javaUrl +'mall/appMall/getShopCarList?userId='+ params.userId + '&pageSize='+ params.pageSize+ '&pageNum='+ params.pageNum;
  var url = javaUrl + '/mall/appMall/getShopCarList';
  return http.post(url, params)
}

//获取购物车特推商品
export var recommendComList = function (params) {
  params.header = commonHeader;
  var url = javaUrl + '/mall/appMall/recommendComList';
  return http.post(url, params)
}

//修改购物车对应商品数量
export var changeCarNum = function (params) {
  params.header = commonHeader;
  //var url = javaUrl +'mall/appMall/changeCarNum?carComId='+ params.carComId + '&num='+ params.num;
  var url = javaUrl + '/mall/appMall/changeCarNum';
  return http.post(url, params)
}

//更改购物车商品选中状态
export var changeSelect = function (params) {
  params.header = commonHeader;
  //var url = javaUrl +'mall/appMall/changeSelect?carComId='+ params.carComId + '&flag='+ params.flag;
  var url = javaUrl + '/mall/appMall/changeSelect';
  return http.post(url, params)
}

//删除购物车商品
export var delShopCar = function (params) {
  params.header = commonHeader;
  //var url = javaUrl +'mall/appMall/delShopCar?id=' + params.id;
  var url = javaUrl + '/mall/appMall/delShopCar'
  return http.post(url, params)
}

//批量删除购物车商品
export var delBatchShopCar = function (params) {
  params.header = commonHeader;
  //var url = javaUrl +'mall/appMall/delShopCar?id=' + params.id;
  var url = javaUrl + '/mall/appMall/delBatchShopCar'
  return http.post(url, params)
}

//获取购物车失效商品
export var getUnEfficacyCommodity = function (params) {
  params.header = commonHeader;
  //var url = javaUrl +'mall/appMall/delShopCar?id=' + params.id;
  var url = javaUrl + '/mall/appMall/getUnEfficacyCommodity'
  return http.post(url, params)
}

//搜索商品
export var searchCommodity = function (params) {
  params.header = commonHeader;
  //var url = javaUrl +'mall/appMall/searchCommodity?name='+ params.name + '&size='+ params.size+ '&current='+ params.current;
  var url = javaUrl + '/mall/appMall/searchCommodity';
  return http.post(url, params)
}

//保存收获地址
export var addReciveSite = function (params) {
  params.header = commonHeader;
  var url = javaUrl + '/mall/appMall/addReciveSite';
  return http.post(url, params)
}

//获取地址列表
export var getAddressList = function (params) {
  params.header = commonHeader;
  // var url = javaUrl +'mall/appMall/getReciveSite?userId=' + params.id + '&pageSize=' + params.pageSize + '&pageNum=' + params.pageNum;
  var url = javaUrl + '/mall/appMall/getReciveSite';
  return http.post(url, params)
}

//获取地址详细信息
export var getAddressDetail = function (params) {
  params.header = commonHeader;
  var url = javaUrl + '/mall/appMall/getSiteDetail';
  return http.post(url, params)
}

//修改收获地址
export var updateAddress = function (params) {
  params.header = commonHeader;
  var url = javaUrl + '/mall/appMall/updateSite';
  return http.post(url, params)
}


//删除地址
export var deleteAddress = function (params) {
  params.header = commonHeader;
  var url = javaUrl + '/mall/appMall/delSite';
  return http.post(url, params)
}

//预下单
export var perOrder = function (params) {
  params.header = commonHeader;
  var url = javaUrl + '/mall/appMall/perOrder';
  return http.post(url, params)
}

//提交订单
export var placeOrder = function (params) {
  params.header = commonHeader;
  var url = javaUrl + '/mall/appMall/placeOrder';
  return http.post(url, params)
}

//提交凭方开药问诊订单
export var placeVisitOrder = function (params) {
  params.header = commonHeader;
  var url = javaUrl + '/mall/appMall/placeVisitOrder';
  return http.post(url, params)
}

//商品id转药品id
export var queryRxDrugs = function (params) {
  params.header = commonHeader;
  var url = javaUrl + '/appService/drug/queryRxDrugs';
  return http.post(url, params)
}


//同步处方信息到医保统筹
export var synMedInsPresciption = function (params) {
  params.header = commonHeader;
  var url = javaUrl + '/appService/prescription/synMedInsPresciption';
  return http.post(url, params)
}

//订单详情
export var getOrderDetail = function (params) {
  params.header = commonHeader;
  var url = javaUrl + '/mall/order/getOrderDetail';
  return http.post(url, params)
}

//获取健康分享
export var getHealthMeasure = function (params) {
  var url = javaUrl + '/appService/deviceMeasuredData/getHealthMeasureData';
  return http.post(url, params)
}

//好友绑定
export var submitPhone = function (params) {
  var url = javaUrl + '/appService/userFamilyRelationship/bindRelation';
  return http.post(url, params)
}

//获取医生名片
export var getNameCard = function (params) {
  var url = javaUrl + '/appService/employee/getEmployeeInfoById';
  return http.post(url, params)
  }
  
//获取处方笺
export var getPrescriptionSign = function (params) {
  var url = javaUrl + '/appService/prescription/getPrescriptionSign';
  return http.post(url, params)
}

//获取用户相关信息及xmpp相关
export var getAccountInfoByOrderId = function (params) {
  var url = javaUrl + '/appService/accountInfo/getAccountInfoByOrderId';
  return http.post(url, params)
}

//通过药品id获取商品id
export var getCommodityIds = function (params) {
  var url = javaUrl + '/appService/appCommodity/getCommodityIds';
  return http.post(url, params)
}

//获取血压测量数据
export var getBpData = function (params) {
  var url = javaUrl + '/appService/healthData/getBpData';
  return http.post(url, params)
}

//获取血糖测量数据
export var getBgData = function (params) {
  var url = javaUrl + '/appService/healthData/getBgData';
  return http.post(url, params)
}

//保存亲友管理（保存就诊人）
export var savePatientInfo = function (params) {
  var url = javaUrl + '/appService/patient/savePatientInfo';
  return http.post(url, params)
}

//获取病历详情
export var getMedicalDetailByOrderId = function (params) {
  var url = javaUrl + '/appService/prescription/getMedicalDetailByOrderId';
  return http.post(url, params)
}

//保存聊天信息
export var saveMsg = function (params) {
  var url = javaUrl + '/appService/msgoffline/saveMsg';
  return http.post(url, params)
}

//获取聊天信息
export var queryMsgByOrderId = function (params) {
  var url = javaUrl + '/appService/msgoffline/queryMsgByOrderId';
  return http.post(url, params)
}


//微信支付
export var payForWeb = function (params) {
  params.header = commonHeader;
  //http://192.168.52.77:2033
  var url = 'https://nfys-test.kinglian.cn' +'/pay/mallPay/payForWeb';
  return http.post(url, params)
}


