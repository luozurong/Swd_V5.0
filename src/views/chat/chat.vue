<template>
  <div class="content">
    <!-- <van-nav-bar left-arrow>
    </van-nav-bar>-->
    <van-notice-bar mode="link" :scrollable="false" :text="patientInfo" @click="goPatientInfo"></van-notice-bar>
    <div ref="chat" class="chat" :style="{'margin-bottom':menuFlag?'130px':'0'}">
      <div>
        <div class="startTime">{{startTime}}</div>
      </div>
      <div @click="goProTocolDetails">
        <div class="protocol">
          根据国家互联网诊疗相关规定，请仔细阅读
          <u>《互联网诊疗风险告知及知情同意书》</u>
          ，如非复诊用户，我们不支持在线上开药，将继续咨询即表示您已悉知相关规则与风险并同意相关条款。
        </div>
      </div>
      <div
        v-for="(item,index) in messages"
        :key="index"
        :style="{'justify-content':item.from=='doctor'||item.from=='user'?'flex-start':'center','flex-direction':item.from=='user'?'row-reverse':'row'}"
      >
        <img
          v-if="item.from=='doctor'"
          :src="toUser.pic"
          style="border-radius:50% ; width: 36px;
        height: 36px;"
        />

        <img
          v-if="item.from=='user'"
          :src="user.pic"
          style="border-radius:50% ; width: 36px;
        height: 36px;"
        />

        <!-- 名片 -->
        <div v-if="item.type == 'mes_card'">
          <div class="card">
            <div class="doctorImg">
              <img :src="nameCard.imgUrl?nameCard.imgUrl:doctorPng" />
            </div>
            <div class="doctorInfo">
              <div class="doctorName">{{nameCard.name}}</div>
              <div class="doctorRank">
                <span v-if="nameCard.department">{{nameCard.department}}</span>
                <span v-if="nameCard.desc">/{{nameCard.desc}}</span>
              </div>
              <div class="doctorHospital">{{nameCard.hospital}}</div>
            </div>
            <div class="badge">医生名片</div>
          </div>
        </div>

        <!-- 处方笺 -->
        <div v-if="item.type == 'mes_prescription'">
          <div class="pressConten" @click="goTopress">
            <div class="pressImg">
              <img src="../../assets/img/chat/icon_prescription.png" />
            </div>
            <div class="preeText">
              <p class="pressTitle">处方笺</p>
              <p>医生已经开了处方，请及时查看。</p>
            </div>
          </div>
        </div>
        <!-- 时间 -->
        <div v-if="item.type == 'mes_time'">
          <div class="time">{{item.text}}</div>
        </div>

        <!-- 系统消息 -->
        <div v-if="item.type == 'mes_system'">
          <div class="system">{{item.content}}</div>
        </div>

        <!-- 文字 -->
        <div v-if="item.type == 'mes_text'">
          <div
            :class="{'doctorMessage':item.from=='doctor','userMessage':item.from=='user'}"
          >{{item.text}}</div>
        </div>

        <!-- 图片类型 -->
        <div v-if="item.type == 'mes_picture'">
          <div
            :class="{'doctorMessage':item.from=='doctor','userMessage':item.from=='user'}"
            @click="preViewChatImg(item.imgIndex)"
          >
            <div class="chatImg">
              <img :src="item.text" />
            </div>
          </div>
        </div>

        <!-- 医生诊断 -->
        <div v-if="item.type == 'mes_advicer' && item.from=='doctor'">
          <div class="advicer doctorMessage adviceMessage">
            <div class="adviceTitle">疾病指导总结</div>
            <div class="adviceContent">{{item.text}}</div>
          </div>
        </div>

        <!-- 商品推荐 -->
        <div v-if="item.type == 'mes_product' && item.from=='doctor'">
          <div class="productRecommend" @click="goToCommend(item.text.id,item.text.columnId)">
            <div class="productImg">
              <img :src="item.text.imgUrl" />
            </div>
            <div class="productDetails">
              <div>{{item.text.name}} {{item.text.realVolume}}</div>
              <div class="productTag" v-if="item.text.label">
                <span
                  v-if="labelText"
                  v-for="(labelText, index) in item.text.label.split('；')"
                  :key="index"
                >{{labelText}}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 评价 -->
        <div v-if="item.type == 'mes_evaluate'">
          <div class="evaluate">
            <div class="evaluateTitle">请对医生的服务进行评价！</div>
            <div class="evaluateBox">
              <div class="emojiBox" @click="giveAppraise('good')">
                <div class="good" :class="checkedChoice=='good'?'evaluateActived':''">好评</div>
                <div class="imgBox">
                  <img src="../../assets/img/chat/good.png" />
                </div>
              </div>
              <div class="emojiBox" @click="giveAppraise('medium')">
                <div class="medium" :class="checkedChoice=='medium'?'evaluateActived':''">中评</div>
                <div class="imgBox">
                  <img src="../../assets/img/chat/medium.png" />
                </div>
              </div>
              <div class="emojiBox" @click="giveAppraise('bad')">
                <div class="bad" :class="checkedChoice=='bad'?'evaluateActived':''">差评</div>
                <div class="imgBox">
                  <img src="../../assets/img/chat/bad.png" />
                </div>
              </div>
            </div>
            <div class="evaluateContent">
              <div
                class="evaluateTips"
                v-for="(item, index) in evaluateChoiceArr"
                :key="index"
                :class="item.isChecked == true?'evaluateActived':''"
                @click="checkChoice(item)"
              >{{item.content}}</div>
            </div>
            <div class="submitBtn" @click="submitChoice" v-if="!isSubmitChoice">提交</div>
          </div>
        </div>

        <img
          class="statusImg"
          src="../../assets/img/chat/loading.gif"
          v-if="item.from=='user'&&item.status=='sending'"
        />
        <img
          class="statusImg"
          src="../../assets/img/chat/sendError.png"
          v-else-if="item.from=='user'&&item.status=='error'&&!item.interface"
          @click="messages.splice(index,1);sendMessage('',item)"
        />
        <!-- 通过item 标识符 interface 判断发送失败的消息是接口还是strophe 不同方式的发送方法不同 -->
        <img
          class="statusImg"
          src="../../assets/img/chat/sendError.png"
          v-else-if="item.from=='user'&&item.status=='error'&&item.interface"
          @click="messages.splice(index,1);pushMessage('',item)"
        />
      </div>
    </div>

    <!-- 订单状态未关闭跟未完成都显示输入框 -->
    <div v-if="showInputFlag">
      <!-- 输入框 接诊 -->
      <div class="input" v-if="chatlogflag">
        <div class="inputContent">
          <input type="text" v-model="inputText" @keyup.enter="sendMessage()" />
          <div class="showMore">
            <img src="./../../assets/img/chat/more.png" @click="showMenu" />
          </div>
          <div class="sendBtn" :class="inputText?'haveText':''" @click="sendMessage()">发送</div>
        </div>
        <div v-if="menuFlag" class="inputMenu">
          <div class="inpImg">
            <img src="../../assets/img/chat/shoot_btn.png" @click="takePic" />
          </div>
          <div class="inpImg">
            <img src="../../assets/img/chat/photo_btn.png" @click="getPic" />
          </div>
          <input
            type="file"
            ref="picture"
            accept="image/*"
            style="left:-9999px;position:absolute;"
            @change="fileChange($event,1)"
          />
          <input
            type="file"
            ref="camera"
            capture="camera"
            accept="image/*"
            style="left:-9999px;position:absolute;"
            @change="fileChange($event,0)"
          />
        </div>
      </div>

      <!-- 输入框 没接诊 -->
      <div class="input" v-else>
        <div class="inputContent">
          <input type="text" v-model="inputText" @keyup.enter="pushMessage()" />
          <div class="showMore">
            <img src="./../../assets/img/chat/more.png" @click="showMenu" />
          </div>
          <div class="sendBtn" :class="inputText?'haveText':''" @click="pushMessage()">发送</div>
        </div>
        <div v-if="menuFlag" class="inputMenu">
          <div class="inpImg">
            <img src="../../assets/img/chat/shoot_btn.png" @click="takePic" />
          </div>
          <div class="inpImg">
            <img src="../../assets/img/chat/photo_btn.png" @click="getPic" />
          </div>
          <input
            type="file"
            ref="picture"
            accept="image/*"
            style="left:-9999px;position:absolute;"
            @change="pushfileChange($event,1)"
          />
          <input
            type="file"
            ref="camera"
            capture="camera"
            accept="image/*"
            style="left:-9999px;position:absolute;"
            @change="pushfileChange($event,0)"
          />
        </div>
      </div>
    </div>

    <!-- 协议弹框 -->
    <van-action-sheet round v-model="sheetShow" title="互联网诊疗风险告知及知情同意书">
      <div class="sheet_con">
        <p>各省、自治区、直辖市及新疆生产建设兵团卫生计生委、中医药管理局：</p>
        <p
          class="sheet_con_msg"
        >为贯彻落实《国务院办公厅关于促进“互联网+医疗健康”发展的意见》有关要求，进一步规范互联网诊疗行为，发挥远程医疗服务积极作用，提高医疗服务效率，保证医疗质量和医疗安全，国家卫生健康委员会和国家中医药管理局组织制定了《互联网诊疗管理办法（试行）》、《互联网医院管理办法（试行）》、《远程医疗服务管理规范（试行）》，现印发给你们，请遵照执行。</p>
        <p>第一条 为落实《国务院办公厅关于促进“互联网+医疗健康”发展的意见》，规范互联网诊疗活动，推动互联网医疗服务健康快速发展，保障医疗质量和医疗安全，根据《执业医师法》、《医疗机构管理条例》等法律法规，制定本办法。</p>
        <p>
          第二条 本办法 [1] 所称互联网诊疗是指医疗机构利用在本机构注册的医师，通过互联网等信息技术开展部分常见病、慢性病复诊和“互联网+”家庭医生签约服务。
          第三条 国家对互联网诊疗活动实行准入管理。
        </p>
        <p>第四条 国务院卫生健康行政部门和中医药主管部门负责全国互联网诊疗活动的监督管理。地方各级卫生健康行政部门（含中医药主管部门，下同）负责辖区内互联网诊疗活动的监督管理。</p>
        <p>第二章 互联网诊疗活动准入</p>
        <p>第五条 互联网诊疗活动应当由取得《医疗机构执业许可证》的医疗机构提供。</p>
        <p>第六条 新申请设置的医疗机构拟开展互联网诊疗活动，应当在设置申请书注明，并在设置可行性研究报告中写明开展互联网诊疗活动的有关情况。如果与第三方机构合作建立互联网诊疗服务信息系统，应当提交合作协议。</p>
        <!-- <div>
          <van-button round type="info" block @click="handleAgreement">我已阅读并同意</van-button>
        </div>-->
      </div>
    </van-action-sheet>
  </div>
</template>

  
<script>
import strophe from "strophe.js";
import { ImagePreview } from "vant";

import { mapState } from "vuex";

import wx from "weixin-js-sdk";
import userPng from "../../assets/img/chat/default_user.png";
import doctorPng from "../../assets/img/chat/default_doctor.png";
export default {
  data() {
    return {
      userPng,
      startTime: null,
      inputText: "",
      messages: [], //元素对象(type/text/from/imgIndex)
      menuFlag: false,
      prescription: false, //是否开过处方药，true开过
      prescriptionArr: [], //存放处方的信息(确保名片在下,处方在上)
      failPic: {},
      nameCard: {
        name: "",
        desc: " ", //职称
        department: "", //部门
        hospital: "",
        imgUrl: "" //医生头像
      },
      isSubmitChoice: false, //是否提交了评价
      checkedChoice: "good", //评价默认选中好评高亮
      evaluateChoiceArr: [
        {
          content: "服务态度好",
          isChecked: true
        },
        {
          content: "回复超级快",
          isChecked: false
        },
        {
          content: "医生非常专业",
          isChecked: false
        },
        {
          content: "开药很有效",
          isChecked: false
        },
        {
          content: "解答很详细",
          isChecked: false
        },
        {
          content: "耐心负责好",
          isChecked: false
        }
      ],
      // 登陆用户信息
      userInfo: null,
      // openfire 服务器
      BOSH_SERVICE:
        window.WebSocket && window.WebSocket.prototype.send
          ? "wss://nfys-test.kinglian.cn:7443/ws/"
          : "https://nfys-test.kinglian.cn:7443/http-bind/",
      // BOSH_SERVICE:window.WebSocket && window.WebSocket.prototype.send? "wss://nfys.kinglian.cn:7443/ws/": "https://nfys.kinglian.cn:7443/http-bind/",
      //病人实体
      patientObj: {
        healthInfo: "",
        listImageUrl: [],
        patientName: "",
        patientGender: "",
        patientAge: 29,
        patientId: "",
        patientAddress: "",
        allergy: "",
        ageText: ""
      },
      orderStateObj: {},
      //用户信息
      uid: "",
      // 接收方医生信息
      toUser: {
        _id: "",
        pic: "./../../../static/img/chat/doctor.png",
        username: "",
        fromid: ""
      },
      // 发送方用户信息
      user: {
        _id: "",
        pic: "./../../../static/img/chat/doctor.png",
        username: "",
        jid: ""
      },
      //订单id
      OrderId: "",
      PortalId: "",
      chatImgs: [], //图片数组
      chatImgsNum: 0, //图片计数
      haveLocal: false,
      orderStatus: false, //如果订单状态不是 问诊中则为false,若此为false,chatlogflag也为false,不显示输入框
      chatlogflag: false, //显示输入框 如果是true显示
      enterTime: 0,
      leaveTime: 0, //倒计时
      checkChoiceArr: ["服务态度好"],
      sheetShow: false, //协议弹框
      connectCount: 0,
      inquiryType: 6, //名医咨询
      apiMessage: [], //接口获取的离线聊天
      showInputFlag: true //订单关闭跟完成就不显示输入框 其他都显示
    };
  },
  computed: {
    ...mapState({
      connection: state => state.chat.connection,
      disconnect: state => state.chat.disconnect
    }),
    patientInfo() {
      let obj = this.patientObj;
      let time = this.leaveTime;
      return `${obj.patientName} ${obj.patientGender} 主述: ${obj.healthInfo}`;
    }
  },
  watch: {
    messages(n, o) {
      console.log("存聊天记录");
      localStorage.setItem("chatLog-" + this.OrderId, JSON.stringify(n));
      if (
        n.length > 2 &&
        n[n.length - 1].time &&
        n[n.length - 2].time &&
        n[n.length - 1].time - n[n.length - 2].time > 0.05 * 60 * 1000
      ) {
        this.messages.splice(n.length - 1, 0, {
          type: "mes_time",
          text: new Date().format("MM月dd日 hh:mm")
        });
      }
    }
  },
  methods: {
    // html操作
    // 操作面板显示隐藏
    showMenu() {
      this.menuFlag = !this.menuFlag;
      setTimeout(() => {
        this.scrollView();
      }, 1);
    },
    goTopress() {
      var that = this;
      console.log(that.OrderId);
      wx.miniProgram.getEnv(function(res) {
        if (res.miniprogram) {
          if (that.inquiryType == 9) {
            wx.miniProgram.navigateTo({
              url:
                "/pages/personalCenter/prescriptionDetail/index?orderId=" +
                that.OrderId +
                "&headline=0&buyDrug=0"
            });
          } else {
            wx.miniProgram.navigateTo({
              url:
                "/pages/personalCenter/prescriptionDetail/index?orderId=" +
                that.OrderId +
                "&headline=0&buyDrug=1"
            });
          }
        }
      });
    },
    // 手机拍照
    takePic() {
      this.$refs.camera.click();
    },
    // 手机相册
    getPic() {
      this.$refs.picture.click();
    },
    // 滑动底部
    scrollView() {
      this.$nextTick(() => {
        this.$refs.chat.scrollTo(0, this.$refs.chat.scrollHeight);
      });
    },
    goProTocolDetails() {
      this.sheetShow = true;
    },
    handleAgreement() {
      this.sheetShow = false;
    },
    //获取评价内容
    getChoiceOptions() {
      var evaluateInfoObjStr = localStorage.getItem(
        "evaluateInfo" + this.OrderId
      );
      if (evaluateInfoObjStr) {
        var evaluateInfoObj = JSON.parse(evaluateInfoObjStr);
        if (evaluateInfoObj.isSubmitChoice) {
          this.isSubmitChoice = true;
          if (evaluateInfoObj.evaluateInfo) {
            var evalArr = evaluateInfoObj.evaluateInfo.split("、");
            if (evaluateInfoObj.checkedChoice == "medium") {
              this.evaluateChoiceArr = [
                {
                  content: "态度一般",
                  isChecked: true
                },
                {
                  content: "回复算及时",
                  isChecked: false
                },
                {
                  content: "医生还算专业",
                  isChecked: false
                },
                {
                  content: "开药正常",
                  isChecked: false
                },
                {
                  content: "解答部分问题",
                  isChecked: false
                },
                {
                  content: "还算负责",
                  isChecked: false
                }
              ];
            } else {
              this.evaluateChoiceArr = [
                {
                  content: "服务态度差",
                  isChecked: true
                },
                {
                  content: "回复速度慢",
                  isChecked: false
                },
                {
                  content: "没有解决问题",
                  isChecked: false
                },
                {
                  content: "没耐心，回答马虎",
                  isChecked: false
                },
                {
                  content: "乱开药",
                  isChecked: false
                },
                {
                  content: "非常不专业",
                  isChecked: false
                }
              ];
            }
            for (var i = 0; i < this.evaluateChoiceArr.length; i++) {
              if (evalArr.includes(this.evaluateChoiceArr[i].content)) {
                this.evaluateChoiceArr[i].isChecked = true;
              }
            }
            console.log(this.evaluateChoiceArr);
          }
          if (evaluateInfoObj.checkedChoice) {
            this.checkedChoice = evaluateInfoObj.checkedChoice;
          }
        }
      }
    },

    //选择评价
    checkChoice(item) {
      if (this.isSubmitChoice) return false;
      item.isChecked = !item.isChecked;
      if (item.isChecked) {
        if (!this.checkChoiceArr.includes(item.content)) {
          this.checkChoiceArr.push(item.content);
        }
      } else {
        if (this.checkChoiceArr.includes(item.content)) {
          var index = this.checkChoiceArr.indexOf(item.content);
          if (index > -1) {
            this.checkChoiceArr.splice(index, 1);
          }
        }
      }
      //提交接口评价
    },

    //选择好中差评
    giveAppraise(item) {
      if (this.isSubmitChoice) return false;
      this.checkedChoice = item;
      if (item == "good") {
        this.checkChoiceArr = ["服务态度好"];
        this.evaluateChoiceArr = [
          {
            content: "服务态度好",
            isChecked: true
          },
          {
            content: "回复超级快",
            isChecked: false
          },
          {
            content: "医生非常专业",
            isChecked: false
          },
          {
            content: "开药很有效",
            isChecked: false
          },
          {
            content: "解答很详细",
            isChecked: false
          },
          {
            content: "耐心负责好",
            isChecked: false
          }
        ];
      } else if (item == "medium") {
        this.checkChoiceArr = ["态度一般"];
        this.evaluateChoiceArr = [
          {
            content: "态度一般",
            isChecked: true
          },
          {
            content: "回复算及时",
            isChecked: false
          },
          {
            content: "医生还算专业",
            isChecked: false
          },
          {
            content: "开药正常",
            isChecked: false
          },
          {
            content: "解答部分问题",
            isChecked: false
          },
          {
            content: "还算负责",
            isChecked: false
          }
        ];
      } else {
        this.checkChoiceArr = ["服务态度差"];
        this.evaluateChoiceArr = [
          {
            content: "服务态度差",
            isChecked: true
          },
          {
            content: "回复速度慢",
            isChecked: false
          },
          {
            content: "没有解决问题",
            isChecked: false
          },
          {
            content: "没耐心，回答马虎",
            isChecked: false
          },
          {
            content: "乱开药",
            isChecked: false
          },
          {
            content: "非常不专业",
            isChecked: false
          }
        ];
      }
      // 根据item的内容获评价内容
    },

    //提交评价内容
    submitChoice() {
      var rated = 1;
      if (this.checkedChoice == "medium") {
        rated = 2;
      } else if (this.checkedChoice == "bad") {
        rated = 3;
      }
      var choiceStr = this.checkChoiceArr.join("、");
      //评价对象
      var eveObj = {
        evaluateInfo: choiceStr,
        checkedChoice: this.checkedChoice,
        isSubmitChoice: true
      };
      localStorage.setItem(
        "evaluateInfo" + this.OrderId,
        JSON.stringify(eveObj)
      );
      var params = {
        body: {
          doctorId: this.orderStateObj.DoctorId,
          orderId: this.OrderId,
          rated: rated, //1好评 2中评 3差评
          evaluateInfo: choiceStr //评语
        }
      };
      this.isSubmitChoice = true;
      this.$api
        .evaluateDoctor(params)
        .then(res => {
          this.$toast("评价成功");
        })
        .catch(err => {
          this.$toast(err.message);
        });
    },

    preViewChatImg(index) {
      ImagePreview({
        images: this.chatImgs,
        startPosition: index,
        showIndex: true
      });
    },
    // 发送图片
    fileChange(e, k) {
      var input;
      var _this = this;
      if (k == 1) {
        input = this.$refs.picture;
      } else {
        input = this.$refs.camera;
      }
      if (!input) return;
      if (!input.files[0]) return;
      var data = new FormData();
      var filereader = new FileReader();
      filereader.readAsDataURL(input.files[0]);
      filereader.onload = function() {
        var imgtemp = this.result;
        let message = {
          id: "m" + new Date().getTime(),
          time: new Date().getTime(),
          from: "user",
          type: "mes_picture",
          status: "sending",
          files: input.files[0],
          text: imgtemp
        };
        _this.failPic[message.id] = input.files[0];

        message.timeoutId = setTimeout(() => {
          message.status = "error";
        }, 10 * 1000);
        _this.messages.push(message);

        data.append("file", input.files[0]);
        _this.$api.chatImgUpload(data).then(res => {
          var res = res.data;
          if (res.code == 0 && res.Messages != "未找到文件") {
            console.log(res.Messages);
            let message = _this.messages.filter(x => x.text == imgtemp)[0];
            message.text = res.data.uploadFilePath;
            delete this.failPic[message.id];
            _this.sendMessage(message);
          }
        });
        setTimeout(() => {
          _this.scrollView();
        }, 1);
      };
    },

    //没接诊图片的上传
    pushfileChange(e, k) {
      console.log("没接诊图片的上传");
      var input;
      var _this = this;
      if (k == 1) {
        input = this.$refs.picture;
      } else {
        input = this.$refs.camera;
      }
      if (!input) return;
      if (!input.files[0]) return;
      var data = new FormData();
      var filereader = new FileReader();
      filereader.readAsDataURL(input.files[0]);
      filereader.onload = function() {
        var imgtemp = this.result;
        let message = {
          id: "m" + new Date().getTime(),
          time: new Date().getTime(),
          from: "user",
          type: "mes_picture",
          status: "sending",
          files: input.files[0],
          text: imgtemp
        };
        _this.failPic[message.id] = input.files[0];
        console.log(_this.failPic[message.id])
        message.timeoutId = setTimeout(() => {
          message.status = "error";
        }, 10 * 1000);
        _this.messages.push(message);

        data.append("file", input.files[0]);
        _this.$api.chatImgUpload(data).then(res => {
          console.log(res)
          var result = res.data;
          if (result.code == 0 && result.Messages != "未找到文件") {
            console.log(result.Messages);
            let message = _this.messages.filter(x => x.text == imgtemp)[0];
            console.log(_this.failPic)
            message.text = result.data.uploadFilePath;
            delete _this.failPic[message.id];
            _this.pushMessage(message);
          }
        });
        setTimeout(() => {
          _this.scrollView();
        }, 1);
      };
    },
    goPatientInfo() {
      var that = this;
      wx.miniProgram.getEnv(function(res) {
        if (res.miniprogram) {
          wx.miniProgram.navigateTo({
            url:
              "/pages/chat/patient/patientInformation?orderId=" + that.OrderId
          });
        }
      });
    },

    //去商城详情
    goToCommend(id, columnId) {
      var columnId = columnId ? columnId : -1;
      wx.miniProgram.getEnv(function(res) {
        if (res.miniprogram) {
          wx.miniProgram.navigateTo({
            url:
              "/pages/mall/product/productDetail/productDetail?comId=" +
              id +
              "&columnId=" +
              columnId +
              "&shareUserId=0"
          });
        }
      });
    },

    //去医生详情
    goDoctorInfo() {
      var that = this;
      wx.miniProgram.getEnv(function(res) {
        console.log(res.miniprogram); // true
        if (res.miniprogram) {
          wx.miniProgram.navigateTo({
            url:
              "/pages/chat/patient/patientInformation?doctorId=" +
              that.orderStateObj.DoctorId
          });
        }
      });
    },

    //聊天模块
    // openfire链接
    connectOpenfire() {
      // console.log("openfire - 1");
      var usType = "user_";
      var usid = "";
      if (this.userInfo) {
        if (this.PortalId != "") {
          if (
            this.userInfo.xmpp_password != undefined &&
            this.userInfo.xmpp_password != ""
          ) {
            usid = usType + this.PortalId;
            this.uid = usid + "@cluster.openfire/yyy_u";
            this.$store.commit(
              "setConnection",
              new Strophe.Connection(this.BOSH_SERVICE)
            );
            console.log(this.connection);
            console.log(usid + "@cluster.openfire/yyy_u");
            // this.userInfo.xmpp_password = this.userInfo.xmpp_password.toLowerCase()
            console.log(this.userInfo.xmpp_password);
            this.connection.connect(
              usid + "@cluster.openfire/yyy_u",
              this.userInfo.xmpp_password,
              this.onConnect
            );
          }
        }
        setInterval(this.sendSelf, 1000 * 30);
      }
    },

    // 连接回调
    onConnect(status) {
      var that = this;
      if (status == Strophe.Status.CONNECTING) {
        console.log("Strophe is connecting.");
      } else if (status == Strophe.Status.CONNFAIL) {
        console.log("Strophe is CONNFAIL.");
        if (this.connectCount < 20) {
          this.connectCount++;
          this.connectOpenfire();
        }
      } else if (status == Strophe.Status.DISCONNECTING) {
        console.log("Strophe is DISCONNECTING.");
      } else if (status == Strophe.Status.DISCONNECTED) {
        if (this.connectCount < 20) {
          this.connectCount++;
          this.connectOpenfire();
        }
        console.log("Strophe is DISCONNECTED.");
        this.$api.getVisitOrderState({}, this.OrderId).then(result => {
          var res = result.data.data;
          if (res.orderState != 7) {
            this.chatlogflag = false;
          } else {
            this.chatlogflag = true;
          }
          // if (res.orderState == 200) {
          //   var type = "mes_system";
          //   var submitFlag = false;
          //   var evaluateInfoObjStr = localStorage.getItem(
          //     "evaluateInfo" + this.OrderId
          //   );
          //   if (evaluateInfoObjStr) {
          //     submitFlag = JSON.parse(evaluateInfoObjStr).isSubmitChoice;
          //   }
          //   if (!submitFlag) {
          //     if (this.prescriptionArr.length)
          //       this.message.push(...this.prescriptionArr);
          //     this.messages.push(
          //       {
          //         type: type,
          //         content: "问诊结束，谢谢您的信任，祝您早日康复"
          //       },
          //       {
          //         type: "mes_card"
          //       },
          //       {
          //         type: "mes_evaluate"
          //       }
          //     );
          //   }
          // }
        });
      } else if (status == Strophe.Status.CONNECTED) {
        console.log("Strophe is CONNECTED.");
        this.$api.getVisitOrderState({}, this.OrderId).then(result => {
          var res = result.data.data;
          if (res.orderState != 7) {
            this.chatlogflag = false;
          } else {
            this.chatlogflag = true;
          }
        });
        if (!this.haveLocal) {
          // console.log("openfire - 2");
          this.getopenfireChatLog();
        }
        this.connection.addHandler(
          this.onMessage,
          null,
          "message",
          null,
          null,
          null
        );
        this.connection.send($pres().tree());
        if (this.orderStatus) this.chatlogflag = true;
      }
    },

    // 获取本地聊天 getlocalmessage(orderid)
    // 获取本地记录
    getLocalChatLog(orderid) {
      return new Promise((resolve, reject) => {
        if (localStorage.getItem("chatLog-" + orderid)) {
          //本地有聊天记录
          var exist = JSON.parse(localStorage.getItem("chatLog-" + orderid));
        } else {
          var exist = [];
        }
        var namecard = localStorage.getItem("namecard-" + orderid);
        //拼入医生名片
        if (namecard) {
          this.nameCard = JSON.parse(namecard);
        }
        if (exist.length == 0) {
          this.haveLocal = false;
          this.messages = this.apiMessage;
          for (var k = 0; k < this.messages.length; k++) {
            if (this.messages[k].type == "mes_picture") {
              var src = this.messages[k].text;
              this.chatImgs.push(src);
            }
          }
        } else {
          this.messages = exist;
          this.messages.concat(this.apiMessage);

          for (var k = 0; k < this.messages.length; k++) {
            if (this.messages[k].type == "mes_picture") {
              var src = this.messages[k].text;
              this.chatImgs.push(src);
            }
          }
          var tmpExitStr = JSON.stringify(exist);
          console.log(tmpExitStr.indexOf("mes_prescription") == -1);
          if (
            this.prescription &&
            tmpExitStr.indexOf("mes_prescription") == -1
          ) {
            //如果本地没有处方 就推送一条处方
            this.messages.push({
              time: new Date().getTime(),
              type: "mes_prescription"
            });
          }
          this.getChoiceOptions();
          this.haveLocal = true;
          //存在接口返回 消息记录
          if (this.apiMessage) {
            this.messages.sort((a, b) => a.time > b.time);
            console.log(this.messages)
          }

          setTimeout(() => {
            this.scrollView();
          }, 1);
        }
        resolve();
      });
    },
    // 获取在线聊天记录总方法
    getopenfireChatLog() {
      var serviceLogId = this.OrderId;
      var date = new Date().getTime().toString();
      var iq = $iq({
        type: "get",
        id: this.RndNum(8),
        from: this.uid
      })
        .c("query", {
          xmlns: "cn.kinglian.openfire.GetChatLogsRequestIq"
        })
        .c("timePoint", date)
        .up()
        .c("beforeFlag", "1")
        .up()
        .c("serviceLogId", serviceLogId)
        .up()
        .c("serviceType")
        .up()
        .c("limit", "50")
        .up()
        .c("chatUsers")
        .c("chat", {
          jid1: this.user.jid,
          jid2: this.toUser.fromid
        });
      this.connection.sendIQ(iq, this.getChatLog);
    },
    //获取在线聊天
    getChatLog(msg) {
      var to = msg.getAttribute("to");
      var from = msg.getAttribute("from");
      var type = msg.getAttribute("type");
      var elems = msg.getElementsByTagName("chatLogs");
      if (type == "result" && elems.length > 0) {
        var logs = elems[0].getElementsByTagName("log");
        for (var i = logs.length - 1; i > -1; i--) {
          var timeid = this.RndNum(10);
          try {
            //大于这个时间 则不获取 会直接走onmessage 方法 展示出来
            if (parseInt(logs[i].getAttribute("msgTime")) > this.enterTime)
              continue;
            var message = {
              text: logs[i].getAttribute("message")
            };
            //如果是图片消息
            if (message.text.match("png") || message.text.match("jpg")) {
              var content = message.text.split(";");
              var src = content[0];
              message.type = "mes_picture";
              message.text = src;
              this.chatImgsNum++;
              this.chatImgs.push(src);
            }
            let userId = logs[i]
              .getAttribute("fromJid")
              .split("@")[0]
              .split("_")[1];
            if (userId == this.user._id) {
              message.from = "user";
            }
            if (userId == this.orderStateObj.DoctorId) {
              message.from = "doctor";
            }
            this.messages.push(message);
          } catch (e) {
            this.showAlert("onchatlog函数内 获取聊天记录出错..");
          }
        }
        this.messages.sort((a, b) => a.time > b.time);
        setTimeout(() => {
          this.scrollView();
        }, 1);
      }
      return true;
    },
    // 接收信息
    onMessage(msg) {
      console.log(msg);
      var to = msg.getAttribute("to");
      var from = msg.getAttribute("from");
      var chatType = msg.getAttribute("type");
      if (to + "/yyy_u" != this.uid && to != this.uid) {
        return true;
      }
      var elems = msg.getElementsByTagName("body");
      var received = msg.getElementsByTagName("received");
      var type = "mes_text";
      var orderId = this.OrderId;
      var body = elems[0];
      if (chatType == null && !received.length) {
        var chatJson = JSON.parse(
          decodeURIComponent(
            escape(atob(Strophe.getText(body).replace(" ", "+")))
          )
        );
        var chatOrderId = chatJson.orderId;
        var content = chatJson.msg || "";
        var reason = chatJson.reason || "";
        type = "mes_system";
        if (chatOrderId == this.OrderId) {
          var msgType = chatJson.msgType;
          if (msgType == "") {
            return true;
          }
          if (msgType == "101") {
            this.$api.getVisitOrderState({}, chatOrderId).then(result => {
              var res = result.data.data;
              if (res.orderState != 7) {
                this.chatlogflag = false;
              } else {
                this.chatlogflag = true;
              }
            });
            // this.messages.push({
            //   time: new Date().getTime(),
            //   type,
            //   content
            // });
            // if (this.inquiryType == 6) {
            //   this.messages.push(
            //     {
            //       time: new Date().getTime(),
            //       type,
            //       content: "尊敬的用户欢迎您！南风医生为您服务"
            //     },
            //     {
            //       time: new Date().getTime(),
            //       type,
            //       content: "医生正在查看您的情况，请稍等"
            //     }
            //   );
            // }
            // type = "mes_card";
            // 名片推送
          }
          if (msgType == "103") {
            content = "医生正在开处方";
            this.messages.push({
              time: new Date().getTime(),
              type,
              content
            });
          }
          if (msgType == "104") {
            //推送系统信息
            // type = "mes_system";
            // type与content已在上面处理了
            this.messages.push({
              time: new Date().getTime(),
              type,
              content
            });
          }
          if (msgType == "105") {
            //订单状态刷新
            this.$api.getVisitOrderState({}, chatOrderId).then(result => {
              var res = result.data.data;
              if (res.orderState != 7) {
                this.chatlogflag = false;
                this.showInputFlag = false;
              } else {
                this.chatlogflag = true;
              }
              if (res.orderState == 200) {
                //关闭输入框
                this.messages.push(
                  {
                    time: new Date().getTime(),
                    type: type,
                    content: content
                  },
                  {
                    time: new Date().getTime(),
                    type: "mes_card"
                  },
                  {
                    time: new Date().getTime(),
                    type: "mes_evaluate"
                  }
                );
              }
            });
          }
          if (msgType == "200") {
            content = "处方审核通过";
            this.$api
              .getVisitOrderState({}, chatOrderId)
              .then(result => {
                var res = result.data.data;
                if (res.orderState != 7) {
                  this.chatlogflag = false;
                  this.showInputFlag = false;
                } else {
                  this.chatlogflag = true;
                }
              })
              .catch(err => {
                console.log(err.message);
              });
            this.messages.push(
              {
                time: new Date().getTime(),
                type,
                content
              },
              {
                time: new Date().getTime(),
                type: "mes_prescription"
              },
              {
                time: new Date().getTime(),
                type: "mes_card"
              },
              {
                time: new Date().getTime(),
                type: "mes_evaluate"
              }
            );
          }
          if (msgType == "202") {
            this.$store.commit("disconnect");
            this.chatlogflag = false;
            content = "问诊超时自动结束";
            this.messages.push({
              time: new Date().getTime(),
              type,
              content
            });
          }
          if (msgType == "500") {
            content = "药品审核通过";
            this.messages.push({
              time: new Date().getTime(),
              type,
              content
            });
          }
          if (msgType == "502") {
            content = "药品审核不通过:" + reason;
            this.messages.push({
              time: new Date().getTime(),
              type,
              content
            });
          }
          // var message = {
          //   text: content,
          //   type: type,
          //   // from: "doctor"
          // };
          // this.messages.push(message);
        }
        setTimeout(() => {
          this.scrollView();
        }, 1);
      }
      if (chatType == "chat" && elems.length > 0) {
        var body = elems[0];
        var OrderId;
        var propertieObj = msg.getElementsByTagName("properties")[0].childNodes;
        var content = Strophe.getText(body);
        for (let index = 0; index < propertieObj.length; index++) {
          const element = propertieObj[index];
          if (Strophe.getText(element.childNodes[0]) == "serviceLogId") {
            OrderId = Strophe.getText(element.childNodes[1]);
          }
        }
        if (OrderId == this.OrderId) {
          var message = {
            time: new Date().getTime(),
            type: "mes_text",
            from: "doctor",
            text: content
          };
          var chattype = Strophe.getText(
            msg.getElementsByTagName("properties")[0].childNodes[0]
              .childNodes[1]
          );
          var typeObj = msg.getElementsByTagName("properties")[0].childNodes;
          for (var i = 0; i < typeObj.length; i++) {
            var tmpObj = typeObj[i];
            var typeName = Strophe.getText(tmpObj.childNodes[0]);
            var typeValue = Strophe.getText(tmpObj.childNodes[1]);
            if (typeName == "type") {
              if (typeValue == "-1") {
                //系统信息
                message.type = "mes_system ";
              } else if (typeValue == "1") {
                //语音消息
                message.text = "收到一条语音消息，目前暂不支持";
                message.type = "mes_system ";
              } else if (typeValue == "2") {
                content = content.split(";");
                var src = content[0];
                var bigSrc = content[1];
                //图片类型
                message.type = "mes_picture";
                message.text = src;
                message.imgIndex = this.chatImgsNum++;
                this.chatImgs.push(bigSrc);
              } else if (typeValue == "60") {
                message.type = "mes_advicer";
                message.from = "doctor";
                message.text = content;
              } else if (typeValue == "66") {
                let text = JSON.parse(
                  decodeURIComponent(
                    escape(atob(Strophe.getText(body).replace(" ", "+")))
                  )
                );
                message.type = "mes_product";
                message.from = "doctor";
                message.text = text;
              }
            }
          }
          if (this.OrderId) {
            if (content == "祝您早日康复，并请您对我的服务做评价，谢谢！") {
              if (Strophe.Status.CONNECTED) {
                this.$store.commit("disconnect");
              }
            }
            this.messages.push(message);
          }
        }
        setTimeout(() => {
          this.scrollView();
        }, 1);
      }
      if (chatType == "normal" || (chatType == null && received.length)) {
        var received = msg.getElementsByTagName("received")[0];
        var id = received.getAttribute("id");
        for (var i = 0; i < this.messages.length; i++) {
          if (this.messages[i].id == id) {
            this.messages[i].status = "";
            clearTimeout(this.messages[i].timeoutId);
          }
        }
        localStorage.setItem(
          "chatLog-" + this.OrderId,
          JSON.stringify(this.messages)
        );
      }
      return true;
    },
    // 发送信息
    sendMessage(pic, mess) {
      if (!this.inputText && !pic && !mess.text) {
        return;
      }
      var text = mess && mess.text ? mess.text : this.inputText;
      var typeflag = "0";
      var message = {
        id: "m" + new Date().getTime(),
        time: new Date().getTime(),
        from: "user",
        status: "sending",
        type: "mes_text",
        text: text
      };
      message.timeoutId = setTimeout(() => {
        message.status = "error";
        localStorage.setItem(
          "chatLog-" + this.OrderId,
          JSON.stringify(this.messages)
        );
      }, 1000 * 10);
      if (mess && mess.text.indexOf("data:image") > -1) {
        message.type = "mes_picture";
        var data = new FormData();
        data.append("file", this.failPic[mess.id]);
        this.$api.chatImgUpload(data).then(res => {
          var res = res.data;
          if (res.code == 0 && res.Messages != "未找到文件") {
            let message = _this.messages.filter(x => x.text == imgtemp)[0];
            message.text = res.data.uploadFilePath;
            delete this.failPic[mess.id];
            this.sendMessage(message);
          }
        });
        this.messages.push(message);
        return;
      }
      //如果是图片,把原先base64图片替换
      //如果是其他,直接push
      if (pic) {
        typeflag = "2";
        this.chatImgs.push(pic.text);
        text = pic.text + ";" + pic.text;
      } else {
        this.messages.push(message);
      }

      var reply = $msg({
        id: pic ? pic.id : message.id,
        to: this.toUser.fromid,
        // to: this.uid,
        // to: "employee_1541939@cluster.openfire/yyy_d",
        from: this.uid,
        type: "chat"
      })
        .cnode(Strophe.xmlElement("body", "", text))
        .up()
        .c("request", {
          xmlns: "urn:xmpp:receipts"
        })
        .up()
        .c("request", {
          xmlns: "urn:xmpp:receipts"
        })
        .up()
        .c("properties", {
          xmlns: "http://www.jivesoftware.com/xmlns/xmpp/properties"
        })
        .c("property")
        .c("name")
        .t("serviceLogId")
        .up()
        .c("value", {
          type: "string"
        })
        .t(this.OrderId)
        .up()
        .up()
        .c("property")
        .c("name")
        .t("serviceType")
        .up()
        .c("value", {
          type: "string"
        })
        .t("1")
        .up()
        .up()
        .c("property")
        .c("name")
        .t("type")
        .up()
        .c("value", {
          type: "string"
        })
        .t(typeflag);
      console.log(reply.tree());
      this.connection.send(reply.tree());
      this.inputText = "";
      this.scrollView();
    },

    //本地发送消息(比strophe多了一个标识字段:interface)
    pushMessage(pic, mess) {
      if (!this.inputText && !pic && !mess.text) {
        return;
      }
      var text = mess && mess.text ? mess.text : this.inputText;
      var message = {
        id: "m" + new Date().getTime(),
        time: new Date().getTime(),
        from: "user",
        status: "sending",
        type: "mes_text",
        text: text,
        interface: true
      };
      message.timeoutId = setTimeout(() => {
        message.status = "error";
        localStorage.setItem(
          "chatLog-" + this.OrderId,
          JSON.stringify(this.messages)
        );
      }, 1000 * 10);
      if (mess && mess.text.indexOf("data:image") > -1) {
        message.type = "mes_picture";
        var data = new FormData();
        data.append("file", this.failPic[mess.id]);
        this.$api.chatImgUpload(data).then(res => {
          var res = res.data;
          if (res.code == 0 && res.Messages != "未找到文件") {
            let message = _this.messages.filter(x => x.text == imgtemp)[0];
            message.text = res.data.uploadFilePath;
            delete this.failPic[mess.id];
            this.pushMessage(message);
          }
        });
        this.messages.push(message);
        return;
      }
      //如果是图片,把原先base64图片替换
      //如果是其他,直接push
      if (pic) {
        this.chatImgs.push(pic.text);
        text = pic.text;
      } else {
        this.messages.push(message);
      }
      console.log("pushMessage");
      //接口发送信息,不知道发什么参数
      var params = {
        body: {
          orderId: this.OrderId,
          msgType: text.indexOf("png") > -1 || text.indexOf("jpg") > -1 ? 2 : 0,
          msgContent: text
        }
      };
      this.$api.saveMsg(params).then(res => {
        console.log(res);
        var result =  res.data ;
        if (result.code == 0) {
          clearTimeout(message.timeoutId);
          message.status = "";
          this.messages = [...this.messages]
        }
        //业务逻辑写在此处
        //记得判断成功的状态码
      });
      this.inputText = "";
      this.scrollView();
    },
    //用户自己发自己信息
    sendSelf() {
      this.connection.sendIQ(
        $iq({
          to: "cluster.openfire",
          from: this.uid,
          type: "get"
        }).c("ping", {
          xmlns: "urn:xmpp:ping"
        })
      );
    },
    // api获取
    //登录用户信息
    getUserAccountInfo() {
      return new Promise((resolve, reject) => {
        var params = {};
        params.body = {
          orderId: this.OrderId
        };
        this.$api.getAccountInfoByOrderId(params).then(res => {
          if (res.data.code == 0) {
            if (res.data.data) {
              this.userInfo = res.data.data;
              this.PortalId = res.data.data.userId;
            }
          }
          resolve();
        });
      });
    },
    //获取医生名片
    getDoctorNameCard() {
      var doctorId = this.orderStateObj.famousDoctorId
        ? this.orderStateObj.famousDoctorId
        : this.orderStateObj.DoctorId;
      var params = {};
      params.body = {
        doctorId: doctorId
      };
      this.$api
        .getNameCard(params)
        .then(res => {
          var result = res.data;
          if (result.code == 0) {
            console.log(result);
            var resObj = result.data;
            this.nameCard = resObj;
          }
        })
        .catch(err => {
          this.$toast(err.message);
        });
    },
    // 获取问诊订单
    getVisitOrderState(orderid) {
      return new Promise((resolve, reject) => {
        var params = {};
        params.body = {};
        this.$api.getVisitOrderState(params, orderid).then(res => {
          var result = res.data;
          if (result.code == 0) {
            var resObj = result.data;
            this.orderStateObj.DoctorId = resObj.doctorId;
            this.orderStateObj.famousDoctorId = resObj.famousDoctorId;
            this.startTime =  (new Date(resObj.serviceTime)).format("MM月dd日 hh:mm");
            if (resObj.orderState != 13) {
              // 接收方医生信息配置
              this.toUser._id = resObj.doctorId;
              this.toUser.fromid =
                "employee_" + resObj.doctorId + "@cluster.openfire/yyy_d";
              this.toUser.username = resObj.doctorName;
              this.toUser.pic = resObj.doctorImageUrl || doctorPng;
            }
            if (resObj.orderState == 7) {
              this.orderStatus = true;
            }
            if (resObj.rxAuditState == 1) {
              this.prescription = true;
            }
            //订单关闭
            if (resObj.orderState == 200 || resObj.orderState == 300) {
              this.showInputFlag = false;
            }
          }
          resolve();
        });
      });
    },
    // 获取病人信息
    getVisitPatient(orderid) {
      return new Promise((resolve, reject) => {
        var params = {};
        params.body = {};
        this.$api.getVisitPatient(params, orderid).then(res => {
          var res = res.data;
          if (res.code == 0) {
            this.patientObj = res.data;
            console.log(this.patientObj);
          } else {
            this.showAlert(res.reason);
          }
          resolve();
        });
      });
    },

    //通过接口获取离线聊天记录
    getOfflineChatlog() {
      var params = {
        body: {
          orderId: this.OrderId
        }
      };
      this.$api
        .queryMsgByOrderId(params)
        .then(res => {
          var result = res.data;
          if (result.code == 0) {
            for (let value of result.data) {
              let message = {
                time: value.createTime,
                type: value.msgType == 0 ? "mes_text" : "mes_picture",
                from: "user",
                text: value.msgContent
              };
              this.apiMessage.push(message);
            }
            console.log(this.apiMessage);
          }

          return this.getLocalChatLog(this.OrderId);
        })
        .then(res => {
          this.connectOpenfire(); //内含在线聊天记录
        });
    },

    showAlert(reason) {
      this.$toast(reason);
    },
    inquiryAddtion() {
      console.log(this.patientObj.patientGender);
      var inquiry;
      if (this.patientObj.patientGender == "男") {
        inquiry = [
          {
            doctor: "是否在线下医院确诊了疾病，是什么疾病？",
            user: [
              this.patientObj.diagnose,
              "医生您好，我要开" + this.patientObj.drugs
            ]
          },
          {
            doctor: "目前哪里不舒服？",
            user: [this.patientObj.healthInfo]
          },
          {
            doctor: "患病多长时间了？",
            user: [this.patientObj.sickTime]
          },
          {
            doctor: "请问有没有既往病史？",
            user: [this.patientObj.anamnesis]
          },
          {
            doctor: "请问有没有过敏史？",
            user: [this.patientObj.allergy]
          },
          {
            doctor: "请问有没有家族史？",
            user: [this.patientObj.familyGen]
          },
          {
            doctor: "上次用药是否出现过异常反应？",
            user: "否"
          },
          {
            doctor: "是否肝肾功能不正常？",
            user: "否"
          }
        ];
      } else {
        inquiry = [
          {
            doctor: "是否在线下医院确诊了疾病，是什么疾病？",
            user: [
              this.patientObj.diagnose,
              "医生您好，我要开" + this.patientObj.drugs
            ]
          },
          {
            doctor: "目前哪里不舒服？",
            user: [this.patientObj.healthInfo]
          },
          {
            doctor: "患病多长时间了？",
            user: [this.patientObj.sickTime]
          },
          {
            doctor: "请问有没有既往病史？",
            user: [this.patientObj.anamnesis]
          },
          {
            doctor: "请问有没有过敏史？",
            user: [this.patientObj.allergy]
          },
          {
            doctor: "请问有没有家族史？",
            user: [this.patientObj.familyGen]
          },
          {
            doctor: "上次用药是否出现过异常反应？",
            user: "否"
          },
          {
            doctor: "当前是否怀孕或者哺乳期？",
            user: "否"
          },
          {
            doctor: "是否肝肾功能不正常？",
            user: "否"
          }
        ];
      }

      inquiry.map(item => {
        this.messages.push({
          time: new Date().getTime(),
          type: "mes_text",
          from: "doctor",
          text: item.doctor
        });
        for (let i of item.user) {
          if (!i) break;
          this.messages.push({
            time: new Date().getTime(),
            type: "mes_text",
            from: "user",
            text: i
          });
        }
      });
      // this.messages.push({
      // })
    },

    //格式化时间
    formatDuring: function(mss) {
      var hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = parseInt((mss % (1000 * 60)) / 1000);
      if (hours == 0) {
        hours = "0" + hours;
      }
      if (minutes < 10) {
        minutes = "0" + minutes;
      }
      if (seconds < 10) {
        seconds = "0" + seconds;
      }
      return {
        time: mss,
        hour: hours,
        min: minutes,
        second: seconds
      };
    },
    //获取随机数
    RndNum(n) {
      var rnd = "";
      for (var i = 0; i < n; i++) {
        rnd += Math.floor(Math.random() * 10);
      }
      return rnd;
    }
  },
  mounted() {
    // this.test();
    // this.startTime = new Date().format("MM月dd日 hh:mm");
    this.scrollView();
    var uc = window.location.search;
    uc = decodeURIComponent(uc);
    if (uc.indexOf("?token") != -1) {
      var tmpUcObj = uc.split("&");
      var token = tmpUcObj[0].substring(tmpUcObj[0].indexOf("?token=") + 7);
      var orderid = (this.OrderId = tmpUcObj[1].substring(
        tmpUcObj[1].indexOf("&OrderId=") + 9
      ));
      if (tmpUcObj[2]) {
        var inquiryType = tmpUcObj[2].split("=")[1];
        this.inquiryType = inquiryType;
      }

      this.OrderId = orderid;
      localStorage.setItem("token", token);
      localStorage.setItem("authorization", token);
      //获取登录状态(用户信息 病人信息 )->订单信息(参数依赖用户信息PortalId)
      //-> 查看本地聊天记录 -> 链接openfire -> 查看在线聊天记录
      Promise.all([
        this.getUserAccountInfo(),
        this.getVisitPatient(orderid),
        this.getVisitOrderState(orderid)
      ]).then(res => {
        if (inquiryType == 9) {
          this.inquiryAddtion();
        }
        this.getDoctorNameCard();
        this.user._id = this.PortalId;
        this.user.pic = this.userInfo.imageUrl
          ? this.userInfo.imageUrl
          : userPng;
        this.user.username = this.userInfo.personName;
        this.user.jid = this.uid;
        //获取api接口
        this.getOfflineChatlog();
      });
    }
  }
};

Date.prototype.format = function(fmt) {
  var o = {
    "Y+": this.getYear(), //年份
    "y+": this.getYear(), //年份
    "M+": this.getMonth() + 1, //月份
    "m+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "H+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    S: this.getMilliseconds() //毫秒
  };

  if (/(y+)/.test(fmt))
    fmt = fmt.replace(
      RegExp.$1,
      (this.getFullYear() + "").substr(4 - RegExp.$1.length)
    );

  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      );

  return fmt;
};
</script>

  
<style lang="less">
.van-notice-bar {
  background-color: #fff7ec;
  color: #ffaf41;
  height: 80px;
}

.van-image-preview {
  img {
    height: auto;
  }
}

body,
html,
#app {
  height: 100%;
}
</style><style lang="less" scoped>
.content {
  display: flex;
  flex-direction: column;
  height: 100%;

  .chat {
    flex: 1;
    overflow: auto;
    height: 1244px;
    padding: 0 22px;
    font-size: 28px;

    .protocol {
      width: 616px;
      height: 148px;
      line-height: 40px;
      background-color: #ffffff;
      border-radius: 10px;
      padding: 26px 22px;
      text-indent: 50px;
      margin-left: 25px;
      color: #333;

      u {
        color: #0066ff;
      }
    }

    .startTime {
      font-size: 24px;
      color: #666;
      margin: 0 auto;
    }

    .statusImg {
      width: 36px;
      align-self: center;
      margin: 0 16px;
    }

    > div {
      display: flex;
      flex-direction: row;
      margin: 16px 0 36px;
    }

    .pressConten {
      display: flex;
      flex-direction: row;
      width: 492px;
      height: 92px;
      margin-left: 16px;
      background-color: #ffffff;
      padding: 20px;
      border-radius: 0px 16px 16px 16px;
      font-size: 24px;
      color: #aeafb2;

      .pressImg {
        width: 72px;
        height: 72px;
        margin-right: 20px;
      }

      .pressTitle {
        font-size: 28px;
        color: #333;
        margin-bottom: 11px;
        margin-top: 6px;
      }
    }

    .time {
      font-size: 24px;
      color: #666;
    }

    .system {
      padding: 22px;
      background-color: #cecece;
      border-radius: 16px;
      font-size: 28px;
      line-height: 40px;
      color: #fff;
      text-align: center;
    }

    .card {
      display: flex;
      width: 460px;
      background-color: #fff;
      border-radius: 16px;
      flex-direction: row;
      padding: 32px 0 32px 40px;
      position: relative;

      .doctorImg {
        width: 72px;
        height: 72px;
        border-radius: 50%;
        margin-right: 15px;
      }

      .doctorName {
        font-size: 32px;
        color: #333;
      }

      .doctorRank {
        margin: 16px 0;
        font-size: 24px;
        color: #666;
      }

      .doctorHospital {
        font-size: 24px;
        color: #666;
      }

      .badge {
        width: 100px;
        height: 39px;
        background-color: rgba(58, 199, 86, 0.1);
        font-size: 20px;
        line-height: 39px;
        color: #3ac756;
        text-align: center;
        position: absolute;
        right: 0;
        padding-left: 12px;
        border-top-left-radius: 16px;
        border-bottom-left-radius: 16px;
      }
    }

    .doctorMessage {
      max-width: 512px;
      background-color: #ffffff;
      border-radius: 0px 16px 16px 16px;
      padding: 24px 20px;
      box-sizing: border-box;
      font-size: 28px;
      color: #333;
      margin-left: 16px;

      .chatImg {
        width: 200px;
        height: 240px;
      }
    }

    .adviceMessage {
      width: 512px;
    }

    .productRecommend {
      width: 520px;
      height: 180px;
      font-size: 28px;
      display: flex;
      flex-direction: row;
      margin-left: 13px;
      background-color: #ffffff;
      border-radius: 0px 16px 16px 16px;
    }

    .productDetails,
    .productImg {
      justify-content: center;
      align-content: center;
    }

    .productImg {
      width: 140px;
      height: 140px;
      margin: 20px;
    }

    .productDetails {
      width: 326px;
      line-height: 40px;
      margin-top: 8px;
    }

    .productTag {
      display: inline-block;
      font-size: 20px;
      margin-top: 14px;
      box-sizing: border-box;

      span {
        color: #3ac756;
        border-radius: 4px;
        line-height: 28px;
        margin: 6px 5px;
        border: solid 1px #3ac756;
        padding: 5px 5px 3px 6px;
      }
    }

    .userMessage {
      max-width: 512px;
      background-color: #8cf26d;
      border-radius: 16px 0px 16px 16px;
      padding: 24px 20px;
      box-sizing: border-box;
      font-size: 28px;
      color: #333;
      margin-right: 16px;

      .chatImg {
        width: 200px;
        height: 240px;
      }
    }

    .adviceContent {
      color: #aeafb2;
      margin-top: 20px;
      line-height: 42px;
      margin-left: 5px;
    }

    .evaluate {
      width: 690px;
      height: 409px;
      background-color: #ffffff;
      border-radius: 16px;
      text-align: center;
      margin-bottom: 20px;
      padding-bottom: 40px;

      .evaluateTitle {
        font-size: 28px;
        font-weight: bold;
        padding-top: 39px;
      }

      .evaluateBox {
        margin-top: 32px;

        div {
          display: inline-block;
        }

        .emojiBox {
          position: relative;
          margin-right: 46px;
        }

        .emojiBox:first-child {
          margin-left: 75px;
        }

        .good,
        .medium,
        .bad {
          width: 97px;
          height: 64px;
          line-height: 64px;
          border-radius: 32px;
          padding-left: 53px;
          background-color: #f6f8fa;
          font-size: 28px;
          //   background-color: pink;
        }

        .imgBox {
          width: 70px;
          height: 64px;
          position: absolute;
          left: -3px;
          top: 0;
        }

        img {
          width: 100%;
          height: 100%;
        }
      }

      .evaluateActived {
        background-color: rgba(255, 110, 38, 0.1) !important;
        color: #ff6e26 !important;
      }

      .evaluateContent {
        margin: 32px 60px 0 70px;

        .evaluateTips {
          display: inline-block;
          background-color: #f6f8fa;
          border-radius: 24px;
          font-size: 24px;
          color: #aeafb2;
          margin: 0 5px 28px 0;
          padding: 12px 20px;
        }
      }

      .submitBtn {
        width: 160px;
        height: 56px;
        margin: 0 275px 40px;
        line-height: 56px;
        color: #fff;
        background-image: linear-gradient(90deg, #73e539 0%, #3ac756 100%),
          linear-gradient(#3ac756, #3ac756);
        background-blend-mode: normal, normal;
        border-radius: 28px;
      }
    }
  }
}

.input {
  display: flex;
  width: 100%;
  position: fixed;
  bottom: 0;
  background-color: #f2f2f2;
  flex-direction: column;

  .inputContent {
    height: 96px;
    width: 100%;
    display: flex;
    padding: 16px 12px;
    box-sizing: border-box;

    input {
      flex: 1;
      margin-right: 10px;
      border-radius: 10px;
      padding: 0 20px;
    }

    .showMore {
      width: 54px;
      height: 54px;
      margin: 10px;
    }

    .sendBtn {
      width: 112px;
      height: 56px;
      background-color: #aeafb2;
      line-height: 56px;
      border-radius: 8px;
      text-align: center;
      color: #fff;
      font-size: 28px;
      margin-top: 6px;
    }

    .haveText {
      background-color: #3ac756;
    }
  }

  .inputMenu {
    height: 160px;

    .inpImg {
      display: inline-block;
      width: 120px;
      height: 120px;
      margin: 16px;
    }
  }
}

// 协议弹框样式
.content .van-action-sheet {
  max-height: 75%;
  color: #323233;
}

.content .van-action-sheet__header {
  font-size: 32px;
  font-weight: bold;
  color: #333333;
}

.content .van-action-sheet__content .sheet_con {
  height: 65.367vh;
  text-align: justify;
  padding: 20px 30px;
  font-size: 28px;
  line-height: 36px;
  color: #666666;
  overflow-x: hidden;
  overflow-y: scroll;
}

.sheet_con::-webkit-scrollbar {
  display: none;
}

.content .van-action-sheet__content .sheet_con p {
  padding: 8px 0;
}

.content .van-action-sheet__content .sheet_con p.sheet_con_msg {
  padding: 20px 0;
}

.content .van-action-sheet__content .van-button {
  height: 72px;
  line-height: 72px;
}

.content .van-action-sheet__content .van-button--info {
  margin: 20px 0;
  background-color: unset;
  border: unset;
  background-image: linear-gradient(
      90deg,
      #73e539 0%,
      #57d648 50%,
      #3ac756 100%
    ),
    linear-gradient(#000000, #000000);
}
</style>
