<template>
  <div>
    <codemirror v-model="code" :options="options"></codemirror>
  </div>
</template>
<script>
import "codemirror/lib/codemirror.css";
import 'codemirror/mode/javascript/javascript.js'
import "codemirror/theme/3024-day.css";
import "codemirror/mode/sql/sql.js";
import "codemirror/mode/javascript/javascript";
import codemirror from "vue-codemirror/src/codemirror.vue";
export default {
  data() {
    return {
      code: "",
      options: {
        tabSize: 2, // 缩进格式
        theme: "3024-day", // 主题，对应主题库 JS 需要提前引入
        lineNumbers: true, // 显示行号
        line: true,
        styleActiveLine: true, // 高亮选中行
        hintOptions: {
          completeSingle: true, // 当匹配只有一项的时候是否自动补全
        },
      },
    };
  },
  components: {
    codemirror
  }
};
</script>

<style scoped></style>
