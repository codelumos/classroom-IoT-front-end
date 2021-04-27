<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/rule' }">规则引擎</el-breadcrumb-item>
      <el-breadcrumb-item>规则</el-breadcrumb-item>
    </el-breadcrumb>
    <div style="padding:10px 0;text-align:left">
      <h1 style="text-align:left;font-size:30px;margin:0 0 10px 0">
        {{ pageTitle }}
      </h1>
      <div style="margin-bottom:10px">
        <el-input
          v-model="ruleKeyword"
          placeholder="请输入规则名称"
          style="width:350px;"
          ><el-button
            slot="append"
            icon="el-icon-search"
            @click="search()"
          ></el-button
        ></el-input>
      </div>
      <el-table
        :data="ruleData"
        max-height="550"
        ref="ruleTable"
        height="550"
        border
        @selection-change="handleSelectionChange"
      >
        <!-- <el-table-column type="selection" width="55"> </el-table-column> -->
        <el-table-column
          prop="name"
          label="规则名称"
          width="200"
        ></el-table-column>
        <el-table-column prop="description" label="规则描述"></el-table-column>
        <el-table-column label="创建时间" width="200">
          <template slot-scope="scope">{{
            getDateString(new Date(scope.row.createTime))
          }}</template>
        </el-table-column>
        <el-table-column label="更新时间" width="200">
          <template slot-scope="scope">{{
            getDateString(new Date(scope.row.updateTime))
          }}</template>
        </el-table-column>
        <!-- <el-table-column label="编辑" width="200">
          <template slot-scope="scope">
            <el-button type="text" @click="editRule(scope.row)">修改</el-button>
            <el-button type="text" @click="deleteRule(scope.$index)"
              >删除</el-button
            >
          </template>
        </el-table-column> -->
        <el-table-column label="执行" width="270">
          <template slot-scope="scope">
            <el-button type="primary" @click="openEditRuleDialog(scope.row)"
              >修改</el-button
            >
            <el-button type="warning" @click="openChooseDialog(scope.$index)"
              >选择设备并执行</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
        title="修改规则"
        :visible.sync="editRuleDialog.visible"
        width="30%"
        style="text-align:center"
      >
        <span>
          <div style="margin:10px 0">
            <label>规则名称：</label>
            <el-input
              v-model="editRuleDialog.newName"
              placeholder="请输入规则名称"
              style="width:300px"
            ></el-input>
          </div>
          <div style="margin:10px 0">
            <label>规则描述：</label>
            <el-input
              v-model="editRuleDialog.newDescription"
              placeholder="请输入规则描述"
              style="width:300px"
            ></el-input>
          </div>
        </span>
        <span slot="footer">
          <el-button @click="editRuleDialog.visible = false">取 消</el-button>
          <el-button type="primary" @click="editRule()">执行</el-button>
        </span>
      </el-dialog>
      <!-- <el-row style="margin:10px 0;display:flex;align-items:center">
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
      </el-row> -->
    </div>
    <!-- <el-dialog
      title="添加规则"
      :visible.sync="addRuleDialog.visible"
      width="50%"
    >
      <span>
        <el-steps
          :active="currentStep"
          finish-status="success"
          style="text-align:left;
          margin-bottom:50px"
        >
          <el-step title="基本信息"></el-step>
          <el-step title="适用设备"></el-step>
          <el-step title="执行动作"></el-step>
        </el-steps>
        <div v-if="currentStep == 1" style="margin-bottom:50px">
          <div style="margin:10px 0">
            <label>规则名称：</label>
            <el-input
              v-model="addRuleDialog.ruleName"
              placeholder="请输入规则名称"
              style="width:300px"
            ></el-input>
          </div>
          <div style="margin:10px 0">
            <label>规则描述：</label>
            <el-input
              v-model="addRuleDialog.ruleDescription"
              placeholder="请输入规则描述"
              style="width:300px"
            ></el-input>
          </div>
        </div>
        <div
          v-if="currentStep == 2"
          style="margin-bottom:50px;text-align:center;margin-left:140px"
        >
          <el-transfer
            filterable
            :filter-method="filterMethod"
            filter-placeholder="请输入分组名称"
            v-model="addRuleDialog.devices.value"
            :data="addRuleDialog.devices.data"
            :titles="['未选设备', '已选设备']"
            style="text-align:left"
          >
          </el-transfer>
        </div>
        <div v-if="currentStep == 3" style="margin-bottom:50px;padding:0 30px">
          <el-card
            v-for="(action, index) in addRuleDialog.actions"
            :key="index"
            style="text-align:left;margin-bottom:10px"
          >
            <div slot="header" class="clearfix">
              <span>
                <b>执行动作{{ index + 1 }}</b></span
              >
              <el-button
                style="float: right; padding: 3px 0"
                type="text"
                @click="deleteAction(index)"
                >删除</el-button
              >
            </div>
            <div style="margin-bottom:10px">
              <label>执行对象：</label>
              <el-select v-model="action.devType">
                <el-option
                  v-for="(type, index) in devTypes"
                  :key="index"
                  :value="type"
                  :disabled="getDevTypeDisabled(action.devType, type)"
                ></el-option>
              </el-select>
            </div>
            <div style="display:flex;margin-bottom:10px">
              <label>设备开关：</label>
              <b
                style=";margin:0 10px"
                :style="{
                  color: action.state.openState ? '#bcbfc4' : '#ff4949',
                }"
                >关闭</b
              >
              <el-switch
                v-model="action.state.openState"
                active-color="#13ce66"
                inactive-color="#ff4949"
              ></el-switch>
              <b
                style="margin:0 10px"
                :style="{
                  color: action.state.openState ? '#13ce66' : '#bcbfc4',
                }"
                >开启</b
              >
            </div>
            <div
              style="display:flex;align-items:center;margin-bottom:10px"
              v-if="action.devType == '灯'"
            >
              <label>灯光亮度：</label>
              <el-slider
                style="margin:0 10px;width:400px"
                v-model="action.state.brightness"
                :step="1"
                :max="10"
                show-stops
                show-input
              >
              </el-slider>
            </div>
            <div
              style="display:flex;align-items:center;"
              v-if="action.devType == '空调'"
            >
              <label>空调档位：</label>
              <el-slider
                style="margin:0 10px;width:400px"
                v-model="action.state.gear"
                :step="1"
                :max="3"
                show-stops
                show-input
              >
              </el-slider>
            </div>
            <div
              style="display:flex;align-items:center;"
              v-if="action.devType == '空调'"
            >
              <label>空调模式：</label>
              <el-select v-model="action.state.pattern" placeholder="">
                <el-option
                  v-for="(mode, index) in modes"
                  :key="index"
                  :label="mode"
                  :value="index"
                ></el-option>
              </el-select>
            </div>
          </el-card>
          <el-button
            type="text"
            @click="addAction()"
            v-if="addRuleDialog.actions.length != 4"
            >++新增动作++</el-button
          >
        </div>
        <el-button
          type="primary"
          :disabled="currentStep == 1"
          @click="currentStep--"
          >上一步</el-button
        >
        <el-button type="primary" @click="nextStep()">{{
          currentStep == 3 ? "确定" : "下一步"
        }}</el-button>
      </span>
    </el-dialog> -->
    <el-dialog
      title="选择设备"
      :visible.sync="chooseDevDialog.visible"
      width="50%"
    >
      <span>
        <el-transfer
          filterable
          :filter-method="filterMethod"
          filter-placeholder="请输入分组名称"
          v-model="chooseDevDialog.devices.value"
          :data="chooseDevDialog.devices.data"
          :titles="['未选设备', '已选设备']"
          style="text-align:left;margin-left:140px"
        >
        </el-transfer
      ></span>
      <span slot="footer">
        <el-button @click="chooseDevDialog.visible = false">取 消</el-button>
        <el-button type="primary" @click="executeRule()">执行</el-button>
      </span></el-dialog
    >
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
      ruleData: [
        { name: "下课", description: "关掉所有设备" },
        { name: "普通白天上课", description: "打开投影仪即可" },
        { name: "普通夜晚上课", description: "打开投影仪，灯" },
        {
          name: "夏季白天上课",
          description: "打开空调，投影仪，空调需要为制冷3挡",
        },
        {
          name: "夏季晚上上课",
          description: "打开空调，投影仪，灯，空调需要为制冷2挡",
        },
        {
          name: "冬季白天上课",
          description: "打开空调，投影仪，空调需要为制热2挡",
        },
        {
          name: "冬季晚上上课",
          description: "打开空调，投影仪，灯，空调需要为制热3挡",
        },
      ],
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
      app.chooseDevDialog.devices.value.forEach(function(item) {
        data.deviceIds.push(item);
      });
      let params = new URLSearchParams();
      Object.getOwnPropertyNames(data).forEach(function(item) {
        params.append(item, data[item]);
      });
      axios.post("/rule/execute", params).then(function() {
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
      Object.getOwnPropertyNames(data).forEach(function(item) {
        params.append(item, data[item]);
      });
      axios.post("/rule/update", params).then(function(res) {
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
      axios.get("/group/overview").then(function(res) {
        console.log(res.data);
        for (let i = 0; i < res.data.length; i++) {
          for (let j = 0; j < res.data[i].deviceVOS.length; j++) {
            if (res.data[i].deviceVOS[j].onlineState) {
              app.addRuleDialog.devices.data.push({
                key: res.data[i].deviceVOS[j].id,
                label: res.data[i].deviceVOS[j].deviceName,
                groupName: res.data[i].teamName,
              });
              app.chooseDevDialog.devices.data.push({
                key: res.data[i].deviceVOS[j].id,
                label: res.data[i].deviceVOS[j].deviceName,
                groupName: res.data[i].teamName,
              });
            }
          }
        }
      });
      axios.get("/rule/query").then(function(res) {
        app.ruleData = res.data;
      });
      axios.get("/group/without").then(function(res) {
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
