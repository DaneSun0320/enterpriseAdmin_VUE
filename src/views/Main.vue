<template>
  <el-container id="app">
    <el-header><Header :myPath="$store.getters.getcurrentPath"></Header></el-header>
    <el-container>
      <el-aside width="240px"><Aside></Aside></el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<style lang="scss" >
  #app {
    height: 100vh;
    display: flex;
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    background-color: #f1f7f7;
  }
  .el-header{
    margin: 0;
    width: 100%;
    background-color: #ffffff;
    text-align: center;
  }
  .el-card {
    border-radius: 15px;
  }
  .card-title{
    display: flex;
    text-align: start;
    margin-left: 10px;
    align-items: center;
    font-size: 18px;
    font-weight: bold;
  }
  .el-aside{
    height: 100%;
  }
  .el-main{
    padding: 50px;
  }
  .el-page-header{
    margin-bottom: 20px;
  }
</style>
<script>
import Header from '../components/Header'
import Aside from '../components/Aside'
export default {
  components: { Aside, Header }
}
</script>
