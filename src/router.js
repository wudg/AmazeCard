import { createRouter, createWebHistory } from 'vue-router';

const Index = () => import('./pages/index/Index.vue');   // 首页

const routes = [
    { path: '/', component: Index }
];

const router = createRouter({
    // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
    history: createWebHistory(),
    routes, // `routes: routes` 的缩写
});

let back = null;

router.beforeEach((to, from) => {
    if(from.path !== '/') {
        to.meta.transition = (back === to.path) ? 'slide-left' : 'slide-right';
    }
});

router.afterEach((to, from) => {
    if(history.state.back) {
        if(history.state.back.indexOf('?') !== -1) {
            back = history.state.back.substring(0, history.state.back.indexOf('?'));
        } else {
            back = history.state.back;
        }
    }
});

export default router;