<template>
  <div>
    <el-popover
      placement="bottom"
      ref="popover"
      trigger="hover"
      popper-class="popper-sign-out"
      v-if="token">
      <el-button type="info" plain @click="signOut()" class="sign-out-button">退出</el-button>
      <el-button slot="reference" type="primary" @click="openDialog('signInForm')" class="sign-in-button">{{buttonText}}</el-button>
    </el-popover>
    <el-button v-if="!token" type="primary" @click="openDialog('signInForm')" class="sign-in-button">{{buttonText}}</el-button>
    <el-dialog title="登 录" :visible.sync="dialogFormVisible" center width="428px" @close="closDialog('signInForm')" :close-on-click-modal="false">
      <el-form :model="form" ref="signInForm" :rules="rules">
        <el-form-item label="账 号" :label-width="formLabelWidth" required prop="userName">
          <el-input v-model="form.userName" placeholder="请输入账号" autocomplete="on" clearable @input="clearError" @clear="clearError"></el-input>
        </el-form-item>
        <el-form-item label="密 码" :label-width="formLabelWidth" required prop="password">
          <el-input placeholder="请输入密码" v-model="form.password" show-password clearable @input="clearError" @clear="clearError"></el-input>
        </el-form-item>
      </el-form>
      <el-button type="text" class="forget-password">忘记密码</el-button>
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
          <el-form-item label="身份证号" :label-width="formLabelWidth" required prop="idcard">
            <el-input placeholder="请输入身份证号" v-model="registerForm.idcard" clearable></el-input>
          </el-form-item>
          <el-form-item label="手机号" :label-width="formLabelWidth" required prop="mobil">
            <el-input placeholder="请输入手机号" v-model="registerForm.mobil" clearable></el-input>
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
  </div>
</template>

<script>
import axios from '../http.js';
import {getToken} from '../utils/index.js'

export default {
    name: 'SignInButton',
    data () {
        let checkRepassword = (rule, value, callback) => {
            if (value !== this.registerForm.password) {
                return callback(new Error('两次输入密码必须相同'));
            }
            return callback();
        };
        return {
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
                name: '',
                idcard: '',
                mobile: ''
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
            dialogFormVisible: false,
            innerVisible: false,
            formLabelWidth: '80px',
            form: {
                userName: '',
                password: ''
            },
            token: null,
            account: '',
            buttonLoading: false
        };
    },
    computed: {
        buttonText () {
            return this.account || '登录/注册';
        }
    },
    mounted () {
        this.checkSignIn();
    },
    methods: {
        checkSignIn() {
            const accountToken = getToken(this);
            this.account = accountToken.account;
            this.token = accountToken.token;
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
                    name: '',
                    idcard: '',
                    mobile: ''
                };
            }
        },
        openDialog(formName) {
            const accountToken = getToken(this);
            const token = accountToken.token;
            if (formName === 'signInForm') {
                if (token) {
                    this.popoverVisible = !this.popoverVisible;
                } else {
                    this.dialogFormVisible = true;
                }
            } else if (formName === 'registerForm') {
                if (!token) {
                    this.innerVisible = true;
                }
            }
        },
        signOut () {
            this.token = null;
            this.account = null;
            const cookiePath = '/' + location.pathname.split('/')[1];
            this.$cookies.remove(`${cookiePath.slice(1)}token`, cookiePath);
        },
        signIn (formName) {
            this.buttonLoading = true;
            this.$refs[formName].validate((valid) => {
                this.buttonLoading = false;
                if (valid) {
                    if (formName === 'signInForm') {
                        this.form.mobile = '111';
                        this.form.username = this.form.userName;
                        axios.post('/api/donor/login', {...this.form}).then(res => {
                            console.log(res);
                            if (+res.status === 0) {
                                this.$message({
                                    message: '登录成功',
                                    type: 'success'
                                });
                                this.token = res.data.token;
                                this.account = this.form.userName;
                                const cookiePath = '/' + location.pathname.split('/')[1];
                                this.$cookies.set(`${cookiePath.slice(1)}token`, `${data.userName} ${data.token} ${data.userId} ${data.name}, '1d', cookiePath);
                                this.closDialog('signInForm');
                            } else {
                                this.$message({
                                    message: res.msg,
                                    type: 'error'
                                });
                            }
                        });
                    } else if (formName === 'registerForm') {
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
                                this.errMessage = res.msg;
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style  lang="stylus">
.el-header {
  .sign-in-button {
    background: #404040;
    border-color: #404040;
    position: absolute;
    right: 22px;
    top: 50%;
    width: 102px;
    transform: translateY(-50%);
    &:hover {
      background: #686868;
      border-color: #686868;
    }
  }
}
.el-dialog__wrapper {
  .el-dialog__body {
    padding-bottom: 10px;
    .el-form-item__label {
      text-align: left;
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
