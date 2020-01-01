<template>
  <div>
    <form action="/" class="search-fixed">
      <van-search
        v-model="value"
        placeholder="请输入搜索关键词"
        show-action
        @search="onSearch"
        @cancel="onCancel"
        @focus="searchFocus"
        :autofocus="true"
      />
    </form>
    <div class="search" v-show='!searchRecordFlag || focusFlag'>
      <div style="height: 54px;"></div>
      <div class="search-title" v-if="searchRecordWord.length > 0">
        <span>搜索历史</span>
        <div><img @click="clearHistorySearchWord()" :src="del_history_btn" alt=""></div>
      </div>
      <div class="search-word">
        <span v-for="(item,index) in searchRecordWord" :key="index" v-text="item" @click="selectSearchWord(item)"></span>
      </div>
    </div>
    <van-list v-if="records.length > 0 && searchRecordFlag && !focusFlag" v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad()">
      <div class="home-product-wrap">
        <div class="home-product-item" @click="jumpProductDetail(item.id,item.columnId,item.isRx)" v-for="(item,index) in records" :key="index">
          <div class="home-product-pic">
            <div :style="{backgroundImage: 'url('+ item.imgUrl +')'}"></div>
          </div>
          <div class="home-product-main">
            <div class="home-product-view">
              <div class="home-product-name">
                <span class="chu" v-if="item.isRx == 1">处方药</span>
                <span v-text="item.name"></span>
              </div>
              <div class="home-product-tip">
                <span  v-for="(list,i) in item.labelArr" :key="i" v-show="item.label.length > 0">
                  <span v-show="list != ''" v-text="list"></span>
                </span>
              </div>
            </div>
            <div class="home-price-cart">
              <div class="price-wrap-price" v-if="item.columnId && item.price && item.specialPrice">
                <span class="price-wrap-current">
                  <span>{{item.salePrice | pricePre}}</span>
                  <span>{{item.salePrice | priceNext}}</span>
                </span>
                <s>{{item.price}}</s>
              </div>
              <div class="price-wrap-price" v-if="item.columnId && item.price && !item.specialPrice">
                <span class="price-wrap-current">
                  <span>{{item.price | pricePre}}</span>
                  <span>{{item.price | priceNext}}</span>
                </span>
              </div>
              <div class="price-wrap-price" v-if="!item.columnId && item.price && item.salePrice">
                <span class="price-wrap-current">
                  <span>{{item.salePrice | pricePre}}</span>
                  <span>{{item.salePrice | priceNext}}</span>
                </span>
                <s>{{item.price}}</s>
              </div>
              <div class="price-wrap-price" v-if="!item.columnId && item.price && !item.salePrice">
                <span class="price-wrap-current">
                  <span>{{item.price | pricePre}}</span>
                  <span>{{item.price | priceNext}}</span>
                </span>
              </div>
              <div class="price-wrap-cart">
                <span>销量:{{item.sumVolume}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>  
    </van-list>
    <noData v-if="isNoData"/>
  </div>
</template>
<script>
import Vue from 'vue'
import { Tab, Tabs,Search,List, Toast } from 'vant'
Vue.use(Tab).use(Tabs).use(Search).use(List)

import {searchCommodity} from '../../api/api.js'
import noData from '../components/noData.vue'

import del_history_btn from '../../assets/img/mall/del_history_btn.png'
import test from '../../assets/img/mall/test.png'
import add_cart_btn from '../../assets/img/mall/add_cart_btn.png'

export default {
  name: 'pay',
  data(){
    return{
      del_history_btn,
      test,
      loading: false,
      finished: false,
      add_cart_btn,
      value: '',
      searchName: '',
      searchRecordFlag: false,
      searchRecordWord: [],
      focusFlag: false,
      records: [],
      setTime: 0,
      pageNum: 1,
      isNoData: false,
      isLoadFlag: true
    }
  },
  filters:{
    pricePre(value){
      var val = parseInt(value);
      return val;
    },
    priceNext(value){
      var val = '.'+String(parseFloat(value).toFixed(2)).split('.')[1];
      return val;
    }
  },
  components:{
    noData
  },
  methods:{
    onSearch(){
      this.searchName = this.value;
      this.records = [];
      if(this.searchName == ''){
        Toast("请输入您要搜索的商品名称！");
        return false;
      }
      this.searchCommodityAjax(this.searchName); 
      this.searchRecordWord.unshift(this.value);
      localStorage.setItem('searchRecordWord',this.searchRecordWord);
      this.value = '';
      this.focusFlag = false;
      this.searchRecordFlag = true;
      this.pageNum = 1;
      this.searchRecordWordStorage();
    },
    onCancel(){
      this.$router.back(-1);
    },
    selectSearchWord(word){
      this.value = this.searchName = word;
      this.isNoData = false;
      this.searchRecordFlag = true;
      this.focusFlag = false;
      this.records = [];
      this.pageNum = 1
      this.searchCommodityAjax();
    },
    clearHistorySearchWord(){
      this.searchRecordWord = [];
      localStorage.searchRecordWord = ''
    },
    searchFocus(){
      this.focusFlag = true;
      this.isNoData = false;
      this.searchRecordWordStorage();
    },
    jumpProductDetail(id,columnId,isRx){
      console.log(id,columnId,isRx)
      if(isRx == 1){
        this.$router.push({
          name:'productDetail',
          params:{
            id:id,
            columnId: columnId ? columnId : '-1' ,
            shareUserId: '0'
          },
          query:{
            isRx: 1
          }
        });
      }else{
        this.$router.push({
          name:'productDetail',
          params:{
            id:id,
            columnId:  columnId ? columnId : '-1',
            shareUserId: '0'
        }});
      }
      
    },
    onLoad(){
      var that = this;
      if(!this.isLoadFlag) return false;
      setTimeout(() => {
        this.setTime = 500;
        that.searchCommodityAjax();
      },this.setTime);
    },
    searchRecordWordStorage(){
      var searchRecordWord = localStorage.searchRecordWord || [];     
      if(searchRecordWord.length > 0){
        searchRecordWord = Array.from(new Set(searchRecordWord.split(',')));
        this.searchRecordWord = searchRecordWord
      }
    },
    searchCommodityAjax(){
      // if(this.searchName == ''){
      //   Toast("请输入您要搜索的商品名称！");
      //   return false;
      // }
      var params = { 
        header: {},
        body:{
          name: this.searchName,
          size: 10,
          current: this.pageNum,
          columnType: this.$route.params.columnType
        }
      }
      searchCommodity(params).then((res) => {
        if(res.data.code == 0){
          this.records = this.records.concat(res.data.data.records);
          if(res.data.data.records.length < 10){
            this.finished = true,
            this.loading = false;
            this.isLoadFlag = false;
          }else{
            this.loading = false;
            this.finished = false;
            this.isLoadFlag = true;
            this.pageNum ++ ;
          }

          this.isNoData = this.records.length == 0 ? true : false;  

          for(let i in this.records){
            if(this.records[i].label && this.records[i].label.indexOf("；")){
              this.records[i].labelArr = this.records[i].label.split("；");
            }else{
              let label = [];
              label.push(this.records[i].label);
              this.records[i].labelArr = label;
            }
            
          }
          
         
        }
      })
    }
  },
  mounted(){
    this.searchRecordWordStorage();
  }
}
</script>
<style lang="less" scoped>
  .search-fixed{
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10; 
    width: 100%;
    box-sizing: border-box;
  }
  .van-search{
    align-items: center;
    box-sizing: border-box;
    padding: 10px 16px;
  }
  .van-search__content{
    border-radius: 34px;
  }
  .van-search__action{
      color: #3ac756
  }
  .search{
    background: #fff;
    height: calc(100vh);
    .search-title{
      display: flex;
      padding: 26px 30px 0; 
      span{
        flex-grow: 2;
        color: #333;
        font-size: 28px;
        display: inline-block;
        line-height: 42px;
      }
      div{
        flex-shrink: 0;
        width: 42px;
        height: 42px;
      }
    }
    .search-word{
      padding: 0 30px;
      span{
        display: inline-block;
        padding: 15px 42px;
        line-height: 1;
        background-color: #f5f6f7;
        border-radius: 28px;
        margin-top: 20px;
        color: #333333;
        font-size: 24px;
        margin-right: 20px;
      }
    }
  }
  .home-product-wrap{
    width: 100%;
    background: #fff;
    padding-left: 28px;
    box-sizing: border-box;
    margin-top: 98px;
    .home-product-item{
      border-bottom: 1px solid #ebebeb;
      display: flex;
      display: -webkit-flex;
      padding: 41px 0;
      &:last-child{
        border: none;
      }
      .home-product-pic{
        flex-shrink: 0;
        div{
          width: 160px;
          height: 160px;
          border-radius: 8px;
          box-sizing: border-box;
          background-repeat: no-repeat;
          background-size: cover;
          background-position: center;
        }
      }
      .home-product-main{
        flex-grow: 2;
        margin-left: 18px;
        padding-right: 30px;
        .home-product-view{
          height: 112px;
          .home-product-name{
            font-size: 28px;
            line-height: 36px;
            color: #333333;
            span {
              word-break: break-all;
              &.chu {
                width: 72px;
                height: 28px;
                font-size: 20px;
                line-height: 28px;
                background-color: #ff6e26;
                border-radius: 4px;
                display: inline-block;
                color: #fff;
                text-align: center;
                float: left;
                margin-top: 4px;
                margin-right: 10px;
              }
            }
          }
          .home-product-tip{
            span span{
              display: inline-block;
              color: #60bc72;
              border: 1px solid #60bc72;
              border-radius: 8px;
              font-size: 20px;
              margin-right: 10px;
              box-sizing: border-box;
              line-height: 1;
              padding: 2px 6px;
            }
          }
        } 
        .home-price-cart{
          display: flex;
          display: -webkit-flex;
          margin-top: 20px;
          .price-wrap-price{
            flex-grow: 2;
            -webkit-flex-grow: 2;
            display: flex;
            align-items: center;
            -webkit-display: flex;
            -webkit-align-items: center;
            s{
              color: #d2d2d4;
              font-size: 24px;
              margin-left: 10px;
              display: flex;
              align-items: flex-end;
              &::before{
                content: "￥";
                margin-right: -4px;
                padding-top: 4px; 
              }
            }
            .price-wrap-current{
              span{
                &:first-child{
                  color: #ff6e26;
                  font-size: 36px;
                  &:before{
                    content: '￥';
                    font-size: 24px;
                    margin-right: -4px;
                  }
                }
                &:last-child{
                  color: #ff6e26;
                  font-size: 28px;
                  margin-left:-10px;
                }
              }
            } 
            .price-wrap-pre{
              font-size: 24px;
              color: #d2d2d4;
              margin-left: 10px;
              padding-top: 6px;
              &:before{
                content: '￥';
                margin-right: -8px;
              }
            }
          }
          .price-wrap-cart{
            flex-shrink: 0;
            -webkit-flex-shrink: 0;
            display: flex;
             -webkit-align-items: center;
            span{
              font-size: 24px;
              color: #aeafb2;
            }
            img{
              width: 56px;
              height: 56px;
              margin-left: 14px;
            }
          }
        }
      }
    }
  }
  
</style>
<style lang="">
  .van-icon-search::before{
    content: '';
  } 
  .van-cell--borderless{
    display: flex;
    align-items: center;
  }
  .van-field__left-icon{
    width: 24px;
    height: 24px;  
    background-image: url(../../assets/img/mall/search.png);
    background-repeat: no-repeat;
    background-size: contain;
  }
</style>