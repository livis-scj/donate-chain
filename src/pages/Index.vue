<template>
  <el-container>
    <el-header>
      <span class="header-title">扶贫捐赠信息追溯服务平台</span>
      <v-sign-in-button></v-sign-in-button>
    </el-header>
    <el-main>
      <el-carousel :interval="4000" type="card">
        <el-carousel-item v-for="(item, index) in carouselImage" :key="index">
          <img :src="item.url" alt="item.title" width="800px" height="300px">
          <h3 class="carousel-title">{{ item.title }}</h3>
        </el-carousel-item>
      </el-carousel>
      <div>
        <el-input v-model="input" placeholder="请输入内容"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
      </div>
      <div>
        <div class="infinite-list-wrapper" style="overflow:auto">
          <div class="list-title">捐赠排名</div>
          <ul
            class="list"
            v-infinite-scroll="load"
            infinite-scroll-disabled="disabled">
            <li v-for="(item, index) in donateRank" v-bind:key="index" class="list-item rank">
              <span><span>{{index + 1}}</span>：{{item.name}}</span>
              <span>{{item.value}}</span>
            </li>
            <li v-if="loading">加载中...</li>
            <li v-if="noMore">没有更多了</li>
          </ul>
        </div>
        <div class="infinite-list-wrapper" style="overflow:auto">
          <div class="list-title">贫困群众</div>
          <ul
            class="list"
            v-infinite-scroll="load"
            infinite-scroll-disabled="disabled">
            <li v-for="(item, index) in poorPeple" v-bind:key="index" class="list-item poor">
              <span>{{item.name}}</span>
              <span>{{item.region}}</span>
            </li>
            <li v-if="loading">加载中...</li>
            <li v-if="noMore">没有更多了</li>
          </ul>
        </div>
        <div class="infinite-list-wrapper" style="overflow:auto">
          <div class="list-title">捐赠者</div>
          <ul
            class="list"
            infinite-scroll-disabled="disabled">
            <li v-for="(item, index) in donatePeple" v-bind:key="index" class="list-item donate">
              <span>{{item.donorName}}</span>
              <span>{{item.name}}{{item.type}}{{item.unit}}</span>
              <span>{{item.donateTime | tiemFormat}}</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="footer"><div class="m-report-foot page">京公网安备案11000002000001号 ©2020 Baidu <a href="https://www.baidu.com/duty" target="_blank">使用百度前必读</a></div></div>
    </el-main>
  </el-container>
</template>

<script>
import {carouselImage, donateRank, poorPeple, SETTIMEOUTTIME} from './data.js';
import axios from '../http';
import moment from 'moment';
import SignInButton from '../components/SignInButton.vue';

export default {
    data () {
        return {
            count: 10,
            loading: false,
            carouselImage,
            donateRank,
            poorPeple,
            donatePeple: [],
            input: ''
        };
    },
    computed: {
        noMore () {
            return this.count >= 20;
        },
        disabled () {
            return this.loading || this.noMore;
        }
    },
    components: {
        'v-sign-in-button': SignInButton
    },
    mounted () {
        this.getDynamicDonate();
        this.setTimeoutId = setTimeout(() => {
            this.getDynamicDonate();
        }, SETTIMEOUTTIME);
    },
    filters: {
        tiemFormat (value) {
            return moment(value).format('YY-MM-DD hh:mm:ss');
        }
    },
    methods: {
        getToken() {
            const cookieToken = this.$cookies.get('token');
            let account = '';
            let token = '';
            if (cookieToken) {
                const accountToken = cookieToken.split(' ');
                account = accountToken[0];
                token = accountToken[1];
            }
            return {account, token};
        },
        getDynamicDonate () {
            axios.get('/api/donate/allDonations', {pageNo: 1, pageSize: 20}, {
                headers: {
                    'X-token': JSON.stringify(this.getToken().token)
                }
            }).then(res => {
                this.donatePeple = res.data.dataList;
            });
        },
        load () {
            this.loading = true;
            setTimeout(() => {
                this.count += 2;
                this.loading = false;
            }, 2000);
        },
        search () {
            this.$router.push({name: 'Search', params: {query: this.input}});
        }
    }
};
</script>

<style lang="stylus">
  body {
    margin: 0;
  }
  .el-header {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
    position: relative;
    .header-title {
      padding-right: 124px;
      font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
      font-size: 20px;
    }
  }
  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    line-height: 100%;
    position: absolute;
    top: 60px;
    bottom: 0;
    left: 0;
    right: 0;
    .el-carousel {
      margin-bottom: 60px;
      position: relative;
      .el-carousel__item:nth-child(2n) {
        background-color: #99a9bf;
      }
      .el-carousel__item:nth-child(2n+1) {
        background-color: #d3dce6;
      }
      .el-carousel__item .carousel-title {
        color: #fff;
        font-size: 18px;
        opacity: 0.75;
        line-height: 1;
        margin: 0;
        position: absolute;
        bottom: 10px;
        left: 6px;
      }
    }
    .el-input {
      display: inline-block;
      width: 60%;
      margin-right: 30px;
      margin-bottom: 60px;
    }
    .infinite-list-wrapper {
      display: inline-block;
      width: calc(100% / 3 - 4px);
      background-color: #fff;
      .list-title {
        margin-top: 16px;
      }
      .list {
        list-style: none;
        padding: 0;
        overflow: auto;
        height: 300px;
        .list-item {
          padding: 0 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 50px;
          background: #e8f3fe;
          margin: 10px;
          color: #7dbcfc;
          justify-content: space-between;
        }
      }
    }
    .footer {
      margin-top: 10px;
      .m-report-foot {
        text-align: center;
        color: #999;
        margin: 20px 0;
        a {
            color: #999;
        }
      }
    }
  }
</style>
