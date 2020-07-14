<template>
  <el-container>
    <el-header>
      <span class="header-title">扶贫捐赠信息追溯服务平台</span>
      <v-sign-in-button></v-sign-in-button>
    </el-header>
    <el-main>
      <div>
        <el-input v-model="input" placeholder="请输入内容"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
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
            <span>{{scope.donateTime | tiemFormat}}</span>
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
            <span>{{scope1.row.name}} {{scope1.row.type}} {{scope1.row.unit}}</span>
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
      <div class="footer"><div class="m-report-foot page">京公网安备案11000002300011号 ©2020 TianYan <a href="" target="_blank">使用天眼追溯系统前必读</a></div></div>
    </el-main>
    <el-drawer
      title="详情"
      :visible.sync="drawer"
      direction="rtl"
      :before-close="handleClose">
      <span>{{code}}</span>
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
            code: '',
            tableData: null
        };
    },
    computed: {},
    components: {
        'v-sign-in-button': SignInButton
    },
    mounted () {
        const query = this.$route.params.query;
        this.input = query;
        if (query) {
            this.searchForList(query);
        }
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
            this.code = row;
            this.drawer = true;
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
    .el-table .warning-row {
      background: oldlace;
    }

    .el-table .success-row {
      background: #f0f9eb;
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
</style>
