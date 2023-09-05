import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import store  from './store'
import router from './router'
import '../src/assets/reset.scss'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
//引入element组件库的图标-步骤1
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)
app.use(store)
app.use(ElementPlus)
app.use(createPinia())
app.use(router)
app.mount('#app')

//引入element组件库的图标-步骤2
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
