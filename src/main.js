import Vue from 'vue'
import App from './App.vue'
import Vant from 'vant';
import 'vant/lib/index.css';
Vue.use(Vant);
Vue.config.productionTip = false
import {
    Locale
} from 'vant';
// 引入英文语言包
import enUS from 'vant/es/locale/lang/en-US';

Locale.use('en-US', enUS);
new Vue({
    render: h => h(App),
}).$mount('#app')