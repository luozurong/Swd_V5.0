<template>
  <div>
    <van-nav-bar class="home-header" :title="title" left-arrow @click-left="jumpClientHome"   @click-right="onClickRight">
      <van-icon name="search" slot="right" />
    </van-nav-bar>
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad()">
      <div class="home-product-wrap">
        <div class="home-product-item" v-for="(item,index) in records" :key="index" @click="jumpProductDetail(item.commodityId,item.isRx)">
          <div class="home-product-pic">
            <div :style="{backgroundImage: 'url('+ item.imgUrl +')'}"></div>
          </div>
          <div class="home-product-main">
            <div class="home-product-noData"><img v-if="item.inventory == 0" :src="noProduct" alt /></div>
            <div class="home-product-view">
              <div class="home-product-name">
                <span class="chu" v-if="item.isRx == 1">处方药</span>
                <span v-text="item.name"></span>
              </div>
              <div class="home-product-tip">
                <span  v-for="(list,i) in item.labelArr" :key="i">
                  <span v-show="list != ''" v-text="list"></span>
                </span>
              </div>
            </div>
            
            <div class="home-price-cart">
              <!-- 商品原价、特价都存在 -->
              <div class="price-wrap-price" v-if="item.price && item.specialPrice">
                <span class="price-wrap-current">
                  <span>{{item.specialPrice | pricePre}}</span>
                  <span>{{item.specialPrice | priceNext}}</span>
                </span>
                <s class="price-wrap-pre" v-text="item.price"></s>
              </div>
               <!-- 商品原价存在 -->
              <div class="price-wrap-price" v-if="item.price && !item.specialPrice">
                <span class="price-wrap-current">
                  <span>{{item.price | pricePre}}</span>
                  <span>{{item.price | priceNext}}</span>
                </span>
              </div>
              <div class="price-wrap-cart">
                <span>销量:{{item.sumVolume}}</span>
                <div v-if="item.isRx != 1"><img v-if="item.inventory > 0" @click.stop="addCart(item.commodityId)" :src="add_cart_btn" alt=""/></div>
              </div>
            </div>
          </div>
        </div> 
      </div>
    </van-list>  
    
    <div class="shop-cart-pic" @click="goShopCart()">
      <div><img :src="cart_num_btn" alt=""></div>
      <span v-text="shopCartNum"></span>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import { NavBar,Icon,List,Toast} from 'vant'
Vue.use(NavBar).use(Icon).use(List).use(Toast);
import { mapState, mapMutations} from 'vuex'

import {getColumnCommodity,getShopCarNum,saveComToCar,classiCommodityList} from '../../api/api.js'
import '../../../static/js/RainbowBridge.js'
import {jumpLoginPageWithCallback,isLogin} from './mall.js'
import {GetURLParameter,setCookie,mallInfo} from '../../assets/js/common.js'
import test from '../../assets/img/mall/test.png'
import add_cart_btn from '../../assets/img/mall/add_cart_btn.png'
import cart_num_btn from '../../assets/img/mall/cart_num_btn.png'
import noProduct from "../../assets/img/mall/no-product.png";

export default {
  name: 'recommend',
  data(){
    return{
      test,
      noProduct,
      cart_num_btn,
      add_cart_btn,
      records: [],
      shopCartNum: 0,
      finished: false,
      loading: false,
      setTime: 500,
      current: 1,
      isLoadFlag: false,
      title: ''
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
    // let userId = GetURLParameter("userId");
    // if(userId){
    // this.userId(userId);
    // sessionStorage.setItem("userId",userId);
    // }else{
    //   localStorage.removeItem('addressInfo')
    // }
  },
  methods:{
    ...mapMutations({
      userId: 'userId'
    }),
    //跳转商品详情
    jumpProductDetail(id,isRx){
      if(isRx == 1){
        this.$router.push({
          name:'productDetail',
          params:{
            id:id,
            columnId: this.$route.params.columnId,
            shareUserId: '0'
          },
          query:{
            isRx: 1
          }
        });
      }else{
        this.$router.push({
          name:'productDetail',
          params:{
            id:id,
            columnId: this.$route.params.columnId,
            shareUserId: '0'
          }
        });
      }
      
    },
    //跳转购物车
    goShopCart(){
      if(this.$store.state.mall.userId){
        this.$router.push({name:'shopCart',params:{}});
      }else{
        jumpLoginPageWithCallback(data => {  
          let datas = JSON.parse(JSON.stringify(data));
          this.userId(datas.data.userId);
          setCookie("userId",datas.data.userId,1);
          this.getShopCarNumAjax();
          this.$router.push('shopCart');
        })
      } 
    },
    onClickRight(){
      this.$router.push({name:'productSearch',params:{columnType: 1}});
    },
    //关闭当前页面
    jumpClientHome(){
      JsBridge.callMethod(
        "JsInvokeNativeMethod",
        "finishPage",
        { message: "关闭商品推荐" },
        function(data) {
        }
      );
    },
    //获取购物车数量
    getShopCarNumAjax(){
      var params = {
        header: {},
        body:{
          userId:  this.$store.state.mall.userId
        }
      }
      getShopCarNum(params).then((res) => {
        if(res.data.code == 0){
          if(res.data.data.qty < 100){
            this.shopCartNum = res.data.data.qty;
          }else{
            this.shopCartNum = '99+';
          }
        }
      })
    },
    //加入购物车
    addCart(commodityId){
      console.log(commodityId);
       if(this.$store.state.mall.userId){
         this.saveComToCarAjax(commodityId);
      }else{
        jumpLoginPageWithCallback(data => {  
          let datas = JSON.parse(JSON.stringify(data));
          this.userId(datas.data.userId);
          setCookie("userId",datas.data.userId,1);
          this.saveComToCarAjax(commodityId)
        })
      }
    },
    saveComToCarAjax(commodityId){
      var params = {
        header: {},
        body:{
          columnId: this.columnId,
          commodityId,
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
    //分页加载
    onLoad(){
      var that = this;
      if(!this.isLoadFlag) return false;
      setTimeout(() => {
        that.setTime = 500;
        that.getColumnCommodityAjax();
      },that.setTime);
    },
    //获取栏目列表数据
    getColumnCommodityAjax(load,back){
      let columnId = '-1';
      if(this.$route.params.columnId != -1){
        columnId = this.$route.params.columnId
      }
      var params = {
        header: {},
        body:{
          size: 10,
          current: this.current,
          id: columnId
        }
      }
      this.current++;
      getColumnCommodity(params).then((res) => {
        if(res.data.code == 0){
          this.isLoadFlag = true;
          let recodsTamp = res.data.data.records;
          for(var i in recodsTamp){
            if(recodsTamp[i].label !=  null){
              recodsTamp[i].labelArr = recodsTamp[i].label.split("；");
            }
          }

          this.records = this.records.concat(recodsTamp);            
          if(res.data.data.records.length < 10){
            this.loading = false;
            this.finished = true;
          }else{
            this.loading = false;
            this.finished = false;
          }
        }
      })
    }
  },
  mounted(){
    this.getColumnCommodityAjax();
    this.getShopCarNumAjax();
    if(this.$route.query.title){
      this.title = this.$route.query.title;
    }
  }
}
</script>
<style lang='less' scoped>
  .home-header{
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    width: 100%;
  }
  .home-product-wrap{
    width: 100%;
    background: #fff;
    padding-left: 28px;
    box-sizing: border-box;
    margin-top: 98px;
    .home-product-item{
      border-bottom: 1px solid #ebebeb;
      display: flex;
      display: -webkit-flex;
      padding: 40px 0 40px;
      &:last-child{
        border: none;
      }
      .home-product-pic{
        flex-shrink: 0;
        div{
          width: 180px;
          height: 180px;
          border-radius: 8px;
          box-sizing: border-box;
          background-repeat: no-repeat;
          background-size: cover;
          background-position: center;
        }
      }
      .home-product-main{
        flex-grow: 2;
        margin-left: 18px;
        padding-right: 30px;
        position: relative;
        & > .home-product-noData{
          position: absolute;
          right: 30px;
          top: 74px;
          width: 107px;
          height: 85px;
          z-index: 1;
        }
        .home-product-view {
          height: 112px;
          .home-product-name{
            font-size: 28px;
            line-height: 36px;
            color: #333333;
            span {
              word-break: break-all;
              &.chu {
                width: 72px;
                height: 28px;
                font-size: 20px;
                line-height: 28px;
                background-color: #ff6e26;
                border-radius: 4px;
                display: inline-block;
                color: #fff;
                text-align: center;
                float: left;
                margin-top: 4px;
                margin-right: 10px;
              }
            }
          }
          .home-product-tip{
            margin-top: 7px;
            span {
              margin-right: 5px;
              span{
              display: inline-block;
              color: #60bc72;
              border: 1px solid #60bc72;
              border-radius: 8px;
              font-size: 20px;
              box-sizing: border-box;
              line-height: 1;
              padding: 2px 6px;
            }
            }
          }
        }
        
        .home-price-cart{
          display: flex;
          display: -webkit-flex;
          margin-top: 16px;
          .price-wrap-price{
            flex-grow: 2;
            -webkit-flex-grow: 2;
            display: flex;
            align-items: center;
            -webkit-display: flex;
            -webkit-align-items: center;
            .price-wrap-current{
              span{
                &:first-child{
                  color: #ff6e26;
                  font-size: 36px;
                  &:before{
                    content: '￥';
                    font-size: 24px;
                    margin-right: -4px;
                  }
                }
                &:last-child{
                  color: #ff6e26;
                  font-size: 28px;
                  margin-left:-10px;
                }
              }
            } 
            .price-wrap-pre{
              font-size: 24px;
              color: #d2d2d4;
              padding-top: 4px;
              margin-left: 4px;
              &:before{
                content: '￥';
                margin-right: -8px;
              }
            }
          }
          .price-wrap-cart {
            flex-shrink: 0;
            -webkit-flex-shrink: 0;
            display: flex;
            -webkit-align-items: center;
            position: relative;
            span {
              font-size: 24px;
              color: #aeafb2;
              margin-right: 80px;
            }
            div {
              position: absolute;
              right: -22px;
              z-index: 1;
              display: inline-block;
              width: 100px;
              height: 100px;
              padding: 22px;
              box-sizing: border-box;
              margin-left: 14px;
            }
          }
        }
      }
    }
  }
  .shop-cart-pic{
    position: fixed;
    bottom: 162px;
    left: 30px;
    z-index: 100 !important;
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
      padding-top: 4px;
      line-height: 46px;
      transform: scale(0.5);
      transform-origin: top right;
      box-sizing: border-box;
      text-align: center;
    }
  }
  .van-icon-search::before{
      content: url('../../assets/img/mall/search-icon.png');
      background-size: cover;
      display: block;
      clear: both;
      overflow: hidden;
 
  }
</style>
<style lang="">
  .van-icon-search::before{
    content: '';
  } 
  .van-cell--borderless{
    display: flex;
    align-items: center;
  }
  /* .van-field__left-icon{
    width: 24px;
    height: 24px;  
    background-image: url(../../assets/img/mall/search-icon.png);
    background-repeat: no-repeat;
    background-size: contain; 
  } */
  /* .van-field__left-icon::before{
    height: 12px;
    width: 12px;
  } */
</style>