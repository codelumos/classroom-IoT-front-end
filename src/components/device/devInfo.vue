<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/devInfo' }">设备</el-breadcrumb-item>
      <el-breadcrumb-item>设备信息</el-breadcrumb-item>
    </el-breadcrumb>
    <div style="padding:10px 0">
      <h1 style="text-align:left;font-size:30px;margin:0">{{ pageTitle }}</h1>
      <el-row style="display:flex;align-items:center;">
        <el-col :span="4">
          <el-select v-model="currentType" @change="handleDevTypeChange()">
            <el-option label="全部" value="全部"></el-option>
            <el-option
              v-for="(devType, index) in devTypes"
              :key="index"
              :label="devType"
              :value="index"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="2"></el-col>
        <el-col v-for="(stat, index) in devStatistics" :key="index" :span="4"
          ><div style="border-left:1px grey dashed">
            <h4 style="margin:0;color:#8F8F8F;">{{ stat.title }}</h4>
            <b style="font-size:30px;">{{ stat.nums }}</b>
          </div></el-col
        >
      </el-row>
      <el-row style="margin:10px 0px 10px 10px;">
        <el-col :span="3">
          <el-button
            type="primary"
            style="float:left;"
            @click="openAddDevDialog()"
            >添加设备</el-button
          >
        </el-col>
        <el-col :span="10">
          <el-input placeholder="请输入设备名称" v-model="searchDevName">
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="search(searchDevName)"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>

      <el-table
        :data="currentTableData"
        border
        width="100%"
        max-height="550"
        height="550"
        ref="devTable"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column prop="deviceName" label="设备名称">
        </el-table-column>
        <el-table-column label="设备类型" width="200">
          <template slot-scope="scope">
            <span>{{ devTypes[scope.row.deviceType] }}</span>
          </template>
        </el-table-column>
        <el-table-column label="烧录状态" width="170">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{
              scope.row.program == true ? "已烧录" : "未烧录"
            }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="online" label="连接状态" width="170">
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button
              @click.native.prevent="getDevInfo(scope.row)"
              type="text"
            >
              查看
            </el-button>
            <el-button
              @click.native.prevent="deleteRow(scope.$index, currentTableData)"
              type="text"
            >
              删除
            </el-button>
            <el-button
              @click.native.prevent="
                devProgramDialog.visible = true;
                devProgramDialog.title = scope.row.deviceName + '--设备烧录';
              "
              type="text"
            >
              烧录
            </el-button>
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
            >删除</el-button
          ></el-col
        >
        <el-col :span="2"
          ><el-button
            type="primary"
            plain
            :disabled="!checked"
            @click="forbiddenAllSelection()"
            >禁用</el-button
          ></el-col
        >
        <el-col :span="2"
          ><el-button
            type="primary"
            plain
            :disabled="!checked"
            @click="activateAllSelection()"
            >启用</el-button
          ></el-col
        >
      </el-row>
      <el-dialog
        :title="addDevDialog.title"
        :visible.sync="addDevDialog.visible"
        width="30%"
      >
        <span>
          <div
            style="display:flex;flex-direction:column;text-align:right;align-items:center"
          >
            <div
              style="margin-bottom:10px;display:flex;flex-direction:row;align-items:center"
            >
              <div style="width:80px">设备种类：</div>
              <el-select v-model="addDevDialog.devType" style="width:200px">
                <el-option
                  v-for="(devType, index) in devTypes"
                  :key="index"
                  :label="devType"
                  :value="index"
                ></el-option>
              </el-select>
            </div>
            <div style="display:flex;flex-direction:row;align-items:center">
              <div style="width:80px">设备名：</div>
              <el-input
                v-model="addDevDialog.devName"
                placeholder="请输入设备名"
                style="width:200px"
              ></el-input>
            </div>
          </div>
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDevDialog.visible = false">取 消</el-button>
          <el-button type="primary" @click="saveNewDev()">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog
        :title="devProgramDialog.title"
        :visible.sync="devProgramDialog.visible"
        width="30%"
      >
        <span
          ><div
            style="display:flex;flex-direction:row;justify-content:center;align-items:center"
          >
            <div style="width:80px">设备证书：</div>
            <el-input
              v-model="devProgramDialog.credential"
              placeholder="请输入设备证书"
              style="width:300px"
            ></el-input></div
        ></span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="devProgramDialog.visible = false">取 消</el-button>
          <el-button type="primary" @click="devProgram()">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import axios from "axios";

export default {
  data() {
    return {
      pageTitle: "设备",
      currentType: "",
      devTypes: ["灯", "空调", "投影仪"],
      addDevDialog: {
        visible: false,
        devName: "",
        devType: 0,
      },
      currentTabIndex: 0,
      allDevData: [
        {
          id: 0,
          deviceName: "",
          deviceType: 0,
          createTime: "",
          status: "",
          active: true,
          online: "已连接",
          groupId: 0,
        },
      ],
      currentTableData: [],
      multipleSelection: [],
      searchDevName: "",
      checked: false,
      devProgramDialog: {
        title: "设备烧录",
        credential: "",
        visible: false,
        deviceId: 0,
      },
    };
  },
  computed: {
    devStatistics: function() {
      let app = this;
      let result = [];
      result.push({ title: "设备总数", nums: app.currentTableData.length });
      let online_nums = 0;
      for (let i = 0; i < app.currentTableData.length; i++) {
        if (app.currentTableData[i].online == "已连接") {
          online_nums++;
        }
      }
      result.push({ title: "烧录设备", nums: online_nums });
      result.push({ title: "在线设备", nums: online_nums });
      return result;
    },
  },
  methods: {
    openAddDevDialog() {
      let app = this;
      app.addDevDialog.visible = true;
      app.addDevDialog.title = "添加设备";
    },
    saveNewDev() {
      let app = this;
      let data = {
        deviceName: app.addDevDialog.devName,
        deviceType: app.addDevDialog.devType,
      };
      let params = new URLSearchParams();
      Object.getOwnPropertyNames(data).forEach(function(item) {
        params.append(item, data[item]);
      });
      axios.post("/device/add/", params).then(function(res) {
        if (res.data == -1) {
          app.$message({
            type: "error",
            message: "设备名重复，请重新填写！",
          });
        } else {
          app.$message({
            type: "success",
            message: "添加成功",
          });
          app.addDevDialog.visible = false;
          app.getDevData();
          app.handleDevTypeChange();
        }
      });
    },
    handleClick(tab) {
      let app = this;
      app.currentTabIndex = tab.index;
    },
    deleteRow(index, rows) {
      let app = this;
      let row = rows[index];
      let data = { deviceIds: [] };
      data.deviceIds.push(row.id);
      let params = new URLSearchParams();
      Object.getOwnPropertyNames(data).forEach(function(item) {
        params.append(item, data[item]);
      });
      axios.post("/device/delete", params).then(function(res) {
        if (!res.data) {
          app.$message({
            type: "error",
            message: "删除失败！",
          });
        } else {
          app.$message({
            type: "success",
            message: "删除成功",
          });
          app.getDevData();
          app.handleDevTypeChange();
        }
      });
    },
    handleDevTypeChange() {
      let app = this;
      app.currentTableData = [];
      if (app.currentType == "全部") {
        app.currentTableData = JSON.parse(JSON.stringify(app.allDevData));
      } else {
        for (let i = 0; i < app.allDevData.length; i++) {
          if (app.allDevData[i].deviceType == this.currentType) {
            app.currentTableData.push(app.allDevData[i]);
          }
        }
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.checked = val.length == 0 ? false : true;
    },
    clearSelection() {
      this.$refs.devTable.clearSelection();
    },
    getDevInfo(row) {
      this.$router.push({ path: `/devXq/${row.id}` });
    },
    search(name) {
      let app = this;
      app.currentTableData = [];
      for (let i = 0; i < app.allDevData.length; i++) {
        if (app.allDevData[i].device_name.indexOf(name) != -1) {
          app.currentTableData.push(app.allDevData[i]);
        }
      }
    },
    getDevData() {
      let app = this;
      app.allDevData = [];
      axios.get("/device/overview").then(function(res) {
        console.log(res.data)
        for (let i = 0; i < res.data.length; i++) {
          app.allDevData.push(res.data[i]);
          if (res.data[i].onlineState) {
            app.allDevData[i].online = "已连接";
            app.allDevData[i].program = true;
          } else {
            app.allDevData[i].online = "未连接";
            app.allDevData[i].program = false;
          }
        }
        app.currentTableData = JSON.parse(JSON.stringify(app.allDevData));
      });
    },
    deleteAllSelection() {
      let app = this;
      let data = { deviceIds: [] };
      this.multipleSelection.forEach(function(item) {
        data.deviceIds.push(item.id);
      });
      let params = new URLSearchParams();
      Object.getOwnPropertyNames(data).forEach(function(item) {
        params.append(item, data[item]);
      });
      axios.post("/device/delete", params).then(function(res) {
        if (!res.data) {
          app.$message({
            type: "error",
            message: "删除失败！",
          });
        } else {
          app.$message({
            type: "success",
            message: "删除成功",
          });
          app.getDevData();
          app.handleDevTypeChange();
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
    randomString(len) {
      var $chars = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678";
      var pwd = "";
      for (let i = 0; i < len; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * $chars.length));
      }
      return pwd;
    },
    forbiddenAllSelection() {
      for (let i = 0; i < this.multipleSelection.length; i++) {
        this.multipleSelection[i].active = false;
      }
    },
    activateAllSelection() {
      for (let i = 0; i < this.multipleSelection.length; i++) {
        this.multipleSelection[i].active = true;
      }
    },
    initPage() {
      this.getDevData();
      this.currentType = "全部";
    },
    devProgram() {
      let app = this;
      let data = { credential: this.devProgramDialog.credential };
      let params = new URLSearchParams();
      Object.getOwnPropertyNames(data).forEach(function(item) {
        params.append(item, data[item]);
      });
      axios.post("/device/program", params).then(function(res) {
        if (!res.data) {
          app.$message({
            type: "error",
            message: "证书无效！",
          });
        } else {
          app.$message({
            type: "success",
            message: "烧录成功",
          });
          app.devProgramDialog.visible = false;
          app.getDevData();
          app.handleDevTypeChange();
        }
      });
    },
  },
  created() {
    this.initPage();
    this.$emit("/api/getIndex", "/devInfo");
  },
};
</script>
<style scoped>
.el-table >>> th.is-leaf,
.el-table td {
  background-color: #f4f7fa;
}
.el-table th,
.el-table >>> td {
  padding: 8px 0;
}
</style>
