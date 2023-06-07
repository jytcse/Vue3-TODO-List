<template>
  <div class="Dashboard  h-[calc(100vh-4rem)] max-h-[calc(100vh-4rem)] overflow-y-auto w-screen flex flex-wrap p-8 gap-3">
    <div class="border-2 border-amber-100 bg-[#fff3e3]  
      w-[calc(75%-0.75rem)] rounded-2xl max-h-full shadow-inner p-5 overflow-auto">
      <div v-if="listData != null" class="flex flex-wrap gap-4 h-full">
        <ListBlock v-for="(category,index) in classifiedData" :key="category" :data="category" :index="index"></ListBlock>
      </div>
      <div v-else class="flex flex-wrap gap-4 justify-center items-center font-bold text-4xl h-full">本日還沒有應做事項</div>

    </div>

    <div class="w-3/12 rounded-3xl border-solid border-2 border-gray-300 p-5 overflow-y-auto flex flex-col max-h-[100%] justify-start">
      <div class="basis-2/12">
        <div>
          <select class="w-[100%] border p-2 outline-none hover:border-gray-800  transition-all duration-300" v-model="nowYear">
            <option value="2023">2023年</option>
            <option value="2024">2024年</option>
            <option value="2025">2025年</option>
          </select>
          
          <select class="w-[50%] border p-2 outline-none hover:border-gray-800  transition-all duration-300" v-model="nowMonth">
            <option v-for="month in 12"
              :key="month" 
              :value="month">
              {{ formatTime(month) }}月
          
            </option>
          </select>
          <select class="w-[50%] border p-2 outline-none hover:border-gray-800  transition-all duration-300"  v-model="nowDay">
            <option v-for="day in daysInMonth"
              :key="formatTime(day)" 
              :value="day">
              {{ formatTime(day) }}日
            </option>
          </select>
        </div>
        <div class="flex justify-center mt-4 mb-2">
          <button class="p-3 w-48 border rounded-s-sm hover:border-gray-800 transition-all duration-300" :class="page == 'list'?'bg-[#ffebd2]':''" @click="switchBtn('list')">事項</button>
          <button class="p-3 w-48 border rounded-e-sm hover:border-gray-800 transition-all duration-300" :class="page == 'newList'?'bg-[#ffebd2]':''" @click="switchBtn('newList')">建立新清單</button>
        </div>
      </div>
      <div v-if="page == 'list'">
        <ShowList :list-type="'未完成'" :list-data="(todoList)" @need-refresh="refresh"></ShowList>
        <ShowList :list-type="'已完成'" :list-data="(doneList)" @need-refresh="refresh" class="mt-2"></ShowList>
      </div>
      <div v-else class="h-full">
        <!-- 建立新清單 -->
        <NewListForm :now-year="nowYear" :now-month="nowMonth" :now-day="nowDay" @need-refresh="refresh"></NewListForm>

      </div>
    </div>

  </div>
</template>

<script>
import ShowList from '@/components/ShowList.vue';
import ListBlock from '@/components/ListBlock.vue';
import NewListForm from '@/components/NewListForm.vue';

import { onMounted,inject,ref,computed, watch} from 'vue';
export default {
  name: 'DashboardView',
  components: {
    ShowList,
    ListBlock,
    NewListForm
  },
  setup(){
    const axios = inject('axios');
    const listData = ref({});
    const todoList = ref([]);
    const doneList = ref([]);
    const classifiedData = ref({});
    const page = ref('list');
    const switchBtn = function(type){
      page.value = type;
    }
    //時間
    const today = new Date();
    const nowYear = ref(today.getFullYear());
    const nowMonth = ref(today.getMonth() + 1);
    const nowDay = ref(today.getDate());
    const daysInMonth = computed(() => {
      const month = nowMonth.value;
      const year = nowYear.value;
      const days = new Date(year, month, 0).getDate();
      return Array.from({ length: days }, (_, index) => index + 1);
    });
    const formatTime = (time) => {
      //補零
      return time < 10 ? '0' + time : time;
    };
    onMounted(() => {
      refresh();
    })
    watch([nowYear, nowMonth, nowDay], () => {
      refresh();
    });
    /**
     * ShowList元件更新todolist的狀態時要重新取得更新後的資料
     * @function refresh
     */
    function refresh(){
      GetMyList(nowYear.value,nowMonth.value,nowDay.value,todoList,doneList,classifiedData);
    }
    /**
     * 取得使用者的todolist
     * @function GetMyList
     * @param {string} year - year
     * @param {string} month - month
     * @param {string} day - day
     * @param {ref} todoList - todoList
     * @param {ref} doneList - doneList 
     * @param {ref} classifiedData - classifiedData 
     */
     function GetMyList(year,month,day,todoList,doneList,classifiedData){
      classifiedData.value = {};
      axios.get(`/myList/${year}/${month}/${day}`)
      .then( (response) => {
        if(response.data["success"]) {
          
          //將資料分成未完成跟完成
          if(response.data["message"] == '查無資料'){
            listData.value = null;
            todoList.value = null;
            doneList.value = null;
            //沒有資料的話右邊直接選擇建立新清單
            page.value = 'newList';
          }else{
            listData.value = response.data;
            todoList.value = listData.value.data.filter(item => item.Status === 0);
            doneList.value = listData.value.data.filter(item => item.Status === 1);
            page.value = 'list';
            // 依照類別名稱分類
            listData.value.data.forEach(item => {
              let name = item.Name;
              if (classifiedData.value[name]) {
                classifiedData.value[name].push(item);
              } else {
                classifiedData.value[name] = [item];
              }
            });
            // 未完成的項目放在前面
            for (let category in classifiedData.value) {
              classifiedData.value[category].sort((a, b) => {
                if (a.Status === 0 && b.Status !== 0) {
                  return -1;
                }
                if (a.Status !== 0 && b.Status === 0) {
                  return 1;
                }
                return 0;
              });
            }
          }
        }
      })
      .catch( (error) => console.log(error));
    }

    return{
      listData,
      todoList,
      doneList,
      switchBtn,
      nowYear,
      nowMonth,
      nowDay,
      daysInMonth,
      formatTime,
      classifiedData,
      refresh,
      page
    }
  }
}
</script>

<style scoped>
.newList{
  background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='8' ry='8' stroke='%23D7A480' stroke-width='5' stroke-dasharray='10' stroke-dashoffset='41' stroke-linecap='round'/%3e%3c/svg%3e");
  border-radius: 8px;
  
}
.myList::-webkit-scrollbar {
  width: 5px;
  display: none;
}
.myList:hover::-webkit-scrollbar {
  display: inline;
}
.myList::-webkit-scrollbar-track {
  background-color: #f1f1f1;
}

.myList::-webkit-scrollbar-thumb {
  background-color: rgb(166, 166, 166); 
  border-radius: 3px;
}

.myList::-webkit-scrollbar-thumb:hover {
  background-color: #555;
}
</style>