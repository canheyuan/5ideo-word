<template>
   <div :class="['topic-box','topic-box01',{'box_animate':enterAnimate}]">
        <ul class="topic-answer-list01">
            <li 
                v-for="(item,index) in topicData.options" :key="index"
                :id="item.id" 
                :class="{'overlap':item.hover}"
                @click="choiceFn(item.answer)"
            ><img :src="item.imgUrl" alt=""></li>
        </ul>
        <div 
            :class="['topic-question','animated',{'no_drap':drapStatus==0,'shake':answerResultStatus==1}]" 
            :style="`
                transform:translate(${quesData.x}px,${quesData.y}px) ${drapStatus==1?'scale(.7,.7)':''}; 
                
            `"
            @touchstart="touchstart('topic01Ques')" @touchmove="touchmove('topic01Ques')" @touchend="touchend('topic01Ques')"
            id="topic01Ques"
        >
            <h3>{{topicData.title}}</h3>
            <p>{{topicData.title_py}}</p>
            <i class="ico-hand"></i>
        </div>
    </div>
</template>

<script>

export default {
	name: 'topic01',
	data () {
		return {
            enterAnimate:false,
            winWidth:0,     //窗口宽度
            winHeight:0,    //窗口高度

            drapStatus : 0,     //0：未选中，1:选中
            quesData:{},        //元素的位置信息

            answerResultStatus:0, //回答结果，0：未回答，1：回答错误，2：回答正确

            //centerBox:[0,0]
		}
    },

     created(){
         
     },

     mounted(){
         this.enterAnimate = true;
        //获取浏览器宽高
        this.winWidth = document.documentElement.clientWidth;
        this.winHeight = document.documentElement.clientHeight;

        //获取元素的信息
        this.quesData = this.getElData('topic01Ques');
     },

    // 接受父组件的值
    props: {
        topicData:Object
    },

    methods:{

        //点击判断答案对错
        choiceFn(answer){
            if(this.topicData.answer == answer){
                this.answerResultStatus = 2;
                this.$emit('successFn', '1' );  //给父级传值
            }else{
                this.answerResultStatus = 1;
                setTimeout(()=>{
                    this.answerResultStatus = 0;
                },1000)
            }
        },

        //手指按下
        touchstart(objId) {
            event.preventDefault() //阻止默认事件（长按的时候出现复制）
            this.drapStatus = 1;
            this.startX = event.changedTouches[0].pageX
            this.startY = event.changedTouches[0].pageY
        },

        //手指移动
        touchmove(objId) { // 如果手指有移动，则取消所有事件，此时说明用户只是要移动而不是长按
            event.preventDefault();
            var moveEndX = event.changedTouches[0].pageX
            var moveEndY = event.changedTouches[0].pageY
            var quesData = this.quesData;
            var rLeft= moveEndX - this.startX; 
            var rTop = moveEndY - this.startY;

            //判断，移动的范围不超出窗口
            rLeft = rLeft <  -quesData.left ? -quesData.left: rLeft;
            rLeft = rLeft > this.winWidth - quesData.left - quesData.width  ? this.winWidth- quesData.left - quesData.width : rLeft;
			rTop = rTop <  -quesData.top ? -quesData.top : rTop;
            rTop = rTop > this.winHeight - quesData.top - quesData.height  ? this.winHeight- quesData.top - quesData.height : rTop;

            //
            this.quesData.x = rLeft;
            this.quesData.y = rTop;

            //滑动过程中，判断是否重叠
            var objStart = objId;
            var objEnd = this.topicData.options.map(item=>{
                return item.id;
            });
            this.isOverlap(objStart,objEnd,(resultObj,resultIndex)=>{
                if(resultObj){
                    this.topicData.options[resultIndex].hover = true;
                }else{
                    this.topicData.options.forEach(item=>{
                        item.hover = false;
                    })
                }
            })
        },

        //手指松开
        touchend(objId) { // 手释放，如果在500毫秒内就释放，则取消长按事件
            event.preventDefault();
            //清除移入效果
            this.topicData.options.forEach(item=>{
                item.hover = false;
            })

            var objStart = objId;
            var objEnd = this.topicData.options.map(item=>{
                return item.id;
            });
            //console.log('手指松开',objStart,objEnd);
            
            //判断两个元素是否重叠
            this.isOverlap(objStart,objEnd,(resultObj,resultIndex)=>{
                if(!resultObj){
                    this.drapStatus = 0;    //未选中状态
                    this.quesData.x = 0;
                    this.quesData.y = 0;
                }else{
                    
                    //判断答案是否正确
                    if(this.topicData.answer == this.topicData.options[resultIndex].answer){
                        //console.log('答案准确');
                        this.answerResultStatus = 2;
                        this.drapStatus = 0;    //未选中状态
                        this.quesData.x = 0;
                        this.quesData.y = 0;
                       //给父级传值
                       this.$emit('successFn', '1' );
                    }else{
                        //console.log('答案错误');
                        this.answerResultStatus = 1;
                        this.drapStatus = 0;    //未选中状态
                        this.quesData.x = 0;
                        this.quesData.y = 0;
                        setTimeout(()=>{
                            this.answerResultStatus = 0;
                        },1000)
                    }

                    
                }
            });

            
        },

        //获取标签元素信息(el:标签rel值);
        getElData(id){
            
            var obj = document.getElementById(id);
            var objData = {
                width   : parseFloat(obj.offsetWidth),  //宽度 
                height  : parseFloat(obj.offsetHeight), //高度
                left    : parseFloat(obj.offsetLeft),   //具体窗口的左边距
                top     : parseFloat(obj.offsetTop),    //距离窗口的右边距
                mLeft   : parseFloat(window.getComputedStyle(obj)?window.getComputedStyle(obj).marginLeft:0),   //margin-left值
                mTop    : parseFloat(window.getComputedStyle(obj)?window.getComputedStyle(obj).marginTop:0),   //margin-left值
                x       : this.quesData.x?this.quesData.x:0,                //translateX的距离
                y       : this.quesData.y?this.quesData.y:0                 //translateY的距离
            }
            return objData;
        },

        //判断两个元素是否重叠(拖拽元素，对比元素集)
        isOverlap(objStart,objEnd,callback){
            var objStart = this.getElData(objStart);
            //获取拖拽元素的中心坐标
            objStart['cLeft'] = objStart.left + objStart.width/2  + objStart.x;
            objStart['cTop'] = objStart.top + objStart.height/2  + objStart.y;
            //this.centerBox = [objStart.cLeft,objStart.cTop]
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
            //console.log(cbObj,num)
            callback && callback(cbObj,num);
        }
    }
};
</script>