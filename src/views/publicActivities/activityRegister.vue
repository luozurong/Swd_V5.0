<template>
  <div class="activityRegister">
    <!-- 头部 -->
    <div class="head_title">
      <van-nav-bar title="活动报名" left-text :fixed="true" left-arrow @click-left="onClickLeft" />
      <div style="width:100%; height:46px;"></div>
    </div>

    <!-- 内容 -->
    <div class="tip_msg">
      <span>注：此活动仅在宁夏省银川市举行</span>
    </div>
    <div class="input_box">
      <van-cell-group>
        <van-field
          v-model="username"
          required
          clearable
          input-align="right"
          label="筛查人姓名"
          placeholder="请输入真实姓名"
        />
        <van-field
          maxlength="11"
          v-model="phone"
          type="tel"
          required
          clearable
          input-align="right"
          label="筛查人手机"
          placeholder="请输入手机号码"
        />
        <div
          class="input_long van-cell van-cell--required van-cell--clickable van-field"
          @click="gotoAddress"
        >
          <div class="van-cell__title van-field__label" style="width: 120px;">
            <span>筛查人居住区域</span>
          </div>
          <div class="van-cell__value">
            <div class="van-field__body">
              <span class="address_msg" v-if="addressMsg">{{addressMsg}}</span>
              <input
                type="text"
                placeholder="请选择"
                readonly="readonly"
                class="van-field__control van-field__control--right"
                v-else
              />
            </div>
          </div>
          <i class="van-icon van-icon-arrow van-cell__right-icon"></i>
        </div>
        <van-field
          v-model="detailAddress"
          clearable
          input-align="right"
          label="详细地址"
          placeholder="如道路、门牌号、小区、楼栋号、单元等"
        />
        <van-field v-model="phonenumber" readonly input-align="right" label="报名人手机" />
      </van-cell-group>
    </div>
    <div class="btn_box">
      <van-button round block class="submit_btn" @click="submit">提交</van-button>
    </div>
    <div class="explain">
      <span>活动协议说明</span>
      <span>本筛查服务为免费服务，不收取任何费用。所有个人隐私数据均保存在银川市卫健委指定的地方，请您放心使用。</span>
      <span>您填写完个人信息后，会有专业的筛查人员与您电话联系，安排您在就近的社区服务中心/站免费检查，请注意接听来电。</span>
      <span>检查时请携带您的身份证。</span>
    </div>
  </div>
</template>  
<script>
import { mapState, mapActions } from "vuex";

export default {
  components: {},
  data() {
    return {
      IdCard: "", //身份证号码18位
      username: "", //用户姓名
      title: "默认为空",
      showMassage: "", // 弹框信息
      phonenumber: "", //报名人手机号码
      phone: "", // 手机号
      detailAddress: "", //详细地址
      activitiesId: null, //活动id
      showToastSuccess: false, // 显示报名成功弹框
      showToastFail: false, // 显示报名失败弹框
      addressMsg: null,
      submitFlag: false //是否提交 false 没有提交
    };
  },
  mounted() {
    if (this.$route.query.pageInfo) {
      this.IdCard = this.$route.query.pageInfo.IdCard;
      this.username = this.$route.query.pageInfo.username;
      this.activitiesId = this.$route.query.pageInfo.activitiesId;
      this.phone = this.$route.query.pageInfo.phone;
      this.detailAddress = this.$route.query.pageInfo.detailAddress;
    }
    if (this.$route.query.selected) {
      this.addressMsg = "宁夏省 银川市 " + this.$route.query.selected;
    }
    this.getInfo(); //获取个人信息
    if (this.$route.query.activitiesId) {
      this.activitiesId = this.$route.query.activitiesId;
    }
    // if(this.addressData){
    //     this.addressMsg = '宁夏省 银川市 ' + this.addressData;
    // }
  },
  // 状态管理
  computed: mapState({
    // mapState相当于映射
    villageCode: state => state.villagesMsg.villageCode, //选好的社区code
    villageName: state => state.villagesMsg.villageName, //选好的社区名称
    userId: state => state.userInfo.userId //用户id userId
  }),
  methods: {
    gotoAddress() {
      this.$router.push({
        path: "/writeAddress",
        query: {
          username: this.username,
          activitiesId: this.activitiesId,
          phone: this.phone,
          detailAddress: this.detailAddress
        }
      });
    },
    // 返回上一页
    onClickLeft() {
      // this.$router.go(-1); //返回上一层
      this.$router.push({ path: "/activitiesIndex" });
    },
    // 获取个人信息
    getInfo() {
      const that = this;
      // 获取当前时间
      this.$store.commit("setTimeStamp");

      //获取个人信息
      var params = {};
      params.body = {
        clinicId: "90000",
        roleId: that.userId,
        roleType: "1"
      };
      that.$api
        .getUserAccountInfo(params)
        .then(res => {
          if (res.data.code == 0) {
            var userData = res.data.data;
            var phone = /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/;
            if (userData.telephone) {
              that.phonenumber = userData.telephone;
              if (!that.phone) {
                that.phone = userData.telephone; //默认回填报名人手机号码
              }
            } else {
              that.phonenumber = userData.account;
              if (!that.phone) {
                that.phone = userData.account; //默认回填报名人手机号码
              }
            }
          }
        })
        .catch(err => {});
    },
    // 提交信息
    submit() {
      if (!this.submitFlag) {
        var that = this;
        // 验证用户姓名
        if (!this.username) {
          this.showMassage = "筛查人姓名不能为空";
          this.showToast(this.showMassage);
          return false;
        }
        if (this.username && this.username.length < 2) {
          this.showMassage = "筛查人姓名不合法，请重新输入";
          this.showToast(this.showMassage);
          return false;
        }
        var han = /^[\u4e00-\u9fa5]+$/;
        if (!han.test(this.username)) {
          this.showMassage = "请输入中文姓名";
          this.showToast(this.showMassage);
          return false;
        }
        // 验证手机号
        if (!this.phone) {
          this.showMassage = "手机号码不能为空";
          this.showToast(this.showMassage);
          return false;
        }
        if (this.phone && this.phone.length < 11) {
          this.showMassage = "请输入11位手机号码";
          this.showToast(this.showMassage);
          return false;
        }
        var phone = /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/;
        if (!phone.test(this.phone)) {
          this.showMassage = "手机号码不合法，请重新输入";
          this.showToast(this.showMassage);
          return false;
        }
        // 验证地区选择信息
        if (!this.addressMsg) {
          this.showMassage = "筛查人居住区域不能为空";
          this.showToast(this.showMassage);
          return false;
        }
        // this.$vux.loading.show({
        //     text: '报名申请中..',
        // })
        setTimeout(() => {
          // this.$vux.loading.hide()
          // 获取当前时间
          this.$store.commit("setTimeStamp");
          const address = this.addressMsg.replace(/\s*/g, ""); // 当前选择的区街道居委

          //用户信息入库接口（三师）
          var params = {};
          params.body = {
            ActivitiesId: that.activitiesId, //活动ID
            PersonName: that.username, //姓名
            IdCard: "", //身份证
            Telephone: that.phone, //手机号
            userId: that.userId, //登录用户ID
            CreatedTelephone: that.phonenumber, //登录用户手机号
            VillageCode: that.villageCode, //居委编码
            Room: that.detailAddress, //门牌号【具体地址】
            Address: address, //省市区街道居委汉字拼接
            Source: "0", //0 app；1 公众号
            Subscribe: "", //用户是否订阅该公众号标识
            OpenId: "",
            NickName: "", //微信昵称
            Sex: "", //1 男 2 女 0 未知
            City: "",
            Country: "",
            Province: "",
            Language: "", //用户的语言，简体中文为zh_CN
            Headimgurl: "" //用户头像
          };
          that.$api
            .signUpActivity(params)
            .then(res => {
              if (res.data.code == "0" && res.data.result == "0") {
                //报名成功
                this.showMassage = "报名成功！";
                this.showToast(this.showMassage);
                this.submitFlag = true;
                setTimeout(() => {
                  this.onClickLeft(); //返回活动首页
                }, 1000);
              } else {
                //报名失败
                this.submitFlag = false;
                this.showMassage = res.data.reason;
                this.showToast(this.showMassage);
              }
            })
            .catch(err => {
              console.log(err);
              this.submitFlag = false;
              this.showToast(this.showMassage);
            });
        }, 1200);
      } else {
      }
    },
    showToast(msg) {
      JsBridge.callMethod(
        "JsInvokeNativeMethod",
        "showToast",
        { message: "消息提示", toast: msg },
        function(data) {}
      );
    }
  }
};
</script>  
<style>
/*内容*/
.activityRegister .tip_msg {
  width: 750px;
  height: 56px;
  font-size: 28px;
  line-height: 56px;
  text-align: center;
  color: #ff6e26;
  background-color: #fff7ec;
}
.activityRegister .input_box {
  padding-right: 0px;
  background: #ffffff;
  font-size: 28px;
  color: #333333;
}
.activityRegister .van-cell {
  padding: 32px 40px;
}
.activityRegister .van-cell--required:before {
  left: 24px;
  top: 34%;
  font-size: 28px;
  color: #ff6e6e;
  content: "*";
}
.activityRegister .van-cell:not(:last-child):after {
  content: " ";
  right: 40px;
  left: 40px;
  border-bottom: 1px solid #ebebeb;
}
.activityRegister .van-hairline--top-bottom:after {
  border-width: 0px 0;
}
.activityRegister .van-hairline--bottom:after {
  border-bottom-width: 0px;
}
/*按钮*/
.btn_box {
  width: 100%;
  height: 80px;
  padding-top: 56px;
  padding-bottom: 48px;
}
.activityRegister .submit_btn {
  display: block;
  width: 690px;
  height: 80px;
  margin-left: 30px;
  line-height: 80px;
  color: #ffffff;
  background-image: linear-gradient(90deg, #73e539 0%, #3ac756 100%),
    linear-gradient(#3ac756, #3ac756);
  background-blend-mode: normal, normal;
  border-radius: 40px;
}

/*提示文字*/
.activityRegister :-moz-placeholder {
  /* Mozilla Firefox 4 to 18 */
  color: #d2d2d4;
  opacity: 1;
  font-size: 24px;
}

.activityRegister ::-moz-placeholder {
  /* Mozilla Firefox 19+ */
  color: #d2d2d4;
  opacity: 1;
  font-size: 24px;
}

.activityRegister input:-ms-input-placeholder {
  color: #d2d2d4;
  opacity: 1;
  font-size: 24px;
}

.activityRegister input::-webkit-input-placeholder {
  color: #d2d2d4;
  opacity: 1;
  font-size: 24px;
}

/* 居住区域 */
.activityRegister .input_long {
  align-items: center;
}
/* 不换行 */
.activityRegister .input_long .address_msg {
  padding: 0;
  line-height: 40px;
  display: inline-block;
  width: 100%;
  word-wrap: break-word;
}

/* 信息 */
.explain {
  padding: 0 30px 30px 25px;
}
.explain span {
  display: block;
  font-size: 24px;
  line-height: 48px;
  color: #666666;
}
.explain span:first-of-type {
  margin-bottom: 10px;
  font-size: 28px;
  color: #333333;
}
</style>
