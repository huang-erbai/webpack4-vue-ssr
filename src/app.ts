/*
 * @Author: 黄 楠
 * @Date: 2019-04-29 10:28:58
 * @Last Modified by: 黄 楠
 * @Last Modified time: 2019-05-05 10:51:07
 * @Description: 通用 entry
 */
import Vue from "vue";
import App from "./App.vue";
import { createRouter } from "./router";

export function createApp() {
    // 创建 router 实例
    const router = createRouter();

    const app = new Vue({
        router,
        render: (h) => h(App),
    });
    return { app, router };
}
