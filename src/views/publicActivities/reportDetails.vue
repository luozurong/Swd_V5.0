<template>
    <div class="container publicActivities box reportDetails" :class="reportDetails ? 'reportDetails-box':''">
        <!-- 头部 -->
        <div class="head_title" :class="gofixed ? 'gofixed':''">
            <van-nav-bar
                title="报告详情"
                left-text=""
                :fixed="true"
                left-arrow
                @click-left="onClickLeft"
            />
            <div style="width:100%; height:46px;"></div>
        </div>
        <!-- 内容 -->
        <main v-if="reportDetails">
            <div class="personal_info">
                <div class="portrait"><img src="../../assets/img/publicActivities/null.png" alt=""></div>
                <div class="name"><span>{{reportDetails.PersonName}}</span><span>{{reportDetails.PersonGender}}/{{reportDetails.PersonAge}}岁</span></div>
                <div class="flex_msg"><span>身高(cm)：{{reportDetails.Height}}</span><span>体重(kg)：{{reportDetails.Weight}}</span></div>
                <div class="flex_msg"><span>BMI(kg/㎡)：{{BMI}}</span><span>手机号码：{{reportDetails.Telephone}}</span></div>
            </div>
            <!-- 数据 -->
            <div class="report_data">
                <div class="report_data_msg">
                    <p>检测日期：{{reportDetails.ExamDate}}</p>
                    <p>检测单位：{{reportDetails.ExamUnit}}</p>
                    <p>检测项目：{{reportDetails.ExamType}}</p>
                    <p>检测数据</p>
                </div>
                <!-- 表格 -->
                <table border="0" cellspacing="0" cellpadding="0">
                    <tr>
                        <th></th>
                        <template v-for="(item, index) in reportDetails.DataList">
                            <th v-if="index < 3" :key="index">实测{{index+1}}</th>
                        </template>
                    </tr>
                    <tr>
                        <td>PEF<br>(L/min)</td>
                        <template v-for="(item, index) in reportDetails.DataList">
                            <td v-if="index < 3" :key="index">{{item.PEF}}</td>
                        </template>
                    </tr>
                    <tr>
                        <td>FEV1<br>(L)</td>
                        <template v-for="(item, index) in reportDetails.DataList">
                            <td v-if="index < 3" :key="index">{{item.FEV1}}</td>
                        </template>
                    </tr>
                    <tr>
                        <td>FVC<br>(L)</td>
                        <template v-for="(item, index) in reportDetails.DataList">
                            <td v-if="index < 3" :key="index">{{item.FVC}}</td>
                        </template>
                    </tr>
                    <tr>
                        <td>FEF25-75%<br>(L/s)</td>
                        <template v-for="(item, index) in reportDetails.DataList">
                            <td v-if="index < 3" :key="index">{{item.FEF}}</td>
                        </template>
                    </tr>
                    <tr>
                        <td>MEF75%<br>(L/s)</td>
                        <template v-for="(item, index) in reportDetails.DataList">
                            <td v-if="index < 3" :key="index">{{item.MEF75}}</td>
                        </template>
                    </tr>
                    <tr>
                        <td>MEF50%<br>(L/s)</td>
                        <template v-for="(item, index) in reportDetails.DataList">
                            <td v-if="index < 3" :key="index">{{item.MEF50}}</td>
                        </template>
                    </tr>
                    <tr>
                        <td>MEF25%<br>(L/s)</td>
                        <template v-for="(item, index) in reportDetails.DataList">
                            <td v-if="index < 3" :key="index">{{item.MEF25}}</td>
                        </template>
                    </tr>
                </table>
            </div>
            <!-- 图形 -->
            <div class="report_data report_pic">
                <div class="report_data_msg">
                    <p>实测数据图示</p>
                    <template v-if="options1">
                        <line-chart :options="options1" :styles="styles" ref="simpleChart"></line-chart>
                    </template>
                    <line-chart :options="options2" :styles="styles" ref="simpleChart"></line-chart>
                </div>
            </div>
            <!-- 结果 -->
            <div class="report_data report_result">
                <div class="report_data_msg">
                    <p>慢阻肺筛查结果</p>
                </div>
                <div class="title">1、检测数据</div>
                <!-- 表格 -->
                <table border="0" cellspacing="0" cellpadding="0">
                    <tr>
                        <th></th>
                        <th>最佳值</th>
                        <th>参考值</th>
                    </tr>
                    <tr>
                        <td>PEF<br>(L/min)</td>
                        <td>{{reportDetails.PEF}}</td>
                        <td>{{reportDetails.PEFExpect}}</td>
                    </tr>
                    <tr>
                        <td>FEV1<br>(L)</td>
                        <td>{{reportDetails.FEV1}}</td>
                        <td>{{reportDetails.FEV1Expect}}</td>
                    </tr>
                    <tr>
                        <td>FVC<br>(L)</td>
                        <td>{{reportDetails.FVC}}</td>
                        <td>{{reportDetails.FVCExpect}}</td>
                    </tr>
                    <tr>
                        <td>FEF25-75%<br>(L/s)</td>
                        <td>{{reportDetails.FEF}}</td>
                        <td>{{reportDetails.FEFExpect}}</td>
                    </tr>
                    <tr>
                        <td>MEF75%<br>(L/s)</td>
                        <td>{{reportDetails.MEF75}}</td>
                        <td>{{reportDetails.MEF75Expect}}</td>
                    </tr>
                    <tr>
                        <td>MEF50%<br>(L/s)</td>
                        <td>{{reportDetails.MEF50}}</td>
                        <td>{{reportDetails.MEF50Expect}}</td>
                    </tr>
                    <tr>
                        <td>MEF25%<br>(L/s)</td>
                        <td>{{reportDetails.MEF25}}</td>
                        <td>{{reportDetails.MEF25Expect}}</td>
                    </tr>
                </table>
                <!-- 表格 -->
                <table border="0" cellspacing="0" cellpadding="0" style="margin-top: 10px;">
                    <tr>
                        <th></th>
                        <th>评定值</th>
                        <th>参考值</th>
                    </tr>
                    <tr>
                        <td>FEV1%</td>
                        <td>{{reportDetails.FEV1Result}}</td>
                        <td>≥80%</td>
                    </tr>
                    <tr>
                        <td>FEV1/FVC</td>
                        <td>{{reportDetails.COPD}}</td>
                        <td>≥75%</td>
                    </tr>
                </table>
                <div class="title margin_top">2、检测提示</div>
                <div class="result_text">{{reportDetails.ExamResult}}</div>
                <div class="result_tip">注：本结果仅作为筛查分析，不作为诊断依据。若有疑问，以线下医院的诊断为主。</div>
            </div>
        </main>
        <div v-if="showNull">
            <no-data-view scene="noData"></no-data-view>
        </div>
    </div>
</template>  
<script>  
    import {mapState,mapActions} from 'vuex';
    import LineChart from "../../components/highcharts/lineChart";
    import NoDataView from "../components/noData";

    export default {
        components: {
            LineChart,
            NoDataView
        },
        data () {
            return {
                options1: null,    //图形数据
                options2: null,
                styles: {height: '280'},     //图形样式
                reportDetails: null,
                show: false,
                name: null,
                phone: null,
                activitiesId: null,     //活动id
                isSelf: '0',            //0 自己的, 1 别人的
                showToast: false,       //弹框是否显示
                textToast: '',          //弹框问字
                gofixed: false,         //标题样式是否修改
                isWX: false,            // 判断是否为公众号进入，false：不是， true是
                paramsObj: null,        //请求参数
                BMI: null,
                showNull: null,   //无数据
            }
        },
        // 状态管理
        computed: mapState({ // mapState相当于映射
            userId: state => state.userInfo.userId,       //用户id userId
        }),
        methods : {
            onClickLeft(){
                this.$router.go(-1); //返回上一层
            },
            handleScroll(){
                var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
                if(scrollTop>15){//滚动条的高度，可以动态获取也可以写死
                    //这里写要执行的操作
                    this.gofixed = true
                }else{ 
                    this.gofixed = false 
                }
            },
            // 查看他人弹框开启
            confirm(){
                this.show = true;
                this.name = null;
                this.phone = null;
            },
            onCancel () {
                this.show = false
            },
            // 查询他人报告
            onConfirm () {
                if(this.name && this.phone){
                    //姓名汉字校验
                    var han = /^[\u4e00-\u9fa5]+$/;
                    if (!han.test(this.name) || this.name.length>6 || this.name.length<2) {
                        this.textToast = '姓名不合法，请重新输入'
                        this.showToast = true
                        return false
                    }
                    //手机号码校验
                    var checkPhone = /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/;
                    if (!checkPhone.test(this.phone)) {
                        this.textToast = '手机号不合法，请重新输入'
                        this.showToast = true
                        return false
                    }
                    this.show = false
                    this.isSelf = '1';
                    this.getActivityReport(this.isSelf);
                }else{
                    this.textToast = '姓名与手机号码不能为空'
                    this.showToast = true
                }
            },
            //获取报告详情
            getActivityReport(isSelf){
                // 获取当前时间
                this.$store.commit('setTimeStamp');
                var params = {};
                params.body= {
                    PersonName: this.name,    //报告姓名
                    TelePhone: this.phone,     //报告电话
                    ActivitiesId: this.activitiesId,  //活动ID
                }
                if(this.paramsObj){
                    params.body = this.paramsObj;
                }
                this.$api.getActivityReport(params)
                    .then(res => {
                        if(res.data.code == 0 && res.data.result == '0'){
                            // res.data.Report.ExamDate = this.transform(res.data.Report.ExamDate);
                            this.reportDetails = res.data.Report;
                            if(this.reportDetails.PersonGender == '1'){
                                this.reportDetails.PersonGender = '男'
                            }else{
                                this.reportDetails.PersonGender = '女'
                            }
                            this.BMI = (this.reportDetails.Weight/ (this.reportDetails.Height*this.reportDetails.Height*0.0001)).toFixed(2);
                            // 图形
                            this.options1= {
                                xAxis: {
                                    categories: ['', 'FVC', 'MEF75%', 'MEF50%', 'MEF25%']
                                },
                                series: []
                            }
                            this.options2 = {
                                xAxis: {
                                    categories: ['']
                                },
                                series: [{
                                    name: 'FEV1',
                                    data: []
                                }]
                            }
                            for(var i=1; i<this.reportDetails.DataList.length+1; i++){
                                if(i < 4){
                                    var obj1 = {
                                        name: '实测'+i,
                                        data: [
                                            parseFloat(this.reportDetails.DataList[i-1].FVC), 
                                            parseFloat(this.reportDetails.DataList[i-1].MEF75), 
                                            parseFloat(this.reportDetails.DataList[i-1].MEF50), 
                                            parseFloat(this.reportDetails.DataList[i-1].MEF25)
                                        ]
                                    };
                                    this.options1.series.push(obj1);
                                    var obj2_name = '实测'+i;
                                    this.options2.xAxis.categories.push(obj2_name)
                                    var obj2 = parseFloat(this.reportDetails.DataList[i-1].FEV1);
                                    this.options2.series[0].data.push(obj2);
                                }
                            }
                        }else{
                            if(!this.reportDetails){
                                this.showNull = true;
                            }
                            JsBridge.callMethod(
                                "JsInvokeNativeMethod",
                                "showToast",
                                { message: "消息提示", toast: res.data.reason },
                                function(data) {}
                            );
                        }
                    })
                    .catch(err => {
                        this.showNull = true;
                        JsBridge.callMethod(
                            "JsInvokeNativeMethod",
                            "showToast",
                            { message: "消息提示", toast: err.message },
                            function(data) {}
                        );
                    })
            },
            // 转换日期格式
            transform(params){
                var other = params.substring(10);
                var times = params.substring(0, 10);
                var date = new Date(times);
                var year = date.getFullYear();  //年
                var month = date.getMonth() + 1; //月
                var strDate = date.getDate(); //日
                var currentdate = year +'年'+ month +'月'+ strDate+'日' + other;
                return currentdate
            },
            // 获取个人信息
            getInfo(){
                var that = this;
                // 获取当前时间
                this.$store.commit('setTimeStamp');

                //获取个人信息
                var params = {};
                params.body= {
                    userId: that.userId,
                }
                that.$api.getPersonInfo(params)
                    .then(res => {
                        var userData = res.data.obj;
                        that.phone = userData.phonenumber;
                        this.getActivityReport(this.isSelf);
                    })
                    .catch(err => {
                        console.log(err)
                    })
            },
        },
        mounted(){
            window.addEventListener('scroll', this.handleScroll, true)

            var loginData = [];         
            if(this.$route.query.token && this.$route.query.userId){  //APP跳转
                loginData.push(this.$route.query.token);
                loginData.push(this.$route.query.userId);
                this.$store.commit("setLoginData", loginData); //store 保存参数header.token, userInfo.userId
                this.getInfo();
            }
            if(this.$route.query.activitiesId){
                this.activitiesId = this.$route.query.activitiesId
                this.getActivityReport(this.isSelf);
            }
            if(this.$route.query.telePhone){    //公众号进入
                loginData = ['kinglian', '']
                this.isWX = true;
                this.$store.commit("setLoginData", loginData); //store 保存参数header.token, userInfo.userId
                this.phone = this.$route.query.telePhone;
                this.getActivityReport(this.isSelf);
            }
            if(this.$route.query.paramsObj){ 
                this.paramsObj = this.$route.query.paramsObj;
                // this.paramsObj = {"PersonName":"河图镇","TelePhone":17358963722,"ActivitiesId":"AC0240C1-4114-4C55-A3FA-F07E6FA325CA"};
                this.getActivityReport(this.isSelf);
            }
        }
    }
</script>  
<style>
.reportDetails-box {
    height: 100vh;
}
.reportDetails .van-nav-bar {
    background: unset;
}
.reportDetails .van-hairline--bottom:after {
    border-bottom-width: 0px;
}
.reportDetails .gofixed .van-nav-bar {
    background: #ffffff;
}
.reportDetails .gofixed .van-hairline--bottom:after {
    border-bottom-width: 1px;
}
.reportDetails:before {
    content: "";
    background: #F6F8FA url('../../assets/img/publicActivities/bj.png') no-repeat 0% -3vh;
    background-attachment:fixed;
    background-size:100%;
    -moz-background-size: 100%; /* 老版本的 Firefox */
    position: fixed;
    top: 0px;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: -1;
}

/* 个人信息 */
.reportDetails .personal_info {
	width: 690px;
    height: 345px;
    margin: 20px auto;
    font-size: 28px;
	color: #333333;
	background-color: #ffffff;
	border-radius: 10px;
}
.reportDetails .personal_info .portrait {
    overflow: hidden;
}
.reportDetails .personal_info .portrait img {
    display: block;
    width: 96px;
    height: 96px;
    margin: 32px auto 16px;
    background-color: #a8b8e6;
    border-radius: 50%;
}

.reportDetails .personal_info .name {
    text-align: center;
}
.reportDetails .personal_info .name span:first-of-type {
    margin-right: 17px;
    font-size: 32px;
    font-weight: bold;
	color: #333333;
}
.reportDetails .personal_info .flex_msg {
    display: flex;
    padding: 30px 24px 0px 34px;
}
.reportDetails .personal_info .flex_msg span {
    width: 50%;
}

/* 报告数据 */
.reportDetails .report_data {
	width: 750px;
	height: 861px;
	background-color: #ffffff;
}
.reportDetails .report_data .report_data_msg {
    padding: 40px 30px 24px;
    font-size: 28px;
    color: #333333;
}
.reportDetails .report_data .report_data_msg p {
    margin-bottom: 28px;
}
.reportDetails .report_data .report_data_msg p:last-of-type {
    margin-bottom: 0px;
}

/* 表格样式 */
.reportDetails table{
    width: 92%;
    margin: 0 auto;
    border-right:1px solid #ccdaff;
    border-bottom:1px solid #ccdaff;
} 
.reportDetails table th,.reportDetails table td{
    border-left:1px solid #ccdaff;
    border-top:1px solid #ccdaff;
    text-align: center;
} 
.reportDetails table th {
    width: 173px;
    font-weight: normal;
    font-size: 28px;
	line-height: 70px;
	color: #6088f6;
}
.reportDetails table td {
    font-size: 28px;
	line-height: 70px;
	color: #333333;
}
.reportDetails table tr td:first-child {
    font-size: 24px;
    line-height: 24px;
    vertical-align: middle;
}
.reportDetails table tr:nth-child(2n-1) {
    background: #fafbff;
}

/* 报告图形 */
.reportDetails .report_pic {
    width: 750px;
	height: auto;
	background-color: #ffffff;
    margin-top: 20px;
}
.reportDetails .report_data.report_pic .report_data_msg p:last-of-type {
    margin-bottom: 20px;
}

/* 结果 */
.reportDetails .report_result {
    width: 750px;
	height: auto;
	background-color: #ffffff;
    margin-top: 20px;
}
.reportDetails .report_result .title {
    padding: 0px 30px 24px;
    font-size: 24px;
    font-weight: bold;
	color: #333333;
}
.reportDetails .report_result .margin_top {
    padding: 28px 30px 24px;
}
.reportDetails .report_result .result_text {
    padding: 0px 30px 0px;
    font-size: 28px;
	color: #6088f6;
}
.reportDetails .report_result .result_tip {
    padding: 54px 30px 44px;
    line-height: 36px;
    font-size: 24px;
	color: #999999;
}
</style>
