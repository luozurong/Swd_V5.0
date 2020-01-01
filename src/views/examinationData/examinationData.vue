<template>
  <div class="examinationData ignore">
    <div class="tab_btn_box ignore">
      <div
        v-for="(item, index) in tabsList"
        :key="item.id"
        class="ignore tab_btn"
        :class="{selected:index == tabIndex}"
        @click="tabNameClick(index)"
      >{{item.name}}</div>
    </div>
    <div v-for="item in tabsList" :key="item.id">
      <!-- 表格 -->
      <table border="0" cellspacing="0" cellpadding="0" v-if="item.name=='血压' && tabIndex==0">
        <tr>
          <th class="ignore">日期</th>
          <th class="ignore">测量时间</th>
          <th class="ignore">收缩压</th>
          <th class="ignore">舒张压</th>
          <th class="ignore">心率（次/分）</th>
        </tr>
        <tr v-for="list in item.data" :key="list.id">
          <td class="ignore">{{list.riqi}}</td>
          <td class="ignore">{{list.shijian}}</td>
          <td class="ignore" :class="{color:list.gaoya >120 || list.gaoya <90}">{{list.gaoya}}</td>
          <td class="ignore">{{list.diya}}</td>
          <td class="ignore" :class="{color:list.xinlv >100 || list.xinlv <60}">{{list.xinlv}}</td>
        </tr>
      </table>
      <table border="0" cellspacing="0" cellpadding="0" v-if="item.name=='血糖' && tabIndex==1">
        <tr>
          <th class="ignore">日期</th>
          <th class="ignore">空腹血糖（单位：mmol/L）</th>
          <th class="ignore">随机血糖（单位：mmol/L）</th>
        </tr>
        <tr v-for="list in item.data" :key="list.id">
          <td class="ignore">{{list.riqi}}</td>
          <td class="ignore" :class="{color:list.kongfu >6.1 || list.kongfu <3.9}">{{list.kongfu}}</td>
          <td class="ignore" :class="{color:list.suiji >7.8}">{{list.suiji}}</td>
        </tr>
      </table>
    </div>
    <div v-if="showNull" class="noData_box ignore">~没有更多数据啦~</div>
    <div class="page_msg ignore">
      <div class="page_msg_left ignore">
        共
        <input type="text" readonly v-model="pageCount" />页，
        <input type="text" readonly v-model="total" />条记录，每页20条记录
      </div>
      <div class="page_msg_right">
        <div class="present ignore">
          当前第
          <input type="text" readonly v-model="pageNumber" />页
        </div>
        <div class="go_page ignore" @click="previousPage">上一页</div>
        <div class="go_page ignore" @click="nextPage">下一页</div>
        <div class="jump_page ignore">
          <span>跳至</span>
          <input min="1" v-model="jumpPage" @keyup.enter="onSubmit" @input="change(jumpPage)" />
          <span>页</span>
        </div>
      </div>
    </div>
    <!-- <div v-if="showNull">
      <no-data-view scene="noData"></no-data-view>
    </div> -->
  </div>
</template>

<script>
import NoDataView from "../components/noData";
import { mapState, mapActions } from "vuex"; //状态管理
import { Notify } from "vant";

export default {
  components: {
    NoDataView
  },
  data() {
    return {
      showNull: false,
      tabIndex: 0,
      tabsList: [
        {
          id: "1",
          name: "血压",
          data: []
        },
        {
          id: "2",
          name: "血糖",
          data: []
        }
        // {id: '3', name: '慢阻肺', data: ''},
      ],
      pageNumber: 1,
      pageCount: 0,
      total: 0,
      jumpPage: null,
      userId: '',
      sfzh: '',
    };
  },
  mounted() {
    localStorage.removeItem('authorization')
    if(this.$route.query.userId){
      // this.userId = 'c4dbbeec64b6419e8ab42a12bf5aba4b';
      this.userId = this.$route.query.userId;
      this.getBpData();
    }
    if(this.$route.query.sfzh){
      // this.sfzh = '450881198703055633';
      this.sfzh = this.$route.query.sfzh;
      this.getBpData();
    }
  },
  methods: {
    getBpData() {
      // 获取当前时间
      this.$store.commit("setTimeStamp");
      var params = {};
      var body = {
        userId: this.userId,
        sfzh: this.sfzh,
        clinicId: "90000",
        pageNumber: this.pageNumber,
        pageSize: "20"
      };
      params.body = body;
      this.$api
        .getBpData(params)
        .then(res => {
          if (res.data.code == 0) {
            var resData = res.data.data;
            if (resData.personCheckFormatBean.length) {
              for (var i in resData.personCheckFormatBean) {
                var temp = resData.personCheckFormatBean[i].checkValue.split(
                  "#"
                );
                var temp1 = resData.personCheckFormatBean[i].checkDate.split(
                  " "
                );
                var obj = {
                  id: resData.personCheckFormatBean[i].examId,
                  riqi: temp1[0],
                  shijian: temp1[1],
                  gaoya: temp[1],
                  diya: temp[2],
                  xinlv: temp[3]
                };
                this.tabsList[0].data.push(obj);
              }
              this.pageCount = resData.pageCount;
              this.total = resData.total;
            } else {
              this.showNull = true;
            }
          } else {
            this.showNull = true;
          }
        })
        .catch(err => {});
    },
    getBgData() {
      // 获取当前时间
      this.$store.commit("setTimeStamp");
      var params = {};
      var body = {
        userId: this.userId,
        sfzh: this.sfzh,
        clinicId: "90000",
        pageNumber: this.pageNumber,
        pageSize: "20"
      };
      params.body = body;
      this.$api
        .getBgData(params)
        .then(res => {
          if (res.data.code == 0) {
            var resData = res.data.data;
            if (resData.personCheckFormatBean.length) {
              for (
                var i = resData.personCheckFormatBean.length - 1;
                i > -1;
                i--
              ) {
                var temp = resData.personCheckFormatBean[i].checkValue.split(
                  "#"
                );
                var temp1 = resData.personCheckFormatBean[i].checkDate.split(
                  " "
                );
                if (resData.personCheckFormatBean[i].xtType == "0") {
                  // console.log(resData.personCheckFormatBean[i])
                  //空腹
                  var obj = {
                    id: resData.personCheckFormatBean[i].examId,
                    riqi: temp1[0],
                    kongfu: temp[1],
                    suiji: "",
                    checkDate: resData.personCheckFormatBean[i].checkDate
                  };
                  if (this.tabsList[1].data.length > 0) {
                    for (var j in this.tabsList[1].data) {
                      if (temp1[0] == this.tabsList[1].data[j].riqi) {
                        resData.total--;
                        this.tabsList[1].data[j].id =
                          resData.personCheckFormatBean[i].examId;
                        this.tabsList[1].data[j].kongfu = temp[1];
                        this.tabsList[1].data[j].checkDate =
                          resData.personCheckFormatBean[i].checkDate;
                      } else {
                        this.tabsList[1].data.push(obj);
                      }
                    }
                  } else {
                    this.tabsList[1].data.push(obj);
                  }
                } else if (resData.personCheckFormatBean[i].xtType == "1") {
                  // console.log(resData.personCheckFormatBean[i])
                  //随机
                  var obj = {
                    id: resData.personCheckFormatBean[i].examId,
                    riqi: temp1[0],
                    kongfu: "",
                    suiji: temp[1],
                    checkDate: resData.personCheckFormatBean[i].checkDate
                  };
                  if (this.tabsList[1].data.length > 0) {
                    for (var j in this.tabsList[1].data) {
                      if (temp1[0] == this.tabsList[1].data[j].riqi) {
                        resData.total--;
                        this.tabsList[1].data[j].id =
                          resData.personCheckFormatBean[i].examId;
                        this.tabsList[1].data[j].suiji = temp[1];
                        this.tabsList[1].data[j].checkDate =
                          resData.personCheckFormatBean[i].checkDate;
                      } else {
                        this.tabsList[1].data.push(obj);
                      }
                    }
                  } else {
                    this.tabsList[1].data.push(obj);
                  }
                }
              }
              this.pageCount = resData.pageCount;
              this.total = resData.total;
            }else {
              this.showNull = true;
            }
          } else {
            this.showNull = true;
          }
        })
        .catch(err => {});
    },
    tabNameClick(index) {
      this.tabIndex = index;
      this.pageNumber = 1;
      this.tabsList[0].data = [];
      this.tabsList[1].data = [];
      if (this.tabIndex == 0) {
        this.getBpData();
      } else if (this.tabIndex == 1) {
        this.getBgData();
      }
    },
    previousPage() {
      if (this.pageNumber > 1) {
        this.pageNumber--;
        this.tabsList[0].data = [];
        this.tabsList[1].data = [];
        if (this.tabIndex == 0) {
          this.getBpData();
        } else if (this.tabIndex == 1) {
          this.getBgData();
        }
      } else if (this.pageNumber == 1) {
        Notify({ type: "warning", message: "已经是第一页啦" });
      }
    },
    nextPage() {
      if (this.pageNumber < this.pageCount) {
        this.pageNumber++;
        this.tabsList[0].data = [];
        this.tabsList[1].data = [];
        if (this.tabIndex == 0) {
          this.getBpData();
        } else if (this.tabIndex == 1) {
          this.getBgData();
        }
      } else if (this.pageNumber == this.pageCount) {
        Notify({ type: "warning", message: "已经是最后一页啦" });
      }
    },
    onSubmit() {
      if (this.jumpPage <= this.pageCount && this.jumpPage >= 1) {
        this.pageNumber == this.jumpPage;
        this.tabsList[0].data = [];
        this.tabsList[1].data = [];
        if (this.tabIndex == 0) {
          this.getBpData();
        } else if (this.tabIndex == 1) {
          this.getBgData();
        }
      }
    },
    change(val) {
      var license_num = val;
      license_num = license_num.replace(/[^\d]/g, ""); // 清除“数字”和“.”以外的字符
      if (license_num.indexOf(".") < 0 && license_num != "") {
        // 以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
        license_num = parseInt(license_num);
      }
      this.jumpPage = license_num;
      if (this.jumpPage == '0') {
        this.jumpPage = 1;
      }
      if (this.jumpPage > this.pageCount) {
        this.jumpPage = this.pageCount;
      }
    }
  }
};
</script>

<style>
body {
  background: #ffffff;
}
.examinationData {
  position: relative;
  max-width: 750px !important;
  background: #ffffff!important;
}
.examinationData .tab_btn_box.ignore {
  width: 96%;
  margin: 0 auto;
  display: flex;
  padding: 20px 0;
}
.examinationData .tab_btn.ignore {
  width: 80px;
  height: 28px;
  margin-right: 10px;
  line-height: 28px;
  text-align: center;
  font-size: 14px;
  color: #333333;
  background-color: #f2f3f6;
  border-radius: 4px;
}
.examinationData .tab_btn.ignore.selected {
  color: #ffffff;
  background-color: #6088f6;
}

/* 表格样式 */
.examinationData table {
  width: 96%;
  margin: 0 auto;
  border-right: 1px solid #cecece;
  border-bottom: 1px solid #cecece;
}
.examinationData table th,
.examinationData table td {
  border-left: 1px solid #cecece;
  border-top: 1px solid #cecece;
  text-align: center;
}
.examinationData table th.ignore {
  width: 173px;
  font-weight: normal;
  font-size: 14px;
  font-weight: bold;
  line-height: 40px;
  color: #333333;
  background: #f5f5f5;
}
.examinationData table td.ignore {
  font-size: 14px;
  line-height: 40px;
  color: #333333;
}
.examinationData table tr td.ignore:first-child {
  font-size: 14px;
  line-height: 40px;
  vertical-align: middle;
}
.examinationData table tr.ignore:nth-child(2n-1) {
  background: #fafbff;
}
.examinationData table td.ignore.color {
  color: #ff6e6e;
}
.page_msg.ignore {
  width: 96%;
  margin: 16px auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: #aeafb2;
}
.page_msg_left.ignore input {
  display: inline-block;
  width: 16px;
  text-align: center;
}
.page_msg_left.ignore input:last-of-type {
  width: 40px;
}
.page_msg_right {
  display: flex;
  align-items: center;
  color: #6088f6;
}
.go_page.ignore {
  margin-right: 20px;
  text-decoration: underline;
}
.present.ignore {
  display: flex;
  align-items: center;
  margin-right: 20px;
  color: #aeafb2;
}
.present.ignore input {
  width: 16px;
  text-align: center;
}
.jump_page.ignore input {
  position: relative;
  display: inline-block;
  padding: 4px 11px;
  width: 100%;
  height: 21px;
  font-size: 14px;
  line-height: 1.5;
  color: rgba(0, 0, 0, 0.65);
  background-color: #fff;
  background-image: none;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  -webkit-transition: all 0.3s;
  transition: all 0.3s;
  margin: 0 8px;
  width: 25px;
}

.noData_box.ignore {
  text-align: center;
  padding: 50px 0;
  color: #aeafb2;
}
</style>