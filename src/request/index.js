// import axios from 'axios';

// // 创建一个 axios 实例
// const http = axios.create({
// 	baseURL: 'http://gmall-h5-api.atguigu.cn', // 所有的请求地址前缀部分
// 	timeout: 6000, // 请求超时时间毫秒
// })

// export default http

// 引入 axios 库
// import axios from "axios";
// // 暴露一个 request 的函数名 并带有 config 的参数
// export function request(config) {
//   // config的数据便是在我们调用接口的时候，传过来的数据
//   const instance = axios.create({
//     // 公共的api路径
//     baseURL: "http://gmall-h5-api.atguigu.cn",
//     // 响应时间为：5000，当超过这个时间，并不会继续请求api的接口
//     timeout: 5000,
//   });

// 请求拦截器
// instance.interceptors.request.use(config=>{

//   const token = window.localStorage.getItem('token');
//   if (token) {
//     // let each request carry token
//     // ['X-Token'] is a custom headers key
//     // please modify it according to the actual situation
//     config.headers['token'] = 'Bearer '+token;
//   }
//   return config

//     // //Authorization: Bearer Token
//     // // 如果有一些接口需要认证才可以访问，就在这里统一设置
//     // const token = window.localStorage.getItem('token');
//     // if(token){
//     //     config.headers.Authorization = 'Bearer '+token;
//     // }
//     // //直接放行
//     // return config;

// },err=>{
//   console.log(err) // for debug
//   return Promise.reject(err)
// })
// 返回
//   return instance(config);
// }

// import { MessageBox, Message } from 'element-ui'

//axios二次封装
import axios from "axios";

//axios的返回结果是promise对象
//利用axios对象的creat方法创建一个axios实例
//request就是axios,但是进行了稍微配置
const requests = axios.create({
  //公共的api路径 基础路径,发请求的时候就会出现该路径
  baseURL: "http://gmall-h5-api.atguigu.cn", // url = base url + request url
  timeout: 5000, // 超时时间
});

//请求拦截器-在发送请求之前去做一些事情
  //config:配置对象,里面有一个属性很重要,header请求头
requests.interceptors.request.use((config) => {
  //获取用户信息,携带请求头
  const token=sessionStorage.getItem('token')
  if(token){
    config.headers['token']=token
  }
  return config;
});

//响应拦截器
// requests.interceptors.response.use(
//   (res) => {
//     //成功响应的回调
//     console.log(res.data);
//   },
//   (error) => {
//     //响应失败的回调
//     // return Promise.reject(new Error('faile'))
//     console.log('失败',error);
//   }
// );

export default requests;
