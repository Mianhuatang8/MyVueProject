import { createStore } from "vuex";
import UserAbout from "./user";
import MenuCollapseAbout from "./menuCollapse";
//创建store实例对象
const store=createStore({
    modules:{
        UserAbout,MenuCollapseAbout
    }

    
})

export default store