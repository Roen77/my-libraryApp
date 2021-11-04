export const state = () => ({
  // 댓글
  comments: [],
  // 댓글 정보
  commentPage: {
    commentCount: 0,
    end: false
  }
})
export const getters = {
  getComments (state) {
    return state.comments
  },
  getCommentPage (state) {
    return state.commentPage
  }
}
export const mutations = {
  // comment
  loadComments (state, commentData) {
    const { data, init } = commentData
    // 처음 데이터를 불러올 때 배열에 저장합니다.
    if (init) {
      state.comments = [...data.comments]
    } else {
    // 처음이 아니라면 배열에 누적시켜 데이터를 보여줍니다.
      data.comments.forEach((comment) => {
        state.comments = [...state.comments, comment]
      })
    }
    // 댓글을 10개씩 호출했을 때, 더이상 호출할 댓글이 남아있지않다면, 호출하지 않기위해 데이터를 저장합니다.
    state.commentPage.end = data.end
    // 댓글의 갯수를 보여주기위해 댓글의 갯수 데이터를 저장합니다.
    state.commentPage.commentCount = data.commentCount
  },
  // 댓글 추가
  createComment (state, comment) {
    state.comments = [comment, ...state.comments]
    // 댓글 갯수 증가
    state.commentPage.commentCount++
  },
  // 댓글 삭제
  removeComment (state, id) {
    state.comments = state.comments.filter(comment => comment.id !== id)
    state.commentPage.commentCount--
  },
  // 댓글  초기화
  resetComment (state) {
    state.comments = []
  }
}
export const actions = {
  // 댓글가져오기
  async fetchComments ({ commit, state }, comments) {
    try {
      let res
      // 처음으로 댓글보기 버튼을 클릭했을 때,
      if (comments.init) {
        // 삭제시 다시 10개 댓글 가져오도록 하기(단 총 댓글갯수가 10개 미만이면 굳이 가져올 필요없음)
        if (comments.removeState && state.commentPage.commentCount < 10) { return }
        commit('resetComment')
        res = await this.$axios.get(`books/${comments.bookId}/comments?limit=10`)
      // 처음이 아닌 다음 댓글을 가져올 때,
      } else {
        const lastComment = state.comments && state.comments[state.comments.length - 1]
        res = await this.$axios.get(`books/${comments.bookId}/comments?lastId=${lastComment && lastComment.id}&limit=10&page=${comments.page}`)
      }
      commit('loadComments', { data: res.data, init: comments.init })
      return res
    } catch (error) {
      console.error(error)
    }
  },
  // 댓글 추가
  async createComment ({ commit }, { bookId, comments, rating }) {
    try {
      const res = await this.$axios.post(`books/${bookId}/comment`, { comments, rating: parseInt(rating, 10) })
      commit('createComment', res.data.comment)
      return res
    } catch (error) {
      console.error(error)
    }
  },
  // 댓글 삭제
  async deleteComment ({ commit, dispatch, state }, comment) {
    try {
      const res = await this.$axios.delete(`books/${comment.bookId}/comment/${comment.commentId}`)
      commit('removeComment', comment.commentId)
      if (state.comments.length < 10) {
        dispatch('fetchComments', { bookId: comment.bookId, init: true, removeState: true })
      }
      return res
    } catch (error) {
      console.error(error)
    }
  }
}
