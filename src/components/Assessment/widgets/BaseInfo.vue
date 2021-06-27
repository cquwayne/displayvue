<template>
  <el-form :model="sceneData" :rules="rules" ref="sceneData" label-width="120px">
    <el-form-item label="工艺名称" prop="name" size="small">
      <el-input v-model="sceneData.name" size="small"></el-input>
    </el-form-item>
    <el-form-item label="工艺类别" prop="type" size="small">
      <el-cascader
        v-model="sceneData.type"
        clearable
        :options="categories"
        :props="{ checkStrictly: true, expandTrigger: 'hover', label: 'title', value: 'id' }">
      </el-cascader>  <!--级联选择器，选择场景分类，三级场景分类-->
    </el-form-item>
    <el-form-item label="工艺共享范围" prop="range" size="small">
      <el-select v-model="sceneData.range" placeholder="请选择">
        <el-option v-for="item in rangeList"
                   :key="item"
                   :label="item"
                   :value="item"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="工艺描述" size="small">
      <el-input v-model="sceneData.description"></el-input>
    </el-form-item>
    <el-form-item label="单位产品重量" prop="weight" size="small">
      <el-input v-model="sceneData.weight">
        <template slot="append">kg</template>
      </el-input>
    </el-form-item>
    <el-form-item label="单位" prop="unit" size="small">
      <el-select v-model="sceneData.unit" placeholder="请选择">
        <el-option v-for="item in boundaryList"
                   :key="item"
                   :label="item"
                   :value="item"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="规格型号" size="small">
      <el-input v-model="sceneData.specification"></el-input>
    </el-form-item>
    <el-form-item label="系统边界" prop="boundary" size="small">
      <el-select v-model="sceneData.boundary" placeholder="请选择">
        <el-option v-for="item in boundaryList"
                   :key="item"
                   :label="item"
                   :value="item"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="目标应用与代表性类型" prop="represent" size="small">
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
        description: '',
        weight: '',
        unit: '',
        specification: '',
        boundary: '',
        represent: ''
      },
      rangeList: ['个人工艺', '团队工艺', '系统工艺'],
      boundaryList: ['从资源开采到产品废弃', '从资源开采到产品出厂', '自定义系统边界-后台'],
      representList: ['企业LCA-代表特定企业及供应链水平', '行业LCA-代表特定技术/全行业市场平均水平', '目标应用与代表类型3-待后台定义'],
      categories: {},
      rules: {
        name: [
          { required: true, message: '请输入工艺名称', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择工艺类别', trigger: 'change' }
        ],
        range: [
          { required: true, message: '请选择工艺共享范围', trigger: 'change' }
        ],
        weight: [
          { required: true, message: '请输入单位产品重量', trigger: 'blur' }
        ],
        unit: [
          { required: true, message: '请选择单位', trigger: 'change' }
        ],
        boundary: [
          { required: true, message: '请选择系统边界', trigger: 'change' }
        ],
        represent: [
          { required: true, message: '请选择目标代表性', trigger: 'change' }
        ]
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
