<template>
  <el-container>
    <el-header>
      <span class="header-title">扶贫捐赠追溯平台</span>
      <el-button type="primary">登陆/注册</el-button>
    </el-header>
    <el-main>
      <el-carousel :interval="4000" type="card">
        <el-carousel-item v-for="item in 6" :key="item">
          <h3 class="medium">{{ item }}</h3>
        </el-carousel-item>
      </el-carousel>
      <div>
        <el-input v-model="input" placeholder="请输入内容"></el-input>
        <el-button type="primary" icon="el-icon-search">搜索</el-button>
      </div>
      <div>
        <div class="infinite-list-wrapper" style="overflow:auto">
          <ul
            class="list"
            v-infinite-scroll="load"
            infinite-scroll-disabled="disabled">
            <li v-for="(i, index) in count" v-bind:key="index" class="list-item">{{ i }}</li>
            <li v-if="loading">加载中...</li>
            <li v-if="noMore">没有更多了</li>
          </ul>
        </div>
        <div class="infinite-list-wrapper" style="overflow:auto">
          <ul
            class="list"
            v-infinite-scroll="load"
            infinite-scroll-disabled="disabled">
            <li v-for="(i, index) in count" v-bind:key="index" class="list-item">{{ i }}</li>
            <li v-if="loading">加载中...</li>
            <li v-if="noMore">没有更多了</li>
          </ul>
        </div>
        <div class="infinite-list-wrapper" style="overflow:auto">
          <ul
            class="list"
            v-infinite-scroll="load"
            infinite-scroll-disabled="disabled">
            <li v-for="(i, index) in count" v-bind:key="index" class="list-item">{{ i }}</li>
            <li v-if="loading">加载中...</li>
            <li v-if="noMore">没有更多了</li>
          </ul>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
export default {
    data () {
        return {
            count: 10,
            loading: false
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
    methods: {
        load () {
            this.loading = true;
            setTimeout(() => {
                this.count += 2;
                this.loading = false;
            }, 2000);
        }
    }
};
</script>

<style>
  @import url("//unpkg.com/element-ui@2.13.2/lib/theme-chalk/index.css");
  .el-header {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
    position: relative;
  }
  .header-title {
    padding-right: 124px;
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
    font-size: 20px;
  }
  .el-header button {
    position: absolute;
    right: 22px;
    top: 50%;
    transform: translateY(-50%);
  }
  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    line-height: 100%;
  }
  .el-carousel {
    margin-bottom: 60px;
  }
  .el-carousel__item:nth-child(2n) {
     background-color: #99a9bf;
  }
  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }
  .el-carousel__item h3 {
    color: #475669;
    font-size: 18px;
    opacity: 0.75;
    line-height: 300px;
    margin: 0;
  }
  .el-input {
    display: inline-block;
    width: 60%;
    margin-right: 30px;
    margin-bottom: 60px;
  }
  .el-row {
    margin-bottom: 20px;
  }
  .el-row:last-child {
    margin-bottom: 0;
  }
  .el-col {
    border-radius: 4px;
  }
  .infinite-list-wrapper {
    display: inline-block;
    width: calc(100% / 3 - 4px);
    background-color: #fff;
  }
  .list {
    list-style: none;
    padding: 0;
    overflow: auto;
    height: 300px;
  }
  .list-item {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 50px;
    background: #e8f3fe;
    margin: 10px;
    color: #7dbcfc;
  }
</style>
