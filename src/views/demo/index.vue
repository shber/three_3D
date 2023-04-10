<!--
 * @Author: Shber
 * @Date: 2023-03-29 11:50:32
 * @LastEditors: Shber
 * @LastEditTime: 2023-04-10 18:59:44
 * @Description: 
-->
<template>
  <ul class="tab_list">
    <li @click="toTarget(tab1)">内容1</li>
    <li @click="toTarget(tab2)">内容2</li>
    <li @click="toTarget(tab3)">内容3</li>
    <li @click="toTarget(tab4)">内容4</li>
    <li @click="toTarget(tab5)">内容5</li>
  </ul>
  <div class="tab_box">
    <div class="tab tab1" ref="tab1" id="tab1">
      这是内容一
    </div>
    <div class="tab tab2" ref="tab2" id="tab2">
      这是内容二
    </div>
    <div class="tab tab3" ref="tab3" id="tab3">
      这是内容三
    </div>
    <div class="tab tab4" ref="tab4" id="tab4">
      这是内容四
    </div>
    <div class="tab tab5" ref="tab5" id="tab5">
      这是内容五
    </div>
  </div>

</template>
<script setup>
  import { onUnmounted, ref } from 'vue';

  let tab1 = ref(null)
  let tab2 = ref(null)
  let tab3 = ref(null)
  let tab4 = ref(null)
  let tab5 = ref(null)
  let itemTop = ref(0)
  let timer = ref()
  let transition = ref(50)

  onUnmounted(()=>{ // 页面销毁 清除动画
		cancelAnimationFrame(timer.value)
	})

  const toTarget = (_item)=>{
    if(_item){
      itemTop.value = _item.offsetTop - 80

      // _item.scrollIntoView({
      //   behavior: 'smooth', 
      //   // block: 'nearest'
      // })
      cancelAnimationFrame(timer.value)
      animation()

    }
  }
  const animation = ()=>{
    if(Math.abs(document.documentElement.scrollTop - itemTop.value) <= transition.value ){
      console.log('停止');
      document.documentElement.scrollTop = itemTop.value
      return cancelAnimationFrame(timer.value)
    }
    else if(document.documentElement.scrollTop < itemTop.value){
      document.documentElement.scrollTop += transition.value
      console.log(document.documentElement.scrollTop, itemTop.value);
      timer.value = requestAnimationFrame(animation)

    }else if(itemTop.value < document.documentElement.scrollTop){
      document.documentElement.scrollTop -= transition.value
      console.log(document.documentElement.scrollTop, itemTop.value);
      timer.value = requestAnimationFrame(animation)
    } 

  }

</script>
<style lang="scss" scoped>
  .tab_list{
    display: flex;
    justify-content: space-around;
    // margin: 40px 0;
    position: sticky;
    top: 0px;
    background: #fff;
    height: 80px;
    line-height: 80px;
    li{font-size: 28px; cursor: pointer;}
  }
  .tab{width: 100vw; height: 700px; background: skyblue; font-size: 32px; text-align: center; font-weight: 500; padding-top: 20px; color: #fff;}
  .tab{background: gold;}
  .tab2{background: greenyellow;}
  .tab3{background: pink;}
  .tab4{background: blueviolet;}
  .tab5{background: red;}
</style>