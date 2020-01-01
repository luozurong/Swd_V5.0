
<template>
  <div>
    <div class="noDataContainer">
      <div class="noDataImg">
        <img :src="imgUrl" />
        <p class="noDataTips">{{tips}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import noData from '../../assets/img/system/noData.png' ;
import noNet from '../../assets/img/system/noNet.png' ;
import noRight from '../../assets/img/system/noRight.png' ;
import noOrder from '../../assets/img/system/noOrder.png' ;
import noResult from '../../assets/img/system/noResult.png' ;
export default {
  name: "noData-view",
  props: {
    scene: {
      type: String,
      default: "noData"
    }
  },
  data() {
    return {
      imgUrl: "",
      tips: "",
      noNet,
      noData,
      noRight,
      noOrder
    };
  },
  mounted() {
    let imgurl = "";
    let tips = "";
    switch (this.scene) {
      case "noNet":
        imgurl = noNet;
        tips = "网络连接失败";
        break;
      case "noData":
        imgurl = noData;
        tips = "这里空空的,什么也没有...";
        break;
      case "noRight":
        imgurl = noRight;
        tips = "这里空空的,什么也没有...";
        break;
      case "noOrder":
        imgurl = noOrder;
        tips = "还没有订单...";
        break;
      default:
        imgurl = noResult;
        tips = "无搜索结果，换个词试试吧...";
        break;
    }
    this.imgUrl = imgurl;
    this.tips = tips;
  }
};
</script>

<style scoped>
.noDataContainer {
  font-size: 32px;
  color: #aeafb2;
  text-align: center;
}
.noDataImg {
  width: 350px;
  height: 350px;
  margin: 300px auto 0;
}
.noDataTips {
  margin-top: 13px;
  font-size: 24px;
  margin-top: -50px;
}
</style>