<template>
    <div style="height:100%">
        <el-container style="min-height:100%">
            <el-container>
                <el-header class="common-header" height="48px">
                    <el-dropdown>
                    <span>用户名：XXX</span>
                        <i class="el-icon-setting" style="margin-right: 15px"></i>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item>
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
                    <p>扶贫捐助信息平台</p>
                    <p>Copyright 2020 © 百度智能小程序研发部出品</p>
                </div>
            </el-footer>
            </el-container>
        </el-container>
    </div>
</template>

<script>
export default {
    methods: {
        handleLogout() {
            this.$message.success('登出成功');
            this.$store.dispatch('setloginId', '');
            this.$router.push('/donate/login');
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
    color rgba(0,0,0,.65)
    font-size 14px
    text-align center
</style>
