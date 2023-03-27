<!--
 * @Author: Shber
 * @Date: 2023-03-27 18:13:53
 * @LastEditors: Shber
 * @LastEditTime: 2023-03-27 18:18:23
 * @Description: 
-->
<template></template>
<script setup>
import  * as THREE  from 'three';
  // 引入轨道控制器扩展库OrbitControls.js
  import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
  //引入性能监视器stats.js
  import Stats from 'three/addons/libs/stats.module.js';
  import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
console.log(THREE);

let renderer, camera, scene, light, controls;
	const Dom = document.querySelector( '#app' );
	const width = Dom.clientWidth, height = Dom.clientHeight;
	/**
	 * @description 初始化渲染场景
	 */
	function initRenderer() {
		renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize( width, height );
		const containerDom = document.querySelector( '#app' );
		containerDom.appendChild( renderer.domElement );
	}
	/**
	 * @description 初始化相机
	 */
	function initCamera() {
		camera = new THREE.PerspectiveCamera( 45, width / height, 1, 10000 );
		camera.position.set( 5, - 20, 200 );
		camera.lookAt( 0, 3, 0 );
		window.camera = camera;
	}
	/**
	 * @description 初始化场景
	 */
	function initScene() {
		scene = new THREE.Scene();
		scene.background = new THREE.Color( 0x020924 );
		scene.fog = new THREE.Fog( 0x020924, 200, 1000 );
		window.scene = scene;
	}
	/**
	 * 初始化用户交互
	 **/
	function initControls() {
		controls = new OrbitControls( camera, renderer.domElement );
		controls.enableDamping = true;
		controls.enableZoom = true;
		controls.autoRotate = false;
		controls.autoRotateSpeed = 2;
		controls.enablePan = true;
	}
	/**
	 * @description 初始化光
	 */
	function initLight() {
		const ambientLight = new THREE.AmbientLight( 0xcccccc, 1.1 );
		scene.add( ambientLight );
		var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.2 );
		directionalLight.position.set( 1, 0.1, 0 ).normalize();
		var directionalLight2 = new THREE.DirectionalLight( 0xff2ffff, 0.2 );
		directionalLight2.position.set( 1, 0.1, 0.1 ).normalize();
		scene.add( directionalLight );
		scene.add( directionalLight2 );
		var hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444, 0.2 );
		hemiLight.position.set( 0, 1, 0 );
		scene.add( hemiLight );
		var directionalLight = new THREE.DirectionalLight( 0xffffff );
		directionalLight.position.set( 1, 500, - 20 );
		directionalLight.castShadow = true;
		directionalLight.shadow.camera.top = 18;
		directionalLight.shadow.camera.bottom = - 10;
		directionalLight.shadow.camera.left = - 52;
		directionalLight.shadow.camera.right = 12;
		scene.add(directionalLight);
	}
	/**
	 * 窗口变动
	 **/
	function onWindowResize() {
		camera.aspect = innerWidth / innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize( innerWidth, innerHeight );
		renders();
	}

	/**
	 * @description 渲染
	 */
	function renders() {
		renderer.clear();
		renderer.render( scene, camera );
	}

	/**
	 * 更新
	 **/
	function animate() {
		window.requestAnimationFrame( () => {
			if (controls) controls.update();
			renders();
			animate();
		} );
	}

  window.onload = () => {
		initRenderer();
		initCamera();
		initScene();
		initLight();
		initControls();
		animate();
        window.addEventListener('resize', onWindowResize, false);
	};
</script>