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
            path: '/home',
            name: 'Home',
            component: () => import(/* webpackChunkName: "Home" */ '@/Layouts'),
            children: [
                {
                    path: '/home/donate',
                    name: 'donate',
                    component: () => import(/* webpackChunkName: "Home" */ '@/pages/Home/donate.vue')
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
