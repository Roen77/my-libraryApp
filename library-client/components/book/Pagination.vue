<template>
  <div v-if="showPage" class="pagination_inner">
    <BPagination
      v-model="getCurrentPage"
      :total-rows="rows"
      :per-page="perPage"
      first-number
      @change="pageClick"
    />
  </div>
</template>

<script>
import { BPagination } from 'bootstrap-vue'
import { mapState } from 'vuex'
export default {
  components: { BPagination },
  // 전체페이지
  props: {
    totalPage: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      perPage: 1,
      // 현재 페이지
      getCurrentPage: 1
    }
  },
  computed: {
    ...mapState('books', ['books', 'currentPage']),
    // 전체 페이지의 수가 1페이지면 페이지네이션을 보여주지 않고, 2페이지 이상일 경우에만 페이지네이션을 보여줍니다.
    showPage () {
      return this.books && this.totalPage > 1
    },
    // 전체 페이지
    rows () {
      return this.totalPage
    }
  },
  watch: {
    $route: {
      handler (to) {
        const page = parseInt(to.params.page, 10)
        // 현재 페이지 활성화
        if (this.currentPage === page) {
          this.getCurrentPage = page
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    pageClick (page) {
      this.$emit('pagination', page)
    }
  }
}
</script>

<style>
.pagination_inner{position: relative; display: flex; justify-content: center; align-items: center; margin-top: 50px; z-index: 200;}
.page-item.disabled .page-link{ align-items: center; background-color: #ddd;}
@media (max-width:360px) {
  .page-item{width: 27px; height: 27px;}
}
</style>
