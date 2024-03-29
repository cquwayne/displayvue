<template>
  <div class="appcontainer">
    <div class="flow-menu">
      <div class="menu-item" v-for="item in menueList" draggable="true" @dragstart="drag(item)">
        <i class="el-icon-s-tools"></i>
        <div>{{item.title}}</div>
      </div>
      <hr>
      <div class="menu-item" @click="isConnect=true">
        <i class="el-icon-bottom-right"></i>
        <div>连线</div>
      </div>
      <div class="menu-item" @click="isConnect=false">
        <i class="el-icon-rank"></i>
        <div>选择</div>
      </div>
    </div>
    <div class="flow-detail">
      <div id="flowContent"
           ref="flowContent"
           @drop="drop($event)"
           @dragover="allowDrop($event)"
           @click="editFlow()"
           @dblclick="isConnect=false">
        <sceneNode v-for="node in sceneData.nodeList" :key="node.index"
                  :node="node"
                  :id="node.id"
                  :isconnect="isConnect"
                  @delete-node="deleteNode"
                  @change-node-site="changeNodeSite"
                  @edit-node="editNode">
        </sceneNode>
      </div>
      <div class="savebtn">
        <el-button type="primary" @click="saveData()">保 存</el-button>
      </div>
    </div>
    <div class="flow-edit">
      <div class="flow-edit-content">
        <edit-digital-model ref="flowEdit" v-show="editType=='flow'" @chang-to-front-level="changeToFrontLevel"></edit-digital-model>
        <edit-node ref="nodeForm" v-show="editType=='node'" @chang-to-next-level="changeToNextLevel"></edit-node>
        <edit-line ref="lineForm" v-show="editType=='line'" @line-save="lineLabelSave"></edit-line>
      </div>
    </div>
  </div>
</template>

<script>
import api from 'api'
import axios from 'axios'
import {jsPlumb} from 'jsplumb'
import sceneNode from './wigdets/sceneNode.vue'
import editDigitalModel from './wigdets/editDigitalModel.vue'
import editNode from './wigdets/editNode.vue'
import editLine from './wigdets/editLine.vue'
export default {
  name: 'flowMain',
  data () {
    return {
      menueList: [],
      jsPlumb: null, // jsPlumb 实例
      index: 1,
      // 默认设置参数
      jsplumbSetting: {
        // 动态锚点、位置自适应
        Anchors: ['Top', 'TopCenter', 'TopRight', 'TopLeft', 'Right', 'RightMiddle', 'Bottom', 'BottomCenter',
          'BottomRight', 'BottomLeft', 'Left', 'LeftMiddle'
        ],
        Container: 'flowContent',
        // 连线的样式 StateMachine、Flowchart,有四种默认类型：Bezier（贝塞尔曲线），Straight（直线），Flowchart（流程图），State machine（状态机）
        Connector: 'Flowchart',
        // 这个是鼠标拉出来的线的属性
        ConnectionOverlays: [
          ['Label', {
            title: '',
            id: 'label',
            cssClass: 'csslabel'
          }]
        ],
        // 鼠标不能拖动删除线
        ConnectionsDetachable: false,
        // 删除线的时候结点不删除
        DeleteEndpointsOnDetach: false,
        // 连线的端点
        // Endpoint: ["Dot", {radius: 5}],
        Endpoint: ['Rectangle', {
          height: 10,
          width: 10
        }],
        // 线端点的样式
        EndpointStyle: {
          fill: 'rgba(255,255,255,0)',
          outlineWidth: 1
        },
        LogEnabled: true, // 是否打开jsPlumb的内部日志记录
        // 绘制线
        PaintStyle: {
          stroke: '#000000',
          strokeWidth: 2
        },
        // 绘制箭头
        Overlays: [
          ['Arrow', {
            width: 8,
            length: 8,
            location: 1
          }]
        ],
        RenderMode: 'svg'
      },
      // jsplumb连接参数
      jsplumbConnectOptions: {
        isSource: true,
        isTarget: true,
        // 动态锚点、提供了4个方向 Continuous、AutoDefault
        anchor: 'Continuous'
      },
      jsplumbSourceOptions: {
        filter: '.flow-node-drag', // 触发连线的区域
        /* "span"表示标签，".className"表示类，"#id"表示元素id */
        filterExclude: false,
        anchor: 'Continuous',
        allowLoopback: false
      },
      jsplumbTargetOptions: {
        filter: '.flow-node-drag',
        /* "span"表示标签，".className"表示类，"#id"表示元素id */
        filterExclude: false,
        anchor: 'Continuous',
        allowLoopback: false
      },
      // 是否加载完毕
      loadEasyFlowFinish: false,
      // 数据
      sceneData: {
        id: this.getUUID(),
        title: '工艺过程',
        remark: '',
        nodeList: [],
        lineList: []
      },
      currentItem: '', // 临时存添加的元素
      isConnect: false, // 判断是否连接
      timer: null, // 定时器,判断单双击,
      currentConnect: '', // 当前的连接线
      currentLine: '', // 当前连接线数据
      editType: '', // 编辑的类型,
      sceneDataId: '4d6991c1-7692-4e8a-8ef9-02fcad0bb25f',
      upLevelId: [],

    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      let args = {
        url: 'sceneModel/list'
      }
      // 获得场景模型
      api.get(args).then(res => {
        vm.menueList = res
      })
      if (to.params['sceneDataId']!==undefined) {
        vm.sceneDataId = to.params['sceneDataId']
        if (vm.jsPlumb) {
          vm.jsPlumb.deleteEveryConnection()
          vm.jsPlumb = jsPlumb.getInstance()
          vm.$nextTick(() => {
            vm.init()
          })
        }
      }
    })
  },
  beforeRouteLeave(to, from, next) {
    this.jsPlumb = jsPlumb.getInstance()
    next()
    window.location.reload()
  },
  components: {
    sceneNode,
    editDigitalModel,
    editNode,
    editLine
  },
  created () {},
  mounted () {
    this.jsPlumb = jsPlumb.getInstance()
    this.$nextTick(() => {
      this.init()
    })
    this.editFlow()
  },
  methods: {
    async init () {
      const _this = this
      await api.get({url: 'sceneData', params: {id: this.sceneDataId}}).then(async res => {
        this.sceneData = res
        console.log(res)
      })
      this.jsPlumb.ready(function () {
        // 导入默认配置
        _this.jsPlumb.importDefaults(_this.jsplumbSetting)
        // 会使整个jsPlumb立即重绘。
        _this.jsPlumb.setSuspendDrawing(false, true)
        // 初始化结点
        _this.loadEasyFlow()
        // 单点连接线（编辑label）,
        _this.jsPlumb.bind('click', function (conn, originalEvent) {
          // clearTimeout(this.timer);
          // this.timer = setTimeout(function () { // 这里采用执行自定义事件的方式
          //    console.log("click", conn);
          //    _this.editLine(conn);
          // }, 300); // 延迟300ms执行单击事件,区分双击事件
          console.log('click', conn)
          _this.editLine(conn)
          console.log(conn.getOverlay('label'))
          // conn.getOverlay("label").setLabel('大肥肚'); //初始化label
        })
        // 双击连接线（删除）,
        _this.jsPlumb.bind('dblclick', function (conn, originalEvent) {
          clearTimeout(this.timer)
          console.log('dblclick', conn)

          _this.$confirm('确定删除所点击的线吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            _this.jsPlumb.deleteConnection(conn)
          }).catch(() => { })
        })
        // 连线
        _this.jsPlumb.bind('connection', function (evt) {
          // console.log('connection', evt)
          let from = evt.source.id
          let to = evt.target.id
          if (_this.loadEasyFlowFinish) {
            _this.sceneData.lineList.push({
              from: from,
              to: to,
              title: '',
              id: _this.getUUID(),
              sceneDataId: _this.sceneData.id,
              remark: ''
            })
          };
          setTimeout(function () {
            _this.editLine(evt.connection)
          }, 100)
        })

        // 删除连线
        _this.jsPlumb.bind('connectionDetached', function (evt) {
          console.log('connectionDetached', evt)
          _this.deleteLine(evt.sourceId, evt.targetId)
        })

        // 改变线的连接结点
        _this.jsPlumb.bind('connectionMoved', function (evt) {
          console.log('connectionMoved', evt)
          _this.changeLine(evt.originalSourceId, evt.originalTargetId)
        })

        // 单击endpoint
        // jsPlumb.bind("endpointClick", function (evt) {
        //   console.log('endpointClick', evt)
        // })
        //
        // // 双击endpoint
        // jsPlumb.bind("endpointDblClick", function (evt) {
        //   console.log('endpointDblClick', evt)
        // })

        // contextmenu 右键
        _this.jsPlumb.bind('contextmenu', function (evt) {
          console.log('contextmenu', evt)
        })

        // beforeDrop
        _this.jsPlumb.bind('beforeDrop', function (evt) {
          console.log('beforeDrop', evt)
          let from = evt.sourceId
          let to = evt.targetId
          if (from === to) {
            _this.$message.error('不能连接自己')
            return false
          }
          if (_this.hasLine(from, to)) {
            _this.$message.error('不能重复连线')
            return false
          }
          if (_this.hashOppositeLine(from, to)) {
            _this.$message.error('不能回环哦')
            return false
          }
          return true
        })

        // beforeDetach
        _this.jsPlumb.bind('beforeDetach', function (evt) {
          console.log('beforeDetach', evt)
        })
      })
    },
    // 加载流程图
    loadEasyFlow () {
      // 初始化结点
      for (let i = 0; i < this.sceneData.nodeList.length; i++) {
        let node = this.sceneData.nodeList[i]
        // 设置源点，可以拖出线连接其他结点
        this.jsPlumb.makeSource(node.id, this.jsplumbSourceOptions)
        // // 设置目标点，其他源点拖出的线可以连接该结点
        this.jsPlumb.makeTarget(node.id, this.jsplumbTargetOptions)
        // jsPlumb.addEndpoint(node.id)
        // 设置可拖拽
        // jsPlumb.draggable(node.id, {
        //     containment: 'parent',
        //     grid: [10, 10]
        // })

        this.jsPlumb.draggable(node.id, {
          containment: 'parent'
        })

        // jsPlumb.draggable(node.id)
      }

      // 初始化连线
      for (let i = 0; i < this.sceneData.lineList.length; i++) {
        let line = this.sceneData.lineList[i]
        let connection = this.jsPlumb.connect({
          source: line.from,
          target: line.to
        }, this.jsplumbConnectOptions)

        connection.getOverlay('label').setLabel(line.title) // 初始化label
      }
      this.$nextTick(function () {
        this.loadEasyFlowFinish = true
        this.editFlow()
      })
    },
    // 添加新的结点
    addNode (temp) {
      this.sceneData.nodeList.push(temp)
      this.$nextTick(function () {
        this.jsPlumb.makeSource(temp.id, this.jsplumbSourceOptions)
        this.jsPlumb.makeTarget(temp.id, this.jsplumbTargetOptions)
        this.jsPlumb.draggable(temp.id, {
          containment: 'parent'
        })
      })
    },
    // 删除线
    deleteLine (from, to) {
      this.sceneData.lineList = this.sceneData.lineList.filter(function (line) {
        return line.from !== from && line.to !== to
      })
    },
    // 改变连线
    changeLine (oldFrom, oldTo) {
      this.deleteLine(oldFrom, oldTo)
    },
    // 改变结点的位置
    changeNodeSite (data) {
      for (var i = 0; i < this.sceneData.nodeList.length; i++) {
        let node = this.sceneData.nodeList[i]
        if (node.id === data.nodeId) {
          node.left = data.left
          node.top = data.top
        }
      }
    },
    // 删除结点
    deleteNode (nodeId) {
      this.$confirm('确定要删除结点' + nodeId + '?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false
      }).then(() => {
        // this.sceneData.nodeList = this.sceneData.nodeList.filter(function(node) {
        // if (node.id === nodeId) {
        // node.show = false
        // }
        // return true
        // })
        this.sceneData.nodeList.forEach((item, index) => {
          if (item.id === nodeId) {
            this.sceneData.nodeList.splice(index, 1)
          }
        })

        this.$nextTick(function () {
          console.log('删除' + nodeId)
          this.jsPlumb.removeAllEndpoints(nodeId)
        })
      }).catch(() => {})
      return true
    },
    // 编辑结点
    editNode (nodeId) {
      // console.log('编辑结点', nodeId)
      this.editType = 'node'
      this.$nextTick(function () {
        this.$refs.nodeForm.init(this.sceneData, nodeId)
      })
    },
    //编辑管道
    editLine (conn) {
      var _this = this
      _this.currentConnect = conn
      _this.sceneData.lineList.forEach(function (item, index) {
        if (item.from === conn.sourceId && item.to === conn.targetId) {
          _this.currentLine = item
          _this.editType = 'line'
          _this.$nextTick(function () {
            _this.$refs.lineForm.init(item)
          })
        }
      })
    },
    // 删除线
    delLine (conn) {
      this.$confirm('确定删除所点击的线吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.jsPlumb.deleteConnection(conn)
      }).catch(() => {})
    },
    // 是否具有该线
    hasLine (from, to) {
      for (var i = 0; i < this.sceneData.lineList.length; i++) {
        var line = this.sceneData.lineList[i]
        if (line.from === from && line.to === to) {
          return true
        }
      }
      return false
    },
    // 是否含有相反的线
    hashOppositeLine (from, to) {
      return this.hasLine(to, from)
    },
    lineLabelSave (line) {
      this.currentConnect.getOverlay('label').setLabel(line.title)
    },
    drag (item) {
      this.currentItem = item
    },
    drop (event) { //释放模型创建新的结点
      //新结点的数据
      let temp = {
        id: this.getUUID(),
        sceneDataId: this.sceneDataId,   //所属工艺场景ID
        title: this.currentItem.title.substring(0,this.currentItem.title.length-4),
        top: event.offsetY + 'px',
        left: event.offsetX + 'px',
        sceneData: {},
        sceneModelId: this.currentItem.sceneModelId,  //9000中的场景模型id
        InputFrameId: this.currentItem.inputFrameId  //9000中的输入帧模型id
      }
      let args = {
        url: 'http://localhost:9000/api/manage/sceneData/' + temp.sceneModelId
      }
      axios.get(args.url).then(res => {
        temp.sceneData = res.data
        let inputList = []
        inputList.push(res.data['inputFrameDataList'].pop())
        temp.sceneData['inputFrameDataList']=inputList
        this.addNode(temp)
        this.editNode(temp.id)
      })
    },
    allowDrop (event) {
      event.preventDefault()
    },
    //获取唯一标识
    getUUID () {
      var s = []
      var hexDigits = '0123456789abcdef'
      for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
      }
      s[14] = '4' // bits 12-15 of the time_hi_and_version field to 0010
      s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1) // bits 6-7 of the clock_seq_hi_and_reserved to 01
      s[8] = s[13] = s[18] = s[23] = '-'
      var uuid = s.join('')
      return uuid
    },
    // 保存数据
    saveData () {

      let args = {
        url: 'sceneData',
        params: this.sceneData
      }
      console.log(this.sceneData)
      // api.post(args).then(res => {
      //   if (res) {
      //     alert('成功！！')
      //   } else {
      //     alert('失败！！')
      //   }
      // })
    },
    //当焦点没在结点上时显示当前工艺过程信息
    editFlow () {
      this.editType = 'flow'
      this.$nextTick(function () {
        this.$refs.flowEdit.init(this.sceneData)
      })
    },
    //去往下一层级
    changeToNextLevel(sceneDataId,upLevelId) {
      this.upLevelId.push(upLevelId)
      this.sceneDataId = sceneDataId
      this.jsPlumb.deleteEveryConnection()
      this.jsPlumb = jsPlumb.getInstance()
      this.$nextTick(() => {
        this.init()
      })
    },
    //回到上一层级，上一层级的工艺场景id放在upLevelId这个数组里面，如果数组为空，直接最上层工艺场景
    changeToFrontLevel () {
      if (this.upLevelId.length===0) {
        history.go(0)
      }else {
        this.sceneDataId = this.upLevelId.pop()
        this.jsPlumb.deleteEveryConnection()
        this.jsPlumb = jsPlumb.getInstance()
        this.$nextTick(() => {
          this.init()
        })
      }
    }
  }
}
</script>

<style>
  .appcontainer {
    display: flex;
    /*height: calc(100vh - 20px);*/
    color: #606266;
  }

  .flow-detail {
    flex: 1;
    border: 1px solid #EBEEF5;
    padding: 12px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
    word-break: break-all;
    border-radius: 4px;
    position: relative;
  }

  #flowContent {
    width: 100%;
    height: 100%;
    position: relative;
  }

  .item {
    position: absolute;
    width: 57px;
    height: 90px;
    border: 3px solid #000;
  }

  .flow-menu {
    width: 120px;
    padding: 10px;
    margin: 0 10px;
    border: 1px solid #EBEEF5;
    /*padding: 12px;*/
    box-shadow: 0 2px 0px 0 rgba(0, 0, 0, .1);
    word-break: break-all;
    border-radius: 4px;
  }

  .menu-item {
    text-align: center;
    box-shadow: 0 0 4px #696969;
    margin-bottom: 8px;
    cursor: pointer;
    font-size: 15px;
    color: #606266;
    padding: 5px 0;
    border-radius: 5px;
  }

  .menu-item>i {
    font-size: 40px;
  }

  .flow-edit {
    width: 300px;
    height: 100%;
    padding: 0 10px;
  }

  .flow-edit-content {
    background: #FFF;
    color: #606266;
    line-height: 1.4;
    text-align: justify;
    font-size: 20px;
    border: 1px solid #EBEEF5;
    padding: 12px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
    word-break: break-all;
    border-radius: 4px;
  }
  .csslabel {
        color: #434343;
        font-weight: 400;
        z-index: 10;
        font-size: 12px;
        /*color: #409eff;*/
        background: #fff;
    }
    .csslabel .label-text {
        background-color: white;
    }
  .savebtn {
    position: absolute;
    top: 5px;
    right: 5px;
  }
</style>
