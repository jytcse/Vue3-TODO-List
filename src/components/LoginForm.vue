<template>
  <div class="loginForm">
    <form @submit.prevent="submit"  method="post" class="flex justify-center ">
      <div class="border flex flex-col text-left px-10 py-3 rounded-md drop-shadow-sm">
        <h1 class="text-center text-3xl font-medium my-3">登入系統</h1>
        <span class="text-xl my-2">帳號:</span>
        <input type="text" name="username" v-model="username" placeholder="" class="text-lg outline-none" >
        <span class="text-xl my-2">密碼:</span>
        <input type="password" name="passowrd" v-model="password" placeholder="" class="text-lg outline-none">
        
        <button type="submit" class="drop-shadow rounded-full bg-blue-700 text-white px-5 py-2 mb-3 mt-4">登入</button>
      </div>
    </form>
  </div>
</template>

<script >
import { inject, ref } from 'vue';
import axios from 'axios';

export default {
  setup() {
    const name = 'LoginForm';
    const api_path = inject("api_path");
    const username = ref('');
    const password = ref('');

    const submit = () =>{
      // console.log(username.value);
      // console.log(password.value);
      //POST請求
    axios.post(api_path + '/login',{
        username: username.value,
        password: password.value
    })
    .then( (response) => console.log(response.data))
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
