<template>
    <div class="topic-result" v-if="wordParentData">
        <img class="head-img" src="../assets/images/word-result-img.png" alt="">
        <div class="title"><h3><span>太棒了!</span></h3></div>
        <p>您刚刚完成了“{{wordParentData.nameMulti[lang]}}”词卡，掌握了{{wordParentData.masteryNum}}个新单词快与您的朋友分享喜悦吧～</p>
        <a href="javascript:;" class="share-btn">好的，去分享</a>
        <router-link to="/wordIndex" class="learn-more-btn">不分享，继续学习 >></router-link>
    </div>
</template>

<style>
html,body,#app{width:100%; height:100%;}
</style>

<script>
import '@/assets/css/word-topic.css' // global
export default {
    components: {
        
    },
    name: 'topicResult',
	data () {
		return {
           lang:this.$common.config.lang,
           wordParentData:null 
		}
    },
    mounted(){
       this.wordParentData = window.localStorage.getItem('wordParent')?JSON.parse(window.localStorage.getItem('wordParent')):{};
        console.log('wordParentData',this.wordParentData);
    },
};
</script>