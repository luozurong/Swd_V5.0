<template>
  <div class="wrapper">
    <div class="tabar">
      <div  class="back" @click="goBack()">
        <img src="../../assets/img/mall/back.png" alt="返回">
      </div>
      <div class="title">{{showNav.title}}</div>
      <div class="delete" v-show=" $route.params.id != 0" @click="deleteAddr()">
        <van-icon name="delete" />
        &nbsp;删除
      </div>
    </div>
    <div class="addr">
      <van-cell-group class="form">
        <van-field v-model="name" label="姓名" placeholder="请输入用户名" class="uname setline" @blur="validate('name')"/>
        <van-field v-model="phone" class="setline" label="联系方式" placeholder="请输入联系方式" @blur="validate('phone')"/>
        <van-field v-model="address" class="setline" label="所在区域" placeholder="请选择区域" right-icon="arrow" @click="showPopup()" disabled/>
        <van-field v-model="detail" label="详细地址" type="textarea" rows="2" placeholder="请输入详细地址" autosize class="detail" @blur="validate('detail')"/>
      </van-cell-group>
      <div class="block"></div>
      <div class="default">
        <span>设为默认地址</span>
        <van-switch
          v-model="checked"
          active-color="#07c160" 
          inactive-color="#fff"
          class="check"
        />
      </div>
    </div>
    <div class="save" v-if="$route.params.id == 0" :class="{'active': isActive}"  @click="save('save')">保存</div>
    <div class="save" v-if="$route.params.id != 0" :class="{'active': isActive}"  @click="save('edit')">保存</div>
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
</template>
<script>

import Vue from 'vue'
import areaList from '../../../static/js/area.js'
import { addReciveSite, getAddressDetail, updateAddress, deleteAddress } from '../../api/api.js'
import { Cell, CellGroup, Popup, Field, Switch, Icon, Area, Dialog, Toast } from 'vant'
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
    VanToast: Toast
  },
  name: 'addressEdit',
  data() {
    return {
      areaList: areaList,
      showNav: { // 导航栏
        title: '',
        active: false
      },
      id: this.$route.params.id,
      name: '', // 姓名
      phone: '', // 联系方式
      address: '', // 所在区域
      detail: '', // 详细地址
      checked: false, // 复选框
      isActive: false, // 保存按钮状态
      show: false, // 弹框
      region: '' ,// 地址
      allRegion: [],
      nameStatus: false,
      phoneStatus: false,
      detailStatus: false,
      saveFlag: true
    }
  },
  mounted(){
    if(this.$route.query.source = "prescription"){
     
    }else{
        mallInfo();
    }
   
     if(this.$route.params.id != 0 ) this.getAddress();
    this.changeType(this.$route.params.id);
    console.log()
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
    goBack() {
      this.$router.back();
    },
    //  修改进来状态
    changeType(param) {
      this.showNav.title = param == 0 ? '新增收货地址': '编辑地址'
    },
    // 获取地址详情
    getAddress() {
      const that = this;
       var params = { 
          header: {},
          body:{
            siteId: this.$route.params.id
          }
        }
      getAddressDetail(params).then( res => {
        if(res.data.code === 0) {
          const data = res.data.data;
          this.id = data.id;
          this.name = data.receivingName;
          this.phone = data.phone;
          this.address = `${data.provinceName}/${data.cityName}/${data.districtName}`;
          this.detail = data.address;
          this.checked = data.isSelect == 0 ? false : true;
          this.region = data.district.toString();
          this.nameStatus = true;
          this.phoneStatus = true;
          this.detailStatus = true;
          this.allRegion = [
            {name: data.provinceName, code: data.province},
            {name: data.cityName, code: data.city},
            {name: data.districtName, code: data.district},
            ]
        }
      }).catch( err => {
          that.$toast(err);
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
      //this.validate();
    },
    cancel() { // 弹框取消
      this.show = false;
    },
    deleteAddr() { // 删除
      const that = this;
      var params = { 
          header: {},
          body:{
            siteId: this.id
          }
        }
      Dialog.confirm({
        message: '确认删除收货地址？'
      }).then(() => {
        deleteAddress(params).then( res => {
          if(res.data.data) {
              this.$toast('地址已删除！');
              setTimeout(()=>{
                this.$router.back();
              },5);
            }
        }).catch( err => {
          that.$toast(err);
        })
      }).catch(() => {
        
      })
    },
    submitFunc(val){
      if( this.name.length > 25 || this.name.length < 2) {
          if(val) this.$toast('请输入2~25位字符串！');
          return false;
      }

      if((!(/^((13[0-9])|(14[5,7])|(15[0-3,5-9])|(17[0,3,5-8])|(18[0-9])|166|198|199|(147))\d{8}$/.test(this.phone)))) {
        if(val) this.$toast('请输入正确的手机号码！');
        return false;
      }

      if(this.address == '') {
        if(val) this.$toast('请输入地址！');
        return false;
      }

      if(this.detail.length < 2) {
        if(val) this.$toast('请输入正确详细地址！');
        return false;
      }
      return true;
    },
    save(val) { // 保存
      if(!this.isActive){
        return false;
      }
      if(!this.saveFlag){
        return false;
      }
      this.saveFlag = false;
      const that = this;
      let status = this.checked ? 1 : 0;
      let param = {
        header: {},
        body: {
          receivingName: this.name,
          phone: this.phone,
          province: this.allRegion[0].code,
          city: this.allRegion[1].code,
          district: this.allRegion[2].code,
          provinceName: this.allRegion[0].name,
          cityName: this.allRegion[1].name,
          districtName: this.allRegion[2].name,
          address: this.detail,
          isSelect: status,
          userId: this.$store.state.mall.userId
        }
      };
      setTimeout(()=>{
        this.saveFlag = true;
      },3000)
      if(val === 'save') {
        addReciveSite(param).then( res => {
          this.$toast('保存成功！');
          if(sessionStorage.getItem("addressEditFlag")){
            if(that.$route.query.isRx == 1){  //兼容凭方开药
               that.$router.replace({name:"addressList",params:{},query:{isRx: 1}});
            }else if(that.$route.query.source == "prescription"){
              that.$router.replace({
                name:"addressList",
                params:{},
                query:{
                  source: 'prescription',
                  orderNo: that.$route.query.orderNo,
                  inquiryId:  this.$route.query.inquiryId
                }
              });
              console.log(that.$route.query.source);
              console.log(that.$route.query.orderNo);
            }else{
               that.$router.replace({name:"addressList",params:{}});
            }
           
            return false;
          }
          setTimeout(() => that.$router.back(),3000);

        })
      }else {
          param.body.id = this.id;
          updateAddress(param).then( res => {
            if(res.data.data) {
              this.$toast('修改成功！');
              setTimeout(() => that.$router.back(),3000);
            }
          }).catch( err => {
          that.$toast(err);
        })
      }
    }
  }
}
</script>
<style lang="less" scoped>
.wrapper {
  background:rgba(246,248,250,1);
  padding-bottom: 150px; 
  margin-top: 90px;
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
  .addr {
    background-color: #fff;
    z-index: 99;
    position: relative;
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
    width:300px;
    height:80px;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    font-size:32px;
    text-align: center;
    line-height: 80px;
    color:rgba(255,255,255,1);
    background:linear-gradient(90deg,rgba(255,175,65,1),rgba(255,132,65,1));
    border-radius:40px;
    opacity: 0.6;
    z-index: 55;
  }
  .active {
    opacity: 1;
  }
  .van-field__control:disabled {
    color: #323233;
  }
}
</style>
<style>
.addr .van-field__label{
  font-size: 28px!important;
  width: 165px;
}
.uname .van-field__label{
  letter-spacing: 52px;
}
.addr .van-hairline--top-bottom:after {
  border-width: 0;
}
.addr .van-field__control:disabled {
    color: #323233;
}
.addr .van-cell {
  /* line-height: 112px; */
}
.addr .van-field__control {
  font-size:28px;
}
.detail.van-cell {
  padding-top: 40px;
  line-height: 1.5;
  padding-bottom: 60px;
}
.detail .van-cell__value {
  /* padding-top: 4px; */
}
</style>



