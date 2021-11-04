<template>
  <div class="container home">
    <IeCheck />
    <AppHeader />
    <main class="home_main">
      <Nuxt />
    </main>
  </div>
</template>

<style scoped>
main.home_main{position: fixed; left:0; top:0; width: 100%; height: 100%;}
</style>
