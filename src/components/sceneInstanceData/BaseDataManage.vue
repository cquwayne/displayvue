<template>
  <el-main>
    <h1>铸造工艺场景基础数据库</h1>
    <el-tabs type="border-card">
      <el-tab-pane v-for="item in tabPaneList" :key="item.index" :label="item.label">
        <el-table style="width: 100%" :data="item.data">
          <el-table-column
            v-for="column in item.columns"
            :label="column['columnComment']"
            :key="column.index"
            align="center">
            <template slot-scope="scope">
<!--              <div v-if="column['columnKey'] === 'MUL'">-->
<!--                {{scope.row[column['columnName'].substring(0, column['columnName'].length - 2)] ?-->
<!--                scope.row[column['columnName'].substring(0, column['columnName'].length - 2)]['title'] : scope.row[column['columnName']]}}-->
<!--              </div>-->
<!--              <div v-else>-->
<!--                {{ scope.row[column['columnName']] }}-->
<!--              </div>-->
              <div>
                {{ scope.row[column['columnName']] }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="操作" align="center" width="200">
            <template slot-scope="scope">
              <el-button>编辑</el-button>
              <el-button>删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </el-main>
</template>

<script>
// import api from 'api'
import axios from "axios";
export default {
  name: 'ProcessManage',
  data() {
    return {
      // processEntityList: [],
      // more: false,
      tableColumns: {
        device:[],
        material: [],
        energy: [],
        envload: []
      },
      tabPaneList: [
        {
          label: '设备',
          columns: [],
          data: []
        },
        {
          label: '环境负荷',
          columns: [],
          data:[]
        },
        {
          label: '物料',
          columns: [],
          data: []
        },
        {
          label: '能源',
          columns: [],
          data: []
        }
      ],
      currentLabel: '',
      currentColumns: [],
      currentData: []
    }
  },
  beforeRouteEnter (to, from, next){
    next(vm=> {
      axios.get('http://localhost:9000/api/system/tables').then(res => {
        vm.tabPaneList[0].columns = res.data.device.systemColumnList
        vm.tabPaneList[1].columns = res.data.envLoad.systemColumnList
        console.log(vm.tabPaneList[1].columns)
        vm.tabPaneList[2].columns = res.data.material.systemColumnList
        vm.tabPaneList[3].columns = res.data.energy.systemColumnList
        // vm.tableColumns.material = res.data.material.systemColumnList
        // vm.tableColumns.device = res.data.device.systemColumnList
        // vm.tableColumns.energy = res.data.energy.systemColumnList
        // vm.tableColumns.envLoad = res.data.envLoad.systemColumnList
      })
      setTimeout(1000)
      axios.get('http://localhost:8000/device/list').then(res => {
        vm.tabPaneList[0].data = res.data
      })
      axios.get('http://localhost:8000/envLoad/list').then(res => {
        vm.tabPaneList[1].data = res.data
        console.log(res.data)
      })
      axios.get('http://localhost:8000/material/list').then(res => {
        vm.tabPaneList[2].data = res.data
      })
      axios.get('http://localhost:8000/energy/list').then(res => {
        vm.tabPaneList[3].data = res.data
        console.log(res.data)
      })
  //     let args = {
  //       url: 'processEntity/list'
  //     }
  //     api.get(args).then(res => {
  //       vm.processEntityList = res
  //       console.log(res)
  //     })
  //     let arg = {
  //       url: 'modelEntity/list'
  //     }
  //     api.get(arg).then(res => {
  //       vm.modelEntity = res
  //     })
    })
  },
  methods: {
    getMore() {
      this.more = true
    }
  }
}
</script>

<style scoped>

</style>
