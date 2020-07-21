<template>
    <div class="login">
        <div class="container">
            <div class="top">
                <div class="header">
                    扶贫调拨管理平台
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
                    </el-tabs>
                    <div style="text-align:right;margin-bottom:20px;color:#666;font-size:12px">
                        <span>注册</span>
                        <span>忘记密码</span>
                    </div>
                    <el-form-item>
                        <el-button type="primary" :loading="loading" @click="handleLogin" style="width:100%">登录</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="footer"></div>
        </div>
    </div>
</template>

<script>
import {adminLogin} from '@/API';
export default {
    data() {
        return {
            form: {
            },
            codeDisabled: false,
            countdown: 60,
            codeMsg: '获取验证码',
            timer: null,
            loading: false,
            activeName: 'user',
            rules: {
                userName: {required: true, message: '请输入用户名', trigger: 'blur'},
                password: {required: true, message: '请输入密码', trigger: 'blur'},
                mobile: {required: true, message: '请输入手机号', trigger: 'blur'}
            }
        };
    },
    methods: {
        async handleLogin() {
            this.loading = true;
            const {status, data, msg} = await adminLogin({...this.form});
            if (status === 0) {
                this.$message.success('登录成功');
                await this.$store.dispatch('setUserInfo', data);
                localStorage.setItem('donateToken', data.token);
                this.$router.push('/activity/index');
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
