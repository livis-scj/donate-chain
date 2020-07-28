<template>
  <div class="receive-list">
      <section class="table">
          <div style="display:flex;justify-content: space-between;">
              <span style="line-height:40px;font-size:20px">领取详情</span>
          </div>
          <el-table border :data="receiveData" style="margin-top:20px;text-align:center">
              <el-table-column
                  v-for="(item,index) in columns"
                  :key="index"
                  :prop="item.value"
                  :label="item.text"
                  align="center"
                  :formatter="item.formatter"
                  :min-width="item.width">
              </el-table-column>
              <el-table-column label="操作">
                  <template slot-scope="scope">
                      <el-button type="text" :disabled="scope.row.drawStatus === 1" @click="handleDetail(scope.row)">领取</el-button>
                      <el-button type="text" style="margin-left: 0;" :disabled="scope.row.drawStatus !== 1" @click="openDialog()">查看</el-button>
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
      </section>
      <el-dialog
        :close-on-click-modal="true"
        top="8vh"
        width="428px"
        center
        :visible.sync="successDialog"
        @close="closDialog('successDialog')">
        <div class="certificate">
            <div class="header">爱心领取凭证</div>
            <h1>{{name}}先生/女士:</h1>
            <div class="desc">您参加“{{certificateData.theme}}”主题活动，取得爱心物资“人民币{{certificateData.recipientAmount}}元”，爱心码为“{{certificateData.certCode}}”，凭爱心码可以于追溯平台查找捐赠者，请妥善保管。</div>
            <div class="enterprise">扶贫领取服务平台</div>
            <div class="data">{{timeFormatChinese(certificateData.drawDate)}}</div>
        </div>
      </el-dialog>
  </div>
</template>

<script>
import moment from 'moment';
import axios from '../../http';
import {getToken} from '../../utils/index.js';

export default {
    name: 'receive',
    data() {
        return {
            columns: [
                {
                    text: '活动主题',
                    value: 'theme'
                },
                {
                    text: '活动描述',
                    value: 'description'
                },
                {
                    text: '开始时间',
                    value: 'startTime',
                    formatter: row => {
                        return this.timeFormat(row.startTime);
                    }
                },
                {
                    text: '结束时间',
                    value: 'endTime',
                    formatter: row => {
                        return this.timeFormat(row.endTime);
                    }
                },
                {
                    text: '可领金额',
                    value: 'recipientAmount'
                },
                {
                    text: '活动状态',
                    value: 'status',
                    formatter: row => {
                        let text = '';
                        if (row.status === 0) {
                            text = '待拨款';
                        } else if (row.status === 1) {
                            text = '已拨款';
                        } else if (row.status === 2) {
                            text = '领取中';
                        } else if (row.status === 3) {
                            text = '领取中';
                        } else if (row.status === 4) {
                            text = '活动已结束';
                        }
                        return text;
                    }
                },
                {
                    text: '领取证书',
                    value: 'certCode',
                    formatter: row => {
                        return row.certCode || '待领取';
                    }
                },
                {
                    text: '领取状态',
                    value: 'drawStatus',
                    formatter: row => {
                        let text = '';
                        if (row.drawStatus === 0) {
                            text = '未领取';
                        } else if (row.drawStatus === 1) {
                            text = '已领取';
                        }
                        return text;
                    }
                }
            ],
            receiveData: [],
            total: 0,
            pageSize: 10,
            pageNo: 1,
            successDialog: false,
            certificateData: {}
        };
    },
    created() {
        this.getReceiveData();
        const {name} = getToken(this);
        this.name = name;
    },
    methods: {
        // 领取
        handleDetail(row) {
            console.log(row);
            const {token, userId} = getToken(this);
            axios.post(`/api/draw/draw`, {
                activityId: row.activityId,
                donatoryId: Number(userId)
            }, {
                headers: {
                    'X-TOKEN': token
                }
            }).then(res => {
                console.log(res);
                if (+res.status === 0) {
                    this.code = res.data;
                    this.certificateData = row;
                    this.successDialog = true;
                    this.getReceiveData();
                } else {
                    this.$message({
                        message: res.msg,
                        type: 'error'
                    });
                }
            });
        },
        // 打开领取成功证书
        openDialog() {
            this.successDialog = true;
        },
        // 调整时间戳为 2020-07-13 03:04:00 的日期格式
        timeFormat (value) {
            return moment(value).format('YYYY-MM-DD HH:mm:ss');
        },
        // 调整时间戳为 2020-07-13 的日期格式
        timeFormatChinese (value) {
            return moment(value).format('YYYY-MM-DD');
        },
        // 获取活动列表, 包含可领\已领取
        getReceiveData() {
            axios.get(`/api/donatory/myActivities`, {
                headers: {
                    'X-TOKEN': getToken(this).token
                }
            }).then(res => {
                if (res.data[0]) {
                    this.certificateData = res.data[0];
                }
                this.receiveData = res.data;
                this.total = res.data.length;
            });
        },
        // 换页
        handleCurrentChange(val) {
            this.pageNo = val;
            this.getReceiveData();
        },
        // 关闭证书弹框
        closDialog(dialog) {
            this[dialog] = false;
        }
    }
};
</script>

<style lang="stylus">
.receive-list
    section
        background #FFF
        padding 24px
    .search
        margin-bottom 16px
        padding-bottom 8px
    .certificate
        background url('../../assets/receive-bg.png') no-repeat
        background-size: 100% 100%
        height 500px
        position relative
        top: 50%
        left: 50%
        transform: translateX(-50%)
        .header
            padding-top: 78px;
            text-align: center;
            font-size: 18px;
        h1
            padding: 0 56px;
        .desc
            padding: 0 56px;
            text-indent: 2em;
        .data
            padding : 0px 56px 0;
            text-align: right;
        .enterprise
            padding : 20px 56px 0;
            text-align: right;
    .el-dialog__header
        position: absolute;
        right: 20px;
        z-index: 2;
    .el-dialog__body
        padding: 0;
</style>
