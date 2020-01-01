<template>
  <div class="home">
    <div class="home-header">
      <div class="search">
        <div class="search-back" @click="jumpClientHome()">
          <img :src="back" alt />
        </div>
        <van-search @click="jumpProductSearch()" placeholder="请输入搜索关键词" disabled />
      </div>
    </div>
    <div style="height: 44px"></div>
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad()">
      <div class="home-product-wrap">
        <div
          class="home-product-item"
          v-for="(item,index) in records"
          :key="index"
          @click="jumpProductDetail(item.id,item.isRx)"
        >
          <div class="home-product-pic">
            <div :style="{backgroundImage: 'url('+ item.imgUrls +')'}"></div>
          </div>
          <div class="home-product-main">
            <div class="home-product-noData"><img v-if="item.inventory == 0" :src="noProduct" alt /></div>
            <div class="home-product-view">
              <div class="home-product-name">
                <span class="chu" v-if="item.isRx == 1">处方药</span>
                <span v-text="item.name"></span>
              </div>
              <div class="home-product-tip" v-if="item.label != null || item.label != ''">
                <span  v-for="(list,i) in item.labelArr" :key="i" v-show="list != ''" v-text="list"></span>
              </div>
            </div>
            <div class="home-price-cart">
              <div class="price-wrap-price" v-if="item.price && item.salePrice">
                <span class="price-wrap-current">
                  <span>{{item.salePrice | pricePre}}</span>
                  <span>{{item.salePrice | priceNext}}</span>
                </span>
                <s>{{item.price}}</s>
              </div>
              <div class="price-wrap-price" v-if="item.price && !item.salePrice">
                <span class="price-wrap-current">
                  <span>{{item.price | pricePre}}</span>
                  <span>{{item.price | priceNext}}</span>
                </span>
              </div>
              <div class="price-wrap-cart">
                <span>销量:{{item.sumVolume}}</span>
                <div  v-if="item.isRx != 1">
                  <img
                    v-if="item.inventory > 0"
                    @click.stop="addCart(item.id)"
                    :src="add_cart_btn"
                    alt
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </van-list>
    <noData v-if="false" />
    <div class="shop-cart-pic" @click="goShopCart()">
      <div>
        <img :src="cart_num_btn" alt />
      </div>
      <span v-text="shopCartNum"></span>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import { Tab, Tabs, Search, List, Toast } from "vant";
Vue.use(Tab)
  .use(Tabs)
  .use(Search)
  .use(List)
  .use(Toast);

import { mapState, mapMutations } from "vuex";
import noData from "../components/noData.vue";

import {
  classiCommodityList,
  homeClassification,
  getShopCarNum,
  saveComToCar
} from "../../api/api.js";
import { jumpLoginPageWithCallback, isLogin } from "./mall.js";
import { GetURLParameter, setCookie,mallInfo } from "../../assets/js/common.js";
import "../../../static/js/RainbowBridge.js";
import back from "@/assets/img/mall/back.png";
import search from "../../assets/img/mall/nav_search.png";
import test from "../../assets/img/mall/test.png";
import add_cart_btn from "@/assets/img/mall/add_cart_btn.png";
import cart_num_btn from "../../assets/img/mall/cart_num_btn.png";
import noProduct from "../../assets/img/mall/no-product.png";

export default {
  name: "mall",
  data() {
    return {
      back: back,
      search: search,
      test: test,
      cart_num_btn,
      add_cart_btn,
      noProduct,
      tabWorld: [],
      active: 0,
      loading: false,
      finished: false,
      records: [],
      shopCartNum: 0,
      columnId: "",
      setTime: 0,
      pageNum: 1,
      isLoginFlag: false,
      classifyId: "", //商品分类id
      id: "" //送药上门id
    };
  },
  computed: {
    ...mapState({
      testFlag: state => state.mall.testFlag
    })
  },
  components: {
    noData
  },
  filters: {
    pricePre(value) {
      var val = parseInt(value);
      return val;
    },
    priceNext(value) {
      var val = "." + String(parseFloat(value).toFixed(2)).split(".")[1];
      return val;
    }
  },
  watch: {
    active(newval, oldVal) {
      this.active = Number(newval);
    }
  },
  created() {
    mallInfo();
    // let userId = GetURLParameter("userId");
    // let classifyId = GetURLParameter("classifyId");
    // if (userId) {
    //   this.userId(userId);
    //   sessionStorage.setItem("userId", userId);
    // } else {
    //   localStorage.removeItem("addressInfo");
    // }
  },
  methods: {
    ...mapMutations({
      userId: "userId"
    }),
    jumpProductDetail(id,isRx) {
      if(isRx == 1){
        this.$router.push({
          name: "productDetail",
          params: {
            id: id,
            columnId: "-1",
            shareUserId: "0"
          },
          query: {
            isRx: 1
          }
        });
      }else{
        this.$router.push({
          name: "productDetail",
          params: {
            id: id,
            columnId: "-1",
            shareUserId: "0"
          }
        });
      }
    },
    goShopCart() {
      var that = this;
      if (this.$store.state.mall.userId) {
        this.$router.push("shopCart");
      } else {
        jumpLoginPageWithCallback(data => {
          let datas = JSON.parse(JSON.stringify(data));
          this.userId(datas.data.userId);
          setCookie("userId", datas.data.userId, 1);
          this.getShopCarNumAjax();
          this.$router.push("shopCart");
        });
      }
    },
    jumpProductSearch() {
      this.$router.push({name:"productSearch",params:{columnType: 1}});
    },
    jumpClientHome() {
      JsBridge.callMethod(
        "JsInvokeNativeMethod",
        "finishPage",
        { message: "关闭商城首页" },
        function(data) {}
      );
    },
    onLoad() {
      if(!this.isLoginFlag) return false;
      var that = this;
      
      setTimeout(() => {
        that.setTime = 500;
        let id = this.$route.query.id;
        that.classiCommodityListAjax(id);
      }, that.setTime);
    },

    //分类列表数据
    classiCommodityListAjax(id) {
      var params = {
        hader: {},
        body: {
          size: 10,
          current: this.pageNum,
          id: id
        }
      };

      classiCommodityList(params).then(res => {
        this.isLoginFlag = true;
        if (res.data.code == 0) {
          let recodsTamp = res.data.data.records;
          for (var i in recodsTamp) {
            if (recodsTamp[i].label) {
              recodsTamp[i].labelArr = recodsTamp[i].label.split("；");
            }
            if (recodsTamp[i].imgUrl) {
              recodsTamp[i].imgUrls = recodsTamp[i].imgUrl.split(";")[0];
              recodsTamp[i].imgUrls = recodsTamp[i].imgUrls.split(",")[0];
            }
          }
          this.records = this.records.concat(recodsTamp);
          if (res.data.data.records.length < 10) {
            this.loading = false;
            this.finished = true;
          } else {
            this.pageNum += 1;
            this.loading = false;
            this.finished = false;
          }
        }
      });
    },
    //购物车数量
    getShopCarNumAjax() {
      if (!this.$store.state.mall.userId) return false;
      var params = {
        header: {},
        body: {
          userId: this.$store.state.mall.userId
        }
      };
      getShopCarNum(params).then(res => {
        if (res.data.code == 0) {
          if(res.data.data.qty < 100){
            this.shopCartNum = res.data.data.qty;
          }else{
            this.shopCartNum = '99+';
          }
        }
      });
    },
    addCart(id) {
      var that = this;
      if (this.$store.state.mall.userId) {
        this.saveComToCarAjax(id);
      } else {
        jumpLoginPageWithCallback(data => {
          let datas = JSON.parse(JSON.stringify(data));
          this.userId(datas.data.userId);
          setCookie("userId", datas.data.userId, 1);
          this.saveComToCarAjax(id);
        });
      }
    },
    //添加商品到购物车
    saveComToCarAjax(commodityId) {
      var params = {
        header: {},
        body: {
          columnId: this.columnId,
          commodityId,
          qty: 1,
          userId: this.$store.state.mall.userId,
          isSelect: 0
        }
      };
      saveComToCar(params).then(res => {
        if (res.data.code == 0) {
          if (res.data.data.qty > 99) {
            this.shopCartNum == "99+";
            //Toast("购物车商品已达到上限");
          } else {
            this.shopCartNum = res.data.data.qty;
            Toast("添加成功");
          }
        }
      });
    }
  },
  mounted() {
    //this.classiCommodityListAjax('1000000018')
    let id = this.$route.query.id;
    this.classiCommodityListAjax(id);
    this.getShopCarNumAjax();
  },
  activated(){
    console.log(111);
    this.getShopCarNumAjax();
  }
};
</script>
<style lang="less" scoped>
.home {
  width: 100%;
  box-sizing: border-box;
}
.home-header {
  width: 100%;
  .search {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100000 !important;
    width: 100%;
    background: #fff;
    box-sizing: border-box;
    padding: 0 28px;
    display: flex;
    display: -webkit-flex;
    align-items: center;
    -webkit-align-items: center;
  }
  .search-back {
    width: 20px;
    height: 37px;
    flex-shrink: 0;
    -webkit-flex-shrink: 0;
    margin-right: 13px;
  }
}
.van-search {
  flex-grow: 2;
  -webkit-flex-grow: 2;
  padding: 10px 0;
  border-radius: 32px;
}
.van-search__content {
  border-radius: 32px;
}

.van-hairline--top-bottom::after {
  border-width: 0;
}
.home-tab-div {
  height: 88px;
  background: #f6f8fa;
}
.home-product-wrap {
  width: 100%;
  background: #fff;
  padding-left: 28px;
  box-sizing: border-box;
  // margin-top: 98px;
  margin-top: 20px;

  .home-product-item {
    border-bottom: 1px solid #ebebeb;
    display: flex;
    display: -webkit-flex;
    padding: 40px 0 40px;
    &:last-child {
      border: none;
    }
    .home-product-pic {
      flex-shrink: 0;
      div {
        width: 180px;
        height: 180px;
        border-radius: 8px;
        box-sizing: border-box;
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center;
      }
    }
    .home-product-main {
      flex-grow: 2;
      margin-left: 18px;
      padding-right: 30px;
      position: relative;
      & >.home-product-noData{
        position: absolute;
        right: 30px;
        top: 74px;
        width: 107px;
        height: 85px;
        z-index: 1;
      }
      .home-product-view{
        height: 112px;
        .home-product-name {
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
        .home-product-tip {
          margin-top: 4px;
          span{
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
      }
      
      .home-price-cart {
        display: flex;
        display: -webkit-flex;
        margin-top: 14px;
        .price-wrap-price {
          flex-grow: 2;
          -webkit-flex-grow: 2;
          display: flex;
          align-items: center;
          -webkit-display: flex;
          -webkit-align-items: center;
          s{
            color: #d2d2d4;
            font-size: 24px;
            margin-left: 10px;
            display: flex;
            align-items: flex-end;
            &::before{
              content: "￥";
              margin-right: -4px;
              padding-top: 4px; 
            }
          }
          .price-wrap-current {
            span {
              &:first-child {
                color: #ff6e26;
                font-size: 36px;
                &:before {
                  content: "￥";
                  font-size: 24px;
                  margin-right: -4px;
                }
              }
              &:last-child {
                color: #ff6e26;
                font-size: 28px;
                margin-left: -10px;
              }
            }
          }
          .price-wrap-pre {
            font-size: 24px;
            color: #d2d2d4;
            margin-left: 10px;
            padding-top: 6px;
            &:before {
              content: "￥";
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
.shop-cart-pic {
  position: fixed;
  bottom: 162px;
  left: 30px;
  z-index: 100 !important;
  div {
    width: 80px;
    height: 80px;
  }
  span {
    position: absolute;
    top: -4px;
    right: 0px;
    z-index: 11;
    border: 4px solid #ff6f26;
    border-radius: 28px;
    font-size: 40px;
    line-height: 1;
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
</style>
<style lang="less">
.home {
  .van-tabs__wrap {
    position: fixed;
    top: 88px;
    left: 0;
    z-index: 10;
    width: 100%;
    .van-tab {
      color: #333;
    }
    .van-tab--active {
      font-weight: bold;
      color: #333;
    }
    .van-tabs__line {
      width: 40px !important;
      background-color: #3ac756;
      border-radius: 4px;
      margin: 0 0 16px;
    }
  }
  .van-icon-search::before {
    content: "";
  }
  .van-cell--borderless {
    display: flex;
    align-items: center;
  }
  .van-field__left-icon {
    width: 24px;
    height: 24px;
    background-image: url(../../assets/img/mall/search.png);
    background-repeat: no-repeat;
    background-size: contain;
  }
}
</style>
 