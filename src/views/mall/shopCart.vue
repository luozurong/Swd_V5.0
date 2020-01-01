<template>
  <div class="shopCart">
    <van-nav-bar
      class="title-shopCart"
      :right-text="rightText"
      title="购物车"
      left-arrow
      @click-left="onClickLeft"
      @click-right="onClickRight"
    ></van-nav-bar>
    <div style="height:46px;"></div>
    <van-list
      v-if="!noDataFlag"
      v-model="loading"
      :finished="finished"
      finished-text=""
      @load="onLoad()"
    >
      <div class="shopCart-item" v-for="(item,index) in  records" :key="index">
        <van-swipe-cell :on-close="onClose" :name="index" :ref="'ref'+index">
          <van-cell>
            <div class="shopCart-item-wrap">
              <div class="shopCart-item-select">
                <div @click="chooseSelect(index)" v-if="item.isSelect == 1 && item.inventory > 0">
                  <img :src="cartselect" alt />
                </div>
                <div @click="chooseSelect(index)" v-if="item.isSelect == 0 && item.inventory > 0">
                  <img :src="cartnor" alt />
                </div>
                <div v-if="item.inventory == 0 && !rightFlag">
                  <img :src="cartdisable" alt />
                </div>
                <div @click="chooseSelect(index)" v-if="item.inventory == 0 && rightFlag && item.isSelect == 1">
                  <img :src="cartselect" alt />
                </div>
                <div  @click="chooseSelect(index)" v-if="item.inventory == 0 && rightFlag && item.isSelect == 0">
                  <img :src="cartnor" alt />
                </div>
              </div>
              <div class="shopCart-item-pic" @click="JumpProductDetail(item.comId,item.columnId)">
                <div class="shopCart-item-pic-style" :style="{backgroundImage: 'url('+ item.imgUrl +')'}">
                  <span v-if="item.inventory == 0 && item.status == 0">缺货</span>
                  <span v-if="item.inventory == 0 && item.status == 1">下架</span>
                </div>
              </div>
              <div class="shopCart-item-main">
                <div class="shopCart-main-view">
                  <div class="shopCart-main-name">
                    
                    <span class="span" v-text="item.name"></span>
                  </div>
                  <div class="home-product-tip">
                    <span
                      v-for="(list,i) in item.labelArr"
                      :key="i"
                      v-text="list"
                      v-show="list != ''"
                    ></span>
                  </div>
                </div>
                <div class="shopCart-main-step">
                  <span class="price-wrap-current">
                    <span>{{item.price | pricePre}}</span>
                    <span>{{item.price | priceNext}}</span>
                  </span>
                  <div class="price-wrap-number" v-if="item.inventory != 0">
                    <span @click="cartSub(index)"></span>
                    <input @change="numChange($event,index)" type="number" v-model="item.qty" />
                    <span @click="cartAdd(index)"></span>
                  </div>
                </div>
              </div>
            </div>
          </van-cell>
          <template slot="right">
            <van-button square type="danger" text="删除" />
          </template>
        </van-swipe-cell>
      </div>
    </van-list>
    <div v-if="noDataFlag" class="shopCart-empty">
      <noData/>
    </div>

    <!-- 特推商品 -->
    <div class="shopCart-special" v-if="specialRecords.length > 0">
      <div class="shopCart-special-title">
        <i></i>
        <span>你可能还喜欢</span>
        <i></i>
      </div>
      <div class="shopCart-special-item" v-for="(item,index) in specialRecords" :key="index" @click="jumpProductDetail(item.columnId,item.id,item.isRx)">
        <div class="shopCart-special-padding">
          <div class="shopCart-special-pic">
            <img :src="item.imgUrl" alt="">
          </div>
          <div class="shopCart-special-word">
            <div class="shopCart-special-name">
              <span class="chu" v-if="item.isRx == 1">处方药</span>
              <span  v-text="item.name"></span>
            </div>
            <div class="shopCart-special-tip">
              <span
                v-for="(list,i) in item.labelArr"
                :key="i"
                v-text="list"
                v-show="list != ''"
              ></span>
            </div>
          </div>
          <div class="shopCart-special-wrap">
            <div class="shopCart-special-price" v-if="item.columnId && item.specialPrice">
              <span>{{item.specialPrice | pricePre}}</span>
              <span>{{item.specialPrice | priceNext}}</span>
            </div>
            <div class="shopCart-special-price"  v-if="item.columnId && !item.specialPrice">
              <span>{{item.price | pricePre}}</span>
              <span>{{item.price | priceNext}}</span>
            </div>
             <div class="shopCart-special-price"  v-if="!item.columnId && item.salePrice">
              <span>{{item.salePrice | pricePre}}</span>
              <span>{{item.salePrice | priceNext}}</span>
            </div>
             <div class="shopCart-special-price" v-if="!item.columnId && !item.salePrice">
              <span>{{item.price | pricePre}}</span>
              <span>{{item.price | priceNext}}</span>
            </div>
            <div class="shopCart-special-sale">销量 {{item.sumVolume}}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 失效商品展示 -->
    <div class="shopCart-shi" v-if="shiFlag">
      <div class="shopCart-shi-wrap">
        <div class="shopCart-shi-title">快速清理失效商品</div>
        <div class="shopCart-shi-num">一共有{{unEfficacyCommodity.length}}件商品缺货或已下架</div>
        <div class="shopCart-shi-main">
          <div class="shopCart-shi-item" v-for="(item,index) in unEfficacyCommodity" :key="index">
            <div>
              <img :src="item.imgUrl" alt />
            </div>
            <span v-if="item.comStatus == 0">缺货</span>
            <span v-if="item.comStatus == 1">已下架</span>
          </div>
        </div>
        <div class="shopCart-shi-bottom">
          <span @click="cancalShi">取消</span>
          <span @click="sureShi">确认删除</span>
        </div>
      </div>
    </div>
    <div class="shopCart-div" v-if="!noDataFlag"></div>
    <div v-if="records.length > 0" class="shopCart-fixed">
      <div class="shopCart-fixed-pic" @click="chooseAll()">
        <div v-if="cartAllChooseFlag">
          <img :src="cartselect" alt />
        </div>
        <div v-if="!cartAllChooseFlag">
          <img :src="cartnor" alt />
        </div>
        <span>全选</span>
      </div>
      <div class="shopCart-cancel" v-show="rightFlag">
        <span @click="cancalProduct">快速清理失效商品</span>
        <span @click="shopCartDelectBtn">删除</span>
      </div>
      <div class="shopCart-fixed-other" v-show="!rightFlag">
        <div class="shopCart-fixed-price">
          <span>总计</span>
          <span v-text="count"></span>
        </div>
        <div class="shopCart-fixed-go" @click="goOrderConfirm()">去下单</div>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import {
  SwipeCell,
  Button,
  Cell,
  Stepper,
  NavBar,
  List,
  Dialog,
  Toast
} from "vant";
import { mapState, mapMutations } from "vuex";
Vue.use(SwipeCell)
  .use(Button)
  .use(Cell)
  .use(Stepper)
  .use(NavBar)
  .use(List)
  .use(Dialog);

import cartnor from "../../assets/img/mall/cart-nor.png";
import cartselect from "../../assets/img/mall/cart-select.png";
import cartdisable from "../../assets/img/mall/cart-disable.png";
import test from "../../assets/img/mall/test.png";

import noData from "../components/noData.vue";

import {
  GetURLParameter,
  setCookie,
  mallInfo
} from "../../assets/js/common.js";
import {
  getShopCarList,
  changeCarNum,
  changeSelect,
  delShopCar,
  chooseAll
} from "../../api/api.js";
import "../../../static/js/RainbowBridge.js";

export default {
  name: "shopCart",
  data() {
    return {
      value: 1,
      cartnor,
      cartselect,
      cartdisable,
      test: test,
      records: [],
      specialRecords: [],
      noDataFlag: false,
      loading: false,
      finished: false,
      pageNum: 1,
      loadTime: 0,
      cartAllChooseFlag: false,
      count: 0, //选中商品的总价
      shopCartNum: 0,
      rightText: "编辑",
      rightFlag: false,
      shiFlag: false,
      unEfficacyCommodity: [],
      chooseProductArr: []
    };
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
  components: {
    noData
  },
  created() {
    mallInfo();
    let userId = GetURLParameter("userId");
    if (userId) {
      this.userId(userId);
      sessionStorage.setItem("userId", userId);
      //setCookie("userId",userId,1);
    } else {
      localStorage.removeItem("addressInfo");
    }
  },
  methods: {
    ...mapMutations({
      userId: "userId"
    }),
    //跳转商品详情
    JumpProductDetail(comId, columnId) {
      let columnIdString = columnId ? columnId : -1;
      this.$router.push({
        name: "productDetail",
        params: {
          id: comId,
          columnId: columnIdString,
          shareUserId: "0"
        }
      });
    },
    onClose(clickPosition, instance, detail) {
      if (clickPosition != "right") return false;
      var i = detail.name;
      var that = this;
      Dialog.confirm({
        title: "删除",
        message: "确认删除该商品"
      })
        .then(() => {
          that.delShopCarAjax(that.records[i].id, function() {
            setTimeout(function() {
              that.records.splice(i, 1);
              that.allSelectFunc();
              if (that.records.length == 0) {
                that.noDataFlag = true;
                if(that.records.length == 0){
                  that.rightText = '';
                }
              }
            }, 400);
            instance.close();
          });
        })
        .catch(() => {
          instance.close();
        });
    },
    onClickLeft() {
      if (this.$route.query.userId) {
        console.log(this.$route.query);
        JsBridge.callMethod(
          "JsInvokeNativeMethod",
          "finishPage",
          { message: "关闭商城购物车" },
          function(data) {}
        );
      } else {
        this.$router.back(-1);
      }
    },
    onClickRight() {
      if (this.rightFlag) {
        this.rightFlag = false;
        this.rightText = "编辑";
      } else {
        this.rightFlag = true;
        this.rightText = "完成";
      }
    },
    //去下单
    goOrderConfirm() {
      sessionStorage.setItem("jumpOrderConfirmStatus", "shopCart"); //记录确认订单来源
      let ids = [];
      let comList = [];
      for (let i = 0; i < this.records.length; i++) {
        if (this.records[i].inventory > 0 && this.records[i].isSelect == 1) {
          let comListArr = {
            comId: this.records[i].comId,
            columnId: this.records[i].columnId,
            qty: this.records[i].qty
          };
          comList.push(comListArr);
        }
      }
      if (comList.length == 0) {
        Toast("请选择需要购买的商品");
        return false;
      }
      sessionStorage.setItem("comListTamp", JSON.stringify(comList));
      sessionStorage.setItem("message", "");
      this.$router.push({
        path: "orderConfirm",
        query: { isDeleteShopCartProduct: 1 }
      });
    },
    onLoad() {
      var that = this;
      setTimeout(function() {
        this.loadTime = 500;
        that.getShopCarListAjax(
          function() {
            that.loading = false;
          },
          function() {
            that.finished = true;
          }
        );
      }, this.loadTime);
    },
    //获取购物车数据
    getShopCarListAjax(ajaxAfter, noData) {
      var params = {
        header: {},
        body: {
          userId: this.$store.state.mall.userId,
          pageSize: 100,
          pageNum: this.pageNum
        }
      };
      getShopCarList(params).then(res => {
        Toast.clear();
        ajaxAfter();
        if (res.data.code == 0) {
          ++this.pageNum;
          let recordsTamp = res.data.data.records;
          for (var i in recordsTamp) {
            if (recordsTamp[i].label != null) {
              recordsTamp[i].labelArr = recordsTamp[i].label.split("；");
            }
            if (recordsTamp[i].imgUrl) {
              recordsTamp[i].imgUrls = recordsTamp[i].imgUrl.split(";");
            }

            if (recordsTamp[i].status == 1) {
              recordsTamp[i].inventory = 0;
            }
          }
          this.records = this.records.concat(recordsTamp);
          if (res.data.data.records.length == 0) {
            noData();
          }
          this.noDataFlag = this.records.length == 0 ? true : false;
          
          if(this.records.length == 0){
            this.rightText = '';
          }
        }
        setTimeout(() => {
          this.allSelectFunc();
        }, 100);
      });
    },
    //數量修改
    changeCarNumAjax(carComId, num) {
      var params = {
        header: {},
        body: {
          carComId: carComId,
          num: num
        }
      };
      changeCarNum(params).then(res => {
        if (res.data.code == 0) {
        }
      });
    },
    //添加
    cartAdd(index) {
      if (this.records[index].qty == this.records[index].inventory) {
        Toast("亲，没有这么多库存了");
        return false;
      }
      let addqty = Number(this.records[index].qty);
      addqty += 1;
      this.records[index].qty = addqty;
      this.changeCarNumAjax(this.records[index].id, addqty);
      this.shopCartTotal();
    },
    //減少
    cartSub(index) {
      if (this.records[index].qty == 1) {
        var that = this;
        Dialog.confirm({
          title: "删除",
          message: "确认删除该商品",
          confirmButtonColor: '#ff6e26'
        })
          .then(() => {
            that.delShopCarAjax(that.records[index].id, function() {
              setTimeout(function() {
                that.records.splice(index, 1);
                that.allSelectFunc();
                if (that.records.length == 0) {
                  that.noDataFlag = true;
                }
              }, 400);
            });
          })
          .catch(() => {});
        return false;
      }
      let subqty = Number(this.records[index].qty);
      subqty -= 1;
      this.records[index].qty = subqty;
      this.changeCarNumAjax(this.records[index].id, subqty);
      this.shopCartTotal();
    },
    //修改數量
    numChange(e, index) {
      if (Number(e.target.value) <= 0) {
        this.records[index].qty = 1;
      } else if (Number(e.target.value) > this.records[index].inventory) {
        this.records[index].qty = this.records[index].inventory;
        Toast("亲，没有这么多库存了");
      } else if (
        Number(e.target.value) >= 1 ||
        Number(e.target.value) <= this.records[index].inventory
      ) {
        this.records[index].qty = e.target.value;
      } else {
        this.records[index].qty = 1;
      }
      console.log(e.target.value);
      this.changeCarNumAjax(
        this.records[index].id,
        Number(this.records[index].qty)
      );
      this.shopCartTotal();
    },
    //更改勾选状态
    chooseSelect(index) {
      this.records[index].isSelect = this.records[index].isSelect == 1 ? 0 : 1;
      this.allSelectFunc();
      this.changeSelectAjax(
        this.records[index].id,
        this.records[index].isSelect
      );
      this.shopCartTotal();
    },
    //获取选中数据
    allSelectFunc() {
      console.log(this.records);
      let recordsSelectLength = 0;
      let recordsIsSelectLength = 0;
      let chooseProductArr = [];
      for (let i = 0; i < this.records.length; i++) {
        if (this.records[i].inventory > 0) {
          recordsSelectLength += 1;
        }
        if (this.records[i].isSelect == 1 && this.records[i].inventory > 0) {
          recordsIsSelectLength += 1;
          chooseProductArr.push(this.records[i]);
          this.chooseProductArr = chooseProductArr;
        }
      }
      console.log(recordsSelectLength, recordsIsSelectLength);
      this.cartAllChooseFlag =
        recordsSelectLength == recordsIsSelectLength ? true : false;
      this.shopCartTotal();
    },
    //商品总价
    shopCartTotal() {
      let ids = [];
      let count = 0;
      let shopCartNum = 0;
      for (let i = 0; i < this.records.length; i++) {
        let tmpQty = Number(this.records[i].qty);
        if (this.records[i].inventory > 0 && this.records[i].isSelect == 1) {
          count += this.records[i].price * this.records[i].qty;
          shopCartNum += tmpQty;
        }
      }
      this.count = count.toFixed(2);
      this.shopCartNum = shopCartNum;
    },
    //全选选中取消
    chooseAll() {
      console.log(this.records);
      let ids = [];
      for (let i = 0; i < this.records.length; i++) {
        if (this.records[i].inventory > 0) {
          ids.push(this.records[i].id);
        }
      }

      if (this.cartAllChooseFlag) {
        this.cartAllChooseFlag = false;
        for (let i = 0; i < this.records.length; i++) {
          if (this.records[i].inventory > 0) {
            this.records[i].isSelect = 0;
          }
        }
        this.chooseAllAjax(ids.join(";"), 0);
      } else {
        this.cartAllChooseFlag = true;
        for (let i = 0; i < this.records.length; i++) {
          if (this.records[i].inventory > 0) {
            this.records[i].isSelect = 1;
          }
        }
        this.chooseAllAjax(ids.join(";"), 1);
      }
      this.shopCartTotal();
    },
    //全选选中取消ajax
    chooseAllAjax(ids, isSelect) {
      var params = {
        header: {},
        body: {
          ids: ids,
          isSelect: isSelect
        }
      };
      chooseAll(params).then(res => {
        if (res.data.code == 0) {
        }
      });
    },
    //单个选中
    changeSelectAjax(carComId, flag) {
      var params = {
        header: {},
        body: {
          carComId: carComId,
          flag: flag
        }
      };
      changeSelect(params).then(res => {
        if (res.data.code == 0) {
        }
      });
    },
    //删除商品
    delShopCarAjax(id, backcall) {
      var params = {
        header: {},
        body: {
          id: id
        }
      };
      delShopCar(params).then(res => {
        if (res.data.data) {
          backcall();
        }
      });
    },
    //快速清除失效商品
    cancalProduct() {
      this.getUnEfficacyCommodityAjax();
    },
    getUnEfficacyCommodityAjax() {
      console.log(this.$store.state);
      let params = {
        header: {},
        body: {
          userId: this.$store.state.mall.userId
        }
      };
      this.$api.getUnEfficacyCommodity(params).then(res => {
        if (res.data.code == 0) {
          this.unEfficacyCommodity = res.data.data;
          if (this.unEfficacyCommodity.length > 0) {
            this.shiFlag = true;
          } else {
            this.shiFlag = false;
            Toast("暂无失效商品");
          }
        }
      });
    },
    cancalShi() {
      this.shiFlag = false;
    },
    //确定批量删除商品
    sureShi() {
      let ids = [];
      for (let i in this.unEfficacyCommodity) {
        ids.push(this.unEfficacyCommodity[i].id);
      }
      this.delBatchShopCarAjax(ids);
    },
    //批量删除失效商品
    delBatchShopCarAjax(ids) {
      let that = this;
      let params = {
        header: {},
        body: {
          ids: ids
        }
      };
      this.$api.delBatchShopCar(params).then(res => {
        if (res.data.code == 0 && res.data.data.isSuccess) {
          Toast("删除成功");
          this.shiFlag = false;
          this.records = [];
          this.pageNum = 1;
          this.getShopCarListAjax(
            function() {
              that.loading = false;
            },
            function() {
              that.finished = true;
            }
          );
        } else {
          Toast("删除失败");
        }
      });
    },

    //批量删除
    shopCartDelectBtn() {
      let ids = [];
      for(let i in this.records){
        if(this.records[i].isSelect == 1){
          ids.push(this.records[i].id);
        }
      }
      if(ids.length == 0){
        Toast('请选择需要删除的商品');
        return false;
      }

      Dialog.confirm({
        title: "删除",
        message: "确认删除选中商品？",
        confirmButtonColor: '#ff6e26'
      })
        .then(() => {
          this.delBatchShopCarAjax(ids);
        })
        .catch(() => {});
    },

    //去逛逛
    jumpMall() {
      this.$router.push({ path: "mall", query: {} });
    },

    //获取特推商品
    recommendComListAjax(){
      let params = {
        header: {},
        body: {
          size: 1000,
          current: 1
        }
      }

      this.$api.recommendComList(params).then( res => {
        console.log(res);
        if(res.data.code == 0){
          let recordsTamp = res.data.data.records;
          for (var i in recordsTamp) {
            if (recordsTamp[i].label != null) {
              recordsTamp[i].labelArr = recordsTamp[i].label.split("；");
            }else if (recordsTamp[i].imgUrl) {
              recordsTamp[i].imgUrls = recordsTamp[i].imgUrl.split(";");
            }else if (recordsTamp[i].status == 1) {
              recordsTamp[i].inventory = 0;
            }
          }
          this.specialRecords = this.specialRecords.concat(recordsTamp);
        }
      })
    },
    jumpProductDetail(columnId,id,isRx){
      if(isRx){
        this.$router.push({
          name: 'productDetail',
          params:{
            columnId: columnId,
            id: id,
            shareUserId: 0
          },
          query:{
            isRx: 1
          }
        })
      }else{
        this.$router.push({
          name: 'productDetail',
          params:{
            columnId: columnId,
            id: id,
            shareUserId: 0
          }
        })
      }
    }
  },
  mounted(){
    this.recommendComListAjax();
  }
};
</script>
<style lang="less">
.shopCart-special{
  overflow: hidden;
  padding: 0 20px;
  .shopCart-special-title{
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 30px;
    margin-top: 45px;
    i{
      border-top:  4px solid #aeafb2;
      width: 32px;
    }
    span{
      font-size: 28px;
      color: #666;
      margin: 0 12px;
    }
  }
  .shopCart-special-item{
    width: 50%;
    border-radius: 4px;
    float: left;
    .shopCart-special-padding{
      background: #fff;
      margin:  0  10px 20px;
      .shopCart-special-pic{
        width: 100%;
        height: 335px;
      }
      .shopCart-special-word{
        height: 100px;
        .shopCart-special-name{
          color: #333;
          font-size: 28px;
          line-height: 34px;
          margin-top: 16px;
          padding: 0 15px;
          overflow : hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          word-break: break-all;
          .chu{
            padding: 0px 6px;
            color: #fff;
            background: #ff6e26;
            border-radius: 4px;
            margin-top: 2px;
            font-size: 20px;
            margin-top: -1px;
            margin-right: 10px;
          }
        }
        .shopCart-special-tip{
          padding: 0 15px;
          span{
            display: inline-block;
            border: solid 1px #3ac756;
            color: #3ac756;
            line-height: 1;
            padding: 2px 2px;
            border-radius: 4px;
            font-size: 20px;
            margin-right: 4px;
          }
        }
      }
      .shopCart-special-wrap{
        display: flex;
        padding: 13px 15px 32px;
        align-items: center;
        .shopCart-special-price{
          flex-grow: 2;
          span{
            color: #ff6e26;
            &:first-child{
              font-size: 36px;
              &::before{
                content: '￥';
                font-size: 24px;
                margin-right: -4px;
              }
            }
            &:last-child{
              font-size: 24px;
              margin-left: -8px;
            }
          }
        }
        .shopCart-special-sale{
          flex-shrink: 0;
          font-size: 24px;
          color: #aeafb2;
        }
      }
    } 
  }
}
.title-shopCart {
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
}
.shopCart-title-div {
  height: 102px;
}
.van-button--normal {
  float: left;
}
.shopCart-item {
  margin: 20px 30px 0 30px;
  .shopCart-item-wrap {
    display: flex;
    align-items: center;
    display: -webkit-flex;
    -webkit-align-items: center;
    .shopCart-item-pic {
      width: 160px;
      height: 160px;
      margin-left: 14px;
      flex-shrink: 0;
      -webkit-flex-shrink: 0;
      .shopCart-item-pic-style {
        width: 160px;
        height: 160px;
        border-radius: 8px;
        box-sizing: border-box;
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center;
        position: relative;
        span{
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          z-index: 10;
          color: #fff;
          background: rgba(0,0,0,0.5);
          text-align: center;
          font-size: 24px;
          display: block;
          line-height: 1;
          padding: 8px 0;
          border-radius: 0 0 8px 8px;
        }
      }
    }
    .shopCart-item-main {
      flex-grow: 2;
      margin-left: 16px;
      .shopCart-main-view {
        height: 112px;
        .shopCart-main-name {
            font-size: 28px;
            line-height: 36px;
            color: #333333;
            .span {
              word-break: break-all;
              overflow : hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              &.chu {
                width: 72px;
                font-size: 20px;
                line-height: 1;
                padding: 4px 0;
                background-color: #ff6e26;
                border-radius: 5px;
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
          height: 48px;
          span {
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
      }
    }
  }
}

.van-swipe-cell {
  border-radius: 8px;
}
.shopCart-item-select {
  flex-shrink: 0;
  -webkit-flex-shrink: 0;
  div {
    width: 40px;
    height: 40px;
    display: flex;
    display: -webkit-flex;
  }
}
.shopCart-main-store {
  font-size: 24px;
  letter-spacing: 0px;
  color: #aeafb2;
  margin-right: 15px;
 
}
.shopCart-empty{
  margin-top: -280px;
}
.shopCart-empty span
 {
  display: block;
  border: 1px solid #3ac756;
  height: 72px;
  width: 200px;
  border-radius: 36px;
  color: #3ac756;
  line-height: 70px;
  text-align: center;
  margin: -150px auto 60px;
}
.price-wrap-pre {
  font-size: 24px;
  color: #d2d2d4;
  &:before {
    content: "￥";
    margin-right: -8px;
  }
}
.shopCart-main-step {
  display: flex;
  margin-top: 8px;
  align-items: center;
  .price-wrap-S {
    align-self: flex-end;
  }
  .price-wrap-q {
    display: inline-block;
    width: 112px;
    height: 44px;
    border-radius: 8px;
    border: solid 1px #d2d2d4;
    font-size: 24px;
    font-weight: normal;
    font-stretch: normal;
    line-height: 38px;
    letter-spacing: 0px;
    color: #aeafb2;
    text-align: center;
    line-height: 44px;
    margin-bottom: 6px;
  }
  .price-wrap-current {
    flex-grow: 2;
    -webkit-flex-grow: 2;
    & > span {
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
  .price-wrap-number {
    flex-shrink: 0;
    width: 167px;
    box-sizing: border-box;
    display: flex;
    span {
      border: 1px solid #d2d2d4;
      height: 44px;
      width: 44px;
      line-height: 38px;
      text-align: center;
      display: inline-block;
      box-sizing: border-box;
      &:first-child {
        border-radius: 8px 0 0 8px;
        &:before {
          content: "-";
          color: #d2d2d4;
        }
      }
      &:last-child {
        border-radius: 0 8px 8px 0;
        &:before {
          content: "+";
          color: #d2d2d4;
        }
      }
    }
    input {
      width: 74px;
      height: 44px;
      line-height: 30px;
      padding-top: 8px;
      border-top: 1px solid #d2d2d4;
      border-bottom: 1px solid #d2d2d4;
      box-sizing: border-box;
      text-align: center;
      color: #666666;
      appearance: none;
      font-size: 28px;
      border-radius: 0;
    }
  }
}
.van-stepper__input {
  margin: 0;
  width: 69px;
  height: 44px;
  border-top: 1px solid #d2d2d4;
  border-bottom: 1px solid #d2d2d4;
  background: #fff;
}
.van-stepper__minus,
.van-stepper__plus {
  height: 44px;
  width: 44px;
  border: 1px solid #d2d2d4;
  background: #fff;
}
.van-stepper__minus:before,
.van-stepper__plus:before {
  width: 22px;
  text-align: center;
  margin-left: 10px;
}
.van-stepper__minus:after,
.van-stepper__plus:after {
  height: 20px;
}
.van-stepper__minus:after,
.van-stepper__minus:before,
.van-stepper__plus:after,
.van-stepper__plus:before {
  content: "sdfk";
}
.van-swipe-cell__right {
  display: flex;
  align-items: center;
  background-color: #f44;
}
.shopCart-div {
  height: 132px;
}
.shopCart-fixed {
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 10;
  width: 100%;
  background: #fff;
  height: 112px;
  display: flex;
  display: -webkit-flex;
  align-items: center;
  -webkit-align-items: center;
  box-sizing: border-box;
  .shopCart-fixed-pic {
    flex-grow: 2;
    display: flex;
    display: -webkit-flex;
    padding-top: 6px;
    div {
      width: 40px;
      height: 40px;
      margin-left: 30px;
    }
    span {
      display: inline-block;
      height: 40px;
      line-height: 1;
      padding: 8px 0;
      color: #666;
      margin-left: 10px;
      font-size: 28px;
    }
  }
  .shopCart-fixed-other {
    flex-grow: 2;
    display: flex;
    justify-content: flex-end;
  }
  .shopCart-fixed-price {
    span {
      &:first-child {
        line-height: 76px;
        display: inline-block;
        color: #666666;
      }
      &:last-child {
        font-size: 36px;
        line-height: 48px;
        color: #ff6e26;
        line-height: 80px;
        &:before {
          content: "￥";
          margin-right: -4px;
          font-size: 33px;
        }
      }
    }
  }
  .shopCart-fixed-go {
    width: 180px;
    height: 80px;
    background-image: linear-gradient(90deg, #ffaf41 0%, #ff8441 100%),
      linear-gradient(#f89283, #f89283);
    background-blend-mode: normal, normal;
    border-radius: 40px;
    font-size: 28px;
    letter-spacing: 0px;
    color: #ffffff;
    text-align: center;
    line-height: 80px;
    margin-right: 30px;
    margin-left: 11px;
  }
  .shopCart-cancel {
    flex-shrink: 0;
    & > span:first-child {
      display: inline-block;
      width: 268px;
      height: 80px;
      border: 1px solid #ff8441;
      border-radius: 40px;
      text-align: center;
      line-height: 78px;
      color: #ff8441;
      font-size: 28px;
    }
    & > span:last-child {
      display: inline-block;
      width: 160px;
      height: 80px;
      font-size: 28px;
      background-image: linear-gradient(90deg, #ffaf41 0%, #ff8441 100%),
        linear-gradient(#f89283, #f89283);
      background-blend-mode: normal, normal;
      border-radius: 40px;
      text-align: center;
      line-height: 78px;
      color: #fff;
      margin-right: 30px;
    }
  }
}
.van-cell {
  padding: 16px 24px;
}
.shopCart .van-cell:not(:last-child):after {
  border-bottom: none;
}
.shopCart-shi {
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 100;
  height: 100%;
  width: 100%;
  background: rgba(0, 0, 0, 0.5);
  .shopCart-shi-wrap {
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 101;
    width: 100%;
    height: 778px;
    background: #fff;
    border-radius: 32px 32px 0 0;
    .shopCart-shi-title {
      text-align: center;
      font-size: 32px;
      color: #333;
      margin-top: 35px;
    }
    .shopCart-shi-num {
      text-align: center;
      font-size: 28px;
      color: #666;
      margin-top: 21px;
    }
    .shopCart-shi-main {
      overflow-y: auto;
      display: flex;
      flex-wrap: wrap;
      margin-top: 12px;
      margin-left: 30px;
      height: 540px;
      -webkit-overflow-scrolling: touch;
      .shopCart-shi-item {
        margin-top: 20px;
        margin-left: 20px;
        position: relative;
        height: 148px;
        width: 148px;
        div {
          height: 148px;
          width: 148px;
          border-radius: 8px;
        }
        span {
          position: absolute;
          bottom: 0;
          left: 0;
          display: inline-block;
          width: 100%;
          line-height: 48px;
          color: #fff;
          background: rgba(0, 0, 0, 0.6);
          font-size: 24px;
          text-align: center;
          border-radius: 0 0 8px 8px;
        }
      }
    }
    .shopCart-shi-bottom {
      position: absolute;
      bottom: 0;
      left: 0;
      z-index: 2004;
      width: 100%;
      height: 112px;
      display: flex;
      justify-content: center;
      align-items: center;
      span {
        width: 200px;
        height: 80px;
        display: inline-block;
        border-radius: 40px;
        margin: 0 20px;
        &:first-child {
          border: 1px solid #ff8441;
          color: #ff8441;
          line-height: 78px;
          text-align: center;
        }
        &:last-child {
          width: 200px;
          height: 80px;
          background-image: linear-gradient(90deg, #ffaf41 0%, #ff8441 100%),
            linear-gradient(#f89283, #f89283);
          background-blend-mode: normal, normal;
          border-radius: 40px;
          color: #fff;
          text-align: center;
          line-height: 80px;
        }
      }
    }
  }
}
</style>
 