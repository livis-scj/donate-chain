<template>
    <div class="receive-login">
        <div class="container">
            <div class="top">
                <div class="header">
                    扶贫领用服务平台
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
                            <el-form-item prop="mobilePassword" required>
                                <el-input @keyup.enter.native="handleLogin"  prefix-icon="el-icon-lock" show-password v-model="form.mobilePassword" placeholder="请输入密码"></el-input>
                            </el-form-item>
                        </el-tab-pane>
                    </el-tabs>
                    <div style="text-align:right;margin-bottom:20px;color:#666;font-size:12px">
                        <span>修改密码</span>
                        <span>忘记密码</span>
                    </div>
                    <el-form-item>
                        <el-button type="primary" :loading="loading" @click="handleLogin" style="width:100%">登录</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="footer">
                <div class="copyright">
                    <span>扶贫领用信息平台</span>
                    <span>Copyright 2020 © 百度智能小程序研发部出品</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {receiveLogin} from '@/API';
import {getToken, getPath} from '../../utils/index.js';

export default {
    data() {
        let checkPassword = (rule, value, callback) => {
            console.log('checkPassword');
            console.log(this.activeName);
            if (this.activeName === 'second') {
                if (rule.name === 'userName' && !value) {
                    return callback(new Error(rule.message));
                }
                if (rule.name === 'password' && !value) {
                    return callback(new Error(rule.message));
                }
            } else if (this.activeName === 'user') {
                if (rule.name === 'mobilePassword' && !value) {
                    return callback(new Error(rule.message));
                }
                if (rule.name === 'mobile' && !value) {
                    return callback(new Error(rule.message));
                }
            }
            return callback();
        };
        return {
            form: {
            },
            loading: false,
            activeName: 'user',
            token: null,
            rules: {
                userName: {name: 'userName', required: true, message: '请输入用户名', validator: checkPassword, trigger: 'blur'},
                password: {name: 'password', required: true, message: '请输入密码', validator: checkPassword, trigger: 'blur'},
                mobilePassword: {name: 'mobilePassword', required: true, message: '请输入密码', validator: checkPassword, trigger: 'blur'},
                mobile: {name: 'mobile', required: true, message: '请输入手机号', validator: checkPassword, trigger: 'blur'}
            }
        };
    },
    mounted () {
        this.signInPersistence();
    },
    methods: {
        signInPersistence() {
            const {token = ''} = getToken(this);

            if (token) {
                this.$router.push('/receive/list');
            }
        },
        async handleLogin() {
            this.loading = true;
            let form = {};
            if (this.activeName === 'second') {
                form.mobile = this.form.mobile;
                form.mobilePassword = this.form.mobilePassword;
            } else if (this.activeName === 'user') {
                form.userName = this.form.userName;
                form.password = this.form.password;
            }
            console.log(form);
            const {status, data, msg} = await receiveLogin({...this.form});
            if (status === 0) {
                this.$message.success('登录成功');
                this.token = data.token;
                const cookiePath = getPath();
                this.$cookies.set(`${cookiePath.slice(1)}token`, `${data.userName} ${data.token} ${data.userId} ${data.name}`, '1d', '/');
                this.$router.push('/receive/list');
            } else {
                this.$message.error(msg);
            }
            this.loading = false;
        }
    }
};
</script>

<style lang="stylus">
.receive-login
    height 100%
    .container
        min-height 100%
        min-width: 920px;
        background url('https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=3513678586,4083043895&fm=26&gp=0.jpg') no-repeat 50%
        background-size: 100%
        background-position: 0 185px;
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
        .footer {
            position: absolute;
            bottom: 60px;
            left: 50%;
            transform: translateX(-50%);
            color: rgba(0,0,0,0.45);
        }
</style>
