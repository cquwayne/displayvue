<template>
  <div style="margin: 10px">
    <el-header>
      <h1>铸造工艺场景环境负荷评价</h1>
      <el-divider></el-divider>
    </el-header>
    <el-container>
      <el-aside>
        <el-steps :space="77"  direction="vertical" :active="active">
          <el-step title="基础信息" description="填写工艺基础信息" ></el-step>
          <el-step title="目标与范围定义" description="定义工艺目标及数据范围"></el-step>
          <el-step title="过程建模" description="数据录入"></el-step>
          <el-step title="清单分析" description="数据特征化/统一量纲"></el-step>
          <el-step title="清单数据表" description="过程数据评价总清单"></el-step>
          <el-step title="评价结果" description="嵌套公式自动生成评价结果"></el-step>
          <el-step title="生成评价报告" description="可导出评价报告"></el-step>
        </el-steps>
        <el-button style="margin-top: 12px;" @click="before">上一步</el-button>
        <el-button style="margin-top: 12px;" @click="next">下一步</el-button>
      </el-aside>
      <el-main>
        <router-link></router-link>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'Assessment',
  data () {
    return {
      sceneDataList: [],
      active: 0
    }
  },
  methods: {
    before () {
      if (this.active-- < 0) {
        this.active = 0
      }
    },
    next () {
      if (this.active++ > 6) {
        this.active = 0
      }
    }
  },
  watch () {

  }
}
</script>

<style scoped>

</style>
