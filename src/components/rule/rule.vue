<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/rule' }">规则引擎</el-breadcrumb-item>
      <el-breadcrumb-item>规则列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div style="padding:10px 0;text-align:left">
      <h1 style="text-align:left;font-size:30px;margin:0 0 10px 0">
        {{ pageTitle }}
      </h1>
      <div style="margin-bottom:10px">
        <el-button
            type="primary"
        >
          添加规则
        </el-button>
        <el-input
            v-model="ruleKeyword"
            placeholder="请输入规则名称"
            style="width:350px;margin-left:20px"
        >
          <el-button
              slot="append"
              icon="el-icon-search"
              @click="search()"
          >
          </el-button>
        </el-input>
      </div>
      <el-table
          ref="ruleTable"
          :data="ruleData"
          border
          height="550"
          max-height="550"
          @selection-change="handleSelectionChange"
      >
        <el-table-column prop="name" label="规则名称" width="120"></el-table-column>
        <el-table-column prop="description" label="规则描述" width="220"></el-table-column>
        <el-table-column label="创建时间" width="160">
          <template slot-scope="scope">
            {{ getDateString(new Date(scope.row.createTime)) }}
          </template>
        </el-table-column>
        <el-table-column label="更新时间" width="160">
          <template slot-scope="scope">
            {{ getDateString(new Date(scope.row.updateTime)) }}
          </template>
        </el-table-column>
        <el-table-column label="执行" width="270">
          <template slot-scope="scope">
            <el-button type="primary" @click="openEditRuleDialog(scope.row)">
              修改
            </el-button>
            <el-button type="warning" @click="openChooseDialog(scope.$index)">
              选择设备并执行
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
          :visible.sync="editRuleDialog.visible"
          style="text-align:center"
          title="修改规则"
          width="30%"
      >
        <span>
          <div style="margin:10px 0">
            <label>规则名称：</label>
            <el-input
                v-model="editRuleDialog.newName"
                placeholder="请输入规则名称"
                style="width:300px"
            >
            </el-input>
          </div>
          <div style="margin:10px 0">
            <label>规则描述：</label>
            <el-input
                v-model="editRuleDialog.newDescription"
                placeholder="请输入规则描述"
                style="width:300px"
            >
            </el-input>
          </div>
        </span>
        <span slot="footer">
          <el-button @click="editRuleDialog.visible = false">取 消</el-button>
          <el-button type="primary" @click="editRule()">执行</el-button>
        </span>
      </el-dialog>
    </div>
    <el-dialog
        :visible.sync="chooseDevDialog.visible"
        title="选择设备"
        width="50%"
    >
      <span>
        <el-transfer
            v-model="chooseDevDialog.devices.value"
            :data="chooseDevDialog.devices.data"
            :filter-method="filterMethod"
            :titles="['未选设备', '已选设备']"
            filter-placeholder="请输入分组名称"
            filterable
            style="text-align:left;margin-left:70px"
        >
        </el-transfer>
      </span>
      <span slot="footer">
        <el-button @click="chooseDevDialog.visible = false">取 消</el-button>
        <el-button type="primary" @click="executeRule()">执行</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import axios from "axios";

export default {
  data() {
    return {
      pageTitle: "规则",
      devTypes: ["全部", "灯", "空调", "投影仪"],
      addRuleDialog: {
        visible: false,
        ruleName: "",
        ruleDescription: "",
        devices: {
          data: [],
          value: [],
        },
        actions: [
          {
            devType: "全部",
            state: {
              openState: false,
              brightness: 0,
              gear: 0,
              pattern: 0,
            },
          },
        ],
      },
      chooseDevDialog: {
        visible: false,
        index: 0,
        devices: {
          value: [],
          data: [],
        },
      },
      ruleKeyword: "",
      ruleData: [],
      editRuleDialog: {
        visible: false,
        id: -1,
        newName: "",
        newDescription: "",
      },
      multipleSelection: [],
      checked: false,
      currentStep: 1,
      modes: ["无", "制冷", "制热"],
    };
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.checked = val.length == 0 ? false : true;
    },
    clearSelection() {
      this.$refs.ruleTable.clearSelection();
    },
    executeRule() {
      let app = this;
      let data = {
        deviceIds: [],
        ruleId: app.chooseDevDialog.index,
      };
      app.chooseDevDialog.devices.value.forEach(function (item) {
        data.deviceIds.push(item);
      });
      let params = new URLSearchParams();
      Object.getOwnPropertyNames(data).forEach(function (item) {
        params.append(item, data[item]);
      });
      axios.post("/rule/execute", params).then(function () {
        app.$message({
          type: "success",
          message: "执行成功！",
        });
        app.chooseDevDialog.visible = false;
      });
    },
    filterMethod(query, item) {
      if (query == "") return true;
      return item.groupName == query;
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
    nextStep() {
      if (this.currentStep < 3) {
        this.currentStep++;
      } else {
        this.ruleData.push({
          name: this.addRuleDialog.ruleName,
          description: this.addRuleDialog.ruleDescription,
        });
        this.currentStep = 1;
        this.addRuleDialog = {
          visible: false,
          ruleName: "",
          ruleDescription: "",
          devices: {
            data: [],
            value: [],
          },
          actions: [
            {
              devType: "全部",
              state: {
                openState: false,
                brightness: 0,
                gear: 0,
                pattern: 0,
              },
            },
          ],
        };
      }
    },
    openEditRuleDialog(row) {
      this.editRuleDialog.id = row.id;
      this.editRuleDialog.newName = row.name;
      this.editRuleDialog.newDescription = row.description;
      this.editRuleDialog.visible = true;
    },
    editRule() {
      let app = this;
      let data = {
        id: this.editRuleDialog.id,
        name: this.editRuleDialog.newName,
        description: this.editRuleDialog.newDescription,
      };
      let params = new URLSearchParams();
      Object.getOwnPropertyNames(data).forEach(function (item) {
        params.append(item, data[item]);
      });
      // eslint-disable-next-line no-unused-vars
      axios.post("/rule/update", params).then(function (res) {
        app.$message({
          type: "success",
          message: "修改成功！",
        });
        app.initPage();
        app.editRuleDialog.visible = false;
      });
    },
    deleteRule(index) {
      this.ruleData.splice(index, 1);
    },
    deleteAction(index) {
      this.addRuleDialog.actions.splice(index, 1);
    },
    addAction() {
      for (let i = 0; i < this.devTypes.length; i++) {
        let hasType = false;
        for (let j = 0; j < this.addRuleDialog.actions.length; j++) {
          if (this.addRuleDialog.actions[j].devType == this.devTypes[i]) {
            hasType = true;
            break;
          }
        }
        if (!hasType) {
          this.addRuleDialog.actions.push({
            devType: this.devTypes[i],
            state: {
              openState: false,
              brightness: 0,
              gear: 0,
              pattern: 0,
            },
          });
          break;
        }
      }
    },
    getDevTypeDisabled(current, type) {
      if (current == type) {
        return false;
      } else {
        for (let j = 0; j < this.addRuleDialog.actions.length; j++) {
          if (this.addRuleDialog.actions[j].devType == type) {
            return true;
          }
        }
        return false;
      }
    },
    openChooseDialog(index) {
      this.chooseDevDialog.index = index;
      this.chooseDevDialog.devices.value = [];
      this.chooseDevDialog.visible = true;
    },
    initPage() {
      let app = this;
      axios.get("/group/overview").then(function (res) {
        console.log(res.data);
        for (let i = 0; i < res.data.length; i++) {
          for (let j = 0; j < res.data[i].deviceVOS.length; j++) {
            if (res.data[i].deviceVOS[j].onlineState) {
              app.addRuleDialog.devices.data.push({
                key: res.data[i].deviceVOS[j].id,
                label: res.data[i].deviceVOS[j].deviceName,
                groupName: res.data[i].groupName,
              });
              app.chooseDevDialog.devices.data.push({
                key: res.data[i].deviceVOS[j].id,
                label: res.data[i].deviceVOS[j].deviceName,
                groupName: res.data[i].groupName,
              });
            }
          }
        }
      });
      axios.get("/rule/query").then(function (res) {
        app.ruleData = res.data;
      });
      axios.get("/group/without").then(function (res) {
        console.log(res.data);
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].onlineState) {
            app.addRuleDialog.devices.data.push({
              key: res.data[i].id,
              label: res.data[i].deviceName,
              groupName: "",
            });
            app.chooseDevDialog.devices.data.push({
              key: res.data[i].id,
              label: res.data[i].deviceName,
              groupName: "",
            });
          }
        }
      });
    },
  },
  created() {
    this.initPage();
  },
};
</script>

<style scoped>
.el-steps {
  margin: 0 100px;
}
</style>
