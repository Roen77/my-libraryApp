<template>
  <div class="hashtag_form">
    <form @submit.prevent="onaddHashtag">
      <div class="text">
        <input v-model="hashtag" placeholder="ex)#추천#에세이#소설.." type="text">
      </div>
      <div>
        <button class="round-btn fill hash_htn" type="submit" :disabled=" disabledHashtag">
          추가
        </button>
        <p v-if="currentHashtagsLen || !ishashtagLen" class="err">
          {{ hashtagErrMsg }}
        </p>
        <p v-if="hashtagchk" class="err">
          추가할 태그에 #을 붙여주세요.
        </p>
      </div>
    </form>
    <ul v-if="!invalidHashtag" class="hashtags">
      <li v-for="(tag,index) in newtagList " :key="index" class="tag">
        {{ tag }}
      </li>
    </ul>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  props: {
    hashtags: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      hashtag: '',
      limit: 5
    }
  },
  computed: {
    ishashtags () {
      const tags = new Set(this.hashtag.match(/#[^\s#]+/g))
      return [...tags]
    },
    hashtagchk () {
      return this.ishashtags && !this.ishashtags.length
    },
    // 해시태그 유효성 검사
    invalidHashtag () {
      return ((this.hashtags && this.hashtags.length) || 0) + ((this.newtagList && this.newtagList.length) || 0) > this.limit
    },
    // 추가할 새로운 해시태그 리스트
    newtagList () {
      if (!this.hashtag) { return }
      const tagnames = []
      const newtagnames = []
      this.hashtags.forEach((tag) => {
        tagnames.push(tag.name)
      })
      const news = (this.ishashtags || []).map((tag) => {
        return String(tag).slice(1).toLowerCase()
      })
      news.forEach((newtag) => {
        if (!tagnames.includes(newtag)) {
          newtagnames.push(newtag)
        }
      })
      return newtagnames
    },
    newtagChk () {
      return this.newtagList && this.newtagList.length > 0
    },
    // 기존 해시태그 갯수 확인
    currentHashtagsLen () {
      return this.hashtags.length >= this.limit || this.invalidHashtag
    },
    // 해시태그 글자 길이 확인
    ishashtagLen () {
      if (!this.newtagList) { return }
      return this.newtagList.every(value => value.length < 11)
    },
    hashtagErrMsg () {
      if (!this.hashtag) { return }
      if (this.currentHashtagsLen) { return '해시태그는 최대 5개까지 추가 가능합니다.' }
      if (!this.ishashtagLen) { return '해시태그는 10자 이내로 작성해주세요' }
      return ''
    },
    disabledHashtag () {
      return this.invalidHashtag || !this.hashtag || this.currentHashtagsLen || !this.ishashtagLen || !this.newtagChk
    }
  },
  methods: {
    ...mapActions('books', ['createHashtag']),
    onaddHashtag () {
      if (this.newtagChk) {
        this.createHashtag({ bookId: this.$route.params.id, hashtags: this.newtagList })
        this.resetHashtag()
      }
    },
    resetHashtag () {
      this.hashtag = ''
    }
  }

}
</script>

<style>
.hashtag_form{position: absolute; z-index: 300;  right: 0; top:100%; width:300px;}
.hashtag_form form div.text{width: 70%; }
.hashtag_form input{width: 100%; height: 40px; padding: 5px;  border: 1px solid #ddd; box-shadow: 0 0 5px rgba(0, 0, 0, 0.2); box-sizing: border-box;}
.hashtag_form .hash_htn{position: absolute; right:0; top:0; padding: 0; border-radius: 0; line-height: 40px; width: 30%;height: 40px;}
@media (max-width:600px) {
.hashtag_form{position: relative; width: 100%;}
}
</style>
