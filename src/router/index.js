import Vue from "vue";
import Router from "vue-router";
import devInfo from "../components/device/devInfo";
import rule from "../components/ruleEngine/rule";
import devXq from "../components/device/devXq";
import devGroup from "../components/device/devGroup";
import groupXq from "../components/device/groupXq";
import analysis from "../components/analysis/analysis";
Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      redirect: "/main",
    },
    {
      path: "/devInfo",
      component: devInfo,
    },
    {
      path: "/rule",
      component: rule,
    },
    {
      path: "/devXq/:id",
      component: devXq,
    },
    {
      path: "/devGroup",
      component: devGroup,
    },
    {
      path: "/groupXq/:id",
      component: groupXq,
    },
    {
      path: "/analysis",
      component: analysis,
    },
  ],
});
