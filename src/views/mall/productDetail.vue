<template>
  <div>
    <!-- 商品头部navbar -->
    <div v-show="productHeaderActive" class="product-header">
      <div class="product-header-back" @click="productBackFunc()"><img :src="back_black" alt=""></div>
      <div>商品详情</div>
      <div class="product-header-share" @click="shareShow()">
        <div><img :src="share_black" alt=""></div>
        <span>分享</span>
      </div>
    </div>

    <!-- 商品轮播图 -->
    <van-swipe :autoplay="3000" class="product-swipe-height">
      <van-swipe-item v-for="(image,index) in images" :key="index">
        <img :src='image'/>
      </van-swipe-item>
    </van-swipe>

    <!-- 返回按钮 -->
    <div class="productBack-fixed" v-show="!productHeaderActive">
      <div>
        <img @click="productBackFunc()" :src="productBack" alt=""/>
      </div>
    </div>

    <!-- 分享按钮 -->
    <div class="product-share" @click="shareShow()" v-show="!productHeaderActive">
      <div><img :src="shareWhile" alt=""></div>
      <span>分享</span>
    </div>

    <!-- 普通商品 -->
    <div class="product-price-wrap" v-if="!productDetailObj.columnId">
      <div class="product-price" v-if="productDetailObj.price && productDetailObj.salePrice">
        <span>
          <span>{{productDetailObj.salePrice | pricePre}}</span>
          <span>{{productDetailObj.salePrice | priceNext}}</span>
        </span>
        <s v-text="productDetailObj.price"></s>
      </div>
      <div class="product-price" v-if="productDetailObj.price && !productDetailObj.salePrice">
        <span>
          <span>{{productDetailObj.price | pricePre}}</span>
          <span>{{productDetailObj.price | priceNext}}</span>
        </span>
      </div>
    </div>

    <!-- 栏目商品 -->
    <div class="product-price-wrap" v-if="productDetailObj.columnId">
      <div class="product-price" v-if="productDetailObj.price && productDetailObj.specialPrice">
        <span>
          <span>{{productDetailObj.specialPrice | pricePre}}</span>
          <span>{{productDetailObj.specialPrice | priceNext}}</span>
        </span>
        <s v-text="productDetailObj.price"></s>
      </div>
      <div class="product-price" v-if="productDetailObj.price && !productDetailObj.specialPrice">
        <span>
          <span>{{productDetailObj.price | pricePre}}</span>
          <span>{{productDetailObj.price | priceNext}}</span>
        </span>
      </div>
    </div>

    <!-- 商品信息介绍 -->
    <div class="product-wrap">
      <div class="product-title">
        <span v-if="isRx == 1" class="chu">处方药</span>
        <span v-text="productDetailObj.name"></span>
      </div>
      <div class="home-product-tip">
        <span v-for="(item,index) in productDetailObj.labelArr" :key="index" v-show="item" v-text="item"></span>
      </div>
      <div class="product-containner">
        <div class="product-num">
          <span>销量:{{productDetailObj.sumVolume}}</span>
          <span>库存:{{productDetailObj.inventory}}</span>
        </div>
        <div class="product-discountsInfo" v-text="productDetailObj.discountsInfo"></div>
      </div>
    </div>

    <!-- 商品规格参数 -->
    <div class="product-content-wrap" v-if="productDetailObj.commNorm || productDetailObj.manufacturer || productDetailObj.approvalNumber">
      <div class="product-content-header">
        <i></i>
        <span>商品参数</span>
        <i></i>
      </div>
      <div>
        <div class="productDetail-can">
          <div v-if="productDetailObj.commNorm">
            <div>商品规格</div>
            <div>{{productDetailObj.commNorm}}</div>
          </div>
          <div v-if="productDetailObj.manufacturer">
            <div>生产厂家</div>
            <div>{{productDetailObj.manufacturer}}</div>
          </div>
          <div v-if="productDetailObj.approvalNumber">
            <div>批准文号</div>
            <div>{{productDetailObj.approvalNumber ? productDetailObj.approvalNumber : ''}}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 商品信息介绍 -->
    <div class="product-content-wrap">
      <div class="product-content-header">
        <i></i>
        <span>商品详情</span>
        <i></i>
      </div>
      <div v-html="productDetailObj.details"></div>
    </div>

    <!-- 普通商品 -->
    <div class="product-fixed" v-if="isRx != 1">
      <div class="product-customer">
        <div @click="customer">
          <div><img :src="customer_service_black_icon" alt=""></div>
          <span>在线客服</span>
        </div>
      </div>
      <div :class="{'product-add-cart':true,'product-add-active': isShow}" @click="addCart(productDetailObj.id)">加入购物车</div>
      <div :class="{'product-go-pay':true,'product-add-active': isShow}" @click="orderConfirm()">立即购买</div>
    </div>

    <!-- 处方药 -->
    <div class="product-chu" v-if="isRx == 1">
      <div class="product-customer" @click="customer">
        <div><img :src="customer_service_black_icon" alt=""></div>
        <span>在线客服</span>
      </div>
      <div class="product-zixun" @click="jumpPharmacistConsultation">
        <div><img :src="zixun" alt=""></div>
        <span>咨询药师</span>
      </div>
      <div class="product-other">
        <div class="product-add-cart" v-if="requirementListQty < 1" @click="jumpRequirementList">需求清单</div>
        <div class="product-add-cart" v-if="requirementListQty > 0" @click="jumpRequirementList">需求清单({{requirementListQty}})</div>
        <div class="product-go-pay" @click="addRequirementList(productDetailObj.id)">加入需求单</div>
      </div>
    </div>

    <div @click="payForWeb">测试</div>

    <!-- 购物车图标 -->
    <div class="shop-cart-pic" v-if="isRx != 1" @click="goShopCart()">
      <div><img :src="cart_num_btn" alt=""></div>
      <span v-text="shopCartNum"></span>
    </div>
    <div class="product-div"></div>
  </div>
</template>
<script>

import Vue from 'vue'
import { Swipe, SwipeItem,Toast } from 'vant';
Vue.use(Swipe).use(SwipeItem).use(Toast);

import {commodityDetil,getShopCarNum,saveComToCar,showToast} from '../../api/api.js'
import '../../../static/js/RainbowBridge.js'
import {jumpLoginPageWithCallback} from './mall.js'
import { mapState, mapMutations} from 'vuex'
import {GetURLParameter,setCookie,mallInfo} from '../../assets/js/common.js'

import test1 from '../../assets/img/mall/test2.png'
import wechat from '../../assets/img/mall/wechat.png'
import qq from '../../assets/img/mall/qq.png'
import copy_link from '../../assets/img/mall/copy_link.png'
import share from '../../assets/img/mall/share.png'
import productBack from '../../assets/img/mall/back_product.png'
import productDetailIcon from '../../assets/img/mall/productDetail-icon.png'
import cart_num_btn from '../../assets/img/mall/cart_num_btn.png'
import shareWhile from '../../assets/img/mall/share-while.png'
import customer_service_black_icon from '../../assets/img/mall/customer_service_black_icon.png'
import zixun from '../../assets/img/mall/zixun.png'
import back_black from '../../assets/img/mall/back-black.png'
import share_black from '../../assets/img/mall/share_black.png'

export default {
  name: 'productDetail',
  data(){
    return{
      productDetailSource: 1,    //普通商品1  凭方开药2  订单3  药师4  医生5  普通分享6
      productDetailIcon,
      productBack,
      share,
      wechat,
      qq,
      copy_link,
      test1,
      shareWhile,
      cart_num_btn,
      customer_service_black_icon,
      zixun,
      back_black,
      share_black,
      images: [],
      productDetailObj: {},
      shopCartNum: 0,
      shareFlag: false,
      isShow: true,
      productHeaderActive: false,
      isChuFlag: this.$route.query.isRx == 1 ? true : false,
      requirementListQty: 0,
      isRx: this.$route.query.isRx
    }
  },
  filters:{
    pricePre(value){
      var val = parseInt(value);
      return val;
    },
    priceNext(value){
      var val = '.'+String(parseFloat(value).toFixed(2)).split('.')[1];
      return val;
    }
  },
  created(){
      mallInfo();
      // if(this.$route.query.userId && this.$route.query.token){
      //   var userInfo = [this.$route.query.token, this.$route.query.userId];
      //   this.userId(this.$route.query.userId);
      //   this.$store.commit("setLoginData", userInfo); //store 保存参数header.token, userInfo.userId
      // }else{
      //   var userInfo = ['', ''];
      //   this.$store.commit("setLoginData", userInfo); //store 保存参数header.token, userInfo.userId
      // }
  },
  methods:{
    ...mapMutations({
      userId: 'userId'
    }),
    customer(){ //在线客服
      window.location.href = "https://tb.53kf.com/code/app/10157687/1";
    },
    jumpPharmacistConsultation(){
      JsBridge.callMethod(
        "JsInvokeNativeMethod",
        "pharmacistConsultation",
        {"message":"药师咨询", "type": 1},
        function(data) {
        }
      );
    },
    payForWeb(){
      let orderNos = new Date().getTime().toString();
            let params = {
                orderid:"4jkjkk",
                orderNo: orderNos,
                totalFee:"1",
                payType:"1",
                channelId:"0",
                merchantId:"1"
            }
            this.$api.payForWeb(params).then(res => {
                console.log(res);
                window.location.href = res.data.codeUrl;
                //if(res.code = 0){
                    //window.location.href = res.data.codeUrl;
                //}
            })
        },
    orderConfirm(){
      if(this.productDetailObj.inventory == 0 ){
        Toast('亲，暂时无货哦');
        return false;
      } 
      
      let columnId = null;
      if(this.$route.params.columnId != -1){
        columnId = this.$route.params.columnId
      }
      let comListTamp = [{
        comId: this.$route.params.id,
        columnId: columnId,
        qty: 1
      }]
      sessionStorage.setItem("comListTamp",JSON.stringify(comListTamp));
      sessionStorage.setItem("message",'');
      sessionStorage.setItem("jumpOrderConfirmStatus",'productDetail'); //记录确认订单来源

      if(this.$store.state.mall.userId){
         this.$router.push({name: 'orderConfirm',params:{}});
      }else{      
        jumpLoginPageWithCallback(data => {  
          let datas = JSON.parse(JSON.stringify(data));
          this.userId(datas.data.userId);
          setCookie("userId",datas.data.userId,1);
          this.getShopCarNumAjax();
          this.$router.push({name: 'orderConfirm',params:{}});
        })
      }
    },
    productBackFunc(){
      if(GetURLParameter('source') || GetURLParameter('token')){
        JsBridge.callMethod(
          "JsInvokeNativeMethod",
          "finishPage",
          { message: "关闭商品详情页" },
          function(data) {
          }
        );
      }else{
        this.$router.back();
      }
    },
    goShopCart(){
      if(this.$store.state.mall.userId){
        this.$router.push({name:'shopCart',params:{}});
      }else{
        jumpLoginPageWithCallback(data => {  
          let datas = JSON.parse(JSON.stringify(data));
          this.userId(datas.data.userId);
          setCookie("userId",datas.data.userId,1);
          this.$router.push({name:'shopCart',params:{}});
        })
      }
    },
    shareCancel(){
      this.shareFlag = false;
    },
    //微信分享
    shareShow(){
      let productDetailObj = this.productDetailObj;     
      JsBridge.callMethod(
        "JsInvokeNativeMethod",
        "shareMsg",
        { message: "Js商品详情调起分享到微信",
          shareType: '1',
          msgType: '2',
          title: productDetailObj.name,
          imageUrl:productDetailObj.imgUrl.split(";")[0],
          webPageUrl: window.location.href,
          desc: productDetailObj.name,
          path: `pages/mall/product/productDetail/productDetail?&comId=${this.$route.params.id}&columnId=${this.$route.params.columnId}&shareUserId=${this.$store.state.mall.userId}` },
          function(data) {
            JsBridge.callMethod(
              "JsInvokeNativeMethod",
              "showToast",
              { message:'消息提示',toast: '分享成功'},
                function(data) {
                }
            );
          }
      );
    },
    shareHide(){
      this.shareFlag = false;
    },
    //跳转到需求清单
    jumpRequirementList(){
      if(!this.$store.state.mall.userId){
        jumpLoginPageWithCallback(data => {  
          let datas = JSON.parse(JSON.stringify(data));
          this.userId(datas.data.userId);
          setCookie("userId",datas.data.userId,1);
        });
        return false;
      }
      this.$router.push({name:"requirementList",params:{}});
    },
    shareProductDetail(info){},
    //商品详情
    commodityDetilAjax(){
      let columnId = this.$route.params.columnId != -1 ? parseInt(this.$route.params.columnId) : '';
      var params = {
        header: {},
        body:{
          id: this.$route.params.id,
          columnId: columnId
        }
      }
      commodityDetil(params).then((res) => {
        if(res.data.code == 0){
          this.productDetailObj = res.data.data;
          if(this.productDetailObj.imgUrl){
            let imagesAttr = [];
            if(this.productDetailObj.imgUrl.indexOf(';') != -1){
              imagesAttr = this.productDetailObj.imgUrl.split(";")
            }else{
              let imagesAttrTamp = [];
              imagesAttrTamp.push(this.productDetailObj.imgUrl)
              imagesAttr = imagesAttrTamp;
            }
            this.images = imagesAttr;
            
          }
          if(this.productDetailObj.label.indexOf('；') != -1){
            this.productDetailObj.labelArr = this.productDetailObj.label.split("；");
          }else{
            let labelArr = [];
            labelArr.push(this.productDetailObj.label);
            this.productDetailObj.labelArr = labelArr
          }
          console.log(this.productDetailObj.inventory );
          if(this.productDetailObj.inventory == 0){
            this.isShow = true;
          }else{
            this.isShow = false;
          }
          if(res.data.data.isRx){
            this.isRx = res.data.data.isRx;
          }

          if(!this.productDetailObj.discountsInfo){
            this.productDetailObj.discountsInfo = '满99元包邮';
          }
        }
      })
    },
    //购物车数量
    getShopCarNumAjax(){
      if(!this.$store.state.mall.userId) return false;
      var params = {
        header: {},
        body:{
          userId:  this.$store.state.mall.userId
        }
      }
      getShopCarNum(params).then((res) => {
        if(res.data.code == 0){
          if(res.data.data.qty < 100){
            this.shopCartNum = res.data.data.qty
          }else{
            this.shopCartNum = '99+';
          }
        }
      })
    },
    addCart(id){
       if(this.$store.state.mall.userId){
        if(this.isShow) return false;
         this.saveComToCarAjax(id);
       }else{
       
        jumpLoginPageWithCallback(data => {  
          if(this.isShow) return false;       
          let datas = JSON.parse(JSON.stringify(data)); 
          this.userId(datas.data.userId);
          Toast(datas.data.userId)
          setCookie("userId",datas.data.userId,1);           
          this.saveComToCarAjax(id)
        })
       }
    },
    //添加商品到购物车
    saveComToCarAjax(commodityId){ 
      let columnId = this.$route.params.columnId == -1 ? '' : this.$route.params.columnId;
      var params = {
        header: {},
        body:{
          columnId: columnId,
          commodityId: commodityId,
          qty: 1,
          userId:  this.$store.state.mall.userId,
          isSelect: 0,
        }
      }
      saveComToCar(params).then((res) => {
        if(res.data.code == 0){
         if(res.data.data.qty > 99){
            this.shopCartNum == '99'
            Toast('购物车商品已达到上限');
          }else{
            this.shopCartNum = res.data.data.qty;
            Toast('添加成功');
          }
        }
      })
    },

    //获取需求清单数量
    getRequirementListNum(){
      let params = {
        header: {},
        body: {
          userId: this.$store.state.mall.userId
        }
      }
      this.$api.getRequirementListNum(params).then(res =>{
        console.log(res);
        if(res.data.code == 0){
          this.requirementListQty = res.data.data.qty;
        }
      })
    },

    //加入需求清单
    addRequirementList(commodityId){
      if(!this.$store.state.mall.userId){
        jumpLoginPageWithCallback(data => {  
          let datas = JSON.parse(JSON.stringify(data));
          this.userId(datas.data.userId);
          setCookie("userId",datas.data.userId,1);
        });
        return false;
      }
      if(this.productDetailObj.status != 0){
        Toast("商品已下架");
        return false;
      }else if(this.productDetailObj.inventory < 1){
        Toast("库存不足");
        return false;
      }
      let columnId = this.$route.params.columnId == -1 ? '' : this.$route.params.columnId;
      var params = {
        header: {},
        body:{
          columnId: columnId,
          commodityId: commodityId,
          qty: 1,
          userId:  this.$store.state.mall.userId,
          isSelect: 0,
        }
      }
      this.$api.saveRequirementCom(params).then(res => {
        console.log(res);
        if(res.data.code == 0){
          this.requirementListQty = res.data.data.qty;
          Toast("添加成功");
        }else{
          Toast(res.data.message);
        }
      })
    },
  },
  mounted(){
    this.commodityDetilAjax();
    this.getShopCarNumAjax();
    this.getRequirementListNum();
    let that = this;
    window.onscroll = function() {
      var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      if(scrollTop > 10){
        that.productHeaderActive = true;
      }else{
        that.productHeaderActive = false;
      }
    }
  }
}
</script>
<style lang="less" scoped>
  .product-chu{
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 10;
    width: 100%;
    background: #fff;
    height: 100px;
    display: flex;
    align-items: center;
    .product-customer{
      flex-shrink: 0;
      margin-left: 40px;
      div{
        width: 40px;
        height: 40px;
        margin: 0 auto;
      }
      span{
        display: block;
        text-align: center;
        margin-top: 10px;
        font-size: 20px;
      }
    }
    .product-zixun{
      flex-shrink: 0;
      margin-left: 50px;
      div{
        width: 40px;
        height: 40px;
        margin: 0 auto;
      }
      span{
        display: block;
        text-align: center;
        margin-top: 10px;
        font-size: 20px;
      }
    }
    .product-other{
      text-align: center;
      font-size: 32px;
      flex-shrink: 0;
      border-radius: 40px;
      box-sizing: border-box;
      font-size: 28px;
      height: 72px;
      flex-grow: 2;
      display: flex;
      justify-content: flex-end;
      .product-go-pay{
        color: #fff;
        width: 180px;
        background-image: linear-gradient(90deg, 
          #ffaf41 0%, 
          #ff8441 100%), 
        linear-gradient(
          #f89283, 
          #f89283);
        background-blend-mode: normal, 
          normal;
        border-radius: 36px;
        margin-left: 20px;
        margin-right: 30px;
        line-height: 72px;
        span{
          font-size: 20px;
        }
      }
      .product-add-cart{
        background: #fff;
        border:1px solid #ffaf41;
        color: #ffaf41;
        width: 190px;
        border-radius: 36px;
        line-height: 70px;
        span{
          font-size: 20px;
        }
      }
    }
  }
  .product-title{
    .chu{
      padding: 1px 4px;
      font-size: 20px;
      background: #ff6f26;
      color: #fff;
      border-radius: 4px;
      float:left;
      margin-top: -4px;
      
    }
  }
  .product-fixed-share{
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;
    background: rgba(51,51,51,0.2);
    z-index: 100;
    margin: auto;
    .product-share-header{
      width: 585px;
      height: 704px;
      background-color: #ffffff;
      border-radius: 8px;
      margin: 193px auto 0;
      .product-share-word{
        font-size: 36px;
        line-height: 34px;
        letter-spacing: 0px;
        line-height: 96px;
        color: #333333;
        text-align: center;
      }
      div{
        flex-grow: 2;
        -webkit-flex-grow: 2;
      }
      
      .product-share-pic{
        width: 388px;
        height: 388px;
        margin: 0 auto;
      }
      .product-share-name{
        padding: 0 41px;
        font-size: 28px;
        line-height: 38px;
        margin-top: 32px;
        color: #333333;
      }
      .product-share-price{
        margin-left: 40px;
        margin-top: 14px;
      }
      .product-price-tip{
        font-size: 24px;
        line-height: 38px;
        letter-spacing: 0px;
        color: #aeafb2;
        margin-left: 41px;
        margin-top: 14px;
      }
    }
    .product-share-footer{
      position: absolute;
      bottom: 0;
      left: 0;
      z-index: 101;
      width: 100%;
      height: 320px;
      background-color: #ffffff;
      .product-footer-header{
        display: flex;
        display: -webkit-flex;
        margin: 0 30px;
        border-bottom: 1px solid #ebebeb;
        height: 104px;
        line-height: 104px;
        div{
          flex-grow: 2;
          -webkit-flex-grow: 2;
          text-align: center;
          margin-left: 54px;
        }
        span{
          display: inline-block;
          flex-shrink: 0;
          -webkit-flex-shrink: 0;
          color: #aeafb2;
        }
      }
      .product-footer-icon{
        display: flex;
        display: -webkit-flex;
        &>div{
          width: 33.33%;
          div{
            width: 50px;
            height: 44px;
            margin: 57px auto 17px;
          }
          span{
            display: block;
            text-align: center;
            
          }
        }
      }
    }
  }
  .van-swipe-item{
    display: flex;
    justify-content: center;
    align-items: center;
    img{
       width: 100%;
    }
  }
  .product-swipe-height{
    height: 100vw;
  }
  .productBack-fixed{
    position: fixed;
    top: 35px;
    left: 30px;
    z-index: 10;
    div{
      width: 56px;
      height: 56px;
    }
  }
  .product-price-wrap{
    background: #fff;
    padding: 28px 30px 0;
    .product-price{
      flex-grow: 2;
      -webkit-flex-grow: 2;
      span{
        span{
          &:first-child{
            font-size: 48px;
            font-weight: normal;
            font-stretch: normal;
            line-height: 38px;
            letter-spacing: 0px;
            color: #ff6e26;
            &:before{
              content: "￥";
              font-size: 34px;
              margin-right: -4px;
            }
          }
          &:last-child{
            font-size: 36px;
            font-weight: normal;
            font-stretch: normal;
            line-height: 38px;
            letter-spacing: 0px;
            color: #ff6e26;
            margin-left: -8px;
          }
        }
      } 
      s{
        font-size: 24px;
        font-weight: normal;
        font-stretch: normal;
        line-height: 38px;
        letter-spacing: 0px;
        color: #d2d2d4;
        &:before{
          content: "￥";
          margin-right: -5px;
        }
      }
    }
  }
  
  .product-wrap{
    background: #fff;
    padding: 0 30px;
    margin-bottom: 20px;
    .product-title{
      font-size: 32px;
      font-weight: bold;
      font-stretch: normal;
      line-height: 38px;
      letter-spacing: 0px;
      color: #333333;
      padding-top: 18px;
      display: flex;
      display: -webkit-flex;
      align-items: flex-start;
      &>span{
        margin-right: 10px;
      }
    }
    .product-discripe{
      font-size: 28px;
      font-weight: normal;
      font-stretch: normal;
      line-height: 48px;
      letter-spacing: 0px;
      color: #aeafb2;
    }
    .product-containner{
      display: flex;
      display: -webkit-flex;
      margin-top: 30px;
      padding-bottom: 22px;
      .product-num{
        flex-shrink: 0;
        -webkit-flex-shrink: 0;
        font-size: 24px;
        font-weight: normal;
        font-stretch: normal;
        line-height: 38px;
        letter-spacing: 0px;
        color: #aeafb2;
        display: flex;
        align-items: center;
        display: flex;
        align-items: center;
        span{
          margin-right: 29px;
        }
      }
      .product-discountsInfo{
        flex-grow: 2;
        -webkit-flex-grow: 2;
        font-size: 24px;
        color: #aeafb2;
        align-items: center;
        display: flex;
        justify-content: flex-end;
        align-items: center;
      }
    }
  }
  .home-product-tip{
    margin-top: 4px;
    height: 34px;
    span{
      display: inline-block;
      color: #60bc72;
      border: 1px solid #60bc72;
      border-radius: 8px;
      font-size: 20px;
      margin-right: 10px;
      box-sizing: border-box;
      line-height: 1;
      padding: 2px 6px;
    }
  }

  .product-content-wrap{
    width: 100%;
    background: #fff;
    .product-content-header{
      height: 97px;
      display: flex;
      align-items: center;
      display: -webkit-flex;
      -webkit-align-items: center;
      padding: 0 30px;
      i{
        flex-grow: 2;
        border-top: 1px solid #ebebeb;
      }
      span{
        flex-shrink: 0;
        font-size: 28px;
        color: #333333;
        margin-left: 7px;
        margin: 0 30px;
      }
    }
    .productDetail-can{
      margin: 0 30px;
      border: 1px solid #ccc;
      border-right: none;
      border-bottom: none;
      &>div{
        border-bottom: 1px solid #ccc;
        height: 70px;
        line-height: 70px;
        display: flex;
        &>div{
          border-right: 1px solid #ccc;
         
          text-align: left;
          padding-left: 20px;
          box-sizing: border-box;
          font-size: 24px;
          white-space:nowrap; 
          overflow:hidden; 
          text-overflow:ellipsis;
          &:first-child{
            width: 140px !important;
            flex-shrink: 0 !important;
            border-top: none;
            text-align: center;
            padding-left: 0;
          }
          &:last-child{
             flex-grow: 2;
          }
        }
      }
    }
  }
  .product-fixed{
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 10;
    width: 100%;
    height: 112px;
    display: flex;
    display: -webkit-flex;
    align-items: center;
    -webkit-align-items: center;
    background: #fff;
    &>div.product-customer{
      flex-grow: 2;
      -webkit-flex-grow: 2;
      padding-left: 30px;
      div{
        width: 100px;
        height: 112px;
        div{
          width: 40px;
          height: 40px; 
          color: #666666;
          margin: -15px auto 0;
        }
        span{
          display: block;
          font-size: 20px;
          text-align: center;
        }
      } 
    }
    div{
      text-align: center;
      line-height: 78px;
      font-size: 32px;
      flex-shrink: 0;
      border-radius: 40px;
      box-sizing: border-box;
      font-size: 28px;
      height: 80px;
      &.product-go-pay{
        color: #fff;
        width: 180px;
        background-image: linear-gradient(90deg, 
          #ffaf41 0%, 
          #ff8441 100%), 
        linear-gradient(
          #f89283, 
          #f89283);
        background-blend-mode: normal, 
          normal;
        border-radius: 40px;
        margin-left: 20px;
        margin-right: 30px;
      }
      &.product-add-cart{
        background: #fff;
        border:1px solid #ffaf41;
        color: #ffaf41;
        width: 190px;
      }
      &.product-add-active{
        opacity: 0.6;
      }
    }
  }
  .shop-cart-pic{
    position: fixed;
    bottom: 162px;
    left: 30px;
    z-index: 10;
    div{
      width: 80px;
      height: 80px;
    }
    span{
      position: absolute;
      top: -4px;
      right: 0px;
      z-index: 11;
      border: 4px solid #ff6f26;
      border-radius: 28px;
      font-size: 40px;
      background: #fff;
      color: #ff6f26;
      height: 56px;
      min-width: 56px;
      line-height: 46px;
      padding-top: 4px;
      transform: scale(0.5);
      transform-origin: top right;
      box-sizing: border-box; 
      text-align: center;
    }
  }
  .product-share{
    position: fixed;
    top: 37px;
    right: 0;
    z-index: 1;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding-left: 35px;
    background-color: rgba(51, 51, 51, 0.7);
    height: 60px;
    width: 145px;
    display: flex;
    flex-shrink: 0;
    align-items: center;
    display: -webkit-flex;
    -webkit-flex-shrink: 0;
    -webkit-align-items: center;
    box-sizing: border-box;
    border-radius: 30px 0 0 30px;
    div{
      width: 28px;
      height: 28px;
      display: flex;
      display: -webkit-flex;
    }
    span{
      font-size: 24px;
      color: #fff;
      display: inline-block;
      padding-top: 6px;
      margin-left: 4px;
      display: flex;
      align-items: center;
      padding-bottom: 4px;
    }
  }
  .product-div{
    height: 113px;
  }
  .product-header{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 88px;
    background: #fff;
    z-index: 100;
    display: flex;
    justify-content: center;
    align-items: center;
    &>div:nth-child(2){
      font-size: 36px;
      color: #333;
      flex-grow: 2;
      text-align: center;
    }
    &>div.product-header-back{
      flex-shrink: 0;
      width: 20px;
      height: 37px;
      margin-left: 30px;
      margin-right: 70px;
    }
    &>div.product-header-share{
      display: flex;
      flex-shrink: 0;
      div{
        width: 28px;
        height: 28px;
        img{
          display: block;
        }
      }
      span{
        margin-left: 7px;
        margin-right: 30px;
        font-size: 28px;
        color: #333;
      }
    }
  }
</style>
 