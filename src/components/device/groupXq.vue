<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/devInfo' }">设备</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/devGroup' }"
        >设备分组</el-breadcrumb-item
      >
      <el-breadcrumb-item>分组详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div style="padding:10px 0">
      <h1 style="text-align:left;font-size:30px;margin:0">
        <i class="el-icon-back back-icon" @click="returnDevGroup()"></i>
        {{ groupInfo.teamName }}
      </h1>
    </div>
    <div style="display:flex;margin-bottom:20px;flex-wrap:wrap">
      <div class="info-tag">
        <label style="color:#888;margin:0 22px">分组id</label>
        <label style="color:#555">{{ groupInfo.id }}</label>
      </div>
      <div class="info-tag">
        <label style="color:#888;margin:0 22px">创建时间</label>
        <label style="color:#555">{{
          getDateString(new Date(groupInfo.createTime))
        }}</label>
      </div>
      <div class="info-tag">
        <label style="color:#888;margin:0 22px">设备数量</label>
        <label style="color:#555">{{ devStatistics.all }}</label>
      </div>
      <div class="info-tag">
        <label style="color:#888;margin:0 22px">烧录数量</label>
        <label style="color:#555">{{ devStatistics.online }}</label>
      </div>
      <div class="info-tag">
        <label style="color:#888;margin:0 22px">在线数量</label>
        <label style="color:#555">{{ devStatistics.online }}</label>
      </div>
    </div>
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="设备列表" name="deviceList">
        <div style="text-align:left;margin-bottom:10px">
          <el-button
            type="primary"
            style="margin-right:20px"
            @click="openAddDev2GroupDialog()"
            >添加设备到分组</el-button
          >
          <el-input
            placeholder="请输入设备名称"
            style="width:350px"
            v-model="searchDevName"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="search(searchDevName)"
            ></el-button>
          </el-input>
        </div>
        <el-table
          :data="groupInfo.deviceVOS"
          height="450"
          max-height="450"
          border
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection"></el-table-column>
          <el-table-column prop="deviceName" label="设备名称"></el-table-column>
          <el-table-column prop="deviceType" label="设备所属产品">
            <template slot-scope="scope">{{
              devTypes[scope.row.deviceType]
            }}</template>
          </el-table-column>
          <el-table-column label="烧录状态"
            ><template slot-scope="scope">{{
              scope.row.onlineState ? "已烧录" : "未烧录"
            }}</template></el-table-column
          >
          <el-table-column prop="online" label="连接状态">
            <template slot-scope="scope">{{
              scope.row.onlineState ? "已连接" : "未连接"
            }}</template>
          </el-table-column>
          <el-table-column prop="onlineTime" label="最后上线时间">
            <template slot-scope="scope">{{
              scope.row.onlineTime == null
                ? "无"
                : getDateString(new Date(scope.row.onlineTime))
            }}</template></el-table-column
          >
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="getDevXq(scope.row)"
                >查看</el-button
              >
              <el-button type="text" @click="deleteDevFromGroup(scope.row)"
                >移出分组</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <el-row style="margin:10px 0;display:flex;align-items:center">
          <el-col style="width:10px;margin:0 25px 0 11px"
            ><el-checkbox
              v-model="checked"
              :disabled="!checked"
              @change="clearSelection()"
            ></el-checkbox
          ></el-col>
          <el-col :span="2"
            ><el-button
              type="primary"
              plain
              :disabled="!checked"
              @click="deleteAllSelection()"
              >移出分组</el-button
            ></el-col
          >
        </el-row>
      </el-tab-pane>
    </el-tabs>
    <el-dialog
      :title="addDev2GroupDialog.title"
      :visible.sync="addDev2GroupDialog.visible"
      width="40%"
    >
      <span style="display:flex;justify-content:center">
        <el-transfer
          :titles="['待选', '已选']"
          v-model="addDev2GroupDialog.value"
          :data="addDev2GroupDialog.data"
          style="text-align:left"
        >
        </el-transfer>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDev2GroupDialog.visible = false">取 消</el-button>
        <el-button type="primary" @click="saveDev2Group()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      groupInfo: {
        name: "",
        id: "",
        create_time: "",
        deviceVOS: [],
      },
      devStatistics: { all: 0, active: 0, online: 0 },
      devicesWithNoGroup: [],
      activeName: "deviceList",
      devTypes: ["灯", "空调", "投影仪"],
      multipleSelection: [],
      checked: false,
      addDev2GroupDialog: {
        title: "添加设备到分组",
        visible: false,
        data: [],
        value: [],
      },
      searchDevName: "",
    };
  },
  methods: {
    getGroupInfo() {
      let app = this;
      axios
        .get("/group/detail", {
          params: {
            groupId: app.groupInfo.id,
          },
        })
        .then(function(res) {
          app.groupInfo = res.data;
          app.getDevStatistics();
        });
    },
    deleteDevFromGroup(row) {
      let app = this;
      let data = { deviceIds: [] };
      data.deviceIds.push(row.id);
      let params = new URLSearchParams();
      Object.getOwnPropertyNames(data).forEach(function(item) {
        params.append(item, data[item]);
      });
      axios.post("/group/delete/from", params).then(function() {
        app.$message({
          type: "success",
          message: "删除成功",
        });
        app.getGroupInfo();
      });
    },
    returnDevGroup() {
      this.$router.push({ path: "/devGroup" });
    },
    deleteAllSelection() {
      let app = this;
      let data = { deviceIds: [] };
      app.multipleSelection.forEach(function(item) {
        data.deviceIds.push(item.id);
      });
      let params = new URLSearchParams();
      Object.getOwnPropertyNames(data).forEach(function(item) {
        params.append(item, data[item]);
      });
      axios.post("/group/delete/from", params).then(function() {
        app.$message({
          type: "success",
          message: "删除成功",
        });
        app.getGroupInfo();
      });
    },
    openAddDev2GroupDialog() {
      this.addDev2GroupDialog.visible = true;
      let app = this;
      axios.get("/group/without").then(function(res) {
        app.addDev2GroupDialog.data = [];
        for (let i = 0; i < res.data.length; i++) {
          app.addDev2GroupDialog.data.push({
            key: res.data[i].id,
            label: res.data[i].deviceName,
          });
        }
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.checked = val.length == 0 ? false : true;
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
    getDevXq(row) {
      this.$router.push({ path: `/devXq/${row.id}` });
    },
    getDevStatistics() {
      this.devStatistics.all = this.groupInfo.deviceVOS.length;
      let online_nums = 0;
      for (let i = 0; i < this.groupInfo.deviceVOS.length; i++) {
        if (this.groupInfo.deviceVOS[i].online == "已连接") {
          online_nums++;
        }
      }
      this.devStatistics.online = online_nums;
    },
    saveDev2Group() {
      let app = this;
      let data = { groupId: "", deviceIds: [] };
      this.addDev2GroupDialog.value.forEach(function(item) {
        data.deviceIds.push(item);
      });
      data.groupId = app.groupInfo.id;
      let params = new URLSearchParams();
      Object.getOwnPropertyNames(data).forEach(function(item) {
        params.append(item, data[item]);
      });
      axios.post("/group/add/to", params).then(function() {
        app.$message({
          type: "success",
          message: "添加成功",
        });
        app.getGroupInfo();
        app.addDev2GroupDialog.visible = false;
      });
    },
  },
  created() {
    this.groupInfo.id = this.$route.params.id;
    this.getGroupInfo();
    this.getDevStatistics();
    this.$emit("getIndex", "/devGroup");
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
.el-table >>> th.is-leaf,
.el-table td {
  background-color: #f4f7fa;
}
.el-table th,
.el-table >>> td {
  padding: 8px 0;
}
.info-tag {
  width: 45%;
  text-align: left;
  margin-bottom: 10px;
}
</style>
