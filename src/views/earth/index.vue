<!--
 * @Author: Shber
 * @Date: 2023-03-27 18:13:53
 * @LastEditors: Shber
 * @LastEditTime: 2023-04-04 17:32:48
 * @Description: 
-->
<template>
	<div class="canvas" id="earth"></div>
</template>
<script setup>
	import { reactive, ref , onMounted } from 'vue'
	// import { addPoints } from '@/utils/index.js'
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
	let flyline = reactive({}) // 飞线
	let groupFlyline = reactive({})

	var groupDots = reactive() 
	var groupLines = reactive()
	var groupAnimDots = reactive();
	var animateDots = reactive([]); // 小球运动点轨迹


	// let commonUniforms = reactive({
	// 	time: { value: 0 },
	// 	number: { value: 1 },
	// 	speed: { value: 0.5 },
	// 	length: { value: 0.6 }, // 飞线长度
	// 	size: { value: 2.5 } // 飞线宽度
	// });
	// // 配置参数
	// var params = {
	// 	globeRadius: 10, // 地球半径
	// 	pointsLength: [
	// 		[116.405285, 39.904989],
	// 		[121.472644, 31.231706],
	// 		[113.280637, 23.125178],
	// 		[104.065735, 30.659462]
	// 	], // 点数
	// }
	// var _PI2 = Math.PI * 2; // 弧度的取值为0-2π



	let timer = reactive()

	onMounted(()=>{
    console.log(THREE);
		groupFlyline = new THREE.Group(); // flyline
		groupDots = new THREE.Group();
    groupAnimDots = new THREE.Group();
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

	const  linetimer = ref(0);
	const initFlyline = ()=>{
// 地球飞线和点
// 配置参数
var params = {
    pointsLength: 50, // 点数
    globeRadius: 10 // 地球半径
}

const PI2 = Math.PI * 2; // 弧度的取值为0-2π

// 预制件
var Prefab = {
    Sphere: (function() {
        var instance;
        return function(clone = true) {
            if (!instance) {
                instance = new createSphere();
            }
            if (clone) return instance.clone();
            else return instance;
        }
    })()
}
// 地球飞线和点

    // 球面随机点
    for (let i = 0; i < params.pointsLength; i++) {
        addPoints(groupDots, params.globeRadius);
    }

    // 曲线
    groupDots.children.forEach(function(elem) {
        // 从第一个点到其它点
        if (elem != groupDots.children[0]) {
            var line = addLines(groupDots.children[0].position, elem.position);
            animateDots.push(line.curve.getPoints(100));
        }
    });

    // 小球动画
    for (let i = 0; i < animateDots.length; i++) {
        var mesh = new Prefab.Sphere();
        mesh.material = new THREE.MeshBasicMaterial({
            color: 0xffff00
        });
        mesh.material.needsUpdate = true;
        groupAnimDots.add(mesh);
    }


// 3d球面取点
function getEarthPos(radius, a, b) {
    var x = radius * Math.sin(a) * Math.cos(b);
    var y = radius * Math.sin(a) * Math.sin(b);
    var z = radius * Math.cos(a);
    return {
        x, y, z
    };
}


// 添加随机点
function addPoints(group, radius) {
    var mesh = new Prefab.Sphere();
    var pos = getEarthPos(radius, PI2 * Math.random(), PI2 * Math.random());
    mesh.position.set(pos.x, pos.y, pos.z);
    group.add(mesh);
}

function addLines(v0, v3) {
	groupLines = new THREE.Group();
    var angle = v0.angleTo(v3);

    var vtop = v0.clone().add(v3);
    vtop = vtop.normalize().multiplyScalar(params.globeRadius);

    var n;

    if (angle <= 1) {
        n = params.globeRadius / 5 * angle;
    } else if (angle > 1 && angle < 2) {
        n = params.globeRadius / 5 * Math.pow(angle, 2);
    } else {
        n = params.globeRadius / 5 * Math.pow(angle, 1.5);
    }

    var v1 = v0.clone().add(vtop).normalize().multiplyScalar(params.globeRadius + n);
    var v2 = v3.clone().add(vtop).normalize().multiplyScalar(params.globeRadius + n);


    // 三维三次贝塞尔曲线（v0起点，v1第一个控制点，v2第二个控制点，v3终点）
    var curve = new THREE.CubicBezierCurve3(v0, v1, v2, v3);
    var geometry = new THREE.BufferGeometry();
    geometry.vertices = curve.getPoints(50);
    var material = new THREE.LineBasicMaterial({
        color: 0xff0000
    });
    var lineMesh = new THREE.Line(geometry, material)
    groupLines.add(lineMesh);

    return {
        curve: curve,
        lineMesh: lineMesh
    };
}

function createSphere() {
    var geometry = new THREE.SphereBufferGeometry(0.07);
    var material = new THREE.MeshBasicMaterial({
        color: 0x00ffff
    });
    var mesh = new THREE.Mesh(geometry, material);
    return mesh;
}
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
	const initFlyline1 = ()=>{

		var vertexShader = document.getElementById('vertex-shader').innerHTML;
		var fragmentShader = document.getElementById('fragment-shader').innerHTML;
		// // 预制件
		// var Prefab = {
		// 	Sphere: (function() {
		// 			var instance;
		// 			return function(clone = true) {
		// 					if (!instance) {
		// 							instance = new createSphere();
		// 					}
		// 					if (clone) return instance.clone();
		// 					else return instance;
		// 			}
		// 	})()
		// }

    // 球面随机点
    for (let i = 0; i < params.pointsLength.length; i++) {
        addPoints(groupFlyline, params.globeRadius, params.pointsLength[i][0], params.pointsLength[i][1]);
    }

    // 点到点生成曲线
    groupFlyline.children.forEach(function(elem, index) {
        if (elem != groupFlyline.children[0]) {
            addLines(groupFlyline.children[index - 1].position, elem.position);
        }
    });
		console.log('groupFlyline', groupFlyline);

// 		// 3d球面取点
// function getEarthPos(radius, a, b) {
//     var x = radius * Math.sin(a) * Math.cos(b);
//     var y = radius * Math.sin(a) * Math.sin(b);
//     var z = radius * Math.cos(a);
//     return {
//         x, y, z
//     };
// }

// 添加随机点
// function addPoints(group, radius) {
//     var mesh = new Prefab.Sphere();
//     var pos = getEarthPos(radius, _PI2 * Math.random(), _PI2 * Math.random());
//     mesh.position.set(pos.x, pos.y, pos.z);
//     group.add(mesh);
// }

function addLines(v0, v3) {
    var angle = v0.angleTo(v3);
    var vtop = v0.clone().add(v3);
    vtop = vtop.normalize().multiplyScalar(params.globeRadius);
    var n;

    if (angle <= 1) {
        n = params.globeRadius / 5 * angle;
    } else if (angle > 1 && angle < 2) {
        n = params.globeRadius / 5 * Math.pow(angle, 2);
    } else {
        n = params.globeRadius / 5 * Math.pow(angle, 1.5);
    }

    var v1 = v0.clone().add(vtop).normalize().multiplyScalar(params.globeRadius + n);
    var v2 = v3.clone().add(vtop).normalize().multiplyScalar(params.globeRadius + n);


    // 三维三次贝塞尔曲线（v0起点，v1第一个控制点，v2第二个控制点，v3终点）
    var curve = new THREE.CubicBezierCurve3(v0, v1, v2, v3);
    var points = curve.getPoints(500);
    var geometry = new THREE.BufferGeometry().setFromPoints(points);

    let length = points.length;
    var percents = new Float32Array(length);
    for (let i = 0; i < length; i += 1) {
        percents[i] = (i / length);
    }
    geometry.setAttribute('percent', new THREE.BufferAttribute(percents, 1));

    var material = createLineMaterial();
    var flyLine = new THREE.Points(geometry, material);
    groupFlyline.add(flyLine);
}

function createLineMaterial() {
    let uniforms = {
			time: commonUniforms.time,
			number: commonUniforms.number,
			speed: commonUniforms.speed,
			length: commonUniforms.length,
			size: commonUniforms.size,
			color: {
					value: new THREE.Color(Math.random(), Math.random(), Math.random())
			}
    };
    var material = new THREE.ShaderMaterial({
				uniforms: uniforms,
				vertexShader: vertexShader,
				fragmentShader: fragmentShader,
				transparent: true,
				blending: THREE.AdditiveBlending,
		});
		return material;
}

		// // 小球
		// function createSphere() {
		// 		var geometry = new THREE.SphereBufferGeometry(0.08);
		// 		var material = new THREE.MeshBasicMaterial({
		// 				color: 0x00ffff
		// 		});
		// 		var mesh = new THREE.Mesh(geometry, material);
		// 		return mesh;
		// }
	}

	const initRing = ()=>{
		ringGroup = new THREE.Group()

		const texLoader = new THREE.TextureLoader(); // 创建纹理贴图的加载器
		texLoader.load( '../../model/earth/ring1.png', function ( texture ) {
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
		// earthGroup.add(groupFlyline)
		earthGroup.add(map); // 地图
		earthGroup.add(pointwave) // 光点
		scene.add( ringGroup ); // 星环
		console.log('groupLines', groupLines);
		scene.add(groupDots, groupAnimDots);
		scene.add(groupLines)

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
			// commonUniforms.time.value += 0.01


		// 	requestAnimationFrame(update);
    // renderer.render(scene, camera);

    groupAnimDots.children.forEach((elem, index) => {
        var v = animateDots[index][linetimer.value];
        elem.position.set(v.x, v.y, v.z);
    });
    linetimer.value++;
    if (linetimer.value > 100) {
        linetimer.value = 0;
    }

    // controls.update();

      renders()
  }

	const intoAnimation = ()=>{
		let tween = new TWEEN.Tween(camera.position).to({x: 0, y: 0, z:20}, 4000)
      	tween.start()
	}




</script>