<template>
  <div class="interest_box">
    <!-- 头部 -->
    <div class="head_title">
      <van-nav-bar
          title="健康趣味自测"
          left-text=""
          right-text="历史结果"
          :fixed="true"
          left-arrow
          @click-left="onClickLeft"
          @click-right="onClickRight"
      />
      <div style="width:100%; height:46px;"></div>
    </div>
    <!-- 内容 -->
    <div class="interest_box_con">
      <div class="interest_li" v-for="(item, index) in listData" :key="index" @click="getInterestDetail(item.id)">
        <div class="img" v-if="item.thumUrl"><img :src="item.thumUrl"></div>
        <div class="img" v-else-if="!item.thumUrl && item.id=='20'"><img src="../../assets/img/funnyTest/banner1.png"></div>
        <div class="img" v-else-if="!item.thumUrl && item.id=='21'"><img src="../../assets/img/funnyTest/banner4.png"></div>
        <div class="img" v-else-if="!item.thumUrl && item.id=='22'"><img src="../../assets/img/funnyTest/banner2.png"></div>
        <div class="img" v-else-if="!item.thumUrl && item.id=='23'"><img src="../../assets/img/funnyTest/banner6.png"></div>
        <div class="img" v-else-if="!item.thumUrl && item.id=='24'"><img src="../../assets/img/funnyTest/banner8.png"></div>
        <div class="img" v-else-if="!item.thumUrl && item.id=='25'"><img src="../../assets/img/funnyTest/banner7.png"></div>
        <div class="img" v-else-if="!item.thumUrl && item.id=='26'"><img src="../../assets/img/funnyTest/banner5.png"></div>
        <div class="img" v-else-if="!item.thumUrl && item.id=='29'"><img src="../../assets/img/funnyTest/banner3.png"></div>
        <p>{{item.name}}</p>
      </div>
    </div>
  </div>
</template>
 
<script>
import {mapState,mapActions} from 'vuex'   //状态管理

export default {
  components: {

  },
  data() {
    return {
      listData: [], 
    };
  },
  // 状态管理
  computed: mapState({ // mapState相当于映射
    userId: state => state.userInfo.userId,   
    token: state => state.header.token,   
  }),
  methods: {
    onClickRight(){
      this.$store.commit("IsIndexCome", true); //store 保存参数判断是否从趣味首页进入
      this.$router.push({
        path: "/historyTests"
      });
    },
    onClickLeft(){
      JsBridge.callMethod("JsInvokeNativeMethod", "finishPage",
        function( data) {
      });
    },
    getInterestDetail(index) {
      var that = this;
      that.$store.commit("IsIndexCome", true); //store 保存参数判断是否从趣味首页进入
      that.$router.push({
        path: "/interestTest",
        query: { token: that.token, userId: that.userId, subjectId: index }
      });
    },
    getList(){
      var that = this;
      var params = {};
      params.body= {
        keyword: ''
      }
      that.$api.getHaqList(params, this.token).then(res => {
          if(res.data.code == 0){
            var resData = res.data.data.list;
            if(resData){
              this.listData = resData;
            }
          }
        }).catch(err => {
        });
    }
  },
  mounted() {
    if(this.$route.query.userId && this.$route.query.token){
      var userInfo = [this.$route.query.token, this.$route.query.userId]
      this.$store.commit("setLoginData", userInfo); //store 保存参数header.token, userInfo.userId
    }
    this.getList();   // 获取列表
  }
};
</script>
 
<style>
.interest_box_con .interest_li {
  width: 690px;
  height: 330px;
  margin: 20px auto 0;
	background: #ffffff;
  border-radius: 10px;
  overflow: hidden;
}
.interest_box_con .interest_li:last-of-type {
  margin-bottom: 48px;
}
/*内容*/
.interest_box_con .interest_li .img {
  width: 100%;
}
.interest_box_con .interest_li p {
  padding: 16px;
  font-size: 32px;
	color: #333333;
}
</style>
