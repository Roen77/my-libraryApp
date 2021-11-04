<template>
  <div>
    <div class="file_container">
      <!-- 로딩 -->
      <LoadingBar v-if="initLoading" position />
      <div class="txt">
        <label for="fileinput"><span class="round-btn yellow"><i class="far fa-file-image" />{{ imageTitle }}</span></label>
        <input id="fileinput" ref="file" style="display:none" type="file" @change="onChangeImage">
      </div>
      <!-- 이미지 사진 보여주기 -->
      <div class="photos">
        <template v-if="!showThumbnail">
          <div class="images" :class="{'imgErr':hasErr}">
            <img :src="hasImagePath" alt="썸네일 이미지">
          </div>
        </template>
        <template v-else>
          <div class="images" :class="{'imgErr':hasErr}">
            <img v-if="hasThunbnail" :src="thumbnail" alt="썸네일 이미지">
            <img v-else :src="hasImagePath" alt="썸네일 이미지">
          </div>
        </template>
      </div>
    </div>
    <div class="err">
      {{ imageErr }}
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
export default {
  props: {
    imageTitle: {
      type: String,
      required: true
    },
    thumbnail: {
      type: String,
      required: false
    },
    editProfile: {
      type: Boolean,
      required: false
    },
    showThumbnail: {
      type: Boolean,
      required: false
    }
  },
  data () {
    return {
      selectedFile: ''
    }
  },
  computed: {
    ...mapState(['initLoading']),
    ...mapState('books', ['imageErr', 'imagePath']),
    hasImage () {
      return !!this.imagePath
    },
    hasThunbnail () {
      return this.thumbnail && !this.hasImage
    },
    hasImagePath () {
      if (this.hasImage) { return this.imagePath } else if (this.editProfile) { return '/images/user3.png' } else { return '/images/sample_book.jpg' }
    },
    hasErr () {
      return !!this.imageErr
    }
  },
  created () {
    // 이미지 초기화
    if (this.hasImage) {
      this.updateState({
        imagePath: ''
      })
    }
    // 이미지 에러메세지 초기화
    if (this.imageErr) {
      this.updateState({
        imageErr: ''
      })
    }
  },
  methods: {
    ...mapMutations('books', ['updateState']),
    ...mapActions('books', ['uploadImg']),
    // 이미지 미리보기 업로드
    onChangeImage (e) {
      const imageFormData = new FormData()
      this.selectedFile = e.target.files[0]
      const maxSize = 1024 * 1024
      const imageType = /^image/.test(this.selectedFile && this.selectedFile.type)
      if (!imageType) {
        this.selectedFile = ''
        this.updateState({ imageErr: '이미지 타입만 업로드해주세요.' })
        return
      }
      if (this.selectedFile.size > maxSize) {
        this.selectedFile = ''
        this.updateState({ imageErr: '용량을 초과하였습니다. 1mb 이하로 업로드해주세요.' })
        return
      }
      imageFormData.append('photo', this.selectedFile)
      this.uploadImg(imageFormData)
        .then(() => this.updateState({ imageErr: '' }))
    }
  }

}
</script>

<style>

</style>
