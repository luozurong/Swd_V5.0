<template>
    <div class="container publicActivities">
        <!-- 头部 -->
        <div class="head_title">
            <van-nav-bar
                title="公益活动"
                left-text=""
                right-text="查看结果"
                :fixed="true"
                left-arrow
                @click-left="onClickLeft"
                @click-right="gotoPage(null, null , null)"
            />
            <div style="width:100%; height:46px;"></div>
        </div>

        <main class="activitiesIndex">
            <div v-if="activitiesMsg">
                <li v-for="(list, index) in activitiesMsg" :key="index">
                    <p class="li_title">
                        <span class="title_text">{{list.ActivitiesName}}</span>
                        <van-button v-if="list.IsDisable && !list.IsOutTime" round type="default" size="small" @click="gotoPage(list.ActivitiesId, list.IsOutTime, list.IsDisable)">免费报名</van-button>
                        <van-button v-if="list.IsOutTime" round disabled type="default" size="small" class="outTime">已过期</van-button>
                    </p>
                    <p class="msg">
                        <img src="../../assets/img/publicActivities/ic_address.png" alt="" style="width: 12px; margin-right: 6.5px;" >
                        <span>服务范围：</span>
                        <span class="color_666">宁夏回族自治区银川市</span>
                    </p>
                    <p class="msg">
                        <img src="../../assets/img/publicActivities/ic_date.png" alt="" style="width: 14px; margin-right: 3.5px;">
                        <span>活动日期：</span>
                        <span class="color_666">{{list.StartTime}} - {{list.EndTime}}</span>
                    </p>
                    <p class="content" :class="showDetail[index]?'':'showAllText'">
                        <img src="../../assets/img/publicActivities/ic_introduce.png" alt="" style="width: 12px;">
                        <span>活动简介：</span><span class="content_text">{{list.ActivitiesDescription}}</span>
                        <span class="show" @click="showDetailAll(index)" :class="showDetail[index]?'hidden':''" v-if="isShow[index]"><span>  </span>&nbsp;&nbsp;&nbsp;展开</span>
                    </p>
                    <p class="show up" @click="showDetailAll(index)" :class="showDetail[index]?'':'hidden'" v-if="isShow[index]">收起</p>
                </li>
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
                showDetail:[],         //标记数据是否需要完全显示的属性
                isShow:[],             //标志是否显示展开收起
                activitiesMsg: null,
                showToast: false,
                toastText: '',
                urlToken: null,
                userId: null,
                showNull: false,     //暂无数据展示
            }
        },
        components: {
            NoDataView
        },
        // 状态管理
        computed: mapState({ // mapState相当于映射
            token: state => state.header.token,   
        }),
        mounted(){
            // if(this.$route.query.userId && this.$route.query.token){
            //     this.userId = this.$route.query.userId;
            //     var userInfo = [this.$route.query.token, this.$route.query.userId]
            //     this.$store.commit("setLoginData", userInfo); //store 保存参数header.token, userInfo.userId
            // }else{
            //     localStorage.setItem('authorization', 'kinglian')
            // }
            this.getActivitesList();
        },
        methods : {
            // 返回按钮
            onClickLeft(){     
                JsBridge.callMethod("JsInvokeNativeMethod", "finishPage",
                    function( data) {
                });
            },
            // 查看结果
            onClickRight(){    
                this.$router.push({ 
                    path:'/registerDetails',
                })
            },
            // 公益活动*获取活动列表【慢阻肺】
            getActivitesList(){
                // 获取当前时间
                this.$store.commit('setTimeStamp');
                var params = {};
                params.body= {
                    ActivityType: '',
                }
                this.$api.getActivitesList(params)
                    .then(res => {
                        this.activitiesMsg = res.data.list;
                        if(!this.activitiesMsg || this.activitiesMsg.length<1){
                            this.showNull = true;
                            return
                        }
                        for (var i in this.activitiesMsg) {
                            this.showDetail.push(false);    //默认为收起
                            var startTime = this.activitiesMsg[i].StartTime.substring(0, 10);
                            this.activitiesMsg[i].StartTime = this.transform(startTime)
                            var endTime = this.activitiesMsg[i].EndTime.substring(0, 10);
                            this.activitiesMsg[i].EndTime = this.transform(endTime)
                        }
                        setTimeout(() => {
                            if(this.activitiesMsg){
                                var length = this.activitiesMsg.length;
                                for(var i = 0; i<length; i++){
                                    var test = document.getElementsByClassName('content_text')[i].offsetHeight;
                                    if(test<64){
                                        this.isShow.push(false);   
                                    }else{
                                        this.isShow.push(true);  
                                    }
                                }
                            }
                        }, 500)
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
            transform(times){
                var date = new Date(times);
                var year = date.getFullYear();  //年
                var month = date.getMonth() + 1; //月
                var strDate = date.getDate(); //日
                var currentdate = year +'年'+ month +'月'+ strDate+'日' ;
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
            // 跳转活动报名页
            gotoPage(id, IsOutTime, IsDisable){
                const that = this;
                JsBridge.callMethod("JsInvokeNativeMethod", "getUserInfo", null, function(data) {
                    var data = JSON.parse(JSON.stringify(data));
                    var userInfo = data.data;
                    if(userInfo.token && userInfo.userId){
                        that.urlToken = userInfo.token;
                        that.userId = userInfo.userId;
                        that.$store.commit("setLoginData", [userInfo.token, userInfo.userId]);
                        localStorage.setItem('authorization', that.urlToken);
                    }else{
                        localStorage.setItem('authorization', 'kinglian');
                        return
                    }
                });

                // 获取当前时间
                that.$store.commit('setTimeStamp');

                //获取个人信息(手机号)
                var params = {};
                params.body= {
                    clinicId: "90000",
                    roleId: that.userId,
                    roleType: '1',
                }
                that.$api.getUserAccountInfo(params)
                    .then(res => {
                        if(res.data.code == 0){
                            var userData = res.data.data;
                            var isPhone = userData.account;
                            var phone = /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/;
                            if(!userData.telephone && !phone.test(isPhone)){
                                JsBridge.callMethod(
                                    "JsInvokeNativeMethod",
                                    "showToast",
                                    { message: "消息提示", toast: '请前往个人中心完善您的个人信息再报名！' },
                                    function(data) {}
                                );
                            }else{
                                if(id){
                                    that.$router.push({path: 'activityRegister', query:{ activitiesId: id }})
                                }else{
                                    var telephone = userData.telephone || userData.account;
                                    that.$router.push({path: 'registerDetails', query:{ telephone: telephone }})
                                }
                            }
                        }
                    })
                    .catch(err => {
                    })
            },
        }
    }
</script>  
<style scoped >
    .activitiesIndex li {
        position: relative;
        width: 690px;
        margin: 18px auto 0px;
        padding-bottom: 12px;
        line-height: 1;
        background: #ffffff;
        border-radius: 8px;
    }
    .activitiesIndex li:last-child {
        margin-bottom: 18px;
    }
    .activitiesIndex li .li_title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 24px 26px;
        font-size: 32px;
        font-weight: bold;
        color: #333333;
        border-bottom: 1px solid #ebebeb;
    }
    .activitiesIndex li .li_title .van-button--small {
        width: 160px;
        height: 56px;
        line-height: 56px;
        font-size: 28px;
        font-weight: normal;
        color: #ffffff;
        background-image: linear-gradient(90deg, 
            #73e539 0%, 
            #3ac756 100%), 
        linear-gradient(
            #f89283, 
            #f89283);
        background-blend-mode: normal, 
            normal;
        border-radius: 28px;
        border: none;
    }
    .activitiesIndex li .li_title .van-button--small.outTime {
        color: #666666;
        /* border: solid 1px #d2d2d4; */
        background: #f6f8fa;

    }
    .activitiesIndex li .msg {
        display: flex;
        align-items: center;
        padding: 24px 24px 0 24px;
        text-align: justify;
        font-size: 28px;
    }
    .activitiesIndex li .msg .color_666 {
        color: #666666;
    }
    .activitiesIndex li .content {
        position: relative;
        padding: 12px 24px 12px 24px;
        font-size: 28px;
    }
    .activitiesIndex li .content .content_text {
        line-height: 48px;
        color: #666666;
    }
    .activitiesIndex li .content .show {
        position: absolute;
        bottom: 14px;
        right: 24px;
        display: inline-block;
        width: 88px;
        padding: 4px 0;
        text-align: justify;
        font-size: 24px;
        color: #3ac756;
        background: #fff;
    }
    .activitiesIndex li .show.up {
        padding: 24px 24px 24px 24px;
        margin-top: -36px;
        text-align: right;
        font-size: 24px;
        color: #3ac756;
    }
    .activitiesIndex li .content.showAllText {
        max-height: 90px;
        overflow: hidden;
        /* white-space: normal;
        text-overflow: ellipsis;
        word-wrap: break-word;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical; */
    }
    .activitiesIndex li .show.hidden {
        display: none;
    }
    /* 暂无数据 */
    .activitiesIndex .null {
        display: flex;
        align-items: center;
        flex-direction: column;
        width: 100vw;
        height: 161vw;
        font-size: 4vw;
        line-height: 6vw;
        color: #aeafb2;
    }
    .activitiesIndex .null img {
        width: 32vw;
        height: 25vw;
        margin-top: 28vw;
    }
</style>

