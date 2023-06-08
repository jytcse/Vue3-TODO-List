import { createApp, ref } from 'vue'
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
const isLoggedIn = ref(await checkLogin());
app.provide("isLoggedIn", isLoggedIn);
app.use(router);
app.mount('#app');

//驗證是否有權限能夠訪問頁面
router.beforeEach(async (to)=>{
    isLoggedIn.value = await checkLogin();
    // 如果使用者已登錄且試圖訪問home頁，重導向到dashboard
    if (to.name === 'home' && isLoggedIn.value) {
        return router.push({name:'dashboard'});
    } 
    // 如果使用者未登錄且試圖訪問非home或about頁，將重導向到home頁
    else if ((to.name !== 'home' && to.name !== 'about') && !isLoggedIn.value) {
        return router.push({name:'home'}); 
    }
    else return true; 
});

/**
 * 檢查登入狀態
 * @function checkLogin
 * @returns {Promise<Boolean>}
 */
 function checkLogin() {
    return new Promise((resolve, reject) => {
      axiosInstance.get('/check_login')
        .then(function (response) {
          resolve(response.data["success"]);
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });
  }