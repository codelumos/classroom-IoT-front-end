<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/devInfo' }">设备</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/devInfo' }"
        >设备信息</el-breadcrumb-item
      >
      <el-breadcrumb-item>设备详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div style="padding:10px 0">
      <h1 style="text-align:left;font-size:30px;margin:0">
        <i class="el-icon-back back-icon" @click="returnDevInfo()"></i>
        {{ deviceXq.deviceName }}
        <el-tag
          :type="deviceXq.onlineState ? 'success' : 'warning'"
          style="vertical-align:middle"
        >
          {{ deviceXq.onlineState ? "已连接" : "未连接" }}
        </el-tag>
      </h1>
    </div>
    <div style="display:flex;margin-bottom:20px;">
      <div style="width:45%;text-align:left">
        <label style="color:#888;margin:0 22px">产品</label>
        <label style="color:#555">{{ devTypes[deviceXq.deviceType] }}</label>
      </div>
      <div style="width:45%;text-align:left">
        <label style="color:#888;margin:0 22px">设备证书</label>
        <label style="color:#555">{{ deviceXq.credential }}</label>
      </div>
    </div>
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="设备信息" name="info">
        <h3 style="text-align:left;margin:10px 0">设备信息</h3>
        <div class="info-table">
          <div class="info-table-block">
            <div class="info-table-key">产品名称</div>
            <div class="info-table-value">
              {{ devTypes[deviceXq.deviceType] }}
            </div>
          </div>
          <div class="info-table-block">
            <div class="info-table-key">设备名称</div>
            <div class="info-table-value">{{ deviceXq.deviceName }}</div>
          </div>
          <div class="info-table-block">
            <div class="info-table-key">实时延迟</div>
            <div class="info-table-value">
              {{ delay
              }}<el-button
                type="text"
                style="padding:0;margin-left:10px"
                @click="getDelay()"
                >测试</el-button
              >
            </div>
          </div>
          <div class="info-table-block">
            <div class="info-table-key">创建时间</div>
            <div class="info-table-value">
              {{ getDateString(new Date(deviceXq.createTime)) }}
            </div>
          </div>
          <div class="info-table-block">
            <div class="info-table-key">烧录状态</div>
            <div class="info-table-value">
              {{ deviceXq.onlineState ? "已烧录" : "未烧录" }}
            </div>
          </div>
          <div class="info-table-block">
            <div class="info-table-key">连接状态</div>
            <div class="info-table-value">
              {{ deviceXq.onlineState ? "已连接" : "未连接" }}
            </div>
          </div>
        </div>
        <div v-if="deviceXq.groupId != 0">
          <h3 style="text-align:left;margin:10px 0">设备分组</h3>
          <div class="info-table">
            <div class="info-table-block">
              <div class="info-table-key">
                分组id
              </div>
              <div class="info-table-value">{{ groupInfo.id }}</div>
            </div>
            <div class="info-table-block">
              <div class="info-table-key">
                分组名称
              </div>
              <div class="info-table-value">{{ groupInfo.name }}</div>
            </div>
            <div class="info-table-block">
              <div class="info-table-key">
                创建时间
              </div>
              <div class="info-table-value">{{ groupInfo.createTime }}</div>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="设备影子" name="shadow" style="text-align:left">
        <h3 style="text-align:left;margin:10px 0">设备影子</h3>
        <div>
          <textarea
            v-model="deviceXq.status"
            disabled
            style="width:100%;height:300px"
          ></textarea>
        </div>
      </el-tab-pane>
      <el-tab-pane label="设备日志" name="log">
        <h3 style="text-align:left;margin:10px 0">设备日志</h3>
      </el-tab-pane>
      <el-tab-pane label="在线调试" name="debug">
        <h3 style="text-align:left;margin:10px 0">在线调试</h3>

        <div v-if="deviceXq.deviceType == 0">
          <div
            class="info-table-block"
            style="width:70%;border-left:1px solid #ecedee"
          >
            <div class="info-table-key">运行状态</div>
            <div class="info-table-value" style="text-align:left">
              <label
                :style="'color:' + (devDebug.openState ? '#A6A9AD' : '#F78989')"
                >已关闭</label
              >
              <el-switch
                v-model="devDebug.openState"
                active-color="#13ce66"
                inactive-color="#ff4949"
                style="margin:0 10px"
              >
              </el-switch>
              <label
                :style="
                  'color:' + (!devDebug.openState ? '#A6A9AD' : '#84CE61')
                "
                >已开启</label
              >
            </div>
          </div>
          <div
            class="info-table-block"
            style="width:70%;border-left:1px solid #ecedee"
          >
            <div class="info-table-key">感光度</div>
            <div class="info-table-value" style="text-align:left;">
              <el-slider
                style="margin:0 10px"
                v-model="devDebug.lampSense"
                :step="1"
                :max="10"
                show-stops
                show-input
              >
              </el-slider>
            </div>
          </div>
          <div
            class="info-table-block"
            style="width:70%;border-left:1px solid #ecedee;"
          >
            <div class="info-table-key">亮度</div>
            <div class="info-table-value" style="text-align:left;">
              <el-slider
                style="margin:0 10px"
                v-model="devDebug.brightness"
                :step="1"
                :max="10"
                show-stops
                show-input
              >
              </el-slider>
            </div>
          </div>
        </div>
        <div v-else-if="deviceXq.deviceType == 1">
          <div
            class="info-table-block"
            style="width:70%;border-left:1px solid #ecedee"
          >
            <div class="info-table-key">运行状态</div>
            <div class="info-table-value" style="text-align:left">
              <label
                :style="'color:' + (devDebug.openState ? '#A6A9AD' : '#F78989')"
                >已关闭</label
              >
              <el-switch
                v-model="devDebug.openState"
                active-color="#13ce66"
                inactive-color="#ff4949"
                style="margin:0 10px"
              >
              </el-switch>
              <label
                :style="
                  'color:' + (!devDebug.openState ? '#A6A9AD' : '#84CE61')
                "
                >已开启</label
              >
            </div>
          </div>
          <div
            class="info-table-block"
            style="width:70%;border-left:1px solid #ecedee"
          >
            <div class="info-table-key">档位</div>
            <div class="info-table-value" style="text-align:left;">
              <el-slider
                style="margin:0 10px"
                v-model="devDebug.gear"
                :step="1"
                :max="3"
                show-stops
                show-input
              >
              </el-slider>
            </div>
          </div>
          <div
            class="info-table-block"
            style="width:70%;border-left:1px solid #ecedee;border-bottom:1px solid #ecedee"
          >
            <div class="info-table-key">温度(℃)</div>
            <div class="info-table-value" style="text-align:left;">
              <el-slider
                style="margin:0 10px"
                v-model="devDebug.brightness"
                :step="1"
                :max="50"
                :min="-30"
                show-stops
                show-input
              >
              </el-slider>
            </div>
          </div>
          <div
            class="info-table-block"
            style="width:70%;border-left:1px solid #ecedee;border-bottom:1px solid #ecedee"
          >
            <div class="info-table-key">模式</div>
            <div class="info-table-value" style="text-align:left;">
              <el-radio v-model="devDebug.pattern" :label="0">无</el-radio>
              <el-radio v-model="devDebug.pattern" :label="1">制冷</el-radio>
              <el-radio v-model="devDebug.pattern" :label="2">制热</el-radio>
            </div>
          </div>
        </div>
        <div v-else>
          <div
            class="info-table-block"
            style="width:70%;border-left:1px solid #ecedee;border-bottom:1px solid #ecedee"
          >
            <div class="info-table-key">运行状态</div>
            <div class="info-table-value" style="text-align:left">
              <label
                :style="'color:' + (devDebug.openState ? '#A6A9AD' : '#F78989')"
                >已关闭</label
              >
              <el-switch
                v-model="devDebug.openState"
                active-color="#13ce66"
                inactive-color="#ff4949"
                style="margin:0 10px"
              >
              </el-switch>
              <label
                :style="
                  'color:' + (!devDebug.openState ? '#A6A9AD' : '#84CE61')
                "
                >已开启</label
              >
            </div>
          </div>
        </div>
        <div style="width:75%;margin-top:20px;">
          <el-button type="primary" @click="refresh()">恢复初始状态</el-button>
          <el-button type="primary" @click="debug()">调试</el-button>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      id: 0,
      deviceXq: {
        deviceName: "空调123",
        id: 0,
        deviceType: 1,
        approve: "TVIFlBtDAGFv0s9jQWOE",
        createTime: "2021/04/15 15:00:41",
        activeTime: "16小时46分5秒",
        online: "已连接",
        status: "",
      },
      delay: "",
      devTypes: ["灯", "空调", "投影仪"],
      activeName: "info",
      groupInfo: {
        id: 1,
        name: "分组1",
        createTime: "2021/04/15 15:00:41",
      },
      property2name: {
        openState: "运行状态",
        lampSense: "感光度",
        brightness: "亮度",
        gear: "档位",
        temperature: "室内温度",
        pattern: "模式",
      },
      devDebug: {
        openState: false,
        lampSense: 0,
        brightness: 0,
        gear: 0,
        temperature: 0,
        pattern: 0,
      },
    };
  },
  methods: {
    returnDevInfo() {
      this.$router.push({ path: "/devInfo" });
    },
    getDelay() {
      this.delay = "60ms";
    },
    getDevXq() {
      let app = this;
      axios
        .get("/device/detail", { params: { deviceId: app.id } })
        .then(function(res) {
          app.deviceXq = res.data;
          console.log(res.data)
          app.devDebug = JSON.parse(res.data.status).state;
          app.devDebug = JSON.parse(app.devDebug);
          if (app.devDebug.openState == 1) {
            app.devDebug.openState = true;
          } else {
            app.devDebug.openState = false;
          }
        });
    },
    getDateString(date) {
      return (
        date.getFullYear() +
        "-" +
        (date.getMonth() + 1) +
        "-" +
        date.getDate() +
        " " +
        date.getHours() +
        ":" +
        date.getMinutes() +
        ":" +
        date.getSeconds()
      );
    },
    refresh() {},
    debug() {
      let app = this;
      let data = {
        id: app.id,
        deviceType: this.deviceXq.deviceType,
        openState: app.devDebug.openState ? 1 : 0,
        lampSense: app.devDebug.lampSense,
        brightness: app.devDebug.brightness,
        gear: app.devDebug.gear,
        temperature: app.devDebug.temperature,
        pattern: app.devDebug.pattern,
      };
      axios.post("/device/test", data).then(function() {
        app.$message({
          type: "success",
          message: "调试成功",
        });
      });
    },
  },
  created() {
    this.id = this.$route.params.id;
    this.getDevXq();
    this.$emit("getIndex", "/devInfo");
  },
};
</script>
<style scoped>
.back-icon {
  cursor: pointer;
}
.back-icon:hover {
  color: #66b1ff;
}
.info-table-key {
  background-color: #fbfbfc;
  width: 30%;
  padding: 14px 10px;
  color: #73777a;
}
.info-table-value {
  width: 70%;
  padding: 14px 12px;
  border-left: 1px solid #ecedee;
  border-right: 1px solid #ecedee;
}
.info-table-block {
  width: 33%;
  display: flex;
  border-top: 1px solid #ecedee;
}
.info-table {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}
.info-table > .info-table-block:nth-child(3n + 1) {
  border-left: 1px solid #ecedee;
}
.info-table > .info-table-block:nth-last-child(-n + 3) {
  border-bottom: 1px solid #ecedee;
}
.last-update-time {
  background-color: rgb(249, 249, 249);
  line-height: 52px;
  font-weight: 700;
  color: #373d41;
  text-indent: 16px;
  text-align: left;
}

.el-tab-pane {
  height: 550px;
}
</style>
