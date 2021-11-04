<template>
  <div class="bookshelf">
    <div class="head">
      <h2>나만의 책장</h2>
    </div>
    <div class="count">
      {{ total }}
    </div>
    <div class="main_menu" @mouseleave="showMenu=false">
      <ul v-if="showMenu" class="sub_menu">
        <li>
          <nuxt-link to="/books/add">
            <i class="fas fa-book-open"></i>
            책 직접 추가
          </nuxt-link>
        </li>
        <li>
          <nuxt-link to="/books/search">
            <i class="fas fa-search"></i>
            책 검색
          </nuxt-link>
        </li>
      </ul>
      <button class="floating_btn" @mouseenter="showMenu=true">
        <i class="fas fa-plus"></i>
      </button>
    </div>
    <!-- books -->
    <div v-if="hasBook">
      <div class="books">
        <div v-for="book in books" :key="book.id" class="book">
          <BookCard :book="book" />
        </div>
      </div>
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
  mixins: [PaginationFetchMixin],
  data () {
    return {
      showMenu: false
    }
  }

}
</script>

<style>
.book{
  position: relative;
}
.trigger button.active{
  display: inline-block;
}
.trigger button{display: none;}
.bookshelf{position: relative;}
.bookshelf .main_menu{position: fixed; bottom:180px; right:5px;  z-index: 50;  min-width: 160px; z-index: 50; text-align: center; z-index: 99999;}
.bookshelf .main_menu .sub_menu{position: relative; padding: 20px; border-radius: 20px; box-shadow: 0 0 5px rgba(0, 0, 0, 0.3); margin-bottom: 20px; background-color: #fff;}
.bookshelf .main_menu .sub_menu li a{display: block; transition: all 0.5s; border-bottom: 1px solid #ddd; padding: 8px 0;}
.bookshelf .main_menu .floating_btn{position: absolute; left:50%; transform: translateX(-50%); padding: 17px;  margin: 0 auto; background-image: linear-gradient( 109.6deg,  rgba(62,161,219,1) 11.2%, rgba(93,52,236,1) 100.2% );  color:#fff;  border-radius: 50%;  font-size: 20px;  transition: all 0.3s ease-in-out; }
.bookshelf .main_menu .floating_btn .fas{transition: all 0.3s ease-in-out; transform: rotate(0);}
@media (max-width:600px) {
 .bookshelf .main_menu {right: -41px;}
 .bookshelf .main_menu .sub_menu{padding: 15px; left:-50px;}
 .bookshelf .main_menu .floating_btn{
   padding: 12px;
 }

}
/* hover */
.bookshelf .main_menu .floating_btn:hover .fas{transform: rotate(135deg);}
.bookshelf .main_menu .sub_menu li:hover a{color:#677eff; border-color: #677eff;}
</style>
