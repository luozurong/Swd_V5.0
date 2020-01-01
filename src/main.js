// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueRouter from 'vue-router'
import '../static/css/common.css'
import "babel-polyfill"

import { Divider } from 'vant';
import { List } from 'vant';
import { PullRefresh } from 'vant';
import { Search } from "vant";
import { ImagePreview } from "vant";
import { Toast } from "vant";
import { Button, NavBar, Field, Cell, CellGroup, RadioGroup, Radio,  SwipeCell ,NoticeBar, Loading, Tab, Tabs, ActionSheet, Uploader, DatetimePicker, Popup } from 'vant';


Vue.use(PullRefresh);//下拉刷新
Vue.use(Button);  //按钮
Vue.use(NavBar);  //头部导航
Vue.use(Divider);  //分割线
Vue.use(List);  //列表
Vue.use(Search);  //搜索
Vue.use(NoticeBar);  //通知栏
Vue.use(ImagePreview );  //图片预览

Vue.use(Field);  //表单中的输入框组件
Vue.use(Cell).use(CellGroup);   //Cell 单元格
Vue.use(Radio).use(RadioGroup);   //Radio 单选选框
Vue.use(Toast); //提示
Vue.use(SwipeCell);   //滑动单元格
Vue.use(Loading) //加载
Vue.use(Tab).use(Tabs)  // 
Vue.use(ActionSheet);   //弹框
Vue.use(Uploader);    //文件上传
Vue.use(DatetimePicker);  // 添加时间选择
Vue.use(Popup);   //弹起层

// import  VConsole  from  'vconsole'
// const  vConsole = new VConsole() ;

//状态管理
// 引入vuex
import Vuex from 'vuex'
Vue.use(Vuex)
import store from './store/index.js';

Vue.config.productionTip = false

// 引用API文件
import api from './api/index.js'
// 将API方法绑定到全局
Vue.prototype.$api = api

import global from "./views/global/global";
Vue.prototype.$global = global ;

Vue.prototype.$setgoindex = function () {
  if (window.history.length <= 1) {
    if (location.href.indexOf('?') === -1) {
      window.location.href = location.href + '?goindex=true'
    } else if (location.href.indexOf('?') !== -1 && location.href.indexOf('goindex') === -1) {
      window.location.href = location.href + '&goindex=true'
    }
  }
}

Vue.use(VueRouter)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
router.afterEach((to, from, next) => {
  window.scrollTo(0, 0)
})