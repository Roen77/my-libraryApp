<template>
  <form class="form_content" @submit.prevent="onsubmitBook">
    <!-- 책 정보 -->
    <div v-for="newBook in newBooks" :key="newBook.label">
      <div>
        <label for="">{{ newBook.label }}</label>
        <p :class="{'invalid':!newBook.name}">
          <textarea v-if="newBook.textarea" v-model="newBook[newBook.name]" cols="30" rows="10"></textarea>
          <input v-else v-model="newBook[newBook.name]" :class="{'titleInput':newBook.focus}" type="text">
          <i v-if="newBook[newBook.name]" class="fas fa-plus-circle" @click="resetInput($event,newBook.name)"></i>
        </p>
      </div>
      <div v-if="newBook.require && !newBook[newBook.name]" class="err">
        {{ newBook.label }}은/는 필수입니다.
      </div>
    </div>
    <!-- 책 날짜 -->
    <div class="date_area">
      <label for="">출간날짜</label>
      <b-form-datepicker id="datepicker" v-model="datetime"></b-form-datepicker>
    </div>
    <!-- 책 이미지 추가/수정 -->
    <FormImage image-title="책 이미지" :thumbnail="book.thumbnail || ''" :show-thumbnail="isEditform" />
    <button type="submit" class="round-btn red addbtn" :disabled="disabledBtn">
      {{ bookBtn }}
    </button>
    <CommonAlertMsg :alert-state="!inputLenValid" data="100자 이내로 작성해주세요" />
  </form>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import BookFetchMixin from '~/mixins/BookFetchMixin'
export default {
  mixins: [BookFetchMixin],
  data () {
    return {
      newBooks: [
        {
          label: '책제목',
          name: 'title',
          title: '',
          focus: true,
          require: true
        }, {
          label: '책 내용',
          name: 'contents',
          contents: '',
          require: true,
          notlimit: true,
          textarea: true
        }, {
          label: '책 url',
          name: 'url',
          url: '',
          notlimit: true
        }, {
          label: 'isbn',
          name: 'isbn',
          isbn: ''
        }, {
          label: '저자',
          name: 'authors',
          authors: '',
          require: true
        }, {
          label: '출판사',
          name: 'publisher',
          publisher: ''
        }],
      datetime: ''
    }
  },
  computed: {
    ...mapState(['initLoading']),
    ...mapState('books', ['book', 'imagePath']),
    isEditform () {
      return !!this.$route.params.id
    },
    bookBtn () {
      return this.isEditform ? '책 수정' : '책 추가'
    },
    inputLenValid () {
      return this.newBooks.filter(newBook => !newBook.notlimit).every(newBook => newBook[newBook.name].length <= 100)
    },
    inputReuired () {
      return this.newBooks.filter(newBook => newBook.require && newBook[newBook.name]).length >= 3
    },
    disabledBtn () {
      return !this.inputLenValid || !this.inputReuired || this.initLoading
    }
  },
  created () {
    // 책 수정시, v-model에 기존 데이터 바운딩시켜주기
    if (this.book && this.$route.params.id) {
      this.newBooks.forEach((value) => {
        value[value.name] = this.book[value.name]
      })
      this.contents = this.book.contents
      this.datetime = this.book.datetime
    }
  },
  mounted () {
    //  마운트될 때, 타이틀입력폼 태그에 포커스되도록 구현
    document.querySelector('.titleInput').focus()
  },
  methods: {
    ...mapActions('books', ['createBook', 'updateBook']),
    ...mapMutations('books', ['updateState']),
    onsubmitBook () {
      this.fetchData()
    },
    // 엑스버튼을 클릭할 시, 초기화 시켜주는 함수
    resetInput (e, data) {
      const target = e.target.parentNode.firstChild
      this.newBooks.forEach((value) => {
        value[data] = ''
      })
      target.focus()
    }
  }
}
</script>

<style>
.form_content.addform{padding: 0 150px; margin-bottom: 100px;}
.main_container .form_content .date_area{display: flex; align-items: center;}
.main_container .form_content .date_area label{margin-right: auto;}
.img_container{position: relative;}
@media (max-width:600px) {
  .form_content.addform{padding: 0;}
 .main_container .form_content .date_area{display: block;}
 .main_container .form_content .date_area label{margin: 0 0 5px;}
}
</style>
