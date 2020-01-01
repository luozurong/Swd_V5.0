import '../../../static/js/RainbowBridge'

//token失效等
const jumpLoginPage = function(msg){
  JsBridge.callMethod(
    "JsInvokeNativeMethod",
    "jumpLoginPage",
    { message: msg},
      function(data) {
      }
  );
}

//游客模式，登录后返回上一页面(userId)
const jumpLoginPageWithCallback = function(backCall){
  JsBridge.callMethod(
    "JsInvokeNativeMethod",
    "jumpLoginPageWithCallback",
    { message: '登录'},
      function(data) {
        backCall(data);
      }
  );
}

//判断是否登录
const isLogin = function(backCall){
  JsBridge.callMethod(
    "JsInvokeNativeMethod",
    "isLogin",
    { message: '判断登录'},
      function(data) {
        backCall();
      }
  );
}

//吐司
const showToast = function(msg){
    JsBridge.callMethod(
      "JsInvokeNativeMethod",
      "showToast",
      { message: "提示",toast: msg},
        function(data) {
          
        }
    );
}

//分享
const shareMsg = function(obj,backCall){
  JsBridge.callMethod(
    "JsInvokeNativeMethod",
    "shareMsg",
    { message: obj.message, 
      shareType: obj.shareType,
      msgType: obj.msgType,
      title: obj.title,
      imageUrl:obj.imageUrl,
      webPageUrl:obj.webPageUrl,
      desc: obj.desc,
      path: obj.path,
      function(data) {
        JsBridge.callMethod(
          "JsInvokeNativeMethod",
          "showToast",
          { message:'消息提示'},
          function(data) {
              backCall()
          }
        );
      }
    }
  );
}

//关闭页面
const finishPage = function(backCall){
  JsBridge.callMethod(
    "JsInvokeNativeMethod",
    "finishPage",
    { message: "提示"},
    function(data) {
      backCall();
    }
  );
}

//获取用户信息
const getUserInfo = function(backCall){
  JsBridge.callMethod(
    "JsInvokeNativeMethod",
    "getUserInfo",
    { message: "获取用户信息"},
    function(data) {
      backCall();
    }
  );
}

//跳转支付页面
const payment = function(ordreId,backCall){
  JsBridge.callMethod(
    "JsInvokeNativeMethod",
    "payment",
    { message: "获取用户信息",ordreId: ordreId},
    function(data) {
      backCall();
    }
  );
}

export {
  jumpLoginPage,
  jumpLoginPageWithCallback,
  isLogin,
  showToast,
  shareMsg,
  finishPage,
  getUserInfo,
  payment
}

