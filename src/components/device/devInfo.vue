<template>
  <div style="padding:20px 60px">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane
        v-for="(devInfo, index) in devInfos"
        :key="index"
        :label="devInfo.label"
        :name="devInfo.name"
      >
        <el-table
          :data="devInfo.tableData"
          border
          width="100%"
          max-height="600"
          height="600"
        >
          <el-table-column prop="name" label="设备名" width="150">
          </el-table-column>
          <el-table-column prop="isOnline" label="是否在线" width="120">
          </el-table-column>
          <el-table-column prop="certification" label="设备证书">
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <el-button
                @click.native.prevent="
                  deleteRow(scope.$index, devInfo.tableData)
                "
                type="text"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          type="primary"
          style="float:left;margin-top:20px;margin-left:30px"
          @click="openAddDevDialog()"
          >添加设备</el-button
        >
      </el-tab-pane>
    </el-tabs>
    <el-dialog
      :title="addDevDialog.title"
      :visible.sync="addDevDialog.visible"
      width="30%"
    >
      <span>
        <label style="width:40px">设备名：</label>
        <el-input
          v-model="addDevDialog.devName"
          placeholder="请输入设备名"
          style="width:200px"
        ></el-input>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDevDialog.visible = false">取 消</el-button>
        <el-button type="primary" @click="saveNewDev()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      activeName: "",
      devInfos: [
        {
          label: "灯",
          name: "lamp",
          tableData: [],
        },
        {
          label: "空调",
          name: "airConditioning",
          tableData: [],
        },
        {
          label: "投影仪",
          name: "projector",
          tableData: [],
        },
      ],
      addDevDialog: {
        visible: false,
        title: "",
        devName: "",
      },
      currentTabIndex: 0,
    };
  },
  methods: {
    openAddDevDialog() {
      let app = this;
      app.addDevDialog.visible = true;
      app.addDevDialog.title =
        "添加" + app.devInfos[app.currentTabIndex].label + "类设备";
    },
    saveNewDev() {
      let app = this;
      app.addDevDialog.visible = false;
      app.devInfos[app.currentTabIndex].tableData.push({
        name: app.addDevDialog.devName,
        isOnline: "是",
        certification: this.randomString(32),
      });
    },
    handleClick(tab) {
      let app = this;
      app.currentTabIndex = tab.index;
    },
    deleteRow(index, rows) {
      rows.splice(index, 1);
    },
    randomString(len) {
      let $chars = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678";
      let maxPos = $chars.length;
      let res = "";
      for (let i = 0; i < len; i++) {
        res += $chars.charAt(Math.floor(Math.random() * maxPos));
      }
      return res;
    },
  },
  created() {
    let app = this;
    app.activeName = app.devInfos[0].name;
    app.currentTabIndex = 0;
    app.$emit("getIndex", "/devInfo");
  },
};
</script>
<style scoped></style>
