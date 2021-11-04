<template>
  <form class="search_form" @submit.prevent="$emit('searchBook')">
    <div class="main_select" @mouseenter="selected=!selected" @mouseleave="selected=false">
      <div>
        <p>{{ selectedOption }}<i class="fas fa-chevron-down"></i></p>
      </div>
      <!-- 옵션 리스트 -->
      <ul v-if="selected" class="custom_select">
        <li v-for="(option,index) in options" :key="index" @click="changeSelect(option)">
          {{ option }}
        </li>
      </ul>
    </div>
    <!-- 입력 -->
    <input ref="searchInput" :value="value" type="text" placeholder="검색" @input="$emit('input',$event.target.value)">
    <!-- 버튼 -->
    <button type="submit">
      <i class="fas fa-search"></i>
    </button>
  </form>
</template>

<script>
export default {
  props: {
    options: {
      type: Array,
      required: true
    },
    value: {
      type: String || Number,
      required: false
    }
  },
  data () {
    return {
      selected: false,
      selectedOption: this.options[0]
    }
  },
  methods: {
    changeSelect (option) {
      this.selectedOption = option
      this.selected = false
      this.$refs.searchInput.focus()
      this.$emit('selectedOption', option)
    }
  }
}
</script>

<style>
.search_book{position: relative; margin: 25px 0;}
.search_book .addbtn{position: absolute; right: 7px; bottom:7px;}
.fadeSlide-enter-active {
    transition: all .3s ease;
  }
  /* search_form 공통요소 */
.search_form{position: relative; display: flex; width: 100%; margin: 0 auto; border: 2px solid #677eff;}
.search_form .main_select{position: absolute; left:0; top:0; height: 50px; line-height: 50px; text-align: center; background-color: #fff; border-right: 1px solid #677eff; width: 100px; cursor: pointer; z-index: 30;}
.search_form .main_select .fas{margin-left: 5px; font-size: 13px; }
.search_form .custom_select{color:#222;  border: 1px solid #ddd; border-radius: 10px; z-index: 100; background-color: rgb(255, 255, 255);}
.search_form .custom_select li{line-height: 40px; cursor: pointer; transition: all 0.5s;}
.search_form input{ width: 100%; padding:15px 15px 15px 120px; box-sizing: border-box;}
.search_form  button{width: 100px; background-color: #677eff; transition: all 0.5s;}
.search_form  button .fas{font-size: 20px;}
.search_form  button:hover{background-color:#4680ff; color:#fff;}
.search_form .custom_select li:hover{background-color: #3b5999; color:#fff;}

.fadeSlide-leave-active {
  transition: all .5s ease-in-out;
}
.fadeSlide-enter, .fadeSlide-leave-to{
  transform:translateY(100px);
  opacity: 0;
}
.more-btn{width: 100%;}
@media (max-width:900px) {
.search_form{width: 100%;}
.search_form .main_select{width: 65px; font-size: 14px; height: 42px; line-height: 42px;}
.search_form input{padding: 11px 11px 11px 80px;}
.search_form button{width: 60px;}
}
</style>
