<template>
  <div class="wrapper">
    <div class="tabar">
      <div class="back" @click="goBack()">
        <img src="../../assets/img/mall/back.png" alt="返回">
      </div>
      <div class="title">收货地址</div>
      <div style="height: 10px;width: 10px;"></div>
    </div>
    <div class="list" v-if="!noDataFlag">
      <van-list v-if="datalist.length > 0"
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
      <div class="addr clearfix" v-for="item in datalist" :key="item.id">
        <div class="info" @click="choose(item)">
          <div class="msg">
            <span class="name">{{item.receivingName}}</span>
            <span class="phone">&nbsp;{{item.phone}}</span>
          </div>
          <div class="location">
            <span class="default" v-show="item.isSelect === 0 ? false : true">默认</span>
            <span class="detail">{{item.provinceName+item.cityName+item.districtName+item.address}}</span>
          </div>
        </div>
        <div class="valid"></div>
        <div class="edit" @click="toEdit(item.id)">
          <van-icon name="edit" />
          编辑
        </div>
      </div>
      </van-list>
    </div>
    <noData v-if="noDataFlag"/>
    <div class="add" @click="add()">
      新增收货地址
    </div>
  </div>
</template>
<script>

import { Icon, List } from 'vant';
import Vue from 'vue';
import { getAddressList } from '../../api/api.js';
Vue.use(Icon);

import noData from '../components/noData.vue'
import {GetURLParameter,setCookie,mallInfo} from '../../assets/js/common.js'
import {mapMutations} from 'vuex'
import '../../../static/js/RainbowBridge'

export default {
  name: 'addressList',
  components: {
    VanList:List,
    noData
  },
  data(){
    return{
      datalist: [],
      loading: false,
      finished: false,
      pageNum: 1,
      noDataFlag: true
    }
  },
  created(){
   
     if(this.$route.query.source != "prescription"){
        mallInfo();
      }
    // let userId = GetURLParameter("userId");
    // if(userId){
    //   this.userId(userId);
    //   sessionStorage.setItem("userId",userId);
    // }
  },
  methods:{
    ...mapMutations({
      userId: 'userId',
    }),
    goBack() {
      let userId = GetURLParameter("userId");
      if(userId){
         JsBridge.callMethod(
          "JsInvokeNativeMethod",
          "finishPage",
          { message: "关闭地址列表页面" },
          function(data) {
          }
        );
      }else{
        if(sessionStorage.getItem("addressEditFlag")){
          this.$router.replace({name: 'orderConfirm',params:{}})
          return false;
        }
        this.$router.back();
      }
    },
    toEdit(id) {
      this.$router.push({ name: 'addressEdit', params: { id: id }});
    },
    add() {
      this.$router.push({ name: 'addressEdit', params: {id: 0}});
    },
    choose (item) {
      let addressInfo = {
        id: item.id,
        receivingName: item.receivingName,
        phoneName: item.phone,
        provinceName: item.provinceName,
        cityName: item.cityName,
        districtName: item.districtName,
        address: item.address,
        default: item.isSelect === 0 ? false : true
      }
      console.log(addressInfo);
      let userId = GetURLParameter("userId");
      if(!userId){
        this.$store.commit("updataAddressData", addressInfo);
        sessionStorage.setItem("addressInfo",JSON.stringify(addressInfo));
        if(sessionStorage.getItem("addressEditFlag")){
          if(this.$route.query.isRx == 1){
             this.$router.replace({name: 'orderConfirm',params:{},query:{isRx: 1}})
          }else if(this.$route.query.source == "prescription"){
            this.$router.replace({
              name:"orderConfirm",
              params:{},
              query:{
                source: 'prescription',         
                orderNo: this.$route.query.orderNo,  //问诊id
                inquiryId:  this.$route.query.inquiryId,
                userId: this.$store.state.mall.userId,
                token: this.$store.state.mall.token,
              }
            });
          }else{
            this.$router.replace({name: 'orderConfirm',params:{}})
          }
          return false;
        }
        this.$router.back()//push({ name: 'orderConfirm', params: {}});
      }
    },
    onLoad() {
     this.aa();
    },
    aa(){
      const that = this;
      let params = {
        header: {},
        body: {
          userId: this.$store.state.mall.userId,
          pageSize: 10,
          pageNum: this.pageNum ++
        }
      };
      getAddressList(params).then( res => {
        if(res.data.code === 0) {
          that.datalist = that.datalist.concat(res.data.data.records);
          that.loading = false;
          if( that.datalist.length == res.data.data.total && that.datalist.length != 0) {
            that.finished = true;
          }
        } else {
          that.loading = false;
        }
        that.loading = false;
        that.noDataFlag = that.datalist.length > 0 ? false : true;
        }).catch( err => {
          that.$toast(err);
        })
    }
  },
  mounted(){
    this.aa();
  }
}
</script>
<style lang="less" scoped>
.wrapper {
  background:rgba(246,248,250,1);
  // padding-bottom: 150px; 
  // position: relative;
  margin-top: 115px;
  .tabar {
    display: flex;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
    height: 88px;
    width: 100%;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    // padding: 0 30px;
    background:rgba(255,255,255,1);
    .back {
      position: absolute;
      top: 25px;
      left: 30px;
      width:20px;
      height:37px;
    }
    .title {
      font-size:36px;
    }
  }
  .list {
    margin: 5px 29px;
    .addr {
      display: flex;
      align-items: center;
      width:690px;
      min-height:143px;
      margin-top: 20px;
      padding: 32px 24px 20px 24px;
      box-sizing: border-box;
      background:rgba(255,255,255,1);
      border-radius:8px;
      .info {
        box-sizing: border-box;
        width: 528px;
        float: left;
        padding-right: 19px; 
        border-right: 1px solid #EBEBEB;
        .msg {
          margin-bottom: 10px;
          .name {
            font-size:32px;
            font-weight:bold;
          }
          .phone {
            font-size:28px;
            font-weight:500;
          }
        }
        .location {
          .default {
            display: inline-block;
            width:72px;
            height:40px;
            line-height: 40px;
            font-size:24px;
            text-align: center;
            color:rgba(255,175,65,1);
            background:rgba(255,175,65,.1);
            border-radius:8px;
          }
          .detail {
            // display: inline-block;
            height:40px;
            line-height: 55px;
            font-size:28px;
            color:rgba(102,102,102,1);
          }
        }
      }
      .valid {
        width:1px;
        height:100px;
        margin-right:18px;
        float: left;
      }
      .edit {
        display: flex;
        align-items: center;
        float: left;
        font-size:24px;
        color:rgba(174,175,178,1);
      }
    }
  }
  .add {
    position: fixed;
    bottom: 32px;
    left: 50%;
    transform: translateX(-50%);
    width:300px;
    height:80px;
    text-align: center;
    line-height: 80px;
    font-size:32px;
    color:rgba(255,255,255,1);
    background:linear-gradient(90deg,rgba(255,175,65,1),rgba(255,132,65,1));
    border-radius:40px;
  }
}
</style>
<style>
.addr .van-icon {
    font-size: 5vw;
}
</style>


