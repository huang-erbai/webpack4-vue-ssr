/*
 * @Author: 黄 楠
 * @Date: 2019-04-30 10:11:31
 * @Last Modified by: 黄 楠
 * @Last Modified time: 2019-05-05 10:01:09
 * @Description: router.js
 */

import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export function createRouter() {
    return new Router({
        mode: "history",
        routes: [
            { path: "/", component: () => import(/* webpackChunkName: 'index' */ "./views/Home.vue") },
        ],
    });
}
