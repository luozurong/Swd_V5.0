<template>
  <div class="filloutInfo">
    <!-- 头部 -->
    <div class="head_title">
      <van-nav-bar title="就诊人信息填写" :fixed="true" left-arrow @click-left="onClickLeft" />
      <div style="width:100%; height:46px;"></div>
    </div>
    <!-- 表单内容 -->
    <div class="form_con">
      <van-cell-group>
        <van-field
          v-model="formData.idCard"
          type="idcard"
          maxlength="18"
          clearable
          label="身份证号"
          placeholder="请输入身份证号"
          placeholder-style="color:#aeafb2;font-size:14px;"
          required
          @blur="watchIdCard"
        />

        <van-field
          v-model="formData.patientName"
          maxlength="10"
          label="姓名"
          placeholder="请输入真实的姓名"
          placeholder-style="color:#aeafb2;font-size:14px;"
          required
        />

        <div class="van-cell van-cell--required van-field">
          <div class="van-cell__title van-field__label">性别</div>
          <div class="van-cell__value">
            <div class="van-field__body">
              <span
                v-for="(item, index) in sexList"
                :key="index"
                @click="bindSex(item.value)"
                class="options"
                :class="{'options_active':item.value == formData.sex}"
              >{{item.name}}</span>
            </div>
          </div>
        </div>

        <van-field
          v-model="formData.patientDob"
          readonly
          label="出生日期"
          placeholder="请选择出生日期"
          placeholder-style="color:#aeafb2;font-size:14px;"
          required
          @click="hanldeShowPopup"
        />

        <!-- <div class="van-cell van-cell--required van-field" v-if="!formData.idCard">
          <div class="van-cell__title van-field__label">出生日期</div>
          <div class="van-cell__value">
            <div class="van-field__body">
            </div>
          </div>
        </div>

        <van-field v-else @click="pickerBirth" :value="formData.patientDob" readonly label="出生日期" />-->

        <van-field
          v-model="formData.contractPhone"
          type="tel"
          maxlength="11"
          label="手机号码"
          placeholder="便于获取医生服务通知"
          placeholder-style="color:#aeafb2;font-size:14px;"
          @blur="watchPhone"
        />
      </van-cell-group>
      <div class="diseaseDesc_pic">
        <div class="diseaseDesc_pic_title">请上传病历信息、医院处方，检查数据</div>
        <div class="van-uploader">
          <div class="van-uploader__wrapper">
            <div class="van-uploader__preview" v-for="(item, index) in pics" :key="index">
              <div class="van-image van-uploader__preview-image" @click="previewImage(index)">
                <img :src="item" class="van-image__img" style="object-fit: cover;" />
              </div>
              <i
                class="van-icon van-icon-delete van-uploader__preview-delete"
                @click="deleteImg(index)"
              ></i>
            </div>
            <van-uploader
              multiple
              :max-count="5"
              :after-read="afterRead"
              :before-read="beforeRead"
              v-if="pics.length<5"
            ></van-uploader>
          </div>
        </div>
      </div>
    </div>
    <!-- 按钮 -->
    <div class="confirm_button" @click="submit">
      <van-button round type="default">提交</van-button>
    </div>

    <!-- 弹起层 -->
    <van-popup v-model="show" position="bottom">
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        :min-date="minDate"
        :max-date="maxDate"
        @confirm="confirm"
        @cancel="cancel"
        :formatter="formatter"
      />
    </van-popup>
  </div>
</template>

<script>
import NoDataView from "../components/noData";
import { ImagePreview } from "vant";

export default {
  components: {
    NoDataView
  },
  data() {
    return {
      sexList: [
        {
          value: 1,
          name: "男"
        },
        {
          value: 2,
          name: "女"
        }
      ],
      sexItem: "男", //默认显示的
      relationList: ["本人", "父母", "子女", "配偶", "其他"],
      relationItem: "其他", //默认显示的
      // 历史就诊人
      historyList: [],
      formData: {
        patientId: "",
        patientName: "",
        sex: 1,
        idCard: "",
        contractPhone: "",
        memberAge: "",
        patientDob: "",
        relation: "其他",
        isAbnormalNotify: "",
        isEmergencyContact: "",
        isPushData: "",
        isScanning: "",
        imgUrl: "",
        faceId: ""
      },
      // 默认显示的
      currentTab: -1,
      index: 0,
      historyAdd: false, //是否点击添加就诊人
      birth: "", //出生日期
      showPopup: false, //是否显示协议遮罩层
      expertId: "", //医生专家Id
      isSubmit: true,
      pics: [], //图片
      fileList: [],
      isFirst: true, //是否首次进入
      minHour: 10,
      maxHour: 20,
      minDate: new Date(1900, 0, 1),
      maxDate: new Date(),
      currentDate: new Date(),
      show: false,
      faceId: "",
      postData: [],
      fileIds: []
    };
  },
  mounted() {
    if (this.$route.query.d) {
      this.formData.faceId = this.$route.query.d;
      this.faceId = this.$route.query.d;
    }
  },
  methods: {
    onClickLeft() {},

    // 身份证判断
    isCardID(sId) {
      var aCity = {
        11: "北京",
        12: "天津",
        13: "河北",
        14: "山西",
        15: "内蒙古",
        21: "辽宁",
        22: "吉林",
        23: "黑龙江",
        31: "上海",
        32: "江苏",
        33: "浙江",
        34: "安徽",
        35: "福建",
        36: "江西",
        37: "山东",
        41: "河南",
        42: "湖北",
        43: "湖南",
        44: "广东",
        45: "广西",
        46: "海南",
        50: "重庆",
        51: "四川",
        52: "贵州",
        53: "云南",
        54: "西藏",
        61: "陕西",
        62: "甘肃",
        63: "青海",
        64: "宁夏",
        65: "新疆",
        71: "台湾",
        81: "香港",
        82: "澳门",
        91: "国外"
      };
      var iSum = 0;
      var info = "";
      if (!/^\d{17}(\d|x)$/i.test(sId)) return false;

      sId = sId.replace(/x$/i, "a");
      if (aCity[parseInt(sId.substr(0, 2))] == null) return false;

      var sBirthday =
        sId.substr(6, 4) +
        "-" +
        Number(sId.substr(10, 2)) +
        "-" +
        Number(sId.substr(12, 2));
      var d = new Date(sBirthday.replace(/-/g, "/"));
      if (
        sBirthday !=
        d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate()
      )
        return false;

      for (var i = 17; i >= 0; i--) {
        iSum += (Math.pow(2, i) % 11) * parseInt(sId.charAt(17 - i), 11);
      }
      if (iSum % 11 != 1) return false;
      return true;
    },

    // 监听身份证号填写
    watchIdCard: function() {
      var idCard = this.formData.idCard;
      if (this.isCardID(idCard)) {
      } else {
        if (idCard) {
          this.$toast({
            duration: 1000,
            message: "请输入正确的身份证号码"
          });
        }
      }
      if (idCard) {
        var nowYear = new Date().getFullYear();
        var year = idCard.slice(6, 10);
        var month = idCard.slice(10, 12);
        var day = idCard.slice(12, 14);
        var patientDob = year + "-" + month + "-" + day;
        var memberAge = nowYear - year;
        var sex = "";
        if (parseInt(idCard.substr(16, 1)) % 2 == 1) {
          sex = "1";
        } else {
          sex = "2";
        }
        this.formData.patientDob = patientDob;
        this.formData.memberAge = memberAge;
        this.formData.sex = sex;
      }
    },

    // 监听手机号码填写
    watchPhone: function() {
      var phone = /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/;
      if (
        !phone.test(this.formData.contractPhone) &&
        this.formData.contractPhone
      ) {
        this.$toast({
          duration: 1000,
          message: "请输入正确的手机号码"
        });
      }
    },

    //格式化
    formatter(type, value) {
      if (type === "year") {
        return `${value}年`;
      } else if (type === "month") {
        return `${value}月`;
      } else if (type === "day") {
        return `${value}日`;
      }
      return value;
    },

    //出生日期选择确定
    confirm(e) {
      var d = new Date(e);
      this.formData.patientDob =
        d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
      this.show = false;
    },

    //出生日期选择取消
    cancel() {
      this.show = false;
    },

    // 点击出生日期
    pickerBirth: function() {
      this.$toast({
        duration: 1000,
        message: "已根据身份证号为您自动匹配出生日期，无需手动改动"
      });
    },

    hanldeShowPopup() {
      if (!this.formData.idCard) {
        this.show = true;
      } else {
        this.$toast({
          duration: 1000,
          message: "已根据身份证号为您自动匹配出生日期，无需手动改动"
        });
      }
    },

    // 性别选择
    bindSex: function(event) {
      if (!this.formData.idCard) {
        this.formData.sex = event;
      } else {
        this.$toast("已根据身份证号为您自动匹配出性别，无需手动改动");
      }
    },

    /**
     * 同意协议
     */
    agree() {
      const that = this;
      if (that.isSubmit) {
        that.isSubmit = false;
        setTimeout(function() {
          that.isSubmit = true;
        }, 1000); //一秒内不能重复点击提交

        let params = {
          header: {},
          body: null
        };
        if (this.pics.length > 0) {
          that.formData.imgUrl = this.pics.join(",");
        }
        params.body = that.formData;
        params.body.faceMd = that.faceId;
        // params.body.faceMd ='1111';
        that.$api
          .savePatientInfo(params)
          .then(res => {
            if (res.data.code == 0) {
              that.$toast.success({
                duration: 1000,
                message: "信息填写成功"
              });
            } else {
              that.$toast({
                duration: 1000,
                message: res.data.message
              });
            }
          })
          .catch(err => {});
      }
    },

    /**
     * 提交信息
     */
    submit() {
      var values = this.formData;
      if (!values.idCard) {
        this.$toast({
          duration: 1000,
          message: "请输入身份证号码"
        });
        return;
      }
      if (values.idCard) {
        var idCard = values.idCard;
        if (this.isCardID(idCard)) {
        } else {
          this.$toast({
            duration: 1000,
            message: "请输入正确的身份证号码"
          });
          return;
        }
      }
      if (!values.patientName) {
        this.$toast({
          duration: 1000,
          message: "请输入姓名"
        });
        return;
      }
      if (!values.patientDob) {
        this.$toast({
          duration: 1000,
          message: "请输入出生日期"
        });
        return;
      }
      var phone = /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/;
      if (!phone.test(values.contractPhone) && values.contractPhone) {
        this.$toast({
          duration: 1000,
          message: "请输入正确的手机号码"
        });
        return;
      }
      if (this.pics.length == 0) {
        this.$toast({
          duration: 1000,
          message: "请上传病历信息、医院处方，检查数据"
        });
        return;
      }
      this.agree();
    },

    // 删除图片
    deleteImg: function(index) {
      var that = this;
      this.pics.splice(index, 1);
    },

    afterRead(file) {
      // 此时可以自行将文件上传至服务器
      const formData = new FormData();
      formData.append("file", file.file);
      this.$api
        .chatImgUpload(formData)
        .then(res => {
          var res = res.data;
          if (res.code == 0 && res.Messages != "未找到文件") {
            this.pics.push(res.data.uploadFilePath);
          }
        })
        .catch(err => {});
    },

    // 返回布尔值
    beforeRead(file) {
      if (file.type.indexOf("image") < 0) {
        this.$toast("图片格式不正确！");
        return false;
      }

      return true;
    },

    //图片预览
    previewImage(index) {
      var that = this;
      ImagePreview({
        images: that.pics,
        startPosition: index,
        onClose() {
          // do something
        }
      });
    }
  }
};
</script>

<style>
.filloutInfo .line {
  border-bottom: 1px solid #ebebeb;
  opacity: 0.5;
}
/* 历史就诊人----开始 */
.filloutInfo .history {
  display: flex;
  flex-wrap: wrap;
  padding: 20px 30px 0 30px;
}
.filloutInfo .history .history_li {
  display: flex;
  align-items: center;
  min-width: 200px;
  padding-right: 10px;
  height: 132px;
  margin-bottom: 26px;
  font-size: 24px;
  color: #666666;
  background-color: #ffffff;
  border-radius: 8px;
}
.filloutInfo .history .history_li:nth-child(3n-1) {
  margin-left: 26px;
  margin-right: 26px;
}
.filloutInfo .history .history_li .history_icon {
  margin: 0 8px 0 18px;
}
.filloutInfo .history .history_li .name {
  margin-bottom: 16px;
  font-size: 28px;
  line-height: 1;
  letter-spacing: 1px;
  color: #333333;
}
.filloutInfo .history .history_li .sex {
  line-height: 1;
  letter-spacing: 1px;
}
.filloutInfo .history .history_li .sex .age {
  margin-left: 10px;
}
.filloutInfo .history .history_li.history_add {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.filloutInfo .history .history_li.history_add .history_icon {
  margin: 18px 0 0 0;
}
/* 历史就诊人----结束 */

/* 表单内容区域----开始 */
.form_con {
  padding-bottom: 130px;
}
.filloutInfo .van-cell {
  padding: 30px 30px;
}

.filloutInfo .van-cell__title {
  -webkit-flex: unset;
  flex: unset;
  display: inline-block;
  width: 120px !important;
  padding-right: 40px;
  text-align-last: justify;
  text-align: justify;
  font-size: 28px;
  color: #333;
}

.filloutInfo .van-cell--required::before {
  position: absolute;
  top: 32px;
  left: 154px;
  font-size: 28px;
  color: #f44;
  content: "*";
}

.filloutInfo .van-cell--required {
  overflow: visible;
}

.filloutInfo .van-cell:after {
  content: " ";
  position: absolute;
  pointer-events: none;
  box-sizing: border-box;
  -webkit-transform-origin: center;
  transform-origin: center;
  top: auto;
  left: 15px;
  right: 0;
  bottom: 0;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
  border-bottom: 1px solid #eee;
}

.filloutInfo .van-cell {
  position: relative;
  display: -webkit-flex;
  display: flex;
  width: 100%;
  background-color: #fff;
  box-sizing: border-box;
}

.filloutInfo .birth {
  color: #333;
  font-size: 28px;
}
.filloutInfo .options {
  display: inline-block;
  width: 80px;
  height: 48px;
  margin-right: 20px;
  line-height: 48px;
  font-size: 28px;
  color: #aeafb2;
  text-align: center;
  background-color: #fff;
  border-radius: 8px;
  border: solid 1px #d2d2d4;
}

.filloutInfo .options:last-of-type {
  margin-right: 0;
}

.filloutInfo .options_active {
  color: #3ac756;
  border: solid 1px #3ac756;
}
/* 表单内容区域----结束 */

/* 按钮---开始 */
.filloutInfo .confirm_button {
  position: fixed;
  bottom: 40px;
  left: 75px;
  z-index: 99;
}
.filloutInfo .confirm_button .van-button {
  width: 600px;
  height: 80px;
  line-height: 80px;
  font-size: 32px;
  color: #fffefe;
  background-image: linear-gradient(90deg, #73e539 0%, #3ac756 100%),
    linear-gradient(#3ac756, #3ac756);
  background-blend-mode: normal, normal;
  border-radius: 40px;
}
/* 按钮---结束 */

/* 出生日期 */
.filloutInfo .picker {
  width: 522px;
  font-size: 28px;
  color: #aeafb2;
}

/* 协议遮罩层 */
.filloutInfo .popup_con {
  width: 690px;
  height: 1084px;
  line-height: 1;
  background-color: #ffffff;
}
.filloutInfo .van-popup--center {
  border-radius: 10px;
}
.filloutInfo .popup_con .title {
  padding: 60px 0 30px 0;
  text-align: center;
  font-weight: bold;
  font-size: 36px;
  color: #333333;
}
.filloutInfo .scroll_view {
  width: 620px;
  height: 864px;
  padding: 0 35px;
  line-height: 30px;
  font-size: 28px;
  text-align: justify;
  color: #333333;
  overflow: hidden;
}
::-webkit-scrollbar {
  width: 0;
  height: 0;
  color: transparent;
}
.filloutInfo .scroll_view .text_title {
  color: #3ac756;
}
.filloutInfo .btn {
  display: flex;
  height: 88px;
  line-height: 88px;
  overflow: hidden;
  border-top: 1px solid #d2d2d4;
}
.filloutInfo .btn button {
  width: 50%;
  font-size: 36px;
  color: #aeafb2;
  background: #ffffff;
  border-radius: 0;
}
.filloutInfo .btn .right {
  color: #007aff;
  border-left: 1px solid #d2d2d4;
}
.filloutInfo .btn button::after {
  border: none;
}

/* 图片上传 */
.filloutInfo .diseaseDesc_pic {
  width: 690px;
  margin: 20px auto 0;
  padding: 36px 0 32px;
  font-size: 24px;
  line-height: 36px;
  color: #666666;
}
.diseaseDesc_pic_title {
  padding-bottom: 20px;
}
.uploader-img {
  display: flex;
  flex-wrap: wrap;
  padding: 20px 0;
}
.uploader-list {
  position: relative;
  width: 145px;
  height: 145px;
  margin-right: 22px;
  margin-bottom: 22px;
  background-color: #ebebeb;
}
.uploader-list image {
  width: 100%;
  height: 100%;
  border-radius: 10px;
  overflow: hidden;
}
.uploader-list .delete {
  position: absolute;
  left: -7px;
  top: -7px;
  width: 13px;
  height: 13px;
  border-radius: 50%;
  background: #ffffff;
}
.upAdd {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 143px;
  height: 143px;
  border-radius: 10px;
  border: 1px solid #efefef;
}
.van-image-preview .van-swipe {
  height: 40%;
  margin-top: 40%;
}
</style>