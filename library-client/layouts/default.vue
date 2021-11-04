<template>
  <div class="container default" :class="{'edit':editState}">
    <AppHeader />
    <main class="main_container">
      <div class="inner">
        <Nuxt />
        <div class="topbtn" :class="{ 'fixed': fix }">
          top
        </div>
      </div>
    </main>
    <AppFooter />
    <CommonAlertMsg :alert-state="alertState" :data="data" :bgcolor="bgcolor" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import bus from '~/utils/bus'
export default {
  middleware: 'authorize',
  data () {
    return {
      alertState: false,
      data: '',
      bgcolor: '',
      fix: false
    }
  },
  computed: {
    ...mapState('books', ['editState'])
  },
  created () {
    // 알림창 보이기
    bus.$on('on:alert', ({ data, bgcolor }) => {
      this.bgcolor = bgcolor
      this.data = data
      this.onalert()
    })
    // 알림창 끄기
    bus.$on('off:alert', this.offalert)
  },
  mounted () {
    const top = document.querySelector('.topbtn')
    window.addEventListener('scroll', this.debounce(this.checkHeight, 300))
    top.addEventListener('click', function () {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    })
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.debounce(this.checkHeight, 300))
  },
  methods: {
    onalert () {
      this.alertState = true
    },
    offalert () {
      this.alertState = false
    },
    // 높이 확인
    checkHeight () {
      this.fix = window.scrollY || window.pageYOffset || document.documentElement.scrollTop > 0
    },
    debounce (func, delay) {
      let timeoutId = null
      return () => {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(func, delay)
      }
    }
  }
}
</script>

<style>
.container{position: relative; min-height: 100vh; padding-top: 80px; box-sizing: border-box;}
.default.container{
background-image: url(/images/main_bg.jpg); background-position: left  bottom 70px; background-size: 450px; background-repeat: no-repeat;
}
.default.container.edit{padding: 0; margin: 0; min-height: auto; width: 100%; height: 100vh; overflow: hidden; }
.topbtn{
  display: none;
  cursor: pointer;
  position: fixed;
  right: 16px;
  bottom: 63px;
  background-color:rgb(56, 95, 134);
  padding: 10px;
  border-radius: 10px;
  color:#fff;
  z-index: 9999;
}
.topbtn.fixed{display: block;}
@media (max-width:600px) {
  .default.container {
    background-size: 300px;
    background-position: left -60px bottom 70px;
  }
  .topbtn {
    padding: 7px;
    font-size: 14px;
  }
}
</style>
