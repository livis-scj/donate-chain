<template>
  <div>
      <el-form ref="form" :rules="rules" :model="form" label-width="140px" label-position="left">
          <el-form-item label="物资名称" prop="name" required>
              <el-input v-model="form.name" placeholder="请输入物资名称"></el-input>
          </el-form-item>
          <el-form-item label="捐赠类型" prop="type" required>
              <el-select v-model="form.type" placeholder="请选择捐赠类型">
                  <el-option label="钱" value="1"></el-option>
                  <el-option label="物品" value="2"></el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="捐赠单位" prop="unit" required>
              <el-input v-model="form.unit" placeholder="请输入捐赠单位"></el-input>
          </el-form-item>
          <el-form-item label="捐赠数量" prop="quantity" required>
              <el-input v-model="form.quantity" placeholder="请输入捐赠数量"></el-input>
          </el-form-item>
          <el-form-item>
              <el-button type="primary" :loading="loading" @click="onSubmit">立即创建</el-button>
              <el-button>取消</el-button>
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
                name: '',
                type: '',
                unit: '',
                quantity: ''
            },
            rules: {
                name: [
                    {required: true, message: '请输入物资名称', trigger: 'blur'},
                    {min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'}
                ],
                type: [
                    {required: true, message: '请选择捐赠类型', trigger: 'blur'}
                ],
                unit: [
                    {required: true, message: '请输入捐赠单位', trigger: 'blur'},
                    {min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'}
                ],
                quantity: [
                    {required: true, message: '请输入捐赠数量', trigger: 'blur'},
                    {min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'}
                ]
            },
            loading: false
        };
    },
    methods: {
        onSubmit() {
            this.loading = true;
            this.$refs.form.validate(async valid => {
                if (valid) {
                    let {status, msg} = await submitDonate({
                        ...this.form,
                        donorId: 0
                    });
                    if (status === 0) {
                        this.$message.success('添加成功！');
                        this.$refs.form.resetFields();
                        // this.$router.push('/');
                    } else {
                        this.$message.error(msg);
                    }
                } else {
                    return false;
                }
                this.loading = false;
            });
        }
    }
};
</script>
