<!-- 展示用户数量数据的卡片,引入时需要给其定一个容器 -->
<template>
  <div class="min-[1720px]:grow-1 w-[335px] max-[1699px]:w-[290px] max-[1380px]:w-[500px] max-[1320px]:w-[400px] shadow-md hover:-translate-y-[2px] duration-[0.3s] border-[#e4e7ed] bg-white rounded-[10px] p-[15px]">
    <div class="text-[14px] text-[#666] flex justify-between">
      <span>入驻音乐人</span>
      <span class="mr-3">
        <el-tooltip
          class="box-item"
          effect="dark"
          content="该网站入驻音乐人数量"
          placement="top"
        >
          <IconFontSymbol name="jieshi" size="15px" color="#666"/>
        </el-tooltip>
      </span>
    </div>
    <div class="flex">
      <div>
        <div class="my-[10px]">
          <span class="p-[5px] bg-[#FFF5F5] rounded-[6px] ml-2">
            <IconFontSymbol name="maikefeng" size="23px" color="#F55E2E"/>
          </span>
          <span class="text-[18px] ml-3 font-[600]">573</span>
        </div>
        <div>
          <span class="text-[13px] font-[#888]">
            较上周增长 15&nbsp;
            <IconFontSymbol name="zengchang" size="10px" color="#3DB178"/>
          </span>
        </div>
      </div>
      <div class="grow-1 h-[80px]">
        <div ref="UserNumChange" class="h-[100%] w-[100%] relative top-[30px]"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, reactive, onMounted } from 'vue'; // 添加必要的导入
  const instance = getCurrentInstance();
  const echarts = instance.appContext.config.globalProperties.$echarts;

  const UserNumChange = ref(null);
  let EchartsUserNumChange = null; // 先声明，稍后再初始化

  const option = reactive({
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      show: false
    },
    yAxis: {
      type: 'value',
      show: false
    },
    series: [
      {
        data: [820, 932, 901, 934, 1290, 1330, 1320],
        type: 'line',
        smooth: true,
        symbol: 'none',
        lineStyle: {
          color: '#F55E2E',
          width: 3,
          shadowBlur: 20,
          shadowColor: '#F55E2E',
          shadowOffsetX: 0,
          shadowOffsetY: 0
        }
      }
    ]
  });
  // 在组件挂载后初始化 ECharts
  onMounted(() => {
    if (UserNumChange.value) {
      EchartsUserNumChange = echarts.init(UserNumChange.value);
      EchartsUserNumChange.setOption(option);
      window.addEventListener('resize', function() {
        EchartsUserNumChange.resize();
      });
    }
  });
</script>


