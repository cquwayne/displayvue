<template>
  <el-select v-model="currentItem" placeholder="请选择" style="width: 500px">
    <el-option
      v-for="item in sceneDataList"
      :key="item.index"
      :label="item.title"
      :value="item.id"
    >
    </el-option>
  </el-select>
</template>

<script>
export default {
  name: 'Assessment',
  data () {
    return {
      sceneDataList: [],

    }
  }
}
</script>

<style scoped>

</style>
