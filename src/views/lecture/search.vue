<template>
  <div>
    <header>
      <form action="/">
        <van-search
          v-model="searchVal"
          placeholder="输入关键字搜索文章或视频"
          show-action
          @search="onSearch(searchVal)"
          @cancel="goToLectureIndex"
        />
      </form>
    </header>
    <div v-if="nodataFlag">
      <no-data-view scene="noData"></no-data-view>
    </div>
    <div v-else>
      <div v-if="haveHistory" class="historyBox">
        <div class="clearfix">
          <span class="searchHistory fl">搜索历史</span>
          <i class="fr searchDel" @click="delHistory">
            <img src="../../assets/img/lecture/del_history_btn.png" />
          </i>
        </div>
        <div
          class="historyTips fl"
          v-for="(history, index) in historyArr"
          :key="index"
          @click="onSearch(history)"
        >{{history}}</div>
      </div>
      <div v-if="!haveHistory && searchFinishFlag" class="mt46">
        <van-list
          v-model="loading"
          :finished="finished"
          @load="onLoadContent"
          :immediate-check="false"
          finished-text="没有更多了"
        >
          <div v-for="(item, index) in contentObj" :key="index" class="videoContainer">
            <div v-if="item.type=='Video'" class="videoBox" @click="goToVideoDetails(item)">
              <div class="videoContent clearfix">
                <div class="videoImg">
                  <img :src="item.imgUrl" />
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
                    <span>观看&nbsp;{{item.viewNum}}</span>&nbsp;&nbsp;
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
                      <span>浏览&nbsp;{{item.viewNum}}</span>&nbsp;&nbsp;
                      <span>点赞&nbsp;{{item.praise}}</span>
                    </div>
                  </div>
                </div>
                <div class="fr">
                  <div class="articleImg">
                    <img :src="item.imgUrl" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </van-list>
      </div>
    </div>
  </div>
</template>

<script>
import NoDataView from "../components/noData";
export default {
  components: {
    NoDataView
  },
  data() {
    return {
      nodataFlag: false, //是否无数据 默认有数据
      searchVal: "",
      haveHistory: true, //false没有历史记录
      historyArr: [], //历史记录的列表
      contentObj: [], //内容的对象
      searchFinishFlag: true, //搜索完成true 显示
      loading: false, //控制上拉加载的加载动画
      finished: false, //控制在页面往下移动到底部时是否调用接口获取数据
      pageNumber: 1 //默认取第一页
    };
  },
  watch: {
    searchVal(n, o) {
      if (!n) {
        this.haveHistory = true;
      } else {
        this.haveHistory = false;
        this.pageNumber = 1;
        this.contentObj = [];
      }
    }
  },
  methods: {
    onSearch(searchVal, type) {
      //   this.haveHistory = false;
      if (searchVal) {
        this.searchVal = searchVal;
        if (this.historyArr.indexOf(this.searchVal) == -1) {
          this.historyArr.unshift(searchVal);
          localStorage.setItem("historyArr", JSON.stringify(this.historyArr));
        }
        // 获取到数据searchFinishFlag为true
        var params = {};
        var body = {
          title: searchVal,
          pageNum: this.pageNumber,
          pageSize: 10
        };
        params.body = body;
        this.$api.searchByTitle(params).then(res => {
          var result = res.data;
          this.loading = false;
          if (result.code == 0) {
            var data = result.data;
            if (data.records.length > 0) {
              var contentObj = data.records;
              this.nodataFlag = false;
              this.contentObj = this.contentObj.concat(contentObj);
              if (this.contentObj.length == data.total) {
                this.finished = true;
              }
              if (data.total < 3) {
                this.finished = true;
                this.loading = false;
              }
            } else {
              this.finished = true;
              // 调用无数据
              if (type != "load") {
                this.nodataFlag = true;
              }
            }
          } else {
            // 调用app的错误提示
            // 调用app的错误提示
            this.$global.showToast(result.message);
          }
        });
      }
    },
    onLoadContent() {
      this.pageNumber++;
      this.onSearch(this.searchVal, "load");
    },
    goToLectureIndex() {
      // this.$router.push("lectureIndex");
      //调用app 的关闭
      JsBridge.callMethod("JsInvokeNativeMethod", "finishPage", function(
        data
      ) {});
    },
    goToVideoDetails(videoObj) {
      this.$router.push({
        name: "videoDetails",
        params: { videoObj: videoObj, keyVal: this.searchVal }
      });
    },
    goToArticleDetails(article) {
      if (article.source == "zaker") {
        var sourceUrl = article.sourceUrl;
        JsBridge.callMethod(
          "JsInvokeNativeMethod",
          "startPage",
          // { url: this.url + "/articleDetails?type=app&&callObj=" + articleStr },
          { url: sourceUrl, title: "健康资讯" },
          function(data) {}
        );
      } else {
        this.$router.push({
          name: "articleDetails",
          params: { articleObj: article, keyVal: this.searchVal }
        });
      }
    },
    //删除历史搜索
    delHistory() {
      this.historyArr = [];
      localStorage.setItem("historyArr", []);
      //调用删除接口
    }
  },
  mounted() {
    var historyArr = localStorage.getItem("historyArr")
      ? JSON.parse(localStorage.getItem("historyArr"))
      : [];
    if (historyArr.length > 0) {
      this.historyArr = historyArr;
    }
  },
  beforeCreate () {
    document.querySelector('body').setAttribute('style', 'background:#fff')
  },
};
</script>
<style>
/* html,
body {
  background-color: #fff;
} */
.van-search__action {
  color: #3ac756;
}
.van-search__content {
  border-radius: 32px;
}
</style>

<style scoped>
.mt46 {
  margin-top: 92px;
}
header {
  position: fixed;
  top: 0;
  width: 750px;
  z-index: 999;
}
.historyBox {
  margin: 144px 30px 0;
}
.searchHistory {
  font-size: 28px;
}
.searchDel {
  display: inline-block;
  width: 32px;
  height: 32px;
  vertical-align: middle;
}
.historyTips {
  font-size: 24px;
  background-color: #f5f6f7;
  border-radius: 28px;
  padding: 17px 35px;
  margin: 20px 20px 20px 0;
}
.videoBox,
.articleBox {
  background-color: #fff;
  position: relative;
}
.videoBox {
  background-color: #fff;
  position: relative;
  width: 750px;
}
.videoBox > .videoContent {
  position: relative;
  border-bottom: 1px solid #ebebeb;
  margin: 0 30px;
  padding-bottom: 15px;
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
  top: -40px;
  left: 2px;
}
.videoTitle,
.videoLength {
  color: #ffffff;
  font-size: 32px;
  position: absolute;
}
.videoTitle {
  top: 61px;
  left: 50px;
  font-weight: 600;
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
  /* margin-bottom: 15px; */
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
.articleBox .articleImg {
  width: 200px;
  height: 150px;
  border-radius: 12px;
}
.articleImg img {
  width: 100%;
  height: 100%;
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