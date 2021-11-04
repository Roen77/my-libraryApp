<template>
  <div class="bookshelf">
    <div class="head other_books">
      <h2>다른사람의 책장</h2>
    </div>
    <div class="count">
      {{ total }}
    </div>
    <div v-if="hasBook">
      <div class="books">
        <div v-for="book in books" :key="book.id" class="book">
          <BookCard :book="book" />
        </div>
      </div>
      <!-- books -->
      <BookPagination :total-page="totalPage" @pagination="pagination" />
    </div>
    <div v-else>
      <BookEmpty />
    </div>
  </div>
</template>

<script>
import PaginationFetchMixin from '~/mixins/PaginationFetchMixin'
export default {
  mixins: [PaginationFetchMixin]

}
</script>
