<template>
  <div>
    <el-row>
      <model-fbx v-if="!sceneVisible" src="static/models/fx0.fbx"></model-fbx>
      <model-fbx v-if="sceneVisible" src="static/models/fx1.fbx"></model-fbx>
    </el-row>
    <el-row>
      <el-select v-model="currentItem" placeholder="请选择" style="width: 500px">
        <el-option
          v-for="item in sceneDataList"
          :key="item.index"
          :label="item.title"
          :value="item.id"
        >
        </el-option>
      </el-select>
<!--      <el-button type="info" @click="rawData":disabled="viewRaw">查看场景过程原始数据</el-button>-->
      <el-button type="success" @click="enterFeature" :disabled="viewRaw">构建特征工程</el-button>
<!--      <el-button type="primary" @click="trainData" :disabled="viewTrain">查看训练数据</el-button>-->
      <el-button type="warning" @click="resolutionIterative" :disabled="doTrain">实施迭代建模</el-button>
<!--      <el-button type="danger" @click="modelFeature" style="margin-left: 27px">模型特征</el-button>-->
      <el-button type="danger" @click="modelFeature" :disabled="featureVisible">模型特征分析</el-button>
      <el-button type="info" @click="envLoadCompute" :disabled="featureVisible">负荷计算</el-button>
    </el-row>
    <el-dialog :visible.sync="featureExplain" :title="explainTitle">
      <el-image
        fit="fill"
        :src="featureImage"
      >
      </el-image>
      <el-button @click="changeImage" style="margin: 0 0 5px 75%">{{nextTitle}}</el-button>
    </el-dialog>
    <el-dialog
      title="规划信息输入"
      :visible.sync="computeVisible"
      style="top: 10%"
    >
      <el-form :inline="true" label-width="100px" v-for="item in predictList" :key="item.index">
        <el-col :span="12">
          <el-form-item :label="item">
            <el-input v-model="form[item]" style="width: auto"></el-input>
          </el-form-item>
        </el-col>
      </el-form>
      <el-tag style="margin-left: 57px">粉尘 计算值:  {{predictValue}}</el-tag>
      <el-button style="margin: 0 0 10px 400px" type="primary" @click="compute">计算</el-button>
    </el-dialog>
    <el-dialog title="构建特征工程" :visible.sync="viewTrain">
      <el-row>
        <el-col :span="8" type="flex" justify="space-around" align="middle">
          <h1>
            场景原始数据项
          </h1>
          <el-col v-for="item in originalIndexes" :key="item.index" :span="12">
            <el-tag closable style="width: 107px;margin-top: 2px" @close="handleClose(item)">{{item}}</el-tag>
          </el-col>
          <el-button type="info" @click="rawData":disabled="viewRaw" style="margin: 10px 0 5px 0">
            查看场景过程原始数据
          </el-button>
        </el-col>
        <el-col :span="8" type="flex" justify="space-around" align="middle" style="height: 400px;">
          <el-button type="success" @click="featureProject":disabled="viewRaw" style="position:relative;top:50%;transform: translateY(-50%);">
            知识驱动构建特征工程
          </el-button>
        </el-col>
        <el-col :span="8" type="flex" justify="space-around" align="middle">
          <h1>
            计算模型训练数据项
          </h1>
          <el-col v-for="item in trainIndexes" :key="item.index" :span="12">
            <el-tag closable style="width: 107px;margin-top: 2px" @close="handleClose2(item)">{{item}}</el-tag>
          </el-col>
          <el-button type="primary" @click="trainData" :disabled="doTrain" style="margin: 10px 0 5px 0">
            查看训练数据
          </el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
import api from 'api'
export default {
  name: 'Process',
  data () {
    return {
      sceneVisible: false,
      currentItem: '',
      sceneData: {},
      autoGenerateColumns: false,
      spread: null,
      excelData: [],
      fieldList: [],
      rawDataVisible: false,
      sceneDataList: [],
      viewRaw: true,
      viewTrain: false,
      doTrain: true,
      featureVisible: true,
      featureExplain: false,
      computeVisible: false,
      explainTitle: '模型特征总体分析',
      featureImage: '../static/模型特征总体分析.png',
      nextTitle: '特征贡献度分析',
      count: 0,
      // predictList: [],
      predictList: ["废钢消耗M", "预热温度", "风量", "生铁消耗", "炉料总量", "废钢消耗", "扒渣次数", "吃砂量", "焦铁比", "焦钢比", "加料次数", "炉体容积", "机械加工余量", "焦炭消耗"],
      knowledgeList: [],
      timer: null,
      form: {},
      predictValue: null,
      originalIndexes: [],
      trainIndexes: [],
      indexForm: []
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      let params = {
        categoryId: 5,
        currentPage: 1,
        pageSize: 10
      }
      axios.get('http://localhost:9000/api/category', {params: params}).then(res => {
        vm.sceneDataList = res['data']['data']
      })
    })
  },
  watch: {
    currentItem(newValue, oldValue){
      if (newValue!=='') {
        this.viewRaw = false
      }
      this.sceneVisible = !this.sceneVisible
      axios.get('http://localhost:9000/api/manage/sceneData/' + newValue).then(res => {
        this.sceneData.id = res.data.id
        this.sceneData.title = res.data.title
        this.sceneData.category = res.data.category.title
        this.sceneData.description = res.data.description
        this.sceneData.materialDataList = res.data.inputFrameDataList[0].materialDataList
        this.sceneData.energyDataList = res.data.inputFrameDataList[0].energyDataList
        this.sceneData.deviceDataList = res.data.inputFrameDataList[0].deviceDataList
        this.sceneData.keyParameterDataList = res.data.inputFrameDataList[0].keyParameterDataList
        this.sceneData.envLoadDataList = res.data.inputFrameDataList[0].envLoadDataList
        this.sceneData.outputPartDataList = res.data.inputFrameDataList[0].outputPartDataList
        let args = {
          url: 'knowledge/dataIndexes',
          params: {
            sceneDataTitle: this.sceneData.title,
            index: 'originalIndexes'
          }
        }
        api.get(args).then(res => {
          this.originalIndexes = res
          console.log(this.originalIndexes)
        })
      })
    }
  },
  methods: {
    rawData() {
      this.viewTrain = false
      this.$router.push({name: 'ExcelDisplay', params: {sceneDataTitle: this.sceneData.title}})
    },
    enterFeature() {
      // this.doTrain = false
      this.viewTrain = true
    },
    featureProject() {
      let args = {
        url: 'knowledge/inference',
        params: {
          sceneData: this.sceneData
        }
      }
      api.post(args).then(res => {
        if (res) {
          let arg = {
            url: 'knowledge/dataIndexes',
            params: {
              sceneDataTitle: this.sceneData.title,
              index: 'trainIndexes'
            }
          }
          api.get(arg).then(res => {
            this.trainIndexes = res
            console.log(this.trainIndexes)
          })
          this.count = res.count
          this.knowledgeList = res.knowledgeList
          this.$notify({
            title: '构建成功',
            message: '共命中了'+this.count+'条规则！',
            type: 'success',
            duration: 5700
          })
          // this.viewTrain = false
          this.doTrain = false
          this.knowledgeList.forEach(item => {
            this.timer = window.setTimeout(() => {
              this.$notify({
                title: '命中规则',
                message: item,
                position: 'bottom-right',
                duration: 4500
              })
            }, 0)
          })
        } else {
          this.$notify({
            title: '构建失败',
            message: '请重新构建特征工程！！！',
            type: 'warning',
            duration: 0
          })
        }
      })
    },
    trainData() {
      this.viewTrain = false
      this.$router.push({name: 'ExcelDisplay', params: {sceneDataTitle: this.sceneData.title + 'train'}})
    },
    resolutionIterative() {
      let args = {
        url: 'sceneData/compute',
        params: {
          sceneTitle: this.sceneData.title
        }
      }
      api.get(args).then(res => {
        if (res) {
          alert('成功')
          this.featureVisible = false
          this.predictList = res
        } else {
          alert('失败')
        }
      })
    },
    modelFeature() {
      this.featureExplain = true
    },
    envLoadCompute() {
      this.computeVisible = true
    },
    compute() {
      console.log(this.form)
      console.log(this.sceneData.title)
      let args = {
        url: 'sceneData/featureCompute',
        params: {
          sceneTitle: this.sceneData.title,
          featureList: this.form
        }
      }
      api.post(args).then(res => {
        this.predictValue = res
      })
    },
    changeImage() {
      if (this.explainTitle === '模型特征总体分析') {
        this.explainTitle = '特征贡献度分析'
        this.featureImage = '../static/特征贡献度分析.png'
        this.nextTitle = '模型特征总体分析'
      } else {
        this.explainTitle = '模型特征总体分析'
        this.featureImage = '../static/模型特征总体分析.png'
        this.nextTitle = '特征贡献度分析'
      }
    },
    handleClose(item) {
      this.originalIndexes.splice(this.originalIndexes.indexOf(item), 1);
    },
    handleClose2(item) {
      this.trainIndexes.splice(this.trainIndexes.indexOf(item), 1);
    },
  }
}
</script>

<style scoped>
  .sample-tutorial {
    position: relative;
    height: 100%;
    overflow: hidden;
  }
  .sample-spreadsheets {
    width: 100%;
    height: 100%;
  }
</style>
