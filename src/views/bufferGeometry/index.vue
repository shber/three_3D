<!--
 * @Author: Shber
 * @Date: 2023-03-27 15:17:01
 * @LastEditors: Shber
 * @LastEditTime: 2023-03-27 18:37:17
 * @Description: 
-->
<template></template>

<script setup>
  import { onMounted } from 'vue'
  import * as THREE from 'three'



// 创建一个长宽高为 100 的向量
const size = new THREE.Vector3( 100, 100, 100 );

//创建一个长方体的顶点位置数据
const vertices = [
    -size.x,  size.y, -size.z, // vertex 0
     size.x,  size.y, -size.z, // vertex 1
     size.x,  size.y,  size.z, // vertex 2
    -size.x,  size.y,  size.z, // vertex 3
    -size.x, -size.y, -size.z, // vertex 4
     size.x, -size.y, -size.z, // vertex 5
     size.x, -size.y,  size.z, // vertex 6
    -size.x, -size.y,  size.z  // vertex 7
];

// 创建一个长方体每个面的法向量数据
const normals = [
  0,  1,  0,  // top
  0,  0,  1,  // front
  1,  0,  0,  // right
  0, -1,  0,  // bottom
  0,  0, -1,  // back
 -1,  0,  0   // left
];

//为每个面定义索引(下标)数据
const indices = [
    0, 1, 2, 0, 2, 3, // top
    4, 5, 6, 4, 6, 7, // bottom
    3, 2, 6, 3, 6, 7, // front
    0, 1, 5, 0, 5, 4, // back
    1, 2, 6, 1, 6, 5, // right
    0, 3, 7, 0, 7, 4  // left
];

  // 创建到渲染流程 1，选择模型，创建透视相机（camera），创建3D场景（scene），创建一个WebGL渲染对象（WebGLRenderer）并设置渲染对象大小，把弄好的模型添加进3D场景（scene），执行渲染（render），append到DOM
  const geometry = new THREE.BufferGeometry(); 
    // 创建一个透视相机 参数：// 30:视场角度, width / height:Canvas画布宽高比, 1:近裁截面, 3000：远裁截面
    const camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 1, 300 ); 
    // camera.position.z = 1;
    camera.position.set(100, 0, 0); // 设置相机位置，原理就像在房子不同的位置拍照出现的画面效果也不同，参数分别是 x轴，y轴，和z轴
    camera.lookAt(1, 0, 0); //坐标原点
    const scene = new THREE.Scene(); // 创建3D场景

//类型化数组创建顶点数据
// const vertices = new Float32Array([
//     0, 0, 0, //顶点1坐标
//     50, 0, 0, //顶点2坐标
//     0, 100, 0, //顶点3坐标
//     0, 0, 10, //顶点4坐标
//     0, 0, 100, //顶点5坐标
//     50, 0, 10, //顶点6坐标
// ]);
//创建一个立方体的顶点位置数据

// 创建属性缓冲区对象
//3个为一组，表示一个顶点的xyz坐标
// const attribue = new THREE.BufferAttribute(vertices, 3); 
// 设置几何体attributes属性的位置属性
// geometry.attributes.position = attribue;

geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3)); // 设置顶点位置属性
geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));     // 设置法向量属性
geometry.setIndex(indices);  
// 点渲染模式
const material = new THREE.MeshNormalMaterial(); 
const Mesh = new THREE.Mesh(geometry, material); //点模型对象
scene.add( Mesh ); // 往3D场景里添加模型

// const material = new THREE.LineBasicMaterial({
//     color: 0xff6600, //线条颜色
// }); 
// // 创建线模型对象
// const line = new THREE.LineLoop(geometry, material);
// scene.add( line ); // 往3D场景里添加模型


const renderer = new THREE.WebGLRenderer( { antialias: true } ); // 创建一个WebGL渲染对象
renderer.setClearColor(0xcccccc, 1); //设置背景颜色
renderer.setSize( window.innerWidth, window.innerHeight ); // 设置渲染区域尺寸
renderer.render( scene, camera ); // 执行渲染操作
// renderer.setAnimationLoop( animation ); // 执行动画循环
document.body.appendChild( renderer.domElement ); // domElement 本质上就是一个HTML元素：Canvas画布


    // animation
    function animation( time ) {
      points.rotation.x = time / 2000;
      points.rotation.y = time / 1000;
      renderer.render( scene, camera ); // 执行渲染操作
    }

</script>