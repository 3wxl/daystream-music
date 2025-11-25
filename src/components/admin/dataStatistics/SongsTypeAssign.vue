<template>
  <div class="w-full h-full shadow-md hover:-translate-y-[2px] duration-[0.3s] border-[#e4e7ed] bg-white rounded-[10px] p-[15px]">
    <span class="text-[14px] text-[#868686] font-[600]">歌曲类型比例</span>
    <div class="mt-2 w-full h-[550px]" ref="UserType">

    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive, onMounted } from 'vue'; // 添加必要的导入
  const instance = getCurrentInstance();
  const echarts = instance.appContext.config.globalProperties.$echarts;
  const UserType = ref(null);
  let EchartsUserType = null; // 先声明，稍后再初始化
  let option = {
    color: ['#37A2D9', '#45B7D1', '#63E0E1', '#FFEAA7', '#A1EAB7', '#98D8C8', '#FFDB5D', '#FFA182', '#FB7294','#E590D1'],
    tooltip: {
      trigger: 'item'
    },
    legend: {
      top: '5%',
      left: 'center'
    },
    series: [
      {
        name: '歌曲类型',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        padAngle: 3,
        itemStyle: {
          borderRadius: 10
        },
        label: {
          show: false,
          position: 'center'
        },

        emphasis: {
          label: {
            show: true,
            fontSize: 25,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          {value:421,name:'华语流行'},
          {value:112,name:'欧美流行'},
          {value:89,name:'粤语流行'},
          {value:67,name:'古典'},
          {value:56,name:'韩国流行'},
          {value:45,name:'嘻哈说唱'},
          {value:34,name:'摇滚'},
          {value:23,name:'电子'},
          {value:22,name:'轻音乐'},
          {value:20,name:'其他'}
        ]
      }
    ]
  };
  onMounted(() => {
    if (UserType.value) {
      EchartsUserType = echarts.init(UserType.value);
      EchartsUserType.setOption(option);
      window.addEventListener('resize', function() {
        EchartsUserType.resize();
      });
    }
  });
</script>

