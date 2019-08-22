<template>
    <div class="topic-result" v-if="wordParentData">
        <img class="head-img" src="../../assets/images/word-result-img.png" alt="">
        <div class="title"><h3><span>{{pageLang.desTitle[lang]}}</span></h3></div>
        <p>{{pageLang.desText1[lang] + wordParentData.nameMulti[lang] + pageLang.desText2[lang] + wordParentData.subitem + pageLang.desText3[lang]}}</p>
        <div v-if="source=='app'" @click="shareFn" class="share-btn">{{pageLang.shareBtn[lang]}}</div>
        <router-link v-if="source=='app'" to="/wordIndex" class="learn-more-btn">{{pageLang.studyBtn[lang]}}</router-link>
        <div v-if="source=='h5'" @click="downloadFn" class="share-btn">{{pageLang.downLoadBtn[lang]}}</div>
    </div>
</template>

<style>
html,body,#app{width:100%; height:100%;}
</style>

<script>
import '@/assets/css/word-topic.css' // global
import lexiconData from '@/assets/data/lexiconData.js'    //静态题目
export default {
    name: 'topicResult',
	data () {
		return {
            pageLang: this.$store.state.langData.topicResult,    //语言包
            wordParentData:null,
            shareDetail:null
		}
    },
    computed: { //计算属性
        lang(){ return this.$store.state.lan },    //获取语言
        source(){ return this.$store.state.source }
    },
    created(){
        
    },
    mounted(){
        var lexiconListAct = lexiconData.lexiconList[0];
        this.wordParentData = this.$store.state.subjectTypeActData?this.$store.state.subjectTypeActData:lexiconListAct
        if(this.source=='app'){ //app创建分享信息
            //设置页面标题栏
            var param = {
                title: this.$route.meta.title
            }
            this.$shell.setPageTitle(JSON.stringify(param));
            this.createShareData();
        }
    },
    methods:{

        //下载
        downloadFn(){
            //window.location.href = ''
        },
        
        //分享
        shareFn(){
            this.$shell.share(shareDetail.shareTitle, shareDetail.shareDesc, shareDetail.shareImg, shareDetail.link, shareDetail.shareId);
        },

        //生成分享信息
        createShareData(){
            var _this = this;
             this.$http({
                url:'/shareInfo/shareWordCard',
                method:"post",
                success:function(res){
                    console.log('生成分享信息',res.data);
                    _this.shareDetail = res.data;
                    //_this.getShareDetail(res.data.shareId);
                }
            },this)
        }
    }
};
</script>