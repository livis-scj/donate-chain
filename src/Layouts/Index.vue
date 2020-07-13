<template>
    <div>
<el-container>
  <el-container>
    <el-header style="text-align: right; font-size: 12px">
      <el-dropdown>
      <span>用户名：XXX</span>
        <i class="el-icon-setting" style="margin-right: 15px"></i>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>回到首页</el-dropdown-item>
          <el-dropdown-item>退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-header>

    <el-main>
        <router-view></router-view>
    </el-main>
  </el-container>
</el-container>
    </div>
</template>
