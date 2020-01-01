<template>
  <div class="artileBox">
    <van-nav-bar
      title="健康资讯"
      :left-arrow="isShare?false:true"
      @click-left="onClickLeft"
      class="articleBar"
    />
    <div v-if="nodataFlag" class="loadingGif">
      <!-- <no-data-view scene="noData"></no-data-view> -->
      <van-loading  color="#3ac756" type="spinner" size="30px" /></van-loading>
    </div>
    <div v-else class="artileBoxS">
      <div v-if="source=='zaker'">
        <iframe
          class="articleIframe"
          :src="sourceUrl"
          frameborder="0"
          marginheight="0"
          marginwidth="0"
        ></iframe>
      </div>
      <div v-else>
        <div class="articleContainer">
          <div class="articleTitle">{{articleObj.title}}</div>
          <div class="articleSource clearfix">
            <div class="sourceLeft clearfix fl">
              <div class="doctorImg fl">
                <img
                  :src="authorObject.imgUrl?authorObject.imgUrl:'https://nfys-static.kinglian.cn/xcx/personalCenter/doctor.png'"
                  style=" border-radius: 36px;"
                />
              </div>
              <div class="sourceOrAndDate fr">
                <p class="sourceOr">{{articleObj.author}}</p>
                <p>{{articleObj.createTime}}</p>
              </div>
            </div>
            <div class="sourceRight fr clearfix" v-if="authorObject.employeeId">
              <p>{{authorObject.hospitalName}} / {{authorObject.departmentName}}</p>
              <p class="fr">{{authorObject.title}}</p>
            </div>
          </div>
          <div class="articleLine"></div>
          <div class="articleTips clearfix" v-if="authorObject.isShow == 1">
            <div class="tipsLeft fl" v-html="authorObject.followExplain"></div>
            <div class="tipsRight fr" @click="previewImg(authorObject.qrCode)">
              <img :src="authorObject.qrCode" class="codeImg" />
            </div>
          </div>
          <div class="articleContent" v-html="articleObj.content"></div>
        </div>
        <div class="borderLine" v-if="source !='zaker' && artileList.length>0"></div>
        <div class="relatedArticles" v-if="source !='zaker' && artileList.length>0">
          <div class="relatedArTitle">相关阅读</div>
          <div class="articleBox clearfix">
            <div
              v-for="(article, index) in artileList"
              :key="index"
              class="articleContentT clearfix"
              @click="refreshArticleDetails(article)"
            >
              <div class="fl articleDetails">
                <div class="relatedArticleTitle">{{article.title}}</div>
                <div class="articlePraiseAndViewBox clearfix">
                  <div class="fl">{{article.updateTime}}</div>
                  <div class="fr">
                    <span>观看&nbsp;{{article.viewNum}}</span>&nbsp;&nbsp;
                    <span>点赞&nbsp;{{article.praise}}</span>
                  </div>
                </div>
              </div>
              <div class="fr articleImg">
                <img :src="article.imgUrl" />
              </div>
            </div>
          </div>
        </div>
        <div class="spaceLine" v-if="source !='zaker' && artileList.length>0"></div>
        <footer class="clearfix" v-if="!isShare">
          <div class="footerBox">
            <div class="footerBoxImg viewImg">
              <img src="../../assets/img/lecture/view.png" />
            </div>
            <span>{{articleObj.viewNum}}</span>
          </div>
          <div class="footerBox" @click="giveALikeOrCollectOrShare('like')">
            <div class="footerBoxImg goodImg">
              <img v-if="!articleObj.isPraised" src="../../assets/img/lecture/nogood.png" />
              <img v-if="articleObj.isPraised" src="../../assets/img/lecture/good.png" />
            </div>
            <span>{{articleObj.praise}}</span>
          </div>
          <div class="footerBox" @click="giveALikeOrCollectOrShare('collect')">
            <div class="footerBoxImg collectImg">
              <img v-if="!articleObj.isCollected" src="../../assets/img/lecture/nocollect.png" />
              <img v-if="articleObj.isCollected" src="../../assets/img/lecture/collect.png" />
            </div>
            <span>{{articleObj.collect}}</span>
          </div>
          <div class="footerBox" @click="giveALikeOrCollectOrShare('share',articleObj)">
            <div class="footerBoxImg shareImg">
              <img src="../../assets/img/lecture/share.png" />
            </div>
            <span>分享</span>
          </div>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
import { ActionSheet } from "vant";
import { ImagePreview } from "vant";
import NoDataView from "../components/noData";
import { jumpLoginPageWithCallback } from "../mall/mall";
export default {
  components: {
    "van-action-sheet": ActionSheet,
    NoDataView
  },
  data() {
    return {
      isShare: false, //是否是分享 true 是分享
      nodataFlag: true,
      source: "", //zaker第三方
      sourceUrl: "", //
      articleObj: {
        id: "",
        titile: "",
        sourceImgUrl: "",
        scanCodeUrl: "",
        author: "",
        relationId: "",
        createTime: "",
        praise: 0,
        collect: 0,
        isPraisedd: false, //true 点赞 false 没点赞
        isCollected: false, //true 收藏 false 没收藏
        viewNum: 0 //阅读数
      },
      authorObject: {},
      shareFlag: false, //点击了分享
      noticeAppFinishFlag: false, //是否通知app关闭,true 调用app关闭
      artileList: [],
      userId: ""
    };
  },
  methods: {
    onClickLeft() {
      if (this.noticeAppFinishFlag) {
        JsBridge.callMethod("JsInvokeNativeMethod", "finishPage", function(
          data
        ) {});
      } else {
        this.$router.back(-1);
      }
    },
    giveALikeOrCollectOrShare(type) {
      if (this.userId) {
        var params = {};
        var body = {
          id: this.articleObj.id,
          praise: "",
          collect: "",
          accountId: this.userId
        };
        if (type == "like") {
          if (this.articleObj.isPraised) {
            this.articleObj.praise--;
            body.praise = "subtract";
          } else {
            this.articleObj.praise++;
            body.praise = "plus";
          }
          this.articleObj.isPraised = !this.articleObj.isPraised;
          //调用点赞接口
        } else if (type == "share") {
          var url = window.location.href;
          //调用app分享
          JsBridge.callMethod(
            "JsInvokeNativeMethod",
            "shareMsg",
            {
              shareType: "1",
              msgType: "1",
              title: "健康资讯",
              desc: this.articleObj.title,
              webPageUrl: url
            },
            function(data) {}
          );
        } else {
          if (this.articleObj.isCollected) {
            this.articleObj.collect--;
            body.collect = "subtract";
            this.$toast.fail("取消收藏成功");
          } else {
            this.articleObj.collect++;
            body.collect = "plus";
            this.$toast.success("收藏成功");
          }
          this.articleObj.isCollected = !this.articleObj.isCollected;
          //调用文章收藏
        }
        if (type != "share") {
          params.body = body;
          this.$api.giveAlikeOrCancel(params).then(res => {
            var result = res.data;
            if (result.code == 0) {
            } else {
              // 调用app的错误提示
              this.$global.showToast(result.message);
            }
          });
        }
      } else {
        jumpLoginPageWithCallback(data => {
          let datas = JSON.parse(JSON.stringify(data));
          console;
          this.userId = datas.data.userId;
        });
      }
    },
    refreshArticleDetails(articleObj) {
      this.articleObj.id = articleObj.id;
      if (this.articleObj.id) {
        this.getArticle();
        this.getRelationArticle();
      }
      //查询文章接口
    },
    //获取文章详情
    getArticle() {
      if (this.articleObj.id) {
        var params = {};
        var body = { id: this.articleObj.id, accountId: this.userId };
        params.body = body;
        this.$api.getArticle(params).then(res => {
          var res = res.data;
          if (res.code == 0) {
            window.scroll(0, 0);
            this.articleObj = res.data;
            if (this.articleObj) {
              this.nodataFlag = false;
              if (this.articleObj.authorObject) {
                this.authorObject = this.articleObj.authorObject;
              }
            }
          } else {
            // 调用app的错误提示
            this.$global.showToast(res.message);
          }
        });
      }
    },
    getRelationArticle(relationId) {
      if (this.articleObj.relationId) {
        var params = {};
        var body = {
          relationId: this.articleObj.relationId
        };
        params.body = body;
        this.$api.getRelationArticle(params).then(res => {
          var result = res.data;
          if (result.code == 0) {
            this.artileList = result.data;
          }
        });
      }
    },
    downloadIamge(imgsrc, name) {
      //下载图片地址和图片名
      var image = new Image();
      // 解决跨域 Canvas 污染问题
      image.setAttribute("crossOrigin", "anonymous");
      image.onload = function() {
        var canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        var context = canvas.getContext("2d");
        context.drawImage(image, 0, 0, image.width, image.height);
        var url = canvas.toDataURL("image/png"); //得到图片的base64编码数据
        var a = document.createElement("a"); // 生成一个a元素
        var event = new MouseEvent("click"); // 创建一个单击事件
        a.download = name || "photo"; // 设置图片名称
        a.href = url; // 将生成的URL设置为a.href属性
        a.dispatchEvent(event); // 触发a的单击事件
      };
      image.src = imgsrc;
    },
    previewImg(imgsrc) {
      ImagePreview({
        images: [imgsrc]
      });
      // ImagePreview([
      // "https://img.yzcdn.cn/1.jpg",
      // "https://img.yzcdn.cn/2.jpg"
      // ]);
    }
    //访问量+1
    // updateView() {
    // var params = {};
    // var body = {};
    // body = {
    // id: this.articleObj.id
    // };
    // params.body = body;
    // this.$api
    // .updateView(params)
    // .then(res => {
    // var result = res.data;
    // if (result.code == 0) {
    // } else {
    // this.$global.showToast(result.message);
    // }
    // })
    // .catch(res => {
    // this.$toast(res.message);
    // });
    // }
  },
  mounted() {
    this.userId = localStorage.getItem("userId");
    var uc = window.location.search;
    //app进入
    uc = decodeURIComponent(uc);
    if (uc.indexOf("type=app") != -1) {
      this.noticeAppFinishFlag = true;
      var articleObj = uc.split("&");
      this.articleObj.id = articleObj[1].substring(
        articleObj[1].indexOf("articleId=") + 10
      );
      this.source = articleObj[2].substring(
        articleObj[2].indexOf("articleType=") + 12
      );
      if (this.source == "zaker") {
        var sourceUrl = articleObj[3].substring(
          articleObj[3].indexOf("sourceUrl=") + 10
        );
        if (sourceUrl) {
          this.sourceUrl = sourceUrl;
        }
      } else {
        var isShare = "";
        var relationId = articleObj[4].substring(
          articleObj[4].indexOf("relationId=") + 11
        );
        if (relationId) {
          this.articleObj.relationId = relationId;
        }
        if (articleObj[5]) {
          if(articleObj[5].indexOf('isShare') != -1){
            isShare = articleObj[5].substring(
              articleObj[5].indexOf("isShare=") + 8
            );
          }
        }
        if (isShare) {
          this.isShare = true;
        }
        if (this.articleObj.id) {
          this.getArticle();
          this.getRelationArticle();
        }
      }
    } else {
      //h5进入
      if (this.$route.params.articleObj) {
        this.articleObj = this.$route.params.articleObj;
        this.source = this.articleObj.source;
        this.sourceUrl = this.articleObj.sourceUrl;
        if (this.articleObj.source != "zaker") {
          if (this.articleObj.id) {
            this.getArticle();
            this.getRelationArticle();
          }
        }
      }
    }
  },
  beforeCreate() {
    document.querySelector("body").setAttribute("style", "background:#fff");
  }
};
</script>
<style>
/* html {
background-color: #fff;
} */
</style>
<style scoped>
html,
body {
  /* background-color: #fff; */
  height: 100%;
  width: 100%;
}
#app {
  height: 100%;
  width: 100%;
}
.artileBox {
  height: 100%;
  width: 100%;
  background-color: #fff;
}
.artileBoxS{
  padding-bottom: 40px;
}
.loadingGif{
  margin: 50%;
}
.articleIframe {
  width: 750px;
  /* min-height: 1334px; */
  height: 100%;
  width: 100%;
  /* overflow-x: hidden; */
}
.articleBar {
  position: fixed;
  top: 0;
  width: 750px;
}
.articleContainer {
  margin: 130px 30px 50px 30px;
}
.articleTitle {
  font-size: 42px;
  font-weight: 600;
  line-height: 60px;
}
.doctorImg {
  width: 72px;
  height: 72px;
  vertical-align: middle;
}
.articleSource {
  margin: 36px 0;
  font-size: 24px;
  color: #aeafb2;
  line-height: 32px;
}
.sourceOr {
  font-size: 28px;
  color: #333;
  font-weight: bold;
  margin-bottom: 13px;
}
.sourceLeft {
  width: 228px;
}
.articleLine {
  height: 4px;
  background-color: #333333;
}
.articleTips {
  background-color: #f6f8fa;
  margin-top: 2px;
  padding: 36px 20px 26px;
  font-size: 24px;
  line-height: 40px;
}
.tipsLeft {
  width: 470px;
}
.tipsRight {
  width: 128px;
  height: 128px;
}
.articleContent {
  font-size: 32px;
  line-height: 64px;
  margin: 57px 0 57px 0;
}
.borderLine {
  height: 20px;
  background-color: #f6f8fa;
}
.relatedArticles {
  padding: 0 30px;
  margin-bottom: 64px;
}
.articleContentT {
  position: relative;
  padding: 30px 0;
  margin: 0;
  border-top: 1px solid #ebebeb;
}
.relatedArticleTitle {
  font-size: 28px;
  font-weight: 600;
  line-height: 40px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.articleDetails,
.articlePraiseAndViewBox {
  width: 440px;
}
.articleImg {
  width: 200px;
  height: 150px;
  border-radius: 12px;
}
.articlePraiseAndViewBox {
  position: absolute;
  bottom: 30px;
  font-size: 24px;
  color: #a8a8a8;
}
.relatedArTitle {
  font-size: 32px;
  font-weight: bold;
  line-height: 36px;
  margin: 30px 0;
}
.spaceLine {
  height: 6px;
  background-color: #ebebeb;
}
footer {
  /* margin-top: 33px; */
  position: fixed;
  bottom: 0;
  z-index: 888;
  padding-left: 70px;
  background-color: #fff;
  width: 680px;
  height: 95px;
  color: #aeafb2;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
footer .footerBox {
  /* margin: 37px 65px 0 0; */
  color: #333;
  font-size: 28px;
  flex: 1;
}
.footerBoxImg {
  display: inline-block;
  vertical-align: middle;
  width: 48px;
  height: 48px;
}
/* .footerBoxImg.viewImg {
width: 44px;
height: 36px;
} */
/* .footerBoxImg.goodImg {
width: 43px;
height: 44px;
} */
/* .footerBoxImg.collectImg {
width: 44px;
height: 40px;
}
.footerBoxImg.shareImg {
width: 36px;
height: 36px;
} */

.shareContainer {
  margin: 58px 0 58px 76px;
}
.shareBox {
  display: inline-block;
  width: 200px;
  font-size: 28px;
  text-align: center;
}

.wechatImg,
.friendImg,
.qqImg {
  margin: 0 auto 18px;
}
.wechatImg {
  width: 50px;
  height: 44px;
}
.friendImg {
  width: 44px;
}
.qqImg {
  width: 42px;
  height: 49px;
}
</style>
