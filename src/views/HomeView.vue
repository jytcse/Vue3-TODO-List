<template>
  <div class="home">
    <LoginForm/>
  </div>
</template>

<script>
// @ is an alias to /src
import LoginForm from '@/components/LoginForm.vue';
import { inject ,onMounted  } from 'vue';
import { useRouter } from 'vue-router'
import axios from 'axios';
axios.defaults.withCredentials= true;  
export default {
  name: 'HomeView',
  components: {
    LoginForm
  },
  setup() {	
    const router = useRouter()
    const api_path = inject("api_path");

    onMounted(() => {
      axios.get(api_path + '/check_login')
      .then( (response) => {
        if(response.data["success"]){
          router.push({ name: 'dashboard'});
        }
      })
      .catch( (error) => console.log(error));
    })
  }
}
</script>
