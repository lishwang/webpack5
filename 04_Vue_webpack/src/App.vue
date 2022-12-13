<template>
  <ul>
    <li>
      <router-link to="/home">home</router-link>
    </li>
    <li>
      <router-link to="/about">about</router-link>
    </li>
  </ul>
  <router-view></router-view>
</template>

<script>
export default {

}
</script>

<style scoped>
.title {
  color: pink;
}
</style>