<template>
    <div class="container healthReportList">
        <!-- 头部 -->
        <div class="head_title">
            <van-nav-bar
                title="健康评估报告"
                :fixed="true"
                left-arrow
                @click-left="onClickLeft"
            />
            <div style="width:100%; height:56px;"></div>
        </div>
        <div class="reportListContainer">
            <van-list
                v-model="isUpLoading"
                :finished="upFinished"
                :finished-text="finishedText"
                @load="onLoadList"
                :offset="offset"
            >
                <div class="report_li" v-for="(item, index) in dataList" :key="index" @click="goToReportDetails(item.id)">
                    <div class="report_title">
                        <img src="../../assets/img/healthReport/bloodpressure.png" v-if="item.type == '1'" style="width: 20px; height: 20px; margin-right: 4px;">
                        <img src="../../assets/img/healthReport/bloodsugar.png" v-if="item.type == '2'" style="width: 20px; height: 20px; margin-right: 4px;">
                        <img src="../../assets/img/healthReport/screening.png" v-if="item.type == '30'" style="width: 20px; height: 20px; margin-right: 4px;">
                        <span>{{item.reportName}}</span>
                    </div>
                    <p><span>报告医生：{{item.doctorName}}</span><span>专属健管师：{{item.healthManagerName}}</span></p>
                    <p>监测时间：{{item.evalBeginTime}}~{{item.evalEndTime}}</p>
                    <p>报告时间：{{item.reportTime}}</p>
                </div>
            </van-list>
        </div>
        <div v-if="showNull">
            <no-data-view scene="noData"></no-data-view>
        </div>
    </div>
</template>  
<script>  
    import NoDataView from "../components/noData";

    export default{
        components: {
            NoDataView
        },
        data () {
            return {
                userId: null,
                dataList: [],
                showNull: false,     //暂无数据展示
                isUpLoading:false,//上拉加载
                upFinished:false,//上拉加载完毕
                finishedText: '没有更多了',
                offset: 10,//滚动条与底部距离小于 offset 时触发load事件
                pageIndex: 1,
            }
        },
        mounted(){
            var addressURL = window.location.href; // 获取 URL
            if (addressURL.indexOf("?token=") != -1) {
                addressURL = addressURL.split("?token="); // 第一次截取
                addressURL = addressURL[1].split("&userId="); // 第二次截取
                if (addressURL[0]) {
                    this.userId = addressURL[1];
                    this.$store.commit("setLoginData", addressURL); //store 保存参数header.token, userInfo.userId
                }
            }
        },
        methods : {
            onClickLeft(){
                JsBridge.callMethod("JsInvokeNativeMethod", "finishPage",
                    function( data) {
                });
            },
            goToReportDetails(id){
                 this.$router.push({path:'/healthReportDetails',query:{reportId:id}})
            },
            onLoadList(){
                // 获取当前时间
                this.$store.commit('setTimeStamp');
                var params = {};
                var body = {
                    roleId: this.userId,
                    type: '',
                    roleType: '1',
                    current:1,
                    size: 10,
                };
                params.body =  body;
                this.$api.getHealthReportList(params)
                    .then(res => {
                        var resData =  res.data.data.records;
                        if(res.data.code == 0){
                            if(resData){
                                this.pageIndex++;
                                for (var i in resData) {
                                    resData[i].evalBeginTime = this.transform(resData[i].evalBeginTime)
                                    resData[i].evalEndTime = this.transform(resData[i].evalEndTime)
                                    resData[i].reportTime = this.transform(resData[i].reportTime)
                                }
                                this.dataList = this.dataList.concat(resData) //上拉加载新数据添加到数组中;
                            }
                            // 加载状态结束
                            this.isUpLoading = false;
                            if(resData.length<10){
                                // 数据全部加载完成
                                this.upFinished = true;
                            }
                            if(!this.dataList || this.dataList.length<1){
                                this.finishedText = ''
                                this.showNull = true;
                                return
                            }
                        }else{ 
                            // 数据全部加载完成
                            this.upFinished = true;
                        }
                    })
                    .catch(err => {
                        this.isUpLoading = false;
                        this.upFinished = true;
                        this.finishedText = ''
                        this.showNull = true;
                        JsBridge.callMethod(
                            "JsInvokeNativeMethod",
                            "showToast",
                            { message: "消息提示", toast: err.message },
                            function(data) {}
                        );

                    })
            },
            transform(times){
                var temp = times.slice(0,10);
                var arr = temp.split('-')
                return arr[0] + '年' + arr[1] + '月' + arr[2] + '日'
            }
        }
    }
</script>  
<style scoped>
    .healthReNoData{
        display: flex;
        display: -webkit-flex;
        align-items: center ;
        flex-direction: column;
    }
    .healthReNoData img{
        width: 119px;
        height: 95px;
        margin: 50% auto 15px auto;
    }
    .healthReNoData p {
        color: #aeafb2;
        font-size: 14px;
    }

    .healthReportList .reportListContainer .report_li {
        width: 662px;
        height: 180px;
        margin: 0 auto 20px;
        padding: 24px 20px;
        background-color: #ffffff;
        border-radius: 8px;
        overflow: hidden;
    }
    .healthReportList .reportListContainer .report_li .report_title {
        display: flex;
        align-items: center;
        font-size: 28px;
        font-weight: bold;
        color: #333333;
    }
    .healthReportList .reportListContainer .report_li p {
        padding-left: 48px;
        font-size: 24px;
        line-height: 50px;
        color: #666666;
    }
    .healthReportList .reportListContainer .report_li p span {
        display: inline-block;
        width: 48%;
    }
</style>
