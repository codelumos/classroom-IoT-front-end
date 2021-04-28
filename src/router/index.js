import Vue from "vue";
import Router from "vue-router";
import devInfo from "../components/device/devInfo";
import rule from "../components/rule/rule";
import infoDetail from "../components/device/infoDetail";
import devGroup from "../components/device/devGroup";
import groupDetail from "../components/device/groupDetail";

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
      path: "/infoDetail/:id",
      component: infoDetail,
    },
    {
      path: "/devGroup",
      component: devGroup,
    },
    {
      path: "/groupDetail/:id",
      component: groupDetail,
    },
  ],
});
