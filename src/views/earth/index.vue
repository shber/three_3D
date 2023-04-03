<!--
 * @Author: Shber
 * @Date: 2023-03-27 18:13:53
 * @LastEditors: Shber
 * @LastEditTime: 2023-04-03 18:43:50
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

  let gui = reactive({}) // 全局控制
	let scene = reactive({}) // 场景
  let camera = reactive({}) // 相机
  let light = reactive({}) // 灯光
  let renderer = reactive({}) // 渲染
  let controls = reactive({}) // 控制器

	let earthGroup = reactive({}) // 地球模型组
	let earth = reactive({}) // 地球
	let colud = reactive({}) // 云层
	let map = reactive() // 中国地图
	let pointwave = reactive({}) // 光点涟漪
	let ringGroup = reactive({}) // 星环
	let flyline =reactive({}) // 飞线




	let timer = reactive()

	onMounted(()=>{
    console.log(THREE);

		initScene() // 创建3D场景
    initCamera() // 创建相机
    initLight() // 创建光照效果
		initRing() // 星环
		initFlyline() // 飞线
		// initPointwave()
		initChinaMap(chinaMap) // 地图轮廓

    initRenderer() // 开始合成
    initModel() // 创建模型，例如长方体，球体等
		// initBeam()
		initBackground()
    initMesh() // 创建网格模型
		// initCasque()
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


	const initChinaMap = (chinaJson )=>{
		const lglt2xyz =(lng, lat, radius)=> {
			const theta = (90 + lng) * (Math.PI / 180)
			const phi = (90 - lat) * (Math.PI / 180)
			return (new THREE.Vector3()).setFromSpherical(new THREE.Spherical(radius, phi, theta))
		}

		map = new THREE.Group()
		// 遍历省份构建模型
		chinaJson.features.forEach( elem => {
			// 新建一个省份容器：用来存放省份对应的模型和轮廓线
			let province = new THREE.Group();
			const coordinates = elem.geometry.coordinates;
			coordinates.forEach( multiPolygon => {
				multiPolygon.forEach( polygon => {
					const lineMaterial = new THREE.LineBasicMaterial( { color: 0XF19553 } ); //0x3BFA9E
					const positions = [];
					const linGeometry = new THREE.BufferGeometry();
					for (let i = 0; i < polygon.length; i ++) {
						var pos = lglt2xyz( polygon[i][0], polygon[i][1] );
						positions.push( pos.x, pos.y, pos.z );
					}
					linGeometry.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
					const line = new THREE.Line( linGeometry, lineMaterial );
					province.add( line );
				} );
			} );
			map.add( province );
		} );
		map.scale.set(10,10,10)


	}


	const initPointwave = (WaveMeshArr)=>{
  // 所有波动光圈都有自己的透明度和大小状态
  // 一个波动光圈透明度变化过程是：0~1~0反复循环
			// WaveMeshArr.forEach(function (mesh) {
			// 	mesh._s += 0.007;
			// 	mesh.scale.set(
			// 		mesh.size * mesh._s,
			// 		mesh.size * mesh._s,
			// 		mesh.size * mesh._s
			// 	);
			// 	if (mesh._s <= 1.5) {
			// 		mesh.material.opacity = (mesh._s - 1) * 2; //2等于1/(1.5-1.0)，保证透明度在0~1之间变化
			// 	} else if (mesh._s > 1.5 && mesh._s <= 2) {
			// 		mesh.material.opacity = 1 - (mesh._s - 1.5) * 2; //2等于1/(2.0-1.5) mesh缩放2倍对应0 缩放1.5被对应1
			// 	} else {
			// 		mesh._s = 1.0;
			// 	}
			// })
			
		var point = new THREE.PlaneBufferGeometry(1,1)
		const texLoader = new THREE.TextureLoader(); 
		let pointTexture = texLoader.load('../../model/earth/point.png');
		var material = new THREE.MeshBasicMaterial({
				map: pointTexture,
				color:0xffc300,
				map: pointTexture,
				transparent: true, //使用背景透明的png贴图，注意开启透明计算
				depthWrite:false,//禁止写入深度缓冲区数据
		});

		pointwave = new THREE.Mesh( point, material );
		pointwave.scale.set(12, 12, 12)
		pointwave.position.set(3, 0, 0)
		// pointwave.rotation.set(20, 20, 20)
	
	}
	const initFlyline = ()=>{
/**
         * 创建线条模型
         */
				 var geometry = new THREE.BufferGeometry(); //创建一个缓冲类型几何体
        // 三维样条曲线
        var curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(10, 0, -10),
            new THREE.Vector3(0, 8, 0),
            // new THREE.Vector3(0, 80, 90),
            new THREE.Vector3(-10, 0, 10),
        ]);
        //曲线上等间距返回多个顶点坐标
        var points = curve.getSpacedPoints(100); //分段数100，返回101个顶点
        // setFromPoints方法从points中提取数据赋值给attributes.position
        geometry.setFromPoints(points);
        var material = new THREE.LineBasicMaterial({
            color: 0x006666, //轨迹颜色
        });
        //线条模型对象
        var line = new THREE.Line(geometry, material);
        scene.add(line);

        var index = 20; //取点索引位置
        var num = 10; //从曲线上获取点数量
        var points2 = points.slice(index, index + num); //从曲线上获取一段
        var geometry2 = new THREE.BufferGeometry();
        geometry2.setFromPoints(points2);


        // 批量计算所有顶点颜色数据
        var posNum = points2.length - 2; //分界点黄色，两端和轨迹线一个颜色青色
        var colorArr = [];
        for (var i = 0; i < points2.length; i++) {
            var color1 = new THREE.Color(0x006666); //轨迹线颜色 青色
            var color2 = new THREE.Color(0xffff00); //黄色
            var color = null;
            // 飞线段里面颜色设置为黄色，两侧设置为青色，也就是说中间某个位置向两侧颜色渐变
            if (i < posNum) {
                color = color1.lerp(color2, i / posNum)
            } else {
                color = color2.lerp(color1, (i - posNum) / (points2.length - posNum))
            }
            colorArr.push(color.r, color.g, color.b);
        }
        // 设置几何体顶点颜色数据
        geometry2.attributes.color = new THREE.BufferAttribute(new Float32Array(colorArr), 3);


        var material2 = new THREE.LineBasicMaterial({
            // color: 0xffff00, //轨迹颜色
            vertexColors: THREE.VertexColors, //使用顶点颜色，不用设置color
             linewidth: 3.0, // 设置线宽
        });
        //线条模型对象
        var line2 = new THREE.Line(geometry2, material2);
        scene.add(line2);

		// scene.add(addLines(0,100))

	}

	const initRing = ()=>{
		ringGroup = new THREE.Group()

		const texLoader = new THREE.TextureLoader(); // 创建纹理贴图的加载器
		texLoader.load( '../../model/earth/ring.png', function ( texture ) {
			// const geometry = new THREE.RingGeometry( 12, 15, 100 );
			var geometry = new THREE.PlaneGeometry( 32.5, 32.5 );
			var material = new THREE.MeshLambertMaterial( {
				color: 0xffffff,
				map: texture, 
				transparent: true,
				opacity: 0.5,
				side: THREE.DoubleSide, 
				depthWrite: false
			} );
			var mesh = new THREE.Mesh( geometry, material );
			ringGroup.add( mesh );
		});

		texLoader.load( '../../model/earth/moon.png', function ( texture ) {
			var moon = new THREE.Vector3( 12.01, 0, 0 );
			const geometry = new THREE.BufferGeometry().setFromPoints( [moon] );
			var material = new THREE.PointsMaterial( {
				map: texture,
				transparent: true,
				side: THREE.DoubleSide, 
				size: 2, 
				depthWrite: false
			} );
			var earthPoints = new THREE.Points( geometry, material );
			ringGroup.add( earthPoints );
		} );
		ringGroup.rotation.set( 1.7, 0.2, 1.5 );
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
		let startGeometry = new THREE.BufferGeometry();
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

		let starsMaterial = new THREE.PointsMaterial({
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
    let earthGeometry = new THREE.SphereGeometry(10, 100, 100); // 地球模型
		let cloudGeometry = new THREE.SphereGeometry(10.1, 100, 100); // 云模型		

		const texLoader = new THREE.TextureLoader(); // 创建纹理贴图的加载器
		let texture = texLoader.load( '../../model/earth/earth3.png'); // 地球贴图
		let cloidTexture = texLoader.load( '../../model/earth/cloud1.png'); // 云贴图
		let earthMaterial = new THREE.MeshLambertMaterial({map: texture, side:THREE.DoubleSide}); // 切换漫反射材质
		let cloudMaterial = new THREE.MeshBasicMaterial({map: cloidTexture, opacity: 0.3, transparent:true}); 

		colud = new THREE.Mesh( cloudGeometry, cloudMaterial );
    earth = new THREE.Mesh( earthGeometry, earthMaterial ); //网格模型对象Mesh, 把几何体模型与材质传过来
  }

	const initMesh = ()=> {
		earthGroup = new THREE.Group(); 

    earthGroup.add( earth ); // 往3D场景里添加地球模型
    scene.add( colud ); // 云层
		earthGroup.add(map); // 地图
		earthGroup.add(pointwave) // 光点
		scene.add( ringGroup ); // 星环

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

  const animation = ( )=> {
      earthGroup.rotation.y -= 0.0001;
			ringGroup.rotation.z += 0.01;
			colud.rotation.y += 0.0001
      renders()
  }

	const intoAnimation = ()=>{
		let tween = new TWEEN.Tween(camera.position).to({x: 0, y: 0, z:20}, 4000)
      	tween.start()
	}




</script>