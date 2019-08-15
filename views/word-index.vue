<template>
   <div class="index-word">
       <div class="index-word-head"  v-if="unfinishedData">
           <div class="per-info">
               <img class="per-img" :src="unfinishedData.imagePath" alt="">
               <div class="info">
                   <h3>{{unfinishedData.nameMulti[lang]}}</h3>
                   <p>学习进度{{unfinishedData.percent}}</p>
                   <div class="jd"><span :style="`width:${unfinishedData.percent}`"></span></div>
               </div>
            </div>
            <router-link :to="unfinishedData.subitem==0?'':unfinishedData.link" tag="a" class="learn-btn">开始学习<i></i></router-link>
       </div>

       <div class="index-word-ctn">
           <ul class="index-word-list clearfix">
                <li 
                    v-for="(item,index) in wordList" :key="`wordList${index}`"
                    :class="[item.bgClass,{'lock':item.status==0}]" @click="gotoWordFn(item)"
                >
                    <a>
                        <div class="top">
                            <img class="icon" :src="item.imagePath" alt="">
                            <img v-if="item.subitem==0" class="ico_lock" src="../assets/images/ico_lock.png" alt="">
                            <div v-if="item.masteryNum<item.subitem" class="jd"><span :style="`width:${item.percent}`"></span></div>
                            <img v-if="item.masteryNum==item.subitem && item.subitem!=0" class="ico_right" src="../assets/images/ico_right.png" alt="">
                        </div>
                        <div class="btm">{{item.nameMulti[lang]}}</div>
                    </a>
                </li>
           </ul>
       </div>
   </div>
</template>


<script>
import '@/assets/css/word-index.css' // global
export default {
    components: {

    },
	name: 'wordIndex',
	data () {
		return {
            //lang:this.$common.config.lang,
            wordList:[],
            unfinishedData:null,
            // wordList:[
            //     {
            //         title:'亲属昵称',
            //         bgClass:'bg01',
            //         iconUrl:'https://test.5ideachinese.com/profile/frontend/static/images/word/ico01.png',
            //         status:0,
            //         progress:'0%',
            //         link:'/topicIndex'
            //     },
            // ]
		}
    },
    //计算属性
    computed: {
        //计算做题进度条
        lang(){
            return this.$common.config.lang
        }
    },
    
    created(){
        this.getWordList();
    },

    mounted(){
        
    },
    
    methods:{

        //跳转到单词练习
        gotoWordFn(data){
            if(data.subitem>0){
                window.localStorage.setItem('wordParent',JSON.stringify(data));
                this.$router.push({
        　　　　　　path: data.link
                    //path: '/topicResult'
        　　　　})
            }
            
        },

        //获取首页词卡列表
        getWordList(){
            var _this = this;
            _this.$common.axiosFn({
                method:"post",
                url:'/lexiconList/getLexiconList',
                success:(res)=>{
                    var list = res.data;
                    list.forEach((item,index)=>{
                        //masteryNum：已完成题目，subitem：题目总数
                        item.percent = item.subitem==0?0:parseInt(100*item.masteryNum/item.subitem) + '%';
                        
                        item.bgClass = 'bg0' + (index%6+1);
                        item.link = 'topicIndex/' + item.listId;

                        if(item.masteryNum < item.subitem && !_this.unfinishedData){
                            _this.unfinishedData = item;
                            console.log('unfinishedData',_this.unfinishedData)
                        }
                    })
                    //若全部完成，头部就显示第一个
                    if(!_this.unfinishedData){
                        _this.unfinishedData = list[0]
                    }
                    _this.wordList = list;
                },
                error:(res)=>{
                    console.error('词卡首页列表获取失败：',res)
                }
            })
        }
    }
};
</script>