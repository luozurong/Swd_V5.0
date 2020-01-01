import Vue from 'vue';
import Vuex from 'vuex';
import mall from './modules/mall'
import chat from './modules/chat'
Vue.use(Vuex)
const store = new Vuex.Store({
    modules:{
        mall,
        chat
    },
    state: {
        loginState: '0', // 全局使用的userid，个人中心页几乎各项数据的获取都需要此字段~同时此字段也被用来判断用户是否已经登录~默认为0表示没有登录
        checklist: '', // 选择慢病种类
        chatState: '0', // 判断用户是否正在聊天会话~默认为0表示没有会话,1表示存在会话状态
        chatObject: '0', // 判断用户是否正在与谁聊天会话~默认为0表示与健康管理师聊天中,1表示与专家团队医生聊天中,2表示与全科医生聊天中
        userInfo: {
            token: localStorage.token || '',
            userId: localStorage.userId || '',
            userName: localStorage.userName ||'',
            Account: localStorage.Account || '',
        },
        header: {
            AppByClinicId: '90000',
            OsType: 'app',
            Version: '5.0.01',
            time_stamp: '',
            // token: localStorage.token || 'guest'
        },
        IsIndexCome: false,     // //判断是否从健康评测列表首页进入
        villagesMsg: { //选中社区信息
            villageCode: '', //社区code
            villageName: '', //社区名称
        },
    },
    getters: {
    },
    mutations: {
        setVillagesMsg(state, payload) {
            // 保存选好的社区地址信息
            state.villagesMsg.villageCode = payload.villageCode;
            state.villagesMsg.villageName = payload.villageName;
        },
        IsIndexCome: (state, IsIndexCome) => {
            state.IsIndexCome = IsIndexCome;
        },
        setLoginData: (state, data) => {
            localStorage.setItem('authorization', data[0])
            state.header.token = data[0];
            state.userInfo.userId = data[1];
            localStorage.setItem('token', data[0]);
            localStorage.setItem('userId', data[1]);
        },
        setTimeStamp(state) {
            //设置当前时间
            var date = new Date();
            var month = date.getMonth() + 1; //月
            var strDate = date.getDate(); //日
            var strHours = date.getHours(); //时
            var strMinutes = date.getMinutes(); //分
            var strSeconds = date.getSeconds(); //秒
            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = "0" + strDate;
            }
            if (strHours >= 0 && strHours <= 9) {
                strHours = "0" + strHours;
            }
            if (strMinutes >= 0 && strMinutes <= 9) {
                strMinutes = "0" + strMinutes;
            }
            if (strSeconds >= 0 && strSeconds <= 9) {
                strSeconds = "0" + strSeconds;
            }
            var currentdate = date.getFullYear() + month + strDate + strHours + strMinutes + strSeconds;
            // 更新时间
            state.header.time_stamp = currentdate;
        }
    }

});

export default store;