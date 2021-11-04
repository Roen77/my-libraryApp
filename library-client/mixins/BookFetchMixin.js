import bus from '~/utils/bus'
export default {
  methods: {
    async fetchData () {
      try {
        let data = {}
        const date = this.datetime ? new Date(this.datetime) : new Date()
        this.newBooks.forEach((newBook) => {
          data[newBook.name] = newBook[newBook.name]
        })
        data = { ...data, datetime: date, thumbnail: this.imagePath }
        if (!this.$route.params.id) {
          // 책을 추가할 때
          await this.createBook(data)
            .then((res) => {
              // 라우터 이동
              this.$router.push('/books/1')
              bus.$emit('on:alert', { data: res.data.msg, bgcolor: '#1A237E' })
              setTimeout(() => {
                bus.$emit('off:alert')
              }, 3000)
            })
        } else {
          // 책을 편집할 때
          data.thumbnail = this.imagePath.length ? this.imagePath : this.book.thumbnail
          await this.updateBook({ id: this.$route.params.id, data })
            .then((res) => {
              this.updateState({
                editState: false
              })
              bus.$emit('on:alert', { data: res.data.msg, bgcolor: '#AD1457' })
              setTimeout(() => {
                bus.$emit('off:alert')
              }, 3000)
            })
        }
      } catch (error) {
        console.log(error)
        bus.$emit('on:alert', { data: error.response.data.msg, bgcolor: '#880E4F' })
        setTimeout(() => {
          bus.$emit('off:alert')
        }, 3000)
      }
    }
  }
}
