<template>
  <div class="border min-h-[100%] p-5 relative overflow-hidden">
    <form  method="post" @submit.prevent="submitNewList" class="flex flex-col gap-3">
      <div v-if="errorMessage"  class="transition-transform duration-1000 animate-shake w-auto h-10 bg-red-300 rounded-md flex justify-center items-center">
        <span>{{ errorMessage }}</span>
      </div>
      <div>
        <span class="text-xl mr-3">清單名稱 :</span>
        <input class="border-b text-xl outline-none w-[70%]" type="text" placeholder="ex:工作" v-model.trim="newListName">
      </div>
      <div>
        <span class="text-xl">應做事項 :</span>
        <ul>
          <li v-for="n in 10" :key="n" class="my-2" >
            <span class="text-xl">{{ n }}.</span>
            <input class="ml-2 border-b text-lg outline-none" :required="n == 1" v-model.trim="newListData[n - 1]" type="text">
          </li>
        </ul>
      </div>
      <div class="absolute bottom-6 left-12">
        <button type="submit" class="w-80 p-2 text-lg border hover:border-gray-800  transition-all duration-300 border-gray-400 bg-[#ffebd2] rounded-sm">建立</button>
      </div>
    </form>
  </div>
</template>

<script >
import { ref ,inject} from 'vue';

export default {
  props: {
    nowYear:Number,
    nowMonth:Number,
    nowDay:Number,
  },
  emits: ['needRefresh'],
  setup(props,{ emit }) {
      const axios = inject('axios');
      const newListName = ref('');
      const newListData = ref([]);
      const errorMessage = ref('');


      //送出新增清單請求
      const submitNewList = () =>{
        errorMessage.value = '';
        axios.post('/myList/create',{
            "listName":newListName.value,
            "listData":newListData.value.filter((item)=> item != null && item != ""),
            "Date": props.nowYear + '-' + props.nowMonth + '-' + props.nowDay
        })
        .then( (response) => {
          if(response.data["success"]){
            console.log(response.data);
            newListName.value = '';
            newListData.value = [];
            //資料有變動，所以抓新資料重新渲染
            emit('needRefresh');
          }else{
            console.log(response.data);
            errorMessage.value = response.data.message;
          }
        })
        .catch( (error) => console.log(error));
      }

      return{
        newListName,
        newListData,
        errorMessage,
        submitNewList,
        props,
      }
    }
}

</script>

<style scoped>

</style>
