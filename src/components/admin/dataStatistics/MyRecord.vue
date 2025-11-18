<!-- 展示用户数量数据的卡片,引入时需要给其定一个容器 -->
<template>
  <div class="w-full h-full" >
    <div class="w-full h-full" ref="myRecord">

    </div>
  </div>
</template>

<script setup>
  import { color } from 'echarts';
  import { ref, onMounted } from 'vue'; // 添加必要的导入
  const instance = getCurrentInstance();
  const echarts = instance.appContext.config.globalProperties.$echarts;

  const myRecord = ref(null);
  let EchartsMyRecord = null; // 先声明，稍后再初始化

  let option = {
    title: {
      text: '我的完成：',
      left: 'left',
      textStyle:{
        fontSize: '15px',
        color:'#888',
        fontWeight: '600'
      }
    },
    tooltip: {
      trigger: 'item'
    },
    series: [
      {
        name: '我的完成：',
        type: 'pie',
        radius: '90%',
        color: ['#41B5FF', '#A6EAB8', '#F57295'],
        label:{
          show:false
        },
        data: [
          { value: 1048, name: '歌曲审核' },
          { value: 735, name: '音乐人审核' },
          { value: 580, name: '动态审核' }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };
  // 在组件挂载后初始化 ECharts
  onMounted(() => {
    if (myRecord.value) {
      EchartsMyRecord = echarts.init(myRecord.value);
      EchartsMyRecord.setOption(option);
      window.addEventListener('resize', function() {
        EchartsMyRecord.resize();
      });
    }
  });
</script>


