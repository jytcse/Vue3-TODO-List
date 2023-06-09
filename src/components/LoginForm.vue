<template>
  <div class="loginForm mt-5">
    <form action="./" @submit.prevent="submit"  method="post" class="flex justify-center items-center">
      <div class="border flex flex-col text-left px-10 py-3 rounded-md drop-shadow-sm">
        <h1 class="text-center text-3xl font-medium my-3">登入系統</h1>
        <div v-if="(!isSubmit && errorMessage)" class="transition-transform duration-1000 animate-shake w-auto h-10 mb-2 bg-red-300 rounded-md flex justify-center items-center">
          <span>{{ errorMessage }}</span>
        </div>
        <span class="text-xl my-2">帳號:</span>
        <input type="text" name="username" autocomplete="off" v-model="username" required placeholder="" class="text-lg outline-none" >
        <span class="text-xl my-2">密碼:</span>
        <input type="password" name="passowrd" autocomplete="off" v-model="password" required placeholder="" class="text-lg outline-none">
        <button v-if="!isSubmit" type="submit" class=" drop-shadow rounded-full bg-[#864a28] text-white px-5 py-2 mb-3 mt-4">登入</button>
        <button v-else type="button" class="
        inline-flex items-center justify-center px-5 py-2 mb-3 mt-4 
        leading-6 text-sm shadow rounded-full text-white 
        bg-[#864a28] hover:bg-[#a97557] transition font-bold
        ease-in-out duration-200 " disabled="">
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
import {  ref ,inject } from 'vue';
import { useRouter } from 'vue-router'

export default {
  setup() {	
    const router = useRouter();
    const axios = inject('axios');
    let username = ref('');
    let password = ref('');
    let isSubmit = ref(false);
    let errorMessage = ref('');

    const submit = () =>{
      isSubmit.value = !isSubmit.value;
      axios.post('/login',{
          username: username.value,
          password: password.value
      })
      .then( (response) => {
        if(response.data["success"]){
          setTimeout(()=>{
            router.push({ name: 'dashboard'});
          },1000);
        }else{
          setTimeout(()=>{},200);
          isSubmit.value = !isSubmit.value;
          errorMessage.value = response.data['message'];
        }
      })
      .catch( (error) => console.log(error));
    }

    return {
      username,
      password,
      submit,
      isSubmit,
      errorMessage
    }
  }
}

</script>

<style scoped>

</style>
