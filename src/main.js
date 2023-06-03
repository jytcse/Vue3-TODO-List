import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import "./style/index.css"; //import tailwindcss
import axios from 'axios';
axios.defaults.withCredentials= true;  
createApp(App).use(router,axios).mount('#app')
