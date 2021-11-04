<template>
  <div class="user loginbox">
    <div class="imgbx">
      <img src="/images/password.png" alt="로그인">
    </div>
    <div class="formbx">
      <div v-if="!active" class="other-btns">
        <h2>로그인</h2>
        <p><a href="#" @click.prevent="onactive"><i class="fas fa-envelope" />이메일로 로그인</a></p>
        <p><a href="#" @click.prevent="kakao"><i class="fas fa-comment" />카카오로 로그인</a></p>
        <p><a href="#" @click.prevent="google"><i class="fab fa-google" />구글로 로그인</a></p>
      </div>
      <form v-if="active" @submit.prevent="UserLogin">
        <h2>로그인</h2>
        <div :class="{'invalid':!email}">
          <label for="email">email</label>
          <input id="email" ref="emailinput" v-model="email" type="text" placeholder="이메일">
        </div>
        <div v-if="!isvalidEmail && email" class="err">
          이메일 형식으로 입력해주세요.
        </div>
        <div :class="{'invalid':!password}">
          <label for="password">password</label>
          <input id="password" v-model="password" type="password" placeholder="비밀번호" autocomplete="on">
        </div>
        <div v-if="!isvalidLength && password" class="err">
          비밀번호는 8자리 이상 30자 이하여야 합니다.
        </div>
        <div v-if=" errmsg" class="errmsg">
          {{ errmsg }}
        </div>
        <div>
          <button class="primary-btn" type="submit" :disabled="!disabledBtn">
            로그인
          </button>
        </div>
        <div class="other_login" />
        <p class="signup">
          아직 회원가입이 안되셨나요?<nuxt-link to="/auth/register">
            회원가입
          </nuxt-link>
        </p>
        <p class="social" @click="socialLogin">
          <a href="#">소셜로 로그인하기</a>
        </p>
      </form>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { validLength, validEmail } from '../../utils/validate'
export default {
  data () {
    return {
      email: '',
      password: '',
      errmsg: '',
      active: false
    }
  },
  computed: {
    isvalidLength () {
      return validLength(this.password, 8, 30)
    },
    isvalidEmail () {
      return validEmail(this.email)
    },
    disabledBtn () {
      return this.isvalidLength && this.isvalidEmail
    }
  },
  methods: {
    ...mapActions('user', ['login']),
    async UserLogin () {
      try {
        const userinfo = {
          email: this.email,
          password: this.password
        }
        await this.login(userinfo)
        // 성공적으로 로그인되면 메인페이지로 이동
        this.$router.push('/')
      } catch (error) {
        // 에러 발생시 에러메세지 출력될 수 있도록 구현
        console.log(error)
        this.errmsg = error.response.data.msg
      }
    },
    google () {
      window.location = 'https://app.roen.pe.kr/user/google'
    },
    kakao () {
      window.location = 'https://app.roen.pe.kr/user/kakao'
    },
    socialLogin () {
      this.active = false
      this.resetInput()
    },
    resetInput () {
      this.email = ''
      this.password = ''
    },
    onactive () {
      this.active = true
      this.$nextTick(() => {
        this.$refs.emailinput.focus()
      })
    }
  }
}
</script>

<style>

</style>
