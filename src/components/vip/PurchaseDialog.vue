<template>
  <el-dialog
    :model-value="modelValue"
    title="确认购买"
    width="500px"
    class="purchase-dialog"
    :close-on-click-modal="false"
    @update:model-value="handleModelValueChange"
    @close="handleClose"
    style="background-color: #0a0a12 !important"
  >
    <div v-if="selectedPackage" class="space-y-6">
      <!-- 套餐信息 - 黑粉风格 -->
      <div
        class="p-4 rounded-xl bg-gradient-to-r from-pink-950/40 to-purple-950/40 border border-pink-500/30 package-info relative overflow-hidden group"
      >
        <!-- 背景光效 -->
        <div
          class="absolute inset-0 bg-gradient-to-r from-pink-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        ></div>
        <div
          class="absolute -inset-1 bg-gradient-to-r from-pink-500/10 to-purple-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        ></div>

        <h4 class="text-lg font-semibold mb-3 text-white relative z-10">
          {{ selectedPackage.title }}
        </h4>
        <div class="space-y-2 relative z-10">
          <div class="flex justify-between">
            <span class="text-gray-400">套餐类型</span>
            <span class="font-medium text-gray-200">{{ selectedPackage.description }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-400">支付方式</span>
            <span class="text-pink-400 font-semibold">
              {{ selectedOptionType === 'waves' ? '音浪兑换' : '在线支付' }}
            </span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-400">支付金额</span>
            <span class="text-2xl font-bold text-white price-display">
              {{ selectedOptionPrice }}
            </span>
          </div>
        </div>
      </div>

      <!-- 最终价格 - 黑粉风格 -->
      <div class="text-center final-price relative overflow-hidden group">
        <div
          class="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-purple-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        ></div>
        <div class="absolute inset-0 bg-gradient-to-r from-pink-500/5 to-purple-500/5"></div>
        <div class="relative z-10">
          <div class="text-sm text-gray-400 mb-1 flex items-center justify-center gap-1">
            <i class="iconfont icon-price-tag text-pink-400"></i>
            实付
          </div>
          <div class="text-3xl font-bold text-white price-amount">{{ finalPrice }}音浪</div>
        </div>
      </div>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleCancel" class="cancel-button group">
          <i
            class="iconfont icon-close mr-1 text-gray-400 group-hover:text-white transition-colors"
          ></i>
          取消
        </el-button>
        <el-button
          type="primary"
          class="confirm-button group"
          :loading="isProcessing"
          @click="handleConfirm"
        >
          <template #loading>
            <i class="iconfont icon-loading animate-spin mr-2 text-white"></i>
            处理中...
          </template>
          <template v-if="!isProcessing">
            <i
              class="iconfont icon-check mr-2 text-white group-hover:scale-110 transition-transform"
            ></i>
            {{ selectedOptionType === 'waves' ? '确认兑换' : '立即支付' }}
          </template>
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { VipPackage, Coupon } from '@/types/vip/vipExchange'

interface Props {
  modelValue: boolean
  selectedPackage: VipPackage | null
  selectedOptionType: 'waves' | 'money'
  selectedOptionPrice: string
  selectedOptionWaves: number
  isProcessing: boolean
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm'): void
  (e: 'cancel'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// const selectedCouponAmount = computed(() => {
//   if (!props.selectedCoupon) return 0
//   const coupon = props.coupons.find((c) => c.id === props.selectedCoupon)
//   return coupon ? coupon.amount : 0
// })

const finalPrice = computed(() => {
  if (!props.selectedOptionPrice) return '0.00'
  const price = parseFloat(props.selectedOptionPrice.replace('¥', ''))
  return Math.max(0, price).toFixed(2)
})

// const handleCouponChange = (value: number | null): void => {
//   emit('update:selectedCoupon', value)
// }

const handleConfirm = (): void => {
  emit('confirm')
}

const handleCancel = (): void => {
  emit('cancel')
}

const handleClose = (): void => {
  emit('cancel')
  emit('update:modelValue', false)
}

const handleModelValueChange = (value: boolean): void => {
  emit('update:modelValue', value)
}
</script>

<style scoped>
.purchase-dialog :deep(.el-dialog) {
  --el-dialog-bg-color: #0a0a12 !important;
  background: #0a0a12 !important;
  border: 1px solid rgba(231, 79, 160, 0.3);
  border-radius: 28px; /* 稍微增大圆角 */
  box-shadow:
    0 30px 60px -15px rgba(0, 0, 0, 0.8),
    0 0 0 1px rgba(231, 79, 160, 0.2),
    0 0 60px rgba(231, 79, 160, 0.2); /* 增强光晕效果 */
  animation: dialogAppear 0.4s cubic-bezier(0.4, 0, 0.2, 1); /* 优化动画曲线 */
  overflow: hidden; /* 确保圆角内的内容也显示圆角 */
}

@keyframes dialogAppear {
  from {
    opacity: 0;
    transform: translateY(-30px) scale(0.95);
    filter: blur(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
    filter: blur(0);
  }
}

/* 头部样式优化 */
.purchase-dialog :deep(.el-dialog__header) {
  background: #0a0a12 !important;
  border-bottom: 1px solid rgba(231, 79, 160, 0.2);
  padding: 24px 28px; /* 增加内边距 */
  margin: 0;
  position: relative;
  overflow: hidden;
}

.purchase-dialog :deep(.el-dialog__header)::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(231, 79, 160, 0.08), transparent);
  animation: headerShine 4s infinite; /* 放慢动画速度 */
}

.purchase-dialog :deep(.el-dialog__header)::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 10%;
  right: 10%;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(231, 79, 160, 0.5), transparent);
  border-radius: 2px;
}

@keyframes headerShine {
  0% {
    left: -100%;
  }
  20% {
    left: 100%;
  }
  100% {
    left: 100%;
  }
}

.purchase-dialog :deep(.el-dialog__title) {
  color: #ffffff;
  font-size: 20px; /* 稍微增大标题 */
  font-weight: 700;
  letter-spacing: 1px;
  background: linear-gradient(135deg, #ff8abb, #e74fa0, #ffb3d9);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  background-size: 200% 200%;
  animation: titleGradient 3s ease infinite;
  position: relative;
  padding-left: 8px;
}

@keyframes titleGradient {
  0%,
  100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

.purchase-dialog :deep(.el-dialog__headerbtn) {
  top: 24px;
  right: 28px;
}

.purchase-dialog :deep(.el-dialog__headerbtn .el-dialog__close) {
  color: #9ca3af;
  font-size: 22px; /* 增大关闭按钮 */
  transition: all 0.3s ease;
}

.purchase-dialog :deep(.el-dialog__headerbtn .el-dialog__close:hover) {
  color: #e74fa0;
  transform: rotate(90deg) scale(1.1);
  text-shadow: 0 0 15px rgba(231, 79, 160, 0.6);
}

/* body样式优化 */
.purchase-dialog :deep(.el-dialog__body) {
  padding: 28px;
  background: #0a0a12 !important;
}

/* 底部样式优化 */
.purchase-dialog :deep(.el-dialog__footer) {
  background: #0a0a12 !important;
  border-top: 1px solid rgba(231, 79, 160, 0.2);
  padding: 24px 28px;
  margin: 0;
  position: relative;
}

.purchase-dialog :deep(.el-dialog__footer)::before {
  content: '';
  position: absolute;
  top: -1px;
  left: 10%;
  right: 10%;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(231, 79, 160, 0.3), transparent);
  border-radius: 2px;
}

/* 套餐信息卡片 - 优化版 */
.package-info {
  background: rgba(10, 10, 18, 0.8) !important; /* 稍微带点透明度，更有层次 */
  backdrop-filter: blur(20px);
  border: 1px solid rgba(231, 79, 160, 0.2);
  border-radius: 20px;
  padding: 24px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  box-shadow: 0 10px 30px -15px rgba(231, 79, 160, 0.2);
}

.package-info::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 20px;
  padding: 2px;
  background: linear-gradient(135deg, rgba(231, 79, 160, 0.5), rgba(255, 107, 157, 0.2));
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
  opacity: 0.5;
  transition: opacity 0.3s ease;
}

.package-info:hover {
  transform: translateY(-4px);
  border-color: rgba(231, 79, 160, 0.4);
  box-shadow: 0 20px 40px -20px rgba(231, 79, 160, 0.4);
}

.package-info:hover::before {
  opacity: 1;
}

.package-info h4 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #fff, #ffbfdf);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.package-info .space-y-2 > div {
  padding: 8px 0;
  border-bottom: 1px dashed rgba(231, 79, 160, 0.1);
}

.package-info .space-y-2 > div:last-child {
  border-bottom: none;
}

.package-info .text-gray-400 {
  font-size: 0.95rem;
}

.package-info .text-gray-200 {
  font-size: 1rem;
  font-weight: 500;
}

.price-display {
  background: linear-gradient(135deg, #ff8abb, #e74fa0, #ff6b9d);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  background-size: 200% 200%;
  animation: priceGradient 3s ease infinite;
  font-size: 2rem !important;
  transition: all 0.3s ease;
}

@keyframes priceGradient {
  0%,
  100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

/* 优惠券选择器 - 优化版 */
.coupon-section {
  margin-top: 24px;
}

.coupon-section label {
  font-size: 0.95rem;
  color: #d1d5db;
  margin-bottom: 12px;
  letter-spacing: 0.5px;
}

.coupon-section label i {
  font-size: 1.2rem;
  color: #e74fa0;
}

.coupon-select :deep(.el-input__wrapper) {
  background: rgba(10, 10, 18, 0.9) !important;
  border: 1px solid rgba(231, 79, 160, 0.2);
  border-radius: 14px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  padding: 4px 12px;
}

.coupon-select :deep(.el-input__wrapper:hover) {
  border-color: rgba(231, 79, 160, 0.5);
  background: rgba(20, 20, 30, 0.95) !important;
  box-shadow: 0 6px 20px rgba(231, 79, 160, 0.15);
  transform: translateY(-1px);
}

.coupon-select :deep(.el-input__wrapper.is-focus) {
  border-color: #e74fa0;
  background: rgba(20, 20, 30, 0.98) !important;
  box-shadow: 0 0 0 3px rgba(231, 79, 160, 0.2);
}

.coupon-select :deep(.el-input__inner) {
  color: #ffffff;
  font-size: 14px;
  height: 40px;
  line-height: 40px;
}

.coupon-select :deep(.el-input__inner::placeholder) {
  color: #6b7280;
}

.coupon-select :deep(.el-input__suffix) {
  color: #e74fa0;
}

.coupon-select :deep(.el-input__suffix-inner) {
  font-size: 18px;
}

/* 最终价格区域 - 优化版 */
.final-price {
  padding: 28px 24px;
  background: rgba(10, 10, 18, 0.95) !important;
  border-radius: 24px;
  border: 1px solid rgba(231, 79, 160, 0.2);
  backdrop-filter: blur(20px);
  position: relative;
  margin-top: 28px;
  box-shadow: 0 15px 35px -15px rgba(231, 79, 160, 0.3);
}

.final-price::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 24px;
  padding: 2px;
  background: linear-gradient(135deg, rgba(231, 79, 160, 0.6), rgba(255, 107, 157, 0.2));
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
  opacity: 0.6;
}

.final-price > div:last-child {
  position: relative;
  z-index: 1;
}

.final-price .text-gray-400 {
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: #9ca3af;
}

.price-amount {
  font-size: 2rem !important;
  font-weight: 600;
  line-height: 1;
  margin: 8px 0;
  background: linear-gradient(135deg, #ff8abb, #e74fa0, #ff6b9d, #ff3988);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  background-size: 300% 300%;
  animation: priceGlow 4s ease infinite;
  text-shadow: 0 0 30px rgba(231, 79, 160, 0.3);
}

@keyframes priceGlow {
  0%,
  100% {
    background-position: 0% 50%;
  }
  25% {
    background-position: 100% 50%;
  }
  50% {
    background-position: 200% 50%;
  }
  75% {
    background-position: 100% 50%;
  }
}

.coupon-discount {
  font-size: 1rem;
  padding: 8px 16px;
  background: rgba(231, 79, 160, 0.1);
  border-radius: 30px;
  display: inline-flex;
  margin-top: 12px;
  border: 1px solid rgba(231, 79, 160, 0.3);
  animation: pulse 2s ease-in-out infinite;
}

.coupon-discount i {
  font-size: 1.1rem;
  color: #e74fa0;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
    box-shadow: 0 0 10px rgba(231, 79, 160, 0.2);
  }
  50% {
    opacity: 0.9;
    transform: scale(1.02);
    box-shadow: 0 0 20px rgba(231, 79, 160, 0.4);
  }
}

/* 按钮样式保持不变，仅添加细微的悬停效果 */
.cancel-button {
  background: #0a0a12 !important;
  border: 2px solid rgba(231, 79, 160, 0.3);
  color: #ffbfdf;
  padding: 10px 24px;
  border-radius: 20px;
  font-weight: 600;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
}

.cancel-button::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(231, 79, 160, 0.2);
  transform: translate(-50%, -50%);
  transition:
    width 0.6s,
    height 0.6s;
}

.cancel-button:hover::before {
  width: 200px;
  height: 200px;
}

.cancel-button:hover {
  background: #0a0a12 !important;
  border-color: #e74fa0;
  color: #ffffff;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(231, 79, 160, 0.4);
}

.cancel-button:active {
  transform: translateY(0);
}

.confirm-button {
  background: linear-gradient(135deg, #e74fa0, #ff6b9d, #ff3988);
  background-size: 200% 200%;
  border: none;
  color: #ffffff;
  padding: 10px 32px;
  border-radius: 20px;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(231, 79, 160, 0.4);
  animation: gradientMove 3s ease infinite;
  position: relative;
  overflow: hidden;
}

.confirm-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.7s;
}

.confirm-button:hover::before {
  left: 100%;
}

@keyframes gradientMove {
  0%,
  100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

.confirm-button:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 8px 30px rgba(231, 79, 160, 0.7);
}

.confirm-button:active {
  transform: translateY(0) scale(0.98);
  box-shadow: 0 2px 10px rgba(231, 79, 160, 0.4);
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 16px; /* 稍微增大间距 */
}

/* 下拉选项 - 优化版 */
:deep(.el-select-dropdown) {
  background: #0a0a12 !important;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(231, 79, 160, 0.3);
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
  overflow: hidden;
  padding: 6px;
}

:deep(.el-select-dropdown__item) {
  color: #d1d5db;
  transition: all 0.3s ease;
  padding: 10px 16px;
  border-radius: 10px;
  margin: 2px 0;
}

:deep(.el-select-dropdown__item:hover) {
  background: rgba(231, 79, 160, 0.15);
  color: #ffffff;
  transform: translateX(4px);
}

:deep(.el-select-dropdown__item.is-selected) {
  background: linear-gradient(90deg, rgba(231, 79, 160, 0.2), rgba(255, 107, 157, 0.2));
  color: #e74fa0;
  font-weight: 600;
}

:deep(.el-select-dropdown__item.is-selected::after) {
  content: '✓';
  float: right;
  color: #e74fa0;
  font-weight: bold;
  font-size: 1.2rem;
}

/* 加载动画 */
:deep(.el-button.is-loading) {
  opacity: 0.9;
  cursor: wait;
  position: relative;
}

:deep(.el-button.is-loading .iconfont) {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* 响应式调整 */
@media (max-width: 640px) {
  .purchase-dialog :deep(.el-dialog) {
    width: 92% !important;
    margin: 16px auto !important;
  }

  .price-amount {
    font-size: 2.8rem !important;
  }

  .dialog-footer {
    flex-direction: column-reverse;
    gap: 12px;
  }

  .cancel-button,
  .confirm-button {
    width: 100%;
    margin-left: 0 !important;
  }
}

/* 添加一些全局动画效果 */
.group:hover .bg-gradient-to-r {
  opacity: 1;
}

/* 优化字体图标样式 */
.iconfont {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* 添加一些装饰性元素 */
.package-info::after {
  content: '';
  position: absolute;
  top: 10px;
  right: 10px;
  width: 60px;
  height: 60px;
  background: radial-gradient(circle, rgba(231, 79, 160, 0.1) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
}
</style>
