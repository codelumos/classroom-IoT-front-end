<template>
  <div id="app">
    <el-container>
      <el-header>
        <img src="./assets/title.png" style="height:80px;float:left" />
      </el-header>
      <el-container>
        <el-aside width="250px"
          ><el-row class="tac">
            <el-col :span="24">
              <h5>导航栏</h5>
              <el-menu
                :default-active="currentIndex"
                class="el-menu-vertical"
                router
              >
                <el-submenu index="2">
                  <template slot="title">
                    <i class="el-icon-printer"></i>
                    <span>设备管理</span>
                  </template>
                  <el-menu-item index="/devInfo">设备信息</el-menu-item>
                  <el-menu-item index="/devGroup">设备分组</el-menu-item>
                </el-submenu>
                <el-submenu index="3">
                  <template slot="title"
                    ><i class="el-icon-document"></i>
                    <span>数据分析</span>
                  </template>
                  <el-menu-item index="/analysis">统计分析</el-menu-item>
                </el-submenu>
                <el-submenu index="4">
                  <template slot="title">
                    <i class="el-icon-set-up"></i>
                    <span>规则引擎</span>
                  </template>
                  <el-menu-item index="/rule">规则</el-menu-item>
                </el-submenu>
              </el-menu>
            </el-col>
          </el-row>
        </el-aside>
        <el-main>
          <router-view @getIndex="getCurrentIndex"></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "app",
  data() {
    return {
      currentIndex: "",
    };
  },
  methods: {
    getCurrentIndex(newIndex) {
      let app = this;
      app.currentIndex = newIndex;
    },
  },
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
  width: 80%;
  margin: 0 10%;
}
html,
body {
  height: 100%;
  margin: 0;
}

.el-container {
  height: 100%;
}

.el-header {
  color: #333;
  text-align: center;
  height: 80px !important;
}

.el-aside {
  background-color: #f5f5f5;
  color: #333;
  text-align: center;
  height: 95%;
  border: 1px solid #bdb6b6;
  border-right: none;
}

.el-main {
  border-left: none;
  color: #333;
  text-align: center;
  height: 95%;
  border: 1px solid #bdb6b6;
  border-left: none;
}
.el-menu-vertical li {
  background-color: #f5f5f5;
}
.el-menu-vertical li .is-active {
  color: #75b7ff;
}
</style>
