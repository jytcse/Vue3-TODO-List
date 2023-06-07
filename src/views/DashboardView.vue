<template>
  <div class="Dashboard  h-[calc(100vh-4rem)] max-h-[calc(100vh-4rem)] overflow-y-auto w-screen flex flex-wrap p-8 gap-3">
    <div class="border-2 border-amber-100 bg-[#fff3e3]  
      w-[calc(75%-0.75rem)] rounded-2xl max-h-full shadow-inner p-5 overflow-auto">
      <div class="flex flex-wrap gap-4 h-full">
        <button class="newList w-[24%] h-[50%] shadow-sm rounded-lg" title="建立新的列表">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-full" viewBox="0 0 100 120">
            <line x1="50" y1="50" x2="50" y2="70" stroke="#864a28" stroke-width="4" />
            <line x1="40" y1="60" x2="60" y2="60" stroke="#864a28" stroke-width="4" />
          </svg>
        </button>
        <ListBlock v-for="(category,index) in classifiedData" :key="category" :data="category" :index="index"></ListBlock>
      </div>
    </div>

    <div class="w-3/12 rounded-3xl border-solid border-2 border-gray-300 p-5 overflow-y-auto flex flex-col max-h-[100%] justify-start">
      <div class="basis-2/12">
        <div>
          <select class="w-[100%] border p-2" v-model="nowYear">
            <!-- <option v-for="year in 3" :key="year" :value="nowYear + year - 1">{{ nowYear }}年</option> -->
            <option value="2023">2023年</option>
            <option value="2024">2024年</option>
            <option value="2025">2025年</option>
          </select>
          
          <select class="w-[50%] border p-2" v-model="nowMonth">
            <option v-for="month in 12"
              :key="month" 
              :value="month">
              {{ formatTime(month) }}月
          
            </option>
          </select>
          <select class="w-[50%] border p-2"  v-model="nowDay">
            <option v-for="day in daysInMonth"
              :key="formatTime(day)" 
              :value="day">
              {{ formatTime(day) }}日
            </option>
          </select>
        </div>
        <div class="flex justify-center mt-4 mb-2">
          <button class="p-3 w-48 border rounded-s-sm">事項</button>
          <button class="p-3 w-48 border rounded-e-sm">圖表</button>
        </div>
      </div>
      <ShowList :list-type="'未完成'" :list-data="(todoList)" @need-refresh="refresh"></ShowList>
      <ShowList :list-type="'已完成'" :list-data="(doneList)" @need-refresh="refresh"></ShowList>
    </div>

  </div>
</template>

<script>
import ShowList from '@/components/ShowList.vue';
import ListBlock from '@/components/ListBlock.vue';

import { onMounted,inject,ref,computed, watch} from 'vue';
export default {
  name: 'DashboardView',
  components: {
    ShowList,
    ListBlock
  },
  setup(){


    const axios = inject('axios');
    const listData = ref({});
    const todoList = ref([]);
    const doneList = ref([]);
    const classifiedData = ref({});
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
      GetMyList(nowYear.value,nowMonth.value,nowDay.value,todoList,doneList,classifiedData);
    })
    watch([nowYear, nowMonth, nowDay], () => {
      GetMyList(nowYear.value,nowMonth.value,nowDay.value,todoList,doneList,classifiedData);
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
            todoList.value = null;
            doneList.value = null;
            
          }else{
            listData.value = response.data;
            todoList.value = listData.value.data.filter(item => item.Status === 0);
            doneList.value = listData.value.data.filter(item => item.Status === 1);
            
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
      nowYear,
      nowMonth,
      nowDay,
      daysInMonth,
      formatTime,
      classifiedData,
      refresh
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