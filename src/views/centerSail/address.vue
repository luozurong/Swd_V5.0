<template>
  <div class="content">
    <div class="wrapper" v-if="payFlag">
      <div class="centerSail">
        <van-cell-group class="form">
          <van-field v-model="name" label="收货人" placeholder="请输入姓名" class="uname setline" clearable/>
          <van-field v-model="phone" class="setline" label="收货手机" placeholder="请输入收货人联系方式" clearable/>
          <van-field v-model="address" class="setline" label="收货地址" placeholder="请选择" right-icon="arrow" @click="showPopup()" disabled/>
          <van-field v-model="detail" label="详细地址" type="textarea" rows="2" placeholder="请输入详细地址" autosize class="detail" clearable/>
        </van-cell-group>
      </div>
      <div class="save" :class="{'active': isActive}"  @click="save">保存</div>
      <van-popup 
        v-model="show"
        position="bottom"
        :style="{ height: '38%' }"
      >
        <van-area 
          :area-list="areaList" 
          :value="region"
          @confirm="ok"
          @cancel="cancel()"
        />    
      </van-popup>
    </div>
    <div class="pay" v-else>
        <div class="pay-img">
          <img src="../../assets/img/centerSail/pay.png" alt="">
        </div>
        <div class="pay-des">填写下单信息成功！</div>
    </div>
  </div>
</template>
<script>

import Vue from 'vue'
import areaList from '../../../static/js/area.js'
import { getDeliveryInfo, saveDeliveryInfo, newOrder } from '../../api/centerSail.js'
import { Cell, CellGroup, Popup, Field, Switch, Icon, Area, Dialog } from 'vant'
import {mallInfo} from '../../assets/js/common.js'
export default {
  components: {// 这样加载的VanCellGroup不会报错
    VanCell: Cell,
    VanCellGroup: CellGroup,
    VanField: Field,
    VanSwitch: Switch,
    VanIcon: Icon,
    VanArea: Area,
    VanPopup: Popup,
    [Dialog.Component.name]: Dialog.Component,
  },
  name: 'addressEdit',
  data() {
    return {
      payFlag: true,
      areaList: areaList,
      orderId:'', // 订单id
      id: null, // 购物车id
      name: '', // 姓名
      phone: '', // 联系方式
      address: '', // 所在区域
      detail: '', // 详细地址
      isActive: false, // 保存按钮状态
      show: false, // 弹框
      region: '' ,// 地址
      allRegion: [],
      saveFlag: true
    }
  },
  mounted(){
    this.orderId = this.$route.query.orderId;
    this.getDeliveryInfo();
  },
  watch:{
    name(){
      let returnFlag = this.submitFunc();
      if(returnFlag) 
        this.isActive = true;
      else
       this.isActive = false;
    },
    phone(){
      let returnFlag = this.submitFunc();
      if(returnFlag) 
        this.isActive = true;
      else
       this.isActive = false;
    },
    address(){
      let returnFlag = this.submitFunc();
      if(returnFlag) 
        this.isActive = true;
      else
       this.isActive = false;
    },
    detail(){
      let returnFlag = this.submitFunc();
      if(returnFlag) 
        this.isActive = true;
      else
       this.isActive = false;
    }
  },
  methods: {
    getDeliveryInfo() { // 获取默认地址
      const that = this;
      let params = { 
            orderId: this.orderId
        }  
      getDeliveryInfo(params).then( res => {
        if(res.data.code === 0) {
          const data = res.data.data;
            if(data.id) {
              this.id = data.id;
              this.name = data.receivingName;
              this.phone = data.phone;
              this.address = `${data.provinceName}/${data.cityName}/${data.districtName}`;
              this.detail = data.address;
              this.region = data.district.toString();
              this.allRegion = [
                {name: data.provinceName, code: data.province},
                {name: data.cityName, code: data.city},
                {name: data.districtName, code: data.district},
              ]
            }
          }
      }).catch( err => {
          console.log(err);
        })
    },
    save() { // 保存
      if(!this.isActive){
        return false;
      }
      if(!this.saveFlag){
        return false;
      }
      this.saveFlag = false;
      const that = this;
      let param = {
          receivingName: this.name,
          phone: this.phone,
          province: this.allRegion[0].code,
          city: this.allRegion[1].code,
          district: this.allRegion[2].code,
          provinceName: this.allRegion[0].name,
          cityName: this.allRegion[1].name,
          districtName: this.allRegion[2].name,
          address: this.detail,
          orderId: this.orderId,
          id: this.id
      };
          saveDeliveryInfo(param).then( res => {
            if(res.data.code === 0) {
              that.payFlag = false;
              that.saveFlag = true;
            }
          }).catch( err => {
          console.log(err);
        })
    },
    showPopup() {
      this.show = true;
    },
    ok(val) { // 弹框确认
      this.show = false;
      let localtion = [];
      this.allRegion = val;
      val.forEach(element => {
        localtion.push(element.name)
      });
      this.address = localtion.join('/');
    },
    cancel() { // 弹框取消
      this.show = false;
    },
    submitFunc(val){
      if( this.name.length > 25 || this.name.length < 1) {
          return false;
      }

      if((!(/^1[3456789]\d{9}$/.test(this.phone)))) {
        return false;
      }

      if(this.address == '') {
        return false;
      }

      if(this.detail.length < 1) {
        return false;
      }
      return true;
    },
  }
}
</script>
<style lang="less" scoped>
.wrapper {
  background:rgba(246,248,250,1);
  padding-bottom: 150px; 
  // position: relative;
  // margin-top: 90px;
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
    border-bottom: .5px solid rgba(235,235,235,.8);
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
    .delete {
      position: absolute;
      display: flex;
      width: 100px;
      height: 28px;
      font-size: 28px;
      line-height: 30px;
      top: 30px;
      right: 30px;
      color: #FF6E26;
    }
  }
  .centerSail {
    background-color: #fff;
    .form {
      margin-right: 31px;
      .setline {
        height: 112px;
        box-sizing: border-box;
        padding-top: 32px;
        padding-bottom: 32px;
      }
    }
  }
  .block {
    width: 100%;
    height: 20px;
    background:rgba(246,248,250,1);
  }
  .default {
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    font-size: 28px;
    width:750px;
    height:112px;
    padding: 0 40px 0 30px;
    .check {
      font-size: 40px!important;
    }
  }
  .save {
    position: fixed;
    width:600px;
    height:80px;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    font-size:32px;
    text-align: center;
    line-height: 80px;
    color:rgba(255,255,255,1);
    background:rgba(188,35,38,1);
    border-radius:40px;
    opacity: 0.6;
  }
  .active {
    opacity: 1;
  }
  .van-field__control:disabled {
    color: #323233;
  }
}
.pay {
  .pay-img {
    margin-left: 50%;
    margin-top: 100px;
    transform: translateX(-75px);
    img {
      height: 150px;
      width: 150px;
    }
  }
  .pay-des {
    margin-top: 15px;
    font-size: 32px;
    font-weight: bold;
    text-align: center;
  }
}
</style>
<style>
.centerSail .van-field__label{
  font-size: 28px!important;
  width: 165px;
}
.uname .van-field__label{
  letter-spacing: 15px;
}
.centerSail .van-hairline--top-bottom:after {
  border-width: 0;
}
.centerSail .van-field__control:disabled {
    color: #323233;
}
.centerSail .van-cell {
  /* line-height: 112px; */
}
.centerSail .van-field__control {
  font-size:28px;
}
.centerSail .detail.van-cell {
  padding-top: 40px;
  line-height: 1.5;
  padding-bottom: 60px;
}
.centerSail .detail .van-cell__value {
  /* padding-top: 4px; */
}
</style>



