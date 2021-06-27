import Vue from 'vue'
import Router from 'vue-router'
import Home from '../components/Home'
import SceneModel from '../components/digitalModel/wigdets/SceneModel'
import ModelManage from '../components/digitalModel/ModelManage'
import ProcessManage from '../components/digitalModel/ProcessManage'
import CreateDigitalModel from '../components/digitalModel/CreateDigitalModel'
import BaseDataManage from '../components/sceneInstanceData/BaseDataManage'
import SceneData from '../components/sceneInstanceData/SceneData'
import SceneFrameData from '../components/sceneInstanceData/SceneFrameData'
import SceneDataManage from '../components/sceneInstanceData/SceneDataManage'
import Knowledge from '../components/computeModel/Knowledge'
import ComputeModel from '../components/computeModel/ComputeModel'
import ExcelDisplay from '../components/computeModel/ExcelDisplay'
import Assessment from '../components/Assessment/Assessment'
import BaseInfo from '../components/Assessment/widgets/BaseInfo'
import Definition from '../components/Assessment/widgets/Definition'
import CraftCollection from '../components/Assessment/CraftCollection'
import MatterManage from '../components/Assessment/MatterManage'
import EvaluationManage from '../components/Assessment/EvaluationManage'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: Home,
      children: [
        {
          path: '/modelManage',
          name: 'ModelManage',
          component: ModelManage
        },
        {
          path: '/modelManage/:sceneModelId',
          name: 'SceneModel',
          component: SceneModel
        },
        {
          path: '/processManage/',
          name: 'ProcessManage',
          component: ProcessManage
        },
        {
          path: '/createDigitalModel/',
          name: 'CreateDigitalModel',
          component: CreateDigitalModel
        },
        {
          path: '/sceneDataManage',
          name: 'SceneDataManage',
          component: SceneDataManage
        },
        {
          path: '/sceneDataManage/sceneData/:sceneDataId',
          name: 'SceneData',
          component: SceneData
        },
        {
          path: '/sceneDataManage/sceneData/:sceneDataId/inputFrameData/:inputFrameDataId',
          name: 'SceneFrameData',
          component: SceneFrameData
        },
        {
          path: '/baseDataManage',
          name: 'BaseDataManage',
          component: BaseDataManage
        },
        {
          path: '/knowledge',
          name: 'Knowledge',
          component: Knowledge
        },
        {
          path: '/computeModel',
          name: 'ComputeModel',
          component: ComputeModel
        },
        {
          path: '/computeModel/excelDisplay',
          name: 'ExcelDisplay',
          component: ExcelDisplay
        },
        {
          path: '/craftCollection',
          name: 'CraftCollection',
          component: CraftCollection
        },
        {
          path: '/assessment',
          name: 'Assessment',
          component: Assessment,
          children: [
            {
              path: '/',
              name: 'BaseInfo',
              component: BaseInfo
            },
            {
              path: '/definition',
              name: 'Definition',
              component: Definition
            }
          ]
        },
        {
          path: '/matterManage',
          name: 'MatterManage',
          component: MatterManage
        },
        {
          path: '/evaluationManage',
          name: 'EvaluationManage',
          component: EvaluationManage
        }
      ]
    }
  ]
})
