<template>
  <div class="requirementList">
    <van-nav-bar
      class="title-shopCart"
      title="需求清单"
      :right-text="rightText"
      left-arrow
      @click-left="onClickLeft"
      @click-right="onClickRight" 
    ></van-nav-bar>
    <div style="height:46px;"></div>
    <!-- 列表信息 -->
    <van-list
      v-if="!noDataFlag"
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
    <div class="shopCart-item" v-for="(item,index) in getRequirementListArr" :key="index" >
    <van-swipe-cell :on-close="onClose" :name="index" :ref="'ref'+index">
      <van-cell>
      <div class="shopCart-item-wrap"  >
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
        <div class="shopCart-item-pic" @click="jumpProductDetail(item.columnId,item.comId)">
          <div class="shopCart-item-pic-style" :style="{backgroundImage: 'url('+ item.imgUrl +')'}">
              <span v-if="item.inventory == 0 && item.status == 0">缺货</span>
              <span v-if="item.inventory == 0 && item.status == 1">下架</span>
          </div>
        </div>
        <div class="shopCart-item-main">
          <div class="shopCart-main-view">
            <div class="shopCart-main-name">
              <span class="chu" v-if="item.isRx == 1">处方药</span>
              <span v-text="item.name"></span>
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
            <div class="shopCart-main-price" v-if="!item.columnId && item.salePrice">
              <span class="price-wrap-current">
                <span>{{item.salePrice | pricePre}}</span>
                <span>{{item.salePrice | priceNext}}</span>
              </span>
              <s>{{item.price}}</s>
            </div>
            <div class="shopCart-main-price" v-if="!item.columnId && !item.salePrice">
              <span class="price-wrap-current">
                <span>{{item.price | pricePre}}</span>
                <span>{{item.price | priceNext}}</span>
              </span>
            </div>
            <div class="shopCart-main-price" v-if="item.columnId && item.specialPrice">
              <span class="price-wrap-current">
                <span>{{item.specialPrice | pricePre}}</span>
                <span>{{item.specialPrice | priceNext}}</span>
              </span>
              <s>{{item.price}}</s>
            </div>
            <div class="shopCart-main-price" v-if="item.columnId && !item.specialPrice">
              <span class="price-wrap-current">
                <span>{{item.price | pricePre}}</span>
                <span>{{item.price | priceNext}}</span>
              </span>
            </div>
            <div class="price-wrap-number" v-if="item.inventory">
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
    <!-- 固定栏 -->
    <div class="shopCart-fixed requirementList-fixed" v-if="!noDataFlag">
      <div class="shopCart-fixed-pic" @click="chooseAll()" v-show="rightFlag">
        <div v-if="cartAllChooseFlag">
          <img :src="cartselect">
        </div>
        <div v-if="!cartAllChooseFlag">
          <img :src="cartnor">
        </div>
        <span>全选</span>
      </div>
      <div class="shopCart-cancel" v-show="rightFlag">
        <span @click="cancalProduct">快速清理失效商品</span>
        <span @click="shopCartDelectBtn">删除</span>
      </div>
      <div class="shopCart-fixed-picimg" v-show="!rightFlag">
        <div>
          已选商品总数:{{shopCartNum}}
        </div>
      </div>
      <div class="shopCart-fixed-other" v-show="!rightFlag">
        <div class="shopCart-fixed-price">
          <span>总计</span>
          <span>{{count}}</span>
        </div>
        <div class="shopCart-fixed-go"  @click="goOrderConfirm()">提交药品单</div>
      </div>
    </div>
    <!-- 缺省 -->
    <no-data v-if="noDataFlag"/>
    <div class="shopCart-div"></div>
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
import { chooseAll } from '../../api/api';

export default {
  name: "requirementList",
  data() {
    return {
      cartselect,
      cartnor,
      cartdisable,
      noDataFlag: false,
      loading: false,
      finished: false,
      count: 0,
      shopCartNum: 0,
      rightText: '',
      getRequirementListArr: [],
      rightFlag: false,
      cartAllChooseFlag: false,
      pageNum: 1,
      time: 5,
      incoListWord: '',  //配伍禁忌提示
    };
  },
  components:{
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
  methods: {
    onClickLeft() {
        this.$router.back();
    },
    onClose(clickPosition, instance, detail) {
      if (clickPosition != "right") return false;
      var i = detail.name;
      console.log(i);
      var that = this;
      Dialog.confirm({
        title: "删除",
        message: "确认删除该商品"
      })
        .then(() => {
          that.delRequirement(i,function(){
            instance.close();
          })
        })
        .catch(() => {
          instance.close();
        });
    },
    //删除商品
    delRequirement(i,backCall){
      let that = this;
      let params = {
        header: {},
        body: {
          id: that.getRequirementListArr[i].id
        }
      }
      that.$api.delRequirement(params).then( res => {
        setTimeout(function() {
          that.getRequirementListArr.splice(i, 1);
          that.requiremantTotal();
          if (that.getRequirementListArr.length == 0) {
            that.noDataFlag = true;
            if(that.getRequirementListArr.length == 0){
              that.rightText = '';
            }
          }
        }, 400);
        backCall();
      });
    },
    onClickRight(){
      return false;
      if (this.rightFlag) {
        this.rightFlag = false;
        this.rightText = "编辑";
      } else {
        this.rightFlag = true;
        this.rightText = "完成";
      }
    },
    chooseSelect(index) {
      let num = 0;
      for(let i in this.getRequirementListArr){
        if(this.getRequirementListArr[i].isSelect == 1 && this.getRequirementListArr[i].inventory > 0){
          num += 1;
        }
      }
      if(num < 5){
          var getRequirementListArrTamp = this.getRequirementListArr;
          var isSelect = getRequirementListArrTamp[index].isSelect ? 0 : 1;  
          if(isSelect == 0){
             this.requirementListChangeSelect(getRequirementListArrTamp[index].id,isSelect,index);
          }else{
            //let getRequirementListArrTamp = this.getRequirementListArr;
            //getRequirementListArrTamp[index].isSelect = 1;
            let ids = []
            for(let i in getRequirementListArrTamp){
              if(getRequirementListArrTamp[i].isSelect == 1){
                ids.push(getRequirementListArrTamp[i].comId);
              }
            }
            ids.push(getRequirementListArrTamp[index].comId)
            this.queryRxDrugs(ids,index);
          }

      }else {
        if(this.getRequirementListArr[index].isSelect == 1){
          let isSelect = this.getRequirementListArr[index].isSelect ? 0 : 1;   
          this.requirementListChangeSelect(this.getRequirementListArr[index].id,isSelect,index)
        }else{
          Toast("最多只能勾选5种药品！");
          return false;
        }
      }
    },
    //减少数量
    cartSub(index) {
      let that = this;
      let subqty = Number(this.getRequirementListArr[index].qty);
      if(subqty == 1){
        Dialog.confirm({
          title: "删除",
          message: "确认删除该商品"
        })
        .then(() => {
          that.delRequirement(index,function(){})
        })
        .catch(() => {
          
        });
        return false;
      }
      subqty -= 1;
      this.getRequirementListArr[index].qty = subqty;
      this.changeRequirementNum(this.getRequirementListArr[index].id,subqty)
    },
    //增加数量
    cartAdd(index) {
      let addqty = Number(this.getRequirementListArr[index].qty);
      if( !this.getRequirementListArr[index].maxQuantity || addqty < this.getRequirementListArr[index].maxQuantity){
        addqty += 1;
        if(this.getRequirementListArr[index].qty < this.getRequirementListArr[index].inventory){
          this.getRequirementListArr[index].qty = addqty;
          this.changeRequirementNum(this.getRequirementListArr[index].id,addqty)
        }else{
          Toast("亲，没有这么多库存了")
          return false;
        }
      }else{
        Toast(`药品的最大数量不能超过${this.getRequirementListArr[index].maxQuantity}个`)
        return false
      } 
    },
    //修改数量
    numChange(e,index) {
      if (Number(e.target.value) <= 0) {
        this.getRequirementListArr[index].qty = 1;
      } else if (Number(e.target.value) > this.getRequirementListArr[index].inventory) {
        this.getRequirementListArr[index].qty = this.getRequirementListArr[index].inventory;
        Toast("亲，没有这么多库存了");
      } else if (
        Number(e.target.value) >= 1 ||
        Number(e.target.value) <= this.getRequirementListArr[index].inventory
      ) {
        this.getRequirementListArr[index].qty = e.target.value;
      } else {
        this.getRequirementListArr[index].qty = 1;
      }
      if(this.getRequirementListArr[index].maxQuantity && Number(e.target.value) > this.getRequirementListArr[index].maxQuantity){
        this.getRequirementListArr[index].qty = this.getRequirementListArr[index].maxQuantity;
        Toast(`药品的最大数量不能超过${this.getRequirementListArr[index].maxQuantity}个`)
      }
  
      this.changeRequirementNum(
        this.getRequirementListArr[index].id,
        Number(this.getRequirementListArr[index].qty)
      );
      this.requiremantTotal();
    },
    //修改数量请求
    changeRequirementNum(carComId, num){
      var params = {
        header: {},
        body: {
          carComId: carComId,
          num: num
        }
      };
      this.$api.changeRequirementNum(params).then(res => {
        if (res.data.code == 0) {
          this.requiremantTotal();
        }
      });
    },
    onLoad(){
      setTimeout(()=>{
        this.time = 1000;
        this.getRequirementList(()=>{
          this.loading = false;
          this.finished = false;
        },()=>{
            this.loading = false;
            this.finished = true;
        });
      },this.time)
    },
    //清单列表
    getRequirementList(backCall,backOverCall){
      let that = this;
      let params = {
        header: {},
        body: {
          userId: this.$store.state.mall.userId,
          pageSize: 10,
          pageNum: this.pageNum
        }
      }
      this.$api.getRequirementList(params).then(res => {
        if(res.data.code == 0){
          let recordsTamp = res.data.data.records;
          for (var i in recordsTamp) {
            //过滤标签
            if (recordsTamp[i].label != null) {
              recordsTamp[i].labelArr = recordsTamp[i].label.split("；");
            }
            //缩略图
            if (recordsTamp[i].imgUrl) {
              recordsTamp[i].imgUrls = recordsTamp[i].imgUrl.split(";")[0];
            }
            if (recordsTamp[i].status == 1) {
              recordsTamp[i].inventory = 0;
            }
          }
          this.getRequirementListArr = this.getRequirementListArr.concat(recordsTamp);
          this.noDataFlag = this.getRequirementListArr.length == 0 ? true : false;
          this.requiremantTotal();
          //分页加载
          if(recordsTamp.length < 10){    
             backOverCall()
          }else{
            this.pageNum += 1;
            backCall()  
          }
        }
      })
    },
    //保存选择状态
    requirementListChangeSelect(id,isSelect,index){
      var params = {
        header: {},
        body: {
          carComId: id,
          flag: isSelect
        }
      };
      this.$api.requirementListChangeSelect(params).then(res => {
        if (res.data.code == 0 && res.data.data.isSuccess) {
          this.getRequirementListArr[index].isSelect = isSelect;
          this.requiremantTotal();
        }
      });
    },
    //选择商品
    chooseAll(){
      let comList = [];
      for (let i = 0; i < this.getRequirementListArr.length; i++) {
        if (this.getRequirementListArr[i].inventory > 0 && this.getRequirementListArr[i].isSelect == 1) {
          let comListArr = {
            comId: this.getRequirementListArr[i].comId,
            columnId: this.getRequirementListArr[i].columnId,
            qty: this.getRequirementListArr[i].qty
          };
          comList.push(comListArr);
        }
      }

      if (comList.length == 0) {
        Toast("请选择需要购买的商品");
        return false;
      }else if(comList.length > 5){
        Toast("最多只能勾选5种药品！");
        return false;
      }

      sessionStorage.setItem("comListTamp", JSON.stringify(comList));
      sessionStorage.setItem("message", "");
      sessionStorage.setItem('patient','');
      this.$router.push({
        path: "orderConfirm",
        query: { 
          isDeleteShopCartProduct: 1,
          isRx: 1,
          //userId: this.$store.state.mall.userId 
        }
      });
    },
    //提交药品清单
    goOrderConfirm(){
      this.chooseAll();
    },
    requiremantTotal() {
      let ids = [];
      let count = 0;
      let shopCartNum = 0;
      for (let i = 0; i < this.getRequirementListArr.length; i++) {
        let tmpQty = Number(this.getRequirementListArr[i].qty);
        if (this.getRequirementListArr[i].inventory > 0 && this.getRequirementListArr[i].isSelect == 1) {
          count += this.getRequirementListArr[i].price * this.getRequirementListArr[i].qty;
          shopCartNum += tmpQty;
        }
      }
      this.count = count.toFixed(2);
      this.shopCartNum = shopCartNum;
    },
    //跳转到商品详情
    jumpProductDetail(columnId,id){
      var columnIdTamp = '-1';
      if(columnId){
        columnIdTamp = columnId
      }
     this.$router.push({
        name: 'productDetail',
        params:{
          columnId: columnIdTamp,
          id: id,
          shareUserId: 0
        },
        query:{
          isRx: 1
        }
      })
    },
    queryRxDrugs(commodityIds,index){
      let params = {
        header: {},
        body: {
          commodityIds: commodityIds
        }
      }
      this.$api.queryRxDrugs(params).then(res => {
        if(res.data.code == 0){
          let queryRxDrugsTamp = res.data.data;
          for(let i in queryRxDrugsTamp){
            let apDrugName = queryRxDrugsTamp[i].apDrugName;
            if(queryRxDrugsTamp[i].preCheck != null && queryRxDrugsTamp[i].preCheck.incoList.length > 0){
              for(let j in queryRxDrugsTamp[i].preCheck.incoList){       
                for(let k in queryRxDrugsTamp){
                  if((i != k) && (queryRxDrugsTamp[i].preCheck.incoList[j].incoDrugName == queryRxDrugsTamp[k].apDrugName)){
                    Toast(queryRxDrugsTamp[k].apDrugName+ '与'+queryRxDrugsTamp[i].preCheck.incoList[j].apDrugName + "存在禁忌");
                    return false;
                  }
                }
              }
            }
          }
          this.requirementListChangeSelect(this.getRequirementListArr[index].id,1,index);
        }
      })
    },
    cancalProduct(){

    },
    shopCartDelectBtn(){

    }
  },
  mounted() {
    
  }
};
</script>
<style lang="less" scoped>
.title-shopCart {
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
}
.requirementList{
  .shopCart-item{
    margin: 20px 30px 0;
  }
  .van-cell{
    padding: 0;
    background: transparent;
  }
  .van-swipe-cell__wrapper{
    padding-top: 20px;
  }
  .van-swipe-cell__right{
    top: 20px;
  }
  .van-button--square{
    height: 100%;
  }
}
.shopCart-item-wrap {
    display: flex;
    align-items: center;
    display: -webkit-flex;
    -webkit-align-items: center;
    background: #fff;
    //margin: 20px 30px 0;
     padding: 32px 0;
    .shopCart-item-select {
        flex-shrink: 0;
        -webkit-flex-shrink: 0;
        div {
        width: 40px;
        height: 40px;
        margin-left: 25px;
        display: flex;
        display: -webkit-flex;
        }
    }
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
            span {
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100%;
                z-index: 10;
                color: #fff;
                background: rgba(0, 0, 0, 0.5);
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
                span {
                    word-break: break-all;
                    &.chu {
                        width: 72px;
                        line-height: 1;
                        font-size: 20px;
                        line-height: 28px;
                        background-color: #ff6e26;
                        border-radius: 4px;
                        display: inline-block;
                        color: #fff;
                        text-align: center;
                        float: left;
                        margin-top: 3px;
                        margin-right: 10px;
                        padding: 1px 4px;
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
    &:last-child{
      margin-bottom: 0 !important;
    }
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
    .shopCart-main-price{
      flex-grow: 2;
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
        flex-shrink: 0;
        -webkit-flex-shrink: 0;
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
        s{
        flex-grow: 2;
        margin-left: 10px;
        color: #aaa;
        &::before{
          content: "￥";
          margin-right: -4px;
        }
      }
    }
    
    
    
    
    .price-wrap-number {
        flex-shrink: 0;
        width: 167px;
        box-sizing: border-box;
        display: flex;
        margin-right: 21px;
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
                font-size: 32px;
                line-height: 36px;
                }
            }
            &:last-child {
                border-radius: 0 8px 8px 0;
                &:before {
                content: "+";
                color: #d2d2d4;
                font-size: 32px;
                line-height: 44px;
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
            .shopCart-fixed-picimg {
              flex-grow: 2;
              display: flex;
              display: -webkit-flex;
              padding-top: 6px;
              div {
              color: #333;
              margin-left: 30px;
               font-size: 28px;
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
                  font-size: 28px;
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
              width: 200px;
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
}
.shopCart-div {
    height: 132px;
}
.requirementList-fixed{
  display: flex;
  justify-content: flex-end;
  .shopCart-cancel {
    flex-shrink: 0;
    span:first-child {
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
    span:last-child {
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

</style>