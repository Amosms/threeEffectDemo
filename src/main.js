import {
    createApp
} from "vue";
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import Antd from 'ant-design-vue';
import * as axios from 'axios';
window.axios = axios;
import App from "./App.vue";
import route from "./routes";

createApp(App).use(route).use(ElementPlus).use(Antd).mount("#app");