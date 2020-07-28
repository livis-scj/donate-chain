<template>
  <div class="activity-index">
      <section class="table">
          <div style="display:flex;justify-content: space-between;">
              <span style="line-height:40px;font-size:16px">总计捐款：{{totalMoney}}元</span>
              <el-button type="primary" @click="handleAdd">新建活动</el-button>
          </div>
          <el-table border style="margin-top:20px" :data="data">
              <el-table-column
                  v-for="(item,index) in columns"
                  :key="index"
                  :prop="item.value"
                  :label="item.text"
                  :formatter="item.formatter"
                  :min-width="item.width">
              </el-table-column>
              <el-table-column label="状态" width="120">
                  <template slot-scope="scope">
                      <el-tag v-if="scope.row.status === 0">待拨款</el-tag>
                      <el-tag type="warning" v-if="scope.row.status === 1">已拨款</el-tag>
                      <el-tag type="success" v-if="scope.row.status === 2">已指派</el-tag>
                      <el-tag  v-if="scope.row.status === 3">领取中</el-tag>
                      <el-tag type="success" v-if="scope.row.status === 4">已结束</el-tag>
                  </template>
              </el-table-column>
              <el-table-column label="操作">
                  <template slot-scope="scope">
                      <el-popconfirm title="确认调拨吗？" @onConfirm="handleAllocation(scope.row.id)">
                      <el-button slot="reference" :disabled="scope.row.status !== 0" type="text">调拨</el-button>
                      </el-popconfirm>
                      <el-button type="text" :disabled="scope.row.status !== 1" @click="handleAssign(scope.row.id)">指派</el-button>
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
          top="3vh"
          title="添加活动"
          :visible.sync="editDialogVisible">
          <el-steps :active="active" finish-status="success" align-center style="margin-bottom:20px">
              <el-step title="基本信息"></el-step>
              <el-step title="活动计划"></el-step>
              <el-step title="计划配置"></el-step>
              <el-step title="确认提交"></el-step>
          </el-steps>
          <el-form ref="form" v-if="active === 0" :model="form" label-width="100px">
              <el-form-item label="活动主题">
                  <el-input v-model="form.theme" placeholder="请输入活动主题"></el-input>
              </el-form-item>
              <el-form-item label="活动描述">
                  <el-input v-model="form.desc" placeholder="请输入活动描述"></el-input>
              </el-form-item>
              <el-form-item label="活动开始时间">
                  <el-date-picker
                    style="width:100%"
                    v-model="form.startTime"
                    value-format="timestamp"
                    type="datetime"
                    placeholder="选择开始时间">
                  </el-date-picker>
              </el-form-item>
              <el-form-item label="活动结束时间">
                  <el-date-picker
                    style="width:100%"
                    v-model="form.endTime"
                    value-format="timestamp"
                    type="datetime"
                    placeholder="选择结束时间">
                  </el-date-picker>
              </el-form-item>
              <el-form-item style="text-align:center" label-width="0">
                  <el-button @click="next">下一步</el-button>
              </el-form-item>
          </el-form>
          <el-form ref="form" v-if="active === 1" :model="form" label-width="100px">
              <el-form-item label="物资名称">
                  <el-input v-model="form.name" placeholder="请输入物资名称"></el-input>
              </el-form-item>
              <el-form-item label="物资类别">
                  <el-select v-model="form.type" style="width:100%" placeholder="请选择物资类别">
                      <el-option label="钱" value="1"></el-option>
                      <el-option label="物" disabled value="2"></el-option>
                  </el-select>
              </el-form-item>
              <el-form-item label="计划描述">
                  <el-input v-model="form.description" placeholder="请输入计划描述"></el-input>
              </el-form-item>
              <el-form-item label="单位">
                  <el-input v-model="form.unit" placeholder="请输入单位"></el-input>
              </el-form-item>
              <el-form-item style="text-align:center" label-width="0">
                  <el-button @click="previous">上一步</el-button>
                  <el-button @click="next">下一步</el-button>
              </el-form-item>
          </el-form>
          <el-form ref="form" v-if="active === 2" :model="form" label-width="80px">
              <el-row>
                  <el-col :span="4">
                      <div style="line-height:40px">绝对贫困人群：</div>
                  </el-col>
                  <el-col :span="10">
                      <el-form-item label="受捐金额">
                          <el-input placeholder="请输入受捐金额" v-model="form.configs[0].quantity"></el-input>
                      </el-form-item>
                  </el-col>
                  <el-col :span="10">
                      <el-form-item label="受捐人数">
                          <el-input placeholder="请输入受捐人数" v-model="form.configs[0].amount"></el-input>
                      </el-form-item>
                  </el-col>
              </el-row>
              <el-row>
                  <el-col :span="4">
                      <div style="line-height:40px">相对贫困人群：</div>
                  </el-col>
                  <el-col :span="10">
                      <el-form-item label="受捐金额">
                          <el-input placeholder="请输入受捐金额" v-model="form.configs[1].quantity"></el-input>
                      </el-form-item>
                  </el-col>
                  <el-col :span="10">
                      <el-form-item label="受捐人数">
                          <el-input placeholder="请输入受捐人数" v-model="form.configs[1].amount"></el-input>
                      </el-form-item>
                  </el-col>
              </el-row>
              <el-row>
                  <el-col :span="4">
                      <div style="line-height:40px">低收入人群：</div>
                  </el-col>
                  <el-col :span="10">
                      <el-form-item label="受捐金额">
                          <el-input placeholder="请输入受捐金额" v-model="form.configs[2].quantity"></el-input>
                      </el-form-item>
                  </el-col>
                  <el-col :span="10">
                      <el-form-item label="受捐人数">
                          <el-input placeholder="请输入受捐人数" v-model="form.configs[2].amount"></el-input>
                      </el-form-item>
                  </el-col>
              </el-row>
              <el-row>
                  <el-col :span="4">
                      <div style="line-height:40px">一般收入人群：</div>
                  </el-col>
                  <el-col :span="10">
                      <el-form-item label="受捐金额">
                          <el-input placeholder="请输入受捐金额" v-model="form.configs[3].quantity"></el-input>
                      </el-form-item>
                  </el-col>
                  <el-col :span="10">
                      <el-form-item label="受捐人数">
                          <el-input placeholder="请输入受捐人数" v-model="form.configs[3].amount"></el-input>
                      </el-form-item>
                  </el-col>
              </el-row>
              <el-form-item style="text-align:center" label-width="0">
                  <el-button @click="previous">上一步</el-button>
                  <el-button @click="next">下一步</el-button>
              </el-form-item>
          </el-form>
          <el-form v-if="active === 3" >
              <div style="margin-top: 24px;padding: 24px 40px;margin-bottom:24px;background-color: #fafafa;">
                  <el-row class="row-item">
                      <div class="label">活动主题</div>
                      <div class="value">{{form.theme}}</div>
                  </el-row>
                  <el-row class="row-item">
                      <div class="label">活动描述</div>
                      <div class="value">{{form.description}}</div>
                  </el-row>
                  <el-row class="row-item">
                      <div class="label">活动时间</div>
                      <div class="value">{{timeFormat(form.startTime)}} - {{timeFormat(form.endTime)}}</div>
                  </el-row>
                  <el-row class="row-item">
                      <div class="label">计划配置</div>
                      <div class="value">
                          <el-row>
                              <el-col :span="12">绝对贫困人口:</el-col>
                              <el-col :span="12">{{form.configs[0].quantity}}元 x {{form.configs[0].amount}}人</el-col>
                          </el-row>
                          <el-row>
                              <el-col :span="12">相对贫困人口:</el-col>
                              <el-col :span="12">{{form.configs[1].quantity}}元 x {{form.configs[1].amount}}人</el-col>
                          </el-row>
                          <el-row>
                              <el-col :span="12">低收入人口:</el-col>
                              <el-col :span="12">{{form.configs[2].quantity}}元 x {{form.configs[2].amount}}人</el-col>
                          </el-row>
                          <el-row>
                              <el-col :span="12">一般收入人口:</el-col>
                              <el-col :span="12">{{form.configs[3].quantity}}元 x {{form.configs[3].amount}}人</el-col>
                          </el-row>
                      </div>
                  </el-row>
                  <el-row class="row-item">
                      <div class="label">总计</div>
                      <div class="value">{{totalPlan}}元</div>
                  </el-row>
              </div>
              <el-form-item style="text-align:center" label-width="0">
                  <el-button @click="previous">上一步</el-button>
                  <el-button type="primary" @click="submit">提交</el-button>
              </el-form-item>
          </el-form>
      </el-dialog>
      <el-dialog
          width="40%"
          top="3vh"
          title="分发金额"
          :visible.sync="assignDialogVisible">
              <el-form>
                  <el-form-item label="绝对贫困人群">
                      {{assignData.plans[0].configs[0].quantity}}元 x {{assignData.plans[0].configs[0].amount}}人
                      <el-select style="width:90%" multiple v-model="assignForm.configs[0].donatoryIds" :multiple-limit="assignData.plans[0].configs[0].amount" placeholder="请选择受捐人" filterable>
                          <el-option
                            v-for="item in options1"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                      </el-select>
                  </el-form-item>
                  <el-form-item label="相对贫困人群">
                      {{assignData.plans[0].configs[1].quantity}}元 x {{assignData.plans[0].configs[1].amount}}人
                      <el-select style="width:90%" multiple v-model="assignForm.configs[1].donatoryIds" :multiple-limit="assignData.plans[0].configs[1].amount" placeholder="请选择受捐人" filterable>
                          <el-option
                            v-for="item in options2"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                      </el-select>
                  </el-form-item>
                  <el-form-item label="低收入人群">
                      {{assignData.plans[0].configs[2].quantity}}元 x {{assignData.plans[0].configs[2].amount}}人
                      <el-select style="width:90%" multiple v-model="assignForm.configs[2].donatoryIds" :multiple-limit="assignData.plans[0].configs[2].amount" placeholder="请选择受捐人" filterable>
                          <el-option
                            v-for="item in options3"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                      </el-select>
                  </el-form-item>
                  <el-form-item label="一般收入人群">
                      {{assignData.plans[0].configs[3].quantity}}元 x {{assignData.plans[0].configs[3].amount}}人
                      <el-select style="width:90%" multiple v-model="assignForm.configs[3].donatoryIds" :multiple-limit="assignData.plans[0].configs[3].amount" placeholder="请选择受捐人" filterable>
                          <el-option
                            v-for="item in options4"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                      </el-select>
                  </el-form-item>
                  <el-form-item>
                      <div style="text-align:center">
                          <el-button type="primary" @click="handleSubmitAssign">指派</el-button>
                      </div>
                  </el-form-item>
              </el-form>
          </el-dialog>
  </div>
</template>

<script>
import {
    getActivity,
    getActivityDetail,
    allocation,
    submitActivity,
    getDonatory,
    submitAssign,
    getDonateStock
} from '@/API';
import {timerFormat} from '@/utils';
import moment from 'moment';

export default {
    name: 'activity',
    data() {
        return {
            columns: [{
                text: '活动主题',
                value: 'theme'
            }, {
                text: '活动描述',
                value: 'description'
            }, {
                text: '活动开始时间',
                value: 'startTime',
                formatter: row => {
                    return timerFormat(row.startTime).replace(/&nbsp;/g, ' ');
                }
            }, {
                text: '活动结束时间',
                value: 'endTime',
                formatter: row => {
                    return timerFormat(row.endTime).replace(/&nbsp;/g, ' ');
                }
            }],
            loading: false,
            editDialogVisible: false,
            detailDialogVisible: false,
            assignDialogVisible: false,
            total: 0,
            pageSize: 10,
            pageNo: 1,
            currentIndex: 0,
            data: [],
            detailData: [],
            form: {
                type: '1',
                unit: '元',
                name: '善款',
                configs: [{
                    quantity: '',
                    amount: '',
                    donatoryLevel: 1
                }, {
                    quantity: '',
                    amount: '',
                    donatoryLevel: 2
                }, {
                    quantity: '',
                    amount: '',
                    donatoryLevel: 3
                }, {
                    quantity: '',
                    amount: '',
                    donatoryLevel: 4
                }]
            },
            assignForm: {
                configs: [
                    {
                        donatoryIds: []
                    },
                    {
                        donatoryIds: []
                    },
                    {
                        donatoryIds: []
                    },
                    {
                        donatoryIds: []
                    }
                ]
            },
            active: 0,
            options1: [],
            options2: [],
            options3: [],
            options4: [],
            activityId: '',
            totalMoney: '',
            assignData: {
                plans: [
                    {
                        configs: [
                            {
                                amount: ''
                            },
                            {
                                amount: ''
                            },
                            {
                                amount: ''
                            },
                            {
                                amount: ''
                            }
                        ]
                    }
                ]
            }
        };
    },
    created() {
        this.getActivityData();
        this.getDonatoryData();
        this.getStockData();
    },
    computed: {
        totalPlan() {
            return this.form.configs.map(item => item.quantity * item.amount).reduce((acc, cur) => acc + cur);
        }
    },
    methods: {
        // 获取活动数据
        async getActivityData() {
            const {data} = await getActivity({
                pageNo: this.pageNo,
                pageSize: this.pageSize
            });
            this.data = data.dataList;
            this.total = data.total;
        },
        // 获取捐款金额
        async getStockData() {
            let token = localStorage.getItem('donateToken');
            const {data} = await getDonateStock(token);
            this.totalMoney = data;
        },
        handleCurrentChange(val) {
            this.pageNo = val;
            this.getDonateData();
        },
        timeFormat(value) {
            return moment(value).format('YYYY-MM-DD hh:mm:ss');
        },
        timeFormatChinese(value) {
            return moment(value).format('LL');
        },
        // 获取受捐者
        async getDonatoryData() {
            const res1 = await getDonatory({level: 1});
            const res2 = await getDonatory({level: 2});
            const res3 = await getDonatory({level: 3});
            const res4 = await getDonatory({level: 4});
            this.options1 = res1.data;
            this.options2 = res2.data;
            this.options3 = res3.data;
            this.options4 = res4.data;
        },
        handleAdd() {
            this.active = 0;
            this.editDialogVisible = true;
        },
        next() {
            if (this.active++ > 2) {
                this.active = 0;
            }
        },
        previous() {
            this.active--;
        },
        // 调拨
        async handleAllocation(id) {
            let token = localStorage.getItem('donateToken');
            const {status, msg} = await allocation(id, token);
            if (status === 0) {
                this.$message.success('调拨成功');
                this.getActivityData();
            } else {
                this.$message.error(msg);
            }
        },
        // 提交活动
        async submit() {
            const {
                theme,
                desc,
                description,
                startTime,
                endTime,
                type,
                unit,
                name,
                configs
            } = this.form;
            let quantity = configs.map(item => item.quantity * item.amount).reduce((acc, cur) => acc + cur);
            let config = configs.filter(item => item.amount !== '');
            let formData = {
                theme,
                description: desc,
                startTime,
                endTime,
                activityPlanReqList: [{
                    description,
                    type,
                    unit,
                    quantity,
                    name,
                    amount: quantity,
                    needPurchase: 0,
                    configs: config
                }]
            };
            let {status, msg} = await submitActivity({...formData});
            if (status === 0) {
                this.$message.success('创建成功');
                this.getActivityData();
                this.editDialogVisible = false;
            } else {
                this.$message.error(msg);
            }
        },
        // 获取活动详情
        async handleAssign(id) {
            const {data} = await getActivityDetail(id);
            this.activityId = data.id;
            this.planId = data.plans[0].id;
            this.assignForm.configs = data.plans[0].configs;
            this.assignData = data;
            this.assignDialogVisible = true;
        },
        async handleSubmitAssign() {
            let requestBody = {
                activityId: this.activityId,
                plans: [{
                    planId: this.planId,
                    configs: this.assignForm.configs
                }]
            };
            let token = localStorage.getItem('donateToken');
            let {status, msg} = await submitAssign(requestBody, token);
            if (status === 0) {
                this.$message.success('指派成功');
                this.getActivityData();
                this.assignDialogVisible = false;
            } else {
                this.$message.error(msg);
            }
        }
    }
};
</script>

<style lang="stylus" scoped>
.activity-index
    section
        background #FFF
        padding 24px
    .plan-list
        margin-bottom 16px
    .row-item
        padding-bottom 16px
        display flex
        .label
            width 120px
        .value
            width 100%
</style>
