import Vue from 'vue';
import App from './App.vue';
import Vuetify from 'vuetify';
import './stylus/main.styl';
import VueRouter from 'vue-router';
import GenerateQrs from './GenerateQRs.vue';
import Home from './Home.vue';
import ScanResults from './ScanResults.vue';

Vue.use(Vuetify);
Vue.use(VueRouter);

const router = new VueRouter({
    routes: [
        {
            path: '/generate-qrs',
            component: GenerateQrs
        },
        {
            path: '/home',
            component: Home
        },
        {
            path: '/scan-results',
            component: ScanResults
        },
        {
            path: '/',
            redirect: '/home'
        }
    ]
});

new Vue({
    el: '#app',
    render: h => h(App),
    router
});

