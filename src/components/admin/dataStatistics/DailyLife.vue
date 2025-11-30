<template>
  <!-- 父容器控制整体大小，通过transform缩放1.2倍 -->
  <div class="chart-container">
    <div class="w-full h-full" ref="DaylyLife"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import * as echarts from 'echarts'; // 直接导入echarts，更稳定

const DaylyLife = ref(null);
let EchartsDaylyLife = null;

// 图表配置项
let option = {
  // 调整图表内边距，适应缩放后的布局
  grid: {
    left: '10%',
    right: '5%',
    top: '15%',
    bottom: '15%'
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['11-11', '11-12', '11-13', '11-14', '11-15', '11-16', '11-17'],
    // 优化x轴样式
    axisLabel: {
      fontSize: 12,
      color: '#666'
    },
    axisLine: {
      color: '#eee'
    }
  },
  yAxis: {
    type: 'value',
    // 优化y轴样式
    axisLabel: {
      fontSize: 12,
      color: '#666'
    },
    axisLine: {
      color: '#eee'
    },
    splitLine: {
      color: '#f5f5f5'
    }
  },
  series: [
    {
      data: [
        { value: 150, name: '1' },
        { value: 110, name: '2' },
        { value: 90, name: '3' },
        { value: 120, name: '4' },
        { value: 140, name: '5' },
        { value: 120, name: '6' },
        { value: 140, name: '7' }
      ],
      type: 'line',
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(166, 234, 184, 0.6)' },
          { offset: 1, color: 'rgba(166, 234, 184, 0.1)' }
        ])
      },
      smooth: true,
      lineStyle: {
        color: '#67C27D',
        width: 2
      },
      itemStyle: {
        color: '#67C27D',
        borderColor: '#fff',
        borderWidth: 2,
        shadowBlur: 4,
        shadowColor: 'rgba(103, 194, 125, 0.3)'
      },
      symbol: 'circle',
      symbolSize: 6,
      emphasis: {
        symbolSize: 8
      }
    }
  ],
  tooltip: {
    trigger: 'axis', // 改为axis触发，显示更完整
    axisPointer: {
      type: 'line',
      lineStyle: {
        color: '#eee',
        width: 1
      }
    },
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderColor: '#eee',
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
    textStyle: {
      color: '#333',
      fontSize: 12
    },
    // 自定义tooltip内容，同时显示x轴和y轴信息
    formatter: function(params) {
      const xValue = params[0].axisValue; // x轴日期
      const yValue = params[0].value; // y轴数值
      const name = params[0].data.name; // 自定义名称
      return `
        <div style="text-align: center;">
          <div style="font-weight: 600; margin-bottom: 4px;">${xValue}</div>
          <div style="color: #67C27D;">日活：${yValue}</div>
        </div>
      `;
    },
    triggerOn: 'mousemove',
    showDelay: 0,
    hideDelay: 100
  },
  legend: {
    show: false
  }
};

onMounted(() => {
  if (DaylyLife.value) {
    EchartsDaylyLife = echarts.init(DaylyLife.value);
    EchartsDaylyLife.setOption(option);
    const handleResize = () => {
      EchartsDaylyLife.resize();
    };
    window.addEventListener('resize', handleResize);
    onUnmounted(() => {
      window.removeEventListener('resize', handleResize);
      EchartsDaylyLife?.dispose();
    });
  }
});
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 100%;
  transform-origin: left top;
  transition: transform 0.3s ease;
}

:deep(.ec-plot) {
  overflow: visible !important;
}
</style>
