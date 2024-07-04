<template>
  <div style="padding: 20px">
    <canvas
        width="1000"
        height="1000"
        id="c"
        style="border: 1px solid rgba(69, 154, 235, 0.55)"
    ></canvas>
  </div>
</template>
<script setup>
import { onMounted } from 'vue'
import * as fabric from 'fabric' // 引入 fabric

function init() {
  const canvas = new fabric.Canvas('c') // 这里传入的是canvas的id

  function addRing(angle1, angle2, x, y, r1, r2) {
    let point1 = {};
    let point2 = {};
    let point3 = {};
    let point4 = {};
    let isBig = 0
    angle1 = angle1 % 360;
    angle2 = angle2 % 360;
    if (angle2 > 180) {
      isBig = 1
    }
    if (!angle2) {
      point1.x = r1 + x;
      point1.y = y;
      point2.x = r2 + x;
      point2.y = y;
      var path = new fabric.Path(`M${point1.x},${point1.y} A${r1},${r1} 0 0,1 ${point1.x - 2 * r1},${point1.y}
                A${r1},${r1} 0 0,1 ${point1.x},${point1.y}
                M${point2.x},${point2.y} A${r2},${r2} 0 0,1 ${point2.x - 2 * r2},${point2.y}
                A${r2},${r2} 0 0,1 ${point2.x},${point2.y}`, {
        stroke: 'red',
        fill: 'transparent',
        hasControls: false
      })
    } else {
      point1.x = r1 * Math.cos(angle1 / 180 * Math.PI) + x;
      point1.y = r1 * Math.sin(angle1 / 180 * Math.PI) + y;
      point2.x = r2 * Math.cos(angle1 / 180 * Math.PI) + x;
      point2.y = r2 * Math.sin(angle1 / 180 * Math.PI) + y;
      point3.x = r2 * Math.cos((angle1 + angle2) / 180 * Math.PI) + x;
      point3.y = r2 * Math.sin((angle1 + angle2) / 180 * Math.PI) + y;
      point4.x = r1 * Math.cos((angle1 + angle2) / 180 * Math.PI) + x;
      point4.y = r1 * Math.sin((angle1 + angle2) / 180 * Math.PI) + y;
      var path = new fabric.Path(`M${point1.x},${point1.y} L${point2.x},${point2.y} A${r2},${r2} 0 ${isBig},1 ${point3.x},${point3.y} L${point4.x},${point4.y} A${r1},${r1} 0 ${isBig},0 ${point1.x},${point1.y}`, {
        stroke: 'red',
        fill: 'transparent',
        // hasControls: false
      })
    }
    // path.parmas={
    //     angle1, angle2, x, y, r1, r2
    // }
    // canvas.loadFromJSON({
    //     objects:[ path.toJSON()]
    // })

    canvas.add(path)

    //  canvas.add( fabric.fromObject(path.toJSON()))
  }

  function addLine(x1, y1, x2, y2) {
    const line = new fabric.Line(
        [
          x1, y1, // 起始点坐标
          x2, y2 // 结束点坐标
        ],
        {
          stroke: 'red', // 笔触颜色
        }
    )
    canvas.add(line)
  }
  // 圆弧
  addRing(0, 90, 245, 245, 15, 15)
  // 直线—
  addLine(0, 260, 245, 260)
  // 直线二
  addLine(260, 245, 260, 0)
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
