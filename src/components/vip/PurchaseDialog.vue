<template>
  <el-dialog
    :model-value="modelValue"
    title="确认购买"
    width="500px"
    class="purchase-dialog"
    :close-on-click-modal="false"
    @update:model-value="handleModelValueChange"
    @close="handleClose"
  >
    <div v-if="selectedPackage" class="space-y-6">
      <!-- 套餐信息 -->
      <div
        class="p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 package-info"
      >
        <h4 class="text-lg font-semibold mb-3">{{ selectedPackage.title }}</h4>
        <div class="space-y-2">
          <div class="flex justify-between">
            <span class="text-gray-400">套餐类型</span>
            <span class="font-medium">{{ selectedPackage.description }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-400">支付方式</span>
            <span class="text-purple-400 font-semibold">
              {{ selectedOptionType === 'waves' ? '音浪兑换' : '在线支付' }}
            </span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-400">支付金额</span>
            <span class="text-2xl font-bold text-white price-display">
              {{ selectedOptionPrice }}
            </span>
          </div>
          <div v-if="selectedOptionType === 'waves'" class="flex justify-between">
            <span class="text-gray-400">消耗音浪</span>
            <span class="text-yellow-400 font-semibold">{{ selectedOptionWaves }}音浪</span>
          </div>
        </div>
      </div>

      <!-- 优惠券选择 -->
      <div v-if="selectedOptionType === 'money' && coupons.length > 0" class="coupon-section">
        <label class="block text-sm text-gray-400 mb-2">选择优惠券</label>
        <el-select
          :model-value="selectedCoupon"
          placeholder="请选择优惠券"
          class="w-full coupon-select"
          @change="handleCouponChange"
        >
          <el-option label="不使用优惠券" :value="null"></el-option>
          <el-option
            v-for="coupon in coupons"
            :key="coupon.id"
            :label="coupon.name"
            :value="coupon.id"
          >
            <div class="flex justify-between items-center w-full">
              <span>{{ coupon.name }}</span>
              <span class="text-red-400">-¥{{ coupon.amount }}</span>
            </div>
          </el-option>
        </el-select>
      </div>

      <!-- 最终价格 -->
      <div class="text-center final-price">
        <div class="text-sm text-gray-400 mb-1">实付金额</div>
        <div class="text-3xl font-bold text-white price-amount">¥{{ finalPrice }}</div>
        <div v-if="selectedCoupon" class="text-sm text-red-400 mt-2 coupon-discount">
          <i class="iconfont icon-discount mr-1"></i>
          已优惠¥{{ selectedCouponAmount }}
        </div>
      </div>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleCancel" class="cancel-button">取消</el-button>
        <el-button
          type="primary"
          class="confirm-button"
          :loading="isProcessing"
          @click="handleConfirm"
        >
          <template #loading>
            <i class="iconfont icon-loading animate-spin mr-2"></i>
            处理中...
          </template>
          <template v-if="!isProcessing">
            <i class="iconfont icon-check mr-2"></i>
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
  coupons: Coupon[]
  selectedCoupon: number | null
  isProcessing: boolean
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'update:selectedCoupon', value: number | null): void
  (e: 'confirm'): void
  (e: 'cancel'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const selectedCouponAmount = computed(() => {
  if (!props.selectedCoupon) return 0
  const coupon = props.coupons.find((c) => c.id === props.selectedCoupon)
  return coupon ? coupon.amount : 0
})

const finalPrice = computed(() => {
  if (!props.selectedOptionPrice) return '0.00'
  const price = parseFloat(props.selectedOptionPrice.replace('¥', ''))
  return Math.max(0, price - selectedCouponAmount.value).toFixed(2)
})

const handleCouponChange = (value: number | null): void => {
  emit('update:selectedCoupon', value)
}

const handleConfirm = (): void => {
  emit('confirm')
}

const handleCancel = (): void => {
  emit('cancel')
}

const handleClose = (): void => {
  emit('update:modelValue', false)
}

const handleModelValueChange = (value: boolean): void => {
  emit('update:modelValue', value)
}
</script>

<style scoped>
/* 保持原有样式不变 */
.purchase-dialog :deep(.el-dialog) {
  background: linear-gradient(135deg, rgba(17, 24, 39, 0.95), rgba(0, 0, 0, 0.95));
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(139, 92, 246, 0.1),
    0 0 30px rgba(139, 92, 246, 0.2);
  animation: dialogAppear 0.3s ease-out;
}

@keyframes dialogAppear {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* ... 其他样式保持不变 */
</style>
