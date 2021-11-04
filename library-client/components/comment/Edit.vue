<template>
  <div class="comment_area">
    <button class="round-btn yellow" @click.prevent="onshowComments">
      {{ onStateComment }}
    </button>
    <div v-if="showComment" class="comment">
      <div class="comment_head">
        <h4>댓글 쓰기</h4>
        <LoadingBar v-if="loading" />
        <div v-else>
          <button class="refresh-btn" @click.prevent="fetchData">
            새로고침
          </button>
          댓글 :{{ getCommentPage.commentCount }}
        </div>
      </div>
      <!-- 댓글 작성란 -->
      <FormComment />
      <!-- 댓글 리스트 -->
      <div class="comment_area">
        <div>댓글</div>
        <ul>
          <CommentList v-for="(comment) in getComments" :key="comment.id" :comment="comment" @onRemoveComment="onRemoveComment" />
        </ul>
      </div>
    </div>
    <div ref="trigger" class="trigger">
      <LoadingBar v-if="loading" />
    </div>
    <FormAlert v-if="alert" title="댓글" confirm="삭제" @onagree=" agree" @ondisagree="disagree" />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  data () {
    return {
      showComment: false,
      loading: false,
      page: 1,
      agreeState: false,
      alert: false,
      commendId: ''
    }
  },
  computed: {
    ...mapGetters('comments', ['getComments', 'getCommentPage']),
    onStateComment () {
      return !this.showComment ? '댓글 보기' : '댓글 접기'
    },
    isaddComment () {
      return this.showComment && this.getComments && this.getComments.length > 9 && !this.getCommentPage.end
    }
  },
  mounted () {
    this.onaddComments()
  },
  methods: {
    ...mapActions('comments', ['fetchComments', 'deleteComment']),
    ontoggleComment () {
      this.showComment = !this.showComment
    },
    fetchData () {
      //  댓글 보기 버튼을 클릭할 때 댓글 조회 API 호출
      if (this.showComment) {
        this.loading = true
        //  처음 데이터를 호출하므로 page는 1로 초기화
        this.page = 1
        this.fetchComments({ bookId: this.$route.params.id, init: true })
          .then(() => {
            this.loading = false
          })
      }
    },
    onshowComments () {
      this.ontoggleComment()
      this.fetchData()
    },
    onaddComments () {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (this.isaddComment && entry.isIntersecting) {
            this.loading = true
            this.page++
            this.fetchComments({ bookId: this.$route.params.id, page: this.page })
            // eslint-disable-next-line no-return-assign
              .then(_ => this.loading = false)
          }
        })
      })

      observer.observe(this.$refs.trigger)
    },
    onRemoveComment (id) {
      this.alert = true
      this.commendId = id
    },
    disagree () {
      this.agreeState = false
      this.alert = false
    },
    agree () {
      try {
        // 댓글 삭제
        this.deleteComment({ bookId: this.$route.params.id, commentId: this.commendId })
          .then(() => {
            // 댓글 삭제 후 삭제 알림창 끄기
            this.alert = false
          })
      } catch (error) {
        console.error(error)
      }
    }
  }

}
</script>

<style>
.component-fade-enter-active, .component-fade-leave-active {
  transition: all .5s ease;
}
.component-fade-enter{
  opacity: 0;
  transform: translateY(100px);
}
.refresh-btn{background-color: #fff;}
.comment_head{display: flex; align-items: center;}
.comment_head>div{margin-left: auto; font-weight: bold;}
.comment_area{position: relative; padding: 10px 0 100px;}
.trigger{position: absolute; text-align: center;  left:0; bottom:0; width: 100%; height: 20px;}
</style>
