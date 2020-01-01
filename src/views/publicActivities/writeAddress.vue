<template>
  <div class="submit_address_box">
    <div class="head_title">
        <van-nav-bar
            title="选择居住区域"
            left-text=""
            :right-text="rightText"
            :fixed="true"
            left-arrow
            @click-left="onClickLeft"
            @click-right="onClickRight"
        />
        <div style="width:100%; height:46px;"></div>
    </div>

    <!-- 内容 -->
    <!-- 选择区/县 -->
    <div class="address_msg">已选择：宁夏省 银川市 <span v-for="item in checklist" :key="item"> {{item}}</span></div>
    <div v-if="!showTown && !showCommunity">
      <div class="address_box">
        <van-cell v-for="(list, index) in addressdata" :key="index" :title="list.FName" is-link @click="clickTown(list.FNumber,list.FName)" />
      </div>
    </div>
    <!-- 选择镇/乡/农场 -->
    <div v-if="showTown">
      <div class="address_box">
        <van-cell v-for="(list, index) in addressTown" :key="index" :title="list.FName" is-link @click="clickCommunity(list.FNumber,list.FName)" />
      </div>
    </div>
    <!-- 选择社区 -->
    <!-- <div class="choice" v-if="showCommunity">
      <checklist :title="title" label-position="left"  :options="addressCommunity" v-model="checkCommunity" @on-change="change" :max="1"></checklist>
    </div> -->
    <div class="choice" v-if="showCommunity">
      <van-radio-group v-model="checkCommunity">
        <van-cell-group>
          <van-cell v-for="(list, index) in addressCommunity" :key="index" :title="list" clickable @click="checkCommunity = list">
            <van-radio slot="right-icon" :name="list"/>
          </van-cell>
        </van-cell-group>
      </van-radio-group>
    </div>    
  </div>
</template>

<script>
import {mapState,mapActions} from 'vuex';
// import addressTown from '/static/data/addressTown.json';
import axios from 'axios';

export default {
  components: {

  },
  data () {
    return {
      //保存上一页的信息
      pageInfo: {},
      // 选择town
      showTown: false,      //是否显示镇/乡/农场
      showCommunity: false, //是否显示社区
      addressdata: [],      //地址信息
      title: '',
      addressTown: [],      //镇/乡/农场信息列表
      townNum: '',          //选中的乡镇编号
      addressCommunity: [], //社区信息列表
      checkCommunity: [],   //选中的社区
      checklist: [],        //将选中信息存入数组
      townList: [],         //保存返回的社区信息列表（社区名称，社区code ）
      rightText: '',    //右上角保存按钮
      jsonData: [],
    }
  },
   // 状态管理
  computed: mapState({ // mapState相当于映射
    time_stamp: state => state.header.time_stamp,   //当前时间
    token: state => state.userInfo.token,           //token值
  }),
  mounted (){
    var that = this;
    //保存上一页的信息
    if(this.$route.query){
      this.pageInfo = this.$route.query
    }

    axios.get("/nfysH5/static/data/addressTown.json", {}).then(function (response) {
      if(response.data){
        that.jsonData = response.data.list;
        for(var i in that.jsonData){
          if(that.jsonData[i].FAreaNumber == 6401){
            that.addressdata.push(that.jsonData[i])
          }
        }
      }
    })
    // if(this.$route.query.type== 'wx'){
    //   // 公众号进入添加 header.token
    //   var loginData = ['kinglian', '']
    //   this.$store.commit("setLoginData", loginData); //store 保存参数header.token, userInfo.userId
    // }
  },
  methods: {
    onClickLeft(){
      if(!this.showTown && !this.showCommunity){
        if(this.$route.query.type == 'wx'){
          this.$router.push({path: '/wxActivityRegister', query: {selected: '',pageInfo: this.pageInfo,}});
        }else{
          this.$router.push({path: '/activityRegister', query: {selected: '',pageInfo: this.pageInfo,}});
        }
      }else if(this.showTown){
        this.checklist.pop();
        this.showTown = false;
      }else if(this.showCommunity){
        this.checklist.pop();
        this.addressCommunity = [];
        this.showCommunity = false;
        this.showTown = true;
      }
    },
    // 保存信息
    onClickRight() {
      this.checklist[2] = this.checkCommunity;
      var selected = this.checklist.join(' ');      //数组转字符串
      // var selected = '银川市 ' + this.checklist.join(' ');      //数组转字符串

      for (var i in this.townList) {
        if(this.townList[i].villageName == this.checkCommunity){
          var list = this.townList[i];
          this.$store.commit('setVillagesMsg',list);
        }
      }
      if(this.$route.query.type == 'wx'){
        this.$router.push({path: '/wxActivityRegister', query: {selected: selected,pageInfo: this.pageInfo,isAddress: 'isAddress'}});
      }else{
        this.$router.push({path: '/activityRegister', query: {selected: selected,pageInfo: this.pageInfo,}});
      }
    },
    //选择镇/乡/农场
    clickTown(FNumber,FName) {
      this.townNum = FNumber;
      this.showTown = true;
      for (var i in this.jsonData) {
        if(this.jsonData[i].FAreaNumber == FNumber){
          this.addressTown.push(this.jsonData[i])
        }
      }
      this.checklist.push(FName)      //将选中信息存入数组
    },
    //选择社区
    clickCommunity(FNumber,FName) {
      this.showTown = false;
      this.showCommunity = true;
      this.checklist.push(FName);     //将选中信息存入数组

      // 获取当前时间
      this.$store.commit('setTimeStamp');

      //用户信息入库接口（三师）
      var params = {};
      params.body= {
        streetCode: FNumber,    //社区编码
      }

      this.$api.postGetVillages(params)
        .then(res => {
            if(res.data.result == '0'){
              for (var i in res.data.data) {
                this.addressCommunity.push(res.data.data[i].villageName)
                this.townList.push(res.data.data[i])
              }
              this.checkCommunity.push(this.addressCommunity[0]);
              this.rightText = '保存'
            }
        })
        .catch(err => {
            console.log(err)
        })
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
/*内容*/
.address_msg {
  padding: 20px 30px;
  font-size: 28px;
  color: #333333; 
}
.submit_address_box .van-radio__icon--checked .van-icon {
    color: #fff;
    background-color: #3ac756;
    border-color: #3ac756;
}
</style>