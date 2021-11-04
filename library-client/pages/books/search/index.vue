<template>
  <div class="search-area">
    <!-- form-search -->
    <FormSearch v-model="search" :options="options" @searchBook="onSearchBook" @selectedOption="onSeletedOption" />
    <div v-if="errmsg" class="err book_search">
      검색 내용을 입력해주세요.
    </div>
    <!-- search-content -->
    <template v-if="!initLoading">
      <div class="search-content">
        <template v-if="books.length">
          <div class="count">
            {{ meta.pageable_count }}
          </div>
        </template>
        <template v-else>
          <BookEmpty />
        </template>
        <div v-for="(book,index) in books" :key="index" class="search_book">
          <!-- book-card-detail -->
          <BookCardDetail :book="book" />
          <button class="round-btn addbtn red" @click="onaddBook(book)">
            추가하기
          </button>
        </div>
      </div>
      <!-- 더보기 버튼 -->
      <div v-if="showbtn" ref="btn" class="more">
        <button class="round-btn fill more-btn" @click=" addFetchBook">
          {{ currentCount }} / {{ meta.pageable_count }}
        </button>
      </div>
    </template>
    <div v-else class="loading_area">
      <LoadingBar />
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'
import bus from '~/utils/bus.js'
export default {
  data () {
    return {
      options: ['통합', '제목', '저자', '출판사', 'isbn'],
      option: '',
      search: '',
      errmsg: false,
      size: 20,
      isend: false,
      reset: false,
      currentpage: 1,
      showbtn: false,
      currentCount: 0
    }
  },
  computed: {
    ...mapState(['initLoading']),
    ...mapState('books', ['books', 'meta'])
  },
  // 책 데이터 초기화
  created () {
    if (this.books.length) { return this.initsearchBook() }
  },
  methods: {
    ...mapMutations('books', ['initsearchBook']),
    ...mapActions('books', ['SearchBooks', 'createBook']),
    onSearchBook () {
      // 기존 데이터 초기화
      this.resetBook(true)
      this.currentpage = 1
      this.currentCount = 0
      // 검색한 책 데이터 불러오기
      this.onFetchbook()
    },
    onFetchbook () {
      // 입력폼에 아무것도 작성하지 않고 엔터를 누른다면 사용자에게 에러메세지로 알려주고,return 해줍니다.
      if (!this.search.length) {
        this.errmsg = true
        return
      }
      let bookinfo = { size: this.size, query: encodeURIComponent(this.search), page: this.currentpage, reset: this.reset }
      switch (this.option) {
        case '통합':
          bookinfo = { ...bookinfo }
          break
        case '제목':
          bookinfo = { ...bookinfo, target: 'title' }
          break
        case '저자':
          bookinfo = { ...bookinfo, target: 'person' }
          break
        case '출판사':
          bookinfo = { ...bookinfo, target: 'publisher' }
          break
        case 'isbn':
          bookinfo = { ...bookinfo, target: 'isbn' }
          break
        default:
          break
      }
      this.SearchBooks(bookinfo)
        .then(() => {
          this.errmsg = false
          this.currentCount += this.size
          this.isend = this.meta.is_end
          this.showbutton()
        })
    },
    // 더보기 버튼 클릭시 다음 데이터 호출
    addFetchBook () {
      if (!this.isend) {
        this.currentpage++
        this.resetBook(false)
        this.onFetchbook()
      }
    },
    //  book.authors 는 배열이므로, 문자열로 포맷합니다.
    bookauthors (authors) {
      return authors.join(',')
    },
    resetBook (boolean) {
      this.reset = boolean
    },
    // 마지막페이지라면 더보기 버튼이 보여지지 않도록 합니다.
    showbutton () {
      this.isend || !this.books.length ? this.showbtn = false : this.showbtn = true
    },
    async onaddBook (book) {
      try {
        const bookData = { title: book.title, contents: book.contents, datetime: book.datetime, isbn: book.isbn, publisher: book.publisher, thumbnail: book.thumbnail, url: book.url, authors: this.bookauthors(book.authors) }
        await this.createBook(bookData)
          .then((res) => {
            // 데이터가 성공적으로 호출됐을 때 알림메세지로 알려주도록 구현했습니다.
            bus.$emit('on:alert', { data: res.data.msg, bgcolor: '#1A237E' })
            setTimeout(() => {
              bus.$emit('off:alert')
            }, 3000)
          })
      } catch (error) {
        console.log(error)
        bus.$emit('on:alert', { data: error.response.data.msg, bgcolor: '#880E4F' })
        setTimeout(() => {
          bus.$emit('off:alert')
        }, 3000)
      }
    },
    onSeletedOption (option) {
      this.option = option
    }
  }

}
</script>

<style>
.search-content,.loading_area{margin-top: 10px;}
.book_search.err{text-align: center; margin-bottom: 1%;}
.search-area{padding-bottom: 100px;}
</style>
