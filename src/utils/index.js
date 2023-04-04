/*
 * @Author: Shber
 * @Date: 2023-04-04 10:38:12
 * @LastEditors: Shber
 * @LastEditTime: 2023-04-04 16:11:54
 * @Description: 
 */
import  * as THREE  from 'three';

let groupLines = new THREE.Group();

var vertexShader = document.getElementById('vertex-shader').innerHTML;
var fragmentShader = document.getElementById('fragment-shader').innerHTML;

var _PI2 = Math.PI * 2; // 弧度的取值为0-2π
// 配置参数
var params = {
  globeRadius: 10, // 地球半径
  pointsLength: 20, // 点数
}
let commonUniforms = {
    time: { value: 0 },
    number: { value: 1 },
    speed: { value: 0.5 },
    length: { value: 0.4 },
    size: { value: 1 }
};

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


// 3d球面取点
export function getEarthPos(radius, a, b) {
  var x = radius * Math.sin(a) * Math.cos(b);
  var y = radius * Math.sin(a) * Math.sin(b);
  var z = radius * Math.cos(a);
  return {
      x, y, z
  };
}

// export function createLineMaterial() {
//     let uniforms = {
// 			time: commonUniforms.time,
// 			number: commonUniforms.number,
// 			speed: commonUniforms.speed,
// 			length: commonUniforms.length,
// 			size: commonUniforms.size,
// 			color: {
// 					value: new THREE.Color(Math.random(), Math.random(), Math.random())
// 			}
//     };
//     var material = new THREE.ShaderMaterial({
// 				uniforms: uniforms,
// 				vertexShader: vertexShader,
// 				fragmentShader: fragmentShader,
// 				transparent: true,
// 				blending: THREE.AdditiveBlending,
// 		});
// 		return material;
// }

// 小球
export function createSphere() {
  var geometry = new THREE.SphereBufferGeometry(0.07);
  var material = new THREE.MeshBasicMaterial({
      color: 0xff6600
  });
  var mesh = new THREE.Mesh(geometry, material);
  return mesh;
}


export function update() {
  // requestAnimationFrame(update);
  return commonUniforms.time.value;

  // controls.update();
}


// export function addLines(v0, v3, createLineMaterial) {
//   var angle = v0.angleTo(v3);

//   var vtop = v0.clone().add(v3);
//   vtop = vtop.normalize().multiplyScalar(params.globeRadius);

//   var n;

//   if (angle <= 1) {
//       n = params.globeRadius / 5 * angle;
//   } else if (angle > 1 && angle < 2) {
//       n = params.globeRadius / 5 * Math.pow(angle, 2);
//   } else {
//       n = params.globeRadius / 5 * Math.pow(angle, 1.5);
//   }
//   n+=10
//   var v1 = v0.clone().add(vtop).normalize().multiplyScalar(params.globeRadius + n);
//   var v2 = v3.clone().add(vtop).normalize().multiplyScalar(params.globeRadius + n);

//   // addLineHelper(globeMesh.position, v1);
//   // addLineHelper(globeMesh.position, v2);
//   // addLineHelper(globeMesh.position, vtop)

//   // 三维三次贝塞尔曲线（v0起点，v1第一个控制点，v2第二个控制点，v3终点）
//   var curve = new THREE.CubicBezierCurve3(v0, v1, v2, v3);
//   var points = curve.getPoints(500);
//   var geometry = new THREE.BufferGeometry().setFromPoints(points);

//   let length = points.length;
//   var percents = new Float32Array(length);
//   for (let i = 0; i < length; i += 1) {
//       percents[i] = (i / length);
//   }
//   geometry.setAttribute('percent', new THREE.BufferAttribute(percents, 1));

//   var material = createLineMaterial;
//   var flyLine = new THREE.Points(geometry, material);
//   groupLines.add(flyLine);
// }


// 添加随机点
export function addPoints(group, radius, start, end) {
    var mesh = new Prefab.Sphere();
    // console.log("_PI2 * Math.random()", _PI2 * Math.random());
    var pos = getEarthPos(radius, _PI2 * start, _PI2 * end);

    // var pos = getEarthPos(radius, _PI2 * Math.random(), _PI2 * Math.random());
    console.log('pos', pos);
    mesh.position.set(pos.x, pos.y, pos.z);
    group.add(mesh);
}