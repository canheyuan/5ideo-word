<template>
   <div :class="['topic-answer',animateClass]">
       <div class="txt">
            <h3>{{topicData.title}}</h3>
            <p>{{topicData.title_py}}</p>
       </div>
       <img :src="topicData.imgUrl" alt="">
        <audio v-if="topicData.voiceUrl" id="audio" ref="audioObj" :src="topicData.voiceUrl"></audio>
        <!-- <audio id="audio" ref="audioObj" src="https://test.5ideachinese.com/res/voice/2019/08/23fcff6dc8067dd71ad8b8d2bd51978e.mp3"></audio> -->
   </div>
</template>

<script>
export default {
	name: 'topicAnswer',
	data () {
		return {
            pageLang: this.$store.state.langData.wordTopic,    //语言包
            animateClass:'', //成功图标动画class
            audioObj:null,  //音频对象
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
        this.audioObj = this.$refs.audioObj
        //使用事件监听方式捕捉事件
        this.audioObj.addEventListener("ended",function(){
            _this.animateClass = '';
            setTimeout(()=>{
                _this.$emit('answerResult'); //给父级传值
            },500)
        },false);

        //判断有没音频文件
        if(_this.topicData && _this.topicData.voiceUrl){
            _this.canPlayAudioMP3((res)=>{
                //console.log('检测音频是否有问题：',res);
                if(res){
                    //播放音频
                    setTimeout(()=>{  _this.audioObj.play() },500);
                } else{
                     setTimeout(()=>{
                        _this.animateClass = '';
                        setTimeout(()=>{
                            _this.$emit('answerResult'); //给父级传值
                        },500)
                    },2000);
                }   
            })
        }else{
            setTimeout(()=>{
                _this.animateClass = '';
                setTimeout(()=>{
                    _this.$emit('answerResult'); //给父级传值
                },1000)
            },2000);
        }
    },
    methods:{
        canPlayAudioMP3(callback){
            try {
                // 判断音频文件格式是否有误
                var b = this.audioObj.canPlayType('audio/mpeg') == "probably"?true:false;
                if(!b){  callback(b); return; }

                //监听是否加载完
                this.audioObj.addEventListener('canplaythrough', function(e){
                    //console.log('加载完')
                    callback(true);
                }, false);
                
                //监听音频文件是否有误
                this.audioObj.addEventListener('error', function(e){
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