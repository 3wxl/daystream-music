<template>
  <div class="multi-filter-container">
    <div v-for="group in filterGroups" :key="group.key" class="filter-row">
      <div class="filter-header" v-if="group.name">{{ group.name }}</div>
      <div class="filter-options">
        <div
          class="filter-item"
          :class="{ 'is-active': !modelValue[group.key] }"
          @click="handleSelect(group.key, '')"
        >
          全部
        </div>
        <div
          v-for="option in group.options"
          :key="option.value"
          class="filter-item"
          :class="{ 'is-active': modelValue[group.key] === option.value }"
          @click="handleSelect(group.key, option.value)"
        >
          {{ option.label }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
interface FilterOption {
  label: string
  value: string | number
}

interface FilterGroup {
  key: string
  name?: string
  options: FilterOption[]
}

interface Props {
  filterGroups: FilterGroup[]
  modelValue: Record<string, string | number>
}

const props = defineProps<Props>()
const emits = defineEmits(['update:modelValue', 'change'])

const handleSelect = (key: string, value: string | number) => {
  const newValue = { ...props.modelValue, [key]: value }
  emits('update:modelValue', newValue)
  emits('change', newValue)
}
</script>

<style lang="scss" scoped>
.multi-filter-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
}

.filter-row {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.filter-header {
  font-size: 14px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.5);
  min-width: 40px;
  padding-top: 6px;
}

.filter-options {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.filter-item {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  padding: 4px 14px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  user-select: none;
  position: relative;

  &:hover {
    color: white;
  }

  &.is-active {
    color: #fff;
    background: rgba(236, 72, 153, 0.2);
    color: #ec4899;
    font-weight: 500;
  }
}
</style>
