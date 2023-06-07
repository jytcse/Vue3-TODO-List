<template>
  <div class="border min-h-[100%] p-5 relative overflow-hidden">
    <form  method="post" @submit.prevent="submitEditList(editListData[0]['list-ID'])" class="flex flex-col gap-3">
      <div v-if="errorMessage"  class="transition-transform duration-1000 animate-shake w-auto h-10 bg-red-300 rounded-md flex justify-center items-center">
        <span>{{ errorMessage }}</span>
      </div>
      <div>
        <!-- {{ editListData }} -->
        <span class="text-xl mr-3">清單名稱 :</span>
        <select class="w-[70%] border outline-none hover:border-gray-800  transition-all duration-300" v-model="editListName" @change="selectdData(classifiedData)">
            <option v-for="(node,index) in classifiedData" :key="node[0]['list-ID']" :value="index">{{ index }}</option>
        </select>
      </div>
      <!-- {{ editListData }} -->
      
      
      <!-- {{ submitListData }} -->
      <div v-if="classifiedData[editListName]">
        <span class="text-xl">應做事項 :</span>
        <ul>
          <li v-for="(node,index) in editListData" :key="node.Content" class="my-2" >
            <span class="text-xl">{{ index + 1 }}.</span>
              <input class="ml-2 border-b text-lg outline-none" type="text"  v-model="submitListData[index]">
          </li>
          <li v-for="(node,index) in (10 - length(classifiedData[editListName]))" :key="node" class="my-2" >
            <span class="text-xl">{{ index + 1 + length(classifiedData[editListName]) }}.</span>
            <input class="ml-2 border-b text-lg outline-none" type="text" v-model="submitListData[ index  + length(classifiedData[editListName])]">
          </li>
        </ul>
      </div>
      <div class="absolute bottom-6 left-12" v-if="classifiedData[editListName]">
        <button type="submit" class="w-80 p-2 text-lg border hover:border-gray-800  transition-all duration-300 border-gray-400 bg-[#ffebd2] rounded-sm">完成編輯</button>
      </div>
    </form>
  </div>
</template>

<script >
import { ref ,inject} from 'vue';

export default {
  props: {
    classifiedData:Object,
    nowYear:Number,
    nowMonth:Number,
    nowDay:Number,
  },
  emits: ['needRefresh'],
  setup(props,{ emit }) {
      const axios = inject('axios');
      const editListName = ref('');
      const editListData = ref({});
      const errorMessage = ref('');
      let submitListData = ref([]);

      /**
       * 取得物件length
       * @function length
       * @param {Object} data - data
       * @returns {number} count - length 
       */
      const length = (data)=>{
        let count = 0;
        for(const i in data){
          count++;
          i;
        }
        return count;
      }
      const selectdData = (classifiedData)=>{
        editListData.value = classifiedData[editListName.value];
        submitListData.value = Array(10).fill('').map((item, index) => editListData.value.map(item => item.Content)[index] || '');
        console.log(editListData.value);
      }
      //送出編輯清單請求
      const submitEditList = (listId) =>{
        errorMessage.value = '';
        axios.post('/myList/edit/'+listId,{
            "listData":submitListData.value.filter((item)=> item != null && item != ""),
        })
        .then( (response) => {
          if(response.data["success"]){
            console.log(response.data);
            submitListData.value = [];
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
        editListName,
        editListData,
        errorMessage,
        submitEditList,
        submitListData,
        length,
        props,
        selectdData
      }
    }
}

</script>

<style scoped>

</style>
