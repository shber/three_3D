<!--
 * @Author: Shber
 * @Date: 2023-03-27 18:13:53
 * @LastEditors: Shber
 * @LastEditTime: 2023-03-31 16:56:37
 * @Description: 
-->
<template>
	<div class="canvas" id="earth"></div>
</template>
<script setup>
	import { reactive, onMounted } from 'vue'
	import  * as THREE  from 'three';

	import * as TWEEN from '@tweenjs/tween.js'
  // 引入轨道控制器扩展库OrbitControls.js 配置addons/等价于examples/jsm/。
  import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

	import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
	import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
	import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
  //引入性能监视器stats.js
  import Stats from 'three/addons/libs/stats.module.js';
  import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
	import * as chinaMap from '../../../public/model/earth/china.json'

	const stats = new Stats();
	document.body.appendChild(stats.domElement);


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
	let chinaLine = reactive({})
	let province =reactive({})
	let map = reactive({})

	let ringGroup = reactive({})
	let starRing = reactive({})
	let starRing1 = reactive({})
	let starRing2 = reactive({})



	let timer = reactive()

	onMounted(()=>{
		console.log(chinaMap)
    console.log(THREE);

		initScene() // 创建3D场景
    initCamera() // 创建相机
    initLight() // 创建光照效果
		initRing()

		// 	initChinaMap(chinaMap)

    initRenderer() // 开始合成
    initModel() // 创建模型，例如长方体，球体等
		initBackground()
    initMesh() // 创建网格模型
		initCasque()
    initControls() // 添加控制器
		intoAnimation() // 添加进场动画
	})

	const initScene = () =>{
		scene = new THREE.Scene()
		scene.background = new THREE.Color(0x000416); // 设置场景背景颜色
	}
	const initCamera = ()=>{
		camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 ); 
		camera.position.set(0, 0, 101); // 设置相机位置，原理就像在房子不同的位置拍照出现的画面效果也不同，参数分别是 x轴，y轴，和z轴
    camera.lookAt(0, 0, 0); //坐标原点
    scene.add(camera); // 将相机添加到场景中
	}
	const initLight = ()=>{
    // 平行光
    var directionalLight = new THREE.DirectionalLight(0x80b5ff, 1);
    directionalLight.position.set(-250, 250, 100);
    scene.add(directionalLight);
    
    // 点光
    var pointLight = new THREE.PointLight(0x80d4ff, 1);
    pointLight.position.set(-250, 250, 100);
    scene.add(pointLight);
 
    // 半球光
    var hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x3d6399, 1);
    hemisphereLight.position.set(-250, 250, 100);
    scene.add(hemisphereLight);
 
    //环境光
    var ambient = new THREE.AmbientLight(0x002bff, 0.8);
    scene.add(ambient);
	}
	const lglt2xyz =(lng, lat, radius)=> {
		const theta = (90 + lng) * (Math.PI / 180)
		const phi = (90 - lat) * (Math.PI / 180)
		return (new THREE.Vector3()).setFromSpherical(new THREE.Spherical(radius, phi, theta))
	}

	const initChinaMap = (chinaJson )=>{
		
	}
	const initRing = ()=>{
		ringGroup = new THREE.Group()
		// const geometry = new THREE.RingGeometry( 12, 12.1, 100 );
		// const material = new THREE.MeshBasicMaterial( { color: 0xff6600, side: THREE.DoubleSide,  opacity: 0.5, transparent:true } );
		// starRing = new THREE.Mesh( geometry, material );

		// const geometry1 = new THREE.RingGeometry( 12.1, 12.2, 100 );
		// const material1 = new THREE.MeshBasicMaterial( { color: 0xffff00, side: THREE.DoubleSide,  opacity: 0.5, transparent:true } );
		// starRing1 = new THREE.Mesh( geometry1, material1 );

		// const geometry2 = new THREE.RingGeometry( 12.3, 12.3, 100 );
		// const material2 = new THREE.MeshBasicMaterial( { color: 0xff6600, side: THREE.DoubleSide,  opacity: 0.5, transparent:true } );
		// starRing2 = new THREE.Mesh( geometry2, material2 );

		// ringGroup.add(starRing)
		// ringGroup.add(starRing1)
		// ringGroup.add(starRing2)

		// ringGroup.rotation.x = 1
		// ringGroup.rotation.y = 2
		// ringGroup.rotation.z = 3
		const texLoader = new THREE.TextureLoader(); // 创建纹理贴图的加载器
		texLoader.load( '../../model/earth/ring2.png', function ( texture ) {
			const geometry = new THREE.RingGeometry( 12, 15, 100 );
			// var geometry = new THREE.PlaneGeometry( 80, 80 );
			var material = new THREE.MeshLambertMaterial( {
				map: texture, 
				transparent: true,
				opacity: 0.5,
				side: THREE.DoubleSide, 
				depthWrite: false
			} );
			var mesh = new THREE.Mesh( geometry, material );
			ringGroup.add( mesh );
		} );

		texLoader.load( '../../model/earth/moon1.png', function ( texture ) {
			var p1 = new THREE.Vector3( - 12, 0, 0 );
			var p2 = new THREE.Vector3( 12, 0, 0 );
			const points = [ p1,p2];
			const geometry = new THREE.BufferGeometry().setFromPoints( points );
			var material = new THREE.PointsMaterial( {
				map: texture,
				transparent: true,
				side: THREE.DoubleSide, 
				size: 1, 
				depthWrite: false
			} );
			var earthPoints = new THREE.Points( geometry, material );
			ringGroup.add( earthPoints );
		} );
		ringGroup.rotation.set( 1.9, 0.5, 1.5 );

	}


	const initRenderer = ()=>{
    renderer = new THREE.WebGLRenderer( { antialias: true } ); // 创建一个WebGL渲染对象
    renderer.setSize( window.innerWidth, window.innerHeight ); // 设置渲染区域尺寸

    // renderer.setAnimationLoop( animation ); // 执行动画循环 帧率不会锁60
		renders()
    document.getElementById("earth").appendChild( renderer.domElement );
  }

	const initBackground = ()=>{ // 星空背景
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
		let texture = texLoader.load( '../../model/earth/earth3.png'); // 地球贴图
		let cloidTexture = texLoader.load( '../../model/earth/cloud2.png'); // 云贴图
		material = new THREE.MeshLambertMaterial({map: texture, side:THREE.DoubleSide}); // 切换漫反射材质
		cloudMaterial = new THREE.MeshBasicMaterial({map: cloidTexture, opacity: 1, transparent:true}); 
  }

	const initMesh = ()=> {
		earthGroup = new THREE.Group(); 

    mesh = new THREE.Mesh( model, material ); //网格模型对象Mesh, 把几何体模型与材质传过来
    earthGroup.add( mesh ); // 往3D场景里添加模型

		earthGroup.add( ringGroup );

		colud = new THREE.Mesh( cloudGeometry, cloudMaterial ); //网格模型对象Mesh, 把几何体模型与材质传过来
    scene.add( colud ); // 往3D场景里添加模型
		earthGroup.rotation.y = -3.4
		earthGroup.rotation.x = 0.5
		scene.add(earthGroup)
  }

	const initCasque = ()=>{ // 彩蛋，头盔模型
		new RGBELoader()
					.setPath( '../../textures/equirectangular/' )
					.load( 'royal_esplanade_1k.hdr', function ( texture ) {
						texture.mapping = THREE.EquirectangularReflectionMapping;
						scene.environment = texture;

						const loader = new GLTFLoader().setPath( '../../model/DamagedHelmet/glTF/' );
						loader.load( 'DamagedHelmet.gltf', function ( gltf ) {
							scene.add( gltf.scene );
							renders()
						});
					});
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
	const renders = ()=> { // 执行渲染操作
		cancelAnimationFrame(timer)
		TWEEN.update()
		stats.update();
		renderer.render( scene, camera );
		timer = requestAnimationFrame(animation) // 采用循环动画帧率的方案，帧率锁60，但是性能消耗小
	}

  const animation = ( time )=> {
      earthGroup.rotation.y -= 0.0001;
			ringGroup.rotation.z += 0.001;
			colud.rotation.y += 0.0001
      renders()
  }

	const intoAnimation = ()=>{
		let tween = new TWEEN.Tween(camera.position).to({x: 0, y: 0, z:20}, 4000)
      	tween.start()
	}




</script>