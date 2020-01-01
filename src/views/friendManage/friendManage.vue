<template>
  <div class="friendBox">
    <van-nav-bar title="绑定亲友账号" class="articleBar" />
    <div class="friendContent">
      <div class="showContent">
        <div class="friendLogo">
          <img src="../../assets/img/friendManage/logo.png" />
        </div>
        <div class="friendTitle">南风医生绑定亲友账号</div>
        <div class="friendTips">
          您的亲友（
          <span v-if="userName">{{userName}}，</span>
          {{userPhone}}）邀请您加入他的亲友团，同意绑定后可以实现亲友间的健康数据分享。通过“我的亲友”可及时掌握亲友的身体健康情况，共同管理亲友的健康。
        </div>
      </div>
      <div class="overdueContainer" v-if="isOverDue">
        <div class="tipsImg">
          <img src="../../assets/img/system/tips.png" />
        </div>
        <p class="tipText">该二维码已失效！</p>
        <p>请联系好友重新生成二维码，并绑定</p>
      </div>
      <div class="inpContent" v-else>
        <van-cell-group>
          <van-field v-model="phone" placeholder="请输入手机号" clearable>
            <div class="sendCode" slot="button" v-if="isSend">{{countNum}}s重新获取</div>
            <div
              class="sendCode"
              slot="button"
              :class="phoneRight?'rightPhone':''"
              @click="sendCode"
              v-else
            >发送验证码</div>
          </van-field>
          <van-field v-model="code" center clearable placeholder="请输入短信验证码" class="friendCode" />
          <div class="agreeSave" v-if="!code||sendFlag">
            同意绑定
            <div class="mask"></div>
          </div>
          <div class="agreeSave" @click="submitPhone" v-else>同意绑定</div>
        </van-cell-group>
      </div>
    </div>
  </div>
</template>

<script>
import { Dialog } from "vant";
export default {
  components: {
    [Dialog.Component.name]: Dialog.Component
  },
  data() {
    return {
      phone: "", //手机号码
      userId: "", //用户id
      code: "", //验证码
      userName: "", //用户名
      userPhone: "",
      phoneRight: false, //验证手机号码是否正确
      isSend: false, //是否发送了验证码 false没有
      countNum: 60,
      queryCode: "", //二维码code
      isOverDue: false, //二维码是否过期 false没有过期
      relation: "", //关系
      t1:'',//定时器
      sendFlag: false //是否提交了 true 已经提交了
    };
  },
  watch: {
    phone(n, o) {
      if (n.length == 11) {
        this.validatePhone();
      } else {
        this.phoneRight = false;
      }
    }
  },
  methods: {
    validatePhone() {
      var phoneReg = /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/;
      if (phoneReg.test(this.phone)) {
        this.phoneRight = true;
      } else {
        this.$toast("输入的手机号不合法，请重新输入！");
        this.phone = "";
      }
    },
    submitPhone() {
      this.sendFlag = true;
      this.countNum = 60;
      if (this.code) {
        //调用上传
        var params = {};
        var body = {
          userId: this.userId,
          relation: this.relation,
          phone: this.phone,
          phoneCode: this.code
        };
        params.body = body;
        this.$api.submitPhone(params)
          .then(res => {
            var result = res.data;
            if (result.code == 0) {
              clearTimeout(this.t1);
              Dialog.confirm({
                title: "提示",
                message: "绑定成功，打开南风医生APP查看更多？"
              })
                .then(() => {
                  this.$router.push({ name: "downloadAPP" });
                })
                .catch(() => {
                  // on cancel
                  this.phone = "";
                  this.code = "";
                  this.sendFlag = false;
                  this.isSend = false;
                });
            }
            this.sendFlag = false;
            this.isSend = false;
          })
          .catch(err => {
            this.phone = "";
            this.code = "";
            this.sendFlag = false;
            this.isSend = false;
            clearTimeout(this.t1);
            this.$toast(err.message);
          });
          clearTimeout(this.t1)
      }
    },
    sendCode() {
      this.countNum = 60 ;
      if (this.phoneRight) {
        //调用发送验证码;
        var params = {};
        var body = {
          phone: this.phone,
          codeType: 6
        };
        params.body = body;
        this.$api.sendMesForReg(params)
          .then(res => {
            var result = res.data;
            if (result.code == 0) {
              this.isSend = true;
              this.setTime();
            }
          })
          .catch(res => {
            this.$toast(res.message);
            this.phone = "";
          });
      }
    },
    setTime() {
      if (this.countNum == 0) {
        this.isSend = false;
        this.countNum = 60;
      } else {
        this.countNum--;
        this.t1 = setTimeout(() => {
          this.setTime();
        }, 1000);
      }
    },
    queryOverDue() {
      var params = {};
      var body = {
        userId: this.userId,
        code: this.queryCode
        // code:20663493
      };
      params.body = body;
      this.$api
        .queryOverdue(params)
        .then(res => {
          var result = res.data;
          if (result.code == 0) {
            var res = result.data;
            this.userName = res.username;
            this.userPhone = res.account;
            if (res.loseTime < res.nowTime) {
              this.isOverDue = true;
            }
          }
        })
        .catch(res => {
          this.$toast(res.message);
        });
    }
  },
  mounted() {
    var uc = window.location.search;
    uc = decodeURIComponent(uc);
    if (uc.indexOf("userId=") != -1) {
      var tmpUc = uc.substring(uc.indexOf("userId="));
      var tmpUcArr = tmpUc.split("&");
      var userId = tmpUcArr[0].substring(tmpUcArr[0].indexOf("userId=") + 7);
      this.userId = userId;
      this.relation = tmpUcArr[1].substring(
        tmpUcArr[1].indexOf("relation=") + 9
      );
      // var token = tmpUcArr[2].substring(tmpUcArr[2].indexOf("token=") + 6);
      // var userArr = [token, userId];
      // this.$store.commit("setLoginData", userArr);
      this.queryCode = tmpUcArr[2].substring(tmpUcArr[2].indexOf("code=") + 5);
      //查询二维码过期
      this.queryOverDue();
    }
  }
};
</script>

<style>
.friendContent .van-hairline--top-bottom:after {
  border: none;
}
.friendContent .friendCode.van-cell {
  padding: 20px 0px;
  margin: 0 30px;
}
.friendContent .van-cell:not(:last-child):after {
  transform: scaleY(1);
  -webkit-transform: scaleY(1);
}
</style>
<style scoped>
.friendBox {
  width: 100%;
  height: 1334px;
  background: url("../../assets/img/friendManage/bj.png") no-repeat fixed;
  background-size: 100%;
}
.friendContent {
  width: 690px;
  height: 847px;
  background-color: #ffffff;
  border-radius: 8px;
  margin: 33px 30px 0 30px;
  text-align: center;
  overflow: hidden;
}
.friendLogo {
  width: 151px;
  height: 87px;
  margin: 43px 270px 27px;
}
.friendTitle {
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 42px;
}
.friendTips {
  width: 614px;
  margin: 0 38px;
  font-size: 28px;
  color: #666;
  line-height: 48px;
  text-align: left;
}
.inpContent {
  margin-top: 58px;
}
.sendCode {
  color: #999;
}
.rightPhone {
  color: #3ac756;
}
.agreeSave,
.mask {
  width: 650px;
  height: 80px;
  margin: 52px 20px;
  border-radius: 40px;
}
.agreeSave {
  background-image: linear-gradient(90deg, #73e539 0%, #3ac756 100%),
    linear-gradient(#f6f8fa, #f6f8fa);
  background-blend-mode: normal, normal;
  color: #fff;
  line-height: 80px;
  position: relative;
}
.mask {
  background-color: rgba(255, 255, 255, 0.6);
  position: absolute;
  left: -20px;
  top: -52px;
}
.overdueContainer {
  font-size: 28px;
  color: #666;
}
.tipsImg {
  width: 72px;
  height: 72px;
  margin: 106px auto 0;
}
.tipText {
  margin: 28px 0;
  font-weight: bold;
  color: #333;
}
</style>