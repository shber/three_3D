<!--
 * @Author: Shber
 * @Date: 2023-03-25 14:44:04
 * @LastEditors: Shber
 * @LastEditTime: 2023-03-27 17:17:34
 * @Description: 
-->
<template></template>

<script setup>
  import { onMounted } from 'vue'
  import * as THREE from 'three'
  // 引入轨道控制器扩展库OrbitControls.js
  import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
  //引入性能监视器stats.js
  import Stats from 'three/addons/libs/stats.module.js';
  import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

  import { FontLoader } from 'three/addons/loaders/FontLoader.js'

  onMounted(()=>{
    console.log(THREE);
  })
// const fontLoader = new FontLoader()

// fontLoader.load(
//     '<facetype>',
//     (font) =>
//     {
//         console.log('loaded')
//     }
// )

    const floatToColor = (num)=> {
      // 将小数乘以256并向下取整得到0-255之间的整数
      var color = Math.floor(num * 256);
      // 将整数转换为16进制形式，如果不足2位则在前面补0
      var hex = color.toString(16);
      if (hex.length < 2) {
        hex = "0" + hex;
      }
      // 将2位的16进制数复制3遍得到6位16进制数
      hex = hex.repeat(6);
      // 在前面添加#作为颜色值的标志
      return "0x" + hex;
    }

    const floatToColor1 = (floatNum)=> {
      // 将小数乘以256得到0-255之间的整数
      let num = Math.floor(floatNum * 256);

      // 将整数转换为16进制的颜色值
      let hexValue = num.toString(16);
      
      // 如果生成的颜色值只有1位，则在前面加上一个0
      if (hexValue.length === 1) { 
        hexValue = "0" + hexValue;
      }

      // 返回黄绿渐变色值
      return "0x" + hexValue + "ff" + hexValue;
    }


    const randomColor = () => {
      // 随机生成 R、G、B 三个颜色通道的值
      let r = Math.floor(Math.random() * 256).toString(16);
      let g = Math.floor(Math.random() * 256).toString(16);
      let b = Math.floor(Math.random() * 256).toString(16);
      
      // 补齐单字符长度
      r = r.length === 1 ? '0' + r : r;
      g = g.length === 1 ? '0' + g : g;
      b = b.length === 1 ? '0' + b : b;
      
      // 拼接成 16位颜色值
      return '0x' + r + g + b;
    }


    

  const drawModule = ()=>{
    const stats = new Stats();
        // 实例化一个gui对象
    const gui = new GUI();
    //创建一个对象，对象属性的值可以被GUI库创建的交互界面改变




    // 创建一个透视相机 参数：
    const camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 0.01, 10 ); 
    // camera.position.z = 1;
    console.log('camera.position', camera.position);
    camera.position.set(0, 0, 1); // 设置相机位置，原理就像在房子不同的位置拍照出现的画面效果也不同，参数分别是 x轴，y轴，和z轴
    camera.lookAt(0, 0, 0); //坐标原点
    const scene = new THREE.Scene(); // 创建3D场景

    const pointLight = new THREE.PointLight(0x87ceeb, 1); // 设置点光源，有多种光源类型

    pointLight.position.set(10, 0, 100);//点光源放在x轴上



     // 光源辅助观察
    // const pointLightHelper = new THREE.PointLightHelper(pointLight, 10);

    const geometry = new THREE.BoxGeometry( 0.2, 0.2, 0.2 ); // 创建模型，长方形（正方形也属于长方形）模型  
    // const geometry = new THREE.SphereGeometry( 50, 32, 16 ); // 球体

    //纹理贴图加载器TextureLoader
const texLoader = new THREE.TextureLoader();
// .load()方法加载图像，返回一个纹理对象Texture
const texture = texLoader.load('../../model/77/Texture/衣服.png');
const material = new THREE.MeshLambertMaterial({
    // 设置纹理贴图：Texture对象作为材质map属性的属性值
    // color:0xff6600,
    map: texture,//map表示材质的颜色贴图属性
    transparent:true,
    opacity:1,
    side:THREE.DoubleSide,
    wireframe:true,//线条模式渲染mesh对应的三角形数据
});                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
    // const material = new THREE.MeshPhongMaterial({
    //   color:0xff6600
    // }); // 创建材质 MeshLambertMaterial-受光照影响，漫反射 

    const mesh = new THREE.Mesh( geometry, material ); //网格模型对象Mesh
    scene.add( mesh ); // 往3D场景里添加模型
    scene.add(pointLight); //点光源添加到场景中

    gui.add(pointLight, 'intensity', 0, 2.0).name('环境光强度'); // 改变光源的亮度
    
    // 改变模型的位置
    gui.add(mesh.position, 'x', 0, 1).name('x轴位置');
    gui.add(mesh.position, 'y', 0, 1).name('y轴位置');
    // gui.add(mesh.position, 'z', 0, 1).name('z轴位置');

    gui.add({z:0}, 'z', 0, 1).onChange(function(value){
      // mesh.position.x = value;
        console.log('z轴坐标发生变化', value, floatToColor(value));
        
      // 你可以写任何你想跟着obj.x同步变化的代码
      // 比如mesh.position.y = value;
      renderer.setClearColor(floatToColor1(value)*1, 1); //设置背景颜色
    }).name('z轴位置');

    gui.addColor({color:0x87ceeb}, 'color').onChange(function(value){
        mesh.material.color.set(value);
    }).name('改变颜色');

    const renderer = new THREE.WebGLRenderer( { antialias: true } ); // 创建一个WebGL渲染对象
    renderer.setClearColor(0x444444, 1); //设置背景颜色
    renderer.setSize( window.innerWidth, window.innerHeight ); // 设置渲染区域尺寸
    renderer.setAnimationLoop( animation ); // 执行动画循环
    // renderer.render( scene, camera ); // 执行渲染操作

    document.body.appendChild( renderer.domElement ); // domElement 本质上就是一个HTML元素：Canvas画布

    const controls = new OrbitControls(camera, renderer.domElement);
    // 如果OrbitControls改变了相机参数，重新调用渲染器渲染三维场景
    controls.addEventListener('change', function (e) {
      stats.update();
      // console.log('change', camera.position);
        // renderer.render(scene, camera); //执行渲染操作
    });//监听鼠标、键盘事件

    // animation
    function animation( time ) {
      mesh.rotation.x = time / 2000;
      mesh.rotation.y = time / 1000;
      renderer.render( scene, camera ); // 执行渲染操作
    }
}
drawModule()

</script>