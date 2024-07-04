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

function init() {
  const canvas = new fabric.Canvas('c') // 这里传入的是canvas的id

  let startPoint = null, reCCline = null;
  canvas.on('mouse:up', (e) => {
    const p = fabric.util.getPointer(e.e);
    console.log("p", p)
    const cCircle = new fabric.Circle({
      top: p.y - 5,
      left: p.x - 5,
      radius: 5, // 圆的半径 50
      fill: 'red'
    })
    canvas.add(cCircle)
    if (!startPoint)
      startPoint = new THREE.Vector2(p.x, p.y)
    else {
      // 绘制矩形

      startPoint = null
      reCCline = null
    }
  });

  canvas.on('mouse:move', (e) => {
    //console.log("move", e)
    if (startPoint) {
      const p = fabric.util.getPointer(e.e);
      if (reCCline)
        canvas.remove(reCCline)
      const cCline = new fabric.Line([startPoint.x, startPoint.y, p.x, p.y], {
        strokeDashArray: [5, 5],
        stroke: 'black'
      });
      reCCline = cCline
      canvas.add(cCline)
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
