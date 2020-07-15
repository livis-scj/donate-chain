<template>
  <el-container>
    <el-header>
      <span class="header-title">扶贫捐赠信息追溯服务平台</span>
      <v-sign-in-button></v-sign-in-button>
    </el-header>
    <el-main>
      <div>
        <el-input v-model="input" placeholder="请输入内容"></el-input>
        <el-button type="primary" class="search-icon" icon="el-icon-search" @click="search">搜索</el-button>
      </div>
      <el-table
        :data="tableData"
        style="width: 100%"
        :row-class-name="tableRowClassName">
        <el-table-column
          type="index"
          label="序号"
          width="60">
        </el-table-column>
        <el-table-column
          prop="donateTime"
          label="日期"
          width="180">
          <template slot-scope="scope">
            <span>{{scope.donateTime | timeFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="donorName"
          label="姓名"
          width="180">
        </el-table-column>
        <el-table-column
          prop="participation"
          label="类型"
          width="180">
        </el-table-column>
        <el-table-column
          label="物品">
          <template slot-scope="scope1">
            <span>{{scope1.row.name}} {{scope1.row.quantity}} {{scope1.row.unit}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="certCode"
          label="存证地址">
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
      <div class="footer"><div class="m-report-foot page">京公网安备案11000002300011号 ©2020 TianYan <a href="" target="_blank">使用天眼前必读</a></div></div>
    </el-main>
    <el-drawer
      title="捐赠详情"
      :visible.sync="drawer"
      direction="rtl"
      size="61.8%"
      :before-close="handleClose">
      <el-timeline v-if="drawerData">
        <el-timeline-item :timestamp="drawerData.donateTime | dayFormat" placement="top">
          <el-card>
            <h4>捐赠者信息</h4>
            <p><span class="card-label">捐赠者姓名：</span><span class="card-value">{{drawerData.donorName}}</span></p>
            <p><span class="card-label">捐赠证书：</span><span class="card-value">{{drawerData.certCode}}</span></p>
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
            <el-timeline-item :timestamp="activityItem.startTime | timeFormat" placement="top"  v-bind:key="activityIndex">
              <el-card>
                <h4>活动信息</h4>
                <p><span class="card-label">活动主题：</span><span class="card-value">{{activityItem.theme}}</span></p>
                <p><span class="card-label">活动描述：</span><span class="card-value">{{activityItem.description}}</span></p>
                <p><span class="card-label">活动开始时间：</span><span class="card-value">{{activityItem.startTime | dayFormat}}</span></p>
                <p><span class="card-label">活动结束时间：</span><span class="card-value">{{activityItem.endTime | dayFormat}}</span></p>
              </el-card>
            </el-timeline-item>
            <template  v-for="(donatoryItem, donatoryIndex) in activityItem.drawRecordFlatDetails">
              <el-timeline-item :timestamp="donatoryItem.drawTime | dayFormat" placement="top"  v-bind:key="donatoryIndex">
                <el-card>
                  <h4>受助者信息</h4>
                  <p><span class="card-label">受助者姓名：</span><span class="card-value">{{donatoryItem.donatoryName}}</span></p>
                  <p><span class="card-label">受助证书：</span><span class="card-value">{{donatoryItem.certCode}}</span></p>
                </el-card>
              </el-timeline-item>
              <el-timeline-item :timestamp="donatoryItem.drawTime | timeFormat" placement="top"  v-bind:key="donatoryIndex">
                <el-card>
                  <h4>受助信息</h4>
                  <span class="card-label">{{donatoryItem.name}}：</span><span class="card-value">{{donatoryItem.quantity}}{{donatoryItem.unit}}</span>
                </el-card>
              </el-timeline-item>
            </template>
          </template>
        </template>
      </el-timeline>
    </el-drawer>
  </el-container>
</template>

<script>
import {} from '../data.js';
import axios from '../../http';
import moment from 'moment';
import SignInButton from '../../components/SignInButton.vue';

export default {
    data () {
        return {
            input: '',
            drawer: false,
            tableData: null,
            drawerData: null
        };
    },
    computed: {},
    components: {
        'v-sign-in-button': SignInButton
    },
    mounted () {
        const query = this.$route.params.query || '张三';
        this.input = query;
        if (query) {
            this.searchForList(query);
        }
    },
    filters: {
        timeFormat (value) {
            return moment(value).format('YY-MM-DD hh:mm:ss');
        },
        dayFormat (value) {
            return moment(value).format('YY-MM-DD');
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
        getSearchDetail(certCode) {
            axios.get(`/api/donate/queryByDonorCertCode?certCode=${certCode}`, {
                headers: {
                    'X-token': JSON.stringify(this.getToken().token)
                }
            }).then(res => {
                console.log(res);
                this.drawerData = res;
                this.drawer = true;
            });
        },
        searchForList(query) {
            axios.get(`/api/donate/genericSearch?query=${query}`, {
                headers: {
                    'X-token': JSON.stringify(this.getToken().token)
                }
            }).then(res => {
                this.tableData = res.data;
            });
        },
        openDrawer(row) {
            this.getSearchDetail(row.certCode);
        },
        handleClose(done) {
            this.$confirm('确认关闭？')
                .then(_ => {
                    done();
                })
                .catch(_ => {});
        },
        tableRowClassName({row, rowIndex}) {
            if (row.type === '捐赠') {
                return 'warning-row';
            } else {
                return 'success-row';
            }
        },
        search () {
            this.searchForList(this.input);
        }
    }
};
</script>

<style lang="stylus">
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
      margin-top: 10px;
      position: fixed;
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
    .el-drawer__close-btn,
    .el-drawer__header {
      outline: none;
    }
  }
</style>
