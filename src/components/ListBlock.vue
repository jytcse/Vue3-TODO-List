<template >
  <div class="w-[24%] h-[50%] bg-white hover:border-gray-400 transition-all duration-300  border-2 shadow-sm rounded-lg p-3 overflow-hidden">
    <div>
      <div class="h-[50%] w-full">
        <div class="flex items-baseline justify-between">
          <div>
            <span class="font-bold text-2xl ml-2 mb-2 text-center">{{ index }} </span>
            <span class="font-bold text-sm ml-1 mb-2">{{ data[0].Date.replaceAll('-','/').slice(5) }}</span>
          </div>
          <div>
            <button @click="submintDeleteList(data[0]['list-ID'])" class="p-1 px-3 border rounded-e-sm hover:bg-[#f44336] hover:text-white hover:border-gray-800 transition-all duration-300">刪除</button>
          </div>
        </div>
        <hr class="mt-1">
        <div>
          <ul class="overflow-y-auto h-80 flex flex-col gap-1 p-2 myList">
            <template v-for="(node,index) in data" :key="node">
              <li :class="node.Status == 1 ? 'line-through':''">
                <span>
                  {{ index + 1 }}. {{ node.Content }}
                </span>
              </li>
              <hr>
            </template>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script >
import { inject } from 'vue';
export default {
  props: {
    data: Object,
    index :String,
  },
  emits: ['needRefresh'],
  setup(props,{emit}) {
      const axios = inject('axios');
      const submintDeleteList = function(listId){
          if(!confirm('確定要刪除嗎?')) return;
          axios.delete('/myList/delete/' + listId)
          .then( (response) => {
            console.log(response.data);
            if(response.data["success"]){
              emit('needRefresh');
            }else{
              alert(response.data["message"]);
            }
            
          })
          .catch( (error) => console.log(error));
        
      }
      return{
          submintDeleteList,
          props,
      }
  }
}

</script>

<style scoped>

</style>
