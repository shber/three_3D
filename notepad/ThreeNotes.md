# vue3 搭建 THREE.js

### 安装 three.js

`npm install three.js --save`

### 图形化基础了解 (重点)

```text
1. 场景
2. 摄像头（相机也在场景里面）
3. 物体
4. 渲染器
```

基本使用
`创建场景，然后创建摄像头，放入物体，之后添加到body当中，最后渲染器进行渲染`

```vue
<script>
import * as THREE from 'three';
import {onMounted} from 'vue'
export default {
  name: 'HomeView',
  setup(){
    console.log(THREE);
    onMounted(()=>{
      // 创建场景
      const scene = new THREE.Scene()
      console.log(scene);
      // 创建相机 (透视相机)
      const camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000)
      console.log(camera);
      // 设置相机位置
      camera.position.set(0,0,10)
      scene.add(camera)

      // 添加物体
      const cubeGeometry = new THREE.BoxGeometry(1,1,1);
      // 设置物体材质
      const cubeMaterial = new THREE.MeshBasicMaterial({color:0xfff00})
      // 根据几何体和材质创建物体
      const cube = new THREE.Mesh(cubeGeometry,cubeMaterial)
      // 将几何体添加到场景当中
      scene.add(cube)

      // 初始化渲染器
      const renderer = new THREE.WebGLRenderer()
      // 设置渲染的尺寸和大小
      renderer.setSize(window.innerWidth,window.innerHeight)
      // 渲染器添加到body当中
      document.body.appendChild(renderer.domElement)

      // 使用渲染器，通过相机将场景渲染出来
      renderer.render(scene,camera)
    })
  }
}
```

### 轨道控制器查看物体

`官方描述：Orbit controls（轨道控制器）可以使得相机围绕目标进行轨道运动。`

- 首先引入轨道对象
  `import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';`
  注意这里有的人会出现错误，要下载最新的 three.js ，查看官网文档
- new OrbitControls(camera,renderer.domElement)
  `new OrbitControls('将要被控制的相机','用于事件监听的HTML元素')`
  （个人理解：轨道渲染器只是开始了一个轨道监听，当你拖动鼠标或者放大缩小时,将会改变相机位置，将相机信息存储起来,当渲染器重新渲染时更新界面。--- 需要重新触发渲染器进行重新渲染）

### 添加坐标轴辅助器

```js
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);
```

### 设置物体移动-旋转-缩放

```js
// 设置物体移动
cube.position.set(1, 0, 0);

// 设置物体缩放
cube.scale.set(1, 2, 1);

// 设置物体旋转
cube.rotation.set(Math.PI / 4, 0, 0);
```

### 跟踪时间

Clock 该对象用于跟踪时间。如果 performance.now 可用，则 Clock 对象通过该方法实现，否则回落到使用略欠精准的 Date.now 来实现。（该对象有很多方法，如果涉及时间方面的可以看一下）

`我的理解，getDelta目前这个方法比较特殊，由于 getElapsedTime 获取自时钟启动后的秒数，同时将 .oldTime 设置为当前时间。所以之后调用 getDelta 将会是0 `

```
// 获取时钟运行的总时长
// let time = clock.getElapsedTime()
// 两次获取时间的间隔时间
// let deltaTime = clock.getDelta()
```

### gsap 补间动画

##### 动画很多效果很好，但是有大量 api 和英文文档 需要时间去记

安装 ： `npm i gsap`

```js
import gsap from "gsap";
let animate = gsap.to(cube.position, {
  x: 5,
  //动画时长
  duration: 5,
  // 动画速度
  ease: "power1.inOut",
  // 结束的回调
  onComplete: () => {
    console.log("动画完成");
  },
  // 开始的回调
  onStart: () => {
    console.log("动画开始");
  },
  // 设置重复的次数，无限次就是 -1
  repeat: 2,
  // 往返运动
  yoyo: true,
  // 设置延迟时间
  delay: 2,
});
gsap.to(cube.rotation, {
  x: 2 * Math.PI,
  duration: 5,
  ease: "power1.inOut",
});
window.addEventListener("dblclick", () => {
  if (animate.isActive()) {
    // 暂停
    animate.pause();
  } else {
    // 恢复
    animate.resume();
  }
});
```

### 根据尺寸变化实现自适应画面

```js
window.addEventListener("resize", () => {
  // 更新摄像机
  camera.aspect = window.innerWidth / window.innerHeight;
  // 更新摄像机的投影矩阵
  camera.updateProjectionMatrix();
  // 更新渲染器
  renderer.setSize(window.innerWidth, window.innerHeight);
  // 设置渲染器像素比
  renderer.setPixelRatio(window.devicePixelRatio);
});
```

### 应用图形用户界面更改变量

安装 npm i --save dat.gui

```js
import * as dat from "dat.gui";
const gui = new dat.GUI();
// 设置x轴移动
gui
  .add(cube.position, "x")
  .min(0)
  .max(5)
  .step(0.1)
  .name("移动x轴坐标")
  .onChange((value) => {
    console.log("值被修改了", value);
  })
  .onFinishChange((value) => {
    console.log("停下来后才会触发", value);
  });
// 设置x轴旋转
gui
  .add(cube.rotation, "x")
  .min(0)
  .max(Math.PI * 2)
  .step(0.1)
  .name("旋转x轴坐标")
  .onChange((value) => {
    console.log("值被修改了", value);
  })
  .onFinishChange((value) => {
    console.log("停下来后才会触发", value);
  });
// 设置物体颜色
gui
  .addColor({ color: "#ffff00" }, "color")
  .onChange((value) => {
    console.log("颜色被修改了", value);
    cube.material.color.setStyle(value);
  })
  .name("修改颜色");
// 设置物体是否显示
gui
  .add(cube, "visible")
  .name("是否显示物体")
  .onChange((value) => {
    console.log("是否显示物体", value);
  });
// 设置按钮，点击触发某个函数
gui
  .add(
    {
      fn: () => {
        gsap.to(cube.position, { x: 5, duration: 3, yoyo: true, repeat: -1 });
      },
    },
    "fn"
  )
  .name("开启动画");
// 设置一个 文件夹
var folder = gui.addFolder("设置立方体");
folder.add(cube.material, "wireframe");
```
