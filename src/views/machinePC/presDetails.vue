<template>
  <div class="contain">
    <van-nav-bar title="病历详情" class="articleBar" />
    <div class="descript">
      <div class="descriptTop">
        <div class="message">
          <span class="patientName">{{patientName}}</span>
          <div class="patientDe">
            <span>{{patientGender}}</span>
            <span v-if="patientAge">/{{patientAge}}岁</span>
          </div>
        </div>
        <div class="diagnose" v-if="diagnoseDetail">
          <div class="diagnose-title">
            诊断:
            <span class="diognose-des">{{diagnoseDetail}}</span>
          </div>
        </div>
      </div>
      <div class="drug" v-if="drugList.length >0">
        <div class="drug-title">用药信息</div>
        <div class="drug-content" v-for="(item, index) in drugList" :key="index">
          <div class="drug-title-name">
            <div class="drug-name">{{index+1}}、{{item.apDrugName}}</div>
            <div class="drug-num">×{{item.count}}</div>
          </div>
          <div class="drug-title-bottom">
            <div>规格：{{item.spec}}</div>
            <div class="drug-title-content">
              <div>用法：{{item.usageName}}</div>
              <div>用量：{{item.dosage}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="visitType=='2'" class="btnGroup">
      <div v-if="isCheck" class="isCheck">药师正在审核中...</div>
      <div v-else>
        <div class="recipe" bindtap="topreDetail">处方详情</div>
        <div class="goBuyBox">
          <div class="goBuyMedicine grayBuy" v-if="haveRex ||drugList.length==0">去购药</div>
          <div class="goBuyMedicine" bindtap="goBuyMedicine" v-else>去购药</div>
        </div>
      </div>
    </div>
    <div v-else class="btnGroup">
      <div
        class="goBuyMedicine videoGoBuyMedicine grayBuy"
        v-if="haveRex ||drugList.length == 0"
      >去购药</div>
      <div
        class="goBuyMedicine videoGoBuyMedicine"
        bindtap="goBuyMedicine"
        data-type="video"
        v-else
      >去购药</div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      visitType: "1", //1代表咨询 2问诊
      haveRex: false, //包含处方药
      orderNo: "", //订单id
      patientName: "",
      patientGender: "",
      patientAge: "",
      diagnoseDetail: "",
      isCheck: false, // true 正在审核
      drugList: [
        {
          apDrugName: "",
          spec: "",
          usageName: "",
          dosage: "",
          count: 0
        }
      ]
    };
  },
  methods: {
    getMedicalDetailByOrderId() {
      // 病历详情
      var orderId = this.orderNo;
      var params = {
        header: {},
        body: {
        //   orderNo: orderId
            orderNo: "20191115134123299"
        }
      };
      this.$toast.loading({
        duration: 0,
        message: "加载中...",
        forbidClick: true
      });
      this.$api.getMedicalDetailByOrderId(params)
        .then(res => {
          var res = res.data;
          if (res.code == 0) {
            var result = res.data;
            if (result) {
              this.$toast.clear();
              this.drugList = result.drugList;
              this.patientName = result.patientName;
              this.patientGender = result.patientGender;
              this.patientAge = result.patientAge;
              this.diagnoseDetail = result.diagnoseDetail;
              this.haveRex = result.haveRex;
              this.isCheck = result.isCheck;
            }
          } else {
            this.$toast.clear();
            this.$toast(res.message);
          }
        })
        .catch(err => {
          this.$toast.clear();
        });
    }
  },
  mounted() {
    var queryObj = this.$route.query;
    if (queryObj) {
      //a=问诊类型&b=订单number 短id
      var visitType = queryObj.a;
      var orderId = queryObj.b;
      var token = queryObj.token;
      this.orderNo = orderId;
      this.visitType = visitType;
      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("authorization", token);
      }
      this.getMedicalDetailByOrderId();
    }
  }
};
</script>
<style scoped>
.contain {
  width: 100%;
  height: 100%;
  overflow: scroll;
}
.descript {
  margin: 10px 15px 75px;
  padding: 20px 0 25px;
  border-radius: 4px;
}

.patientDe span {
  display: inline-block;
}

.isCheck {
  width: 750px;
  height: 112px;
  line-height: 112px;
  text-align: center;
  margin-bottom: -20px;
  background-color: #ffffff;
  color: #ff6e26;
  box-shadow: 0px -1px 1px 0px rgba(102, 102, 102, 0.05);
}
.descriptTop {
  margin-bottom: 20px;
}

.descriptTop,
.drug {
  background-color: #fff;
  padding: 20px 26px;
}

.patientName {
  display: inline-block;
  margin-right: 26px;
  font-size: 36px;
  font-weight: bold;
  line-height: 70px;
}
.patientDe {
  display: inline-block;
  font-size: 28px;
  line-height: 70px;
  font-weight: 400;
}

.diagnose-title {
  margin-top: 10px;
  font-size: 28px;
  font-weight: bold;
  line-height: 60px;
}

.diognose-des {
  font-size: 28px;
  line-height: 48px;
  font-weight: 400;
}

.drug-title {
  font-size: 28px;
  font-weight: bold;
  line-height: 60px;
  border-bottom: 1px solid #ebebeb;
}

.drug-content {
  margin-bottom: 20px;
  border-bottom: 1px solid #ebebeb;
}

.drug-title-name,
.drug-title-content {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.drug-title-content {
  justify-content: flex-start;
  margin-bottom: 18px;
}

.drug-title-name {
  margin-top: 20px;
}

.drug-name {
  font-weight: 600;
}

.drug-title-bottom view {
  font-size: 24px;
  color: #666;
  line-height: 56px;
}

.drug-title-bottom view:first-child {
  margin-right: 50px;
}

.btnGroup {
  display: flex;
  flex-direction: row;
  position: fixed;
  bottom: 20px;
}

.recipe,
.goBuyMedicine {
  width: 330px;
  height: 72px;
  box-sizing: border-box;
  text-align: center;
  line-height: 72px;
  font-size: 28px;
  color: #fff;
  border-radius: 40px;
}
.recipe,
.goBuyBox {
  display: inline-block;
}

.videoGoBuyMedicine {
  width: 690px;
  height: 72px;
  margin: 20px 30px;
}

.recipe {
  border-radius: 36px;
  border: solid 1px #ff6e26;
  background-color: #fff;
  color: #ff6e26;
  margin: 0 30px;
}

.goBuyMedicine {
  background: linear-gradient(90deg, #ffaf41, #ff8441);
}

.grayBuy {
  background: #ccc;
}
</style>