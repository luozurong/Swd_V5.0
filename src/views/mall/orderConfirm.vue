<template>
  <div v-show="confirmOrderFlag">
    <van-nav-bar class="title-shopCart" title="确认订单" left-arrow @click-left="onClickLeft"/>
    <div style="height:46px;"></div>

    <!-- 选择地址 -->
    <div class="confirm-address" @click="jumpAddressList()" v-if="hasEntity == 1">
      <div class="confirm-address-pic">
        <img :src="address" alt>
      </div>
      <div v-if="siteStatus == 2 && siteFlag" class="confirm-address-wrap">请填写收货地址</div>
      <div v-if="siteStatus == 1" class="confirm-address-wrap">新增地址</div>
      <div v-if="siteStatus == 0 || !siteFlag && siteStatus != 1" class="confirm-address-wrap">
        <div class="address-top">
          <span class="address-name" v-text="site.receivingName">张萌萌</span>
          <span class="address-mobile" v-text="site.phone">13612345698</span>
        </div>
        <div class="address-bottom">
          <span class="address-default" v-if="site.isSelect == 1">默认</span>
          <span
            class="address-detail"
          >{{site.provinceName}}{{site.cityName}}{{site.districtName}}{{site.address}}</span>
        </div>
      </div>
      <div class="confirm-address-more">
        <img :src="more" alt>
      </div>
    </div>

    <!-- 就诊人信息 -->
    <div class="confirm-patient" @click="jumpPatientPage" v-if="$route.query.isRx == 1">
      <div class="confirm-patient-icon">
        <img :src="patient_icon" alt="">
      </div>
      <div class="confirm-patient-wrap">
        <div>用药人信息</div>
        <div>
          <span v-if="!patient.patientName" class="confirm-patient-tip">请填写用药人信息</span>
          <span v-if="patient.patientName" v-text="patient.patientName"></span>
          <span v-if="patient.patientGender" v-text="patient.patientGender"></span>
          <span v-if="patient.patientAge">{{patient.patientAge}}岁</span>
        </div>
      </div>
      <div class="confirm-patient-more">
        <img :src="more" alt>
      </div>
    </div>

    <!-- 药品清单 -->
    <div class="confirm-goods">
      <div class="confirm-goods-dan">商品清单</div>
      <div class="confirm-goods-item" v-for="(item,index) in comList" :key="index">
        <div class="confirm-goods-pic" :style="{backgroundImage: 'url('+ item.imgUrls +')'}"></div>
        <div class="confirm-goods-wrap">
          <div class="confirm-goods-name">
            <span class="chu" v-if="item.isRx == 1">处方药</span>
            <span v-text="item.name"></span>
          </div>
          <div class="confirm-goods-store">
            <span>库存:</span>
            <span>{{item.inventory}}</span>
          </div>
          <div class="shopCart-main-step">
            <span class="price-wrap-current">
              <span>{{item.price | pricePre}}</span>
              <span>{{item.price | priceNext}}</span>
            </span>
            <div class="price-wrap-number" v-if="item.inventory != 0">
              <span @click="cartSub(index)"></span>
              <input @focus="numChangeFocus" :disabled="isRx == 1" @blur="numChangeBlur($event,index)" @change="numChange($event,index)" type="number" v-model="item.qty">
              <span @click="cartAdd(index)"></span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 推荐人 -->
    <div class="confirm-tui" v-if="hasPackage == 1">
      <div>
        <span>推荐人</span>
        <input type="text" v-model="referrerPhone" placeholder="请填写推荐人" maxlength="10">
      </div>
      <div>
        <span>推荐人手机</span>
        <input type="tel" v-model="referrer"  placeholder="请填写推荐人手机" maxlength="11">
      </div>
    </div>
    <div class="confirm-leave-word">
      <div class="confirm-leave-title">留言</div>
      <van-field
        v-model="message"
        type="textarea"
        maxlength="45"
        placeholder="备注发货需要注意的事项，如需开发票请留言，选填（45个字以内）"
        rows="2"
        autosize
      />
    </div>

    <!-- 费用展示 -->
    <div class="confirm-others">
      <div>
        <span>商品总价</span>
        <span>¥{{sumPrice.toFixed(2)}}</span>
      </div>
      <div v-if="$route.query.isRx == 1">
        <span>问诊费</span>
        <span>¥{{inquiryPrice.toFixed(2)}}</span>
      </div>
      <div v-if="hasEntity == 1">
        <span>运费</span>
        <span>¥{{freight.toFixed(2)}}</span>
      </div>
      <div v-if="hasEntity == 1">
        <span>配送方式</span>
        <span class="confirm-k">快递</span>
      </div>
    </div>

    <!-- 固定栏 -->
    <div class="shopCart-fixed">
      <div class="shopCart-fixed-pic">
        <span>共{{sumQty}}件商品</span>
      </div>
      <div class="shopCart-fixed-other">
        <div class="shopCart-fixed-price">
          <span>总计</span>
          <span>{{orderPrice.toFixed(2)}}</span>
        </div>
        <div :class="{'shopCart-fixed-go': true,'orderConfirm-fixed-active':!submitFlag}" v-if="mzdbSignStatus && isSelf == 1" @click="goPay()">医保支付</div>
        <div :class="{'shopCart-fixed-go': true,'orderConfirm-fixed-active':!submitFlag}" v-if="!(mzdbSignStatus && isSelf == 1)" @click="goPay()">去支付</div>
      </div>
    </div>

    <!-- 协议 -->
    <div class="confirm-agreement" v-if="agreeFlag">
      <div class="confirm-agreement-wrap">
        <div class="confirm-agreement-floor1">
          <span>互联网诊疗风险告知及知情同意书</span>
          <i @click="agreeClose"><img :src="close_pop_btn" alt=""></i>
        </div>
        <div class="confirm-agreement-floor2">
          <div>
            <agreement></agreement>
          </div>
        </div>
        <div class="confirm-agreement-floor3" @click="agreeSure">
          <span>我已阅读并同意</span>
        </div>
      </div> 
    </div>
    <div class="shopCart-div"></div>
  </div>
</template>
<script>
import Vue from "vue";
import { Stepper, NavBar, Field, Toast } from "vant";
Vue.use(Stepper)
  .use(NavBar)
  .use(Field)
  .use(Toast);

import { perOrder, placeOrder, getOrderDetail } from "../../api/api.js";
import { mallInfo } from "../../assets/js/common.js";
import { mapState, mapMutations } from "vuex";

import more from "../../assets/img/mall/more.png";
import address from "../../assets/img/mall/address.png";
import cart_num_btn from "../../assets/img/mall/cart_num_btn.png";
import test from "../../assets/img/mall/test.png";
import patient_icon from '../../assets/img/mall/patient_icon.png'
import close_pop_btn from '../../assets/img/mall/close_pop_btn@2x.png'

import agreement from './agreement'

export default {
  name: "orderConfirm",
  data() {
    return {
      patient_icon,
      more,
      test,
      address,
      close_pop_btn,
      addressFlag: false,
      value: 1,
      message: sessionStorage.message || "",
      comList: [],
      freight: 0,
      site: {},
      siteFlag: true,
      confirmOrderFlag: false,
      siteStatus: 0,
      hasEntity: 0,
      hasPackage: 0,
      sumPrice: 0,
      sumQty: 0,
      inquiryPrice: 0,
      orderPrice: 0,
      oneFlag: sessionStorage.oneFlag || true,
      comListTamp: [],
      orderId: null,          //订单id
      scCode: null,
      isGetOrder: sessionStorage.getItem("isGetOrder") == "false" ? false : true,
      mzdbSignStatus: false, //医保true ，直接支付false
      isEsscMode: 1 ,        //是否同步处方： 1同步处方 0不同步处方
      submitFlag: false,
      isSelf:0,              //默认不是本人
      patient:  sessionStorage.patient ? JSON.parse(sessionStorage.patient) : {},
      queryRxDrugs: {},       //药品信息
      isRx: this.$route.query.isRx,
      agreeFlag: false,
      referrerPhone: '',      //推荐人手机
      referrer: ''            //推荐人

    };
  },
  computed: {
    ...mapState({
      addressInfo: state => state.mall.addressInfo
    })
  },
  watch: {
    message(newVal, oldVal) {
      sessionStorage.setItem("message", newVal);
    }
  },
  components:{
    agreement
  },
  created(){
    console.log(window.location.href);
    let that = this;
    if (that.$route.query.source == 'prescription' && that.$route.query.inquiryId) {
        JsBridge.callMethod(
          "JsInvokeNativeMethod",
          "getUserInfo",
          { message: "关闭确认订单页" },
          function(data) {
            that.mzdbSignStatus = data.data.mzdbSignStatus == 1 ? true : false;
            // that.mzdbSignStatus = true;
            that.isEsscMode = data.data.isEsscMode;
          }
        );
      }
  },
  methods: {
    ...mapMutations({
      userId: "userId"
    }),
    isGetOrderFunc() {
      let isGetOrder = Boolean(sessionStorage.getItem("isGetOrder"));
      if (isGetOrder) {
        return true;
      } else { 
        return false;
      }
    },
    onClickLeft() {
      if (this.$route.query.source && this.$route.query.source.indexOf("order") != -1) {
        JsBridge.callMethod(
          "JsInvokeNativeMethod",
          "finishPage",
          { message: "关闭确认订单页" },
          function(data) {}
        );
      } else if(this.$route.query.source = 'prescription'){
        this.$router.back();
      } else{
        if (sessionStorage.getItem("addressEditFlag")) {
          this.$router.go(-2);
          return false;
        }
        this.$router.back();
      }
    },
    goPay() {
       if (this.site.id) {
        } else if (this.hasEntity == 0) {
        } else {
          Toast("请选择地址");
          return false;
        }
      if(this.submitFlag){
        if(this.hasPackage == undefined || this.hasPackage == 0){          //服务套餐判断
          if(this.$route.query.isRx == 1){ //凭方开药问诊下单
            this.placeVisitOrder();
          }else{
            this.placeOrderAjax();
          }
        }else{
          this.agreeFlag = true;
        }
      }
    },
    jumpPatientPage(){
      let that = this;
      let drugList = [];
      for(let i in this.comList){
        drugList.push(this.comList[i].comId);
      }
      JsBridge.callMethod(
        "JsInvokeNativeMethod",
        "getPatientInfo",
        { message:"选择就诊人及返回病情描述详情",drugList: drugList},
        function(data) {
          let res = JSON.parse(JSON.stringify(data));
          if(res.status.code == 1){  //code: 0失败 1成功
             sessionStorage.setItem("patient",JSON.stringify(res.data));
             that.patient = res.data;
          }
        }
      );
    },
    jumpAddressList() {
      if (this.siteStatus == 1) {
        if(this.$route.query.isRx == 1){
          this.$router.push({ name: "addressEdit", params: { id: 0 },query: {isRx: 1} });
        }else if(this.$route.query.source == "prescription"){
          this.$router.push({ 
            name: "addressEdit", 
            params: { id: 0 },
            query:{
              source: 'prescription',
              orderNo:  this.$route.query.orderNo,
              inquiryId:  this.$route.query.inquiryId
            } 
          });
        }else{
          this.$router.push({ name: "addressEdit", params: { id: 0 } });
        }
        sessionStorage.setItem("addressEditFlag", 1);
      } else {
        
        this.$router.push({ name: "addressList", params: { is_choice: 1 } });
        sessionStorage.removeItem("addressEditFlag");
      }
    },
    //获取预下单数据
    perOrderAjax() {
      let comList;
      let comListTamp = sessionStorage.getItem("comListTamp");
      if (comListTamp == null || comListTamp.length == 0) {
        comList = JSON.parse(this.$route.params.comList);
      } else {
        comList = JSON.parse(sessionStorage.getItem("comListTamp"));
      }
      let payType = '';
      let officeVisitOrderId = '';
      if(this.$route.query.source == "prescription" && this.mzdbSignStatus){
        payType = 4;   //医保支付
        officeVisitOrderId = this.$route.query.orderNo;
      }else{
        payType = '';
        officeVisitOrderId = ''
      }

      var params = {
        header: {},
        body: {
          officeVisitOrderId:officeVisitOrderId,
          userId: this.$store.state.mall.userId,
          comList: comList, 
          payType: payType,
        }
      };
      if(this.$route.query.isRx == 1){  //处方药预下单添加
         params.body.businessTypeId = 9 
      }
      Toast.loading('加载中')
      perOrder(params).then(res => {
        Toast.clear();
        this.confirmOrderFlag = true;
        if (res.data.code == 0) {
          this.submitFlag = true;
          this.comList = res.data.data.comList;
          for (var i in this.comList) {
            if (this.comList[i].imgUrl) {
              this.comList[i].imgUrls = this.comList[i].imgUrl.split(";")[0];
            }
          }
          this.freight = res.data.data.freight;
          this.siteStatus = res.data.data.siteStatus;
          this.sumPrice = res.data.data.sumPrice;
          this.sumQty = res.data.data.sumQty;
          this.hasEntity = res.data.data.hasEntity;
          this.orderPrice = res.data.data.orderPrice;
          this.inquiryPrice = res.data.data.inquiryPrice;
          this.hasPackage = res.data.data.hasPackage;
          this.comListTamp = JSON.parse(sessionStorage.comListTamp);

          this.isSelf = res.data.data.isSelf;
          if (res.data.data.site) {
            this.site = res.data.data.site;
            this.siteFlag = false;
          } else {
            this.siteFlag = true;
          }
          if (this.siteStatus == 1) {
            localStorage.removeItem("addressInfo");
          }

          if (sessionStorage.addressInfo && sessionStorage.addressInfo.length > 0) {
            this.siteFlag = false;
            let addressInfo = JSON.parse(sessionStorage.addressInfo)
            console.log(this.site);
            let siteTamp = Object.assign(this.site, {
              id: addressInfo.id,
              receivingName: addressInfo.receivingName,
              phone: addressInfo.phoneName,
              provinceName: addressInfo.provinceName,
              cityName: addressInfo.cityName,
              districtName: addressInfo.districtName,
              address: addressInfo.address,
              isSelect: addressInfo.default ? 1 : 0
            });
            this.site = siteTamp;
            console.log(this.addressInfo);
          }

          if(this.$route.query.isRx == 1){
            this.queryRxDrugsAjax();
          }
        }
      });
    },
    //添加
    comListFunc() {
      let comListTamp = [];
      for (var i = 0; i < this.comList.length; i++) {
        let comListObj = {
          comId: this.comList[i].comId,
          columnId: this.comList[i].columnId,
          qty: this.comList[i].qty
        };
        comListTamp.push(comListObj);
      }
      this.comListTamp = comListTamp;
      sessionStorage.setItem("comListTamp", JSON.stringify(comListTamp));
      this.perOrderAjax();
    },
    //增加数量
    cartAdd(index) {
      if(this.$route.query.isRx == 1){
        return false;
      }
      this.submitFlag = false;
      if (this.comList[index].qty >= this.comList[index].inventory) {
        Toast("亲，没有这么多库存了");
        setTimeout(()=>{
          this.comListFunc();
        },500)
        
        return false;
      }
      let addqty = Number(this.comList[index].qty);
      addqty += 1;
      this.comList[index].qty = addqty;
      this.comListFunc();
    },
    //減少
    cartSub(index) {
      if(this.$route.query.isRx == 1){
        return false;
      }
      this.submitFlag = false;
      if (this.comList[index].qty == 1) {
         this.submitFlag = true;
        return false;
      }
      let subqty = Number(this.comList[index].qty);
      subqty -= 1;
      this.comList[index].qty = subqty;
      this.comListFunc();
    },
    //修改數量
    numChange(e, index) {},
    numChangeFocus(){
      this.submitFlag = false;
    },
    numChangeBlur(e, index){
      this.submitFlag = false;
      if (Number(e.target.value) <= 0) {
        e.target.value = 1;
      }else if(this.comList[index].inventory < Number(e.target.value)){
        Toast("亲，没有这么多库存了");
        e.target.value = this.comList[index].inventory;
      }else if(Number(e.target.value).toString() == 'NaN'){
        e.target.value = 1;
      }

      let comListTamp = JSON.parse(sessionStorage.getItem("comListTamp"));
      comListTamp[index].qty = e.target.value;

      sessionStorage.setItem('comListTamp',JSON.stringify(comListTamp));
      setTimeout(()=>{
         this.perOrderAjax();
      },500)
    },
    //去支付
    placeOrderAjax() {
      let that = this;

      let payType = '';         //判断医保支付
      let inquiryType = '';     //问诊类型
      if(!this.mzdbSignStatus){ 
        payType = ''; 
      }else {
        payType = this.mzdbSignStatus ? 4 : ''; 
        inquiryType = 5;        //医保支付为慢病开药
      }

      let orderType = 0;         //判断问诊订单
      let officeVisitOrderId = ''
      if(this.$route.query.source == "prescription"){
         orderType = 1;          //订单类型 0商城订单 1问诊订单
         officeVisitOrderId = this.$route.query.orderNo;
      }else{
        orderType = 0;
        officeVisitOrderId = ''
      }

      var params = {
        header: {},
        body: {
          userId: this.$store.state.mall.userId,
          siteId: this.hasEntity == 0 ? "" : this.site.id,
          remark: this.message,
          comList: this.comListTamp,
          orderSource: 0,              //0用户端APP  1小程序
          isDeleteShopCartProduct: this.$route.query.isDeleteShopCartProduct ? 1 : 0,
          orderType: orderType,        //0商城   1问诊
          officeVisitOrderId: officeVisitOrderId,
          payType: payType,            //医保支付
          inquiryType: inquiryType,
          referrerPhone: this.referrerPhone,    //推荐人手机(服务套餐)
          referrer: this.referrer
        }
      };
      Toast.loading({
        mask: false,
        message: "加载中...",
        duration: 0
      });
      placeOrder(params).then(res => {
        if (res.data.code == 0) {
          
          this.orderId = res.data.data.orderId;    //订单id
          this.scCode = res.data.data.scCode;
          if(!this.mzdbSignStatus){//非医保支付流程
            Toast.clear();
            JsBridge.callMethod(
              "JsInvokeNativeMethod",
              "payment",
              { message: "跳转支付页面", orderId: that.orderId },
              function(data) {
                
              }
            );
            this.$router.back();
          }else{
            if(this.isEsscMode == 0){
               Toast.clear();
              JsBridge.callMethod(
                "JsInvokeNativeMethod",
                "siPay",
                { message: "医保支付", orderId: that.orderId, scCode: that.scCode },
                function(data) {}
              );
            }else if(this.isEsscMode == 1){
              this.synMedInsPresciptionAjax(this.$route.query.inquiryId, this.orderId) //兼容医保支付
            }
          }
        }else{
          Toast(res.data.message);
        }
      });
    },

    //凭方开药问诊订单下单
    placeVisitOrder(){
      if(!this.patient.patientId){
        Toast("请填写用药人信息");
        return false;
      }
      let queryRxDrugsTamp = this.queryRxDrugs;
      for(let i in queryRxDrugsTamp){
        queryRxDrugsTamp[i].count = this.comList[i].qty
      }
      let visitOfficeDrugParam = {
        roleId: this.$store.state.mall.userId,
			  roleType: 1,
			  clinicId: 90000,
			  roleUserId: this.$store.state.mall.userId,
        patientId: this.patient.patientId,              //'cb2a60845559425aa133bca77bd2d2d5',
        drugstoreId: '',
        diagnose: this.patient.diagnose,               //'唇单纯疱疹,急性肾小球肾炎，IgA肾病',
        mainSuit: this.patient.mainSuit,               //'"1侧头痛恶心2天',
        medicalHistory:  this.patient.medicalHistory,  //'高血压，糖尿病，过劳肥',
        illnessDuration: this.patient.illnessDuration, //'一月内',
        allergy: this.patient.allergy,                 //'青霉素，链霉素，贫穷',
        inquiryType: 9,
        familyMedicalHistory: this.patient.familyMedicalHistory,//'无',
        expertId: '',
        drugList: queryRxDrugsTamp,
      }

      let params = {
        header: {},
        body: {
          userId: this.$store.state.mall.userId,
          siteId: this.hasEntity == 0 ? "" : this.site.id,
          remark: this.message,
          comList: this.comListTamp,
          orderSource: 0,                       //用户端APP来源
          isDeleteShopCartProduct: 1,
          orderType: 1,                         //问诊订单
          officeVisitOrderId: '',
          inquiryType: 9,                       //平方开药
          visitOfficeDrugParam: visitOfficeDrugParam,
          referrerPhone: this.referrerPhone,    //推荐人手机(服务套餐)
          referrer: this.referrer
        }
      }
      this.$api.placeVisitOrder(params).then(res => {
        console.log(res);
        if(res.data.code == 0){
            JsBridge.callMethod(
              "JsInvokeNativeMethod",
              "payment",
              { message: "跳转支付页面", orderId: res.data.data.orderId },
              function(data) {}
            );
            this.$router.back();
        }
      });
    },

    //兼容重新购买
    getOrderDetailAjax(orderNo) {
      let params = {
        header: {},
        body: {
          orderNo: orderNo
        }
      };
      getOrderDetail(params).then(res => {
        if (res.data.code == 0) {
          let comList = res.data.data.comList;
          let comListTamp = [];
          for (let i = 0; i < comList.length; i++) {
            if ((comList[i].status != null && comList[i].inventory  != null) && (comList[i].status == 0 && comList[i].inventory > 0)){
              let comListArr = {
                comId: comList[i].commodityId,
                columnId: "",
                qty: comList[i].qty
              };
              comListTamp.push(comListArr);
             }
          }
          sessionStorage.setItem("comListTamp", JSON.stringify(comListTamp));
          this.perOrderAjax();
        }
      });
    },
    //兼容处方笺跳转购买
    getPrescriptionSign(orderId) {
      var params = {
        header: {},
        body: {
          orderId: orderId
        }
      };
      Toast.loading({
        mask: false,
        message: "加载中...",
        duration: 0
      });
      this.$api.getPrescriptionSign(params) .then(res => {
        if (res.data.code == 0) {
          let prescriptionDrugListTamp = res.data.data.prescriptionDrugList;
          let comListTamp = [];
          let ids = [];
          for (let i in prescriptionDrugListTamp) {
            let comListObj = {
              comId: prescriptionDrugListTamp[i].drugStandardId, //规格id
              qty: prescriptionDrugListTamp[i].count.toString()
            };
            comListTamp.push(comListObj);
            ids.push(prescriptionDrugListTamp[i].drugStandardId);
          }

          this.getCommodityIdsAjax(ids, comListTamp);
        } else {
          this.showNull = true;
          Toast.clear();
        }
      })
      .catch(err => {
        Toast.clear();
      });
    },

    //药品转商品
    getCommodityIdsAjax(ids, comListTamp) {
      let params = {
        header: {},
        body: {
          ids: ids
        }
      };
      this.$api.getCommodityIds(params).then(res => {
        if (res.data.code == 0) {
          let data = res.data.data;
          let comListArr = [];
          for (let i in data) {
            for (let k in comListTamp) {
              if (data[i].drugId == comListTamp[k].comId) {
                //匹配有效商品
                let comListObj = {
                  comId: data[i].commodityId,
                  columnId: "",
                  qty: comListTamp[k].qty
                };
                comListArr.push(comListObj);
              }
            }
          }
          sessionStorage.setItem("comListTamp", JSON.stringify(comListArr));
          this.perOrderAjax();
        }
        Toast.clear();
      })
      .catch(res => {
        Toast.clear();
      });
    },

    //商品转药品
    queryRxDrugsAjax(){
      let commodityIds = []
      for(let i in this.comList){
        commodityIds.push(this.comList[i].comId)
      }
      let params = {
        header: {},
        body: {
          commodityIds: commodityIds
        }
      }
      this.$api.queryRxDrugs(params).then(res => {
        if(res.data.code == 0){
          this.queryRxDrugs = res.data.data;
        }
      })
    },

    //同步处方信息到医保统筹
    synMedInsPresciptionAjax(inquiryId,mallOrderId){
      let that = this;
      let params = {
        header: {},
        body: {
          inquiryId: inquiryId,
          mallOrderId: mallOrderId
        }
      }
      this.$api.synMedInsPresciption(params).then(res => {
        Toast.clear();
        if(res.data.code == 0){
          if(res.data.data.operationResult == 1){
            JsBridge.callMethod(
              "JsInvokeNativeMethod",
              "siPay",
              { message: "医保支付", orderId: that.orderId, scCode: that.scCode },
              function(data) {}
            );
          }else{
            Toast(res.data.message);
          }
        }else{
          Toast('订单出现异常');
        }
      })
    },
    agreeClose(){
      this.agreeFlag = false;
    },
    agreeSure(){
      if(this.$route.query.isRx == 1){ //凭方开药问诊下单
        this.placeVisitOrder();
      }else{
        this.placeOrderAjax();
      }
    }
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
  mounted() {
   
    if (this.$route.query.orderNo) {
      if (this.$route.query.source) {
         mallInfo();
      }
     
      if (this.$route.query.source.indexOf("order") != -1) {
        //重新该买
        this.getOrderDetailAjax(this.$route.query.orderNo);
      } else if (this.$route.query.source == "prescription") {
        //处方笺购买
        this.getPrescriptionSign(this.$route.query.orderNo);
      }
    } else {
      //商品下单流程
      this.perOrderAjax();
    }
  }
};
</script>
<style lang="less">
[v-cloak]{
  display: none !important;
}
.confirm-patient{
  display: flex;
  align-items: center;
  margin: 20px 30px 0;
  padding: 36px 0;
  border-radius: 8px;
  background: #fff;
  .confirm-patient-icon{
    width: 30px;
    height: 30px;
    flex-shrink: 0;
    margin-left: 24px;
    margin-right: 24px;
  }
  .confirm-patient-wrap{
    flex-grow: 2;
    border-left: 1px solid #ebebeb;
    padding-left: 21px;
    .confirm-patient-tip{
      color: #999
    }
    &>div:first-child{
      font-size: 28px;
      font-weight: bold;
      color: #333333;
    }
    &>div:last-child{
      font-size: 28px;
      color: #333333;
      padding-top: 10px;
      span{
        margin-right: 10px;
      }
    }
  }
  .confirm-patient-more{
    width: 14px;
    height: 26px;
    flex-shrink: 0;
    margin-right: 30px;
  }
}
.title-shopCart {
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
}
.confirm-address {
  display: flex;
  display: -webkit-flex;
  background-color: #fff;
  margin: 0 30px;
  margin-top: 20px;
  align-items: center;
  min-height: 143px;
  border-radius: 8px;
  & > div.confirm-address-pic {
    flex-shrink: 0;
    margin: 0 24px;
    height: 32px;
    width: 31px;
  }
  & > div.confirm-address-more {
    width: 14px;
    height: 26px;
    margin-right: 24px;
  }
  & > div.confirm-address-wrap {
    flex-grow: 2;
    margin-left: 7px;
    color: #666666;
    padding: 32px 0;
  }
  .address-top {
    margin-bottom: 14px;
    .address-name {
      font-size: 32px;
      color: #333;
      font-weight: bold;
    }
    .address-mobile {
      font-size: 28px;
      color: #333;
      font-weight: bold;
      margin-left: 11px;
    }
  }
  .address-bottom {
    padding-right: 20px;
    box-sizing: border-box;
    .address-default {
      width: 72px;
      height: 40px;
      background-color: rgba(255, 175, 65, 0.12);
      border-radius: 8px;
      font-size: 24px;
      display: inline-block;
      text-align: center;
      line-height: 40px;
      color: #ffaf41;
      margin-right: 7px;
    }
    .address-detail {
      line-height: 38px;
      font-size: 28px;
    }
  }
}
.confirm-goods {
  margin: 20px 30px 0;
  background: #fff;
  border-radius: 8px;
  .confirm-goods-dan {
    padding: 36px 0 33px 24px;
    font-size: 28px;
  }
}
.confirm-tui{
  margin: 20px 30px 0 ;
  background: #fff;
  border-radius: 8px;
  font-size: 28px;
  div{
    margin: 0 24px 0 22px;
    padding: 21px 0;
    display: flex;
    &:first-child{
      border-bottom: 1px solid #ebebeb;
    }
    span{
      color: #666666;
      flex-shrink: 0;
    }
    input{
      flex-grow: 2;
      text-align: right;
      &::placeholder{
       color: #aeafb2
      }
    }
  }
}

.confirm-agreement{
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  margin: auto;
  z-index: 1000;
  background: rgba(0,0,0,0.3);
 
  .confirm-agreement-wrap{
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 780px;
    margin: auto;
    z-index: 10001;
    background: #fff;
    padding: 0 30px;
    box-sizing: border-box;
    .confirm-agreement-floor1{
      display: flex;
      align-items: center;
      padding: 40px 0;
      span{
        flex-grow: 2;
        font-size: 32px;
        color: #333333;
        font-weight: 600;
      }
      i{
        width: 28px;
        height: 28px;
        margin-top: -15px;
      }
    }
    .confirm-agreement-floor2{
      overflow-y: auto;
      max-height: 570px;
    }
    .confirm-agreement-floor3{
      display: flex;
      justify-content: center;
      margin-top: 15px;
      span{
        display: inline-block;
        width: 690px;
        height: 72px;
        background-image: linear-gradient(90deg, 
          #73e539 0%, 
          #57d648 50%, 
          #3ac756 100%), 
        linear-gradient(
          #000000, 
          #000000);
        background-blend-mode: normal, 
          normal;
        border-radius: 36px;
        color: #333;
        line-height: 72px;
        text-align: center;
        color: #fff;
      }
    }
  }
}

.confirm-goods-item {
  display: flex;
  padding-bottom: 33px;
  padding-left: 24px;
  .confirm-goods-pic {
    width: 160px;
    height: 160px;
    overflow: hidden;
    box-sizing: border-box;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    border-radius: 8px;
    flex-shrink: 0;
    -webkit-flex-shrink: 0;
  }
  .confirm-goods-wrap {
    margin-left: 16px;
    flex-grow: 2;
    -webkit-flex-grow: 2;
    padding-right: 25px;
    .confirm-goods-name {
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
    .confirm-goods-store {
      line-height: 44px;
      span {
        color: #aeafb2;
        font-size: 24px;
        display: inline-block;
        &:last-child {
          margin-right: 15px;
        }
      }
    }
    .shopCart-main-store {
      font-size: 24px;
      letter-spacing: 0px;
      color: #aeafb2;
      margin-right: 15px;
    }
    .home-product-tip {
      span {
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
    .shopCart-main-step {
      display: flex;
      margin-top: 5px;
      .price-wrap-current {
        flex-grow: 2;
        -webkit-flex-grow: 2;
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
    }
  }
}

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
}
.van-stepper__input {
  margin: 0;
  width: 69px;
  height: 44px;
  border-top: 1px solid #d2d2d4;
  border-bottom: 1px solid #d2d2d4;
  background: #fff;
  font-size: 28px;
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
}
.van-stepper__minus:after,
.van-stepper__plus:after {
  height: 22px;
}
.van-swipe-cell__right {
  display: flex;
  align-items: center;
  background-color: #f44;
}
.confirm-leave-word {
  background: #fff;
  margin: 20px 30px 0;
  padding-bottom: 10px;
  border-radius: 8px;
}
.confirm-leave-title {
  font-size: 28px;
  color: #333333;
  padding: 32px 0 0 32px;
}
.confirm-leave-word .van-cell {
  padding: 8px 30px;
}
.van-field__control {
  font-size: 28px;
}
.confirm-others {
  margin: 20px 30px 0;
  background: #fff;
  border-radius: 8px;
  div {
    padding-top: 32px;
    padding-left: 22px;
    font-size: 28px;
    &:last-child {
      padding-bottom: 32px;
    }
    span {
      font-size: 28px;
      &:last-child {
        float: right;
        margin-right: 25px;
        color: #ff6e26;
      }
      &.confirm-k {
        color: #333;
      }
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
  .shopCart-fixed-pic {
    flex-shrink: 0;
    margin-left: 30px;

    span {
      display: inline-block;
      height: 40px;
      line-height: 40px;
      color: #666;
      margin-left: 4px;
      font-size: 28px;
    }
  }
  .shopCart-fixed-other {
    flex-grow: 2;
    display: flex;
    justify-content: flex-end;
    .shopCart-fixed-price {
      font-size: 28px;
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
    .orderConfirm-fixed-active{
      opacity: 0.3;
    }
  }
}
.shopCart-div {
  height: 132px;
}
.price-wrap-number {
  flex-shrink: 0;
  width: 180px;
  box-sizing: border-box;
  display: flex;
  display: -webkit-flex;
  margin-top: -6px;
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
    width: 84px;
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
</style>
 