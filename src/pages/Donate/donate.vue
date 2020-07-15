<template>
  <div>
      <section class="search" v-if="$store.getters.loginId === 9900000">
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
              <span style="line-height:40px;font-size:20px">捐赠详情</span>
              <el-button type="primary" @click="handleAdd">新建捐赠</el-button>
          </div>
          <el-table border :data="donateData" style="margin-top:20px;text-align:center">
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
                      <el-radio label="1">实名</el-radio>
                      <el-radio label="0">匿名</el-radio>
                  </el-radio-group>
              </el-form-item>
              <el-form-item label="捐赠人" prop="donorId" required v-if="$store.getters.loginId === 9900000">
                  <el-select style="width:100%" v-model="form.donorId" placeholder="请选择捐赠人">
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                  </el-select>
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
                label="捐赠数量"
                prop="quantity"
                required>
                  <el-input v-model="form.quantity" placeholder="请输入捐赠数量"></el-input>
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
  </div>
</template>

<script>
import {getDonations, submitDonate, getAllDonators, getDonateTrace} from '@/API';
import {timerFormat} from '@/utils';

export default {
    name: 'donate',
    data() {
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
                    text: '单位',
                    value: 'unit'
                },
                {
                    text: '数量',
                    value: 'quantity'
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
            loading: false,
            donateData: [],
            total: 0,
            pageSize: 10,
            pageNo: 1,
            currentIndex: 0,
            donateDialogVisible: false,
            successDialog: false
        };
    },
    created() {
        this.getDonateData();
        this.getDonatorData();
    },
    methods: {
        async getDonateData() {
            const {status, data, msg} = await getDonations({
                pageNo: this.pageNo,
                pageSize: this.pageSize,
                donorId: this.$store.getters.loginId === 9900000 ? '' : this.$store.getters.loginId
            });
            if (status === 0) {
                this.donateData = data.dataList;
                this.total = data.total;
            } else {
                this.$message.error(msg);
            }
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
                        loginId: this.$store.getters.loginId,
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
                    } else {
                        this.$message.error(msg);
                    }
                    this.donateDialogVisible = false;
                }
                this.loading = false;
            });
        },
        async handleDetail(item) {
            const {data} = await getDonateTrace({certCode: item.certCode});
            console.log(data);
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

</style>
