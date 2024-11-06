<template>
  <div class="callout-container">
    <div class="icon-container">
      <div class="icon">
        <svg width="28" height="40" viewBox="0 0 28 40" xmlns="http://www.w3.org/2000/svg">
          <title>lightbulb</title>
          <path
            d="M12 28h4v-8h-4v8zM8 40h12v-8H8v8zm13.98-14.52c-1.001.705-1.661 1.545-1.98 2.52H8c-.416-.959-1.076-1.799-1.98-2.52A13.99 13.99 0 0 1 0 14C0 6.272 6.272 0 14 0s14 6.272 14 14a13.99 13.99 0 0 1-6.02 11.48z"
            fill="#FFF" fill-rule="nonzero"></path>
        </svg>
      </div>
    </div>
    <p class="callout-text">
      <slot></slot>
    </p>
  </div>
</template>

<style scoped>
.callout-container {
  margin-bottom: 2.5rem;
  margin-left: auto;
  margin-right: auto;
  padding: 2rem;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
}

.icon-container {
  width: 5rem;
  height: 5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background-color: #6b46c1;
  border-radius: 16%;
}

.icon {
  opacity: 0.75;
}

.callout-text {
  margin: 0 !important;
  margin-left: 1.2rem !important;
}
</style>