import { loadImage } from '~/utils/image'
export const state = () => ({
  // search meta
  meta: {},
  // 책 데이터
  books: [],
  // 책 단일 데이터
  book: {},
  // 페이지
  currentPage: 0,
  // 이미지 파일
  imagePath: '',
  // 이미지 오류
  imageErr: '',
  // 편집상태
  editState: false,
  // 책 검색
  search: {
    data: '',
    selectedOption: '책제목'
  }
})
export const mutations = {
  // 책 검색 추가
  addBook (state, bookData) {
    const { data, reset } = bookData
    // 초기화
    if (reset) {
      state.books = []
      state.meta = {}
    }
    data.documents.forEach((book) => {
      state.books = [...state.books, book]
    })
    state.meta = data.meta
  },
  initsearchBook (state) {
    state.books = []
    state.meta = {}
  },
  // 책 추가
  createBook (state, bookData) {
    state.books = [bookData, ...state.books]
  },
  loadBooks (state, { books, page }) {
    // state의 books 배열에 책 데이터를 저장합니다.
    state.books = [...books]
    // 현재페이지는 `state`의 currentPage에 저장합니다.
    state.currentPage = page
  },
  loadbook (state, bookData) {
    state.book = bookData
  },
  // 북마크
  changeBookmark (state, { bookId, value }) {
    const index = state.books.findIndex(book => book.id === bookId)
    state.books[index].bookmark = value
  },
  // 해시태그 추가
  addHashtag (state, hashtagList) {
    state.book.Hashtags = state.book.Hashtags.concat(hashtagList)
  },
  // 해시태그 삭제
  removeHashtag (state, hashtagId) {
    state.book.Hashtags = state.book.Hashtags.filter(tag => tag.id !== hashtagId)
  },
  // 좋아요 추가
  addlike (state, likeData) {
    const { bookId, userId } = likeData
    const index = state.books.findIndex(book => book.id === bookId)
    state.books[index].Likers.push({ id: userId })
  },
  // 좋아요 삭제
  removelike (state, likeData) {
    const { bookId, userId } = likeData
    const index = state.books.findIndex(book => book.id === bookId)
    state.books[index].Likers = state.books[index].Likers.filter(like => like.id !== userId)
  },
  // state 업데이트
  updateState (state, payload) {
    Object.keys(payload).forEach((key) => { state[key] = payload[key] })
  },
  updateSearch (state, payload) {
    // eslint-disable-next-line
    Object.keys(payload).forEach(key => state.search[key] = payload[key])
  }
}
export const actions = {
  async SearchBooks ({ commit, rootState }, bookData) {
    const { size, query, reset, page } = bookData
    try {
      if (rootState.inintLoading) { return }
      // 맨 처음에 데이터를 불러올 때 로딩 스피너를 보여줍니다.
      if (reset) { commit('changeLoading', true, { root: true }) }
      const api = `/books/search/kakao?query=${query}&size=${size}&page=${page}`
      let res
      // target에 따라 검색(target의 내용에 따라 검색하는 API를 호출)
      if (bookData.target) {
        res = await this.$axios.get(`${api}&target=${bookData.target}`)
      } else {
        // 통합검색(target과 상관없이 "제목","출판사","저자" 등 과 관련없이 모든 요소에서 검색한 API를 호출)
        res = await this.$axios.get(api)
      }
      commit('addBook', { data: res.data, reset })
    } catch (error) {
      console.error(error)
    } finally {
      // 로딩 스피너 종료
      if (reset) {
        setTimeout(() => commit('changeLoading', false, { root: true }), 400)
      }
    }
  },
  // 책 추가
  async createBook (_, bookData) {
    const res = await this.$axios.post('/books/add', bookData)
    return res
  },
  // 단일 책 데이터 불러오기
  async fetchBook ({ commit }, { id }) {
    const res = await this.$axios.get(`/books/${id}`)
    commit('loadbook', res.data.book)
    return res
  },
  // 책 수정
  async updateBook ({ commit }, bookData) {
    const res = await this.$axios.put(`/books/${bookData.id}`, bookData.data)
    commit('loadbook', res.data.book)
    return res
  },
  // 책 삭제
  async deleteBook (_, { id }) {
    const res = await this.$axios.delete(`/books/${id}`)
    return res
  },
  // 이미지 업로드
  async uploadImg ({ commit }, payload) {
    try {
      // 로딩 시작
      commit('changeLoading', true, { root: true })
      const res = await this.$axios.post('thumbnail', payload)
      commit('updateState', {
        imagePath: res.data
      })
      // 이미지 로드된 후 이미지 보여주기
      await loadImage(res.data || '')
    } catch (error) {
      console.error(error)
    } finally {
      // 로딩 종료
      commit('changeLoading', false, { root: true })
    }
  },
  // 북마크 추가
  async createBookmark ({ commit }, { bookId }) {
    try {
      await this.$axios.patch(`books/${bookId}/addbookmark`)
      commit('changeBookmark', { bookId, value: true })
    } catch (error) {
      console.error(error)
    }
  },
  // 북마크 삭제
  async deleteBookmark ({ commit }, { bookId }) {
    try {
      await this.$axios.patch(`books/${bookId}/removebookmark`)
      commit('changeBookmark', { bookId, value: false })
    } catch (error) {
      console.error(error)
    }
  },
  // 해시태그 추가
  async createHashtag ({ commit }, { bookId, hashtags }) {
    try {
      const res = await this.$axios.post(`hashtags/${bookId}`, { hashtags })
      commit('addHashtag', res.data.hashtagList)
    } catch (error) {
      console.error(error)
    }
  },
  // 해시태그 삭제
  async deleteHashtag ({ commit }, { bookId, hashtagId }) {
    try {
      await this.$axios.delete(`hashtags/${bookId}/tag/${hashtagId}`)
      commit('removeHashtag', hashtagId)
    } catch (error) {
      console.error(error)
    }
  },
  // 책 데이터 가져오기
  async fetchBooks ({ commit }, bookData) {
    const { route, page, search, target, name } = bookData
    let res
    switch (route) {
      // 나의 책 데이터
      case 'books-page':
        res = await this.$axios.get(`books?page=${page}`)
        break
        // 다른 사용자의 책 데이터
      case 'books-others-page':
        res = await this.$axios.get(`books/others/book?page=${page}`)
        break
        // 검색한 책 데이터
      case 'books-search-page':
        res = await this.$axios.get(`books/others/book?page=${page}&search=${search}&target=${target}`)
        break
        // 태그별 겸색한 데이터
      case 'hashtags-page':
        res = await this.$axios.get(`hashtags?page=${page}&name=${name}`)
        break
      default:
        break
    }
    commit('loadBooks', { books: res.data.books || [], page: res.data.page || 0 })
    return res
  },
  // 다른 사용자의 책(단일) 불러오기
  async otherFetchBook ({ commit }, { id }) {
    const res = await this.$axios.get(`/books/others/book/${id}`)
    commit('loadbook', res.data.book)
    return res
  },
  // 다른 사용자의 책 좋아요 추가
  async otheraddLike ({ commit }, { bookId }) {
    const res = await this.$axios.post(`/books/others/book/${bookId}/addLike`)
    commit('addlike', { bookId, userId: res.data.userId })
    return res
  },
  // 다른 사용자의 책 좋아요 제거
  async otherremoveLike ({ commit }, { bookId }) {
    const res = await this.$axios.delete(`/books/others/book/${bookId}/removeLike`)
    commit('removelike', { bookId, userId: res.data.userId })
    return res
  }

}
