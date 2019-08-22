<template>
  <div id="app">
    <transition name="fade" mode="in-out">
      <router-view/>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      tip: null
    }
  },
  created(){
    
    var _this = this;
    //获取地址参数，设置范文来源
    if(this.$route.query.source){
      _this.$store.commit('sourceChange',this.$route.query.source)
    }
    
    //app才会加载shell
    if(this.$store.state.source == 'app'){ 
      _this.$shell.init();
      _this.$shell.getHttpHeaders(function(res){
        _this.$store.commit('changeHeader',res);
        _this.$store.commit('sidChange',res['5idea-sid']);
        _this.$store.commit('lanChange',res['lan']);
      })
    }

    //监听地址，然后自动跳转到对应页面。
    window.addEventListener('hashchange',()=>{
        var currentPath = window.location.hash.slice(1); // 获取输入的路由
        if(this.$router.path !== currentPath){
            this.$router.push(currentPath); // 动态跳转
        }
    },false);
    
  },
  mounted(){

  }
}
</script>
