/*
 * @Author: 黄 楠
 * @Date: 2019-04-30 09:51:19
 * @Last Modified by: 黄 楠
 * @Last Modified time: 2019-05-05 11:04:02
 * @Description: 客户端 entry
 * 在客户端，处理数据预取有两种不同方式：
 * 1. 在路由导航之前解析数据
 * 2. 匹配要渲染的视图后，再获取数据
 */

import Vue from "vue";
import { createApp } from "./app";

const { app, router } = createApp();

if ((window as any).__INITIAL_STATE__) {
    // store.replaceState(window.__INITIAL_STATE__);
}

// a global mixin that calls `asyncData` when a route component's params change
Vue.mixin({
    beforeRouteUpdate(to, from, next) {
        const { asyncData } = (this as any).$options;
        if (asyncData) {
            asyncData({
                // store: this.$store,
                route: to,
            }).then(next).catch(next);
        } else {
            next();
        }
    },
});

router.onReady(() => {
    // 添加路由钩子函数，用于处理 asyncData.
    // 在初始路由 resolve 后执行，
    // 以便我们不会二次预取(double-fetch)已有的数据。
    // 使用 `router.beforeResolve()`，以便确保所有异步组件都 resolve。
    router.beforeResolve((to, from, next) => {
        const matched = router.getMatchedComponents(to);
        const prevMatched = router.getMatchedComponents(from);

        // 我们只关心非预渲染的组件
        // 所以我们对比它们，找出两个匹配列表的差异组件
        let diffed = false;
        const activated = matched.filter((c, i) => {
            return diffed || (diffed = (prevMatched[i] !== c));
        });

        if (!activated.length) {
            return next();
        }
        // 这里如果有加载指示器 (loading indicator)，就触发

        Promise.all(activated.map((c: any) => {
            if (c.asyncData) {
                return c.asyncData({
                    // store,
                    route: to,
                });
            }
        })).then(() => {
            // 停止加载指示器(loading indicator)
            next();
        }).catch(next);
    });

    app.$mount("#app");
});

