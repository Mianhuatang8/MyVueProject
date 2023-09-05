<template>
    <div class="login-all">
        <div class="all">
            <el-form>
                <!-- 表单头部 -->
                <div class="title">
                    <h3>登录</h3>
                </div>
                <!-- 表单内容 -->
                <el-form-item label="账号" :rules="loginRules.username">
                    <el-input v-model="loginForm.username" />
                </el-form-item>
                <el-form-item label="密码" :rules="loginRules.password">
                    <el-input v-model="loginForm.password" type="password" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="login">登录</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    name: 'login',
    data() {
        return {
            loginForm: {
                username: 'admin',
                password: '111111'
            },

            loginRules: {
                username: {
                    required: true,
                    message: '请输入用户名',
                    trigger: 'blur',
                },
                password: {
                    required: true,
                    message: '请输入密码',
                    trigger: 'blur',
                }
            }
        }
    },
    methods: {
        login() {
            // 使用vuex管理数据状态
            this.$store.dispatch('UserAbout/user_login', this.loginForm).then(()=>{
                this.$router.push({ path: '/data' })
            })
        },
    }
}
</script>

<style scoped>
.login-all {
    width: 100%;
    height: 100%;
    background-color: azure;
    position: relative;
}

.all {
    /* 水平垂直居中 */
    position: absolute;
    left: 50%;
    top: 50%;
    margin: -150px 0 0 -250px;

    background-color: bisque;
    height: 300px;
    width: 500px;
    display: flex;
    justify-content: center;
    align-items: center;
}

/* .el-input{
    width: 100;
} */
.el-form {
    /* 水平居中 */
    text-align: center;
}

.title {
    margin: 10px 0;
}

.el-button {
    /* text-align: center; */
    width: 100%;
    margin-left: 21%;
}
</style>