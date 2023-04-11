<!--
 * @Author: Shber
 * @Date: 2023-03-29 11:50:32
 * @LastEditors: Shber
 * @LastEditTime: 2023-04-11 12:13:50
 * @Description: 
-->
<template>
  <div class="canvas" id="palace"></div>

</template>
<script setup>
  import { onMounted, onUnmounted, reactive, ref } from 'vue';
  import  * as THREE  from 'three';
  import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

  onMounted(()=>{
    init();
		animate();
  })

  onUnmounted(()=>{ // 页面销毁 清除动画
		// cancelAnimationFrame(timer.value)
	})


  let camera = reactive({});
  let controls = reactive({});
  let renderer = reactive({});
  let scene = reactive({});


  const init = () => {
    const container = document.getElementById( 'palace' );

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 100 );
    camera.position.z = 0.01;

    controls = new OrbitControls( camera, renderer.domElement );
    // controls.enableZoom = false;
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.rotateSpeed = - 0.25;

    const textures = getTexturesFromAtlasFile( '../../model/palace/sun_temple_stripe.jpg', 6 );

    const materials = [];
    for ( let i = 0; i < 6; i ++ ) {
      materials.push( new THREE.MeshBasicMaterial( { map: textures[ i ] } ) );
    }

    const skyBox = new THREE.Mesh( new THREE.BoxGeometry( 1, 1, 1 ), materials );
    skyBox.geometry.scale( 1, 1, - 1 );
    scene.add( skyBox );

    window.addEventListener( 'resize', onWindowResize );

  }

  const getTexturesFromAtlasFile = ( atlasImgUrl, tilesNum ) => {
    const textures = [];
    for ( let i = 0; i < tilesNum; i ++ ) {
      textures[ i ] = new THREE.Texture();
    }

    new THREE.ImageLoader()
      .load( atlasImgUrl, ( image ) => {
        console.log('atlasImgUrl', atlasImgUrl);
        let canvas, context;
        const tileWidth = image.height;

        for ( let i = 0; i < textures.length; i ++ ) {
          canvas = document.createElement( 'canvas' );
          context = canvas.getContext( '2d' );
          canvas.height = tileWidth;
          canvas.width = tileWidth;
          console.log('img', image);
          context.drawImage( image, tileWidth * i, 0, tileWidth, tileWidth, 0, 0, tileWidth, tileWidth );
          textures[ i ].image = canvas;
          textures[ i ].needsUpdate = true;
        }

      });

    return textures;
  }

  const onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
  }

  const animate = () => {
    requestAnimationFrame( animate );
    controls.update(); // required when damping is enabled
    renderer.render( scene, camera );
  }

</script>
<style lang="scss" scoped>

</style>