<template>
  <el-form ref="form" :model="sceneData" label-width="120px">
    <el-form-item label="工艺名称">
      <el-input v-model="sceneData.name"></el-input>
    </el-form-item>
    <el-form-item label="工艺类别">
      <el-cascader
        v-model="sceneData.type"
        clearable
        :options="categories"
        :props="{ checkStrictly: true, expandTrigger: 'hover', label: 'title', value: 'id' }">
      </el-cascader>  <!--级联选择器，选择场景分类，三级场景分类-->
    </el-form-item>
    <el-form-item label="工艺共享范围">
      <el-select v-model="sceneData.range" placeholder="请选择">
        <el-option v-for="item in rangeList"
                   :key="item"
                   :label="item"
                   :value="item"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="工艺描述">
      <el-input v-model="sceneData.description"></el-input>
    </el-form-item>
    <el-form-item label="单位产品重量">
      <el-select v-model="sceneData.range" placeholder="请选择">
        <el-option v-for="item in rangeList"
                   :key="item.value"
                   :label="item.label"
                   :value="item.value"></el-option>
      </el-select>kg
    </el-form-item>
    <el-form-item label="单位">
      <el-input v-model="sceneData.unit"></el-input>
    </el-form-item>
    <el-form-item label="规格型号">
      <el-input v-model="sceneData.specification"></el-input>
    </el-form-item>
    <el-form-item label="系统边界">
      <el-select v-model="sceneData.boundary" placeholder="请选择">
        <el-option v-for="item in boundaryList"
                   :key="item"
                   :label="item"
                   :value="item"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="目标应用与代表性类型">
      <el-select v-model="sceneData.represent" placeholder="请选择">
        <el-option v-for="item in representList"
                   :key="item"
                   :label="item"
                   :value="item"></el-option>
      </el-select>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'BaseInfo',
  data () {
    return {
      sceneData: {
        name: '',
        type: '',
        range: '',
        unit: '',
        specification: '',
        boundary: '',
        represent: ''
      },
      rangeList: ['个人工艺', '团队工艺', '系统工艺'],
      boundaryList: ['从资源开采到产品废弃', '从资源开采到产品出厂', '自定义系统边界-后台'],
      representList: ['企业LCA-代表特定企业及供应链水平', '行业LCA-代表特定技术/全行业市场平均水平', '目标应用与代表类型3-待后台定义'],
      categories: {

      }
    }
  },
  methods: {
    onSubmit () {
      console.log('submit!')
    }
  }
}
</script>

<style scoped>

</style>
