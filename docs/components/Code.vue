<script setup>
defineProps({
  text: String,
})
</script>
<template>
  <span class="code-highlight">
    <template v-if="text">
      {{ code }}
    </template>

    <slot></slot>
  </span>
</template>