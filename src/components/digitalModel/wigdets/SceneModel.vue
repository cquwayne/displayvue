<template>
  <el-container class="SceneData">
      <el-header height="150px">
        <SceneBasic :sceneModel="sceneModel"></SceneBasic>
        <el-divider></el-divider>
      </el-header>
      <el-main>
        <el-table :data="inputFrameDataList" stripe style="width: 100%">
          <el-table-column
            label="物料"
            align="center">
            <template slot-scope="scope">
              <div v-for="item in scope.row['materialDataList']" :key="item.index" class="text item">
                {{item['material']?item['material']['title']:''}}
<!--                {{item['material']?item['material']['title']:''}} ： {{item['value']?item['value']:''}} {{item['unit']?item['unit']['title']:''}}-->
              </div>
            </template>
          </el-table-column>
<!--          <el-table-column-->
<!--            label="能源"-->
<!--            align="center">-->
<!--            <template slot-scope="scope">-->
<!--              <div v-for="item in scope.row['energyDataList']" :key="item.index" class="text item">-->
<!--                {{item['energy']?item['energy']['title']:''}}-->
<!--&lt;!&ndash;                {{item['energy']?item['energy']['title']:''}} ： {{item['value']?item['value']:''}} {{item['unit']?item['unit']['title']:''}}&ndash;&gt;-->
<!--              </div>-->
<!--            </template>-->
<!--          </el-table-column>-->
          <el-table-column
            label="设备"
            align="center">
            <template slot-scope="scope">
              <div v-for="item in scope.row['deviceDataList']" :key="item.index" class="text item">
                {{item['device']?item['device']['title']:''}}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="工艺参数"
            align="center">
            <template slot-scope="scope">
              <div v-for="item in scope.row['keyParameterDataList']" :key="item.index" class="text item">
                {{item['title']?item['title']:''}}
<!--                {{item['title']?item['title']:''}} :  {{item['description']?item['description']:''}}-->
              </div>
            </template>
          </el-table-column>
<!--          <el-table-column-->
<!--            label="工艺描述"-->
<!--            align="center">-->
<!--            <template slot-scope="scope">-->
<!--              <div v-if="scope.row['outputFrameDataList']" v-for="item in scope.row['outputFrameDataList']" :key="item.index" class="text item">-->
<!--                {{item['collectionDescription']?item['collectionDescription']:''}}-->
<!--              </div>-->
<!--            </template>-->
<!--          </el-table-column>-->
<!--          <el-table-column-->
<!--            label="环境负荷"-->
<!--            align="center">-->
<!--            <template slot-scope="scope">-->
<!--              <div v-if="scope.row['outputFrameDataList']&&scope.row['outputFrameDataList'][0]['envLoadDataList']"-->
<!--                   v-for="item in scope.row['outputFrameDataList'].length!==0?scope.row['outputFrameDataList'][0]['envLoadDataList']:null" :key="item.index" class="text item">-->
<!--                {{item['envLoad']?item['envLoad']['title']:''}}-->
<!--&lt;!&ndash;                {{item['envLoad']?item['envLoad']['title']:''}} ： {{ item['value']}} {{item['unit']?item['unit']['title']:''}}&ndash;&gt;-->
<!--              </div>-->
<!--            </template>-->
<!--          </el-table-column>-->
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button @click="updateModel(scope.row)" slot="reference">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
  </el-container>
</template>

<script>
import api from 'api'
import SceneBasic from '../../sceneInstanceData/widgets/SceneBasic'
import axios from "axios"
export default {
  name: 'SceneModel',
  components: {
    SceneBasic
  },
  data () {
    return {
      sceneModel: {},
      inputFrameDataList: [],
      sceneData: {},
      postInputFrameData: {
        sceneDataId: null,
        materialDataList: [],
        deviceDataList: [],
        keyParameterDataList: []
      },
      sceneDataId: 34,
      sceneModelId: 1,
      inputFrameId: 194
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.sceneModelId = to.params['sceneModelId']!==undefined?to.params['sceneModelId']:1
      let args = {
        url: '/sceneModel/' + vm.sceneModelId
      }
      api.get(args).then(res => {
        vm.sceneModel = res
      })
      vm.sceneDataId = to.params['sceneDataId']!==undefined?to.params['sceneDataId']:34
      vm.inputFrameId = to.params['inputFrameId']!==undefined?to.params['inputFrameId']:194
      vm.postInputFrameData.materialDataList = []
      vm.postInputFrameData.deviceDataList = []
      vm.postInputFrameData.keyParameterDataList = []
      axios.get('http://localhost:9000/api/manage/sceneData/' + vm.sceneDataId).then(res => {
        vm.sceneData = res.data
        vm.postInputFrameData.sceneDataId = vm.sceneData['id']
        if (vm.sceneData['inputFrameDataList'].length !== 0) {
          vm.sceneData['inputFrameDataList'][0]['materialDataList'].forEach((item) => {
            vm.postInputFrameData.materialDataList.push(item['materialId'])
          })
          vm.sceneData['inputFrameDataList'][0]['deviceDataList'].forEach((item) => {
            vm.postInputFrameData.deviceDataList.push(item['deviceId'])
          })
          vm.sceneData['inputFrameDataList'][0]['keyParameterDataList'].forEach((item) => {
            vm.postInputFrameData.keyParameterDataList.push(item['title'])
          })
        }
        vm.sceneData['inputFrameDataList'].forEach(item => {
          if (item['id']===vm.inputFrameId) {
            vm.inputFrameDataList.push(item)
          }
        })
      })
    })
  },
  beforeRouteLeave(to, from, next) {
    this.inputFrameDataList = []
    next()
  },
  methods: {
    updateModel(sceneModel) {

    }
  }
}
</script>

<style scoped lang="scss">
  .model{
    height: 100%;
  }
</style>
