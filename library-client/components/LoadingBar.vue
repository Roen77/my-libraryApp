<template>
  <div class="loading-spin" :class="{'absolute' : 'position' }">
    <i class="fas fa-spinner fa-spin" :style="{ color }"></i>
  </div>
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      required: false,
      default: '#677eff'
    },
    position: {
      type: Boolean,
      required: false
    }
  }
}
</script>

<style scoped>
/* loading spin */
.loading-spin{text-align: center; }
.loading-spin.absolute{position: absolute; left:50%; top:50%; transform: translate(-50%,-50%); z-index: 9999;}
.loading-spin .fa-spin{font-size: 16px;}
</style>
