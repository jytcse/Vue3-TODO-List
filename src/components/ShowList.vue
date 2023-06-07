<template>
  <div class="basis-5/12">
    <div class="h-[50%]">
      <div class="flex flex-row justify-between">
        <h1 class="font-bold text-2xl mb-2">{{ listType }}:</h1>
        <div v-if="listData != null && listData.length">
          <button v-if="!isEdit" class="border p-1" @click="switchBtn('edit')">編輯</button>
          <button v-else class="border p-1" @click="switchBtn('submit')">儲存</button>
        </div>
      </div>
      
      <div>
        <!-- {{ props.listData }} -->
        <!-- {{ checkBoxList }} -->
        <ul class="overflow-y-auto h-64 border flex flex-col gap-1 p-2">
          <template v-for="(node,index) in listData" :key="node">
            <li>
              <label :for="node['Node-ID']">
                <input  v-if="isEdit" v-model="checkBoxList" type="checkbox" :checked="node.Status == 1" :value="node['Node-ID']+'_'+node['Status']" :id="node['Node-ID']" class="line-through w-6 h-6 align-bottom mr-2">
                <span >{{ index + 1 }}. </span>
                <span :class="listType == '已完成'?'line-through':''">
                  {{ node.Name }} - {{ node.Content }} 
                </span>
              </label>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </div>
</template>

<script >
import {  ref,watch,inject } from 'vue';

export default ({
  props: {
    listType: String,
    listData: Array,
  },
  emits: ['needRefresh'],
  setup(props,{ emit }) {
      const axios = inject('axios');
      const isEdit = ref(false);
      const checkBoxList = ref([]);
      let switchBtn = (type)=>{
          isEdit.value = !isEdit.value;
          if(type == 'submit' && checkBoxList.value.length != 0){
          axios.patch(`/myList/status/update`,{
            "checkBoxList" : checkBoxList.value
          })
          .then( (response) => {
            console.log(response.data);
            checkBoxList.value = [];
            emit('needRefresh');
          })
          .catch( (error) => console.log(error));

          }
      }
      
      watch(() => props.listData, () => {
        //如果使用者在編輯時，選擇其他日期，將按鈕還原成編輯
        checkBoxList.value = [];
        isEdit.value = false;
        // console.log(props.listData);
      });
      return{
        props,
        isEdit,
        switchBtn,
        checkBoxList
      }
    }
})

</script>

<style scoped>

</style>
