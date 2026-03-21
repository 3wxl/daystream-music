<template>
  <div id="bg-wrapper" class="relative min-h-screen overflow-hidden">
    <div
      class="absolute inset-0 bg-gradient-to-br from-[#0c0c12] via-[#1a0f1f] to-[#2a0f29] transition-opacity duration-2000"
      :class="{ 'opacity-100': isFirst, 'opacity-0': !isFirst }"
    ></div>
    <div
      class="absolute inset-0 bg-gradient-to-b from-purple-200 via-[#EDCFDF] to-white transition-opacity duration-2000"
      :class="{ 'opacity-100': isSecond, 'opacity-0': !isSecond }"
    ></div>
    <div
      class="absolute inset-0 bg-[#181616] transition-opacity duration-2000"
      :class="{ 'opacity-100': isThird, 'opacity-0': !isThird }"
    ></div>
    <div
      class="absolute inset-0 bg-[#FAFAFA] transition-opacity duration-2000"
      :class="{ 'opacity-100': isFour, 'opacity-0': !isFour }"
    ></div>
    <div
      class="absolute inset-0 bg-black transition-opacity duration-2000"
      :class="{ 'opacity-100': isFive, 'opacity-0': !isFive }"
    ></div>
    <div
      class="absolute inset-0 bg-white transition-opacity duration-2000"
      :class="{ 'opacity-100': isSix, 'opacity-0': !isSix }"
    ></div>
    <div class="relative z-10">
      <MusicCardContainer :card-data="cardData" class="first-section" />
      <MusicProContainer id="second-section" class="second-section mb-40" />

      <MusicianCardContainer id="third-section" class="third-section" />
      <HeroSection id="four-section" class="four-section" />

      <ValueSection id="five-section" class="five-section" />
      <ProcessSection id="six-section" class="six-section" />
    </div>
  </div>
</template>

<script setup>
const isFirst = ref(true)
const isSecond = ref(false)
const isThird = ref(false)
const isFour = ref(false)
const isFive = ref(false)
const isSix = ref(false)
const cardData = ref([
  {
    id: 1,
    color: '#FF5252',
    image: 'https://picsum.photos/id/1/300/300',
    isHovered: false,
    hasEntered: false,
  },
  {
    id: 2,
    color: '#4CAF50',
    image: 'https://picsum.photos/id/20/300/300',
    isHovered: false,
    hasEntered: false,
  },
  {
    id: 3,
    color: '#2196F3',
    image: 'https://picsum.photos/id/42/300/300',
    isHovered: false,
    hasEntered: false,
  },
  {
    id: 4,
    color: '#FF9800',
    image: 'https://picsum.photos/id/65/300/300',
    isHovered: false,
    hasEntered: false,
  },
  {
    id: 5,
    color: '#9C27B0',
    image: 'https://picsum.photos/id/96/300/300',
    isHovered: false,
    hasEntered: false,
  },
  {
    id: 6,
    color: '#E91E63',
    image: 'https://picsum.photos/id/119/300/300',
    isHovered: false,
    hasEntered: false,
  },
  {
    id: 7,
    color: '#607D8B',
    image: 'https://picsum.photos/id/133/300/300',
    isHovered: false,
    hasEntered: false,
  },
  {
    id: 8,
    color: '#00BCD4',
    image: 'https://picsum.photos/id/152/300/300',
    isHovered: false,
    hasEntered: false,
  },
  {
    id: 9,
    color: '#8BC34A',
    image: 'https://picsum.photos/id/177/300/300',
    isHovered: false,
    hasEntered: false,
  },
  {
    id: 10,
    color: '#FFEB3B',
    image: 'https://picsum.photos/id/192/300/300',
    isHovered: false,
    hasEntered: false,
  },
  {
    id: 11,
    color: '#F44336',
    image: 'https://picsum.photos/id/216/300/300',
    isHovered: false,
    hasEntered: false,
  },
  {
    id: 12,
    color: '#3F51B5',
    image: 'https://picsum.photos/id/237/300/300',
    isHovered: false,
    hasEntered: false,
  },
  {
    id: 13,
    color: '#03A9F4',
    image: 'https://picsum.photos/id/250/300/300',
    isHovered: false,
    hasEntered: false,
  },
  {
    id: 14,
    color: '#009688',
    image: 'https://picsum.photos/id/267/300/300',
    isHovered: false,
    hasEntered: false,
  },
  {
    id: 15,
    color: '#795548',
    image: 'https://picsum.photos/id/287/300/300',
    isHovered: false,
    hasEntered: false,
  },
  {
    id: 16,
    color: '#FF5252',
    image: 'https://picsum.photos/id/1/300/300',
    isHovered: false,
    hasEntered: false,
  },
  {
    id: 17,
    color: '#4CAF50',
    image: 'https://picsum.photos/id/20/300/300',
    isHovered: false,
    hasEntered: false,
  },
  {
    id: 18,
    color: '#2196F3',
    image: 'https://picsum.photos/id/42/300/300',
    isHovered: false,
    hasEntered: false,
  },
  {
    id: 19,
    color: '#FF9800',
    image: 'https://picsum.photos/id/65/300/300',
    isHovered: false,
    hasEntered: false,
  },
  {
    id: 20,
    color: '#9C27B0',
    image: 'https://picsum.photos/id/96/300/300',
    isHovered: false,
    hasEntered: false,
  },
  {
    id: 21,
    color: '#E91E63',
    image: 'https://picsum.photos/id/119/300/300',
    isHovered: false,
    hasEntered: false,
  },
  {
    id: 22,
    color: '#607D8B',
    image: 'https://picsum.photos/id/133/300/300',
    isHovered: false,
    hasEntered: false,
  },
  {
    id: 23,
    color: '#00BCD4',
    image: 'https://picsum.photos/id/152/300/300',
    isHovered: false,
    hasEntered: false,
  },
  {
    id: 24,
    color: '#8BC34A',
    image: 'https://picsum.photos/id/177/300/300',
    isHovered: false,
    hasEntered: false,
  },
  {
    id: 25,
    color: '#FFEB3B',
    image: 'https://picsum.photos/id/192/300/300',
    isHovered: false,
    hasEntered: false,
  },
  {
    id: 26,
    color: '#F44336',
    image: 'https://picsum.photos/id/216/300/300',
    isHovered: false,
    hasEntered: false,
  },
  {
    id: 27,
    color: '#3F51B5',
    image: 'https://picsum.photos/id/237/300/300',
    isHovered: false,
    hasEntered: false,
  },
  {
    id: 28,
    color: '#03A9F4',
    image: 'https://picsum.photos/id/250/300/300',
    isHovered: false,
    hasEntered: false,
  },
  {
    id: 29,
    color: '#009688',
    image: 'https://picsum.photos/id/267/300/300',
    isHovered: false,
    hasEntered: false,
  },
  {
    id: 30,
    color: '#795548',
    image: 'https://picsum.photos/id/287/300/300',
    isHovered: false,
    hasEntered: false,
  },
])

let observers = []

onMounted(() => {
  const firstSection = document.querySelector('.first-section')
  const secondSection = document.querySelector('#second-section')
  const thirdSection = document.querySelector('#third-section')
  const fourSection = document.querySelector('#four-section')
  const fiveSection = document.querySelector('#five-section')
  const sixSection = document.querySelector('#six-section')
  const observerOptions = { threshold: 0.3 }
  const firstObserver = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      isFirst.value = true
      isSecond.value = false
      isThird.value = false
      isFour.value = false
      isFive.value = false
      isSix.value = false
    }
  }, observerOptions)
  const secondObserver = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      isFirst.value = false
      isSecond.value = true
      isThird.value = false
      isFour.value = false
      isFive.value = false
      isSix.value = false
    }
  }, observerOptions)
  const thirdObserver = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      isFirst.value = false
      isSecond.value = false
      isThird.value = true
      isFour.value = false
      isSix.value = false
      isFive.value = false
    }
  }, observerOptions)

  const fourObserver = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      isFirst.value = false
      isSecond.value = false
      isThird.value = false
      isFour.value = true
      isFive.value = false
      isSix.value = false
    }
  }, observerOptions)

  const fiveObserver = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      isFirst.value = false
      isSecond.value = false
      isThird.value = false
      isFour.value = false
      isFive.value = true
      isSix.value = false
    }
  }, observerOptions)
  const sixObserver = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      isFirst.value = false
      isSecond.value = false
      isThird.value = false
      isFour.value = false
      isFive.value = false
      isSix.value = true
    }
  }, observerOptions)
  firstObserver.observe(firstSection)
  secondObserver.observe(secondSection)
  thirdObserver.observe(thirdSection)
  fourObserver.observe(fourSection)
  fiveObserver.observe(fiveSection)
  sixObserver.observe(sixSection)
  observers = [
    firstObserver,
    secondObserver,
    thirdObserver,
    fourObserver,
    fiveObserver,
    sixObserver,
  ]
})

onUnmounted(() => {
  observers.forEach((observer) => observer.disconnect())
})
</script>

<style lang="scss" scoped>
#bg-wrapper {
  background: #0c0c12;
  transition: background 2s ease;
}
.first-section,
.second-section,
.third-section,
.four-section,
.five-section,
.six-section {
  padding: 2rem;
  width: 100%;
  height: 100%;
}

:deep(.third-section) {
  color: #333;
}
</style>

<route lang="yaml">
meta:
  layout: musician
</route>
