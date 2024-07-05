<template>
  <div style="padding: 20px">
    <canvas
        width="7000"
        height="700"
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

  let box = null;
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
        stroke: 'blue',
        fill: 'transparent',
        hasControls: false
      })
      console.log("1")
    } else {
      point1.x = r1 * Math.cos(angle1 / 180 * Math.PI) + x;
      point1.y = r1 * Math.sin(angle1 / 180 * Math.PI) + y;
      point2.x = r2 * Math.cos(angle1 / 180 * Math.PI) + x;
      point2.y = r2 * Math.sin(angle1 / 180 * Math.PI) + y;
      point3.x = r2 * Math.cos((angle1 + angle2) / 180 * Math.PI) + x;
      point3.y = r2 * Math.sin((angle1 + angle2) / 180 * Math.PI) + y;
      point4.x = r1 * Math.cos((angle1 + angle2) / 180 * Math.PI) + x;
      point4.y = r1 * Math.sin((angle1 + angle2) / 180 * Math.PI) + y;
      console.log("pLent", `M${point1.x},${point1.y} L${point2.x},${point2.y} A${r2},${r2} 0 ${isBig},1 ${point3.x},${point3.y} L${point4.x},${point4.y} A${r1},${r1} 0 ${isBig},0 ${point1.x},${point1.y}`)
      var path = new fabric.Path(`M${point1.x},${point1.y} L${point2.x},${point2.y} A${r2},${r2} 0 ${isBig},1 ${point3.x},${point3.y} L${point4.x},${point4.y} A${r1},${r1} 0 ${isBig},0 ${point1.x},${point1.y}`, {
        stroke: 'blue',
        fill: 'transparent',
        // hasControls: false
      })
      addLine(x, y, point4.x, point4.y, true, true)
    }
    canvas.add(path)
    // 计算圆弧中心点
    const arcCenterPoint = new fabric.Circle({
      top: x - 2,
      left: y - 2,
      radius: 2, // 圆的半径 50
      fill: 'red'
    })
    canvas.add(arcCenterPoint)
    // 箭头直线
    console.log("path", path)
    //计算box2
    const b = path.getBoundingRect();
    box = calBox(box, b)
  }

  function addLine(x1, y1, x2, y2, isDash=false, isText=false) {
    const line = new fabric.Line(
        [
          x1, y1, // 起始点坐标
          x2, y2 // 结束点坐标
        ],
        {
          stroke: 'red', // 笔触颜色
          strokeDashArray: isDash ? [5, 5] : [0, 0],
        }
    )
    canvas.add(line)
    box = calBox(box, line.getBoundingRect())
    //设置text
    if(isText) {
      //fabric.util
      const s = new THREE.Vector2(x1, y1);
      const e = new THREE.Vector2(x2, y2);
      const nor = new THREE.Vector2().subVectors(s, e).normalize();
      const calNor = nor.rotateAround(new THREE.Vector2(), 90);
      const center = new THREE.Vector2().lerpVectors(s, e, 0.5);
      const point = calNor.setLength(30).add(center)
      const length = s.distanceTo(e)

      const text = new fabric.Text(`${length}mm`,{
        left: point.x - 15,
        top: point.y - 20,
        fontSize: 13,
      })
      canvas.add(text)
    }
  }
  // 示例1--15
  addRing(0, 90, 245, 245, 15, 15)
  addLine(0, 260, 245, 260)
  addLine(260, 245, 260, 0)

  //示例2---50
  addRing(0, 90, 350, 350, 50, 50)
  addLine(0, 400, 350, 400)
  addLine(400, 350, 400, 0)

  //示例3---150
  addRing(0, 90, 450, 450, 150, 150)
  addLine(0, 600, 450, 600)
  addLine(600, 450, 600, 0)

  //包围盒
  // const rect = new fabric.Rect({
  //     left: box.min.x,
  //   top: box.min.y,
  //   height: box.max.y - box.min.y,
  //   width: box.max.x - box.min.x,
  //   fill: 'transparent', // 填充 橙色
  //   stroke: '#6639a6', // 线段颜色：紫色
  // })
  // // 将矩形添加到画布中
  // console.log('rect', rect)
  // canvas.add(rect)
}

const calBox = (box, boundBox) => {
  const {height, left, top, width} = boundBox
  const min = new THREE.Vector2(left, top)
  const max = new THREE.Vector2(left + width, top + height)
  const box1 = new THREE.Box2(min, max);
  if(box)
    return box.union(box1)
  else
    return box1
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
