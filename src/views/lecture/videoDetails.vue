<template>
  <div class="videoDatailBox">
    <van-nav-bar :title="videoObj.title" left-arrow @click-left="onClickLeft" />
    <div class="liveVideoContent">
      <iframe
        class="videoIframe"
        frameborder="0"
        marginheight="0"
        marginwidth="0"
        :src="videoObj.sourceUrl"
      ></iframe>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      videoObj: {
        sourceUrl: "",
        title: ""
      },
      noticeAppFinishFlag: false //是否通知app关闭
    };
  },
  methods: {
    onClickLeft(type) {
      if (this.noticeAppFinishFlag) {
        //调用app 的关闭
        JsBridge.callMethod("JsInvokeNativeMethod", "finishPage", function(
          data
        ) {
        });
      } else {
        this.$router.go(-1);
      }
    }
  },
  mounted() {
    var uc = window.location.search;
    //app进入
    uc = decodeURIComponent(uc);
    if (uc.indexOf("type=app") != -1) {
      this.noticeAppFinishFlag = true;
      var tmpvideoObj = uc.split('&') ;
      this.videoObj.title = tmpvideoObj[1].substring(tmpvideoObj[1].indexOf("&title=")+7);
      this.videoObj.sourceUrl = tmpvideoObj[2].substring(tmpvideoObj[2].indexOf("&sourceUrl=")+11);
    } else {
      //h5进入
      if (this.$route.params.videoObj) {
        this.videoObj = this.$route.params.videoObj;
      }
    }
  }
};
</script>

<style  scoped>
.videoDatailBox,.liveVideoContent{
  width: 100%;
  height: 100%;
}
.videoIframe {
  width: 100%;
  height: 100%;
}
</style>