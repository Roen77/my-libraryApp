<template>
  <ul class="hashtags tagList">
    <li v-for="(tag,index) in hashtags" :key="index" class="tag" @mouseenter="onChangeState(tag,index)" @mouseleave="tagNum=''">
      <nuxt-link :to="`/hashtags/1?name=${tag.name}`">
        #{{ tag.name }}
      </nuxt-link>
      <span v-if="showCloseBtn(index)" @click.prevent="onRemoveHashtag(tag.id)"><i class="fas fa-plus-circle"></i></span>
    </li>
  </ul>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  props: {
    hashtags: {
      type: Array,
      required: false
    },
    bookId: {
      type: Number,
      required: false
    },
    userId: {
      type: Number,
      required: false
    }
  },
  data () {
    return {
      tagNum: ''
    }
  },
  computed: {
    ...mapState('user', ['user']),
    ismybook () {
      return this.user.id === this.userId
    }
  },
  methods: {
    ...mapActions('books', ['deleteHashtag']),
    onChangeState (tag) {
      const tagNum = this.hashtags.findIndex(hashtag => hashtag.id === tag.id)
      this.tagNum = tagNum
    },
    showCloseBtn (index) {
      return this.ismybook && this.bookId && index === this.tagNum
    },
    onRemoveHashtag (id) {
      this.deleteHashtag({ bookId: this.bookId, hashtagId: id })
    }
  }

}
</script>

<style>
.hashtags.tagList{box-shadow: none;}
.hashtags{display: flex; flex-wrap: wrap; margin: 5px; box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.281); background-color: #fff;}
.txt .hashtags{ background-image: radial-gradient( circle farthest-corner at 10% 20%,  rgba(234, 249, 249, 0.952) 0.1%, rgba(239, 249, 251, 0.918) 90.1% );}
.hashtags .tag{position: relative; display: flex;  background-color: skyblue; color:#222; border-radius: 20px; align-items: center; justify-content: center;padding: 7px; margin: 0.5%;}
.hashtags .tag span{position: absolute; cursor: pointer; z-index: 10; font-size: 20px; transform: rotate(45deg); right: -20px; top:-7px;}
</style>
