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
      <div>
        <el-input v-model="input" placeholder="请输入内容"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
      </div>
      <el-table
        :data="tableData"
        style="width: 100%"
        :row-class-name="tableRowClassName">
        <el-table-column
          prop="date"
          label="日期"
          width="180">
        </el-table-column>
        <el-table-column
          prop="name"
          label="姓名"
          width="180">
        </el-table-column>
        <el-table-column
          prop="type"
          label="类型"
          width="180">
        </el-table-column>
        <el-table-column
          prop="idCode"
          label="存证地址">
        </el-table-column>
        <el-table-column
          width="60"
          label="操作"
          class-name="operate">
          <i class="el-icon-message"></i>
        </el-table-column>
      </el-table>
      <div class="footer"><div class="m-report-foot page">京公网安备案11000002000001号 ©2020 Baidu <a href="https://www.baidu.com/duty" target="_blank">使用百度前必读</a></div></div>
    </el-main>
  </el-container>
</template>

<script>
import {} from '../data.js';
import axios from '../../http';

export default {
    data () {
        let checkRepassword = (rule, value, callback) => {
            if (value !== this.registerForm.password) {
                return callback(new Error('两次输入密码必须相同'));
            }
            return callback();
        };
        return {
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
            },
            tableData: [
                {
                    date: '2020-07-11',
                    name: '王小虎',
                    type: '捐赠',
                    idCode: 'askjhfaskjlfhjasdhfjkahsfjashdjkf'
                },
                {
                    date: '2020-07-12',
                    name: '张东升',
                    type: '受捐',
                    idCode: 'asflkjadslkfjasdlkjflaksdfjasdlkf'
                },
                {
                    date: '2020-07-13',
                    name: '李霞',
                    type: '受捐',
                    idCode: 'jqwoiruqweirhawklfjkaewhfjkhwaekj'
                },
                {
                    date: '2020-07-14',
                    name: '钟琴',
                    type: '捐赠',
                    idCode: 'dasfnlasdnflkasdnflknasdlkfasdkls'
                }
            ]
        };
    },
    computed: {
        buttonText () {
            console.log(this.user);
            console.log(this.user && this.user.name);
            return (this.user && this.user.userName) || '登录/注册';
        }
    },
    mounted () {
        console.log('attached');
        console.log(this.$route.params.id);
    },
    methods: {
        tableRowClassName({row, rowIndex}) {
            if (row.type === '捐赠') {
                return 'warning-row';
            } else {
                return 'success-row';
            }
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
        },
        search () {
            console.log('search');
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
    .el-table .warning-row {
      background: oldlace;
    }

    .el-table .success-row {
      background: #f0f9eb;
    }
    .el-input {
      display: inline-block;
      width: 60%;
      margin-right: 30px;
      margin-bottom: 60px;
      margin-top: 60px;
    }
    .operate {
      text-align: center;
      .el-icon-message {
        cursor: pointer;
      }
    }
    .footer {
      margin-top: 10px;
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
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
