<!--
 * @Author: Shber
 * @Date: 2023-03-27 15:17:01
 * @LastEditors: Shber
 * @LastEditTime: 2023-03-30 18:04:59
 * @Description: 
-->
<template>
  <div class="canvas" id="aero"></div>
</template>

<script setup>
  import { onMounted, reactive } from 'vue'
  import * as THREE from 'three'
  import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

  import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
	import { DDSLoader } from 'three/addons/loaders/DDSLoader.js';
	import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
  import Stats from 'three/addons/libs/stats.module.js';

  const stats = new Stats();
	document.body.appendChild(stats.domElement);


  let scene = reactive({}) // 场景
  let camera = reactive({}) // 相机
  let light = reactive({}) // 光源
  let renderer = reactive({}) // 渲染器
  let mesh = reactive({}) // 网格模型
  let aero = reactive({}) // 飞船
  let aeroModel = reactive({}) // 飞船模型
  let aeroMaterial = reactive({}) // 飞船材质
  let controls = reactive({})
  let gridHelper = reactive({})
  let timer = reactive({})


  onMounted(()=>{
    initScene()
    initCamera()
    initRenderer()

    initLight()
    initModel()
    initGridHelper()
    initControls()

  })
  

  const initScene = ()=>{
    scene = new THREE.Scene()
    scene.background = new THREE.Color(0xcccccc)
  }
  const initCamera = ()=>{
    camera = new THREE.PerspectiveCamera(100, window.innerWidth/window.innerHeight, 0.1, 1000)
    camera.position.set(20 , 20, 20)
    camera.lookAt(0, 0, 0)
    scene.add(camera)
  }
  const initLight = ()=>{
    light = new THREE.AmbientLight(0xffffff, 1);
    light.position.set(50, 50, 100);//点光源放在x轴上
    scene.add(light); //点光源添加到场景中
    
  }
  const initModel = ()=>{
    const loader = new FBXLoader().setPath( '../../model/eu_airtransport/' );
      loader.load( 'eu_airtransport.FBX', function ( fbx ) {
        fbx.scale.set(0.1,0.1,0.1);

        const ddsLoader = new DDSLoader() //创建纹理加载器
        let textures = []
        let textureName = ['eu_airtransport_ag', 'eu_airtransport_di', 'eu_airtransport_nm', 'eu_airtransport_sp', 'eu_rotorblur' ]

        textureName.forEach(item=>{
          textures.push(ddsLoader.load( `../../model/eu_airtransport/${item}.dds` ))
        })
        
        const texture = ddsLoader.load( '../../model/eu_airtransport/eu_airtransport_ag.dds' );
        const texture1 = ddsLoader.load( '../../model/eu_airtransport/eu_airtransport_di.dds' );
        const texture2 = ddsLoader.load( '../../model/eu_airtransport/eu_airtransport_nm.dds' );
        const texture3 = ddsLoader.load( '../../model/eu_airtransport/eu_airtransport_sp.dds' );
        const texture4 = ddsLoader.load( '../../model/eu_airtransport/eu_rotorblur.dds' );
        // Assign texture to material
        fbx.traverse( function ( child ) {
          if(child instanceof THREE.Mesh) {
            child.material.map = texture1;
            child.material.shininess=0.5;
      
            child.castShadow = true
            child.receiveShadow = true

            child.material.transparent=true;//材质允许透明 如果有玻璃材质时开启
            child.material.opacity=1;//材质默认透明度   
          }
        });
        aero =  fbx 
        scene.add( fbx );
        renders()
    });

  }
  const initGridHelper = ()=>{
    gridHelper = new THREE.GridHelper(300, 50, 0x999999, 0x999999);
    gridHelper.material.opacity = 1;
    gridHelper.material.transparent = true;
    scene.add( gridHelper );
  }



  const initRenderer = ()=>{
    renderer = new THREE.WebGLRenderer({ antialias: true } )
    renderer.setSize( window.innerWidth, window.innerHeight ); // 设置渲染区域尺寸

    renders()
    document.getElementById("aero").appendChild( renderer.domElement );
  }
  const renders = ()=>{
		// cancelAnimationFrame(timer)
    stats.update();
    renderer.render( scene, camera );
		// timer = requestAnimationFrame(animation) // 采用循环动画帧率的方案，帧率锁60，但是性能消耗小

  }

  const initControls = ()=>{
      controls = new OrbitControls(camera, renderer.domElement);
      controls.addEventListener('change', function (e) { //监听事件
        renders()
      });
			controls.enableDamping = true 
			controls.minDistance = 0.1;
			controls.maxDistance = 100;
      // controls.enableZoom = false
  }
  const animation = ( time )=> {
			aero.rotation.y += 0.0001
      // renders()
  }



</script>