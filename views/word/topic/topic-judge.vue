<template>
    <div :class="['topic-box','topic-box03',{'box_animate':enterAnimate}]">
        <div
            id="quesBox" 
            :class="['question-box','animated',{'shake':shakeClass}]"
            :style="`transform:translate(${quesData.x}px,${quesData.y}px) ${drapStatus==1?'scale(.5,.5)':''};};`"
             @touchstart="touchstart('quesBox')" @touchmove="touchmove('quesBox')" @touchend="touchend('quesBox')"
        >
            <img :src="topicData.otherImgUrl" alt="">
            <h3>{{topicData.title}}</h3>
            <p>{{topicData.title_py}}</p>
        </div>
        <div class="answer-box" id="btnBox">
            <div :class="['btn',{'hover':topicData.options[0].hover}]" @click="chooseAnswerFn('false')" :id="topicData.options[0].id">
                <i class="word-icons ico-mistake"></i>
            </div>
            <span class="txt">{{pageLang.orText[lang]}}</span>
            <div :class="['btn',{'hover':topicData.options[1].hover}]" @click="chooseAnswerFn('true')" :id="topicData.options[1].id">
                <i class="word-icons ico-correct" ></i>
            </div>
        </div>
    </div>
</template>


<script>
export default {
    components: {
        
    },
	name: 'topic01',
	data () {
		return {
            pageLang: this.$store.state.langData.wordTopic,    //语言包
            enterAnimate:false,
            shakeClass:false,
            quesData:{},        //元素的位置信息
            drapStatus:0,
		}
    },
    computed: { //计算属性
        lang(){ return this.$store.state.lan },    //获取语言
    },
    props:{
        topicData:Object
    },
    mounted(){
        this.enterAnimate = true;
        //获取浏览器宽高
        this.winWidth = document.documentElement.clientWidth;
        this.winHeight = document.documentElement.clientHeight;

         //获取元素的信息
        this.quesData = this.getElData('quesBox');
        
    },
    methods:{

        //选择对错
        chooseAnswerFn(answer){
            if(this.topicData.answer == answer){
                //给父级传值
                this.$emit('successFn', '3' );
            }else{
                this.shakeClass = true;
                setTimeout(()=>{
                     this.shakeClass = false;
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
            rLeft = rLeft <  -quesData.left-quesData.width*0.25 ? -quesData.left-quesData.width*0.25: rLeft;
            rLeft = rLeft > this.winWidth - quesData.left - quesData.width*0.75  ? this.winWidth - quesData.left - quesData.width*0.75 : rLeft;
			rTop = rTop <  -quesData.top-quesData.height*0.25 ? -quesData.top-quesData.height*0.25 : rTop;
            rTop = rTop > this.winHeight - quesData.top - quesData.height*0.75  ? this.winHeight- quesData.top - quesData.height*0.75 : rTop;

            this.quesData.x = rLeft;
            this.quesData.y = rTop;

            var btnIndex = this.quesData.x<0?0:1;
            this.topicData.options.forEach((item,i)=>{
                if(btnIndex == i){
                    item.hover = true;
                }else{
                    item.hover = false;
                }
            });
            //this.topicData.options[btnIndex].hover = true;

            // return;
            // //滑动过程中，判断是否重叠
            // var objStart = objId;
            // var objEnd = ['mistakeBtn','correctBtn'];
            // this.isOverlap(objStart,objEnd,(resultObj,resultIndex)=>{
            //     if(resultObj){
            //         console.log('重叠')
            //         this.topicData.options[resultIndex].hover = true;
            //     }else{
            //         console.log('未重叠')
            //         this.topicData.options.forEach(item=>{
            //             item.hover = false;
            //         });
            //     }
            // });
        },

        //手指松开
        touchend(objId) { // 手释放，如果在500毫秒内就释放，则取消长按事件
            event.preventDefault();
            //清除移入效果
            this.topicData.options.forEach(item=>{
                item.hover = false;
            })

            var btnIndex = this.quesData.x<0?0:1;
            if(this.topicData.answer == this.topicData.options[btnIndex].answer){
                this.drapStatus = 0;    //未选中状态
                this.quesData.x = 0;
                this.quesData.y = 0;
                //给父级传值
                this.$emit('successFn', '3' );
            }else{
                this.drapStatus = 0;    //未选中状态
                this.quesData.x = 0;
                this.quesData.y = 0;
                this.shakeClass = true;
                setTimeout(()=>{
                    this.shakeClass = false;
                },1000)
            }

            // return;
            // var objStart = objId;
            // var objEnd = ['mistakeBtn','correctBtn'];
            // console.log('手指松开',objStart,objEnd);

            
            
            // //判断两个元素是否重叠
            // this.isOverlap(objStart,objEnd,(resultObj,resultIndex)=>{
            //     if(!resultObj){
            //         this.drapStatus = 0;    //未选中状态
            //         this.quesData.x = 0;
            //         this.quesData.y = 0;
            //     }else{
            //         //判断答案是否正确
            //         if(this.topicData.answer == this.topicData.options[resultIndex].answer){

            //             this.drapStatus = 0;    //未选中状态
            //             this.quesData.x = 0;
            //             this.quesData.y = 0;
            //            //给父级传值
            //            this.$emit('successFn', '3' );
            //         }else{
            //             this.drapStatus = 0;    //未选中状态
            //             this.quesData.x = 0;
            //             this.quesData.y = 0;
            //             this.shakeClass = true;
            //             setTimeout(()=>{
            //                 this.shakeClass = false;
            //             },1000)
            //         } 
            //     }
            // });

        },

        //获取标签元素信息(el:标签rel值);
        getElData(id,parent){
            var pTop = parent?document.getElementById('btnBox').offsetTop:0;
            var obj = document.getElementById(id);
            var objData = {
                width   : parseFloat(obj.offsetWidth),  //宽度 
                height  : parseFloat(obj.offsetHeight), //高度
                left    : parseFloat(obj.offsetLeft),   //具体窗口的左边距
                top     : parseFloat(obj.offsetTop + pTop),    //距离窗口的上边距
                mLeft   : parseFloat(window.getComputedStyle(obj)?window.getComputedStyle(obj).marginLeft:0),   //margin-left值
                mTop    : parseFloat(window.getComputedStyle(obj)?window.getComputedStyle(obj).marginTop:0),   //margin-left值
                x       : this.quesData.x ? this.quesData.x : 0,                //translateX的距离
                y       : this.quesData.y ? this.quesData.y : 0                 //translateY的距离
            }
            return objData;
        },

        //判断两个元素是否重叠(拖拽元素，对比元素集)
        isOverlap(objStart,objEnd,callback){
            var objStart = this.getElData(objStart);
            //获取拖拽元素的中心坐标
            objStart['cLeft'] = objStart.left + objStart.width/2  + objStart.x;
            objStart['cTop'] = objStart.top + objStart.height/2  + objStart.y;

            

            return;
            var answerArr = objEnd.map(item=>{
                 return this.getElData(item,'btnBox');
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