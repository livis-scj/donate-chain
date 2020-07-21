<template>
    <div style="height:100%">
        <el-container style="min-height:100%">
            <el-container>
                <el-header class="common-header" height="48px">
                    <el-dropdown>
                    <span>用户名：{{account || userName}}</span>
                        <i class="el-icon-setting" style="margin-right: 15px"></i>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item>
                                <div>{{name}}</div>
                                <el-button type="text">修改密码</el-button>
                                <el-button type="text" @click="handleLogout">退出登录</el-button>
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-header>

            <el-main class="common-main">
                <router-view></router-view>
            </el-main>
            <el-footer class="common-footer" height="100px">
                <div class="copyright">
                    <span>{{platname}}</span>
                    <span>Copyright 2020 © 百度智能小程序研发部出品</span>
                </div>
            </el-footer>
            </el-container>
        </el-container>
    </div>
</template>

<script>
import {getToken, getPath} from '../utils/index.js';

export default {
    data() {
        return {
            account: false,
            platname: '',
            userName: this.$store.getters.userInfo.userName,
            name: ''
        };
    },
    mounted() {
        this.initHeader();
        this.name = getToken(this).name;
    },
    methods: {
        initHeader() {
            const {account} = getToken(this);
            const cookiePath = getPath();
            this.account = account;
            if (cookiePath === '/receive') {
                this.platname = '扶贫领取服务平台';
            } else if (cookiePath === '/donate') {
                this.platname = '扶贫捐助信息平台';
            }
        },
        handleLogout() {
            this.$message.success('登出成功');
            const cookiePath = getPath();
            if (cookiePath === '/receive') {
                this.$cookies.remove(`${cookiePath.slice(1)}token`, cookiePath);
            } else if (cookiePath === '/donate') {
                this.$store.dispatch('setUserInfo', {});
            }
            const path = location.hash.replace('list', 'login').slice(1);
            this.$router.push(path);
        }
    }
};
</script>

<style lang="stylus" scoped>
.common-header
    text-align right
    box-shadow 0 1px 0 rgba(0,21,41,.08)
    line-height 48px
.common-main
    background #f0f2f5
.common-footer
    background #f0f2f5
    padding 0 50px 24px
    color rgba(0,0,0,.45)
    font-size 14px
    text-align center
</style>
