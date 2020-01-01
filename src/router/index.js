import App from '../App'
import Vue from 'vue'
import Router from 'vue-router'
const index = () =>
    import('../views/index/index')
const lectureIndex = () =>
    import('../views/lecture/index')
const lectureSearch = () =>
    import('../views/lecture/search')
const videoDetails = () =>
    import('../views/lecture/videoDetails')
const articleDetails = () =>
    import('../views/lecture/articleDetails')
const test = () =>
    import('../views/test/test')
const chat = () =>
    import('../views/chat/chat')
const friendManage = () =>
    import('../views/friendManage/friendManage')
const activitiesIndex = () =>
    import('../views/publicActivities/activitiesIndex')
const activityRegister = () =>
    import('../views/publicActivities/activityRegister')
const writeAddress = () =>
    import('../views/publicActivities/writeAddress')
const registerDetails = () =>
    import('../views/publicActivities/registerDetails')
const reportDetails = () =>
    import('../views/publicActivities/reportDetails')
const historyTests = () =>
    import('../views/funnyTest/historyTests')
const testResDec = () =>
    import('../views/funnyTest/testResDec')
const interestIndex = () =>
    import('../views/funnyTest/interestIndex')
const interestTest = () =>
    import('../views/funnyTest/interestTest')
const healthReportList = () =>
    import('../views/healthReport/healthReportList')
const healthReportDetails = () =>
    import('../views/healthReport/healthReportDetails')
const downloadAPP = () =>
    import('../views/downloadAPP/downloadAPP')
const prescriptionDetail = () =>
    import('../views/prescriptionDetail/prescriptionDetail')
const examinationData = () =>
    import('../views/examinationData/examinationData')
const filloutInfoPC = () =>
    import('../views/machinePC/filloutInfoPC')
const presDetails = () =>
    import('../views/machinePC/presDetails')

Vue.use(Router)

var router = new Router({
    mode: 'history',
    base: 'nfysH5',
    routes: [{
        path: '/',
        component: App,
        children: [{
            path: '',
            redirect: '/lectureIndex',
            meta: {
                title: '慢病大讲堂'
            }
        }, {
            path: '/index',
            component: index,
            meta: {
                title: '首页'
            },
        }, {
            path: '/lectureIndex',
            name: 'lectureIndex',
            component: lectureIndex,
            meta: {
                title: '慢病大讲堂'
            },
        }, {
            path: '/videoDetails',
            component: videoDetails,
            name: 'videoDetails',
            meta: {
                title: '视频详情页'
            },
        }, {
            path: '/articleDetails',
            component: articleDetails,
            name: 'articleDetails',
            meta: {
                title: '文章详情页'
            },
        }, {
            path: '/lectureSearch',
            component: lectureSearch,
            name: 'lectureSearch',
            meta: {
                title: '慢病搜索页'
            },
        }, {
            path: '/chat',
            component: chat,
            name: 'chat',
            meta: {
                title: '聊天页面'
            },
        }, {
            path: '/friendManage',
            component: friendManage,
            name: 'friendManage',
            meta: {
                title: '好友绑定'
            },
        }, {
            path: '/test',
            path: '/activitiesIndex',
            component: activitiesIndex,
            name: 'activitiesIndex',
            meta: {
                title: '公益活动'
            },
        }, {
            path: '/activityRegister',
            component: activityRegister,
            name: 'activityRegister',
            meta: {
                title: '活动报名'
            }
        }, {
            path: '/writeAddress',
            component: writeAddress,
            name: 'writeAddress',
            meta: {
                title: '选择居住区域'
            }
        }, {
            path: '/registerDetails',
            component: registerDetails,
            name: 'registerDetails',
            meta: {
                title: '报名详情'
            }
        }, {
            path: '/reportDetails',
            component: reportDetails,
            name: 'reportDetails',
            meta: {
                title: '报告详情'
            }
        }, {
            path: '/historyTests',
            component: historyTests,
            name: 'historyTests',
            meta: {
                title: '趣味自测历史测试'
            }
        }, {
            path: '/testResDec',
            component: testResDec,
            name: 'testResDec',
            meta: {
                title: '趣味自测具体每个结果'
            }
        }, {
            path: '/interestIndex',
            component: interestIndex,
            name: 'interestIndex',
            meta: {
                title: '趣味自测首页'
            }
        }, {
            path: '/interestTest',
            component: interestTest,
            name: 'interestTest',
            meta: {
                title: '趣味自测开始测试'
            }
        }, {
            path: '/healthReportList',
            component: healthReportList,
            name: 'healthReportList',
            meta: {
                title: '健康评估报告列表'
            }
        }, {
            path: '/healthReportDetails',
            component: healthReportDetails,
            name: 'healthReportDetails',
            meta: {
                title: '健康评估报告详情'
            }
        }, {
            path: '/test',
            component: test,
            meta: {
                title: '测试'
            },
        }, {
            path: '/mall',
            component: () => import('../views/mall/home'),
            name: 'home',
            meta: {
                title: '商城'
            }
        }, {
            path: '/sendDrug',
            component: () => import('../views/mall/sendDrug'),
            name: 'sendDrug',
            meta: {
                title: '送药上门'
            }
        }, {
            path: '/productSearch/:columnType',
            component: () => import('../views/mall/productSearch'),
            name: 'productSearch',
            meta: {
                title: '商品搜索'
            }
        }, {
            path: '/productDetail/:columnId/:id/:shareUserId',
            component: () => import('../views/mall/productDetail'),
            name: 'productDetail',
            meta: {
                title: '商品详情'
            }
        },
        {
            path: '/requirementList',
            component: () => import('../views/mall/requirementList'),
            name: 'requirementList',
            meta: {
                title: '需求清单'
            }
        }, {
            path: '/shopCart',
            component: () => import('../views/mall/shopCart'),
            name: 'shopCart',
            meta: {
                title: '购物车'
            }
        }, {
            path: '/addressList',
            component: () => import('../views/mall/addressList'),
            name: 'addressList',
            meta: {
                title: '地址列表'
            }
        }, {
            path: '/addressEdit/:id',
            component: () => import('../views/mall/addressEdit'),
            name: 'addressEdit',
            meta: {
                title: '编辑地址'
            }
        }, {
            path: '/orderConfirm',
            component: () => import('../views/mall/orderConfirm'),
            name: 'orderConfirm',
            meta: {
                title: '确认订单'
            }
        }, {
            path: '/pay',
            component: () => import('../views/mall/pay'),
            name: 'pay',
            meta: {
                title: '订单详情'
            }
        }, {
            path: '/recommend/:columnId',
            component: () => import('../views/mall/recommend'),
            name: 'recommend',
            meta: {
                title: '商品推荐'
            }
        }, {
            path: '/healthShare',
            component: () => import('../views/share/healthShare'),
            name: 'healthShare',
            meta: {
                title: '健康分享'
            }
        }, {
            path: '/downloadAPP',
            component: downloadAPP,
            name: 'downloadAPP',
            meta: {
                title: 'APP下载'
            }
        }, {
            path: '/prescriptionDetail',
            component: prescriptionDetail,
            name: 'prescriptionDetail',
            meta: {
                title: '处方详情'
            }
        }, {  // 中航下单信息页面
            path: '/centerSailAddress',
            component: () => import('../views/centerSail/address'),
            name: 'centerSailAddress',
            meta: {
                title: '中航下单信息'
            }
        }, {  // 中航订单详情
            path: '/centerSailOrderDetail',
            component: () => import('../views/centerSail/orderDetail'),
            name: 'centerSailOrderDetail',
            meta: {
                title: '中航订单详情'
            }
        }, {
            path: '/examinationData',
            component: examinationData,
            name: 'examinationData',
            meta: {
                title: '体检数据'
            }
        }, {
            path: '/filloutInfoPC',
            component: filloutInfoPC,
            name: 'filloutInfoPC',
            meta: { 
                title: '就诊人信息填写'
            }
        }, {
            path: '/presDetails',
            component: presDetails,
            name: 'presDetails',
            meta: {
                title: '病历详情'
            }
        }]
    }]
})
export default router;
