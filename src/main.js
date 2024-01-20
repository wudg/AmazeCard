import { createApp } from 'vue';
import router from './router';
import 'vant/lib/index.css';
import './style/style.less';
import App from './App.vue';
import en from './langurage/en.js';
import zh from './langurage/zh.js';
const message = {
    en,
    zh
};
import { createI18n } from 'vue-i18n'; 
const i18n = createI18n({
    legacy: false,  // 设置为 false，启用 composition API 模式
    messages: message,
    locale: localStorage.getItem('ln') || 'zh' // 设置默认语言
});
// 主题更换
let html = document.querySelector('html'); 
html.setAttribute('data-theme', localStorage.getItem('theme'));


import {
    Lazyload,
    Toast,
    Image,
    Slider,
    Col,
    Row,
    Icon,
    Button,
    Dialog,
    Overlay,
    Loading,
    Popup,
    RadioGroup,
    Radio,
    ActionSheet,
    List,
    PasswordInput,
    NumberKeyboard,
    Field, 
    Switch,
    CellGroup,
    Form,
} from 'vant';

const app = createApp(App);
app.use(i18n);
app.use(router);
app.use(Lazyload, {
    lazyComponent: true
});
app.use(Toast);
app.use(Image);
app.use(Col);
app.use(Row);
app.use(Icon);
app.use(Button);
app.use(Dialog);
app.use(Overlay);
app.use(Loading);
app.use(Popup); 
app.use(RadioGroup);
app.use(Slider);
app.use(Radio);
app.use(ActionSheet);
app.use(List);
app.use(PasswordInput);
app.use(NumberKeyboard);
app.use(Field);
app.use(CellGroup);
app.use(Switch);
app.use(Form);
app.mount('#app');
