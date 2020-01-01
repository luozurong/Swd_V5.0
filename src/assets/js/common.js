import store from '../../store/index'
import router from '../../router/index'
export const GetURLParameter = function(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
}

export const setCookie = function(name, value, Days){
  if(Days <= 0) Days = 7;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days*24*60*60*1000);
    document.cookie = name + "="+ encodeURI (value) + ";expires=" + exp.toGMTString()+";path=/";
}
export const getCookie  = function (name){
  var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg)){
        return decodeURI(arr[2]);
    }else{
        return null;
    }
}

export const mallInfo = function(){
  let url = window.location.href;
  if(url.indexOf('source') != -1 || url.indexOf('userId') != -1){
    let userId = router.history.current.query.userId;
    let token = router.history.current.query.token;
    if(userId && token){
      var userInfo = [token, userId];
      store.commit("userId", userId);
      store.commit("token", token);
      store.commit("setLoginData", userInfo); 
    } else if(url.indexOf('source')){
      
    }else{
      var userInfo = ['', ''];
      store.commit("userId", '');
      store.commit("token", '');
      store.commit("setLoginData", userInfo); 
    }
  }
}