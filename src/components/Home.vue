<template>
  <el-container id="app">
    <el-header id="header">
      <Header></Header>
    </el-header>
    <el-container id="container">
      <el-aside id="navigation">
        <Navigation></Navigation>
      </el-aside>
      <el-main>
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Navigation from '../components/widgets/Navigation'
import Header from '../components/widgets/Header'
export default {
  name: 'Home',
  components: {
    Navigation,
    Header
  }
}
</script>

<style lang="scss">
body, html {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  a{
    text-decoration: none;
    color: #1C2327;
  }
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* color: #2c3e50; */
  width: 100%;
  height: 100%;
  .el-table--fit {
    color: #1C2327;
    font-size: 15px;
  }

}
#header{
  background: #1C2327;
  height: 50px!important;
}
#navigation{
  background: #373D41;
  height: 100%!important;
  max-width: 250px!important;
}
#container{
  height: calc(100% - 50px);
  font-size: 17px!important;
}
.Element{
  .el-main{
    width: 500px!important;
  }
}
.el-dialog{
  margin-top:50px!important;
  .el-dialog__body{
    padding: 0px!important
  }
}
.Table{
  height: 100%;
  max-height: 100%;
  overflow: auto;
  h3{
    text-align: center;
    margin: 0;
    padding: 20px;
    border-bottom: solid 1px #eee;
    a{
      font-size: 14px;
      font-weight: normal;
    }
  }
}
.el-container{
  padding: 0!important;
  .el-aside, .el-main, .el-header{
    padding: 0!important;
    margin: 0!important;
  }
  .el-aside{
    max-height: 100% !important;
    height: 100%!important;
  }
}
.el-drawer{
  padding: 20px !important;
}
.block {
  flex: 1;
}
.divider{
  width: 1px;
  background: #eee;
}
a{
  &:hover{
    color: #2A88F6!important;
  }
}
</style>
