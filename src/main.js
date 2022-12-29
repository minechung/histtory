import Vue from 'vue'
import App from './App.vue'
import Vant from 'vant';
import 'vant/lib/index.css';
import VueI18n from "vue-i18n";
Vue.use(VueI18n);
Vue.use(Vant);
Vue.config.productionTip = false
import {
    Locale
} from 'vant';
// 引入英文语言包
import enUS from 'vant/es/locale/lang/en-US';
const i18n = new VueI18n({
    locale: "en", //语言标识
    messages: { //配置多语言 根据自己的项目需求  这里配置了中文和英文
        'en': require('./assets/lang/en.js'), //英文   
    },
    fallbackLocale: "en", //没有英文的时候默认 中文语言
    silentTranslationWarn: true, //报错时加上这个参数可以取消警告
    // this.$i18n.locale // 通过切换locale的值来实现语言切换
});
Locale.use('en-US', enUS);
new Vue({
    i18n,
    render: h => h(App),
}).$mount('#app')