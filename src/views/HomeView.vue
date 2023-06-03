<template>
  <div class="home">
    <LoginForm/>
  </div>
</template>

<script>
import LoginForm from '@/components/LoginForm.vue';
export default {
  name: 'HomeView',
  components: {
    LoginForm
  }
}
</script>
