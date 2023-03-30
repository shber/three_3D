<!--
 * @Author: Shber
 * @Date: 2023-03-25 14:44:04
 * @LastEditors: Shber
 * @LastEditTime: 2023-03-30 11:50:52
 * @Description: 
-->
<template>
  <div class="house" id="house">
    <div class="controls">
      <span class="controls_btn" @click="checkScene('house')">主卧</span>
      <span class="controls_btn" @click="checkScene('street')">街道</span>
      <span class="controls_btn">洗手间</span>
      <span class="controls_btn">厨房</span>
    </div>
    <div class="top_controls">
      <span class="controls_btn" @click="fullScreen">全屏</span>
      <span class="controls_btn">暂停</span>
    </div>
  </div>
</template>

<script setup>
  import { onMounted, reactive, ref } from 'vue'
  import * as THREE from 'three'
  // 引入轨道控制器扩展库OrbitControls.js
  import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

  //引入性能监视器stats.js
  import Stats from 'three/addons/libs/stats.module.js';

  //创建一个对象，对象属性的值可以被GUI库创建的交互界面改变
  import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
  import { FontLoader } from 'three/addons/loaders/FontLoader.js'


  onMounted(()=>{
    console.log(THREE);
    initScene() // 创建3D场景
    initCamera() // 创建相机
    initLight() // 创建光照效果
    initRenderer() // 开始合成
    initModel() // 创建模型，例如长方体，球体等
    initMesh() // 创建网格模型
    initControls() // 添加控制器
    // initGui() // 

    // onresize 事件会在窗口被调整大小时发生
    window.onresize = function () {
        // 重置渲染器输出画布canvas尺寸
        renderer.setSize(window.innerWidth, window.innerHeight);
        // 全屏情况下：设置观察范围长宽比aspect为窗口宽高比
        camera.aspect = window.innerWidth / window.innerHeight;
        // 渲染器执行render方法的时候会读取相机对象的投影矩阵属性projectionMatrix
        // 但是不会每渲染一帧，就通过相机的属性计算投影矩阵(节约计算资源)
        // 如果相机的一些属性发生了变化，需要执行updateProjectionMatrix ()方法更新相机的投影矩阵
        camera.updateProjectionMatrix();
    };

  })


  const modelData = reactive({
    'street':[
      {name:'右', url: '../../model/house1/右.png' },
      {name:'后', url: '../../model/house1/后.png' },
      {name:'上', url: '../../model/house1/上.png' },
      {name:'下', url: '../../model/house1/下.png' },
      {name:'左', url: '../../model/house1/左.png' },
      {name:'正', url: '../../model/house1/正.png' },
    ],
    'house':[
      {name:'右', url: '../../model/house/右.png' },
      {name:'后', url: '../../model/house/后.png' },
      {name:'上', url: '../../model/house/上.png' },
      {name:'下', url: '../../model/house/下.png' },
      {name:'左', url: '../../model/house/左.png' },
      {name:'正', url: '../../model/house/正.png' },
    ]
  })
  const modelName = ref('house')
  
  let scene = reactive({})
  let camera = reactive({})
  let light = reactive({})
  let renderer = reactive({})
  let mesh = reactive({})
  let geometry = reactive({})
  let materials = reactive([]) //材质包
  let controls = reactive({})
  let gui = reactive({}) // 全局控制


  const checkScene = (_name)=>{
    if(modelName.value === _name){return false}
    modelName.value = _name
    materials = []
    removeScene()
    setTimeout(()=>{
      initModel()
      initMesh()
    },300)

  }

  const fullScreen = ()=>{
    document.documentElement.webkitRequestFullScreen();
  }

  const initScene = () =>{ // 创建3D场景
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x444444); // 设置场景背景颜色
  }

  const initCamera = ()=>{ // 创建相机
    camera = new THREE.PerspectiveCamera( 80, window.innerWidth / window.innerHeight, 1, 10000 ); 
    camera.position.set(0, 0, 1); // 设置相机位置，原理就像在房子不同的位置拍照出现的画面效果也不同，参数分别是 x轴，y轴，和z轴
    camera.lookAt(0, 0, 0); //坐标原点
    scene.add(camera); // 将相机添加到场景中
  } 

  const initLight = ()=>{
    light = new THREE.PointLight(0xffffff, 1); // 设置点光源，有多种光源类型
    light.position.set(10, 0, 100);//点光源放在x轴上
    scene.add(light); //点光源添加到场景中
  }

  const initRenderer = ()=>{
    renderer = new THREE.WebGLRenderer( { antialias: true } ); // 创建一个WebGL渲染对象
    // renderer.setClearColor(0x444444, 1); //设置背景颜色
    renderer.setSize( window.innerWidth, window.innerHeight ); // 设置渲染区域尺寸
    renderer.setAnimationLoop( animation ); // 执行动画循环
    // document.body.appendChild( renderer.domElement ); // domElement 本质上就是一个HTML元素：Canvas画布
    document.getElementById("house").appendChild( renderer.domElement );
  }

  const initModel = ()=>{
    geometry = new THREE.BoxGeometry( 20, 25, 20 ); // 创建模型，长方形（正方形也属于长方形）模型
    // let picList = ["右", "后", "上", "下", "左", "正" ];
    let picList = modelData[modelName.value];
    const texLoader = new THREE.TextureLoader(); // 创建纹理贴图的加载器
    picList.forEach(item=>{ // 把6张贴图贴到长方体的六个面
      // let texture = texLoader.load( `/model/house/${item}.png` );
      let texture = texLoader.load( item.url );
      materials.push(new THREE.MeshBasicMaterial({ map: texture, side:THREE.DoubleSide })); // 添加到材质包
    })  
  }

  const initMesh = ()=> {
    mesh = new THREE.Mesh( geometry, materials ); //网格模型对象Mesh, 把几何体模型与材质传过来
    scene.add( mesh ); // 往3D场景里添加模型
  }

  const initControls = ()=>{
      controls = new OrbitControls(camera, renderer.domElement);
      controls.addEventListener('change', function (e) { //监听事件
        renderer.render(scene, camera); //执行渲染操作
      });
      controls.minDistance = 1;
			controls.maxDistance = 3;
      // controls.enableZoom = false
  }

  const removeScene = ()=>{
    scene.remove(mesh);
  }

  const animation = ( time )=> {
      // mesh.rotation.x = time / 2000;
      mesh.rotation.y = time / 30000;
      renderer.render( scene, camera ); // 执行渲染操作
  }
  const initGui = ()=> {
    gui = new GUI();

    gui.addColor({color:0x87ceeb}, 'color').onChange(function(value){
        mesh.material.color.set(value);
    }).name('加速⏩');
  }


</script>
<style lang="scss" scoped>
.house{width: 100vw; height: 100vh; position: relative;}
.controls{
  display: flex;
  justify-content: space-around;
  position: absolute;
  bottom: 8%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9;
}
span.controls_btn{
    font-weight: 500;
    margin: 0 10px;
    background: rgba($color: #fff, $alpha: 0.6);
    padding: 10px 15px;
    border-radius: 8px;
    cursor: pointer;
  }
.top_controls{
  position: absolute; top: 20px; right: 20px; z-index: 8;
}
</style>