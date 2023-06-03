import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import "./style/index.css"; //import tailwindcss
import axios from 'axios';
import VueAxios from 'vue-axios';

const axiosInstance = axios.create({
    baseURL: process.env.VUE_APP_API_URL,
    withCredentials : true,
    timeout: 20*1000,
    timeoutErrorMessage:'伺服器錯誤',
})

const app = createApp(App);
app.use(VueAxios, axios);
app.provide("axios", axiosInstance);
app.use(router);
app.mount('#app');

//驗證是否有權限能夠訪問頁面
router.beforeEach((to)=>{
    if(to.name == 'about') return true;
    axiosInstance.get('/check_login')
    .then( (response) => {
        if(response.data["success"]) return true;
        else return router.push({name:'home'});
    })
    .catch( (error) => console.log(error));
});
