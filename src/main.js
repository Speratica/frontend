import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App.vue';
import GenerateQrs from './GenerateQRs.vue';
import Home from './Home.vue';
import ScanResults from './ScanResults.vue';

Vue.use(VueRouter);

const router = new VueRouter({
    routes: [
        {
            path:'/generate-qrs',
            component: GenerateQrs
        },
        {
            path:'/',
            component: Home
        },
        {
            path:'/scan-results',
            component: ScanResults
        }

    ]
});

new Vue({
    el: '#app',
    render: h => h(App),
    router
});

