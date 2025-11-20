<!-- 展示用户数量数据的卡片,引入时需要给其定一个容器 -->
<template>
  <div class="w-full h-full" ref="DaylyLife">

  </div>
</template>

<script setup>
  import { color } from 'echarts';
  import { ref, onMounted } from 'vue'; // 添加必要的导入
  const instance = getCurrentInstance();
  const echarts = instance.appContext.config.globalProperties.$echarts;

  const DaylyLife = ref(null);
  let EchartsDaylyLife = null; // 先声明，稍后再初始化

  let option = {
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['11-11', '11-12', '11-13', '11-14', '11-15', '11-16','11-17']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: [
          {
            value:150,
            name:'1'
          },
          {
            value:110,
            name:'2'
          },
          {
            value:90,
            name:'3'
          },
          {
            value:120,
            name:'4'
          },
          {
            value:140,
            name:'5'
          },
          {
            value:120,
            name:'6'
          },
          {
            value:140,
            name:'7'
          }
        ],
        type: 'line',
        areaStyle: {color: '#A6EAB8'},
        smooth: true
      }
    ],
    tooltip: {
      trigger: 'item'
    },

  };
  // 在组件挂载后初始化 ECharts
  onMounted(() => {
    if (DaylyLife.value) {
      EchartsDaylyLife = echarts.init(DaylyLife.value);
      EchartsDaylyLife.setOption(option);
      window.addEventListener('resize', function() {
        EchartsDaylyLife.resize();
      });
    }
  });
</script>


