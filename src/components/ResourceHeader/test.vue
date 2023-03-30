<template>
<div class="app-container">
  <resource_header
    :menu-list="resourceTypeList"
    :width="60"
    :height="60"
    @handleClick="handleClick"
  />
</div>
</template>

<script>
import resource_type from "@/mixins/resource_type";
export default {
  mixins:[resource_type],
  components: {
    resource_header: () => import("./index")
  },
  methods:{
    handleClick(item){
      console.log(item,'item类型')
    }
  }
}
</script>

<style scoped lang="scss">
</style>
