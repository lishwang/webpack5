<template>
  <el-button type="primary">主要按钮</el-button>
  <el-button type="success">错误按钮</el-button>
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
import { ElButton } from 'element-plus'
export default {
  components: { ElButton },
}
</script>

<style scoped>
.title {
  color: pink;
}
</style>