<template>
  <div id="app">
    <!-- <router-view/> -->
    <transition name="fade" mode="in-out">
      <router-view/>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'App',
  mounted(){
      //监听地址，然后自动跳转到对应页面。
      window.addEventListener('hashchange',()=>{
          var currentPath = window.location.hash.slice(1); // 获取输入的路由
          if(this.$router.path !== currentPath){
              this.$router.push(currentPath); // 动态跳转
          }
      },false);
  }
}
</script>
