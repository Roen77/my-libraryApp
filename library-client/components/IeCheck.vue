<template>
  <div v-if="showAlert" class="ie-chk">
    해당 브라우저(IE)는 곧 서비스가 종료될 예정입니다. 다른 브라우저를 이용해주세요.
    <button @click="closeAlert">
      <i class="fas fa-times"></i>
    </button>
  </div>
</template>

<script>
import ischk from 'is-iexplorer'
export default {
  data () {
    return {
      showAlert: false
    }
  },
  mounted () {
    if (ischk) { this.showAlert = true }
  },
  methods: {
    closeAlert () {
      this.showAlert = false
    }
  }

}
</script>

<style>
.ie-chk{position: fixed; left:0; top:0; width: 100%; z-index: 99999; background-color: #3949AB; text-align: center; padding: 10px; color:#fff;}
.ie-chk button{border: none; background: none; padding: 0 10px; color:#fff; font-size: 20px;}
</style>
