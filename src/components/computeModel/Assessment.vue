<template>
  <div style="margin: 10px">
    <el-header>
      <h1>铸造工艺场景环境负荷评价</h1>
      <el-divider></el-divider>
    </el-header>
    <el-container>
      <el-aside>
        <el-steps :space="77"  direction="vertical" :active="active">
          <el-step title="基础信息" description="填写工艺基础信息" @click.native="jump(0)"></el-step>
          <el-step title="目标与范围定义" description="定义工艺目标及数据范围" @click.native="jump(1)"></el-step>
          <el-step title="过程建模" description="数据录入" @click.native="jump(2)"></el-step>
          <el-step title="清单分析" description="数据特征化/统一量纲" @click.native="jump(3)"></el-step>
          <el-step title="清单数据表" description="过程数据评价总清单" @click.native="jump(4)"></el-step>
          <el-step title="评价结果" description="嵌套公式自动生成评价结果" @click.native="jump(5)"></el-step>
          <el-step title="生成评价报告" description="可导出评价报告" @click.native="jump(6)"></el-step>
        </el-steps>
        <el-button style="margin-top: 12px;" @click="before">上一步</el-button>
        <el-button style="margin-top: 12px;" @click="next">下一步</el-button>
      </el-aside>
      <el-main>
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
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
    jump (num) {
      if (num === 0) {
        this.active = num
        this.$router.push({name: 'BaseInfo'})
      } else if (num === 1) {
        this.active = num
        this.$router.push({name: 'Definition'})
      }
    },
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
  watch: {
    active (newValue, oldValue) {
      if (newValue === 0) {
        this.$router.push({name: 'BaseInfo'})
      } else if (newValue === 1) {
        this.$router.push({name: 'Definition'})
      }
    }
  }
}
</script>

<style scoped>

</style>
