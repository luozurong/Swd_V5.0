<template>
    <div class="publicActivities">
        <!-- 头部 -->
        <div class="head_title">
            <van-nav-bar
                title="报名详情"
                :fixed="true"
                left-arrow
                @click-left="onClickLeft"
            />
            <div style="width:100%; height:46px;"></div>
        </div>

        <main class="registerDetails">
            <div>
                <van-list
                    v-model="isUpLoading"
                    :finished="upFinished"
                    :finished-text="finishedText"
                    @load="onLoadList"
                    :offset="offset"
                >
                    <li v-for="(list, index) in activitiesMsg" :key="index">
                        <p class="li_title">
                            <span class="title_text">{{list.ActivitiesName}}</span>
                            <van-button v-if="list.State ==1" round type="default" size="small" @click="gotoDetail(list.ActivitiesId, list.PersonName, list.Telephone)">查看报告</van-button>
                            <span v-else class="success_text"><img src="../../assets/img/publicActivities/ic_success.png" alt="" width="12">报名成功</span>
                        </p>
                        <p class="li_title content_msg">
                            <span class="title_text">筛查人：{{list.PersonName}}</span>
                            <span class="title_text">报名时间：{{list.CreatedDate}}</span>
                        </p>
                    </li>
                </van-list>
            </div>
            <div v-if="showNull">
                <no-data-view scene="noData"></no-data-view>
            </div>
        </main>
    </div>
</template>  
<script>  
    import {mapState,mapActions} from 'vuex'   //状态管理
    import NoDataView from "../components/noData";

    export default{
        data () {
            return {
                telephone: null,
                activitiesMsg: [],
                showToast: false,
                toastText: '',
                showNull: false,     //暂无数据展示
                isUpLoading:false,//上拉加载
                upFinished:false,//上拉加载完毕
                finishedText: '',
                offset: 10,//滚动条与底部距离小于 offset 时触发load事件
                pageIndex: 1,
            }
        },
        components: {
            NoDataView
        },
        // 状态管理
        computed: mapState({ // mapState相当于映射
            userId: state => state.userInfo.userId,   
        }),
        mounted(){
            if(this.$route.query.telephone){ 
                this.telephone = this.$route.query.telephone;
            }
        },
        methods : {
            //公益活动*获取活动列表【慢阻肺】
            onLoadList(){   
                // 获取当前时间
                this.$store.commit('setTimeStamp');
                var params = {};
                params.body= {
                    PageNum: this.pageIndex.toString(),
                    PageSize: '10',
                    CreatedTelePhone: this.telephone,
                }
                this.$api.getActivityRegList(params)
                    .then(res => {
                        if(res.data.code == 0){
                            if(res.data.RegList){
                                this.pageIndex++;
                                for (var i in res.data.RegList) {
                                    var startTime = res.data.RegList[i].CreatedDate;
                                    res.data.RegList[i].CreatedDate = this.transform(startTime)
                                }
                                this.activitiesMsg = this.activitiesMsg.concat(res.data.RegList) //上拉加载新数据添加到数组中;
                            }
                            // 加载状态结束
                            this.isUpLoading = false;
                            if(res.data.RegList.length<10){
                                // 数据全部加载完成
                                this.upFinished = true;
                            }
                            if(this.activitiesMsg.length>10 && res.data.RegList.length<10){
                                this.finishedText = '没有更多了'
                            }
                            if(!this.activitiesMsg || this.activitiesMsg.length<1){
                                this.finishedText = ''
                                this.showNull = true;
                                return
                            }
                        }else{ 
                            // 数据全部加载完成
                            this.isUpLoading = false;
                            this.upFinished = true;
                            this.finishedText= '';
                            this.showNull = true;
                        }
                    })
                    .catch(err => {
                        this.upFinished = true;
                        this.finishedText= '';
                        this.showNull = true;
                    })
            },

            // 返回按钮
            onClickLeft(){      
                this.$router.go(-1); //返回上一层
            },
            // 转换日期格式
            transform(times){
                var date = new Date(times);
                var year = date.getFullYear();  //年
                var month = date.getMonth() + 1; //月
                var strDate = date.getDate(); //日
                var strHours = date.getHours(); //时
                var strMinutes = date.getMinutes(); //分
                var strSeconds = date.getSeconds(); //秒
                if (strHours >= 0 && strHours <= 9) {
                    strHours = "0" + strHours;
                }
                if (strMinutes >= 0 && strMinutes <= 9) {
                    strMinutes = "0" + strMinutes;
                }
                if (strSeconds >= 0 && strSeconds <= 9) {
                    strSeconds = "0" + strSeconds;
                }
                var currentdate = year +'年'+ month +'月'+ strDate+'日 '+ strHours+':'+ strMinutes+':'+ strSeconds;
                return currentdate
            },
            // 是否显示所有详情
            showDetailAll(index){
                if(this.showDetail[index]){
                    this.showDetail.splice(index,1,false);
                }else{
                    this.showDetail.splice(index,1,true);
                }
            },
            // 跳转报告详情
            gotoDetail(id, name, tel){
                var obj = {
                    PersonName: name,
                    TelePhone: tel,
                    ActivitiesId: id,
                }
                this.$router.push({path: 'reportDetails', query:{ paramsObj: obj }})
            }
        }
    }
</script>  
<style scoped >
    .registerDetails li {
        position: relative;
        width: 690px;
        margin: 18px auto 0px;
        line-height: 1;
        background: #ffffff;
        border-radius: 8px;
    }
    .registerDetails li:last-child {
        margin-bottom: 18px;
    }
    .registerDetails li .li_title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 24px 26px;
        font-size: 32px;
        font-weight: bold;
        color: #333333;
    }
    .registerDetails li .li_title .van-button--small {
        width: 140px;
        height: 46px;
        line-height: 46px;
        font-weight: normal;
        font-size: 24px;
        color: #ff6e26;
        border-radius: 23px;
        border: solid 1px #ff6e26;
    }
    .registerDetails li .li_title.content_msg {
        padding: 8px 26px 34px;
        font-weight: normal;
        font-size: 24px;
        color: #666666;
    }
    .registerDetails li .li_title .success_text img {
        width: 24px;
        height: 100%;
        margin-right: 5px;
    }
    .registerDetails li .li_title .success_text {
        font-size: 24px;
        color: #3ac756;
    }
</style>