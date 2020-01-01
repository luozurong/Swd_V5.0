 <template>
  <div class="wrapper">
    <van-nav-bar
      title="健康分享"
    />
    <div class="content">
      <div class="check-data">
        <div class="header">
          <div class="text">{{dataSource.realName ? dataSource.realName : dataSource.account}}今日检测数据</div>
          <div class="time">{{dataSource.measureDate}}</div>
        </div>
        <div class="box" v-if="$route.query.type == 0">
          <div class="box-detail press">
            <div class="number">{{dataSource.bpLeft2}}/{{dataSource.bpLeft1}}</div>
            <div class="unit">mmHg</div>
            <div class="type">{{params.title}}</div>
          </div>
          <div class="box-detail press">
            <div class="number">{{dataSource.heartRate}}</div>
            <div class="unit">次/分</div>
            <div class="type">心率</div>
          </div>
        </div>
        <div class="box iscenter" v-if="$route.query.type == 1">
          <div class="box-detail">
            <div class="number">{{dataSource.bloodGlucose}}</div>
            <div class="unit">mmol/L</div>
            <div class="type">{{params.title}}</div>
          </div>
        </div>
        <div class="descript" v-if="$route.query.type == 0">血压{{dataSource.bpStatus}}</div>
        <div class="descript" v-if="$route.query.type == 1">血糖{{dataSource.bgStatus}}</div>
        <div class="example">{{params.title}}健康管理情况如下:</div>
        <div class="database">
          <div class="rank">
            <span>初次测量：{{dataSource.firstMeasure}} {{params.title == '血压' ? 'mmHg' : 'mmol/L'}}</span>
            <span>现在定级：{{dataSource.nowRank ? dataSource.nowRank : dataSource.firstRank}}</span>
          </div>
          <div class="frequency">
            测量频次：{{dataSource.measureFrequency}}
          </div>
        </div>
      </div>
    </div>
    <div class="download">
      <div class="more">如需了解更多，请下载南风医生APP</div>
      <div class="down-img">
        <img src="../../assets/img/mall/code.png" alt="">
      </div>
      <div class="todown" @click="download">
        立即下载
      </div>
    </div>
  </div>
</template>
<script>
 
import { getHealthMeasure } from '../../api/api.js';
import '../../../static/js/RainbowBridge'
export default {
  name: 'healthShare',
  data(){
    return{
      params: {
        title: '',
        roleId: '',
      },
      dataSource: {},
    }
  },
  mounted() {
    this.checkType(this.$route.query.type,this.$route.query.userId)
  },
  methods:{
    getHealthMeasure(val,id) { // 获取健康数据
      const that = this;
      let params = {
        header: {},
        body: {
          roleId: id,
          roleType: '1'
        }
      };
      getHealthMeasure(params).then( res => {
        if(res.data.code === 0 ) {
          let data = res.data.data;
          let arr = data.filter(item => item.type == val)
          that.dataSource = arr[0]
          // console.log(that.dataSource.bpLeft1)
        }
      })
    },
    goBack() {
      JsBridge.callMethod(
          "JsInvokeNativeMethod",
          "finishPage",
          { message: "关闭健康分享页面" },
          function(data) {
            console.log(data)
          }
        );
    },
    checkType(val,id) {
      if(val == 0) {
        this.params.title = '血压'
      }else if(val == 1) {
        this.params.title = '血糖'
      }
      this.getHealthMeasure(val,id)
    },
    download() {
      const u = navigator.userAgent;
      const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
      const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
      // alert('是否是Android：'+isAndroid);
      // alert('是否是iOS：'+isiOS);
      // 判断微信或者是浏览器打开，下载页面
    const ua = window.navigator.userAgent.toLowerCase();
    //微信
      if(ua.match(/MicroMessenger/i) == 'micromessenger'){
        alert("请在浏览器中打开");
      }else{//非微信浏览器
        if(isAndroid){
          window.location.href='http://app-download.kinglian.cn/latest/yonghu.apk'
        }
        if(isiOS){
          window.location.href='https://itunes.apple.com/cn/app/id1459228367?mt=8'
        }
      }
    //     if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {
    //         var loadDateTime = new Date();
    //         window.setTimeout(function() {
    //           var timeOutDateTime = new Date();
    //           if (timeOutDateTime - loadDateTime < 5000) {
    //             // window.location = "";//ios下载地址
    //             alert('ios下载地址')
    //           } else {
    //             window.close();
    //           }
    //         },2000);
    //         window.location = "schema://";
    //       }else if (navigator.userAgent.match(/android/i)) {
    //         var state = null;
    //         try {
    //           window.location = 'schema://';
    //           setTimeout(function(){
    //           // window.location= ""; //android下载地址
    //           alert('android下载地址')
    //         },500);
    //         } catch(e) {}
    //     }
    //   }
    }
  }
}
</script>
<style lang="less" scoped>
.wrapper {
  background:rgba(237,250,240,1);
  height: 100%;
  width: 100%;
  .content {
    margin: 20px 30px;
    width: 690px;
    background:rgba(255,255,255,1);
    border-radius:12px;
    .check-data {
      padding: 42px 35px 49px 35px;
      box-sizing: border-box;
      .header {
        text-align: center;
        margin-bottom: 8px;
        .text {
          font-size:32px;
          font-weight:bold;
          color:rgba(51,51,51,1);
        }
        .time {
          font-size:24px;
          font-weight:400;
          color:rgba(153,153,153,1);
          line-height:60px;
        }
      }
      .box {
        display: flex;
        justify-content: space-between;
        .box-detail {
          width:300px;
          height:160px;
          border:1px solid rgba(235,235,235,1);
          border-radius:10px;
          text-align: center;
          .number {
            font-size:35px;
            font-weight:bold;
            color:rgba(58,199,86,1);
            margin-top: 36px;
          }
          .unit {
            font-size:20px;
            color:rgba(153,153,153,1);
            margin-top: 18px;
          }
          .type {
            font-size:26px;
            color:rgba(51,51,51,1);
            margin-top: 10px;

          }
        }
        .press {
          width: 295px;
        }
        .slow {
          width: 194px;
        } 
      }
      .iscenter {
        justify-content: center;
      }
      .descript {
        text-align: center;
        padding: 33px 0 40px;
        font-size:28px;
        color:rgba(58,199,86,1);
      }
      .example {
        font-size:28px;
        color:rgba(51,51,51,1);
      }
      .database {
        box-sizing: border-box;
        width:623px;
        margin-top: 17px;
        padding: 37px 50px 34px 13px;
        font-size:24px;
        color:rgba(51,51,51,1);
        background:rgba(246,248,250,1);
        border-radius:10px;
        .rank {
          display: flex;
          justify-content: space-between;
          margin-bottom: 27px;
        }
      }
    }
  }
  .download {
    width:690px;
    height:460px;
    margin: 20px 30px 0;
    background:rgba(255,255,255,1);
    border-radius:12px;
    .more {
      padding-top: 46px;
      text-align: center;
      font-size:24px;
      color:rgba(51,51,51,1);
    }
    .down-img {
      width:224px;
      height:225px;
      margin: 27px auto 0;
    }
    .todown {
      width:340px;
      height:80px;
      margin: 27px auto 34px;
      text-align: center;
      line-height: 80px;
      font-size:28px;
      font-weight:500;
      color:rgba(255,255,255,1);
      background:linear-gradient(90deg,rgba(115,230,57,1),rgba(58,199,86,1));
      border-radius:40px;
    }
  }
}
</style>
<style>
/* body {
  background:rgba(237,250,240,1);
  position: relative;
  width: 100%;
  height: 100%;
} */
body {
  background:rgba(237,250,240,1);
  position: relative;
  width: 100%;
  height: 100%;
}
</style>


