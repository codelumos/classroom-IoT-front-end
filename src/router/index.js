import Vue from 'vue'
import Router from 'vue-router'
import devInfo from '../components/device/devInfo'
import devDebug from '../components/device/devDebug'
import rule from '../components/ruleEngine/rule'
Vue.use(Router)

export default new Router({
    mode:'history',
    routes:[
        {
            path:'/',
            redirect:'/main'
        },
        {
            path:'/devInfo',
            component:devInfo
        },
        {
            path:'/devDebug',
            component:devDebug
        },
        {
            path:'/rule',
            component:rule
        }
    ]
})