<template>
  <div
    class="collectors-list w-full py-2 font-['Inter',-apple-system,BlinkMacSystemFont,'Segoe_UI',sans-serif]"
  >
    <div class="flex justify-between items-center mb-6">
      <h3 class="text-xl font-semibold text-white tracking-[0.3px]">
        收藏者 ({{ collectors.length }})
      </h3>
      <div class="search-wrapper">
        <el-input
          v-model="internalSearchKeyword"
          placeholder="搜索收藏者"
          size="small"
          class="collector-search"
          @focus="isSearchFocused = true"
          @blur="isSearchFocused = false"
        >
          <template #prefix>
            <i class="iconfont search-icon text-[#cd3181] text-lg ml-1 opacity-90">&#xe721;</i>
          </template>
        </el-input>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      <div
        v-for="collector in filteredCollectors"
        :key="collector.id"
        class="collector-card relative rounded-xl p-6 flex flex-col gap-5 border border-[rgba(205,49,129,0.1)] overflow-hidden transition-all duration-500 shadow-lg group"
        :style="{
          background:
            'radial-gradient(circle at 10% 20%, rgba(40, 40, 70, 0.9) 0%, rgba(20, 20, 40, 0.95) 100%)',
        }"
      >
        <div
          class="card-bg-decoration absolute -top-40% -right-40% w-4/5 h-4/5 rounded-full z-0 transition-all duration-700"
          :style="{
            background: 'radial-gradient(circle, rgba(205, 49, 129, 0.1) 0%, transparent 70%)',
          }"
        ></div>

        <div
          class="card-highlight absolute top-0 left-[-100%] w-full h-full z-1 pointer-events-none transition-all duration-700"
          :style="{
            background:
              'linear-gradient(90deg, transparent, rgba(205, 49, 129, 0.08), transparent)',
          }"
        ></div>

        <div class="flex justify-center relative z-2">
          <div class="relative w-24 h-24 flex items-center justify-center">
            <div
              class="avatar-wrapper relative w-20 h-20 rounded-full overflow-hidden z-10 border border-[rgba(255,255,255,0.1)]"
            >
              <img
                :src="collector.avatarUrl"
                :alt="collector.name"
                class="w-full h-full object-cover rounded-full transition-all duration-500 hover:scale-110 hover:rotate-2"
                @error="
                  (e) => {
                    ;(e.target as HTMLImageElement).src =
                      'https://picsum.photos/200/200?random=' + collector.id
                  }
                "
              />
            </div>
          </div>
        </div>

        <div class="relative z-2 flex flex-col gap-3">
          <div class="flex justify-between items-center">
            <h4 class="text-xl font-semibold text-white relative">
              {{ collector.name }}
              <span
                class="absolute bottom-[-4px] left-0 w-0 h-0.5 rounded-sm transition-all duration-300 group-hover:w-full bg-gradient-to-r from-[#cd3181] to-[#c52075]"
              ></span>
            </h4>
            <el-button
              size="small"
              :class="
                collector.followStatus
                  ? 'btn-unfollow flex items-center gap-1 px-4 py-15 text-xs font-medium rounded-full transition-all duration-300 hover:translate-y-[-2px]'
                  : 'btn-follow flex items-center gap-1 px-4 py-15 text-xs font-medium text-white rounded-full transition-all duration-300 hover:translate-y-[-2px]'
              "
              @click.stop="$emit('toggle-follow', collector.id)"
              :style="
                collector.followStatus
                  ? {
                      background: 'rgba(205, 49, 129, 0.08)',
                      border: '1px solid rgba(205, 49, 129, 0.4)',
                      color: '#fdb5c7',
                    }
                  : {
                      background: 'linear-gradient(135deg, #cd3181, #c52075)',
                      border: 'none',
                      boxShadow: '0 4px 12px rgba(205, 49, 129, 0.4)',
                      color: '#fdb5c7',
                    }
              "
            >
              <i class="iconfont text-xs" v-if="collector.followStatus">&#xe62b;</i>
              <i class="iconfont text-xs" v-else>&#xe626;</i>
              {{ collector.followStatus ? '已关注' : '关注' }}
            </el-button>
          </div>

          <p
            v-if="collector.signature"
            class="text-sm text-[#94a3b8] leading-relaxed line-clamp-2 pl-2 border-l-2 border-[rgba(255,143,171,0.2)] transition-colors duration-300 group-hover:border-[rgba(255,143,171,0.5)] group-hover:text-[#a5b4fc]"
          >
            {{ collector.signature }}
          </p>

          <div
            class="flex justify-between items-center pt-2 border-t border-[rgba(255,143,171,0.08)]"
          >
            <div
              class="collect-time text-xs text-[#64748b] flex items-center gap-1.5 transition-colors duration-300 group-hover:text-[#94a3b8]"
            >
              <i class="iconfont text-xs">&#xe61c;</i>
              {{ formatDate(collector.collectTime) }} 收藏
            </div>
            <div class="flex gap-3">
              <span
                class="stat-item text-xs text-[#64748b] flex items-center gap-1 transition-colors duration-300 group-hover:text-[#8b5cf6]"
              >
                <el-tooltip class="box-item" effect="dark" content="音乐作品" placement="top">
                  <div class="flex justify-center items-center">
                    <img src="../../assets/music-7683_256.gif" alt="" class="w-8" />128
                  </div>
                </el-tooltip>
              </span>
              <span
                class="stat-item text-xs text-[#64748b] flex items-center gap-1 transition-colors duration-300 group-hover:text-[#8b5cf6]"
              >
                <el-tooltip class="box-item" effect="dark" content="粉丝数" placement="top">
                  <div class="flex justify-center items-center">
                    <img src="../../assets/dancing-22475_256.gif" alt="" class="w-8" /> 45
                  </div>
                </el-tooltip>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="filteredCollectors.length === 0"
      class="flex flex-col items-center justify-center py-20 px-5 text-center text-[#64748b]"
    >
      <div class="empty-icon text-5xl text-[rgba(255,143,171,0.1)] mb-4">
        <i class="iconfont">&#xe685;</i>
      </div>
      <p class="empty-text text-xl font-medium mb-2 text-[#94a3b8]">
        {{ internalSearchKeyword ? '未找到相关收藏者' : '暂无收藏者' }}
      </p>
      <p class="empty-desc text-base text-[#64748b]">
        {{ internalSearchKeyword ? '尝试调整搜索关键词' : '该歌单还未被收藏，分享给好友吧～' }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Collector {
  id: number
  avatarUrl: string
  name: string
  collectTime: number
  signature?: string
  followStatus: boolean
}

interface Props {
  collectors: Collector[]
  searchKeyword?: string
}

const props = withDefaults(defineProps<Props>(), {
  searchKeyword: '',
})

const emit = defineEmits<{
  'toggle-follow': [id: number]
  'update:searchKeyword': [value: string]
}>()

const internalSearchKeyword = ref(props.searchKeyword)
const isSearchFocused = ref(false)

const filteredCollectors = computed(() => {
  const keyword = internalSearchKeyword.value.trim().toLowerCase()
  if (!keyword) return props.collectors
  return props.collectors.filter((collector) => collector.name.toLowerCase().includes(keyword))
})

watch(internalSearchKeyword, (newVal) => {
  emit('update:searchKeyword', newVal)
})

watch(
  () => props.searchKeyword,
  (newVal) => {
    if (newVal !== internalSearchKeyword.value) {
      internalSearchKeyword.value = newVal || ''
    }
  },
)

const formatDate = (timestamp: number) => {
  const date = new Date(timestamp)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
</script>

<style lang="scss" scoped>
.collector-card {
  position: relative;
  border: 1px solid rgba(205, 49, 129, 0.1);
  border-radius: 12px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow: hidden;
  transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  background: radial-gradient(
    circle at 10% 20%,
    rgba(40, 40, 70, 0.9) 0%,
    rgba(20, 20, 40, 0.95) 100%
  );
  box-shadow:
    0 8px 0 rgba(0, 0, 0, 0.05),
    0 12px 20px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.collector-card.group:hover {
  transform: translateY(-8px) scale(1.02);
  border-color: rgba(205, 49, 129, 0.3);
  box-shadow:
    0 12px 0 rgba(0, 0, 0, 0.08),
    0 20px 30px rgba(0, 0, 0, 0.12),
    0 0 15px rgba(205, 49, 129, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
}

.collector-card.group:hover .card-bg-decoration {
  top: -35%;
  right: -35%;
  background: radial-gradient(circle, rgba(205, 49, 129, 0.18) 0%, transparent 70%);
}

.collector-card.group:hover .card-highlight {
  left: 100%;
}

.avatar-wrapper {
  transition: all 0.4s ease;
}

.avatar-wrapper:hover img {
  transform: scale(1.15) rotate(2deg);
}

.btn-follow:hover {
  background: linear-gradient(135deg, #c52075, #b01a68) !important;
  box-shadow: 0 6px 16px rgba(205, 49, 129, 0.5) !important;
}

.btn-unfollow:hover {
  background: rgba(205, 49, 129, 0.2) !important;
  border-color: #cd3181 !important;
  color: #ffc0d3 !important;
}
.search-wrapper {
  width: 125px;
  transition: width 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.search-wrapper:focus-within {
  width: 225px;
}

::v-deep .collector-search {
  width: 100% !important;
  --el-input-height: 36px;
  --el-input-border-radius: 18px;
  --el-input-text-color: #e2e8f0;
  --el-input-placeholder-color: #94a3b8;
}

::v-deep .collector-search .el-input__wrapper {
  width: 100% !important;
  background: rgba(30, 30, 50, 0.6);
  border: 1px solid rgba(205, 49, 129, 0.15);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(8px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 18px !important;
}

@keyframes pulsePink {
  0%,
  100% {
    transform: scale(0.95);
    opacity: 0.4;
    background: radial-gradient(circle, rgba(205, 49, 129, 0.3) 0%, transparent 70%);
  }
  50% {
    transform: scale(1.05);
    opacity: 0.7;
    background: radial-gradient(circle, rgba(205, 49, 129, 0.4) 0%, transparent 70%);
  }
}

.animate-pulse-pink {
  animation: pulsePink 3s infinite ease-in-out;
}

.avatar-wrapper .avatar-ring {
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  border: 2px solid transparent;
  background: linear-gradient(45deg, #cd3181, #e63493) border-box;
  -webkit-mask:
    linear-gradient(#fff 0 0) padding-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0.8;
  transition: all 0.4s ease;
}

.btn-follow:hover {
  background: linear-gradient(135deg, #c52075, #b01a68) !important;
  box-shadow: 0 6px 16px rgba(205, 49, 129, 0.5) !important;
  color: white !important;
}

.btn-unfollow:hover {
  background: rgba(205, 49, 129, 0.15) !important;
  border-color: #cd3181 !important;
  color: #fff !important;
}

@media (max-width: 768px) {
  .collector-card {
    padding: 20px;
    gap: 16px;
  }

  .collector-card.group:hover {
    transform: translateY(-6px) scale(1.01);
  }
}
</style>
