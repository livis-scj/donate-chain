import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            name: 'Index',
            component: () => import(/* webpackChunkName: "Home" */ '@/pages/Index.vue')
        },
        {
            path: '/donate/login',
            name: 'list',
            component: () => import(/* webpackChunkName: "Home" */ '@/pages/Donate/Login.vue')
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
                    path: '/home/activity',
                    name: 'activity',
                    component: () => import(/* webpackChunkName: "Home" */ '@/pages/Home/activity.vue')
                }
            ]
        },
        {
            path: '/search',
            name: 'Search',
            component: () => import(/* webpackChunkName: "Home" */ '@/pages/Home/search.vue')
        }
    ]
});
