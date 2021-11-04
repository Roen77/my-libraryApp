import { mapState, mapActions } from 'vuex'
export default {
  async asyncData ({ store, params, route }) {
    try {
      let total
      let totalPage
      const page = params.page
      let data = { page: page - 1, route: route.name }
      // 검색한 책 데이터 보여주기
      if (route.name === 'books-search-page') {
        data = { ...data, search: encodeURIComponent(route.query.search), target: encodeURIComponent(route.query.target) }
      // 해당 해시태그를 가지고 있는 책 데이터 보여주기
      } else if (route.name === 'hashtags-page') {
        data = { ...data, name: encodeURIComponent(route.query.name) }
      }
      await store.dispatch('books/fetchBooks', data)
        .then((res) => {
          if (!res.data) { return }
          // 전체 데이터 갯수
          total = res.data.totalCount
          // 전체 페이지 수
          totalPage = res.data.totalPage
        })
      return { total, totalPage }
    } catch (error) {
      console.log(error)
    }
  },
  computed: {
    ...mapState('books', ['books']),
    hasBook () {
      return this.books.length
    }
  },
  methods: {
    ...mapActions('books', ['fetchBooks']),
    pagination (page) {
      switch (this.$route.name) {
        // 내 책 페이지
        case 'books-page':
          return this.$router.push(`/books/${page}`)
        // 다른 사용자의 책 페이지
        case 'books-others-page':
          return this.$router.push(`/books/others/${page}`)
        // 검색 페이지
        case 'books-search-page':
          return this.$router.push(`/books/search/${page}?search=${this.search.selectedOption}&target=${encodeURIComponent(this.search.data)}`)
        // 해시태그로 검색한 페이지
        case 'hashtags-page':
          return this.$router.push(`/hashtags/${page}?name=${this.$route.query.name}`)
        default:
          break
      }
    }
  }
}
