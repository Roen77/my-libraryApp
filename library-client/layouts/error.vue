<template>
  <div class="err_container">
    <div class="txt">
      <h3 v-if="error.msg" class="err_msg">
        {{ error.msg }}
      </h3>
      <div v-else>
        <p>
          <b class="err_msg">방문하시려는 페이지의 주소가 잘못 입력되었거나,
            변경 혹은 삭제되어 찾을 수 없습니다.</b>
        </p>
        <p>홈으로 이동해주세요</p>
        <NuxtLink class="primary" to="/">
          <span>홈</span>
        </NuxtLink>
      </div>
      <p>{{ error.statusCode }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: ['error']
}
</script>

<style scoped>
.err_container{position: relative; margin-top: 50px; display: flex; align-items: center; justify-content: center; padding: 100px 0; box-sizing: border-box;  border: 1px solid rgb(153, 223, 190); text-align: center; background-image: url(/images/main_bg3.jpg); background-size:360px; background-repeat: no-repeat; background-position: center; line-height: 30px; font-size: 1.2em;}
.err_container .txt{padding: 0 20px; box-sizing: border-box;}
.err_container .err_msg{font-size: 17px;}
</style>
