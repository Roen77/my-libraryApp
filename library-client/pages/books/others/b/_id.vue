<template>
  <div>
    <div>
      <BookCardDetail :book="otherBookList" />
      <CommentEdit />
    </div>
  </div>
</template>

<script>
export default {
  async asyncData ({ store, params }) {
    try {
      let otherBookList
      await store.dispatch('books/otherFetchBook', { id: params.id })
        .then((res) => {
          otherBookList = res.data.book
        })
      return { otherBookList }
    } catch (err) {
      console.log(err)
    }
  },
  head () {
    return {
      title: this.otherBookList.title,
      meta: [
        { hid: 'og:url', property: 'og:url', content: `https://library.roen.pe.kr/books/others/b/${this.otherBookList.id}` },
        { hid: 'og:type', property: 'og:type', content: 'website' },
        { hid: 'og:title', property: 'og:title', content: this.otherBookList.title },
        { hid: 'og:description', property: 'og:description', content: this.otherBookList.contents },
        { hid: 'og:image', property: 'og:image', content: this.otherBookList.thumbnail ? `${this.otherBookList.thumbnail}` : 'https://library.roen.pe.kr/images/sample_book.jpg' },
        { hid: 'twitter:site', name: 'twitter:site', content: `https://library.roen.pe.kr/books/b/${this.otherBookList.id}` },
        { hid: 'twitter:title', name: 'twitter:title', content: this.otherBookList.title },
        { hid: 'twitter:description', name: 'twitter:description', content: this.otherBookList.contents },
        { hid: 'twitter:image', name: 'twitter:image', content: this.otherBookList.thumbnail ? `${this.otherBookList.thumbnail}` : 'https://library.roen.pe.kr/images/sample_book.jpg' }
      ]
    }
  }
}
</script>

<style>
</style>
