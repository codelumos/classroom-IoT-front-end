<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/devInfo' }">设备管理</el-breadcrumb-item>
      <el-breadcrumb-item>设备分组</el-breadcrumb-item>
    </el-breadcrumb>
    <div style="padding:10px 0;text-align:left">
      <h1 style="text-align:left;font-size:30px;margin:0 0 10px 0">
        {{ pageTitle }}
      </h1>
      <div style="margin-bottom:10px">
        <el-button
            type="primary"
            @click="addGroupDialog.visible = true"
        >
          添加分组
        </el-button>
        <el-input
            v-model="searchGroupWord"
            placeholder="请输入分组名称"
            style="width:350px;margin-left:20px"
        >
          <el-button
              slot="append"
              icon="el-icon-search"
              @click="search(searchGroupWord)"
          ></el-button
          >
        </el-input>
      </div>
      <el-table
        :data="groupData"
        max-height="550"
        height="550"
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column prop="id" label="组ID"></el-table-column>
        <el-table-column prop="groupName" label="分组名称"></el-table-column>
        <el-table-column prop="devNums" label="设备数量"></el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="getGroupInfo(scope.row)"
              >查看</el-button
            >
            <el-button type="text" @click="deleteGroup(scope.row)"
              >删除</el-button
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
            >删除</el-button
          ></el-col
        >
      </el-row>
    </div>
    <el-dialog
      :title="addGroupDialog.title"
      :visible.sync="addGroupDialog.visible"
      width="30%"
    >
      <span>
        <div
          style="display:flex;flex-direction:column;text-align:right;align-items:center"
        >
          <div style="display:flex;flex-direction:row;align-items:center">
            <div style="width:80px">分组名称：</div>
            <el-input
              v-model="addGroupDialog.groupName"
              placeholder="请输入分组名称"
              style="width:200px"
            ></el-input>
          </div>
        </div>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addGroupDialog.visible = false">取 消</el-button>
        <el-button type="primary" @click="saveNewGroup()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      pageTitle: "分组",
      searchGroupWord: "",
      groupData: [{ name: "", id: "", createTime: "", devNums: 0 }],
      checked: false,
      multipleSelection: [],
      addGroupDialog: {
        visible: false,
        title: "添加分组",
        groupName: "",
      },
    };
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.checked = val.length == 0 ? false : true;
    },
    getGroupInfo(row) {
      this.$router.push({path: `/groupDetail/${row.id}`});
    },
    openAddGroupDialog() {
      this.addGroupDialog.visible = true;
    },
    getAllGroup() {
      let app = this;
      app.groupData = [];
      axios.get("/group/overview").then(function(res) {
        app.groupData = res.data;
        for (let i = 0; i < res.data.length; i++) {
          app.groupData[i].devNums = res.data[i].deviceVOS.length;
          app.groupData[i].createTime = app.getDateString(
            new Date(res.data[i].createTime)
          );
        }
      });
    },
    saveNewGroup() {
      let app = this;
      let data = { groupName: app.addGroupDialog.groupName };
      let params = new URLSearchParams();
      Object.getOwnPropertyNames(data).forEach(function(item) {
        params.append(item, data[item]);
      });
      axios.post("/group/add", params).then(function() {
        app.addGroupDialog.visible = false;
        app.$message({
          type: "success",
          message: "添加分组成功",
        });
        app.getAllGroup();
      });
    },
    deleteGroup(row) {
      let app = this;
      let data = { groupIds: [] };
      data.groupIds.push(row.id);
      let params = new URLSearchParams();
      Object.getOwnPropertyNames(data).forEach(function(item) {
        params.append(item, data[item]);
      });
      axios.post("/group/delete", params).then(function(res) {
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
          app.getAllGroup();
        }
      });
    },
    deleteAllSelection() {
      let app = this;
      let data = { groupIds: [] };
      this.multipleSelection.forEach(function(item) {
        data.groupIds.push(item.id);
      });
      let params = new URLSearchParams();
      Object.getOwnPropertyNames(data).forEach(function(item) {
        params.append(item, data[item]);
      });
      axios.post("/group/delete", params).then(function(res) {
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
          app.getAllGroup();
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
  },
  created() {
    this.getAllGroup();
    this.$emit("getIndex", "/devGroup");
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
