import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/search/index',
            name: 'Index',
            component: () => import(/* webpackChunkName: "Home" */ '@/pages/Index.vue')
        },
        {
            path: '/donate/login',
            name: 'list',
            component: () => import(/* webpackChunkName: "Home" */ '@/pages/Donate/Login.vue')
        },
        {
            path: '/recive',
            name: 'receive',
            component: () => import(/* webpackChunkName: "Home" */ '@/pages/Receive/Login.vue'),
            children: [
                {
                    path: '/receive/login',
                    name: 'receiveLogin',
                    component: () => import(/* webpackChunkName: "Home" */ '@/pages/Receive/Login.vue')
                }
            ]
        },
        {
            path: '/donate',
            name: 'Home',
            component: () => import(/* webpackChunkName: "Home" */ '@/Layouts'),
            children: [
                {
                    path: '/donate/list',
                    name: 'donate',
                    component: () => import(/* webpackChunkName: "Home" */ '@/pages/Donate/donate.vue')
                },
                {
                    path: '/receive/list',
                    name: 'receiveList',
                    component: () => import(/* webpackChunkName: "Home" */ '@/pages/Receive/receive.vue')
                },
                {
                    path: '/activity/index',
                    name: 'activity',
                    component: () => import(/* webpackChunkName: "Home" */ '@/pages/Activity/Index.vue')
                }
            ]
        },
        {
            path: '/search/list',
            name: 'Search',
            component: () => import(/* webpackChunkName: "Home" */ '@/pages/Home/search.vue')
        }
    ]
});
