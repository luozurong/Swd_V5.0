<template>
  <div class="interestTest_box" id="interestTest_box">
    <!-- 头部 -->
    <div class="head_title">
      <van-nav-bar
          :title="pageTitle"
          left-text=""
          right-text=""
          :fixed="true"
          left-arrow
          @click-left="onClickLeft"
      />
      <div style="width:100%; height:46px;"></div>
    </div>
    <!-- 内容 -->
    <div class="interestTest_box_con">
      <!-- 题目编号 -->
      <div class="number">
        <span>{{titleIndex}}</span>/
        <span>{{sum}}</span>
      </div>
      <!-- 答案内容 -->
      <p class="title">{{questiontitle}}</p>
      <div class="answer_con">
        <div
          v-for="(item, index) in answerList" :key="index"
          class="answer_li"
          @click="nextQuestion(item.id, item.score, index, $event)"
          :class="{'activeAnswer':checkList[titleIndex-sexFlag] == item.id}"
        >{{item.name}}</div>
      </div>
      <div class="last_question first" v-if="titleIndex==1">
        <span v-if="checkList[titleIndex-sexFlag]" :class="{'colorText':checkList[titleIndex-sexFlag]}" @click="nextHandle()">下一题&gt;</span>
        <span v-if="!checkList[titleIndex-sexFlag]">下一题&gt;</span>
      </div>
      <div class="last_question other" v-else>
        <span @click="lastQuestion()">&lt;上一题</span>
        <span v-if="!checkList[titleIndex-sexFlag]">下一题&gt;</span>
        <span v-else :class="{'colorText':checkList[titleIndex-sexFlag]}" @click="nextHandle()">下一题&gt;</span>
      </div>
    </div>
  </div>
</template>

<script>
import {mapState,mapActions} from 'vuex'   //状态管理
import { setTimeout } from 'timers';
import { Toast } from 'vant';

export default {
  data() {
    return {
      pageTitle: '',    //页面标题
      detailData: null, //问题详情数据
      sum: null, //问题总数
      titleIndex: 1, //当前编号
      sexFlag: 1,   // 如果有性别选择为 2
      questiontitle: "", //当前问题
      answerList: [], //当前答案列表
      checkList: [], //记录已选的选项
      scoreList: [], //记录已选的选项分数
      isLast: false, //是否点击上一题
      questionIndex: null, //上一页获取的所测问题的序号
      sex: "",
      personid: null, // 保存评测接口参数
      token: null, // 保存评测接口参数
      isRepeat: false,  //是否重复点击
      tempList: [],   ////记录已选的选项
      qustionId: {},   ////记录已选的选项
    };
  },
   // 状态管理
  computed: mapState({ // mapState相当于映射
    IsIndexCome: state => state.IsIndexCome,   
  }),
  methods: {
    // 返回上一页
    onClickLeft() {
      var that = this;
      if(that.IsIndexCome){
        that.$router.go(-1); //返回上一层
      }else{
        JsBridge.callMethod("JsInvokeNativeMethod", "finishPage",
          function( data) {
        });
      }
    },
    nextHandle() {
      var that = this;
      this.titleIndex++;
      that.answerList = that.detailData.questionList[that.titleIndex - that.sexFlag].optionList;
      that.questiontitle = that.detailData.questionList[that.titleIndex - that.sexFlag].title;
      that.qustionId = that.detailData.questionList[that.titleIndex - that.sexFlag].id;
      that.isLast = false;
    },
    // 上一题
    lastQuestion() {
      var that = this;
      that.titleIndex--;
      that.answerList = that.detailData.questionList[that.titleIndex - that.sexFlag].optionList;
      that.questiontitle = that.detailData.questionList[that.titleIndex - that.sexFlag].title;
      that.qustionId = that.detailData.questionList[that.titleIndex - that.sexFlag].id;
      // 连续点击上一题，删除最后一项
      if (that.isLast) {
        that.tempList.pop();
        that.checkList.pop();
        that.scoreList.pop();
      }
      that.isLast = true;
    },
    // 下一题
    nextQuestion(optionid, optionscore, index, event) {
      if(this.isRepeat){
        return
      }
      this.isRepeat = true;
      var that = this;
      var tempObj = {};
      tempObj.qustionId = that.qustionId;
      tempObj.optionId = optionid;
      tempObj.answer = '';
　　　//获取点击对象     
      var el = event.currentTarget;
      el.classList.add("activeAnswer")
      if(that.titleIndex < that.sum){
        that.checkList[that.titleIndex - that.sexFlag] = optionid;
        that.scoreList[that.titleIndex - that.sexFlag] = optionscore;
        that.tempList[that.titleIndex - that.sexFlag] = tempObj;
        //获取下一题的题目与选题
        setTimeout(function(){
          el.classList.remove("activeAnswer")
          that.titleIndex++;
          that.answerList = that.detailData.questionList[that.titleIndex - that.sexFlag].optionList;
          that.questiontitle = that.detailData.questionList[that.titleIndex - that.sexFlag].title;
          that.qustionId = that.detailData.questionList[that.titleIndex - 1].id;
          // 改变点击状态
          that.isLast = false;
          that.isRepeat = false;
        }, 300)
      }else{
        that.tempList.push(tempObj);
        that.checkList.push(optionid);
        var optionid = that.checkList.join("#");
        //统计分数
        that.scoreList.push(optionscore);
        var totalscore = 0;
        for (var i = that.scoreList.length - 1; i >= 0; i--) {
          totalscore += parseInt(that.scoreList[i]);
        }

        // 计算
        var title, description, age;
        if (that.questionIndex == 29) {
          title = "睡眠质量评测";
          description = "总分范围为0～48分，得分越高，表示睡眠质量越差。";
        } else if (that.questionIndex == 22) {
          title = "心脏功能评测";
          description = "";
        } else if (that.questionIndex == 26) {
          title = "心理压力评测";
          description = "";
        } else if (that.questionIndex == 20) {
          title = "动脉血管年龄评测";
          if (totalscore == 0) {
            age = 32;
          } else if (totalscore == 2) {
            age = 37;
          } else if (totalscore == 5 || totalscore == 4) {
            age = 42;
          } else if (totalscore == 6 || totalscore == 5) {
            age = 47;
          } else if (totalscore == 8 || totalscore == 7) {
            age = 52;
          } else if (totalscore == 10 || totalscore == 8) {
            age = 57;
          } else if (totalscore == 11 || totalscore == 9) {
            age = 62;
          } else if (totalscore == 12 || totalscore == 10) {
            age = 67;
          } else if (totalscore == 14 || totalscore == 11) {
            age = 72;
          } else {
            age = 75;
          }
          description =
            "根据您填写的信息，我们推算您目前的动脉年龄预测为：" + age + "岁";
        } else if (that.questionIndex == 21) {
          title = "II型糖尿病风险评测";
          description = "";
        } else if (that.questionIndex == 23) {
          title = "肺功能状况评测";
          description = "";
        } else if (that.questionIndex == 24) {
          title = "心理年龄评测";
          description = "";
        } else if (that.questionIndex == 25) {
          title = "患老年痴呆症评测";
          description = "";
        }

        //保存返回自测结果
        // 获取当前时间
        that.$store.commit("setTimeStamp");
        var params = {};
        var body = {};
        body = {
          userId: that.personid,
          subjectId: that.questionIndex.toString(),
          answerList: that.tempList,
          description: description,
        };
        params.body = body;
        // that.$vux.loading.show({
        //     text: '数据上传中..',
        // })
        Toast.loading({
          duration: 500, 
          mask: true,
          message: '数据上传中..'
        });
        that.$api.submitResult(params, this.token).then(res => {
          if(res.data.code == 0){
            var resultId = res.data.data;
            var testObj = {
              resultId: resultId,
              subjectId: that.questionIndex,
              userId: that.personid,
            }

            setTimeout(function(){
              that.$router.push({
                path: "testResDec",
                query: { testObj: testObj, testToFlag: true }
              });
            }, 500)
          }
        }).catch(res => {
          // that.$vux.loading.hide();
        });
      }
    },
    // 获取当前时间
    timestampToTime() {
      var date = new Date(); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var Y = date.getFullYear() + "-";
      var M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
      var D = date.getDate() + " ";
      var h = date.getHours() + ":";
      var m = date.getMinutes() + ":";
      var s = date.getSeconds();
      if (M >= 1 && M <= 9) {
        M = "0" + M;
      }
      if (D >= 0 && D <= 9) {
        D = "0" + D;
      }
      if (h >= 0 && h <= 9) {
        h = "0" + h;
      }
      if (m >= 0 && m <= 9) {
        m = "0" + m;
      }
      if (s >= 0 && s <= 9) {
        s = "0" + s;
      }
      return Y + M + D + h + m + s;
    },
    // 获取自测问题与答案
    getInterestDetail(index, sex) {
      var that = this;
      // 获取当前时间
      that.$store.commit("setTimeStamp");
      var params = {};
      var body = {};
      body = {
        // sex: sex,
        id: index.toString()
      };
      params.body = body;
      that.$api
        .getInterestDetail(params, this.token)
        .then(res => {
          if(res.data.code == 0){
            that.detailData = res.data.data;
            that.pageTitle = that.detailData.name;
            that.sum = that.detailData.questionList.length;
            that.answerList = that.detailData.questionList[that.titleIndex - 1].optionList;
            that.questiontitle = that.detailData.questionList[that.titleIndex - 1].title;
            that.qustionId = that.detailData.questionList[that.titleIndex - 1].id;
          }
        })
        .catch(res => {
        });
    }
  },
  mounted() {
    // var wi = window.innerWidth;
    // var hi = window.innerHeight;
    // document.getElementById("interestTest_box").style.width = wi + "px";
    // document.getElementById("interestTest_box").style.height = hi + "px";

    // 从URL进入
    //http://localhost:8080/interestTest?token=D86FD81E8793B67D117795FCC8CD68A314C5B560817EB9F9521824F6BAA69011&userId=15b8c137-36af-4124-9ecd-c42c21de8470&subjectId=3
    var addressURL = window.location.href;
    if (addressURL.indexOf("?token=") != -1) {
      addressURL = addressURL.split("?token="); // 第一次截取
      addressURL = addressURL[1].split("&userId="); // 第二次截取
      this.token = addressURL[0];
      addressURL = addressURL[1].split("&subjectId="); // 第三次截取
      this.personid = addressURL[0].split('&')[0];
      this.questionIndex = addressURL[1];
      if (this.questionIndex == 3 || this.questionIndex == 4) {
        this.sexFlag++; 
        // this.$vux.loading.show({
        //     text: '加载中..',
        // })
        this.getInterestDetail(this.questionIndex, "1");
      } else {
        // this.$vux.loading.show({
        //     text: '加载中..',
        // })
        this.getInterestDetail(this.questionIndex, "");
      }
      var userArr = [];
      userArr.push(this.token);
      userArr.push(this.personid);
      this.$store.commit("setLoginData", userArr); //store 保存参数header.token, userInfo.userId
      return;
    }
  }
};
</script>

<style>
.interestTest_box {
    min-height: 100vh;
    background-color: #35406f;
}/*内容*/
.interestTest_box_con {
  line-height: 1;
}
.interestTest_box_con .number {
  padding: 18px 48px;
  font-size: 30px;
  color: #ffffff;
  text-align: right;
}
.interestTest_box_con .number span:first-of-type {
  color: #fedd27;
}
.interestTest_box_con .title {
  padding: 34px 78px;
  font-size: 32px;
  font-weight: bold;
  line-height: 48px;
  color: #fedd27;
}
.interestTest_box_con .answer_con {
  margin-top: 90px;
  margin-bottom: 124px;
}
.interestTest_box_con .answer_con .answer_li {
  width: 560px;
  height: auto;
  line-height: 50px;
  padding: 22px 20px;
  margin: 0 auto 48px;
  text-align: center;
  font-size: 36px;
	letter-spacing: 1px;
	color: #333333;
	background-color: #ffffff;
	border-radius: 50px;
	border: solid 4px #3a140b;
}
.interestTest_box_con .answer_con .answer_li.activeAnswer {
  background: #fedd27;
}
.interestTest_box_con .last_question.first {
  width: 80%;
  margin: 0 auto;
  padding-bottom: 90px;
  text-align: center;
  font-size: 44px;
  font-family: funnytest;
  color: #999999;
}
.interestTest_box_con .last_question.other {
  display: flex;
  justify-content: space-between;
  width: 80%;
  margin: 0 auto;
  padding-bottom: 90px;
  font-size: 44px;
  font-family: funnytest;
  color: #999999;
}
.interestTest_box_con .last_question.other span:first-of-type {
  color: #ffffff;
}
.interestTest_box_con .last_question.first .colorText {
  color: #ffffff;
}
.interestTest_box_con .last_question.other span.colorText {
  color: #ffffff;
}
</style>