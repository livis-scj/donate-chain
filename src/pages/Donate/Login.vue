<template>
    <div class="login">
        <div class="container">
            <div class="top">
                <div class="header">
                    扶贫捐助信息平台
                </div>
                <div class="desc">打造基于区块链的扶贫溯源信息服务平台，助力扶贫等公益事业更好地传输，为国家和政府降本增效</div>
            </div>
            <div class="main">
                <el-form ref="form" :model="form" :rules="rules">
                    <el-tabs v-model="activeName">
                        <el-tab-pane label="用户登录" name="user">
                            <el-form-item prop="userName" required>
                                <el-input  prefix-icon="el-icon-user" v-model="form.userName" placeholder="请输入用户名"></el-input>
                            </el-form-item>
                            <el-form-item prop="password" required>
                                <el-input @keyup.enter.native="handleLogin"  prefix-icon="el-icon-lock" show-password v-model="form.password" placeholder="请输入密码"></el-input>
                            </el-form-item>
                        </el-tab-pane>
                        <el-tab-pane label="手机号登录" name="second">
                            <el-form-item prop="mobile" required>
                                <el-input  prefix-icon="el-icon-phone" v-model="form.mobile" placeholder="请输入手机号"></el-input>
                            </el-form-item>
                            <el-form-item prop="Captcha" required>
                                <el-row>
                                    <el-col :span="16">
                                        <el-input prefix-icon="el-icon-lock" v-model="form.Captcha" placeholder="验证码"></el-input>
                                    </el-col>
                                    <el-col :span="8" style="text-align:right">
                                        <el-button style="width:100%" @click="getCode" :disabled="codeDisabled">{{codeMsg}}</el-button>
                                    </el-col>
                                </el-row>
                            </el-form-item>
                        </el-tab-pane>
                        <el-tab-pane label="管理员登录" name="admin">
                            <el-form-item prop="userName" required>
                                <el-input  prefix-icon="el-icon-user" v-model="form.userName" placeholder="请输入用户名"></el-input>
                            </el-form-item>
                            <el-form-item prop="password" required>
                                <el-input @keyup.enter.native="handleLogin" prefix-icon="el-icon-lock" show-password v-model="form.password" placeholder="请输入密码"></el-input>
                            </el-form-item>
                        </el-tab-pane>
                    </el-tabs>
                    <div style="text-align:right;margin-bottom:20px;color:#666;font-size:12px">
                        <el-button type="text" @click="innerVisible = true" >注册</el-button>
                        <el-button type="text">忘记密码</el-button>
                    </div>
                    <el-form-item>
                        <el-button type="primary" :loading="loading" @click="handleLogin" style="width:100%">登录</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="footer"></div>
        </div>
        <el-dialog
          :close-on-click-modal="false"
          width="428px"
          title="新增捐赠人"
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
            <el-form-item label="手机号" :label-width="formLabelWidth" required prop="mobile">
              <el-input placeholder="请输入手机号" v-model="registerForm.mobile" clearable></el-input>
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
import {adminLogin, userLogin, regisetrDonator} from '@/API';
export default {
    data() {
        let checkRepassword = (rule, value, callback) => {
            if (value !== this.registerForm.password) {
                return callback(new Error('两次输入密码必须相同'));
            }
            return callback();
        };
        return {
            form: {
            },
            registerForm: {
                userName: '',
                password: '',
                repassword: '',
                name: '',
                idcard: '',
                mobile: ''
            },
            formLabelWidth: '80px',
            codeDisabled: false,
            buttonLoading: false,
            countdown: 60,
            codeMsg: '获取验证码',
            timer: null,
            innerVisible: false,
            loading: false,
            activeName: 'user',
            rules: {
                userName: {required: true, message: '请输入用户名', trigger: 'blur'},
                password: {required: true, message: '请输入密码', trigger: 'blur'},
                mobile: {required: true, message: '请输入手机号', trigger: 'blur'}
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
            }
        };
    },
    methods: {
        // 登录
        async handleLogin() {
            this.loading = true;
            let action = this.activeName === 'user' ? userLogin : adminLogin;
            const {status, data, msg} = await action({...this.form});
            if (status === 0) {
                this.$message.success('登录成功');
                await this.$store.dispatch('setUserInfo', data);
                localStorage.setItem('donateToken', data.token);
                this.$router.push('/donate/list');
            } else {
                this.$message.error(msg);
            }
            this.loading = false;
        },
        getCode() {
            this.codeDisabled = true;
            this.timer = setInterval(() => {
                if (this.countdown > 0 && this.countdown <= 60) {
                    this.countdown--;
                    if (this.countdown !== 0) {
                        this.codeMsg = '重新发送(' + this.countdown + ')';
                    } else {
                        clearInterval(this.timer);
                        this.codeMsg = '获取验证码';
                        this.countdown = 60;
                        this.timer = null;
                        this.codeDisabled = false;
                    }
                }
            }, 1000);
        },
        // 注册
        signIn(formName) {
            this.buttonLoading = true;
            this.$refs[formName].validate(async valid => {
                if (valid) {
                    let {status, msg} = await regisetrDonator({...this.registerForm});
                    if (status === 0) {
                        this.$message.success('添加成功！');
                        this.$refs[formName].resetFields();
                        this.innerVisible = false;
                    } else {
                        this.$message.error(msg);
                    }
                }
                this.buttonLoading = false;
            });
        },
        // 关闭对话框
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
.login
    height 100%
    .container
        min-height 100%
        background url('https://preview.pro.antdv.com/assets/background.a568162c.svg') no-repeat 50%
        background-size: 100%
        padding 110px 0 144px
        position relative
        box-sizing border-box
        .top
            text-align center
            .header
                height 44px
                font-size 33px
                line-height 44px
            .desc
                font-size 14px
                color rgba(0,0,0,.45)
                margin-top 12px
                margin-bottom 40px
        .main
            min-width 260px
            width 368px
            margin 0 auto
</style>
