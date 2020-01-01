<template>
  <div class="pres_box">
    <!-- 头部 -->
    <div class="head_title" v-if="headline">
      <van-nav-bar title="处方笺" :fixed="true" left-arrow @click-left="onClickLeft" />
      <div style="width:100%; height:46px;"></div>
    </div>
    <div class="prescription" v-if="presData">
      <div class="head_logo">
        <img src="../../assets/img/prescriptionDetail/logo.png" alt />
      </div>
      <div class="cachet">
        <img src="../../assets/img/prescriptionDetail/official_seal.png" alt />
      </div>
      <div class="code">
        <img :src="presData.precriptionCodeUrl" alt />
      </div>
      <div class="title">处方笺</div>
      <div class="line_bold"></div>
      <div class="content_top">
        <div class="content_li">
          <div>费别：</div> 
          <div class="content_li_right w_104">{{presData.costype}}</div>
        </div>
        <div class="content_li">
          <div>医疗证/医保卡号：</div>
          <div class="content_li_right w_212">{{presData.medInsCardNumber}}</div>
        </div>
        <div class="content_li">
          <div>姓名：</div>
          <div class="content_li_right w_104">{{presData.patientName}}</div>
        </div>
        <div class="content_li">
          <div>性别：</div>
          <div class="content_li_right w_104">{{presData.patientSex}}</div>
        </div>
        <div class="content_li">
          <div>就诊卡号：</div>
          <div class="content_li_right w_128"></div>
        </div>
        <div class="content_li">
          <div>科别：</div>
          <div class="content_li_right w_104">{{presData.department}}</div>
        </div>
        <div class="content_li">
          <div>年龄：</div>
          <div class="content_li_right w_104">{{presData.patientAge}}</div>
        </div>
        <!-- <div class="content_li">
          <div>诊号：</div>
          <div class="content_li_right w_122">756753534</div>
        </div>-->
        <div class="content_li">
          <div>开方日期：</div>
          <div class="content_li_right w_128">{{presData.createTime}}</div>
        </div>
        <div class="content_li">
          <div>临床诊断：</div>
          <div class="content_li_right w_490">{{presData.diagnoseDetail}}</div>
        </div>
        <div class="content_li">
          <div>住址/电话：</div>
          <div class="content_li_right w_480">{{presData.patientAddress}}</div>
        </div>
        <div class="content_li">
          <div>协议药店：</div>
          <div class="content_li_right w_490">{{presData.drugstoreName}}</div>
        </div>
      </div>
      <div class="Rp">Rp</div>
      <div class="drug_box">
        <div class="drug_li" v-for="(item, index) in presData.prescriptionDrugList" :key="index">
          <div class="drug_li_top">
            <span class="name">{{index+1}}、{{item.apDrugName}}</span>
            <!--  -->
            <span>{{item.pack}}*{{item.count}}{{item.countUnit}}</span>
          </div>
          <div class="usage" v-if="item.dosage">用法：{{item.dosage}} {{item.usageName}}</div>
          <div class="usage" v-else>
            <span>用法：</span>
            <span v-if="item.dosNum && item.dosUnitName">一次{{item.dosNum}}{{item.dosUnitName}}</span>
            <span v-if="item.dosTimes && item.dosCycle">{{item.dosTimes}}次/{{item.dosCycle}}</span>
            <span v-if="item.usageName">{{item.usageName}}</span>
          </div>
        </div>
        <!-- <div class="drug_li">
          <div class="drug_li_top">
            <span class="name">1、阿司匹林肠溶片</span>
            <span>100mg*30片x1盒</span>
          </div>
          <div class="usage">用法：一次1片 1次/天 口服</div>
        </div>-->
        <div class="null_line">
          <!-- <span class="line">--------------------------</span>
          <span>以下为空</span>
          <span class="line">--------------------------</span> -->
          <van-divider dashed :style="{ color: '#999999', borderColor: '#dedede',fontSize: '12px' }">以下为空</van-divider>
        </div>
      </div>
      <div class="tip_mid">注：鉴于药物都有一定的副作用，请您在服用药物前仔细阅读说明书，了解禁忌及慎用情况，肝肾功能不全者注意减量。</div>
      <div class="line_bold_bottom"></div>
      <div class="content_top content_bottom">
        <!-- <div class="content_li">
          <div>公费记账：</div>
          <div class="content_li_right w_82">60</div>
          <div>元</div>
        </div>
        <div class="content_li">
          <div>付现：</div>
          <div class="content_li_right w_82">60</div>
          <div>元</div>
        </div>-->
        <div class="content_li">
          <div style="width:60px;text-align:right;">医师：</div>
          <div class="content_li_right w_180">{{presData.doctorName}}</div>
          <div class="signature" v-if="presData.doctorSignUrl">
            <img :src="presData.doctorSignUrl" alt />
          </div>
        </div>
        <div class="content_li">
          <div>药品金额：</div>
          <div class="content_li_right w_150">{{presData.drugsPrice}}</div>
          <div>元</div>
        </div>
        <div class="content_li">
          <div>审核药师：</div>
          <div class="content_li_right w_180">{{presData.firstPharmacistName}}</div>
          <div class="signature" v-if="presData.firstPharmacistSignUrl">
            <img :src="presData.firstPharmacistSignUrl" alt />
          </div>
        </div>
        <div class="content_li">
          <div>调配：</div>
          <div class="content_li_right w_180"></div>
        </div>
        <div class="content_li">
          <div>审核药师：</div>
          <div class="content_li_right w_180">{{presData.secondPharmacistName}}</div>
          <div class="signature" v-if="presData.secondPharmacistSignUrl">
            <img :src="presData.secondPharmacistSignUrl" alt />
          </div>
        </div>
        <div class="content_li">
          <div>核对发药：</div>
          <div class="content_li_right w_180"></div>
        </div>
      </div>
      <div
        class="tip_mid tip_bottom"
      >注意：根据《互联网医院管理办法（试行）》规定，处方仅限本协议药店有效，自行下载不具有处方效力。为确保用药安全，处方三日内有效。</div>
    </div>
    <div v-if="showBtn && presData && presData.inquiryType == '5'" class="height_bottom"></div>
    <div v-if="showBtn && presData && presData.inquiryType == '5'" class="goto_shop" @click="gotoShop()">去购药</div>
    <div v-if="showNull">
      <no-data-view scene="noData"></no-data-view>
    </div>
  </div>
</template>

<script>
import NoDataView from "../components/noData";
 import {mapState,mapActions} from 'vuex'   //状态管理
export default {
  components: {
    NoDataView
  },
  data() {
    return {
      presData: null,
      showNull: false,
      isAppcomeform: false,
      orderId: '',
      showBtn: false,
      headline: true,
    };
  },
  mounted() {
    localStorage.removeItem('authorization')
    if(this.$route.query.orderId){ 
      this.getPrescriptionSign(this.$route.query.orderId);
    }
    if(this.$route.query.entrance && this.$route.query.entrance == 'app'){
      this.isAppcomeform = true;
    }
    if(this.$route.query.buyDrug && this.$route.query.buyDrug == '1'){
      this.showBtn = true;
    }
    if(this.$route.query.headline == '0'){ 
      this.headline = false;
    }
  },
  methods: {
    gotoShop() {
      var that = this;
      JsBridge.callMethod("JsInvokeNativeMethod", "getUserInfo", null, function(
        data
      ) {
        var data = JSON.parse(JSON.stringify(data));
        var userInfo = data.data;
        if(userInfo.token && userInfo.userId){
          that.$router.push({ 
            path:'/orderConfirm',
            query: {
              orderNo: that.$route.query.orderId, 
              userId: userInfo.userId,
              token: userInfo.token, 
              source: 'prescription',
              inquiryId: that.presData.inquiryId
            } 
          })
        }
      });
    },
    onClickLeft() {
      if (this.isAppcomeform) {
        JsBridge.callMethod("JsInvokeNativeMethod", "finishPage", function(
          data
        ) {});
      } else {
        this.$router.back(-1);
      }
    },
    getPrescriptionSign(orderId) {
      // 获取当前时间
      this.$store.commit("setTimeStamp");
      var params = {};
      var body = {
        orderId: orderId
      };
      params.body = body;
      this.$api
        .getPrescriptionSign(params)
        .then(res => {
          if (res.data.code == 0) {
            this.presData = res.data.data;
          } else {
            this.showNull = true;
          }
        })
        .catch(err => {
          this.showNull = true;
        });
    }
  }
};
</script>

<style>
.pres_box {
  position: relative;
}
.pres_box .goto_shop {
  position: fixed;
  left: 75px;
  bottom: 50px;
  width: 600px;
  height: 80px;
  line-height: 80px;
  text-align: center;
  font-size: 28px;
  color: #ffffff;
  background-image: linear-gradient(90deg, #73e539 0%, #3ac756 100%),
    linear-gradient(#ff6e26, #ff6e26);
  background-blend-mode: normal, normal;
  border-radius: 40px;
}
.height_bottom { 
  height: 150px;
}
.prescription {
  position: relative;
  width: 690px;
  height: auto;
  line-height: 1;
  margin: 30px auto;
  background-color: #ffffff;
  box-shadow: 0px 6px 10px 0px rgba(0, 0, 0, 0.1);
}
.prescription .head_logo {
  padding: 30px 30px;
  width: 350px;
  height: 48px;
}
.prescription .title {
  margin-top: 10px;
  text-align: center;
  font-weight: bold;
  font-size: 32px;
  color: #333333;
}
.prescription .line_bold {
  width: 630px;
  height: 3px;
  margin: 20px auto 0;
  background-color: #333333;
  border-bottom: 1px solid #999999;
}
.prescription .content_top {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 30px 30px 10px 30px;
}
.prescription .content_top .content_li {
  display: flex;
  margin-bottom: 20px;
  font-size: 20px;
  color: #333333;
}
.prescription .content_top .content_li .content_li_right {
  margin-left: -10px;
  text-align: center;
  border-bottom: 1px solid #333333;
}
.prescription .w_130 {
  width: 130px;
}
.prescription .w_212 {
  width: 212px;
}
.prescription .w_104 {
  width: 104px;
}
.prescription .w_32 {
  width: 32px;
}
.prescription .w_112 {
  width: 112px;
}
.prescription .w_122 {
  width: 122px;
}
.prescription .w_128 {
  width: 128px;
}
.prescription .w_490 {
  width: 490px;
  text-align: left !important;
  text-indent: 20px;
}
.prescription .w_480 {
  width: 480px;
  text-align: left !important;
  text-indent: 20px;
}
.prescription .Rp {
  padding-left: 30px;
  font-weight: bold;
  font-size: 36px;
  color: #333333;
}
.drug_box {
  min-height: 380px;
}
.prescription .drug_li {
  padding: 0 30px 0 60px;
  font-size: 20px;
  color: #999999;
}
.prescription .drug_li .drug_li_top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20px;
  padding-bottom: 16px;
}
.prescription .drug_li .name {
  font-weight: bold;
  font-size: 24px;
  color: #333333;
}
.prescription .drug_li .usage {
  text-indent: 36px;
}
.prescription .null_line {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 36px 36px;
  font-size: 20px;
  color: #999999;
}
.prescription .null_line .line {
  margin: 0 10px;
  font-size: 14px;
  color: #dedede;
}
.prescription .tip_mid {
  padding: 0 22px 0 30px;
  font-size: 20px;
  line-height: 30px;
  color: #999999;
}
.prescription .line_bold_bottom {
  width: 630px;
  height: 2px;
  margin: 16px auto 0;
  background-color: #999999;
}
.prescription .content_top.content_bottom {
  padding: 20px 30px 0px 30px;
}
.prescription .content_top.content_bottom .content_li {
  position: relative;
  margin-bottom: 22px;
}
.prescription .signature {
  position: absolute;
  top: -20px;
  right: 20px;
  width: 50px;
  height: 40px;
  border: none;
}
.prescription .signature img {
  width: 100%;
  height: 100%;
  border: none;
}
.prescription .w_82 {
  width: 82px;
}
.prescription .w_300 {
  width: 300px;
  text-align: left !important;
  text-indent: 10px;
}
.prescription .w_195 {
  width: 195px;
}
.prescription .w_252 {
  width: 252px;
  text-align: left !important;
  text-indent: 10px;
}
.prescription .w_150 {
  width: 150px;
}
.prescription .w_180 {
  width: 180px;
  text-align: left !important;
  text-indent: 10px;
}
.prescription .tip_mid.tip_bottom {
  margin-top: 0px;
  padding-bottom: 30px;
}
/* 公章 */
.cachet {
  position: absolute;
  top: 18px;
  right: 222px;
  width: 140px;
  height: 140px;
}
.code {
  position: absolute;
  top: 30px;
  right: 30px;
  width: 163px;
  height: 76px;
}
</style>