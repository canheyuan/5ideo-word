<template>
    <div class="topic-page" >
        
        <!-- 看词选图:type=1 -->
        <topic-choice @successFn='successFn' v-if='isTopicShow && subjectActData.type==1' :topicData='subjectActData'></topic-choice>

         <!-- 排序题:type=2 -->
        <topic-sort @successFn='successFn' v-if='isTopicShow && subjectActData.type==2' :topicData='subjectActData'></topic-sort> 

        <!-- 判断题:type=3 -->
        <topic-judge v-if='isTopicShow && subjectActData.type==3'  @successFn='successFn' :topicData='subjectActData'></topic-judge>
        
        <!-- 单词介绍 -->
        <topic-intro v-if="isIntroShow" @gotoTopic='gotoTopic' :topicData='subjectActData'></topic-intro>

        <!-- 成功 -->
        <topic-success v-if='isSuccessShow'></topic-success>

        <!-- 单词答案 -->
        <topic-answer v-if="isAnswerShow"  @answerResult='answerResult' :topicData='subjectActData'></topic-answer>

        <!-- 进度条 -->
        <div class="topic-progress">
           <div class="progress-num">{{progressNum}}%</div>
           <div class="progress"><span :style="`width:${progressNum}%;`"></span></div>
        </div>

        <!-- 退出按钮 -->
        <div class="close-page word-icons" @click='outTipPopFn("isOutPopShow")'></div> 

        <!-- 退出提示弹窗 -->
        <div :class="['mask_bg',{'pop_show':isOutPopShow}]" v-show='isOutPopShow'>
            <div class="mask_bg_ctn">
                
                <div class="close-page-tip-pop">
                    <span class="close" @click='outTipPopFn("isOutPopShow")'><img src="../assets/images/ico-close2.png" alt=""></span>
                    <h3 class="title">确认退出</h3>
                    <p>词卡“食物”尚未完成，是否退出？</p>
                    <a class="pop_btn01"  @click='outTipPopFn("isOutPopShow")'>继续答题</a>
                    <a class="pop_btn02" @click="resetSubject('isOutPopShow')" >重新开始</a>
                    <a class="pop_btn03" @click='gobackFn'>不想做了，我要退出</a>
                </div>

            </div>
        </div>

        <!-- 所以题目完成提示弹窗 -->
        <div :class="['mask_bg',{'pop_show':isFinishPopShow}]" v-show='isFinishPopShow'>
            <div class="mask_bg_ctn">
                <div class="close-page-tip-pop">
                    <h3 class="title">恭喜你!</h3>
                    <p>所有题目都已完成了</p>
                    <a class="pop_btn01"  @click='resetSubject("isFinishPopShow")'>重新开始</a>
                    <a class="pop_btn02" @click="gobackFn" >退出</a>
                </div>
            </div>
        </div>


    </div>
</template>


<script>
import '@/assets/css/word-topic.css'; 

import topicChoice from '@/views/topic/topic-choice';
import topicSort from '@/views/topic/topic-sort';
import topicJudge from '@/views/topic/topic-judge';
import topicAnswer from '@/views/topic/topic-answer';
import topicIntro from '@/views/topic/topic-intro';
import topicSuccess from '@/views/topic/topic-success';

export default {
    components: {
        'topic-choice':topicChoice,
        'topic-sort':topicSort,
        'topic-judge':topicJudge,
        'topic-answer'  : topicAnswer,
        'topic-success' : topicSuccess,
        'topic-intro'   : topicIntro
    },
	name: 'topicIndex',
	data () {
		return {
            lang:this.$common.config.lang,
            listId : this.$route.params.listId, //当前题目的listId
            isOutPopShow : false, //退出提示弹窗是否显示
            isFinishPopShow:false,  //题目已全部完成提示弹窗
            isTopicShow:false,  //当前显示做题组件
            isSuccessShow:false,    //是否显示成功界面
            isAnswerShow:false, //是否显示答案界面
            isIntroShow:false,      //单词介绍页是否显示 

            //progressNum:0,      //做题进度
            //记录做过的题目
            recordData:{
                listId:this.$route.params.listId,
                studyItem:[]
            },    
            //模拟题目接口数据
            //batchNum:1,         //分页索引
            batchSize:10,       //分页数量
            subjectDatas:null,  //接口题目列表信息
            subjectActData:null,   //存储当前题目信息
            subjectIndex:0,     //当前题目索引

		}
    },

    //节点完成后执行
    mounted(){
        
        //获取题目信息
        this.getTopicList(true);
    },

    //计算属性
    computed: {
        //计算做题进度条
        progressNum(){
            //console.log('this.subjectDatas',this.subjectDatas);
            return this.subjectDatas?parseInt(100*this.subjectDatas.masterLexiconNum/this.subjectDatas.totalLexiconNum):0;
            //return parseInt(100*this.subjectIndex/this.subjectDatas.totalSubjectNum);
        }
    },
    methods:{
        
        //获取词卡练习列表
        getTopicList(isReach,callback){
            var _this = this;
            _this.$common.axiosFn({
                method:"post",
                url:'/lexiconList/getLexiconListSubject',
                params:{
                    listId:this.listId,
                    //batchNum:this.batchNum,
                    batchSize:this.batchSize
                },
                success:(res)=>{
                    console.log('词卡首页列表：',res.data.data);
                    // if(res.data.data.totalSubjectNum == 0){
                    //     return;
                    // }
                    var datas = res.data;
                    datas.subject.forEach((item,index)=>{
                        //处理添加交互需要的一些参数
                        switch(item.type){
                            case 1:
                                item.options.forEach(item2=>{
                                    item2.hover = false;
                                    item2.id = 'topic_' + item2.answer;
                                    if(item.answer == item2.answer){
                                        item.imgUrl = item2.imgUrl;
                                    }
                                });
                                break;

                            case 2:
                                item.options.forEach(item2=>{
                                    //left:'0',  top:'0',x:'0',y:'0',show:true,hover:false
                                    item2.hover = false; 
                                    item2.show = true;
                                    item2.left = 0; 
                                    item2.top = 0;
                                    item2.x = 0; 
                                    item2.y = 0;
                                    item2.id = 'topic_' + item2.answer;
                                });
                                break;

                            case 3:
                                item.options = [
                                    {answer:'false', id:'mistakeBtn', hover:false},
                                    {answer:'true', id:'correctBtn', hover:false},
                                ]
                                break;
                        }
                    })
                    datas.subject = isReach ? datas.subject : this.subjectDatas.subject.concat(datas.subject);  //合并数组
                    this.subjectActData = datas.subject[this.subjectIndex];
                    this.subjectDatas = datas;
                    this.subjectIndex = 0;
                    this.isIntroShow = true;
                   
                    if(datas.subject.length==0){    //当第一次获取的数据为0时，弹出已完成弹窗
                        this.isFinishPopShow = true;
                    }
                    callback && callback();
                },
                error:(res)=>{
                    console.error('题目列表获取失败：',res);
                }
            })

        },
        
        //介绍页跳转到题目
        gotoTopic(){
            this.isIntroShow = false;
            this.isTopicShow = true;
        },

        

        //回答正确
        successFn(topicType){
            this.isTopicShow = false;
            this.isSuccessShow = true;
            //做过的题目记录一下存储本地缓存（防止用户直接关闭浏览器导致无法记录）；
            //若有提交，就清除缓存；若无提交，就在回到词卡首页那提交数据
            // var nowStudyItem = {
            //         "lexiconId" : this.subjectActData.lexiconId,
            //         "type": this.subjectActData.type,
            //         "result": "Y"
            //     }
            // var studyRecord = window.localStorage.getItem('studyRecord')?JSON.parse(window.localStorage.getItem('studyRecord')):[];
            // var isList = false; 
            // studyRecord.forEach((item,index)=>{
            //     if(item.listId == this.listId){
            //         item.studyItem.push(nowStudyItem);
            //         this.recordData = item; //当前做的题目类型记录，供提交
            //         isList = true;
            //     }
            // })
            // if(!isList){
            //     var nowSubjectData = {
            //         listId:this.listId,
            //         studyItem:[nowStudyItem]
            //     }
            //     studyRecord.push(nowSubjectData);
            //     this.recordData = nowSubjectData;   //当前做的题目类型记录，供提交
            // }
            
            // window.localStorage.setItem('studyRecord',JSON.stringify(studyRecord));

            var nowStudyItem = {
                "lexiconId" : this.subjectActData.lexiconId,
                "type": this.subjectActData.type,
                "result": "Y"
            }
            this.recordData.studyItem.push(nowStudyItem);
            
            //判断提交答案记录
            this.judgeWordFinish(this.subjectActData);

            setTimeout(()=>{
                this.isSuccessShow = false;     //关闭
                this.isAnswerShow = true;
            },1500);
        },

        //成功后答案
        answerResult(){

            //判断是否当前分页最后一题
            if( this.subjectIndex == this.subjectDatas.totalSubjectNum-1){
                
                var masterLexiconNum = this.subjectDatas.masterLexiconNum;      //当前题目加载总数
                var totalLexiconNum = this.subjectDatas.totalLexiconNum;   //单词总数

                //判断是否还有题目，有加载题目，没有跳结果页
                if(masterLexiconNum < totalLexiconNum){
                    this.isAnswerShow = false;
                    this.getTopicList(true,()=>{
                        this.isIntroShow = true;
                    });
                }else{
                    //提交题目记录数据
                    this.$router.push({ path:'/topicResult'});
                }
                
            }else{

                this.subjectIndex++;
                this.subjectActData = this.subjectDatas.subject[this.subjectIndex];

                //判断当前词语是否做过题目
                var isDo = false;
                this.recordData.studyItem.forEach(item2=>{
                    if(item2.lexiconId == this.subjectActData.lexiconId){
                        isDo = true;
                    }
                })
                this.isAnswerShow = false;
                if(isDo){
                    //console.log('isDo_yes');
                    this.isTopicShow = true;
                }else{
                    //console.log('isDo_no');
                    this.isIntroShow = true;
                }
            }
        },

        //判断当前词卡题型是否全部完成
        judgeWordFinish(subjectItemData){
            var num = 0;
            var numTotal = 0;
            var studyItems = this.recordData.studyItem;

            if(studyItems.length>0){
                studyItems.forEach(item=>{
                    if(item.lexiconId == subjectItemData.lexiconId){
                        num++;
                        numTotal = subjectItemData.subjectNum;
                    }
                })

                //当单词题型数等于总数时，提交数据，并清除记录
                var b = (num < numTotal || numTotal==0)?false:true;
                if(b){
                    this.topicFinish(this.recordData,()=>{
                        this.recordData.studyItem = this.recordData.studyItem.filter(item=>{
                            return item.lexiconId != subjectItemData.lexiconId
                        });
                    });
                }
            }
        },

        //提交题目已做
        topicFinish(data,callback){
            var _this = this;
            _this.$common.axiosFn({
                method:"post",
                url:'/lexiconList/submitSubjectResult',
                data:data,
                success:(res)=>{
                    this.subjectDatas.masterLexiconNum++;
                    callback && callback();
                },
                error:(res)=>{
                    callback && callback();
                    console.error('提交完成失败',res);
                }
            })
        },

        //打开、关闭提示弹窗
        outTipPopFn(obj){
            //console.log('outTipPopFn',obj)
            this[obj] = !this[obj];
        },

        //重新开始,重置题目
        resetSubject(popupStatus){
            var _this = this;
            _this.$common.axiosFn({
                method:"post",
                url:'/lexiconList/resetMasterNum',
                params:{
                    listId : this.listId
                },
                success:(res)=>{
                    //this.batchNum = 1;
                    this.subjectIndex = 0;
                    this.getTopicList(true);
                    this.outTipPopFn(popupStatus); //关闭弹窗
                },
                error:(res)=>{
                    console.error('重置题目信息失败',res);
                }
            })
        },

        //退出词卡联系，返回上一页
        gobackFn(){
            //console.log('路由router对象：',this.$router,this.recordData);
            this.$router.back(-1);
        },
    }
};
</script>