
export const state = () => ({
  user: {}
})
export const mutations = {
  setUser (state, user) {
    state.user = user
  }

}
export const actions = {
  // 사용자 정보 가져오기
  async fetchUser ({ commit }) {
    try {
      const res = await this.$axios.get('user')
      commit('setUser', res.data)
    } catch (error) {
      console.error(error)
    }
  },
  // 로그인
  async login ({ commit }, userData) {
    const res = await this.$axios.post('user/login', userData)
    commit('setUser', res.data)
  },
  // 회원 가입
  async register ({ commit }, userData) {
    const res = await this.$axios.post('user/register', userData)
    commit('setUser', res.data)
  },
  // 로그 아웃
  async logout ({ commit }, userData) {
    try {
      await this.$axios.get('user/logout', userData)
      commit('setUser', null)
    } catch (error) {
      console.error(error)
    }
  },
  // 프로파일 이미지 수정
  async updateProfile ({ commit }, userData) {
    try {
      const res = await this.$axios.put('user', userData)
      commit('setUser', res.data.user)
    } catch (error) {
      console.error(error)
    }
  },
  // 비밀번호 수정
  async updatePassword (_, userData) {
    try {
      await this.$axios.patch('user', userData)
    } catch (error) {
      console.error(error)
    }
  }

}
