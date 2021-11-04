<template>
  <div class="home_inner">
    <div class="bg" />
  </div>
</template>

<script>
export default {
  layout: 'home'
}
</script>

<style>
.home_inner{
  padding:100px 30px 30px 30px;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
}
.bg{
  margin: 0 auto;
  border-radius: 30px;
  width: 1400px;
  max-width: 100%;
  position: relative;
  border: 3px solid #ddd;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url(/images/mbg.jpg);
  background-position: center;
  background-repeat: no-repeat;
  background-position: 50% top;
  background-size: cover;
  height: 100%;
}
</style>
