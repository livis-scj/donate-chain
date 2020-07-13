<template>
  <div>
      <h1>新建捐赠</h1>
      <el-form ref="form" :model="form" label-width="140px" label-position="left">
          <el-form-item label="捐赠人id" prop="donorId" required>
              <el-input v-model="form.donorId" placeholder="请输入捐赠人id"></el-input>
          </el-form-item>
          <div
              v-for="(item, index) in form.details"
              :key="item.key">
              <el-form-item
                label="物资名称"
                :prop="'item.' + index + '.name'"
                required>
                  <el-input v-model="item.name" placeholder="请输入物资名称"></el-input>
              </el-form-item>
              <el-form-item
                label="捐赠类别"
                :prop="'item.' + index + '.type'"
                required>
                  <el-select v-model="item.type" placeholder="请选择捐赠类型">
                      <el-option label="钱" value="1"></el-option>
                      <el-option label="物品" value="2"></el-option>
                  </el-select>
              </el-form-item>
              <el-form-item
                label="捐赠单位"
                :prop="'item.' + index + '.unit'"
                required>
                  <el-input v-model="item.unit" placeholder="请输入捐赠单位"></el-input>
              </el-form-item>
              <el-form-item
                label="捐赠数量"
                :prop="'item.' + index + '.quantity'"
                required>
                  <el-input v-model="item.quantity" placeholder="请输入捐赠数量"></el-input>
              </el-form-item>
              <div style="text-align: right;">
                  <el-button @click.prevent="removeDonate(item)" :disabled="form.details.length === 1">删除</el-button>
              </div>
          </div>
          <el-form-item>
              <el-button type="primary" :loading="loading" @click="onSubmit">立即创建</el-button>
              <el-button @click="addDonate">新增物资</el-button>
          </el-form-item>
      </el-form>
  </div>
</template>

<script>
import {submitDonate} from '@/API';

export default {
    name: 'donate',
    data() {
        return {
            form: {
                donorId: '',
                details: [
                    {
                        key: Date.now(),
                        name: '',
                        type: '',
                        unit: '',
                        quantity: ''
                    }
                ]
            },
            loading: false
        };
    },
    methods: {
        addDonate() {
            this.form.details.push({
                name: '',
                type: '',
                unit: '',
                quantity: '',
                key: Date.now()
            });
        },
        removeDonate(item) {
            let index = this.form.details.indexOf(item);
            if (index !== -1) {
                this.form.details.splice(index, 1);
            }
        },
        async onSubmit() {
            console.log(this.form);
            this.loading = true;
            let {status, msg} = await submitDonate({
                ...this.form
            });
            if (status === 0) {
                this.$message.success('添加成功！');
                this.$refs.form.resetFields();
                // this.$router.push('/');
            } else {
                this.$message.error(msg);
            }
            this.loading = false;
        }
    }
};
</script>
