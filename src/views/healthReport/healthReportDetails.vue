<template>
  <div class="container publicActivities">
    <!-- 头部 -->
    <div class="head_title">
        <van-nav-bar
            title="报告详情"
            :fixed="true"
            left-arrow
            @click-left="onClickLeft"
        />
        <div style="width:100%; height:46px;"></div>
    </div>
    <div class="mt48" v-cloak>
      <div v-if="noDataFlag">
        <div class="healthReNoData">
          <img src="../../assets/img/healthReport/nodata.png">
          <p>
            您该月/季度记录的血压或血糖数据太少
          </p>
          <p>无法作出分析和总结。</p>
          <div class="tipsContainer">
            <div class="stabilityTips">
              <p class="stabilityTipsP">建议您之后每周至少测量三次血压或者血糖值，我们就能为您输出相应的报告了！</p>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <div class="healthReListContainer">
          <div class="healthRelistCell">
            <div>
              <p class="Re_title">
                <img src="../../assets/img/healthReport/bloodpressure.png" v-if="reportType=='1'" style="width: 20px; margin-right: 4px;">
                <img src="../../assets/img/healthReport/bloodsugar.png" v-if="reportType=='2'" style="width: 20px; margin-right: 4px;">
                <img src="../../assets/img/healthReport/screening.png" v-if="reportType=='30'" style="width: 20px; margin-right: 4px;">
                <span>{{reportData.reportName}}</span>
              </p>
              <p>用户：{{reportData.userName}}</p>
              <p>报告医生：{{reportData.doctorName}}</p>
              <p>责任健管师：{{reportData.healthManagerName}}</p>
              <p>监测时间：{{reportData.evalBeginTime}}~{{reportData.evalEndTime}}</p>
              <p>报告时间：{{reportData.reportTime}}</p>
            </div>
          </div>
          <div class="healthChartContainer" v-if="options">
            <div class="chartTitle padding_bottom_null">
              <img src="../../assets/img/healthReport/graph.png" style="width: 13.5px; margin-right: 2px;">
              <span class="chartTitleText">曲线图</span>
            </div>
            <!-- 慢阻肺 -->
            <report-chart :options="options" :styles="styles" ref="simpleChart" v-if="reportType=='30'"></report-chart>
            <!-- 血糖 -->
            <report-chart :options="options" :styles="styles" ref="simpleChart" v-if="reportType=='2'"></report-chart>
            <!-- 血压 -->
            <report-chart :options="options" :styles="styles" ref="simpleChart" v-if="reportType=='1'"></report-chart>
          </div>
        </div>
        <div class="circleChartContainer" v-if="reportType!='30'">
          <div class="chartTitle padding_top_null">
            <img src="../../assets/img/healthReport/stability.png" style="width: 14px; margin-right: 2px;">
            <span class="chartTitleText">控制率</span>
          </div>
          <div>
            <!-- <div v-if="lessDataFlag" class="lessDataContainer">
              <div class="healthReNoData lessDataImg">
                <img src="../../assets/img/healthReport/nodata.png">
                <p>您该月/季度记录的血压数据太少</p>
                <p>无法作出分析和总结</p>
              </div>
              <div class="tipsContainer">
                <div class="stabilityTips">
                  <p>建议您之后每周至少测量三次血压或者血糖值，我们就能为您输出相应的报告了！</p>
                </div>
              </div>
            </div> -->
            <!-- 环形图 -->
            <div>
              <div v-if="reportType=='2'" class="stable_con">
                <!-- 血糖稳定率 -->
                <p class="stable_con_li li_margin_bottom">
                  <span>空腹血糖控制率</span>
                  <span class="line"></span>
                  <span>
                    <span class="sugar_number">{{reportData.controlRate}}%</span>
                  </span>
                </p>
              </div>
              <div v-if="reportType=='1'" class="stable_con">
                <!-- 血压稳定率 -->
                <p class="stable_con_li">
                  <span>血压控制率</span>
                  <span class="line"></span>
                  <span>
                    <span class="number">{{reportData.controlRate}}</span><span class="percent">%</span>
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="resultAnalysisContainer">
          <!-- 结果分析 -->
          <div>
            <div class="chartTitle">
              <img src="../../assets/img/healthReport/result.png" style="width: 14px; margin-right: 2px;">
              <span class="chartTitleText">结果分析</span>
            </div>
            <div class="totalAnalysis analysisContent">
              <div class="eatAdviceTips" v-html="reportData.resultAnalysis">
              </div>
            </div>
          </div>
          <!-- 饮食建议 -->
          <div>
            <div class="chartTitle">
              <img src="../../assets/img/healthReport/eatAdvice.png" style="width: 16px; margin-right: 2px;">
              <span class="chartTitleText">饮食建议</span>
            </div>
            <div class="totalAnalysis analysisContent">
              <div class="eatAdviceTips" v-html="reportData.dietaryAdvice">
              </div>
            </div>
          </div>
          <!-- 运动建议 -->
          <div>
            <div class="chartTitle">
              <img src="../../assets/img/healthReport/sportAdvice.png" style="width: 16px; margin-right: 2px;">
              <span class="chartTitleText">运动建议</span>
            </div>
            <div class="totalAnalysis analysisContent">
              <div class="eatAdviceTips" v-html="reportData.sportAdvice">
              </div>
            </div>
          </div>
          <!-- 用药建议 -->
          <div>
            <div class="chartTitle">
              <img src="../../assets/img/healthReport/medecineAdvice.png" style="width: 12px; margin-right: 2px;">
              <span class="chartTitleText">用药建议</span>
            </div>
            <div class="totalAnalysis analysisContent">
              <div class="eatAdviceTips" v-html="reportData.drugAdvice">
              </div>
            </div>
          </div>
          <!-- 测量注意事项 -->
          <div>
            <div class="chartTitle">
              <img src="../../assets/img/healthReport/attention.png" style="width: 16px; margin-right: 2px;">
              <span class="chartTitleText">测量注意事项</span>
            </div>
            <div class="totalAnalysis analysisContent">
              <div class="eatAdviceTips" v-html="reportData.measureAttention">
              </div>
            </div>
          </div>
        </div>
        <div style="width:100%; height:40px; background:#ffffff;"></div>
      </div>
    </div>
  </div>
</template>  
<script>
import {mapState,mapActions} from 'vuex'   //状态管理
import ReportChart from "../../components/highcharts/reportChart";
import { Toast } from 'vant';

export default {
  components: {
    ReportChart,
  },
  data() {
    return {
      options: null,
      styles: {height: '280'},     //图形样式
      noDataFlag: null, //无数据 true 没有
      //   bloodType: "sugar",
      lessDataFlag: false, //数据不足稳定率不显示 true不显示
      circleStable: true, //环形稳定率
      circleControl: true, //环形控制率
      reportData: {
        type: "", //报告类型 sugar 血糖  pressure 血压
        title: "",
        userName: "",
        doctorName: "",
        healthDoctor: "", //责任健管师
        rangeType: "", //季度quarterly  , 月度monthly
        watchStartTime: "", //监测开始时间
        watchEndTime: "", //监测结束时间
        reportCreatTime: "", //报告创建时间
        curve: {
          dbp: [], //舒张压
          sp: [], //收缩压
          limosis: [], //空腹血糖
          twoHour: [], //两小时血糖
          random: [] //随机血糖
        },
        stable: {
          rate: 0, //血糖稳定率
          limosisSugarRate: 0, //空腹血糖稳定率
          twoHourSugarRate: 0, //空腹血糖稳定率
          randomSugarRate: 0 //空腹血糖稳定率
        }, //稳定率
        control: {
          rate: 0, //血糖稳定率
          limosisControlRate: 0, //空腹血糖控制率
          twoHourControlRate: 0, //2小时空腹血糖控制率
          randomSugarRate: 0 //空腹血糖控制率
        }, //稳定率与控制率
        resultAnaylsis: "",
        //   "您本月的血压控制情况为优良! 血糖控制理想，您要继续保持！",

        eatAdvice: "",
        //   "1、减少热量，膳食平衡，BMI保持在20～24；2、北方首先将每人每日平均食盐量降至8g，以后再降至6g；南方可控制在6g 以下；3.增加新鲜蔬菜每日400～500g，水果100g，肉类50 ～100g，鱼虾类50g，4、蛋类每周3～4 个，奶类每日250g，每日食油20～25g，少吃糖类和甜食。5、不吸烟，限酒，嗜酒者男性每日饮酒精＜20～30g，女性＜15～20g，孕妇不饮酒。",
        sportAdvice: "",
        //   "1.建议每天应进行适当的30分钟左右的体力活动；2.每周则应有1次以上的有氧体育锻炼，如步行、慢跑、骑车、游泳、做健美操、跳舞和非比赛性划船等。",
        medecineAdvice: "",
        attention: ""
        //   "检查前：被检查者半小时内禁烟，禁咖啡，排空膀胱。在安静环境下至少休息5分钟。检查时：臂肌肉放松，手掌向上平伸，不要紧握拳头，肘部与心脏在同一水平，袖带平覆紧贴皮肤绑扎、松紧适度，下缘高于肘部1至2厘米。保证周围环境的安静。检查后：建议初次测量左、右上臂血压，以血压高的一侧作为血压测量的上肢；当左、右上臂血压收缩压差值>20mmHg时，建议进行四肢血压测量。老年人及糖尿病或某些疾病患者易出现体位性低血压，建议测量卧位或站立位血压，站立位血压测量应在卧位改为站立3分钟内进行。"
      },
      reportType: "1", //type=1 血压, type=2 血糖,  type=30 慢阻肺
      reportId: "", //报告id
      sugarCurveObj: [] //血糖处理过的三个曲线的数组
    };
  },
  // 状态管理
  computed: mapState({ // mapState相当于映射
      userId: state => state.userInfo.userId,   
  }),
  methods: {
    onClickLeft() {
      this.$router.go(-1); //返回上一层
    },
    transform(times){
      var temp = times.slice(0,10);
      var arr = temp.split('-')
      return arr[0] + '年' + arr[1] + '月' + arr[2] + '日'
    },
    getEvaluationReportDetail() {
      return new Promise((resolve, reject) => {
        var params = {};
        var body = {
          id: this.reportId,
          roleId: this.userId,
          roleType: '1'
        };
        params.body = body;
        Toast.loading({
          duration: 500, 
          mask: true,
          message: '数据加载中..'
        });
        this.$api.getEvaluationReportDetail(params).then(res => {
          var result = res.data;
          var noRateFlag;
          if (result.code == "0") {
            if (result.data) {
              result.data.evalBeginTime = this.transform(result.data.evalBeginTime);
              result.data.evalEndTime = this.transform(result.data.evalEndTime);
              result.data.reportTime = this.transform(result.data.reportTime);
              this.reportData = result.data;
              if (this.reportData.type) {
                //type='1' 血压, type='2' 血糖 , type='30' 慢阻肺
                this.reportType = this.reportData.type;
              }
              //判断是否有曲线图数据及稳定率控制率数据
              // var stableRate = this.reportData.stable.rate;
              var controllRate = this.reportData.controlRate;
              if (controllRate == 0) {
                this.lessDataFlag = true;
                noRateFlag = true; //没有血糖稳定率及控制率
              }
              if (this.reportType == "1") {
                //血压
                var dbpArr = this.reportData.curve.dbp;
                var spArr = this.reportData.curve.sp;
                if (noRateFlag && !dbpArr && !spArr) {
                  //没有血压的曲线数据
                  this.noDataFlag = true;
                } else {
                  this.noDataFlag = false;
                }
              } else if (this.reportType == "2") {
                var limosisArr = this.reportData.curve.limosis;
                var twoHourArr = this.reportData.curve.twoHour;
                var randomArr = this.reportData.curve.random;
                if (noRateFlag && !limosisArr && !twoHourArr && !randomArr) {
                  //没有血糖的曲线数据
                  this.noDataFlag = true;
                } else {
                  this.noDataFlag = false;
                }
              }else if (this.reportType == "30") {
                //慢阻肺
                var dbpArr = this.reportData.curve.dbp;
                var spArr = this.reportData.curve.sp;
                if (noRateFlag && !dbpArr && !spArr) {
                  //没有慢阻肺的曲线数据
                  this.noDataFlag = true;
                } else {
                  this.noDataFlag = false;
                }
              }
            } else {
              this.noDataFlag = true;
            }
          } else {
            this.noDataFlag = true;
          }
          resolve();
        });
      });
    },
    // 将所有数组的日期转化为 键为日期,值为null的对象
    getdateobj(arrlist) {
      let dateobj = {};
      for (let arr of arrlist) {
        arr.map(item => {
          dateobj[item[0]] = null;
        });
      }
      return dateobj;
    },
    // 先对比月份,再对比日期
    sortFun(a, b) {
      let alist = a[0].split("-");
      let blist = b[0].split("-");
      if (alist[0] > blist[0]) {
        return 1;
      } else if (alist[0] > blist[0]) {
        return -1;
      } else {
        if (alist[1] > blist[1]) {
          return 1;
        } else {
          return -1;
        }
      }
    },
    // 根据顺序传回数组列表
    compare(...arrlist) {
      let dateobj = this.getdateobj(arrlist);
      let arrList = [];
      for (let arr of arrlist) {
        // 深拷贝,避免dateobj重复赋值
        let copydata = JSON.parse(JSON.stringify(dateobj));
        for (let item of arr) {
          copydata[item[0]] = item[1];
        }
        let newarr = Object.entries(copydata).sort(this.sortFun);
        arrList.push(newarr);
      }
      return arrList;
    },
    //处理血糖数据
    dealSugarBloodData() {
      return new Promise((resolve, reject) => {
        var limosis = this.reportData.curve.limosis;
        // var limosis = [['02-01',26],['02-08',25],['02-09',214],['02-10',7],['02-18',8]]
        var random = this.reportData.curve.random;
        //  var random =[['02-02',26],['02-06',45],['02-11',75],['02-18',75],['02-22',4]]
        var twoHour = [];
        //  var twoHour= [['02-03',26],['02-08',74],['02-15',25],['02-20',54],['02-28',85]];
        if (limosis.length > 0 || random.length > 0 || twoHour.length > 0) {
          this.sugarCurveObj = this.compare(limosis, twoHour, random);
          resolve();
        }
      });
    },
    initChart() {
      if (this.reportType == "1") {
        var dbp = this.reportData.curve.dbp;
        var sp = this.reportData.curve.sp;
        var bloodOptions = {
          // chart: {
          //   type: "spline"
          // },
          legend: {
            align: "right",
            verticalAlign: "top"
          },
          credits: {
            enabled: false
          },
          title: {
            text: null
          },
          xAxis: {
            type: "category",
            startOnTick: true,
            tickWidth: 1,
            tickmarkPlacement: "on"
          },
          yAxis: {
            title: {
              text: "(mmHg)"
            }
          },
          series: [
            {
              name: "舒张压",
              data: dbp,
              color: "#6088f6",
              marker: {
                enabled: true
              }
            },
            {
              name: "收缩压",
              data: sp,
              color: "#0acd65",
              marker: {
                enabled: true
              }
            }
          ]
        };
        this.options = bloodOptions;
        // var charts = Highcharts.chart("chart-pressure-content", bloodOptions);
      } else if (this.reportType == "2") {
        this.dealSugarBloodData().then(() => {
          var pressureOptions = {
            // chart: {
            //   type: "spline"
            // },
            legend: {
              align: "right",
              verticalAlign: "top"
            },
            credits: {
              enabled: false
            },
            title: {
              text: null
            },
            xAxis: {
              type: "category",
              startOnTick: true,
              tickWidth: 1,
              tickmarkPlacement: "on"
            },
            yAxis: {
              title: {
                text: "(mmol/L)"
              }
            },
            series: [
              {
                name: "空腹",
                data: this.sugarCurveObj[0],
                color: "#6088f6"
              },
              {
                name: "随机",
                data: this.sugarCurveObj[2],
                color: "#ffaf41"
              }
            ]
          };
          this.options = pressureOptions;
          // var charts = Highcharts.chart("chart-sugar-content", pressureOptions);
        });
      }else if (this.reportType == "30") {
        var fev1 = this.reportData.curve.fev1;
        var fvc = this.reportData.curve.fvc;
        var bloodOptions = {
          // chart: {
          //   type: "spline"
          // },
          legend: {
            align: "right",
            verticalAlign: "top"
          },
          credits: {
            enabled: false
          },
          title: {
            text: null
          },
          xAxis: {
            type: "category",
            startOnTick: true,
            tickWidth: 1,
            tickmarkPlacement: "on"
          },
          yAxis: {
            title: {
              text: "(mmHg)"
            }
          },
          series: [
            {
              name: "FEV1%",
              data: fev1,
              color: "#6088f6",
              marker: {
                enabled: true
              }
            },
            {
              name: "FEV1/FVC%",
              data: fvc,
              color: "#0acd65",
              marker: {
                enabled: true
              }
            }
          ]
        };
        this.options = bloodOptions;
        // var charts = Highcharts.chart("chart-pressure-content", bloodOptions);
      }
    },
    // formatDate(formatDate) {
    //    if(formatDate){
    //         var tmpStr = formatDate.replace('-','年');
    //         var month = tmpStr.replace('-','月');
    //         var showDate = month +'日';
    //         return showDate ;
    //    }
    // }
  },
  //   computed:
  mounted() {
    if(this.$route.query.reportId){
      this.reportId = this.$route.query.reportId;
      this.getEvaluationReportDetail().then(() => {
        this.initChart();
      });
    }
  }
};
</script>  
<style scoped>
.healthReNoData {
  display: flex;
  display: -webkit-flex;
  align-items: center;
  flex-direction: column;
}
.healthReNoData img {
  width: 238px;
  height: 190px;
  margin: 45% auto 30px auto;
}
.lessDataImg img {
  margin: 28px auto 0 auto;
}
.healthReNoData p {
  color: #aeafb2;
  font-size: 28px;
}
.lessDataImg p {
  font-size: 24px;
}
.healthReListContainer {
  display: flex;
  display: -webkit-flex;
  /* align-items: center ; */
  flex-direction: column;
}
.healthRelistCell {
  width: 94%;
  height: 352px;
  margin: 20px auto;
  overflow: hidden;
}
.healthRelistCell div {
  padding: 30px 12px 20px;
  background-color: #fff;
  background-image: url("../../assets/img/healthReport/detailbg.png");
  background-size: cover;
  border-radius: 10px;
}
.healthRelistCell .Re_title {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  line-height: 1;
}
.healthRelistCell .Re_title span {
  color: #333;
  font-size: 28px;
  font-weight: bold;
}
.healthRelistCell p {
  font-size: 28px;
  color: #333333;
  line-height: 50px;
}
.healthChartContainer {
  background-color: #fff;
}
.chartTitle {
  display: flex;
  align-items: center;
  padding: 42px 30px 24px 30px;
}
.chartTitle.padding_top_null {
  padding: 0px 30px 0 30px;
}
.chartTitle.padding_bottom_null {
  padding: 42px 30px 0 30px;
}

/* 稳定率 */
.stable_con {
  width: 634px;
  height: auto;
  margin: 22px auto 0;
  padding: 35px 26px 35px 30px;
  font-size: 28px;
  color: #333333;
	background-color: #f6f8fa;
	opacity: 0.7;
}
.stable_con .stable_con_li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  white-space: nowrap;
}
.stable_con .stable_con_li.li_margin_bottom {
  margin-bottom: 40px;
}
.stable_con .stable_con_li.li_margin_bottom:last-child {
  margin-bottom: 0px;
}
.stable_con .stable_con_li .line {
  display: inline-block;
  width: 380px;
  margin: 0 8px;
  border-bottom: 1px dotted #3ac756;
}
.stable_con .stable_con_li .number {
  font-size: 60px;
  color: #3ac756;
}
.stable_con .stable_con_li .sugar_number {
  font-size: 36px;
  color: #3ac756;
}
.stable_con .stable_con_li .percent {
  color: #3ac756;
}

.totalAnalysis div {
  line-height: 52px;
}
.chartTitleText {
  color: #333;
  font-size: 32px;
  font-weight: bold;
}
.highchartsContainer {
  width: 750px;
  height: 610px;
}
.circleChartContainer {
  background-color: #fff;
}
.lessDataContainer {
  width: 94%;
  /* height: 147px; */
  margin-left: 3%;
  background-color: #f6f8fa;
}
.tipsContainer {
  margin-top: 24px;
  background-color: #fff;
}
.stabilityTips {
  background-color: rgba(58, 199, 86, 0.1);
  color: #3ac756;
  font-size: 28px;
  text-align: center;
  padding: 26px 44px;
}
.resultAnalysisContainer {
  background-color: #fff;
}
.analysisContent {
  width: 94%;
  margin-left: 3%;
  background-color: #f6f8fa;
  font-size: 28px;
  color: #666;
}
.eatAdviceTips {
  padding: 20px 28px;
}
.circleContainer {
  font-size: 28px;
}
.circleContainer {
  width: 100%;
  height: 280px;
}
[v-cloak] {
  display: none !important;
}
.cirTitle {
  font-weight: 600;
}
.healthReNoData  .stabilityTipsP{
  color: #3ac756; 
}
[v-cloak] {
  display: none !important;
} 
</style>
