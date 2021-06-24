<!--第二级页面-->
<template>
  <el-container class="SceneData" style="width: 100%">
    <el-header>
      <el-card class="hover SceneBasic">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/sceneDataManage' }">所有铸造工艺场景</el-breadcrumb-item>
          <el-breadcrumb-item >{{sceneData['title']}}</el-breadcrumb-item>
        </el-breadcrumb>
      </el-card>
      <el-divider></el-divider>
    </el-header>
    <el-main>
      <el-table :data="sceneData['inputFrameDataList']" stripe style="width: 100%">
        <el-table-column
          label="物料"
          align="center">
          <template slot-scope="scope">
            <div v-for="item in scope.row['materialDataList']" :key="item.index" class="text item">
              {{item['material']?item['material']['title']:''}} ： {{item['value']?item['value']:''}} {{item['unit']?item['unit']['title']:''}}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="能源"
          align="center">
          <template slot-scope="scope">
            <div v-for="item in scope.row['energyDataList']" :key="item.index" class="text item">
              {{item['energy']?item['energy']['title']:''}} ： {{item['value']?item['value']:''}} {{item['unit']?item['unit']['title']:''}}
            </div>
          </template>
        </el-table-column>
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
              {{item['title']?item['title']:''}} :  {{item['description']?item['description']:''}}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="工艺描述"
          align="center">
          <template slot-scope="scope">
            <div v-if="scope.row['outputFrameDataList']" v-for="item in scope.row['outputFrameDataList']" :key="item.index" class="text item">
              {{item['collectionDescription']?item['collectionDescription']:''}}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="环境负荷"
          align="center">
          <template slot-scope="scope">
            <div v-if="scope.row['outputFrameDataList']&&scope.row['outputFrameDataList'][0]['envLoadDataList']"
                 v-for="item in scope.row['outputFrameDataList'].length!==0?scope.row['outputFrameDataList'][0]['envLoadDataList']:null" :key="item.index" class="text item">
              {{item['envLoad']?item['envLoad']['title']:''}} ： {{item['value']}} {{item['unit']?item['unit']['title']:''}}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
              <el-button @click="handleDetail(scope.row)" slot="reference">负荷数据</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
  </el-container>
</template>
<script>
import axios from "axios"
import SceneBasic from './widgets/SceneBasic'
export default {
  name: 'SceneData',
  components: {
    SceneBasic
  },
  data () {
    return {
      sceneData: {},
      postInputFrameData: {
        sceneDataId: null,
        materialDataList: [],
        deviceDataList: [],
        keyParameterDataList: []
      },
      sceneDataId: 34
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      let sceneDataId = to.params['sceneDataId']
      vm.postInputFrameData.materialDataList = []
      vm.postInputFrameData.deviceDataList = []
      vm.postInputFrameData.keyParameterDataList = []

      axios.get('http://localhost:9000/api/manage/sceneData/' + sceneDataId).then(res => {
        vm.sceneData = res.data
        let tem = res.data
        let inputs = []
        let input = [194,195,196,197]
        let flag = 0
        tem['inputFrameDataList'].forEach(tt => {
          flag = 0
          input.forEach(t => {
            if (t===tt['id']) {
              flag = 1
            }
          })
          if (flag===0) {
            inputs.push(tt)
          }
        })
        vm.sceneData['inputFrameDataList'] = inputs
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
      })
    })
  },
  methods: {
    handleDetail (row) {
      let params = {
        sceneDataId: row.sceneDataId,
        sceneData: this.sceneData,
        inputFrameDataId: row.id
      }
      this.$router.push({name: 'SceneFrameData', params: params})
    },
    goBack () {
      window.history.back()
    }
  }
}
</script>
<style scoped>

</style>
