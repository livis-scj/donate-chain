<template>
  <div>
      <el-button type="primary" @click="handleAdd">新增活动</el-button>
      <el-table :data="data">
          <el-table-column
              v-for="(item,index) in columns"
              :key="index"
              :prop="item.value"
              :label="item.text"
              :formatter="item.formatter"
              :min-width="item.width">
          </el-table-column>
          <el-table-column label="操作">
              <el-button type="text">详情</el-button>
              <el-button type="text">编辑</el-button>
              <el-button type="text">删除</el-button>
          </el-table-column>
      </el-table>
      <el-drawer
          :title="({edit:'编辑活动',add:'添加活动'})[formType]"
          size="40%"
          :visible.sync="editDialogVisible">
          <el-form :model="form">
              <el-row>
                  <el-col :span="20">
                      <el-form-item label="活动主题" label-width="140px">
                          <el-input v-model="form.theme" autocomplete="off"></el-input>
                      </el-form-item>
                  </el-col>
              </el-row>
              <el-row>
                  <el-col :span="20">
                      <el-form-item label="活动描述" label-width="140px">
                          <el-input v-model="form.description" autocomplete="off"></el-input>
                      </el-form-item>
                  </el-col>
              </el-row>
              <el-row>
                  <el-col :span="20">
                      <el-form-item label="活动时间" label-width="140px">
                          <el-date-picker
                            v-model="form.date"
                            type="datetimerange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                          </el-date-picker>
                      </el-form-item>
                  </el-col>
              </el-row>
              <el-row>
                  <el-col :span="20">
                      <el-form-item
                        v-for="(item, index) in form.activityPlanReqList"
                        :label="'域名' + index"
                        :key="item.key"
                        :prop="'item.' + index + '.value'"
                      >
                          <el-input v-model="item.value"></el-input><el-button @click.prevent="removeDomain(domain)">删除</el-button>
                      </el-form-item>
                  </el-col>
              </el-row>
              <el-row>
                  <el-col>
                      <el-form-item>
                          <el-button type="primary">提交</el-button>
                          <el-button @click="addDomain">新增域名</el-button>
                      </el-form-item>
                  </el-col>
              </el-row>
          </el-form>
      </el-drawer>
  </div>
</template>

<script>
import {getActivity} from '@/API';

export default {
    name: 'donate',
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
                value: 'startTime'
            }, {
                text: '活动结束时间',
                value: 'endTime'
            }],
            loading: false,
            editDialogVisible: false,
            formType: '',
            data: [],
            form: {
                activityPlanReqList: [
                    {
                        value: ''
                    }
                ]
            }
        };
    },
    computed: {
        isEdit() {
            return this.formType === 'edit';
        }
    },
    async created() {
        const {data} = await getActivity();
        this.data = data.dataList;
        this.total = data.total;
    },
    methods: {
        handleAdd() {
            this.formType = 'add';
            this.editDialogVisible = true;
        },
        removeDomain(item) {
            let index = this.form.activityPlanReqList.indexOf(item);
            if (index !== -1) {
                this.form.activityPlanReqList.splice(index, 1);
            }
        },
        addDomain() {
            this.form.activityPlanReqList.push({
                value: '',
                key: Date.now()
            });
        }
    }
};
</script>
