<template>
  <div class="search-container">
    <el-container>
      <el-header>
        <span class="header-title">扶贫捐赠信息追溯服务平台</span>
        <el-button type="info" plain @click="backIndex()" class="back-index-button">回到首页</el-button>
      </el-header>
      <el-main>
        <div>
          <el-input v-model="input" @keyup.enter.native="search" placeholder="请输入内容"></el-input>
          <el-button type="primary" class="search-icon" icon="el-icon-search" @click="search">搜索</el-button>
        </div>
        <el-table
          :data="pageData"
          style="width: 100%"
          :row-class-name="tableRowClassName">
          <el-table-column
            type="index"
            :index="indexMethod"
            label="序号"
            width="60">
          </el-table-column>
          <el-table-column
            prop="donateTime"
            label="日期"
            width="180">
            <template slot-scope="scope">
              <span>{{scope.row.donateTime | timeFormat}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="donorName"
            label="姓名"
            width="90">
          </el-table-column>
          <el-table-column
            prop="participation"
            label="类型"
            width="90">
          </el-table-column>
          <el-table-column
            prop="phone"
            label="手机号"
            width="180">
          </el-table-column>
          <el-table-column
            prop="idCard"
            label="身份证号"
            width="180">
          </el-table-column>
          <el-table-column
            prop="certCode"
            label="存证地址"
            width="560">
          </el-table-column>
          <el-table-column
            label="物品">
            <template slot-scope="scope1">
              <span v-for="(detailItem, detailIndex) in scope1.row.donateDetailResps" v-bind:key="'donateDetailResps' + detailIndex">{{detailItem.name}} {{detailItem.quantity}} {{detailItem.unit}}；</span>
            </template>
          </el-table-column>
          <el-table-column
            width="60"
            label="操作"
            class-name="operate">
            <template slot-scope="scope">
              <span @click="openDrawer(scope.row)"><i class="el-icon-message"></i></span>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
            style="margin-top: 30px; text-align:right"
            v-if="total > pageSize"
            background
            layout="total, prev, pager, next"
            @current-change="handleCurrentChange"
            :page-size="pageSize"
            :total="total">
        </el-pagination>
        <div class="footer"><div class="m-report-foot page">京公网安备案11000002300011号 ©2020 TianYan <a href="" target="_blank">使用天眼前必读</a></div></div>
      </el-main>
      <el-drawer
        title="捐赠详情"
        :visible.sync="drawer"
        direction="rtl"
        @closed="resetDrawer"
        size="61.8%">
        <el-timeline v-if="drawerData">
          <el-timeline-item :timestamp="drawerData.donateTime | dayFormat" placement="top">
            <el-card>
              <h4>捐赠者信息</h4>
              <p><span class="card-label">捐赠者姓名：</span><span class="card-value">{{drawerData.donorName}}</span></p>
              <p>
                <span class="card-label">捐赠证书：</span><span class="card-value">{{drawerData.certCode}}</span>
                <el-button type="text" @click="verifydonate(drawerData.certCode, 0)">区块链信息查询</el-button>
              </p>
            </el-card>
          </el-timeline-item>
          <el-timeline-item :timestamp="donateVerify[0].time | timeFormat" placement="top" v-if="donateVerify[0]">
            <el-card>
              <h4>捐赠者信息(区块链)</h4>
              <p><span class="card-label">捐赠者姓名：</span><span class="card-value">{{donateVerify[0].donorOrDonatoryName}}</span></p>
              <p><span class="card-label">捐赠者身份证：</span><span class="card-value">{{donateVerify[0].idCard}}</span></p>
              <h4>捐赠信息(区块链)</h4>
              <p v-for="(item, index) in donateVerify[0].drawVerificationDetailList" :key="index">
                <span class="card-label">{{item.name}}：</span><span class="card-value">{{item.quantity}}{{item.unit}}</span>
              </p>
              <el-button type="text">链上数据异常反馈</el-button>
            </el-card>
          </el-timeline-item>
          <el-timeline-item :timestamp="drawerData.donateTime | timeFormat" placement="top">
            <el-card>
              <h4>捐赠信息</h4>
              <p v-for="(item, index) in drawerData.donateDetailResp" :key="index">
                <span class="card-label">{{item.name}}：</span><span class="card-value">{{item.quantity}}{{item.unit}}</span>
              </p>
            </el-card>
          </el-timeline-item>
          <template v-if="drawerData.activityBriefResps">
            <template  v-for="(activityItem, activityIndex) in drawerData.activityBriefResps">
              <el-timeline-item :timestamp="activityItem.startTime | timeFormat" placement="top"  v-bind:key="'activityBriefResps' + activityIndex">
                <el-card>
                  <h4>活动信息</h4>
                  <p><span class="card-label">活动主题：</span><span class="card-value">{{activityItem.theme}}</span></p>
                  <p><span class="card-label">活动描述：</span><span class="card-value">{{activityItem.description}}</span></p>
                  <p><span class="card-label">活动开始时间：</span><span class="card-value">{{activityItem.startTime | dayFormat}}</span></p>
                  <p><span class="card-label">活动结束时间：</span><span class="card-value">{{activityItem.endTime | dayFormat}}</span></p>
                </el-card>
              </el-timeline-item>
              <template  v-for="(donatoryItem, donatoryIndex) in activityItem.drawRecordFlatDetails">
                <el-timeline-item :timestamp="donatoryItem.drawTime | dayFormat" placement="top" v-bind:key="'donatory' + donatoryIndex">
                  <el-card>
                    <h4>受助者信息</h4>
                    <p><span class="card-label">受助者姓名：</span><span class="card-value">{{donatoryItem.donatoryName}}</span></p>
                    <p>
                      <span class="card-label">受助证书：</span><span class="card-value">{{donatoryItem.certCode}}</span>
                      <el-button type="text" @click="verifydraw(donatoryItem.certCode, donatoryIndex)">区块链信息查询</el-button>
                    </p>
                  </el-card>
                </el-timeline-item>
                <el-timeline-item :timestamp="drawVerify[donatoryIndex].time | timeFormat" placement="top" v-if="drawVerify[donatoryIndex]" v-bind:key="'draw' + donatoryIndex">
                  <el-card>
                    <h4>受助者信息(区块链)</h4>
                    <p><span class="card-label">受助者姓名：</span><span class="card-value">{{drawVerify[donatoryIndex].donorOrDonatoryName}}</span></p>
                    <p><span class="card-label">受助者身份证：</span><span class="card-value">{{drawVerify[donatoryIndex].idCard}}</span></p>
                    <h4>受助信息(区块链)</h4>
                    <p v-for="(item, index) in drawVerify[donatoryIndex].drawVerificationDetailList" :key="index">
                      <span class="card-label">{{item.name}}：</span><span class="card-value">{{item.quantity}}{{item.unit}}</span>
                    </p>
                    <el-button type="text">链上数据异常反馈</el-button>
                  </el-card>
                </el-timeline-item>
                <el-timeline-item :timestamp="donatoryItem.drawTime | timeFormat" placement="top"  v-bind:key="'quantity' + donatoryIndex">
                  <el-card>
                    <h4>受助信息</h4>
                    <span class="card-label">{{donatoryItem.name}}：</span><span class="card-value">{{donatoryItem.quantity}}{{donatoryItem.unit}}</span>
                  </el-card>
                </el-timeline-item>
              </template>
            </template>
          </template>
          <template v-if="drawerData.activityBriefResps && useout">
              <el-timeline-item :timestamp="(new Date()).getTime() | timeFormat" placement="top">
                <el-card>
                  <h4>捐赠物资发放完毕</h4>
                </el-card>
              </el-timeline-item>
          </template>
          <template v-else-if="drawerData.activityBriefResps">
              <el-timeline-item :timestamp="(new Date()).getTime() | timeFormat" placement="top">
                <el-card>
                  <h4>捐赠物资正在发放中...</h4>
                </el-card>
              </el-timeline-item>
          </template>
          <template v-else>
              <el-timeline-item :timestamp="(new Date()).getTime() | timeFormat" placement="top">
                <el-card>
                  <h4>活动正在组织中...</h4>
                </el-card>
              </el-timeline-item>
          </template>
        </el-timeline>
      </el-drawer>
      <el-drawer
        title="受助详情"
        :visible.sync="donatoryDrawer"
        direction="rtl"
        @closed="resetDrawer"
        size="61.8%">
        <el-timeline v-if="donatoryData">
          <template v-if="donatoryData.activityBriefResp">
            <template  v-for="(donateItem, donateIndex) in donatoryData.activityBriefResp.donateFlatDetails">
              <el-timeline-item :timestamp="donateItem.donateTime | dayFormat" placement="top"  v-bind:key="'donate' + donateIndex">
                <el-card>
                  <h4>捐赠者信息</h4>
                  <p><span class="card-label">捐赠者姓名：</span><span class="card-value">{{donateItem.donorName}}</span></p>
                  <p>
                    <span class="card-label">捐赠证书：</span><span class="card-value">{{donateItem.certCode}}</span>
                    <el-button type="text" @click="verifydonate(donateItem.certCode, donateIndex)">区块链信息查询</el-button>
                  </p>
                </el-card>
              </el-timeline-item>
              <el-timeline-item :timestamp="donateVerify[donateIndex].time | timeFormat" placement="top" v-if="donateVerify[donateIndex]" v-bind:key="'donateVerify' + donateIndex">
                  <el-card>
                    <h4>捐赠者信息(区块链)</h4>
                    <p><span class="card-label">捐赠者姓名：</span><span class="card-value">{{donateVerify[donateIndex].donorOrDonatoryName}}</span></p>
                    <p><span class="card-label">捐赠者身份证：</span><span class="card-value">{{donateVerify[donateIndex].idCard}}</span></p>
                    <h4>捐赠信息(区块链)</h4>
                    <p v-for="(item, index) in donateVerify[donateIndex].drawVerificationDetailList" :key="index">
                      <span class="card-label">{{item.name}}：</span><span class="card-value">{{item.quantity}}{{item.unit}}</span>
                    </p>
                    <el-button type="text">链上数据异常反馈</el-button>
                  </el-card>
                </el-timeline-item>
              <el-timeline-item :timestamp="donateItem.donateTime | timeFormat" placement="top"  v-bind:key="'quantity' + donateIndex">
                <el-card>
                  <h4>捐赠信息</h4>
                  <span class="card-label">{{donateItem.name}}：</span><span class="card-value">{{donateItem.quantity}}{{donateItem.unit}}</span>
                </el-card>
              </el-timeline-item>
            </template>
            <el-timeline-item :timestamp="donatoryData.activityBriefResp.startTime | timeFormat" placement="top">
              <el-card>
                <h4>活动信息</h4>
                <p><span class="card-label">活动主题：</span><span class="card-value">{{donatoryData.activityBriefResp.theme}}</span></p>
                <p><span class="card-label">活动描述：</span><span class="card-value">{{donatoryData.activityBriefResp.description}}</span></p>
                <p><span class="card-label">活动开始时间：</span><span class="card-value">{{donatoryData.activityBriefResp.startTime | dayFormat}}</span></p>
                <p><span class="card-label">活动结束时间：</span><span class="card-value">{{donatoryData.activityBriefResp.endTime | dayFormat}}</span></p>
              </el-card>
            </el-timeline-item>
          </template>
          <el-timeline-item :timestamp="donatoryData.drawTime | dayFormat" placement="top">
            <el-card>
              <h4>受助者信息</h4>
              <p><span class="card-label">受助者姓名：</span><span class="card-value">{{donatoryData.donatoryName}}</span></p>
              <p>
                <span class="card-label">受助证书：</span><span class="card-value">{{donatoryData.certCode}}</span>
                <el-button type="text" @click="verifydraw(donatoryData.certCode, 0)">区块链信息查询</el-button>
              </p>
            </el-card>
          </el-timeline-item>
          <el-timeline-item :timestamp="drawVerify[0].time | timeFormat" placement="top" v-if="drawVerify[0]">
            <el-card>
              <h4>受助者信息(区块链)</h4>
              <p><span class="card-label">受助者姓名：</span><span class="card-value">{{drawVerify[0].donorOrDonatoryName}}</span></p>
              <p><span class="card-label">受助者身份证：</span><span class="card-value">{{drawVerify[0].idCard}}</span></p>
              <h4>受助信息(区块链)</h4>
              <p v-for="(item, index) in drawVerify[0].drawVerificationDetailList" :key="index">
                <span class="card-label">{{item.name}}：</span><span class="card-value">{{item.quantity}}{{item.unit}}</span>
              </p>
              <el-button type="text">链上数据异常反馈</el-button>
            </el-card>
          </el-timeline-item>
          <el-timeline-item :timestamp="donatoryData.drawTime | timeFormat" placement="top">
            <el-card>
              <h4>受助信息</h4>
              <p v-for="(item, index) in donatoryData.drawDetailResps" :key="index">
                <span class="card-label">{{item.name}}：</span><span class="card-value">{{item.quantity}}{{item.unit}}</span>
              </p>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </el-drawer>
    </el-container>
  </div>
</template>

<script>
import {getToken} from '../../utils/index.js';
import axios from '../../http';
import moment from 'moment';

export default {
    data () {
        return {
            input: '',
            drawer: false,
            donatoryDrawer: false,
            tableData: null,
            pageData: null,
            drawerData: null,
            donatoryData: null,
            pageSize: 10,
            total: 0,
            pageNo: 1,
            useout: true,
            donateVerify: {},
            drawVerify: {}
        };
    },
    computed: {},
    mounted () {
        // 获取首页传递的参数,进行搜索
        const query = this.$route.params.query || '';
        this.input = query;
        this.searchForList(query);
    },
    filters: {
        // 调整时间戳为 2020-07-13 03:04:00 的日期格式
        timeFormat (value) {
            return moment(value).format('YYYY-MM-DD hh:mm:ss');
        },
        // 调整时间戳为 2020-07-13 的日期格式
        dayFormat (value) {
            return moment(value).format('YY-MM-DD');
        }
    },
    methods: {
        // 重置查看详情数据
        resetDrawer() {
            this.drawerData = null;
            this.donateVerify = {};
            this.donatoryData = null;
            this.drawVerify = {};
        },
        // 查看详情内校验捐赠链上信息
        verifydonate(certCode, donateIndex) {
            axios.get(`/api/donate/verify?certCode=${certCode}`, {
                headers: {
                    'X-token': JSON.stringify(getToken(this).token)
                }
            }).then(res => {
                let donateVerify = this.donateVerify;
                if (res.data && res.data.pass) {
                    donateVerify[donateIndex] = res.data;
                    this.donateVerify = {...donateVerify};
                } else {
                    donateVerify[donateIndex] = {
                        pass: false,
                        mag: res.msg
                    };
                    this.donateVerify = {...donateVerify};
                }
            });
        },
        // 校验查看详情受捐链上信息
        verifydraw(certCode, donatoryIndex) {
            axios.get(`/api/draw/verify?certCode=${certCode}`, {
                headers: {
                    'X-token': JSON.stringify(getToken(this).token)
                }
            }).then(res => {
                let drawVerify = this.drawVerify;
                if (res.data && res.data.pass) {
                    drawVerify[donatoryIndex] = res.data;
                    this.drawVerify = {...drawVerify};
                } else {
                    drawVerify[donatoryIndex] = {
                        pass: false,
                        mag: res.msg
                    };
                    this.drawVerify = {...drawVerify};
                }
            });
        },
        // 根据页数调整序号
        indexMethod(index) {
            return index + 1 + (this.pageNo - 1) * this.pageSize;
        },
        // 切换页数
        handleCurrentChange(val) {
            this.pageNo = val;
            const pageSize = this.pageSize;
            this.pageData = this.tableData.slice((val - 1) * pageSize, val * pageSize);
        },
        // 回到首页
        backIndex() {
            this.$router.push({name: 'Index'});
        },
        // 根据类型 participation 获取捐赠详情或受捐详情
        getSearchDetail(row) {
            if (row.participation === '捐赠') {
                axios.get(`/api/donate/queryByDonorCertCode?certCode=${row.certCode}`, {
                    headers: {
                        'X-token': JSON.stringify(getToken(this).token)
                    }
                }).then(res => {
                    this.drawerData = res;
                    this.calculate(res);
                    this.drawer = true;
                });
            } else {
                axios.get(`/api/donate/queryByDonatoryCertCode?certCode=${row.certCode}`, {
                    headers: {
                        'X-token': JSON.stringify(getToken(this).token)
                    }
                }).then(res => {
                    this.donatoryData = res.data;
                    this.donatoryDrawer = true;
                });
            }
        },
        // 计算捐赠状态,展示详情内是发放中还是发放完毕
        calculate(data) {
            const total = {};
            data.donateDetailResp.forEach(item => {
                if (total[`${item.type}${item.type === 2 ? ' ' + item.name : ''}`]) {
                    total[`${item.type}${item.type === 2 ? ' ' + item.name : ''}`] += item.quantity;
                } else {
                    total[`${item.type}${item.type === 2 ? ' ' + item.name : ''}`] = item.quantity;
                }
            });
            if (data.activityBriefResps) {
                const issue = {};
                data.activityBriefResps.forEach(activity => {
                    activity.drawRecordFlatDetails.forEach(donatory => {
                        if (issue[`${donatory.type}${donatory.type === 2 ? ' ' + donatory.name : ''}`]) {
                            issue[`${donatory.type}${donatory.type === 2 ? ' ' + donatory.name : ''}`] += donatory.quantity;
                        } else {
                            issue[`${donatory.type}${donatory.type === 2 ? ' ' + donatory.name : ''}`] = donatory.quantity;
                        }
                    });
                });
                Object.keys(total).forEach(key => {
                    if (!issue[key] || total[key] > issue[key]) {
                        this.useout = false;
                    }
                });
            }
        },
        // 获取捐赠/受捐列表
        searchForList(query) {
            axios.get(`/api/donate/genericSearch?query=${query}`, {
                headers: {
                    'X-token': JSON.stringify(getToken(this).token)
                }
            }).then(res => {
                this.tableData = res.data;
                this.pageData = this.tableData.slice(0, this.pageSize);
                this.total = this.tableData.length;
            });
        },
        // 打开查看详情
        openDrawer(row) {
            this.getSearchDetail(row);
        },
        // 根据类型添加不同样式
        tableRowClassName({row, rowIndex}) {
            if (row.type === '捐赠') {
                return 'warning-row';
            } else {
                return 'success-row';
            }
        },
        // 查找并重置页数
        search () {
            this.searchForList(this.input);
            this.pageNo = 1;
        }
    }
};
</script>

<style lang="stylus">
.search-container{
  body {
    margin: 0;
  }
  .el-header {
    background-color: #000;
    color: #fff;
    text-align: center;
    line-height: 60px;
    position: relative;
    .back-index-button {
      position: absolute;
      right: 60px;
      top: 50%;
      transform: translateY(-50%);
      width: 102px;
      &:hover {
        background: #686868;
        border-color: #686868;
      }
    }
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
    .search-icon {
      width: 102px;
      background-color: #38F;
      &:hover {
        background-color: #2C73D8;
      }
    }
    .el-input {
      display: inline-block;
      width: 60%;
      margin-right: 30px;
      margin-bottom: 60px;
      margin-top: 60px;
    }
    .operate {
      text-align: center;
      .el-icon-message {
        cursor: pointer;
      }
    }
    .footer {
      margin-top: 50px;
      position: absolute;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
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
  .el-drawer {
    outline: none;
    .el-drawer__body {
      overflow: auto;
    }
    * {
      outline: none;
    }
  }
}
</style>
