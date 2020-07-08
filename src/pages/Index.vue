<template>
  <el-container>
    <el-header>
      <el-row :gutter="20">
        <el-col :span="21"><span>扶贫捐赠追溯平台</span></div></el-col>
        <el-col :span="3"><el-button type="primary">登陆/注册</el-button></el-col>
      </el-row>
    </el-header>
    <el-main>Main</el-main>
  </el-container>
</template>

<style>
  .el-header {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }
  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    line-height: 100%;
  }
  .el-row {
    margin-bottom: 20px;
  }
  .el-row:last-child {
    margin-bottom: 0;
  }
  .el-col {
    border-radius: 4px;
  }
</style>
