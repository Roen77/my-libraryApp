<template>
  <div class="user signupbox">
    <div class="formbx">
      <form @submit.prevent="UserRegister">
        <h2>회원가입</h2>
        <!-- 이메일 -->
        <div :class="{'invalid':!user.email}">
          <label for="email">email</label>
          <input id="email" ref="emailinput" v-model="user.email" type="text" placeholder="이메일">
        </div>
        <div v-if="!isvalidEmail && user.email" class="err">
          이메일 형식으로 입력해주세요
        </div>
        <!-- 닉네임 -->
        <div :class="{'invalid':!user.username}">
          <label for="username">username</label>
          <input id="username" v-model="user.username" type="text" placeholder="닉네임">
        </div>
        <!-- 비밀번호 -->
        <div :class="{'invalid':!password}">
          <label for="password">password</label>
          <input id="password" v-model="password" type="password" placeholder="비밀번호" autocomplete="on">
        </div>
        <div v-if="!isvalidLength && password" class="err">
          비밀번호는 8자리 이상 30자 이하여야 합니다.
        </div>
        <!-- 비밀번호 확인 -->
        <div :class="{'invalid':!confirm_password}">
          <label for="comfirm_password">comfirm_password</label>
          <input id="comfirm_password" v-model="confirm_password" type="password" placeholder="비밀번호 확인" autocomplete="on">
          <div v-if="!isconfirmPassword && confirm_password" class="err">
            비밀번호가 일치하지 않습니다
          </div>
        </div>
        <!-- 에러 메세지 -->
        <div>
          <div v-if="errmsg" class="errmsg" :class="{'visible':errmsg}">
            {{ errmsg }}
          </div>
          <div v-if="!isuserInfoLength " class="errmsg" :class="{'visible':!isuserInfoLength }">
            {{ inputErrMsg }}
          </div>
          <!-- 회원가입 버튼 -->
          <button class="primary-btn" type="submit" :disabled="!disabledBtn">
            회원가입
          </button>
          <p class="signup">
            이미 가입된 회원이신가요?<nuxt-link to="/auth/login">
              로그인
            </nuxt-link>
          </p>
        </div>
      </form>
    </div>
    <div class="imgbx">
      <img src="/images/user2.png" alt="회원가입">
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { validLength, validEmail } from '~/utils/validate'
export default {
  data () {
    return {
      user: {
        email: '',
        username: ''
      },
      password: '',
      confirm_password: '',
      errmsg: ''
    }
  },
  computed: {
    //  1. 비밀번호 길이 검사
    isvalidLength () {
      return validLength(this.password, 8, 30)
    },
    // 2. 이메일 유효성 검사
    isvalidEmail () {
      return validEmail(this.user.email)
    },
    // 3. `data`의 `password` 의 값과 `data`의 `confirm_password` 의 값이 일치하는지 검사
    isconfirmPassword () {
      return this.password === this.confirm_password
    },
    // 4. 이메일과 닉네임의 길이 검사
    isuserInfoLength () {
      return Object.keys(this.user).every((key) => {
        return validLength(this.user[key], 0, 20)
      })
    },
    // 입력데이터에 따른 에러 메세지
    inputErrMsg () {
      if (!this.user.email && !this.user.username) { return }
      return !this.isuserInfoLength ? '입력값은 20자리 이하로 입력해주세요.' : ''
    },
    // 유효성 검사 확인하여 로그인 버튼 활성화 여부
    disabledBtn () {
      return this.isvalidLength && this.isvalidEmail && this.isconfirmPassword && this.isuserInfoLength
    }
  },
  mounted () {
    this.inputfocus()
  },
  methods: {
    ...mapActions('user', ['register']),
    async UserRegister () {
      try {
        const userData = {
          email: this.user.email,
          username: this.user.username,
          password: this.password
        }
        await this.register(userData)
        // 성공적으로 회원가입되면 메인페이지로 이동
        this.$router.push('/')
      } catch (error) {
        // 에러 발생시 에러메세지 출력될 수 있도록 구현
        this.errmsg = error.response.data.msg
      } finally {
        // 데이터 전송이 실패했든 성공했든 상관없이 전송후엔 무조건 기존 입력값을 초기화시켜준다.
        this.resetInput()
        this.inputfocus()
      }
    },
    // 입력값 초기화
    resetInput () {
      Object.keys(this.user).forEach((key) => { this.user[key] = '' })
      this.password = ''
      this.confirm_password = ''
    },
    // 이메일 입력폼에 포커스
    inputfocus () {
      this.$refs.emailinput.focus()
    }

  }

}
</script>

<style>

</style>
