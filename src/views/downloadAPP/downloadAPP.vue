<template>
  <div class="downloadAPP">
    <div class="logo">
      <img src="../../assets/img/downloadAPP/logo.png" alt />
    </div>
    <div class="title">
      <img src="../../assets/img/downloadAPP/title.png" alt />
    </div>
    <div class="content">
      <div class="li">
        <img src="../../assets/img/downloadAPP/bubble.png" alt />
        <p>复诊延方</p>
      </div>
      <div class="li">
        <img src="../../assets/img/downloadAPP/bubble.png" alt />
        <p>慢病管理</p>
      </div>
      <div class="li">
        <img src="../../assets/img/downloadAPP/bubble.png" alt />
        <p>慢病开药</p>
      </div>
      <div class="li">
        <img src="../../assets/img/downloadAPP/bubble.png" alt />
        <p>药师咨询</p>
      </div>
      <div class="li">
        <img src="../../assets/img/downloadAPP/bubble.png" alt />
        <p>名医咨询</p>
      </div>
      <div class="li">
        <img src="../../assets/img/downloadAPP/bubble.png" alt />
        <p>套餐购买</p>
      </div>
    </div>
    <div class="btn_box">
      <div class="btn_li" @click="download('ios')">
        <img class="ios" src="../../assets/img/downloadAPP/IOS.png" alt />
        <span>IOS下载</span>
      </div>
      <div class="btn_li" @click="download('android')">
        <img class="android" src="../../assets/img/downloadAPP/Android.png" alt />
        <span>Android下载</span>
      </div>
    </div>
    <div class="bottom">
      <img src="../../assets/img/downloadAPP/pic_bottom.png" alt />
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  mounted() {},
  methods: {
    download(param) {
      if (param == "ios") {
        window.location.href =
          "https://itunes.apple.com/cn/app/id1459228367?mt=8";
      } else {
        window.location.href =
          "https://a.app.qq.com/o/simple.jsp?pkgname=cn.kinglian.south.wind";
      }
    }
  }
};
</script>

<style>
.downloadAPP img {
  width: 100%;
  height: 100%;
}
.downloadAPP {
  height: 100vh;
  position: relative;
  background-image: url("../../assets/img/downloadAPP/bj.png");
  background-repeat: no-repeat;
  background-size: 794px 1414px;
  background-position: -20px -100px;
}
.downloadAPP .logo {
  width: 174px;
  height: 100px;
  margin: 0 auto;
  padding-top: 98px;
}
.downloadAPP .title {
  width: 514px;
  height: 58px;
  margin: 0 auto;
  padding-top: 28px;
}
.downloadAPP .content {
  display: flex;
  flex-wrap: wrap;
  padding-top: 68px;
  margin: 0 114px;
}
.downloadAPP .content .li {
  width: 126px;
  height: 126px;
  margin-right: 72px;
  margin-bottom: 42px;
  position: relative;
}
.downloadAPP .content .li:nth-child(3n) {
  margin-right: 0px;
}
.downloadAPP .content .li p {
  position: absolute;
  top: 31px;
  left: 33px;
  width: 60px;
  font-size: 28px;
  line-height: 34px;
  color: #00a2e9;
}
.downloadAPP .btn_box {
  padding-top: 46px;
}
.downloadAPP .btn_box .btn_li {
  display: flex;
  justify-content: center;
  width: 400px;
  height: 80px;
  margin: 0 auto;
  line-height: 80px;
  font-size: 32px;
  color: #ffffff;
  background-color: #3ac756;
  box-shadow: 0px 11px 46px 0px rgba(20, 94, 35, 0.35);
  border-radius: 40px;
}
.downloadAPP .btn_box .btn_li:first-of-type {
  margin-bottom: 66px;
}
.downloadAPP .btn_box .btn_li .ios {
  width: 32px;
  height: 40px;
  margin-top: 17px;
  margin-right: 9px;
}
.downloadAPP .btn_box .btn_li .android {
  width: 36px;
  height: 40px;
  margin-top: 20px;
  margin-right: 6px;
}
.downloadAPP .bottom {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 285px;
  overflow: hidden;
}
.downloadAPP .bottom img {
  width: 810px;
  height: 286px;
  margin-left: -32px;
}
</style>