
export const state = () => ({
  initLoading: false
})
export const mutations = {
  changeLoading (state, value) {
    state.initLoading = value
  }
}
export const actions = {
  async nuxtServerInit ({ dispatch }) {
    await dispatch('user/fetchUser')
  }
}
