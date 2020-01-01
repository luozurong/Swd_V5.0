<template>
  <div class="testResDec">
    <!-- 头部 -->
    <div class="head_title" v-if="detailData">
      <van-nav-bar
        :title="pageTitle"
        left-text
        right-text="历史结果"
        :fixed="true"
        left-arrow
        @click-left="onClickLeft"
        @click-right="onClickRight"
      />
    </div>
    <!-- 内容 -->
    <div class="testContainer" v-if="detailData">
      <div style="width:100%; height:46px;"></div>
      <div class="testCoreContent">
        <div class="testCoreBg">
          <img src="../../assets/img/funnyTest/scorebg.png" />
        </div>
        <div class="testDetails">
          <p class="testDetailsTip">您的测试分数</p>
          <p class="testDetailCenter">
            <span class="testScoreVal">{{detailData.score}}</span>
            <span class="testScore">分</span>
          </p>
          <p class="creatDate">{{detailData.createTime}} 测评</p>
        </div>
      </div>
      <div class="testResDecContent">
        <p class="resTips" v-if="detailData.subjectId != '20'">
          结果解析：
        </p>
        <!-- 睡眠质量 -->
        <div v-if="detailData.subjectId == '29'">
          <div class="sleepTestRes">{{detailData.description}}</div>
        </div>
        <!-- 心脏功能自测 -->
        <div v-if="detailData.subjectId == '22'">
          <p class="heartScore">15~20分:</p>
          <div class="heartDec">说明您的心脏功能良好，能适应繁重的工作和劳动，不易得心脏病。</div>
          <p class="heartScore">21~30分:</p>
          <div class="heartDec">心脏功能中等，能从事一般劳动。如能注意生活方式，如保持精神愉快，不吸烟、不酗酒，积极参与体育锻炼，心脏功能还会不断增强。</div>
          <p class="heartScore">31~45分:</p>
          <div class="heartDec">心脏功能差，可能会导致疾病，应到医院去做身体检查。</div>
        </div>
        <!-- 心理压力程度 -->
        <div v-if="detailData.subjectId == '26'">
          <p class="heartScore">0~11分:</p>
          <div class="heartDec">精神压力程度偏低。但可能表示您缺乏刺激，比较简单、沉闷，个人做事动力不大。</div>
          <p class="heartScore">12~15分:</p>
          <div class="heartDec">精神压力程度适中。虽然某些时候感到压力较大，但仍可应付。</div>
          <p class="heartScore">16分及以上</p>
          <div class="heartDec">精神压力偏大。应反省一下压力来源和寻找一下解决办法。</div>
          <p class="heartScore">解压方法</p>
          <div
            class="heartDec"
          >学会正面思考问题。正面对待压力，让压力变成良性刺激，从而激发前进动力。 学会忙里偷闲。工作中短暂休息， 以提高工作效率， 找到自信乃至成功感。 生活中充满活力、新鲜和乐趣，以较轻松的方式思考和行动。 学些简单而实用的减压技巧。如冥想、听音乐、听幽默故事或笑话，做些肌肉放松 活动。 旅游、运动、保证睡眠等都是解压的有效办法。</div>
        </div>
        <!-- 动脉血管年龄自测 -->
        <div v-if="detailData.subjectId == '20'">
          <div class="bloodTestTotal">{{detailData.description}}</div>
          <div class="bloodTestDec">
            <div class="warmPrompt"><img src="../../assets/img/funnyTest/warmPrompt.png" alt /></div>
            提示：遍布全身的血管，就好比住宅中的自来水管道，用的时间长了，内壁就会有沉积。胆固醇等血脂在血管壁沉积后，血管柔韧性弹性降低，血管流动不畅、受阻，是各种血管病的始发原因，进而诱发心脑血管病。血管年龄超出实际年龄者，患糖尿病、心脏病、脑中风的可能性比较大。心血管具有可塑性，只要接受治疗，纠正不良习惯，血管还可重现青春。
          </div>
        </div>
        <!-- 2型糖尿病风险自测 -->
        <div v-if="detailData.subjectId == '21'">
          <p class="heartScore">总风险评分（ 10 年内发生 2 型糖尿病的风险）</p>
          <p class="heartScore">7 分及以下：</p>
          <div class="heartDec padding_bottom">风险：低。</div>
          <div class="heartDec">评价：估计 100 人中有 1 人会发生 2 型糖尿病。</div>
          <p class="heartScore">8-11 分：</p>
          <div class="heartDec padding_bottom">风险：轻微升高。</div>
          <div class="heartDec">评价：估计 25 人中有 1 人会发生 2 型糖尿病。</div>
          <p class="heartScore">12-14 分：</p>
          <div class="heartDec padding_bottom">风险：中。</div>
          <div class="heartDec">评价：估计 6 人中有 1 人会发生 2 型糖尿病。</div>
          <p class="heartScore">15-20 分：</p>
          <div class="heartDec padding_bottom">风险：高。</div>
          <div class="heartDec">评价：估计 3 人中有 1 人会发生 2 型糖尿病。</div>
          <p class="heartScore">20 分以上：</p>
          <div class="heartDec padding_bottom">风险：极高。</div>
          <div class="heartDec">评价：估计 2 人中有 1 人会发生 2 型糖尿病。</div>
        </div>
        <!-- 肺功能状况自测 -->
        <div v-if="detailData.subjectId == '23'">
          <p class="heartScore">3 分及以下者：</p>
          <div class="heartDec">说明肺功能没有问题，但应注意保护。</div>
          <p class="heartScore">3 分：</p>
          <div class="heartDec">可能有肺功能方面的问题，引起高度重视。</div>
          <p class="heartScore">3 分及以上：</p>
          <div class="heartDec">肺功能存在问题，应立即到医院检查，争取早日治疗。</div>
        </div>
        <!-- 心理年龄自测 -->
        <div v-if="detailData.subjectId == '24'">
          <p class="heartScore">75 分以上：</p>
          <div class="heartDec">您的心理年龄在60岁以上。</div>
          <p class="heartScore">65-75 分：</p>
          <div class="heartDec">您的心理年龄在50-59岁之间。</div>
          <p class="heartScore">50-64 分：</p>
          <div class="heartDec">您的心理年龄在40-49岁之间。</div>
          <p class="heartScore">30-49分：</p>
          <div class="heartDec">您的心理年龄在30-39岁之间。</div>
          <p class="heartScore">0-29分：</p>
          <div class="heartDec">您的心理年龄在20-29岁之间。</div>
        </div>
        <!-- 患老年痴呆症的可能性自测 -->
        <div v-if="detailData.subjectId == '25'">
          <p class="heartScore">15-25 分：</p>
          <div class="heartDec">将来患老年痴呆的可能性极高。</div>
          <p class="heartScore">8-14 分：</p>
          <div class="heartDec">患老年痴呆的可能性一般，要及时引起重视。</div>
          <p class="heartScore">1-7 分：</p>
          <div class="heartDec">暂且放心，但也不能麻痹大意。</div>
          <p class="heartScore">提示：</p>
          <div class="heartDec">老年痴呆是指发生于老年时期的痴呆，由于躯体或脑部病变、中毒引起的智力和行 为及人格改变的脑功能失调的一种表现，最常见的症状为记忆力减退和计算能力的障碍。 老年痴呆不仅危害老年人的健康和幸福，也给家庭带来极大的烦恼和困难。老年痴呆的 病因尚未查明，治疗非常困难。因此，预防老年性痴呆要以预防为主，从中年开始做起， 关键在于保护大脑血管，积极防治心身疾病。 积极预防脑动脉硬化及脑血栓等疾病的发生，以防止因脑供血不足而导致老年痴呆。 动脉硬化是老年痴呆症的主要“敌人”。注意智力训练，勤动脑防痴呆。要每天坚持看 书读报，写字下棋，每天除整体全身性锻炼外，还可打 30～40 分钟保龄球以锻炼手指。 注意维持人际关系，走出家门，积极融入社会，抛开孤独感。加强精神调养。避免 负性刺激，减轻心理负担。起居饮食规律合理，均衡摄取各种营养素。老年人应多补充 有益的矿物质微量元素及多种维生素，经常吃鱼，有助于预防老年痴呆症。</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pageTitle: '',    //页面头部
      detailData: null,  // 页面数据
      testToFlag: false //默认是从自测历史进入 true是从测试页进入 false 历史进入
    };
  },
  methods: {
    initTestRes() {
      if (this.$route.query.testObj) {
        var params = {};
        params.body = this.$route.query.testObj;
        this.$api.getInterestResult(params, this.token).then(res => {
          if(res.data.code == 0){
            this.detailData = res.data.data.list[0];
            if(this.detailData.subjectId == '20'){
              this.pageTitle = '动脉血管年龄预测';
            }else if(this.detailData.subjectId == '21'){
              this.pageTitle = '2型糖尿病风险评估';
            }else if(this.detailData.subjectId == '22'){
              this.pageTitle = '心脏功能自测';
            }else if(this.detailData.subjectId == '23'){
              this.pageTitle = '肺功能状况自测';
            }else if(this.detailData.subjectId == '24'){
              this.pageTitle = '心理年龄自测';
            }else if(this.detailData.subjectId == '25'){
              this.pageTitle = '自测患老年痴呆的可能性';
            }else if(this.detailData.subjectId == '26'){
              this.pageTitle = '心理压力程度自测';
            }else if(this.detailData.subjectId == '29'){
              this.pageTitle = '匹兹堡睡眠质量指数';
            }
          }
        }).catch(res => {
          // that.$vux.loading.hide();
        });
      }
    },
    onClickLeft() {
      if (this.$route.query.testToFlag) {
        this.$router.push({ path: "/interestIndex" });
      }else{
        this.$router.push({ path: "/historyTests" });
      }
    },
    onClickRight() {
      this.$router.push({ path: "/historyTests" });
    }
  },
  mounted() {
    this.initTestRes();
    if (this.$route.query.testToFlag) {
      this.testToFlag = this.$route.query.testToFlag;
    }
  }
};
</script>
<style scoped>
.testResDec {
  line-height: 1;
}
.testContainer {
  width: 100vw;
  min-height: 100vh;
  background-image: url("../../assets/img/funnyTest/bj.png");
  background-attachment: fixed;
  background-position: 100% 100%;
  background-repeat: no-repeat;
}
.testResDecContent {
  padding-bottom: 80px;
}

/* 头部分值 */
.testCoreContent {
  position: relative;
}
.testContainer .testCoreBg {
  width: 664px;
  height: 522px;
  padding-top: 40px;
  margin: 0 auto;
}
.testContainer .testDetails {
  position: absolute;
  top: 140px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  color: #19296c;
}
.testContainer .testDetails .testDetailCenter {
  margin-top: 16px;
}
.testContainer .testDetails .testDetailsTip {
  font-family: funnytest;
  font-size: 32px;
}
.testContainer .testDetails .testScoreVal {
  font-size: 120px;
  font-weight: bold;
}
.testContainer .testDetails .testScore {
  font-family: funnytest;
  font-size: 60px;
}
.testContainer .testDetails .creatDate {
  font-size: 24px;
}

/* 结果分析 */
.testResContent {
  position: relative;
}
.sleepTestRes,
.bloodTestTotal,
.heartTestTotal {
  width: 484px;
  padding: 28px 98px 24px;
  margin: 10px auto 0px;
  text-align: center;
  color: #ffffff;
  font-size: 28px;
  line-height: 38px;
  border-radius: 10px;
  font-family: funnytest;
  border: solid 1px #fedd27;
}
.testResDecContent .resTips {
  padding: 28px 48px 40px;
  font-family: funnytest;
  font-size: 36px;
  color: #fedd27;
}
.testResDecContent .heartScore {
  padding: 0 48px 20px;
  color: #fedd27;
  font-size: 36px;
  font-family: funnytest;
}
.testResDecContent .heartDec {
  padding: 0 48px 40px;
  line-height: 48px;
  color: #ffffff;
  font-size: 32px;
  text-align: justify;
}
.testResDecContent .padding_bottom {
  padding: 0 48px 0px;
}
.testResDecContent .bloodTestDec {
  position: relative;
  width: 624px;
  margin: 78px auto 0;
  padding: 72px 24px 72px 32px;
  line-height: 48px;
  font-size: 28px;
  text-align: justify;
  color: #fff;
  border-radius: 10px;
  border: solid 1px #fedd27;
}
.testResDecContent .warmPrompt {
  position: absolute;
  top: -40px;
  left: 50%;
  width: 374px;
  transform: translateX(-50%);
}
</style>