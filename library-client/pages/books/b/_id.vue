<template>
  <div class="book-details">
    <div>
      <BookCardDetail :book="book" />
      <div
        class="control_btns"
      >
        <div class="left_btn">
          <!-- 삭제 버튼 -->
          <button class="primary-btn red" @click="onremoveBook">
            <i class="fas fa-trash-alt"></i>삭제
          </button>
          <!-- 수정 버튼 -->
          <button class="primary-btn" @click="onEditBook">
            <i class="fas fa-pen-square"></i>수정
          </button>
        </div>
        <div class="right_btn">
          <button class="primary-btn" @click="onEditHashtag">
            <i class="fas fa-pen-square"></i>해시태그
          </button>
          <FormHashtag v-if="editHashtag" :hashtags="book&&book.Hashtags" />
        </div>
      </div>
      <CommentEdit />
      <FormAlert v-if="alert" :title="book && book.title" :confirm="`삭제`" @onagree=" agree" @ondisagree="disagree" />
    </div>
    <CommonModal v-if="editState" class="book_form edit">
      <div slot="header">
        <h2 class="sub_head">
          책 정보 수정
        </h2>
        <button class="closebtn round-btn" @click="closeEdit">
          닫기
        </button>
      </div>
      <div slot="body">
        <FormBook />
      </div>
    </CommonModal>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex'
export default {
  async asyncData ({ store, params }) {
    try {
      await store.dispatch('books/fetchBook', { id: params.id })
    } catch (err) {
      console.log(err)
    }
  },
  data () {
    return {
      editHashtag: false,
      agreeState: false,
      alert: false
    }
  },
  head () {
    return {
      title: this.book.title,
      meta: [
        { hid: 'og:url', property: 'og:url', content: `https://library.roen.pe.kr/books/b/${this.book.id}` },
        { hid: 'og:type', property: 'og:type', content: 'website' },
        { hid: 'og:title', property: 'og:title', content: this.book.title },
        { hid: 'og:description', property: 'og:description', content: this.book.contents },
        { hid: 'og:image', property: 'og:image', content: this.book.thumbnail ? `${this.book.thumbnail}` : 'https://library.roen.pe.kr/images/sample_book.jpg' },
        { hid: 'twitter:site', name: 'twitter:site', content: `https://library.roen.pe.kr/books/b/${this.book.id}` },
        { hid: 'twitter:title', name: 'twitter:title', content: this.book.title },
        { hid: 'twitter:description', name: 'twitter:description', content: this.book.contents },
        { hid: 'twitter:image', name: 'twitter:image', content: this.book.thumbnail ? `${this.book.thumbnail}` : 'https://library.roen.pe.kr/images/sample_book.jpg' }
      ]
    }
  },
  computed: {
    ...mapState('books', ['editState', 'book'])
  },
  methods: {
    ...mapActions('books', ['deleteBook']),
    ...mapMutations('books', ['updateState']),
    onremoveBook () {
      this.alert = true
    },
    onEditBook () {
      this.updateState({
        editState: true
      })
    },
    onEditHashtag () {
      this.editHashtag = !this.editHashtag
    },
    closeEdit () {
      this.updateState({
        editState: false
      })
      this.$store.commit('changeLoading', false)
    },
    disagree () {
      this.agreeState = false
      this.alert = false
    },
    agree () {
      try {
        this.deleteBook({ id: this.$route.params.id })
          .then(() => {
            // 삭제 후 라우터 이동
            this.$router.push('/books/1')
          })
      } catch (error) {
        console.error(error)
      }
    }
  }
}
</script>

<style>
.book-details{min-height: 100vh;}
.control_btns{ margin: 10px 0; display: flex;}
.control_btns .right_btn{position: relative; margin-left: auto;}
.control_btns button{border-radius: 10px; letter-spacing: 1px;}
.control_btns button .fas{margin-right: 4px;}
.book_form.edit{width: 100%; box-sizing: border-box; display: flex; justify-content: center; align-items: center;}
.book_form.edit .modal-header>div{position: relative; width: 1200px; max-width: 100%; margin: 0 auto;}
.book_form.edit .modal-container{height: 100vh; overflow-y: auto;}
@media (max-width:600px) {
.control_btns{display: block;}
.book_form.edit .modal-header{padding: 5px;}
.book_form.edit .modal-container{padding: 20px 5px;}
}
</style>
