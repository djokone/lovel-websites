<template>
  <div id="admin">
    <el-container style="height:100%">
      <!--<el-header>-->
        <!---->
      <!--</el-header>-->
      <el-container>
        <el-aside width="auto">
          <elSidebarAdmin>
          </elSidebarAdmin>
        </el-aside>
        <el-container>
          <el-header style="height: 60px; z-index: 999; padding: 0;">
            <elTopbarAdmin></elTopbarAdmin>
          </el-header>
          <el-main>
            <div style="padding: 0px 20px">
              <router-view/>
            </div>
          </el-main>
          <!--<el-footer>Footer</el-footer>-->
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>
<script>
  import elSidebarAdmin from '@/Modules/Sidbar/Templates/elSidebarAdmin'
  import elTopbarAdmin from '@/Modules/Sidbar/Templates/elTopbarAdmin'

  /**
   * Usage : `<admin-layout/>`
   */
  export default {
    name: 'admin-layout',
    components: {
      elSidebarAdmin,
      elTopbarAdmin
    },
    created () {
      // firebase.firestore().enablePersistence()
      //   .catch(function (err) {
      //     console.log(err)
      //     if (err.code === 'failed-precondition') {
      //       console.log('failed')
      //     }
      //   })
    }
  }
</script>

<style>
  html, body {
    height: 100%;
  }
  #app {
    height: 100%;
  }
  a {
    color: unset;
    text-decoration: unset;
  }
  a:visited {
    color: unset;
  }
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 100%;
  }
  .el-menu--collapse>.el-menu-item .icomoon {

  }
</style>
<style>
  p, h1, h2, h3, h4, a, .el-table__empty-text, th, td, tr, table, label, input, ul, li, span, div, select, .el-casacader-menu{
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
  }
</style>
