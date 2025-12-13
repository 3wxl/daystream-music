<template>
  <button @click="clickEve">
    <div class="svg-wrapper-1">
      <div class="svg-wrapper">
        <IconFontSymbol name="a-fabufeihangzhifeiji"/>
      </div>
    </div>
    <span class="ml-1">{{text}}</span>
  </button>
</template>

<script setup lang="ts">
  let props = defineProps({
    text:{
      type: String,
      required: true
    }
  })
  let emit = defineEmits(['click'])

  function clickEve(){
    emit('click')
  }
</script>

<style scoped>
  button {
  font-family: inherit;
  font-size: 20px;
  background: royalblue;
  color: white;
  padding: 0.4em 1.1em;
  padding-left: 0.9em;
  display: flex;
  align-items: center;
  border: none;
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.2s;
  cursor: pointer;
}

button span {
  display: block;
  margin-left: 0.3em;
  transition: all 0.3s ease-in-out;
}

button i {
  display: block;
  transform-origin: center center;
  transition: transform 0.3s ease-in-out;
}

button:hover .svg-wrapper {
  animation: fly-1 0.6s ease-in-out infinite alternate;
}

button:hover i {
  transform: translateX(1.2em) rotate(45deg) scale(1.1);
}

button:hover span {
  transform: translateX(5em);
}

button:active {
  transform: scale(0.95);
}

@keyframes fly-1 {
  from {
    transform: translateY(0.1em);
  }

  to {
    transform: translateY(-0.1em);
  }
}
</style>

