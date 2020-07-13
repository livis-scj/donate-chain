<template>
  <el-container>
    <el-header>
      <span class="header-title">扶贫捐赠信息追溯服务平台</span>
      <el-popover
        placement="bottom"
        ref="popover"
        trigger="hover"
        popper-class="popper-sign-out"
        v-if="user && user.userName">
        <el-button type="info" plain @click="signOut()" class="sign-out-button">退出</el-button>
        <el-button slot="reference" type="primary" @click="openDialog('signInForm')">{{buttonText}}</el-button>
      </el-popover>
      <el-button v-if="!user || !user.userName" type="primary" @click="openDialog('signInForm')">{{buttonText}}</el-button>
    </el-header>
    <el-main>
      <el-carousel :interval="4000" type="card">
        <el-carousel-item v-for="item in 6" :key="item">
          <h3 class="medium">{{ item }}</h3>
        </el-carousel-item>
      </el-carousel>
      <div>
        <el-input v-model="input" placeholder="请输入内容"></el-input>
        <el-button type="primary" icon="el-icon-search">搜索</el-button>
      </div>
      <div>
        <div class="infinite-list-wrapper" style="overflow:auto">
          <ul
            class="list"
            v-infinite-scroll="load"
            infinite-scroll-disabled="disabled">
            <li v-for="(i, index) in count" v-bind:key="index" class="list-item">{{ i }}</li>
            <li v-if="loading">加载中...</li>
            <li v-if="noMore">没有更多了</li>
          </ul>
        </div>
        <div class="infinite-list-wrapper" style="overflow:auto">
          <ul
            class="list"
            v-infinite-scroll="load"
            infinite-scroll-disabled="disabled">
            <li v-for="(i, index) in count" v-bind:key="index" class="list-item">{{ i }}</li>
            <li v-if="loading">加载中...</li>
            <li v-if="noMore">没有更多了</li>
          </ul>
        </div>
        <div class="infinite-list-wrapper" style="overflow:auto">
          <ul
            class="list"
            v-infinite-scroll="load"
            infinite-scroll-disabled="disabled">
            <li v-for="(i, index) in count" v-bind:key="index" class="list-item">{{ i }}</li>
            <li v-if="loading">加载中...</li>
            <li v-if="noMore">没有更多了</li>
          </ul>
        </div>
      </div>
      <div class="footer"><div class="m-report-foot page">京公网安备案11000002000001号 ©2020 Baidu <a href="https://www.baidu.com/duty" target="_blank">使用百度前必读</a></div></div>
    </el-main>
    <el-dialog title="登 录" :visible.sync="dialogFormVisible" center width="428px" @close="closDialog('signInForm')" :close-on-click-modal="false">
      <el-form :model="form" ref="signInForm" :rules="rules">
        <el-form-item label="账 号" :label-width="formLabelWidth" required prop="userName">
          <el-input v-model="form.userName" placeholder="请输入账号" autocomplete="on" clearable @input="clearError" @clear="clearError"></el-input>
        </el-form-item>
        <el-form-item label="密 码" :label-width="formLabelWidth" required prop="password">
          <el-input placeholder="请输入密码" v-model="form.password" show-password clearable @input="clearError" @clear="clearError"></el-input>
        </el-form-item>
      </el-form>
      <div>
        <transition><span class="error-message">{{errMessage}}</span></transition>
        <el-button type="text" class="forget-password">忘记密码</el-button>
      </div>
      <el-dialog
        :close-on-click-modal="false"
        width="428px"
        center
        title="注 册"
        :visible.sync="innerVisible"
        @close="closDialog('registerForm')"
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
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closDialog('registerForm')" size="medium">取 消</el-button>
          <el-button type="primary" @click="signIn('registerForm')" :loading="buttonLoading" size="medium">提 交</el-button>
        </div>
      </el-dialog>
      <div slot="footer" class="dialog-footer">
        <el-button @click="innerVisible = true" size="medium">注 册</el-button>
        <el-button type="primary" @click="signIn('signInForm')" :loading="buttonLoading" size="medium">登 录</el-button>
      </div>
    </el-dialog>
  </el-container>
</template>

<script>
import {dataConfig} from './data.js';
import axios from '../http';

export default {
    data () {
        let checkRepassword = (rule, value, callback) => {
            if (value !== this.registerForm.password) {
                return callback(new Error('两次输入密码必须相同'));
            }
            return callback();
        };
        return {
            count: 10,
            loading: false,
            dataConfig,
            dialogFormVisible: false,
            innerVisible: false,
            formLabelWidth: '60px',
            form: {
                userName: '',
                password: ''
            },
            user: null,
            buttonLoading: false,
            input: '',
            errMessage: '',
            popoverVisible: false,
            rules: {
                userName: [
                    { required: true, message: '账号为必填', trigger: 'blur' },
                    { min: 3, max: 16, message: '账号长度在 3 到 16 个字符', trigger: 'blur' },
                    { required: true, message: '账号为必填', trigger: 'change' }
                ],
                password: [
                    { required: true, message: '密码为必填', trigger: 'blur' },
                    { min: 3, max: 16, message: '密码长度在 3 到 16 个字符', trigger: 'blur' },
                    { required: true, message: '密码为必填', trigger: 'blur' },
                    { required: true, message: '密码为必填', trigger: 'change' }
                ]
            },
            registerForm: {
                userName: '',
                password: '',
                repassword: '',
                name: ''
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
                ]
            }
        };
    },
    computed: {
        noMore () {
            return this.count >= 20;
        },
        disabled () {
            return this.loading || this.noMore;
        },
        buttonText () {
            console.log(this.user);
            console.log(this.user && this.user.name);
            return (this.user && this.user.userName) || '登录/注册';
        }
    },
    methods: {
        load () {
            this.loading = true;
            setTimeout(() => {
                this.count += 2;
                this.loading = false;
            }, 2000);
        },
        closDialog (formName) {
            if (formName === 'signInForm') {
                this.dialogFormVisible = false;
                this.form = {
                    userName: '',
                    password: ''
                };
            } else if (formName === 'registerForm') {
                this.innerVisible = false;
                this.registerForm = {
                    userName: '',
                    password: '',
                    repassword: '',
                    name: ''
                };
            }
        },
        openDialog(formName) {
            console.log(formName);
            console.log(this.user);
            console.log(this.user && this.user.userName);
            if (formName === 'signInForm') {
                if (this.user && this.user.userName) {
                    this.popoverVisible = !this.popoverVisible;
                } else {
                    this.dialogFormVisible = true;
                }
            } else if (formName === 'registerForm') {
                this.innerVisible = true;
            }
        },
        signOut () {
            this.user = null;
        },
        signIn (formName) {
            console.log('signIn');
            console.log(formName);
            this.buttonLoading = true;
            this.$refs[formName].validate((valid) => {
                this.buttonLoading = false;
                console.log(valid);
                if (valid) {
                    console.log(formName);
                    if (formName === 'signInForm') {
                        const userName = this.form.userName;
                        const password = this.form.password;
                        this.dataConfig.forEach(item => {
                            if (item.userName === userName && item.password === password) {
                                this.user = item;
                                this.closDialog('signInForm');
                            }
                        });
                        if (!this.user) {
                            this.errMessage = '账号/密码错误';
                        }
                    } else if (formName === 'registerForm') {
                        console.log({...this.registerForm});
                        axios.post('/api/donor/register', {...this.registerForm}).then(res => {
                            if (+res.status === 0) {
                                this.closDialog('registerForm');
                                this.$message({
                                    message: '注册成功',
                                    type: 'success'
                                });
                            } else {
                                this.$message({
                                    message: res.msg,
                                    type: 'error'
                                });
                            }
                        });
                    }
                } else {
                    return false;
                }
            });
        },
        clearError () {
            this.errMessage = '';
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
    button {
      position: absolute;
      right: 22px;
      top: 50%;
      width: 102px;
      transform: translateY(-50%);
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
    .el-carousel {
      margin-bottom: 60px;
      .el-carousel__item:nth-child(2n) {
        background-color: #99a9bf;
      }
      .el-carousel__item:nth-child(2n+1) {
        background-color: #d3dce6;
      }
      .el-carousel__item h3 {
        color: #475669;
        font-size: 18px;
        opacity: 0.75;
        line-height: 300px;
        margin: 0;
      }
    }
    .el-input {
      display: inline-block;
      width: 60%;
      margin-right: 30px;
      margin-bottom: 60px;
    }
    .infinite-list-wrapper {
      display: inline-block;
      width: calc(100% / 3 - 4px);
      background-color: #fff;
      .list {
        list-style: none;
        padding: 0;
        overflow: auto;
        height: 300px;
        .list-item {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 50px;
          background: #e8f3fe;
          margin: 10px;
          color: #7dbcfc;
        }
      }
    }
    .footer {
      margin-top: 10px;
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
  .el-dialog__wrapper {
    .el-dialog__body {
      padding-bottom: 10px;
      .error-message {
        color: #fc4343;
        margin-left: 60px;
      }
      .forget-password {
        padding: 0;
        position: absolute;
        right: 25px;
      }
    }
    .dialog-footer {
      button {
        width: 100px;
        &:nth-child(2) {
          margin-left: 20px;
        }
      }
    }
  }
  .popper-sign-out {
    width: 120px;
    min-width: 120px;
    .sign-out-button {
      position: relative;
      left: 50%;
      width: 100px;
      transform: translateX(-50%);
    }
  }
</style>
