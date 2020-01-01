<template>
  <div>
    <header>
      <div class="searchBox clearfix" @click="goToSearch">
        <div class="headerImg">
          <img src="../../assets/img/lecture/search.png" />
        </div>
        <span>输入关键字搜索文章或视频</span>
      </div>
      <!-- <van-search placeholder="输入关键字搜索文章或视频" v-model="searchVal" @click="goToSearch" /> -->
    </header>
    <section style="margin-top:52px">
      <van-tabs
        @click="changeTab"
        line-width="14"
        line-height="4"
        class="lectureIndex"
        title-inactive-color="#333333"
      >
        <van-tab
          v-for="(item,index) in classifyObj"
          :key="index"
          :title="item.name"
          :name="item.id"
        >
          <div v-if="nodataFlag">
            <no-data-view scene="noData"></no-data-view>
          </div>

          <van-list
            v-model="loading"
            :finished="finished"
            @load="onLoadContent(item.id)"
            :immediate-check="false"
            finished-text="没有更多了"
            v-else
          >
            <div v-for="(item, index) in contentObj" :key="index" class="videoContainer">
              <!-- 视频列表 -->
              <div v-if="item.type=='Video'" class="videoBox" @click="goToVideoDetails(item)">
                <div class="videoContent clearfix">
                  <div class="videoImg">
                    <img :src="item.imgUrl" style="border-radius: 6px;" />
                  </div>
                  <div class="playBtn">
                    <img src="../../assets/img/lecture/play_btn.png" />
                  </div>
                  <div class="videoMask"></div>
                  <div class="videoTitle">{{item.title}}</div>
                  <div class="videoLength">{{item.videoLength}}</div>
                  <div class="videoDetails clearfix">
                    <div class="fl">{{item.source}}</div>
                    <!-- <div class="praiseAndView fr">
<span>观看&nbsp;{{item. viewNum}}</span>&nbsp;&nbsp;
<span>点赞&nbsp;{{item.praise}}</span>
                    </div>-->
                  </div>
                </div>
              </div>
              <div
                v-if="item.type=='Article'"
                class="articleBox clearfix"
                @click="goToArticleDetails(item)"
              >
                <div class="articleContent clearfix">
                  <div class="fl articleDetails">
                    <div class="articleTitle">{{item.title}}</div>
                    <div class="articlePraiseAndViewBox clearfix">
                      <!-- <div class="fl">{{item.source}}</div> -->
                      <div class="fr articlePraiseAndView">
                        <span>浏览&nbsp;{{item. viewNum}}</span>&nbsp;&nbsp;
                        <span>点赞&nbsp;{{item.praise}}</span>
                      </div>
                    </div>
                  </div>
                  <div class="fr">
                    <div class="articleImg">
                      <img :src="item.imgUrl" style="border-radius: 6px;" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </van-list>
        </van-tab>
      </van-tabs>
    </section>
  </div>
</template>

<script>
import { Tab, Tabs } from "vant";
import NoDataView from "../components/noData";
export default {
  components: {
    "van-tab": Tab,
    "van-tabs": Tabs,
    NoDataView
  },
  data() {
    return {
      nodataFlag: false, //是否无数据 默认有数据
      searchVal: "", //搜索关键字
      classifyObj: [], //大讲堂的分类对象
      contentObj: [], //内容的数组
      url: this.$global.Url, //测试url
      loading: false, //控制上拉加载的加载动画
      finished: false, //控制在页面往下移动到底部时是否调用接口获取数据
      pageNumber: 1 //默认取第一页
    };
  },
  methods: {
    changeTab(name, title) {
      //切换标签时 跳回页面顶部
      window.scroll(0, 0);
      this.loading = false;
      this.finished = false;
      //默认是推荐
      name = name ? name : "recommend";
      this.contentObj = [];
      var params = {};
      var body = {
        categoryId: name,
        pageSize: 10,
        pageNumber: 1
      };
      params.body = body;
      this.$api.getCategoryContent(params).then(res => {
        var result = res.data;
        if (result.code == 0) {
          var data = result.data;
          if (data.records.length > 0) {
            this.contentObj = data.records;
            this.nodataFlag = false;
            if (this.contentObj.length == data.total) {
              this.finished = true;
              this.loading = false;
            }
          } else {
            this.nodataFlag = true;
          }
        } else {
          // 调用app的错误提示
          this.$global.showToast(result.message);
        }
      });
    },
    goToSearch() {
      //调用app的进入接口
      JsBridge.callMethod(
        "JsInvokeNativeMethod",
        "startPage",
        { url: this.url + "/lectureSearch" },
        function(data) {}
      );
      // this.$router.push("lectureSearch");
    },
    // 上拉加载
    onLoadContent(categoryId) {
      this.pageNumber++;
      setTimeout(() => {
        var params = {};
        var body = {
          categoryId: categoryId,
          pageSize: 10,
          pageNumber: this.pageNumber
        };
        params.body = body;
        this.$api.getCategoryContent(params).then(res => {
          var result = res.data;
          if (result.code == 0) {
            var data = result.data;
            if (data.records.length > 0) {
              this.loading = false;
              var contentObj = data.records;
              this.contentObj = this.contentObj.concat(contentObj);
              if (this.contentObj.length == data.total) {
                this.finished = true;
                this.loading = false;
              }
            }else if(data.records == 0){
               this.finished = true;
                this.loading = false;
            }
          } else {
            // 调用app的错误提示
            this.$global.showToast(result.message);
          }
        });
      }, 500);
    },
    goToVideoDetails(video) {
      var title = video.title;
      var sourceUrl = video.sourceUrl;
      var videoStr = JSON.stringify(video);
      JsBridge.callMethod(
        "JsInvokeNativeMethod",
        "startPage",
        {
          url: sourceUrl, title: title 
        },
        function(data) {}
      );
      // this.$router.push({ name: "videoDetails", parans: { video: video } });
    },
    goToArticleDetails(article) {
      // var articleStr = JSON.stringify(article);
      var articleId = article.id;
      var articleType = article.source;
      var sourceUrl = "";
      var relationId = "";
      if (articleType == "zaker") {
        sourceUrl = article.sourceUrl;
        JsBridge.callMethod(
          "JsInvokeNativeMethod",
          "startPage",
          // { url: this.url + "/articleDetails?type=app&&callObj=" + articleStr },
          { url: sourceUrl, title: "健康资讯" },
          function(data) {}
        );
      } else {
        relationId = article.relationId;
        JsBridge.callMethod(
          "JsInvokeNativeMethod",
          "startPage",
          // { url: this.url + "/articleDetails?type=app&&callObj=" + articleStr },
          {
            url:
              this.url +
              "/articleDetails?type=app&articleId=" +
              articleId +
              "&articleType=" +
              articleType +
              "&sourceUrl=" +
              sourceUrl +
              "&relationId=" +
              relationId
          },
          function(data) {}
        );
      }
    },
    getChanelList() {
      var params = {};
      this.$api.getCategoryList(params).then(res => {
        let data = res.data;
        if (data.code == 0) {
          if (data.data) {
            this.nodataFlag = false;
            var result = data.data;
            this.classifyObj = result;
          } else {
            this.nodataFlag = true;
          }
        } else {
          // 调用app的错误提示
          this.$global.showToast(data.message);
        }
      });
    }
    // this.$router.push({ name: "videoDetails", parans: { article: article } });
  },
  mounted() {
    //获取频道列表
    this.getChanelList();
    //默认查询推荐的页面
    this.changeTab();
    var uc = window.location.search;
    if (uc.indexOf("token=") != -1) {
      var tmpUc = uc.substring(uc.indexOf("token="));
      var tmpUcArr = tmpUc.split("&");
      var token = tmpUcArr[0].substring(tmpUcArr[0].indexOf("token=") + 6);
      var userId = tmpUcArr[1].substring(tmpUcArr[1].indexOf("userId=") + 7);
      console.log(userId);
      var userArr = [token, userId];
      this.$store.commit("setLoginData", userArr);
    }
  }
};
</script>

<style>
header {
  position: fixed;
  top: 0;
  width: 750px;
  z-index: 999;
}
.lectureIndex .van-tabs__line {
  background-color: #3ac756;
  bottom: 43px;
}
.lectureIndex .van-search__content {
  border-radius: 32px;
}
.lectureIndex .van-tab--active {
  font-size: 32px;
  font-weight: 600;
}
.van-tabs {
  flex-basis: 0 !important;
}
.lectureIndex .van-tabs__wrap--scrollable .van-tab {
  flex: 0 0 14%;
}
.van-tabs--line .van-tabs__wrap {
  position: fixed;
  width: 750px;
  top: 104px;
  z-index: 900;
}
.lectureIndex .van-tabs__content {
  margin-top: 190px;
}
</style>
<style scoped>
header {
  height: 104px;
  background-color: #fff;
}
.searchBox {
  width: 690px;
  height: 64px;
  /* line-height: 30px; */
  background-color: #f5f7fa;
  border-radius: 32px;
  margin: 20px 30px;
  font-size: 28px;
  color: #a8a8a8;
  position: relative;
}
.searchBox span {
  display: inline-block;
  height: 64px;
  line-height: 64px;
  margin-left: 64px;
}
.headerImg {
  width: 24px;
  height: 24px;
  position: absolute;
  left: 20px;
  top: 15px;
}
.videoBox,
.articleBox {
  background-color: #fff;
  position: relative;
}
.videoBox {
  width: 750px;
}
.videoBox > .videoContent {
  position: relative;
  border-bottom: 1px solid #ebebeb;
  margin: 0 30px;
  padding-bottom: 15px;
  overflow: hidden;
}
.videoContainer:last-child .videoBox > .videoContent:last-child,.articleBox  {
  border-bottom: none;
}
.articleBox {
  padding: 0 15px;
}
.videoImg,
.videoMask {
  width: 690px;
  height: 388px;
  border-radius: 12px;
  margin: 40px 0 24px 0;
}
.videoMask {
  opacity: 0.3;
  background-color: #000000;
  position: absolute;
  top: 0;
}
/* .videoImg img {
border-radius: 12px;
} */
.videoTitle,
.videoLength {
  color: #ffffff;
  font-size: 32px;
  position: absolute;
}
.videoTitle {
  top: 61px;
  left: 30px;
  line-height: 44px;
  font-weight: 600;
  margin-right: 50px;
}
.videoLength {
  right: 20px;
  bottom: 80px;
  font-size: 24px;
}
.videoDetails {
  color: #333;
  font-size: 24px;
}
.praiseAndView {
  color: #a8a8a8;
}
.playBtn {
  width: 96px;
  position: absolute;
  top: 186px;
  left: 297px;
  opacity: 0.7;
  /* z-index: 50 !important; */
}
.articleDetails,
.articlePraiseAndViewBox {
  width: 440px;
}
.articleContent {
  position: relative;
  padding: 30px 0;
  margin: 0 15px;
  border-bottom: 1px solid #ebebeb;
}
.articleTitle {
  font-size: 28px;
  font-weight: 600;
  line-height: 40px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.articleImg {
  width: 200px;
  height: 150px;
}
.articlePraiseAndViewBox {
  position: absolute;
  bottom: 30px;
  font-size: 24px;
}
.articlePraiseAndView {
  color: #a8a8a8;
}
</style>

