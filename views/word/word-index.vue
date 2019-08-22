<template>
   <div class="index-word">
       <!-- <div style="color:#333;">{{tip}}</div> -->
       <div class="index-word-head" v-if="unfinishedData">
           <div class="per-info">
               <img class="per-img" :src="unfinishedData.imagePath" alt="">
               <div class="info">
                   <h3>{{unfinishedData.nameMulti[lang]}}</h3>
                   <p>{{pageLang.studySchedule[lang] + unfinishedData.percent}}</p>
                   <div class="jd"><span :style="`width:${unfinishedData.percent}`"></span></div>
               </div>
            </div>
            <router-link :to="unfinishedData.subitem==0?'':unfinishedData.link" tag="a" class="learn-btn">{{pageLang.studyBtn[lang]}}<i></i></router-link>
       </div>

       <div class="index-word-ctn clearfix">
           <ul class="index-word-list" v-for="(ul,ulIndex) in [0,1]"  :key="`wordUl${ulIndex}`">
               <li 
                    v-for="(item,index) in wordList" :key="`wordList${index}`"
                    v-if="index%2==ulIndex"
                    :class="[item.bgClass,{'lock':item.status==0,'first':index==0}]" @click="gotoWordFn(item)"
                >
                    <div class="top">
                        <span class="percent">{{item.percent}}</span>
                        <img class="icon" :src="item.imagePath" alt="">
                        <img v-if="item.subitem==0" class="ico_lock" src="../../assets/images/ico_lock.png" alt="">
                        <div v-if="item.masteryNum<item.subitem" class="jd"><span :style="`width:${item.percent}`"></span></div>
                        <img v-if="item.masteryNum==item.subitem && item.subitem!=0" class="ico_right" src="../../assets/images/ico_right.png" alt="">
                    </div>
                    <div class="btm">{{item.nameMulti[lang]}}</div>
                </li>
           </ul>
       </div>
   </div>
</template>


<script>
import '@/assets/css/word-index.css' // global
import lexiconData from '@/assets/data/lexiconData.js'    //静态题目

export default {
    components: {

    },
	name: 'wordIndex',
	data () {
		return {
            pageLang:this.$store.state.langData.wordIndex,   //语言文件包
            wordList:[],
            unfinishedData:null
		}
    },
    //计算属性
    computed: {
        lang(){ return this.$store.state.lan },    //获取语言
        sid(){
            return this.$store.state.sid
        },
        wordList1: function () {    //第一列
            return this.wordList.filter(function (item,index) {
                return index%2==0
            })
        },
        wordList2: function () {    //第二列
            return this.wordList.filter(function (item,index) {
                return index%2==1
            })
        }
    },

    watch:{
        sid: function(newVal,oldVal){
            //alert('newVal-sid:'+ newVal);
            if(newVal){
                //this.tip = this.$store.state.headerData
                this.getAPPWordList();
            }
        }
    },
    
    created(){
        
        if(this.$store.state.source == 'app'){
            //设置页面标题栏
            var param = {
                title: this.$route.meta.title
            }
            this.$shell.setPageTitle(JSON.stringify(param));
            if(this.$store.state.sid){
                this.getAPPWordList();
            }else{
                //this.getAPPWordList();
            }
        }else{
            this.getH5WordList();
            var shareId = this.$route.query.shareid;
            if(shareId){
                this.getShareDetail(shareId);
            }
        }

    },

    mounted(){
        
        //this.getAPPWordList();
    },
    
    methods:{

        //查询分享分析
        getShareDetail(shareId){
            var _this = this;
            this.$http({
                url:`/shareInfo/wordCardShareInfo/${shareId}`,
                success(res){
                     _this.$store.commit('lanChange',res.data.lan);
                },
                error(res){
                    console.log('查询分享信息失败')
                }
            },this);
        },

        //跳转到单词练习
        gotoWordFn(data){
            if(data.subitem>0){
                this.$store.commit('subjectTypeActData',data)
                this.$router.push({ path: data.link }) // 跳转页面
            }
        },

        //APP获取首页词卡列表
        getAPPWordList(){
            var _this = this;
            //console.log('indexList:app')
            _this.$http({
                method:"post",
                url:'/lexiconList/getLexiconList',
                success:(res)=>{
                    //alert('词卡成功')
                    var list = res.data;
                    list.forEach((item,index)=>{
                        //masteryNum：已完成题目，subitem：题目总数
                        item.percent = (item.subitem==0?0:parseInt(100*item.masteryNum/item.subitem)) + '%';
                        
                        item.bgClass = 'bg0' + (index%6+1);
                        item.link = 'topicIndex/' + item.listId;

                        if(item.masteryNum < item.subitem && !_this.unfinishedData){
                            _this.unfinishedData = item;
                            //console.log('unfinishedData',_this.unfinishedData)
                        }
                    })
                    //若全部完成，头部就显示第一个
                    if(!_this.unfinishedData){
                        _this.unfinishedData = list[0]
                    }
                    _this.wordList = list;
                },
                error:(res)=>{
                    //alert('词卡失败')
                    //console.error('词卡首页列表获取失败：',res)
                }
            },_this);
        },

        //H5获取首页词卡
        getH5WordList(){
            var _this = this;
             //console.log('indexList:h5')
            var list = lexiconData.lexiconList;
                list.forEach((item,index)=>{
                //masteryNum：已完成题目，subitem：题目总数
                item.percent = '0%';
                item.masteryNum = 0;
                item.bgClass = 'bg0' + (index%6+1);
                item.link = 'topicIndex/food';
                if(!_this.unfinishedData){
                    _this.unfinishedData = item;
                }
            })
            _this.wordList = list;
        }
    }
};
</script>