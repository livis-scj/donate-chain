<template>
  <div>
      <section class="search" v-if="$store.getters.userInfo.userId === 9900000">
          <el-form ref="searchForm" :model="searchForm" label-width="80px">
              <el-row>
                  <el-col :span="16">
                      <el-form-item label="捐赠人">
                          <el-select style="width:100%" v-model="searchForm.donorId" placeholder="请选择捐赠人">
                              <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                              </el-option>
                          </el-select>
                      </el-form-item>
                  </el-col>
                  <el-col :span="8">
                      <el-form-item>
                          <el-button type="primary" @click="search">查询</el-button>
                          <el-button @click="reset">重置</el-button>
                      </el-form-item>
                  </el-col>
              </el-row>
          </el-form>
      </section>
      <section class="table">
          <div style="display:flex;justify-content: space-between;">
              <span style="line-height:40px;font-size:16px">总计捐款：{{totalMoney}}元</span>
              <el-button type="primary" @click="handleAdd">新建捐赠</el-button>
          </div>
          <el-table border :data="donateData" style="margin-top:20px">
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
                      <el-button type="text" @click="handleDetail(scope.row)">查看详情</el-button>
                  </template>
              </el-table-column>
          </el-table>
          <el-pagination
              style="margin-top: 30px; text-align:right"
              v-if="total > 0"
              background
              layout="total, prev, pager, next"
              @current-change="handleCurrentChange"
              :page-size="pageSize"
              :total="total">
          </el-pagination>
      </section>
      <el-dialog
          title="新建捐赠"
          top="10vh"
          :visible.sync="donateDialogVisible">
          <el-form ref="form" :rules="rules" :model="form" label-width="100px" label-position="right">
              <el-form-item prop="isAnonymous" label="是否匿名">
                  <el-radio-group v-model="form.isAnonymous">
                      <el-radio label="0">实名</el-radio>
                      <el-radio label="1">匿名</el-radio>
                  </el-radio-group>
              </el-form-item>
              <el-form-item label="捐赠人" prop="donorId" required v-if="$store.getters.userInfo.userId === 9900000">
                  <div style="display:flex">
                      <el-select filterable style="width:calc(100% - 8px)" v-model="form.donorId" placeholder="请选择捐赠人">
                          <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                      </el-select>
                      <el-button @click="innerVisible = true" size="medium">新增捐赠人</el-button>
                  </div>
              </el-form-item>
              <el-form-item
                label="物资名称"
                prop="name"
                required>
                  <el-input v-model="form.name" placeholder="请输入物资名称"></el-input>
              </el-form-item>
              <el-form-item
                label="捐赠类别"
                prop="type"
                required>
                  <el-select style="width:100%" v-model="form.type" placeholder="请选择捐赠类型">
                      <el-option label="钱" value="1"></el-option>
                      <el-option disabled label="物品" value="2"></el-option>
                  </el-select>
              </el-form-item>
              <el-form-item
                label="捐赠单位"
                prop="unit"
                required>
                  <el-input v-model="form.unit" placeholder="请输入捐赠单位"></el-input>
              </el-form-item>
              <el-form-item
                label="捐赠金额"
                prop="quantity"
                required>
                  <el-input-number style="width:100%" v-model="form.quantity" controls-position="right" :step="50" placeholder="请输入捐赠金额"></el-input-number>
              </el-form-item>
              <el-form-item>
                  <el-button type="primary" :loading="loading" @click="onSubmit">提交</el-button>
              </el-form-item>
          </el-form>
      </el-dialog>
      <el-dialog top="8vh" custom-class="donate" :visible.sync="successDialog">
          <div class="certificate">
              <div class="header">扶贫捐赠</div>
              <h1>捐赠证书</h1>
              <div class="desc"></div>
          </div>
      </el-dialog>
      <el-drawer
          title="捐赠详情"
          :visible.sync="drawer"
          direction="rtl"
          size="61.8%">
          <el-timeline v-if="detailData" style="max-height: 600px;overflow: scroll;">
              <el-timeline-item :timestamp="detailData.donateTime | dayFormat" placement="top">
                  <el-card>
                      <h4>捐赠者信息</h4>
                      <p><span class="card-label">捐赠者姓名：</span><span class="card-value">{{detailData.donorName}}</span></p>
                      <p><span class="card-label">捐赠证书：</span><span class="card-value">{{detailData.certCode}}</span></p>
                  </el-card>
              </el-timeline-item>
              <el-timeline-item :timestamp="detailData.donateTime | timeFormat" placement="top">
                  <el-card>
                      <h4>捐赠信息</h4>
                      <p v-for="(item, index) in detailData.donateDetailResp" :key="index">
                          <span class="card-label">{{item.name}}：</span><span class="card-value">{{item.quantity}}{{item.unit}}</span>
                      </p>
                  </el-card>
              </el-timeline-item>
              <template v-if="detailData.activityBriefResps">
                  <template  v-for="(activityItem, activityIndex) in detailData.activityBriefResps">
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
      <el-dialog
        :close-on-click-modal="false"
        width="428px"
        center
        title="注 册"
        :visible.sync="innerVisible"
        @close="closDialog"
        append-to-body>
        <el-form :model="registerForm" ref="registerForm" :rules="registerRules">
          <el-form-item label="账 号" :label-width="formLabelWidth" required prop="userName">
            <el-input v-model="registerForm.userName" placeholder="请输入账号" autocomplete="on" clearable></el-input>
          </el-form-item>
          <el-form-item label="密 码" :label-width="formLabelWidth" required prop="password">
            <el-input placeholder="请输入密码" v-model="registerForm.password" show-password clearable></el-input>
          </el-form-item>
          <el-form-item label="密 码" :label-width="formLabelWidth" required prop="repassword">
            <el-input placeholder="请再次输入密码" v-model="registerForm.repassword" show-password clearable></el-input>
          </el-form-item>
          <el-form-item label="姓 名" :label-width="formLabelWidth" required prop="name">
            <el-input placeholder="请输入姓名" v-model="registerForm.name" clearable></el-input>
          </el-form-item>
          <el-form-item label="身份证号" :label-width="formLabelWidth" required prop="idcard">
            <el-input placeholder="请输入身份证号" v-model="registerForm.idcard" clearable></el-input>
          </el-form-item>
          <el-form-item label="手机号" :label-width="formLabelWidth" required prop="mobil">
            <el-input placeholder="请输入手机号" v-model="registerForm.mobil" clearable></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closDialog" size="medium">取 消</el-button>
          <el-button type="primary" @click="signIn('registerForm')" :loading="buttonLoading" size="medium">提 交</el-button>
        </div>
      </el-dialog>
  </div>
</template>

<script>
import {getDonations, submitDonate, getAllDonators, getDonateTrace, regisetrDonator, getDonateStock} from '@/API';
import {timerFormat} from '@/utils';
import moment from 'moment';

export default {
    name: 'donate',
    data() {
        let checkRepassword = (rule, value, callback) => {
            if (value !== this.registerForm.password) {
                return callback(new Error('两次输入密码必须相同'));
            }
            return callback();
        };
        return {
            form: {
                donorId: '',
                name: '',
                type: '1',
                unit: '元',
                quantity: ''
            },
            searchForm: {
            },
            registerForm: {
                userName: '',
                password: '',
                repassword: '',
                name: '',
                idcard: '',
                mobile: ''
            },
            options: [],
            columns: [
                {
                    text: '捐赠人',
                    value: 'donorName'
                },
                {
                    text: '物资名称',
                    value: 'name'
                },
                {
                    text: '金额',
                    value: 'unit',
                    formatter: row => {
                        return row.quantity + row.unit;
                    }
                },
                {
                    text: '捐赠时间',
                    value: 'donateTime',
                    formatter: row => {
                        return timerFormat(row.donateTime).replace(/&nbsp;/g, ' ');
                    }
                }
            ],
            rules: {
                isAnonymous: {required: true, message: '请选择是否匿名', trigger: 'blur'},
                donorId: {required: true, message: '请选择捐赠人', trigger: 'blur'},
                name: {required: true, message: '请输入物资名称', trigger: 'blur'},
                unit: {required: true, message: '请输入捐赠单位', trigger: 'blur'},
                quantity: {required: true, message: '请输入捐赠数量', trigger: 'blur'}
            },
            registerRules: {
                userName: [
                    { required: true, message: '账号为必填', trigger: 'blur' },
                    { min: 3, max: 16, message: '账号长度在 3 到 16 个字符', trigger: 'blur' },
                    { required: true, message: '账号为必填', trigger: 'change' }
                ],
                password: [
                    { min: 3, max: 16, message: '密码长度在 3 到 16 个字符', trigger: 'blur' },
                    { required: true, message: '密码为必填', trigger: 'blur' },
                    { required: true, message: '密码为必填', trigger: 'change' }
                ],
                repassword: [
                    { min: 3, max: 16, message: '密码长度在 3 到 16 个字符', trigger: 'blur' },
                    { required: true, message: '密码为必填', trigger: 'blur' },
                    { required: true, message: '两次输入密码必须相同', validator: checkRepassword, trigger: 'blur' },
                    { required: true, message: '密码为必填', trigger: 'change' }
                ],
                name: [
                    { required: true, message: '姓名为必填', trigger: 'blur' },
                    { required: true, message: '姓名为必填', trigger: 'change' }
                ],
                idcard: [
                    { required: true, message: '身份证号为必填', trigger: 'blur' },
                    { required: true, message: '身份证号为必填', trigger: 'change' }
                ],
                mobile: [
                    { required: true, message: '手机号为必填', trigger: 'blur' },
                    { required: true, message: '手机号为必填', trigger: 'change' }
                ]
            },
            loading: false,
            buttonLoading: false,
            donateData: [],
            total: 0,
            pageSize: 10,
            pageNo: 1,
            currentIndex: 0,
            donateDialogVisible: false,
            innerVisible: false,
            successDialog: false,
            drawer: false,
            detailData: [],
            formLabelWidth: '80px',
            totalMoney: ''
        };
    },
    created() {
        this.getDonateData();
        this.getDonatorData();
        this.getStockData();
    },
    filters: {
        timeFormat(value) {
            return moment(value).format('YY-MM-DD hh:mm:ss');
        },
        dayFormat(value) {
            return moment(value).format('YY-MM-DD');
        }
    },
    methods: {
        async getDonateData() {
            const {status, data, msg} = await getDonations({
                pageNo: this.pageNo,
                pageSize: this.pageSize,
                donorId: this.$store.getters.userInfo.userId === 9900000 ? '' : this.$store.getters.userInfo.userId
            });
            if (status === 0) {
                this.donateData = data.dataList;
                this.total = data.total;
            } else {
                this.$message.error(msg);
            }
        },
        async getStockData() {
            const {data} = await getDonateStock();
            this.totalMoney = data;
        },
        async search() {
            const {status, data, msg} = await getDonations({
                pageNo: this.pageNo,
                pageSize: this.pageSize,
                donorId: this.searchForm.donorId
            });
            if (status === 0) {
                this.donateData = data.dataList;
                this.total = data.total;
            } else {
                this.$message.error(msg);
            }
        },
        reset() {
            this.getDonateData();
        },
        async getDonatorData() {
            const {data} = await getAllDonators();
            this.options = data;
        },
        handleCurrentChange(val) {
            this.pageNo = val;
            this.getDonateData();
        },
        handleAdd() {
            this.form = {
                donorId: '',
                name: '',
                type: '1',
                unit: '元',
                quantity: ''
            };
            this.donateDialogVisible = true;
        },
        onSubmit() {
            this.loading = true;
            const {donorId = null, name, type, unit, quantity, isAnonymous} = this.form;
            this.$refs.form.validate(async valid => {
                if (valid) {
                    let {status, msg} = await submitDonate({
                        donorId,
                        userId: this.$store.getters.userInfo.userId,
                        isAnonymous,
                        details: [
                            {
                                name,
                                type,
                                unit,
                                quantity
                            }
                        ]
                    });
                    if (status === 0) {
                        this.$message.success('添加成功！');
                        this.$refs.form.resetFields();
                        this.getDonateData();
                        this.donateDialogVisible = false;
                    } else {
                        this.$message.error(msg);
                    }
                }
                this.loading = false;
            });
        },
        async handleDetail(item) {
            const res = await getDonateTrace({certCode: item.certCode});
            this.detailData = res;
            this.drawer = true;
        },
        signIn(formName) {
            this.buttonLoading = true;
            this.$refs[formName].validate(async valid => {
                if (valid) {
                    let {status, msg} = await regisetrDonator({...this.registerForm});
                    if (status === 0) {
                        this.$message.success('添加成功！');
                        this.$refs[formName].resetFields();
                        this.getDonatorData();
                        this.innerVisible = false;
                    } else {
                        this.$message.error(msg);
                    }
                }
                this.buttonLoading = false;
            });
        },
        closDialog() {
            this.innerVisible = false;
            this.registerForm = {
                userName: '',
                password: '',
                repassword: '',
                name: '',
                idcard: '',
                mobile: ''
            };
        }
    }
};
</script>

<style lang="stylus" scoped>
section
    background #FFF
    padding 24px
.search
    margin-bottom 16px
    padding-bottom 8px
.el-dialog__wrapper
    .donate
        width 1000px
        .certificate
            background url(../../assets/donate.png) no-repeat
            background-size: 100% 100%
            height 500px
            position relative
.el-drawer__wrapper
    .detail-drawer
        width 500px
        .el-drawer__body
            max-height 500px
            overflow scroll

</style>
