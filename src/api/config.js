import axios from 'axios'
import qs from 'qs'
import store from '../store/index'
import router from '../router/index'

// window.addEventListener('online',  function(){
//   alert("onLine");
// });
// window.addEventListener('offline', function(){
//   alert("网络连接错误，请检查网络设置");
// });

axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';

// http request 拦截器
axios.interceptors.request.use((config) => {
    // 有 token就带上
    let token = localStorage.getItem('authorization');
    if (token) {
        config.headers.Authorization = "Bearer " + token;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// http response 拦截器
var that = this;
axios.interceptors.response.use(
    response => {
        //服务请求超时
        if (response.status != 200) {
            // this.$global.showToast('服务请求超时，请先检查网络')
            //使用组件弹出框
        }
        return response;
    },
    error => {
        //跳转登录页（token失效 | 游客模式后请求登录 | 普通登录）
        if (error == 'Error: Request failed with status code 401') {
            if (store.state.header.token == 'guest') {    //游客
                JsBridge.callMethod("JsInvokeNativeMethod", "jumpLoginPageWithCallback", function (data) {
                    var tempArr = [data.token, data.userId]
                    store.commit("setLoginData", tempArr); //store 保存参数header.token, userInfo.userId
                });
            } else {
                JsBridge.callMethod("JsInvokeNativeMethod", "jumpLoginPage", function (data) {
                    // console.log("调用普通用户登录");
                });
            }
        }
        // 503 报错
        if(error == 'Error: Network Error'){
            alert("网络连接错误，请检查网络设置");
        }
        //或者网络中断
        // this.$global.showToast('服务请求超时，请先检查网络')
        return Promise.reject(error.response.data)   // 返回接口返回的错误信息
    });

export default axios;
