<template>
  <div>
    <div class="bookshelf">
      <h2 class="tagname">
        #{{ $route.query.name }}
      </h2>
      <div class="count">
        {{ total }}
      </div>
      <div v-if="hasBook " class="books">
        <div v-for="book in books" :key="book.id" class="book">
          <BookCard :book="book" />
        </div>
      </div>
      <!-- books -->
      <BookPagination :total-page="totalPage" @pagination="pagination" />
    </div>
  </div>
</template>

<script>
import PaginationFetchMixin from '~/mixins/PaginationFetchMixin'
export default {
  mixins: [PaginationFetchMixin],
  watchQuery: ['name']
}
</script>

<style>
.tagname{display: inline-block; padding: 5px 10px; text-align: center; border-radius: 20px; background-color: skyblue; font-size: 20px;}
</style>
