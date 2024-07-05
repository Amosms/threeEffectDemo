<template>
  <div>
    <canvas
        width="1000"
        height="600"
        id="c"
        style="border: 1px solid rgba(69, 154, 235, 0.55)"
    ></canvas>
  </div>
</template>
<script setup>
import { onMounted } from 'vue'
import * as fabric from 'fabric' // 引入 fabric
import * as THREE from 'three'
import {calculatePointOnLineNear} from "@/utils/2dUtil";



function init() {
  const canvas = new fabric.Canvas('c') // 这里传入的是canvas的id

  let startPoint = null, endPoint = null, exitPoint = null, reCCline = null, step=0, gap = 15, rePolygon = null;
  canvas.on('mouse:up', (e) => {
    const p = fabric.util.getPointer(e.e);
    if (step === 0 || step === 1) {
      const cCircle = new fabric.Circle({
        top: p.y - 5,
        left: p.x - 5,
        radius: 5, // 圆的半径 50
        fill: 'red'
      })
      canvas.add(cCircle)
    }
    if (step === 0)
      startPoint = new THREE.Vector2(p.x, p.y)
    else if (step === 1){
      // 绘制矩形
      endPoint = new THREE.Vector2(p.x, p.y)
      canvas.getObjects().filter(value => {
        if (value.get("type") === 'group') {
          // value._objects[0].set('fill', "transparent")
          // value._objects[0].setCoords()
          value.remove(value._objects[1])
        }
      })
      // 绘制出口坐标点
      const exitNor = new THREE.Vector2(0, endPoint.y - startPoint.y).normalize();
      const ePoint = exitNor.setLength(gap).add(startPoint);
      const cCircle = new fabric.Circle({
        top: ePoint.y - 5,
        left: ePoint.x - 5,
        radius: 5, // 圆的半径 50
        fill: 'blue',
        stroke: '#6639a6',
        id: 'gd'
      })
      canvas.add(cCircle)
      exitPoint = ePoint
      // 默认管道出口坐标并绘制初始管道
    } else {
      //确认最终管道坐标
    }
    step++;
  });

  canvas.on('mouse:move', (e) => {
    const p = fabric.util.getPointer(e.e);
    if (step === 1) {
      if (reCCline)
        canvas.remove(reCCline)
      const cCline = new fabric.Line([startPoint.x, startPoint.y, p.x, p.y], {
        strokeDashArray: [5, 5],
        stroke: 'red'
      });
      const polygon = new fabric.Polygon([
        {x: startPoint.x, y: startPoint.y},
        {x: startPoint.x, y: p.y},
        {x: p.x, y: p.y},
        {x: p.x, y: startPoint.y}
      ], {
        fill: 'rgba(255, 0, 0, 0.1)', // 填充色
        stroke: 'red', // 线段颜色：紫色
      })
      rePolygon = polygon
      const centerPoint = new THREE.Vector2().lerpVectors(new THREE.Vector2(startPoint.x, startPoint.y),
          new THREE.Vector2(p.x, p.y), 0.5)
      const topTextPoint = new THREE.Vector2(0, -1).setLength(15).add(centerPoint)
      const topText = new fabric.Text("预估管长", {
        left: topTextPoint.x - 27,
        top: topTextPoint.y - 10,
        fontSize: 14,
      })
      const bottomTextPoint = new THREE.Vector2(0, 1).setLength(15).add(centerPoint)
      const bottomText = new fabric.Text("12m", {
        left: bottomTextPoint.x - 14,
        top: bottomTextPoint.y - 10,
        fontSize: 14,
      })
      // 创建管线
      //createPipeline()
      // 建组
      const group = new fabric.Group([polygon, cCline, topText, bottomText])
      canvas.add(group)
      reCCline = group
    } else if(step === 2) {
      //管道出口方向调整
      if ((p.x > startPoint.x && p.x < endPoint.x) ||
          (p.x < startPoint.x && p.x > endPoint.x) ||
          (p.y > startPoint.y && p.y < endPoint.y) ||
          (p.y < startPoint.y && p.y > endPoint.y)) {
        if (rePolygon.containsPoint(p)){
          const p1 = calculatePointOnLineNear(new THREE.Vector3(startPoint.x, startPoint.y, 0), new THREE.Vector3(endPoint.x, startPoint.y, 0), new THREE.Vector3(p.x, p.y, 0));
          const p2 = calculatePointOnLineNear(new THREE.Vector3(endPoint.x, startPoint.y, 0), new THREE.Vector3(endPoint.x, endPoint.y, 0), new THREE.Vector3(p.x, p.y, 0));
          const p3 = calculatePointOnLineNear(new THREE.Vector3(endPoint.x, endPoint.y, 0), new THREE.Vector3(startPoint.x, endPoint.y, 0), new THREE.Vector3(p.x, p.y, 0));
          const p4 = calculatePointOnLineNear(new THREE.Vector3(startPoint.x, endPoint.y, 0), new THREE.Vector3(startPoint.x, startPoint.y, 0), new THREE.Vector3(p.x, p.y, 0));
          console.log('内部', p1)

        } else {
          console.log('外部')
        }
      } else {

      }
    }
  });
}

// 需要在页面容器加载完才能开始初始化（页面加载完才找到 canvas 元素）
// onMounted 是 Vue3 提供的一个页面生命周期函数：实例被挂载后调用。
// onMounted 官方文档说明：https://v3.cn.vuejs.org/guide/composition-api-lifecycle-hooks.html
onMounted(() => {
  init() // 执行初始化函数
})
</script>
<style>
canvas {
    border: 1px solid red;
}
</style>
