/*
 * @Author: Shber
 * @Date: 2023-04-04 10:38:12
 * @LastEditors: Shber
 * @LastEditTime: 2023-04-06 15:11:42
 * @Description: 
 */
import  * as THREE  from 'three';

// 地图坐标转3D坐标点
export function lglt2xyz (lng, lat, radius) { 
  const theta = (90 + lng) * (Math.PI / 180)
  const phi = (90 - lat) * (Math.PI / 180)
  return (new THREE.Vector3()).setFromSpherical(new THREE.Spherical(radius, phi, theta))
}

// 预制件
export function createSphere (size) {
  var geometry = new THREE.SphereGeometry(size); // 坐标点的大小
  var material = new THREE.MeshBasicMaterial({ color: 0x00ffff });
  var mesh = new THREE.Mesh(geometry, material);
  return mesh;
}
export let Prefab = {
    Sphere: (function(size = 0.03) {
        var instance;
        return function(clone = true) {
            if (!instance) {
                instance = new createSphere(size);
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
  return { x, y, z };
}
