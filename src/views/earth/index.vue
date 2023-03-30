<!--
 * @Author: Shber
 * @Date: 2023-03-27 18:13:53
 * @LastEditors: Shber
 * @LastEditTime: 2023-03-30 12:25:48
 * @Description: 
-->
<template>
	<div class="earth" id="earth"></div>
</template>
<script setup>
	import { reactive, onMounted } from 'vue'
	import  * as THREE  from 'three';
  // 引入轨道控制器扩展库OrbitControls.js 配置addons/等价于examples/jsm/。
  import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

	import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
	import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
	import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
  //引入性能监视器stats.js
  import Stats from 'three/addons/libs/stats.module.js';
  import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

	var fovMax = 75,
  fovMin = 5,
  fovTmp = 0;

	let scene = reactive({}) // 场景
  let camera = reactive({}) // 相机
  let light = reactive({}) // 灯光
  let renderer = reactive({}) // 渲染
  let mesh = reactive({}) // 网格模型
  let model = reactive({}) // 地球模型
  let material = reactive([]) //地球材质包
  let controls = reactive({}) // 控制器
  let gui = reactive({}) // 全局控制
	let startGeometry = reactive({})
	let starsMaterial = reactive({})

	let colud = reactive({})
	let cloudGeometry = reactive({}) // 云层模型
	let cloudMaterial = reactive({}) // 云层材质
	let earthGroup = reactive({}) // 模型组


	onMounted(()=>{
		console.log(FBXLoader)
    console.log(THREE);

		initScene() // 创建3D场景
    initCamera() // 创建相机
    // initLight() // 创建光照效果
    initRenderer() // 开始合成
    initModel() // 创建模型，例如长方体，球体等
		initBackground()
    initMesh() // 创建网格模型
		initCasque()
    initControls() // 添加控制器

		intoAnimation()
	})

	const initScene = () =>{
		scene = new THREE.Scene()
		scene.background = new THREE.Color(0x020924); // 设置场景背景颜色







	}
	const initCamera = ()=>{
		camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 ); 
		// camera.position.z = 5
		camera.position.set(0, 0, 20); // 设置相机位置，原理就像在房子不同的位置拍照出现的画面效果也不同，参数分别是 x轴，y轴，和z轴
    camera.lookAt(0, 0, 0); //坐标原点
    scene.add(camera); // 将相机添加到场景中
	}

	const initRenderer = ()=>{
    renderer = new THREE.WebGLRenderer( { antialias: true } ); // 创建一个WebGL渲染对象
    renderer.setSize( window.innerWidth, window.innerHeight ); // 设置渲染区域尺寸
		// setTimeout(()=>{
		// 	renderer.render( scene, camera ); // 执行渲染操作
		// },300)
    renderer.setAnimationLoop( animation ); // 执行动画循环
    document.getElementById("earth").appendChild( renderer.domElement );
  }

	const initBackground = ()=>{
		const texLoader = new THREE.TextureLoader(); // 创建纹理贴图的加载器
		let texture = texLoader.load( '../../model/earth/star.png');

		const positions = [];
		const colors = [];
		startGeometry = new THREE.BufferGeometry();
		for (var i = 0; i < 20000; i ++) {
			var vertex = new THREE.Vector3();
			vertex.x = Math.random() * 2 - 1;
			vertex.y = Math.random() * 2 - 1;
			vertex.z = Math.random() * 2 - 1;
			positions.push( vertex.x, vertex.y, vertex.z );
			var color = new THREE.Color();
			color.setHSL( Math.random() * 0.2 + 0.5, 0.55, Math.random() * 0.25 + 0.55 );
			colors.push( color.r, color.g, color.b );
		}
		startGeometry.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
		startGeometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );

		starsMaterial = new THREE.PointsMaterial({
			map: texture,
			size: 1,
			transparent: true,
			opacity: 1,
			vertexColors: true, //true：且该几何体的colors属性有值，则该粒子会舍弃第一个属性--color，而应用该几何体的colors属性的颜色
			blending: THREE.AdditiveBlending,
			sizeAttenuation: true
		});
		
		let stars = new THREE.Points( startGeometry, starsMaterial );
		stars.scale.set( 300, 300, 300 );
		scene.add( stars );

	}

	const initModel = ()=>{
    model = new THREE.SphereGeometry(10, 100, 100); // 地球模型
		cloudGeometry = new THREE.SphereGeometry(10.1, 100, 100); // 云模型			
		const texLoader = new THREE.TextureLoader(); // 创建纹理贴图的加载器
		let texture = texLoader.load( '../../model/earth/earth2.jpg'); // 地球贴图
		let cloidTexture = texLoader.load( '../../model/earth/cloud2.png'); // 云贴图
		material = new THREE.MeshBasicMaterial({map: texture, side:THREE.DoubleSide});
		cloudMaterial = new THREE.MeshBasicMaterial({map: cloidTexture, opacity: 1, transparent:true}); 
  }

	const initMesh = ()=> {
		earthGroup = new THREE.Group(); 

    mesh = new THREE.Mesh( model, material ); //网格模型对象Mesh, 把几何体模型与材质传过来
    earthGroup.add( mesh ); // 往3D场景里添加模型

		colud = new THREE.Mesh( cloudGeometry, cloudMaterial ); //网格模型对象Mesh, 把几何体模型与材质传过来
    scene.add( colud ); // 往3D场景里添加模型

		scene.add(earthGroup)
  }

	const initCasque = ()=>{
		new RGBELoader()
					.setPath( '../../textures/equirectangular/' )
					.load( 'royal_esplanade_1k.hdr', function ( texture ) {
						texture.mapping = THREE.EquirectangularReflectionMapping;
						scene.environment = texture;

						const loader = new GLTFLoader().setPath( '../../model/DamagedHelmet/glTF/' );
						loader.load( 'DamagedHelmet.gltf', function ( gltf ) {
							scene.add( gltf.scene );
							renderer.render( scene, camera );
						});
					});
	}


  const initControls = ()=>{
      controls = new OrbitControls(camera, renderer.domElement);
      controls.addEventListener('change', function (e) { //监听事件
        renderer.render(scene, camera); //执行渲染操作
      });
			controls.enableDamping = true 
			controls.minDistance = 1;
			controls.maxDistance = 80;
      // controls.enableZoom = false
  }

  const animation = ( time )=> {
      // mesh.rotation.x = time / 2000;
      earthGroup.rotation.y -= 0.001;
			colud.rotation.y -= 0.0001
      renderer.render( scene, camera ); // 执行渲染操作
  }

	const intoAnimation = ()=>{
			console.log(camera.fov);
			requestAnimationFrame(()=>{camera.fov+=1})
	}




</script>
<style lang="scss" scoped>
.earth{width: 100vw; height: 100vh; position: relative;}
</style>