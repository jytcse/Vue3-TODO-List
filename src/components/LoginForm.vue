<template>
  <div class="loginForm">
    <form action="./" @submit.prevent="submit"  method="post" class="flex justify-center ">
      <div class="border flex flex-col text-left px-10 py-3 rounded-md drop-shadow-sm">
        <h1 class="text-center text-3xl font-medium my-3">登入系統</h1>
        <span class="text-xl my-2">帳號:</span>
        <input type="text" name="username" v-model="username" placeholder="" class="text-lg outline-none" >
        <span class="text-xl my-2">密碼:</span>
        <input type="password" name="passowrd" v-model="password" placeholder="" class="text-lg outline-none">
        
        <button type="submit" class="drop-shadow rounded-full bg-blue-700 text-white px-5 py-2 mb-3 mt-4">登入</button>
        <button type="button" class="inline-flex items-center justify-center px-5 py-2 mb-3 mt-4  leading-6 text-sm shadow rounded-full text-white bg-blue-700 hover:bg-indigo-400 transition ease-in-out duration-200 " disabled="">
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          驗證中...
        </button>
      </div>
    </form>
  </div>
</template>

<script >
import { inject, ref ,onMounted  } from 'vue';
import { useRouter } from 'vue-router'
import axios from 'axios';
axios.defaults.withCredentials= true;  
export default {
  setup() {	
    const router = useRouter()
    const name = 'LoginForm';
    const api_path = inject("api_path");
    const username = ref('');
    const password = ref('');

    onMounted(() => {
      axios.get(api_path + '/check_login')
      .then( (response) => {
        if(response.data["success"]){
          router.push({ name: 'dashboard'});
        }
      })
      .catch( (error) => console.log(error));
    })
    const submit = () =>{
      axios.post(api_path + '/login',{
          username: username.value,
          password: password.value
      })
      .then( (response) => {
        if(response.data["success"]){
          router.push({ name: 'dashboard'});
        }
      })
      .catch( (error) => console.log(error));
    }

    return {
      name,
      username,
      password,
      api_path,
      submit
    }
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
