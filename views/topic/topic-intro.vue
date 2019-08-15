<template>
   <div :class="['topic-answer',animateClass,leaveClass]" v-if="topicData">
        <div class="txt">
            <h3>{{topicData.title}}</h3>
            <p>{{topicData.title_py}}</p>
        </div>
        <img :src="topicData.imgUrl" alt="">
        <div class="learn_btn" @click="gotoTopicFn">Learn NOW!</div>
        <audio v-if="topicData.voiceUrl" id="audio" :src="topicData.voiceUrl"></audio>
   </div>
</template>

<script>
export default {
	name: 'topicIntro',
	data () {
		return {
            animateClass:'', //成功图标动画class
            leaveClass:'',  //离开的class
		}
    },
    // 接受父组件的值
    props: {
        topicData:Object
    },
    created(){
        //加载完页面后执行动画
        setTimeout(()=>{
            this.animateClass = 's-animate';
        },100);
    },
    mounted(){

        var _this = this;
        //判断有没音频文件
        if(_this.topicData && _this.topicData.voiceUrl){
            var audioObj = document.getElementById('audio');
            _this.canPlayAudioMP3((res)=>{
                console.log('res',res);
                if(res){
                    //播放音频
                    setTimeout(()=>{  audioObj.play() },1000);
                }  
            });
        }
    },
    methods:{
        gotoTopicFn(){
             this.$emit('gotoTopic');
        },

        canPlayAudioMP3(callback){
            try {
                var audio = document.getElementById('audio');
                // 判断音频文件格式是否有误
                var b = audio.canPlayType('audio/mpeg') == "probably"?true:false;
                if(!b){  callback(b); return; }

                //监听是否加载完
                audio.addEventListener('canplaythrough', function(e){
                    console.log('加载完')
                    callback(true);
                }, false);
                
                //监听音频文件是否有误
                audio.addEventListener('error', function(e){
                    callback(false);
                }, false);
            }
            catch(e){
                callback(false, e);
            }
        }
    }
};
</script>