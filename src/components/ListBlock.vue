<template >
  <div class="w-[24%] h-[50%] bg-white  border-2 shadow-sm rounded-lg p-3 overflow-hidden">
    <div>
      <div class="h-[50%] w-full">
        <span class="font-bold text-2xl ml-2 mb-2 text-center">{{ index }} </span>
        <span class="font-bold text-sm ml-1 mb-2">{{ data[0].Date.replaceAll('-','/').slice(5) }}</span>
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
export default {
  props: {
    data: Object,
    index :String,
  },

  setup(props) {
      const name = 'ListBlock';	
      return{
        name,
        props,
      }
    }
}

</script>

<style scoped>

</style>
