import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('./components/Home/Index.vue'),
  },
  {
    path: '/shader',
    name: 'ShaderDemo',
    component: () => import('./components/ShaderDemo/index.vue'),
    children: [
      {
        path: 'shader1',
        name: 'Shader1',
        component: () => import('./components/ShaderDemo/Shader1/Index.vue'), //光圈
      },
      {
        path: 'shader2',
        name: 'Shader2',
        component: () => import('./components/ShaderDemo/Shader2/Index.vue'), //噪音光圈
      },
      {
        path: 'shader3',
        name: 'Shader3',
        component: () => import('./components/ShaderDemo/Shader3/Index.vue'), //红色矩形
      },
      {
        path: 'shader4',
        name: 'Shader4',
        component: () => import('./components/ShaderDemo/Shader4/Index.vue'), //光圈
      },
      {
        path: 'shader5',
        name: 'Shader5',
        component: () => import('./components/ShaderDemo/Shader5/Index.vue'), //彩蛋
      },
      {
        path: 'shader6',
        name: 'Shader6',
        component: () => import('./components/ShaderDemo/Shader6/Index.vue'), //波浪
      },
      {
        path: 'shader7',
        name: 'Shader7',
        component: () => import('./components/ShaderDemo/Shader7/Index.vue'), //城市
      },
      {
        path: 'shader8',
        name: 'Shader8',
        component: () => import('./components/ShaderDemo/Shader8/Index.vue'), //下雨
      },
      {
        path: 'shader9',
        name: 'Shader9',
        component: () => import('./components/ShaderDemo/Shader9/Index.vue'), //chinaMap扫光
      },
      {
        path: 'shader10',
        name: 'Shader10',
        component: () => import('./components/ShaderDemo/Shader10/Index.vue'), //破碎墙
      },
      {
        path: 'shader11',
        name: 'Shader11',
        component: () => import('./components/ShaderDemo/Shader11/Index.vue'), //光墙、破碎墙
      },
      {
        path: 'shader12',
        name: 'Shader12',
        component: () => import('./components/ShaderDemo/Shader12/Index.vue'), //蜂窝地板
      },
      {
        path: 'shader13',
        name: 'Shader13',
        component: () => import('./components/ShaderDemo/Shader13/Index.vue'), //样条
      },
      {
        path: 'shader14',
        name: 'Shader14',
        component: () => import('./components/ShaderDemo/Shader14/Index.vue'), //动画测试
      },
      {
        path: 'shader15',
        name: 'Shader15',
        component: () => import('./components/ShaderDemo/Shader15/Index.vue'), //动画测试
      },
      {
        path: 'shader16',
        name: 'Shader16',
        component: () => import('./components/ShaderDemo/Shader16/Index.vue'), //动画测试
      },
      {
        path: 'shader17',
        name: 'Shader17',
        component: () => import('./components/ShaderDemo/Shader17/Index.vue'), //设备光栅2---线条版
      },
      {
        path: 'shader18',
        name: 'Shader18',
        component: () => import('./components/ShaderDemo/Shader18/Index.vue'), //设备光栅2---线条版
      },
      {
        path: 'shader19',
        name: 'Shader19',
        component: () => import('./components/ShaderDemo/Shader19/Index.vue'), //设备光栅2---交叉线条版
      },
      {
        path: 'shader20',
        name: 'Shader20',
        component: () => import('./components/ShaderDemo/Shader20/Index.vue'), //uv滚动效果
      },
      {
        path: 'shader21',
        name: 'Shader21',
        component: () => import('./components/ShaderDemo/Shader21/Index.vue'), //箭头水流
      },
    ],
  },
  {
    path: '/demo',
    name: 'demo',
    component: () => import('./components/demo/index.vue'),
    children: [
      {
        path: 'demo',
        name: 'demo',
        component: () => import('./components/demo/demo/index.vue'),
      },
      {
        path: 'trackTable',
        name: 'trackTable',
        component: () => import('./components/demo/demo/trackTable.vue'),
      },
      {
        path: 'treeTest',
        name: 'treeTest',
        component: () => import('./components/demo/demo/treeTest.vue'),
      },
      {
        path: 'upload',
        name: 'upload',
        component: () => import('./components/demo/demo/upload.vue'),
      },
      {
        path: 'upload2',
        name: 'upload2',
        component: () => import('./components/demo/demo/upload2.vue'),
      },
    ],
  },
  {
    path: '/webGl',
    name: 'WebGl',
    component: () => import('./components/ShaderDemo/index.vue'),
    children: [
      {
        path: 'webgl1',
        name: 'webgl1',
        component: () => import('./components/webGL/webGL1/index.vue'),
      },
      {
        path: 'webgl2',
        name: 'webgl2',
        component: () => import('./components/webGL/webGL2/index.vue'), //练习不成熟的雷达
      },
      {
        path: 'webgl3',
        name: 'webgl3',
        component: () => import('./components/webGL/webGL3/index.vue'),
      },
      {
        path: 'webgl4',
        name: 'webgl4',
        component: () => import('./components/webGL/webGL4/index.vue'), //以画布大小规范化坐标
      },
      {
        path: 'webgl5',
        name: 'webgl5',
        component: () => import('./components/webGL/webGL5/index.vue'), //以mesh大小规范化坐标，smoothstep方法
      },
      {
        path: 'webgl6',
        name: 'webgl6',
        component: () => import('./components/webGL/webGL6/index.vue'), //smoothstep方法
      },
      {
        path: 'webgl7',
        name: 'webgl7',
        component: () => import('./components/webGL/webGL7/index.vue'), //三角函数
      },
      {
        path: 'webgl8',
        name: 'webgl8',
        component: () => import('./components/webGL/webGL8/index.vue'), //颜色混合+移动
      },
      {
        path: 'webgl9',
        name: 'webgl9',
        component: () => import('./components/webGL/webGL9/index.vue'), //颜色
      },
      {
        path: 'webgl10',
        name: 'webgl10',
        component: () => import('./components/webGL/webGL10/index.vue'), //颜色
      },
      {
        path: 'webgl11',
        name: 'webgl11',
        component: () => import('./components/webGL/webGL11/index.vue'), //矩形
      },
      {
        path: 'webgl12',
        name: 'webgl12',
        component: () => import('./components/webGL/webGL12/index.vue'), //平滑的圆
      },
      {
        path: 'webgl13',
        name: 'webgl13',
        component: () => import('./components/webGL/webGL13/index.vue'), //圆+颜色+动画
        children: [
          {
            path: 'test1',
            name: 'test1',
            component: () =>
              import('./components/webGL/webGL13/test1/index.vue'), //平滑的圆
          },
        ],
      },
      {
        path: 'webgl14',
        name: 'webgl14',
        component: () => import('./components/webGL/webGL14/index.vue'), //dot点乘计算圆形距离场
      },
      {
        path: 'webgl15',
        name: 'webgl15',
        component: () => import('./components/webGL/webGL15/index.vue'), //dot点乘计算圆形距离场
      },
      {
        path: 'webgl16',
        name: 'webgl16',
        component: () => import('./components/webGL/webGL16/index.vue'), //dot点乘计算圆形距离场
        children: [
          {
            path: 'test1',
            name: 'test1',
            component: () =>
              import('./components/webGL/webGL16/test1/index.vue'), //平滑的圆
          },
        ],
      },
      {
        path: 'webgl17',
        name: 'webgl17',
        component: () => import('./components/webGL/webGL17/index.vue'), //dot点乘计算圆形距离场
      },
      {
        path: 'webgl18',
        name: 'webgl18',
        component: () => import('./components/webGL/webGL18/index.vue'), //矩阵旋转
      },
      {
        path: 'webgl19',
        name: 'webgl19',
        component: () => import('./components/webGL/webGL19/index.vue'), //矩阵旋转缩放
      },
      {
        path: 'webgl20',
        name: 'webgl20',
        component: () => import('./components/webGL/webGL20/index.vue'),
      },
      {
        path: 'webgl21',
        name: 'webgl21',
        component: () => import('./components/webGL/webGL21/index.vue'), //图案 M*N
      },
      {
        path: 'webgl22',
        name: 'webgl22',
        component: () => import('./components/webGL/webGL22/index.vue'), //m*n图案旋转
      },
      {
        path: 'webgl23',
        name: 'webgl23',
        component: () => import('./components/webGL/webGL23/index.vue'), //图案奇偶移动
      },
      {
        path: 'webgl24',
        name: 'webgl24',
        component: () => import('./components/webGL/webGL24/index.vue'), //随机电视雪花点
      },
      {
        path: 'webgl25',
        name: 'webgl25',
        component: () => import('./components/webGL/webGL25/index.vue'), //随机 马赛克
      },
      {
        path: 'webgl26',
        name: 'webgl26',
        component: () => import('./components/webGL/webGL26/index.vue'), //随机细胞移动
        children: [
          {
            path: 'test1',
            name: 'test1',
            component: () =>
              import('./components/webGL/webGL26/test1/index.vue'), //平滑的圆
          },
        ],
      },
      {
        path: 'webgl27',
        name: 'webgl27',
        component: () => import('./components/webGL/webGL27/index.vue'), //随机细胞移动
      },
      {
        path: 'webgl28',
        name: 'webgl28',
        component: () => import('./components/webGL/webGL28/index.vue'), //随机细胞移动
      },
      {
        path: 'webgl29',
        name: 'webgl29',
        component: () => import('./components/webGL/webGL29/index.vue'), //随机细胞移动
      },
    ],
  },
  {
    path: '/threeDemo',
    name: 'threeDemo',
    component: () => import('./components/threeDemo/index.vue'),
    children: [
      {
        path: 'demo1',
        name: 'demo1',
        component: () => import('./components/threeDemo/demo1/index.vue'),
      },
      {
        path: 'nengguanMap',
        name: 'nengguanMap',
        component: () =>
          import('./components/threeDemo/nengguan-map/index.vue'),
      },
      {
        path: 'changfei',
        name: 'changfei',
        component: () => import('./components/threeDemo/changfei/index.vue'),
      },
    ],
  },
  {
    path: '/test',
    name: 'test',
    component: () => import('./test/index.vue'),
    children: [
      {
        path: 'physics',
        name: 'physics',
        component: () => import('./test/physicsTest/index.vue'),
      },
      {
        path: 'rain',
        name: 'rain',
        component: () => import('./test/particlesRain/index.vue'),
      },
      {
        path: 'galaxy',
        name: 'galaxy',
        component: () => import('./test/galaxy/index.vue'),
      },
      {
        path: 'envTest',
        name: 'envTest',
        component: () => import('./test/envTest/index.vue'),
      },
      {
        path: 'messageTest',
        name: 'messageTest',
        component: () => import('./test/messageTest/index.vue'),
      },
      {
        path: 'animation',
        name: 'animation',
        component: () => import('./test/animation/index.vue'),
      },
    ],
  },
  {
    path: '/FabricDemo',
    name: 'FabricDemo',
    component: () => import('./components/FabricDemo/index.vue'),
    children: [
      {
        path: 'fabric1',
        name: 'fabric1',
        component: () => import('./components/FabricDemo/Fabric1/index.vue'), //直线+圆弧
      },
      {
        path: 'fabric2',
        name: 'fabric2',
        component: () => import('./components/FabricDemo/Fabric2/index.vue'), //矩形绘制
      },
    ]
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
