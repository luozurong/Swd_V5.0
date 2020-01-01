<template>
  <div class="wrapper">
    <div class="commodity">
      <div class="commodity-title clearfix">
        <div class="commodity-title-height"></div>
        <div class="commodity-title-name">商品详情</div>
      </div>
      <div class="commodity-descript clearfix">
        <div class="commodity-descript-pic">
          <img src="https://upload-images.jianshu.io/upload_images/1202579-8d866383c1d0d979?imageMogr2/auto-orient/strip|imageView2/1/w/180/h/128/format/webp" alt="商品">
        </div>
        <div class="commodity-descript-content">
          <div class="commodity-content-title">
            智能管家健康服务套餐
          </div>
          <div class="commodity-content-number">
            <span>数量：1</span>
          </div>
        </div>
      </div>
      <div class="commodity-plan">
        <div class="commodity-plan-header">
          <div>
            <img src="../../assets/img/centerSail/left.png" alt="">
          </div>
          <div>套餐内容</div>
          <div>
            <img src="../../assets/img/centerSail/right.png" alt="">
          </div>
        </div>
        <div class="commodity-plan-item clearfix">
          <div class="commodity-plan-item-num">1</div>
          <div class="commodity-plan-item-title">送药上门，1次</div>
        </div>
        <div class="commodity-plan-item clearfix">
          <div class="commodity-plan-item-num">2</div>
          <div class="commodity-plan-item-title">健康指导，1次</div>
        </div>
        <div class="commodity-plan-item clearfix">
          <div class="commodity-plan-item-num">3</div>
          <div class="commodity-plan-item-title">健康筛查，1次</div>
        </div>
        <div class="commodity-plan-item clearfix">
          <div class="commodity-plan-item-num">4</div>
          <div class="commodity-plan-item-title">提供智能血压计、血糖仪</div>
        </div>
        <div class="commodity-plan-item clearfix">
          <div class="commodity-plan-item-num">5</div>
          <div class="commodity-plan-item-title">血压/血糖实时在线监测</div>
        </div>
      </div>
    </div>
    <div class="user">
      <div class="user-title clearfix">
        <div class="user-title-height"></div>
        <div class="user-title-name">使用情况</div>
      </div>
      <div class="user-list">
        <div class="user-list-item">
          <span>使用人</span>
          <span>张萌萌</span>
        </div>
        <div class="user-list-item">
          <span>套餐开始使用日期</span>
          <span>2019-07-16</span>
        </div>
        <div class="user-list-item">
          <span>套餐失效日期</span>
          <span>2020-07-16</span>
        </div>
      </div>
    </div>
    <div class="guide">
      <div class="guide-title clearfix">
        <div class="guide-title-height"></div>
        <div class="guide-title-name">使用指引</div>
      </div>
      <div class="guide-content">
      您的服务将由南风医生互联网医院提供专业服务
      请到应用市场下载”南风医生”APP
      </div>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="less" scoped>
.wrapper {
  padding: 20px 30px 48px;
  .commodity {
    display: inline-block;
    width:690px;
    box-sizing: border-box;
    padding: 0 24px;
    background:rgba(255,255,255,1);
    border-radius:8px;
    .commodity-title {
      margin: 30px 0;
      .commodity-title-height {
        float: left;
        margin-right: 6px;
        margin-top: 2px;
        width:6px;
        height:28px;
        background:rgba(188,35,38,1);
        border-radius:3px;
      }
      .commodity-title-name {
        float: left;
        font-size:32px;
        font-weight:bold;
        color:rgba(51,51,51,1);
      }
    }
    .commodity-descript {
      .commodity-descript-pic {
        margin-right: 26px;
        float: left;
        img {
          width:120px;
          height:120px;
          background:rgba(210,210,212,1);
          border-radius:8px;
        }
      }
      .commodity-descript-content {
        width: 490px;
        float: left;
        .commodity-content-title {
          width: 100%;
          font-size:28px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .commodity-content-number {
          margin-top: 24px;
          font-size:28px;
          color:rgba(102,102,102,1);
        }
      }
    }
    .commodity-plan {
      position: relative;
      margin-top: 40px;
      margin-bottom: 33px;
      padding-top: 34px;
      width:642px;
      border:2px dashed rgba(210,210,212,1);
      border-radius:8px;
      .commodity-plan-header {
        position: absolute;
        left: 50%;
        top: -16px;
        transform: translateX(-50%);
        width: 240px;
        display: flex;
        justify-content: center;
        background-color: #fff;
        z-index: 999;
        img {
          width:41px;
          height:24px;
        }
        div {
          font-size:28px;
          font-weight:500;
        }
      }
      .commodity-plan-item {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        .commodity-plan-item-num {
          float: left;
          width:28px;
          height:28px;
          margin: 0 30px;
          font-size:20px;
          background:rgba(174,175,178,1);
          border-radius:50%;
          color: #fff;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .commodity-plan-item-title {
          float: left;
          width: 530px;
          font-size:28px;
          color:rgba(102,102,102,1);
          line-height:52px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        &:nth-last-child(1) {
          margin-bottom: 30px;
        }
      }
    }
  }
  .user {
    display: inline-block;
    width:690px;
    margin-top: 20px;
    box-sizing: border-box;
    padding: 0 24px;
    background:rgba(255,255,255,1);
    border-radius:8px;
    .user-title {
      margin: 28px 0 28px;
      .user-title-height {
        float: left;
        margin-right: 6px;
        margin-top: 2px;
        width:6px;
        height:28px;
        background:rgba(188,35,38,1);
        border-radius:3px;
      }
      .user-title-name {
        float: left;
        font-size:32px;
        font-weight:bold;
        color:rgba(51,51,51,1);
      }
    }
    .user-list {
      .user-list-item {
        display: flex;
        justify-content: space-between;
        margin-bottom: 30px;
        font-size:28px;
        color:rgba(102,102,102,1);
        &:nth-last-child(1) {
          margin-bottom: 46px;
        }
      }
    }
  }
  .guide {
    display: inline-block;
    width:690px;
    margin-top: 20px;
    box-sizing: border-box;
    padding: 0 24px;
    background:rgba(255,255,255,1);
    border-radius:8px;
    .guide-title {
      margin: 30px 0 16px;
      .guide-title-height {
        float: left;
        margin-right: 6px;
        margin-top: 2px;
        width:6px;
        height:28px;
        background:rgba(188,35,38,1);
        border-radius:3px;
      }
      .guide-title-name {
        float: left;
        font-size:32px;
        font-weight:bold;
        color:rgba(51,51,51,1);
      }
    }
    .guide-content {
      box-sizing: border-box;
      text-align: center;
      line-height: 36px;
      padding: 24px 20px;
      margin-bottom: 34px;
      width:639px;
      background:rgba(255,110,38,0.05);
      border-radius:8px;
      font-size:28px;
      color:rgba(188,35,38,1);
    }
  }
}
</style>