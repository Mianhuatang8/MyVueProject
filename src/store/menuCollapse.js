const MenuCollapseAbout = {
  namespaced: true, //开启命名空间
  state() {
    return {
        isCollapse:false,
    };
  },
  actions: {
 

  },
  mutations: {
    //折叠菜单
    CHANG_MENU(state){
        state.isCollapse=!state.isCollapse
        console.log('提交任务',state.isCollapse);
    }

  },
};

export default MenuCollapseAbout;
