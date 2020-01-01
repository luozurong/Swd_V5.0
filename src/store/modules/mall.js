import {getCookie,GetURLParameter} from '../../assets/js/common.js'

export default {
  state: {
    testFlag: false,
    userId:  sessionStorage.userId || '',
    token: sessionStorage.token || '',
    addressInfo:(()=> {
      let addressInfo = localStorage.addressInfo || {};
      return Object.getOwnPropertyNames(addressInfo).length > 0 ? JSON.parse(localStorage.addressInfo) : {};
    })(),
    commit: []
  },
  getters: {},  
  mutations: {
    testFlag(state,bool){
      state.testFlag = bool;
    },
    userId(state,data){
      sessionStorage.setItem("userId",data)
      state.userId = data;
    },
    token(state,data){
      state.token = data;
      sessionStorage.setItem("token",data)
    },
    
    updataAddressData(state, data) { // 选中地址
      state.addressInfo = data;
    },
    commit(state, data) { // 订单需要的数据
      state.commit = data;
    }
  },
  actions: {}
};