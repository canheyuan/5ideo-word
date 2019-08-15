<template>
   <div class="topic-success">
       <div :class="['success-icon',animateClass]">
           <img src="../../assets/images/ico-success.png" alt="">
       </div>
   </div>
</template>


<script>
export default {
	name: 'topicSuccess',
	data () {
		return {
            animateClass:'',    //成功图标动画class
		}
    },
    created(){
        setTimeout(()=>{
            this.animateClass = 's-animate';
            setTimeout(()=>{
                this.animateClass = '';
            },1000);
        },100);
    }
};
</script>