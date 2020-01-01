<template>
  <div>
    <van-nav-bar class="title-shopCart"
      title="订单详情"
      left-arrow
      @click-left="onClickLeft"
    />
    <div style="height:46px;"></div>
    <div class="pay-order">
      <div>
        <span>订单编号</span>
        <span>SC456541235475314</span>
      </div>
      <div>
        <span>订单时间</span>
        <span>2019/07/25 12:23:21</span>
      </div>
      <div>
        <span>订单金额</span>
        <span class="pay-count">¥26.12</span>
      </div>
    </div>
    <div class="pay-type">
      <div class="pay-type-title">选择支付方式</div>
      <div v-for="(item,index) in chooseAttr" :key="index">
        <div class="pay-type-left"><img :src="item.icon" alt=""></div>
        <span v-text="item.name"></span>
        <span v-if="index == 0" class="pay-yue-money">（当前余额12.21元）</span>
        <div class="pay-type-right">
          <div v-if="index == 0">
            <span v-if="isHaveMoneyFlag" class="pay-yue-nomoney">余额不足</span>
            <div v-if="!item.flag && !isHaveMoneyFlag"><img @click="selectPay(item.value)"  :src="cartnor" alt=""></div>
            <div v-if="item.flag  && !isHaveMoneyFlag"><img @click="selectPay(item.value)"  :src="cartselect" alt=""></div>
          </div>
          <div v-if="index != 0">
            <div v-if="!item.flag"><img @click="selectPay(item.value)" :src="cartnor" alt=""></div>
            <div v-if="item.flag"><img @click="selectPay(item.value)" :src="cartselect" alt=""></div>
          </div>
        </div>
      </div>
    </div>
    <div class="pay-fixed">
      <span>去支付</span>
    </div>
  </div>
</template>
<script>
import cartselect from '../../assets/img/mall/cart-select.png'
import yue from '../../assets/img/mall/yue.png'
import alipay from '../../assets/img/mall/alipay.png'
import wechat from '../../assets/img/mall/wechat.png'
import cartnor from '../../assets/img/mall/cart-nor.png'
export default {
  name: 'pay',
  data(){
    return{
      cartselect,
      yue,
      alipay,
      wechat,
      cartnor,
      chooseAttr:[
        {
          flag: false,
          value: 0,
          icon: yue,
          name: '余额'
        },
        {
          flag: false,
          value: 1,
          icon: wechat,
          name: '微信'
        },{
          flag: false,
          value: 2,
          icon: alipay,
          name: '支付宝'
        }
      ],
      isHaveMoneyFlag: false,
      payType: null
    }
  },
  methods:{
    onClickLeft(){
      this.$router.back(-1);
    },
    selectPay(value){
      for(var i = 0; i < this.chooseAttr.length;i++){
        this.chooseAttr[i].flag = false;
      }
      if(this.chooseAttr[value].flag){
        this.chooseAttr[value].flag = false;
      }else{
        this.chooseAttr[value].flag = true;
      }
      this.pageType = value;
    }
  }
}
</script>
<style lang="less">
  .title-shopCart{
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
  }
  .pay-order{
    margin: 20px 30px;
    background: #fff;
    border-radius: 8px;
    padding-bottom: 31px;
    div{
      padding-top: 31px;
      margin-left: 22px;
      span{
        font-size: 28px;
        &:first-child{
          color: #666;
        }
        &:last-child{
          color: #aeafb2;
          margin-left: 24px;
          &.pay-count{
            color: #ff6e26;
          }
        }
      }
    }
  }
  .pay-type{
    margin: 0 30px;
    background: #fff;
    border-radius: 8px;
    &>div{
      display: flex;
      display: -webkit-flex;
      padding-top: 27px;
      padding-bottom: 28px;
      margin: 0 25px 0 22px;
      border-bottom: 1px solid #e6e6e6;
      font-family: 'PingFang-SC-Regular';
      font-size: 28px;
      .pay-type-left{
        width: 67px;
        height: 67px;
        flex-shrink: 0;
        margin-right: 13px;
      }
      &>span{
        display: inline-block;
        height: 67px;
        line-height: 67px;
        flex-shrink: 0;
        color: #333333;
        font-size: 28px;
        font-family: 'PingFang-SC-Regular';
      }
      .pay-type-right{
        flex-grow: 2;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        div{
          div{
            width: 40px;
            height: 40px;
            float: right;
          }
        }
      }
      .pay-yue-money{
        color: #aeafb2;
        font-size: 28px;
      }
      .pay-yue-nomoney{
        color: #ff6e26;
        font-size: 24px;
      }
    }
  }
  .pay-type-title{
    line-height: 38px;
  }
  .pay-type>div:last-child{
    border-bottom: none;
  }
  .pay-fixed{
    position: fixed;
    bottom: 35px;
    left: 0;
    z-index: 10;
    width: 100%;
    display: flex;
    justify-content: center;
    display: -webkit-flex;
    -webkit-justify-content: center;
    span{
      display: inline-block;
      color: #fff;
      text-align: center;
      line-height: 80px;
      width: 600px;
      height: 80px;
      font-size: 28px;
      background-image: linear-gradient(90deg, #ffaf41 0%, #ff8441 100%), 
      linear-gradient( #f89283, #f89283);
      background-blend-mode: normal,normal;
      border-radius: 40px;
    }
  }
</style>