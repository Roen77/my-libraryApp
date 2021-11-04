export const actions = {
  async getCounts () {
    try {
      const res = await this.$axios.get('/profiles')
      return res
    } catch (error) {
      console.error(error)
    }
  }
}
