<template>
    <div class="historyTests">
        <div class="head_title">
            <van-nav-bar
                title="评测结果"
                left-text=""
                :fixed="true"
                left-arrow
                @click-left="onClickLeft"
            />
            <div style="width:100%; height:46px;"></div>
        </div>
        <van-list
            v-model="loading"
            :finished="finished"
            :finished-text="finishedText"
            @load="onLoad"
            :offset="offset"
        >
            <van-swipe-cell v-for="(item, index) in dataList" :key="index">
                <van-cell :value="item.score +'分'" :label="item.createTime" is-link value-class="li_right" @click="goToTestRes(item)">
                    <template slot="title">
                        <span class="custom-title">{{item.title}}</span>
                    </template>
                </van-cell>

                <template slot="right">
                    <van-button square type="danger" text="删除" @click="deleteItem(item, index)" />
                </template>
            </van-swipe-cell>
        </van-list>
        <div v-if="showNull">
            <no-data-view scene="noData"></no-data-view>
        </div>
    </div>
</template>  
<script>  
    import {mapState,mapActions} from 'vuex'   //状态管理
    import NoDataView from "../components/noData";

    export default {
        data () {
            return {
                dataList: [],
                loading: false,
                finished: false,
                finishedText: '没有更多了',
                pageNo: '1',
                offset: 10,
                showNull: false,    //无数据
            }
        },
        components: {
            NoDataView
        },
        // 状态管理
        computed: mapState({ // mapState相当于映射
            userId: state => state.userInfo.userId,    
            IsIndexCome: state => state.IsIndexCome,   
        }),
        methods :{
            onClickLeft() {
                var that = this;
                if(that.IsIndexCome){
                    // that.$router.go(-1); //返回上一层
                    that.$router.push({ path: "/interestIndex" });
                }else{
                    JsBridge.callMethod("JsInvokeNativeMethod", "finishPage",
                    function( data) {
                    });
                }
            },
            //跳转
            goToTestRes(item){
                var testObj = {
                    resultId: item.id,
                    subjectId: item.subjectId,
                    userId: this.userId,
                }
                this.$router.push({name:'testResDec', query:{testObj: testObj}})
            },
            //删除
            deleteItem(item, index){
                //调用删除接口
                var params = {};
                var body = {
                    id: item.id,
                    userId: item.userId,
                };
                params.body = body;
                this.$api.deleteInterestHistory(params).then(res=>{
                    if(res.data.code == 0){
                        // this.dataList.splice(index, 1);
                        this.dataList = [];
                        this.pageNo = 1;
                        this.onLoad();
                    }
                })
            },

            onLoad() {
                // 获取当前时间
                this.$store.commit("setTimeStamp");
                var params = {};
                var body = {
                    userId: this.userId,
                    current: this.pageNo,
                    size: '10',
                };
                params.body = body ;
                this.$api.getHistoryList(params).then(res=>{
                    if(res.data.code == 0){
                        if(res.data.data.records){
                            this.pageNo++;
                            var tempList = res.data.data.records;
                            for(var i=0;i<tempList.length;i++){
                                var subjectId = tempList[i].subjectId;
                                switch (subjectId) {
                                    case '29':
                                        tempList[i].title = '匹兹堡睡眠质量指数';
                                        break;
                                    case '22':
                                        tempList[i].title = '心脏功能自测';
                                        break;
                                    case '24':
                                        tempList[i].title = '心理压力程度自测';
                                        break;
                                    case '20':
                                        tempList[i].title = '动脉血管年龄预测';
                                        break;
                                    case '21':
                                        tempList[i].title = '2型糖尿病风险评估';
                                        break;
                                    case '23':
                                        tempList[i].title = '肺功能状况自测';
                                        break;
                                    case '24':
                                        tempList[i].title = '心理年龄自测';
                                        break;
                                    case '25':
                                        tempList[i].title = '自测患老年痴呆的可能性';
                                    case '26':
                                        tempList[i].title = '心理压力程度自测';
                                        break;
                                }
                                this.dataList.push(tempList[i])
                            }
                        }
                        // 加载状态结束
                        this.loading = false;
                        if(res.data.data.records.length<1){
                            // 数据全部加载完成
                            this.finished = true;
                        }
                        if(!this.dataList || this.dataList.length<1){
                            this.finishedText = ''
                            this.showNull = true;
                            return
                        }
                    }else{ 
                        // 数据全部加载完成
                        this.finished = true;
                    }
                }).catch(res=>{
                    this.$toast(res.message)
                })
            }
        },
        mounted(){
            if(this.$route.query.userId && this.$route.query.token){
                var userInfo = [this.$route.query.token, this.$route.query.userId]
                this.$store.commit("setLoginData", userInfo); //store 保存参数header.token, userInfo.userId
            }
        }
    }
</script>  
<style scoped >
    .historyTests .li_right {
        font-size: 40px;
        line-height: 90px;
    }
    .historyTests .van-cell__right-icon {
        font-size: 40px;
        margin-left: 8px;
        margin-top: 20px;
    }
    .historyTests .van-button {
        height: 130px;
    }
</style>

