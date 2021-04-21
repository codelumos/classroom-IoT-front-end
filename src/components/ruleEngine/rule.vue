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
        <el-button type="primary" @click="addRuleDialog.visible = true"
          >添加规则</el-button
        ><el-input
          v-model="ruleKeyword"
          placeholder="请输入规则名称"
          style="width:350px;margin-left:20px"
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
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column
          prop="name"
          label="规则名称"
          width="200"
        ></el-table-column>
        <el-table-column prop="description" label="规则描述"></el-table-column>
        <el-table-column label="编辑" width="200">
          <template slot-scope="scope">
            <el-button type="text" @click="editRule(scope.row)">修改</el-button>
            <el-button type="text" @click="deleteRule(scope.$index)"
              >删除</el-button
            >
          </template>
        </el-table-column>
        <el-table-column label="执行" width="100">
          <template slot-scope="scope">
            <el-button type="warning" @click="executeRule(scope.row)"
              >执行</el-button
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
          <el-tabs v-model="editableTabsValue" type="card">
            <el-tab-pane
              :key="index"
              v-for="(item, index) in addRuleDialog.devTypes"
              :label="'动作' + (index + 1)"
              :name="index"
              style="display:flex;flex-direction:column;align-items:flex-start"
            >
              <div style="margin-bottom:20px">
                产品类型：
                <el-select
                  v-model="productType"
                  placeholder="请选择"
                  style="width:300px"
                >
                  <el-option
                    v-for="item in devTypes"
                    :key="item"
                    :label="item"
                    :value="item"
                  >
                  </el-option>
                </el-select>
              </div>
              <div style="display:flex;margin-bottom:20px;text-align:left">
                运行状态:
                <div style="width:310px;text-align:left">
                  <el-switch
                    v-model="openState[index]"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    style="margin:0 10px"
                  >
                  </el-switch>
                </div>
              </div>
              <div
                style="display:flex;margin-bottom:20px"
                v-if="productType == '灯'"
              >
                亮度:
                <div style="width:310px;">
                  <el-slider
                    style="margin:0 20px"
                    v-model="brightness[index]"
                    :step="1"
                    :max="10"
                    show-stops
                  >
                  </el-slider>
                </div>
              </div>
              <div
                style="display:flex;margin-bottom:20px"
                v-if="productType == '空调'"
              >
                档位:
                <div style="width:310px;">
                  <el-slider
                    style="margin:0 20px"
                    v-model="gear"
                    :step="1"
                    :max="3"
                    show-stops
                    show-input
                  >
                  </el-slider>
                </div>
              </div>
              <div
                style="display:flex;margin-bottom:20px"
                v-if="productType == '空调'"
              >
                模式:
                <div style="width:310px;">
                  <el-select
                    v-model="mode"
                    placeholder="请选择"
                    style="width:300px"
                  >
                    <el-option
                      v-for="item in modes"
                      :key="item"
                      :label="item"
                      :value="item"
                    >
                    </el-option>
                  </el-select>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
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
    </el-dialog>
  </div>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      pageTitle: "规则",
      devTypes: ["灯", "空调", "投影仪", "全部"],
      addRuleDialog: {
        visible: false,
        ruleName: "",
        ruleDescription: "",
        devices: {
          data: [],
          value: [],
        },
        devTypes: ["全部"],
      },
      ruleKeyword: "",
      ruleData: [
        { name: "开灯", description: "描述1" },
        { name: "关灯", description: "描述2" },
        { name: "开空调", description: "描述3" },
        { name: "关空调", description: "描述3" },
        { name: "开投影仪", description: "描述3" },
        { name: "关投影仪", description: "描述3" },
      ],
      multipleSelection: [],
      checked: false,
      currentStep: 1,
      editableTabsValue: "动作1",
      openState: [false, false, false],
      brightness: [0, 0, 0],
      productType: "全部",
      gear: 0,
      mode: "",
      modes: ["无", "制冷", "制热"],
    };
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.checked = val.length == 0 ? false : true;
    },
    editRule(row) {},
    deleteRule(row) {},
    clearSelection() {
      this.$refs.ruleTable.clearSelection();
    },
    executeRule(row) {
      let app = this;
      let data = {
        paramSign: "",
      };
      data.paramSign = row.name;
      let params = new URLSearchParams();
      Object.getOwnPropertyNames(data).forEach(function(item) {
        params.append(item, data[item]);
      });
      axios.post("/rule/execute", params).then(function() {
        app.$message({
          type: "success",
          message: "执行成功！",
        });
      });
    },
    filterMethod(query, item) {
      if (query == "") return true;
      return item.groupName == query;
    },
    handleTabsEdit(targetName, action) {
      if (action === "add") {
        this.addRuleDialog.devTypes.push("新产品");
        this.editableTabsValue = "新产品";
      }
      if (action === "remove") {
        let tabs = this.addRuleDialog.devTypes;
        let activeName = this.editableTabsValue;
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab === targetName) {
              let nextTab = tabs[index + 1] || tabs[index - 1];
              if (nextTab) {
                activeName = nextTab;
              }
            }
          });
        }

        this.editableTabsValue = activeName;
        this.addRuleDialog.devTypes = tabs.filter((tab) => tab !== targetName);
      }
    },
    nextStep() {
      if (this.currentStep < 3) {
        this.currentStep++;
      } else {
        this.ruleData.push({
          name: this.addRuleDialog.ruleName,
          description: this.addRuleDialog.ruleDescription,
        });
        this.addRuleDialog.visible = false;
      }
    },
    deleteRule(index) {
      this.ruleData.splice(index, 1);
    },
  },
  created() {
    let app = this;
    axios.get("/group/overview").then(function(res) {
      for (let i = 0; i < res.data.length; i++) {
        for (let j = 0; j < res.data[i].deviceVOS.length; j++) {
          app.addRuleDialog.devices.data.push({
            key: res.data[i].deviceVOS[j].id,
            label: res.data[i].deviceVOS[j].deviceName,
            groupName: res.data[i].teamName,
          });
        }
      }
      console.log(res.data);
      console.log(app.addRuleDialog.devices);
    });
  },
};
</script>

<style scoped>
.el-steps {
  margin: 0 100px;
}
</style>
