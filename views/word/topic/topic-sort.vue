<template>
    <div :class="['topic-box','topic-box02',{'box_animate':enterAnimate}]">
        <img class="ques-img" :src="topicData.imgUrl" alt="">
        <ul class="topic-question-list02" ref="quesListBox">
            <li 
                v-for="(item,index) in topicData.options" :key="`topic${item.answer}`"
                v-show="item.show"  :class="{'hover':item.hover}" :id="`topic_${item.answer}`"
                :style="`left:${item.left}; top:${item.top}; transform:translate(${item.x}px,${item.y}px); `" 
                @touchstart="touchstart(`topic_${item.answer}`,index)" 
                @touchmove="touchmove(`topic_${item.answer}`,index)"
                @touchend="touchend(`topic_${item.answer}`,index)"
                @click="choiceFn(index)"
            ><span>{{item.text}}</span></li>
        </ul>
        <ul :class="['topic-answer-list02','animated',{'shake':answerResultStatus==1,'overlap':isOverlapStatus}]" id="answerBox">
            <li v-for='(item) in answerDefaultList' :key="`answer${item}`"
            >{{answerList[item]}}</li>
        </ul>
    </div>
</template>


<script>
import '@/assets/css/word-topic.css' // global
export default {
    components: {

    },
	name: 'topic-sort',
	data () {
		return {
            enterAnimate:false,
            quesBoxData:null,
            answerResultStatus:0,
            answerDefaultList:[],    //答案默认空列表
            answerList:[],          //答案列表
            isOverlapStatus:false,
		}
    },
    mounted(){
        this.enterAnimate = true;
        //获取浏览器宽高
        this.winWidth = document.documentElement.clientWidth;
        this.winHeight = document.documentElement.clientHeight;

        //获取元素位置信息，然后给拖动项设定一直默认位置
        var quesBoxData = this.$refs.quesListBox.getBoundingClientRect();
        var quesList = this.topicData.options;
        quesList.forEach((item,i)=>{
            item.top = parseInt((quesBoxData.height-150)*Math.random()) + 'px';
            item.left = parseInt((quesBoxData.width/quesList.length)*i+ 20) + 'px';
            item.x = 0;
            item.y = 0;
            item.show = true;
            item.hover = false;
            this.answerDefaultList.push(i);
        });
        this.topicData.options = quesList;
        this.quesBoxData = quesBoxData;

    },
    props:{
        topicData:Object,
    },
    methods:{
        
        //点击判断答案对错
        choiceFn(index){
            var answerArr = this.topicData.answer.split(',');
            var answerLen = this.answerList.length;
            var thisAnswerObj = this.topicData.options[index];

            if(answerArr[answerLen] == thisAnswerObj.answer ){
                //console.log('答案准确');
                thisAnswerObj.show = false;
                this.answerList.push(thisAnswerObj.text);
                //判断是否最后一个
                if(answerArr.length == answerLen+1){
                    //给父级传值
                    setTimeout(()=>{
                        this.$emit('successFn', '2');
                    },1000)
                }

            }else{
                this.answerResultStatus = 1;
                setTimeout(()=>{
                    this.answerResultStatus = 0;
                },1000)
            }
        },

        //手指按下
        touchstart(objId,index) {
            event.preventDefault() //阻止默认事件（长按的时候出现复制）
            this.startX = event.changedTouches[0].pageX - this.topicData.options[index].x
            this.startY = event.changedTouches[0].pageY - this.topicData.options[index].y
            this.topicData.options[index].hover = true;
            this.drapTimeStart = (new Date()).getTime();
        },

        //手指移动
        touchmove(objId,index) { // 如果手指有移动，则取消所有事件，此时说明用户只是要移动而不是长按
            event.preventDefault();
            var moveEndX = event.changedTouches[0].pageX
            var moveEndY = event.changedTouches[0].pageY

            var thisSiteData = this.getElData(objId);
            var rLeft= moveEndX - this.startX;
            var rTop = moveEndY - this.startY;

            //判断，移动的范围不超出窗口
            rLeft = rLeft <  -thisSiteData.left ? -thisSiteData.left: rLeft;
            rLeft = rLeft > this.quesBoxData.width - thisSiteData.left - thisSiteData.width  ? this.quesBoxData.width- thisSiteData.left - thisSiteData.width : rLeft;
			rTop = rTop <  -thisSiteData.top ? -thisSiteData.top : rTop;
            rTop = rTop > this.quesBoxData.height - thisSiteData.top - thisSiteData.height  ? this.quesBoxData.height- thisSiteData.top - thisSiteData.height : rTop;
            
            //
            this.topicData.options[index].x = rLeft;
            this.topicData.options[index].y = rTop
            
            //判断是否重叠了
            var objStart = objId;
            var objEnd = ['answerBox'];
            this.isOverlap(objStart,objEnd,(resultObj)=>{
                this.isOverlapStatus = resultObj? true : false;
            })

        },

        //手指松开
        touchend(objId,index) { // 手释放，如果在500毫秒内就释放，则取消长按事件
            event.preventDefault();
            this.topicData.options[index].hover = false;
             this.isOverlapStatus = false;
            this.drapTimeEnd = (new Date()).getTime();

            var objStart = objId;
            var objEnd = ['answerBox'];
            //console.log(this.topicData.options[index])
            //判断两个元素是否重叠
            this.isOverlap(objStart,objEnd,(resultObj)=>{
                 if(resultObj ||  this.drapTimeEnd- this.drapTimeStart<300){
                     this.choiceFn(index);
                    // var answerArr = this.topicData.answer.split(',');
                    // var answerLen = this.answerList.length;
                    // var thisAnswerObj = this.topicData.options[index];

                    // if(answerArr[answerLen] == thisAnswerObj.answer ){
                    //     console.log('答案准确');
                    //     thisAnswerObj.show = false;
                    //     this.answerList.push(thisAnswerObj.text);
                    //     //判断是否最后一个
                    //     if(answerArr.length == answerLen+1){
                    //         //给父级传值
                    //         this.$emit('successFn', '2' );
                    //     }

                    // }else{
                    //     this.answerResultStatus = 1;
                    //     setTimeout(()=>{
                    //         this.answerResultStatus = 0;
                    //     },1000)
                    //     console.log('答案错误');
                    // }
                   
                    this.topicData.options[index].x = 0;
                    this.topicData.options[index].y = 0
                }else{

                }
            });

            
        },

        //点击移除答案
        removeAnswer(index){
            
        },

        //获取标签元素信息(el:标签rel值);
        getElData(id){
            
            var obj = document.getElementById(id);
            var obj_x = 0,obj_y = 0;
            this.topicData.options.forEach((item,index)=>{
                if(id == item.id){
                    obj_x = item.x;
                    obj_y = item.y;
                }
            })
            var objData = {
                width   : parseFloat(obj.offsetWidth),  //宽度 
                height  : parseFloat(obj.offsetHeight), //高度
                left    : parseFloat(obj.offsetLeft),   //具体窗口的左边距
                top     : parseFloat(obj.offsetTop),    //距离窗口的右边距
                mLeft   : parseFloat(window.getComputedStyle(obj)?window.getComputedStyle(obj).marginLeft:0),   //margin-left值
                mTop    : parseFloat(window.getComputedStyle(obj)?window.getComputedStyle(obj).marginTop:0),   //margin-left值
                x       : obj_x,                //translateX的距离
                y       : obj_y                 //translateY的距离
            }
            return objData;
        },

        //判断两个元素是否重叠(拖拽元素，对比元素集)
        isOverlap(objStart,objEnd,callback){
            var objStart = this.getElData(objStart);
            //获取拖拽元素的中心坐标
            objStart['cLeft'] = objStart.left + objStart.width/2 + objStart.x;
            objStart['cTop'] = this.quesBoxData.top + objStart.top + objStart.height  + objStart.y;
            
            var answerArr = objEnd.map(item=>{
                 return this.getElData(item);
            });
            
            //console.log('answerArr',objStart,answerArr);
            var cbObj = null;
            var num = null;
            answerArr.forEach((item,i)=>{
                
                //判断是否有元素重叠，重叠后会判断答案对错
                var b1 = (objStart.cLeft < (item.left + item.mLeft))?true:false;
                var b2 = (objStart.cLeft > (item.left + item.mLeft + item.width))?true:false;
                var b3 = (objStart.cTop < (item.top + item.mTop))?true:false;
                var b4 = (objStart.cTop > (item.top + item.mTop + item.height))?true:false;

                if(!(b1 || b2 || b3 || b4)){
                    cbObj = objEnd[i]; 
                    num = i;
                }
            });

            callback && callback(cbObj,num);
        }
    }
};
</script>