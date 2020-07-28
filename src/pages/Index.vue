<template>
  <div class="search-index">
    <el-container>
      <el-header>
        <span class="header-title">扶贫捐赠信息追溯服务平台</span>
      </el-header>
      <el-main>
        <el-carousel :interval="4000" type="card">
          <el-carousel-item v-for="(item, index) in carouselImage" :key="index">
            <img :src="item.url" alt="item.title">
            <h3 class="carousel-title">{{ item.title }}</h3>
          </el-carousel-item>
        </el-carousel>
        <div class="slogen">科技服务生活 技术智领未来</div>
        <div>
          <el-input v-model="input" @keyup.enter.native="search" placeholder="请输入内容"></el-input>
          <el-button type="primary" class="search-icon" icon="el-icon-search" @click="search">搜索</el-button>
        </div>
        <div class="auto-scroll">
          <div class="infinite-list-wrapper" style="overflow:auto">
            <div class="list-title">捐赠排名</div>
            <ul
              class="list rank">
              <li v-for="(item, index) in donateRank" v-bind:key="index" class="list-item rank">
                <span><span>{{item.index}}</span>：{{item.name}}</span>
                <span>{{item.value}}</span>
              </li>
            </ul>
          </div>
          <div class="infinite-list-wrapper" style="overflow:auto">
            <div class="list-title">贫困群众</div>
            <ul
              class="list poor-people">
              <li v-for="(item, index) in poorPeople" v-bind:key="index" class="list-item poor">
                <span>{{item.name}}</span>
                <span>{{item.region}}</span>
              </li>
            </ul>
          </div>
          <div class="infinite-list-wrapper" style="overflow:auto">
            <div class="list-title">捐赠者</div>
            <ul
              class="list donors">
              <li v-for="(item, index) in donatePeple" v-bind:key="index" class="list-item donate">
                <span style="width: 200px;text-align: left;">{{item.donorName}}</span>
                <span style="width: 400px">{{item.name}}{{item.quantity}}{{item.unit}}</span>
                <span style="width: 400px;text-align: right;">{{item.donateTime | tiemFormat}}</span>
              </li>
            </ul>
          </div>
        </div>
        <div class="x-history x-frame">
            <div class="x-block x-content">
                <div class="x-block-title">扶贫历程</div>
                <div class="x-block-frame x-history-frame" id="x-history-banner">
                    <ul class="x-history-list">
                        <li class="x-history-item" v-for="(courseItem, courseIndex) in courseData" v-bind:key="courseIndex">
                            <div class="x-history-item-body">
                                <i class="x-history-item-headicon"><img :src="point"></i>
                                <p class="x-history-item-title">{{courseItem.date}}</p>
                                <p class="x-history-item-content">{{courseItem.desc}}</p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <h2 class="echarts-title">2013年至2018年社会捐赠总额(单位:亿元)</h2>
        <div id="echarts" style="width:900px;height:600px;left:50%;transform:translateX(-50%);margin-top:20px"></div>
        <h2 class="video-title">习近平在宁夏考察时强调 决胜全面建成小康社会决战脱贫攻坚继续建设经济繁荣民族团结环境优美人民富裕的美丽新宁夏</h2>
        <video width="800px" controls :poster="videoPost">
          <source :src="xijinpin" type="video/mp4">
          您的浏览器不支持Video标签。
        </video>
        <div class="footer" style="position: relative;"><div class="m-report-foot page">京公网安备案11000002300011号 ©2020 TianYan <a href="" target="_blank">使用天眼前必读</a></div></div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import {carouselImage, donateRank, poorPeople, SETTIMEOUTTIME, courseData} from './data.js';
import point from '../assets/point.png';
import xijinpin from '../assets/xijinpin.mp4';
import videoPost from '../assets/video-post.jpg';
import axios from '../http';
import moment from 'moment';
import echarts from 'echarts';
import {getToken} from '../utils/index.js';

export default {
    data () {
        return {
            count: 10,
            loading: false,
            carouselImage,
            donateRank,
            poorPeople,
            donatePeple: [],
            input: '',
            first: true,
            point,
            courseData,
            xijinpin,
            videoPost
        };
    },
    computed: {
    },
    mounted () {
        this.getDynamicDonate();
        if (this.first) {
            this.initDate();
        }
        this.courseData = this.courseData.reverse();
        this.allAutoScroll();
        this.initEcharts();
        this.setTimeoutId = setTimeout(() => {
            this.getDynamicDonate();
        }, SETTIMEOUTTIME);
    },
    filters: {
        // 调整时间戳为 2020-07-13 03:04:00 的日期格式
        tiemFormat (value) {
            return moment(value).format('YYYY-MM-DD hh:mm:ss');
        }
    },
    methods: {
        // 初始化图表
        initEcharts() {
            console.log(echarts);
            var myChart = echarts.init(document.getElementById('echarts'));
            // 绘制图表
            myChart.setOption({
                title: {
                    text: ''
                },
                tooltip: {},
                xAxis: {
                    data: ['2013年', '2014年', '2015年', '2016年', '2017年', '2018年']
                },
                yAxis: {
                    type: 'value',
                    boundaryGap: [0, '30%']
                },
                series: [{
                    type: 'line',
                    smooth: 0.6,
                    name: '捐赠额',
                    lineStyle: {
                        color: '#2DB2EB',
                        width: 5
                    },
                    data: [998, 1096, 1211, 1383, 1493, 3215]
                }, {
                    name: '捐赠额',
                    type: 'bar',
                    color: '#EB4232',
                    barWidth: '60%',
                    data: [998, 1096, 1211, 1383, 1493, 3215]
                }]
            });
        },
        // 初始化捐赠排名/贫困群众
        initDate() {
            this.donateRank.push(...this.donateRank.slice(0, 5));
            this.poorPeople.push(...this.poorPeople.slice(0, 5));
            this.first = false;
        },
        // 列表滚动
        allAutoScroll() {
            const rank = document.querySelector('.auto-scroll .rank');
            const poorPeople = document.querySelector('.auto-scroll .poor-people');
            const donors = document.querySelector('.auto-scroll .donors');
            this.elementAutoScroll(rank);
            this.elementAutoScroll(poorPeople);
            this.elementAutoScroll(donors);
        },
        // 控制滚动速率
        elementAutoScroll(ele) {
            setTimeout(() => {
                if (ele.scrollHeight) {
                    if (ele.scrollTop + ele.offsetHeight >= ele.scrollHeight) {
                        ele.scrollTop = 11.5;
                    } else {
                        ele.scrollTop += 1.5;
                        window.requestAnimationFrame(this.elementAutoScroll);
                    }
                    this.elementAutoScroll(ele);
                }
            }, 50);
        },
        // 获取最新捐赠信息
        getDynamicDonate () {
            axios.get('/api/donate/allDonations', {pageNo: 1, pageSize: 20}, {
                headers: {
                    'X-token': JSON.stringify(getToken(this).token)
                }
            }).then(res => {
                const dataList = res.data.dataList;
                dataList.push(...dataList.slice(0, 5));
                this.donatePeple = dataList;
            });
        },
        // 跳转搜索页并搜索
        search () {
            this.$router.push({name: 'Search', params: {query: this.input}});
        }
    }
};
</script>

<style lang="stylus" scoped>
.search-index {
  body {
    margin: 0;
  }
  .el-header {
    background-color: #000;
    color: #fff;
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
    background-color: #FFF;
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
      .el-carousel__item {
        background-color: #99a9bf;
        img {
          width: 100%;
          height: 100%;
        }
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
    .slogen {
      font-weight: bold;
      font-size: 32px;
      color: #000;
      letter-spacing: 0;
      text-align: center;
      line-height: 40px;
      margin-bottom: 40px;
    }
    .el-input {
      display: inline-block;
      width: 60%;
      margin-right: 30px;
      margin-bottom: 60px;
    }
    .search-icon {
      width: 102px;
      background-color: #38F;
      &:hover {
        background-color: #2C73D8;
      }
    }
    .infinite-list-wrapper {
      display: inline-block;
      width: calc(100% / 3 - 10px);
      background-color: #fff;
      .list-title {
        margin-top: 16px;
        font-size: 18px;
        color: #000;
        line-height: 40px;
        letter-spacing: 0
      }
      .list {
        list-style: none;
        padding: 0;
        overflow: auto;
        height: 300px;
        &::-webkit-scrollbar {
          display: none;
        }
        box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
        .list-item {
          padding: 0 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 50px;
          background: #fff;
          margin: 10px;
          color: #666;
          justify-content: space-between;
          box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
        }
      }
    }
    .x-frame {
        padding-top: 120px;
    }
    .x-history {
        * {
            box-sizing: border-box;
        }
        .x-content {
            max-width: 1144px;
            padding: 0 30px;
            margin: 0 auto;
            .x-block-title {
                text-align: center;
                font-weight: 700;
                font-size: 32px;
                line-height: 48px;
                margin-bottom: 64px;
            }
            .x-history-frame {
                position: relative;
                .x-history-list {
                    display: flex;
                    overflow-x: scroll;
                    overflow-y: hidden;
                    height: 188px;
                    padding-bottom: 20px!important;
                    .x-history-item {
                        flex: 0 0 auto;
                        width: calc((100vw - 60px) / 4);
                        max-width: 271px;
                        position: relative;
                        &:after {
                            top: 1px;
                            left: 0;
                            position: absolute;
                            content: " ";
                            border-top: dashed #07AFBE 1px;
                            width: 100%;
                            height: 2px;
                        }
                        .x-history-item-body {
                            margin-right: 28px;
                            position: relative;
                            &:hover {
                              &:before {
                                  content: " ";
                                  position: absolute;
                                  border-top: solid #07AFBE 4px;
                                  top: 0;
                                  height: 2px;
                                  left: 0;
                                  z-index: 11;
                                  right: 0;
                              }
                              .x-history-item-title {
                                  font-size: 20px;
                                  line-height: 30px;
                              }
                              .x-history-item-content {
                                  font-size: 16px;
                                  line-height: 24px;
                                  color: #333;
                              }
                            }
                            .x-history-item-headicon {
                                position: absolute;
                                z-index: 10;
                                top: 0;
                                left: 0;
                                img {
                                    height: 4px;
                                    pointer-events: none;
                                    border-style: none;
                                    display: block;
                                    border: 0;
                                }
                            }
                            .x-history-item-title {
                                color: #333;
                                font-size: 18px;
                                line-height: 28px;
                                font-weight: 700;
                                padding-top: 24px;
                                margin-bottom: 8px;
                                margin-top: 0;
                                .x-history-item-import {
                                    display: inline-block;
                                    background-image: url('../assets/important.png');
                                    background-size: cover;
                                    background-position: -1px 2px;
                                    width: 14px;
                                    height: 18px;
                                    vertical-align: -1px;
                                    transform: translate(-4px,0);
                                }
                            }
                            .x-history-item-content {
                                color: #666;
                                font-size: 14px;
                                line-height: 22px;
                                padding-top: 8px;
                            }
                        }
                    }
                }
            }
        }
        ul,
        li {
            margin: 0;
            padding: 0;
            list-style: none;
        }
        li {
            display: list-item;
            text-align: -webkit-match-parent;
        }
    }
    .video-title {
      margin: 40px auto;
      line-height: 1.5;
    }
    .footer {
      margin-top: 50px;
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
}
</style>
