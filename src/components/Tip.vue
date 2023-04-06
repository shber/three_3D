<!--
 * @Author: Shber
 * @Date: 2023-04-06 16:53:47
 * @LastEditors: Shber
 * @LastEditTime: 2023-04-06 17:24:28
 * @Description: 
-->
<template>
  <div class="s_tip">
    <h3>{{author}} 制作</h3>
    <a class="a" :href="'mailto:shber648@163.com?subject=Hi,'+author">联系作者</a>
  </div>
</template>
<script setup>
  import {ref}  from 'vue'
  const author = ref('诸葛卿年')
</script>
<style lang="scss" scoped>
.s_tip{
  text-align: center;
  position: absolute;
  top: 20px;
  right: 20px;
  h3{font-size: 18px; color: aqua; text-shadow: #fff 3px 0 10px}
  .a{display: block; margin-top: 8px; color: skyblue; }
}
</style>
