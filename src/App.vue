<template>
  <nav class="h-16 bg-[#f2e5d3] flex justify-center items-center gap-4 shadow-sm text-lg">
    
    <template v-if="!isLoggedIn">

      <router-link to="/" class="text-[#403933] font-bold ">Home</router-link> |
    </template>
    <template v-if="isLoggedIn">
      <router-link to="/Dashboard" class="text-[#403933] font-bold">Dashboard</router-link> |
    </template>
    <!-- #8C4637 -->
    <router-link to="/about" class="text-[#403933] font-bold">About</router-link>
    <template v-if="isLoggedIn">
      |
      <a href="./" @click.prevent="logout" class="text-[#403933] font-bold">Logout</a>
    </template>
    
  </nav>
  <router-view/>
</template>

<script>
import { inject} from 'vue';
import { useRouter } from 'vue-router';
export default {
  setup(){
    const axios = inject('axios');
    const router = useRouter();
    let isLoggedIn = inject("isLoggedIn");
    
    /**
     * 登出
     * @function logout
     * @returns {Object}
    */
    const logout = function(){
      axios.get('/logout')
      .then( (response) => {
        if(response.data["success"]) {
          return router.push({ name: 'home'});
        }
      })
      .catch( (error) => console.log(error));
    }

    return{
      isLoggedIn,
      logout
    }
  }
}

</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@100;300;400;500;700;900&family=Roboto&display=swap');
*{
  font-family: 'Noto Sans TC', sans-serif;
}
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.router-link-active.router-link-exact-active{
  color: #864a28;
}
</style>
