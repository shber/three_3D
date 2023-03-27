<!--
 * @Author: Shber
 * @Date: 2023-03-27 16:12:07
 * @LastEditors: Shber
 * @LastEditTime: 2023-03-27 16:55:11
 * @Description: 
-->
<template></template>

<script setup>
  import * as THREE from 'three'

  const drawModule = ()=>{
    // const stats = new Stats();
    //     // 实例化一个gui对象
    // const gui = new GUI();
    //创建一个对象，对象属性的值可以被GUI库创建的交互界面改变

    const camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 1, 300 ); 
    camera.position.set(0, 0, 1); // 设置相机位置，原理就像在房子不同的位置拍照出现的画面效果也不同，参数分别是 x轴，y轴，和z轴
    camera.lookAt(0, 0, 0); //坐标原点
    const scene = new THREE.Scene(); // 创建3D场景

    const geometry = new THREE.SphereGeometry( 50, 32, 16 ); // 球体
    //纹理贴图加载器TextureLoader
    const texLoader = new THREE.TextureLoader();
    // .load()方法加载图像，返回一个纹理对象Texture
    const texture = texLoader.load('../../model/77/Texture/mc3.png');
    const material = new THREE.MeshLambertMaterial({
        // 设置纹理贴图：Texture对象作为材质map属性的属性值
        map: texture,//map表示材质的颜色贴图属性
    });  
    const mesh = new THREE.Mesh( geometry, material ); //网格模型对象Mesh
    scene.add( mesh ); // 往3D场景里添加模型

    const renderer = new THREE.WebGLRenderer( { antialias: true } ); // 创建一个WebGL渲染对象
    renderer.setClearColor(0x444444, 1); //设置背景颜色
    renderer.setSize( window.innerWidth, window.innerHeight ); // 设置渲染区域尺寸
    // renderer.setAnimationLoop( animation ); // 执行动画循环
    renderer.render( scene, camera ); // 执行渲染操作

    document.body.appendChild( renderer.domElement ); // domElement 本质上就是一个HTML元素：Canvas画布
  }
  drawModule()


</script>