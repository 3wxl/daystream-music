<template>
  <div class="bg-gray-900/50 rounded-xl border border-gray-800 overflow-hidden">
    <!-- 头部 -->
    <div class="flex justify-between items-center px-5 py-3 border-b border-gray-800">
      <h3 class="text-white font-semibold flex items-center">
        <User class="text-pink-500 mr-2" />
        音乐人简介
      </h3>
      <el-button
        v-if="!isEditing"
        type="text"
        size="small"
        @click="isEditing = true"
        class="text-gray-400 hover:text-white transition-colors"
      >
        <Edit class="mr-1" /> 编辑
      </el-button>
    </div>

    <!-- 查看模式 -->
    <div v-if="!isEditing" class="p-5">
      <div class="prose prose-invert max-w-none">
        <p class="text-gray-300 leading-relaxed whitespace-pre-line">{{ intro || '暂无简介' }}</p>
      </div>

      <!-- 音乐人信息标签 -->
      <div class="flex flex-wrap gap-3 mt-5">
        <div class="flex items-center gap-2 bg-gray-800/50 px-3 py-1.5 rounded-full">
          <Music class="text-pink-500 w-4 h-4" />
          <span class="text-sm text-gray-300">风格：{{ style || '未设置' }}</span>
        </div>
        <div class="flex items-center gap-2 bg-gray-800/50 px-3 py-1.5 rounded-full">
          <MapPin class="text-pink-500 w-4 h-4" />
          <span class="text-sm text-gray-300">地区：{{ region || '未设置' }}</span>
        </div>
        <div class="flex items-center gap-2 bg-gray-800/50 px-3 py-1.5 rounded-full">
          <Calendar class="text-pink-500 w-4 h-4" />
          <span class="text-sm text-gray-300">入驻时间：{{ joinTime || '2024-01-01' }}</span>
        </div>
      </div>
    </div>

    <!-- 编辑模式 -->
    <div v-else class="p-5">
      <el-input
        type="textarea"
        :rows="6"
        v-model="intro"
        placeholder="请输入音乐人简介（支持换行）"
        class="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 mb-4"
      />

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        <el-input
          v-model="style"
          placeholder="音乐风格（如：流行/电子）"
          class="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
        />
        <el-input
          v-model="region"
          placeholder="所在地区"
          class="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
        />
      </div>

      <div class="flex justify-end gap-3">
        <el-button
          @click="isEditing = false"
          class="bg-gray-800 hover:bg-gray-700 text-white border-0"
        >
          取消
        </el-button>
        <el-button
          type="primary"
          @click="saveIntro"
          class="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 border-0"
        >
          保存修改
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 状态管理
const isEditing = ref(false)
const intro = ref(`独立音乐人，擅长流行与电子音乐融合创作。
2023年发布首张EP《夏夜星芒》，包含3首原创作品。
2024年签约独立音乐厂牌，正在筹备首张专辑。
感谢每一位听众的支持，音乐是永恒的语言。`)
const style = ref('流行 / 电子 / 氛围')
const region = ref('中国·北京')
const joinTime = ref('2023-03-15')

// 保存简介
const saveIntro = () => {
  isEditing.value = false
  ElMessage.success('简介保存成功')
  // 实际项目中调用接口
}
</script>
