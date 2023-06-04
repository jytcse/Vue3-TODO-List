<template>
  <div class="Dashboard  h-[calc(100vh-4rem)] max-h-[calc(100vh-4rem)] overflow-y-auto w-screen flex flex-wrap p-8 gap-3">
      <div class="border-2 border-amber-100 bg-[#fff3e3]  
      w-[calc(75%-0.75rem)] rounded-2xl max-h-full shadow-inner p-5 overflow-auto">

        <div class="flex flex-wrap gap-4 h-full items-start">
          <button class="newList w-[24%] shadow-sm rounded-lg" title="建立新的列表">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-full" viewBox="0 0 100 120">
              <line x1="50" y1="50" x2="50" y2="70" stroke="#864a28" stroke-width="4" />
              <line x1="40" y1="60" x2="60" y2="60" stroke="#864a28" stroke-width="4" />
            </svg>
          </button>

          <div v-for="n in 20" :key="n" class="w-[24%] h-[50%] bg-white  border-2 shadow-sm rounded-lg pt-2 pl-2 overflow-hidden">
            <div>
              <span class="text-3xl font-bold">6/4</span>
              <span>工作</span>
            </div>
            <hr class="mt-3 mx-auto">
            <div class="h-full overflow-y-auto myList">
              <ul>
                <li v-for="n in 20" :key="n">{{ n }}</li>
              </ul>
            </div>
          </div>
          
        </div>

      </div>

      <div class="chart  2xl:w-3/12 xl:w-3/12 rounded-3xl border-solid border-2 border-gray-300 ">

      </div>

  </div>
</template>

<script>

export default {
  name: 'DashboardView',
  components: {
   
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