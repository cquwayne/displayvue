<template>
  <div class="Navigation">
    <div class="group" v-for="item in navList" :key="item.index">
      <div class="title">
        <i :class="item.icon"></i> &nbsp;{{item.title}}
      </div>
      <div class="list">
        <router-link v-for="sub in item.list" :to="{name: sub.name}" :key="sub.index">
          <i :class="sub.icon"></i> &nbsp;{{sub.title}}
        </router-link>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Navigation',
  data () {
    return {
      navList: [
        {
          title: '铸造工艺过程数字模型',
          icon: 'el-icon-s-grid',
          list: [
            {
              title: '铸造工艺过程管理',
              name: 'ProcessManage',
              icon: 'el-icon-document'
            },
            {
              title: '数字模型创建',
              name: 'CreateDigitalModel',
              icon: 'el-icon-map-location'
            },
            {
              title: '场景模型管理',
              name: 'ModelManage',
              icon: 'el-icon-box'
            }
          ]
        },
        {
          title: '铸造工艺过程场景数据管理',
          icon: 'el-icon-s-grid',
          list: [
            {
              title: '场景实例管理',
              name: 'SceneDataManage',
              icon: 'el-icon-s-unfold'
            },
            {
              title: '场景基础数据管理',
              name: 'BaseDataManage',
              icon: 'el-icon-s-data'
            }
          ]
        },
        {
          title: '铸造工艺场景负荷计算模型',
          icon: 'el-icon-s-grid',
          list: [
            {
              title: '铸造工艺知识库',
              name: 'Knowledge',
              icon: 'el-icon-link'
            },
            {
              title: '场景负荷计算模型',
              name: 'ComputeModel',
              icon: 'el-icon-s-operation'
            },
            {
              title: '铸造工艺场景环境负荷评价',
              name: 'Assessment',
              icon: 'el-icon-c-scale-to-original'
            }
          ]
        }
      ]
    }
  }
}
</script>
<style lang="scss">
  .Navigation{
    width: 100%;
    text-align: left;
    color: #fff;
    .group{
      margin: 20px 20px 10px 20px;
      padding-bottom: 8px;
      &:not(:last-child) {
        border-bottom: solid 1px #555;
      }
    }
    .title{
      color: #aaa;
      font-size: 18px;
    }
    .list{
      a{
        font-size: 18px;
        display: block;
        padding: 0 15px;
        margin: 15px 0;
        color: #ccc;
      }
      .router-link-active{
        color: #2A88F6;
      }
    }
  }
</style>
