<template>
  <label class="checkbox-wrapper">
    <input type="checkbox" />
    <div class="checkmark">
      <svg stroke="currentColor" fill="none" viewBox="0 0 24 24">
        <path
          stroke-linejoin="round"
          stroke-linecap="round"
          stroke-width="3"
          d="M20 6L9 17L4 12"
        ></path>
      </svg>
    </div>
    <span class="label">回关</span>
  </label>
</template>

<style scoped>
.checkbox-wrapper {
  --checkbox-size: 20px;
  --checkbox-color: #EE3299;
  --checkbox-shadow: rgba(207, 47,141, 0.3);
  --checkbox-border: rgba(207, 47,141, 0.7);
  display: flex;
  align-items: center;
  position: relative;
  cursor: pointer;
  padding: 10px;
}

.checkbox-wrapper input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkbox-wrapper .checkmark {
  position: relative;
  width: var(--checkbox-size);
  height: var(--checkbox-size);
  border: 2px solid var(--checkbox-border);
  border-radius: 8px;
  transition: all 0.4s cubic-bezier(0.25, 0.1, 0.25, 1); /* Используем более плавный кубический безе */
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.2);
  box-shadow: 0 0 15px var(--checkbox-shadow);
  overflow: hidden;
}

.checkbox-wrapper .checkmark::before {
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, var(--checkbox-color), #D73998);
  opacity: 0;
  transition: all 0.4s cubic-bezier(0.25, 0.1, 0.25, 1); /* Используем более плавный кубический безе */
  transform: scale(0) rotate(-45deg);
}

.checkbox-wrapper input:checked ~ .checkmark::before {
  opacity: 1;
  transform: scale(1) rotate(0);
}

.checkbox-wrapper .checkmark svg {
  width: 0;
  height: 0;
  color: #1a1a1a;
  z-index: 1;
  transition: all 0.4s cubic-bezier(0.25, 0.1, 0.25, 1); /* Используем более плавный кубический безе */
  filter: drop-shadow(0 0 2px rgba(0, 0, 0, 0.5));
}

.checkbox-wrapper input:checked ~ .checkmark svg {
  width: 18px;
  height: 18px;
  /* transform: rotate(360deg); <-- УДАЛЕНО */
}

.checkbox-wrapper:hover .checkmark {
  border-color: var(--checkbox-color);
  transform: scale(1.1);
  box-shadow:
    0 0 20px var(--checkbox-shadow),
    0 0 40px var(--checkbox-shadow),
    inset 0 0 10px var(--checkbox-shadow);
  transition: all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1); /* Добавляем плавный переход */
}

.checkbox-wrapper input:checked ~ .checkmark {
  animation: pulse 1s cubic-bezier(0.25, 0.1, 0.25, 1);
}

@keyframes pulse {
  0% {
    transform: scale(1);
    box-shadow: 0 0 15px var(--checkbox-shadow); /* Уменьшаем начальный бокс-шадоу */
  }
  50% {
    transform: scale(0.95); /* Меняем значение для более плавного эффекта */
    box-shadow:
      0 0 25px var(--checkbox-shadow),
      0 0 40px var(--checkbox-shadow);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 15px var(--checkbox-shadow); /* Уменьшаем конечный бокс-шадоу */
  }
}

.checkbox-wrapper .label {
  margin-left: 15px;
  font-family: "Segoe UI", sans-serif;
  color: var(--checkbox-color);
  font-size: 18px;
  text-shadow: 0 0 10px var(--checkbox-shadow);
  opacity: 0.9;
  transition: all 0.3s ease; /* Используем стандартное easing */
}

.checkbox-wrapper:hover .label {
  opacity: 1;
  transform: translateX(5px);
}

/* Glowing dots animation */
.checkbox-wrapper::after,
.checkbox-wrapper::before {
  content: "";
  position: absolute;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--checkbox-color);
  opacity: 0;
  transition: all 0.5s ease; /* Используем стандартное easing */
}

.checkbox-wrapper::before {
  left: -10px;
  top: 50%;
}

.checkbox-wrapper::after {
  right: -10px;
  top: 50%;
}

.checkbox-wrapper:hover::before {
  opacity: 1;
  transform: translateX(-10px);
  box-shadow: 0 0 10px var(--checkbox-color);
}

.checkbox-wrapper:hover::after {
  opacity: 1;
  transform: translateX(10px);
  box-shadow: 0 0 10px var(--checkbox-color);
}

</style>
