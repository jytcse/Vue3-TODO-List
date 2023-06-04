<template>
  <nav class="h-16 flex justify-center items-center gap-4">
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
    <template  v-if="isLoggedIn">
      |
      <a href="./" @click.prevent="logout">Logout</a>
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

</style>
