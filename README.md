# vue-Bcak_ShangPinHui

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```


1. 配置自动打开浏览器端口-vite.config.js
  server:{
    host:'0.0.0.0',
    port:8080,
    open:true
  }

2. 尚硅谷的后台代码node使用的16版本

3. 一个div在div里面实现水平垂直居中
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
}

4. 
