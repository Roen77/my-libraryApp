<template>
  <transition name="upSlide">
    <div v-if="alertState" class="alertmsg" :style="{ 'background-color': bgcolor }">
      {{ data }}
    </div>
  </transition>
</template>

<script>

export default {
  props: {
    alertState: {
      type: Boolean,
      required: true
    },
    data: {
      type: String,
      required: true
    },
    bgcolor: {
      type: String,
      required: false,
      default: '#222'
    }
  }

}
</script>

<style>
.alertmsg{position: fixed; z-index: 9999; left:50%; top:1%; width: 50%; padding: 5px; transform: translateX(-50%);
color:#fff;text-align: center; font-size: 14px; border-radius: 15px;
}
/* upSlide animation */
.upSlide-enter-active {
    transition: all .3s ease;
  }
  .upSlide-leave-active {
    transition: all .5s ease-in-out;
  }
  .upSlide-enter, .upSlide-leave-to {
    transform:translateX(-50%) translateY(10px);
    opacity: 0;
}
@media (max-width:600px) {
  .alertmsg{width: 90%;}
}
</style>
