<template>
  <div class="basis-5/12">
    <div class="h-[50%]">
      <h1 class="font-bold text-2xl mb-2">{{ props.listType }}:</h1>
      <div>
        <!-- {{ props.listData }} -->
        <ul class="overflow-y-auto h-64 border flex flex-col gap-1 p-2">
          <template v-for="node in props.listData" :key="node">
            <li>
              <input type="checkbox" :checked="node.Status == 1" :id="node['Node-ID']" class="line-through w-6 h-6 align-bottom mr-2">
              <span :class="props.listType == '已完成'?'line-through':''">
                {{ node.Name }} - {{ node.Content }} 
              </span>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </div>
</template>

<script >
export default {
  props: {
    listType: String,
    listData: Object,
  },

  setup(props) {
      const name = 'ShowList';	
      return{
        name,
        props,
      }
    }
}

</script>

<style scoped>

</style>
