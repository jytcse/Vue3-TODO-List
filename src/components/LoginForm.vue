<template>
  <div class="loginForm">
    <form :action="api_path+'/login'"  method="post" class="flex justify-center ">
      <div class="border flex flex-col text-left px-10 py-3 rounded-md drop-shadow-sm">
        <h1 class="text-center text-3xl font-medium my-3">登入系統</h1>
        <span class="text-xl my-2">帳號:</span>
        <input type="text" placeholder="" class="text-lg outline-none" >
        <span class="text-xl my-2">密碼:</span>
        <input type="password" placeholder="" class="text-lg outline-none">
        
        <button type="submit" class="drop-shadow rounded-full bg-blue-700 text-white px-5 py-2 mb-3 mt-4">登入</button>
      </div>
    </form>
  </div>
</template>

<script >
import { inject } from 'vue';

export default {
  setup() {
    const name = 'LoginForm';
    const api_path = inject("api_path");
    return {
      name,
      api_path
    }
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
