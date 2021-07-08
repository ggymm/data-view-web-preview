<template>
  <div>
    <a-button type="primary" @click="dataView()">可视化大屏设计器</a-button>
    <a-button type="primary" @click="dataReport()">报表设计器</a-button>
  </div>
</template>
<script>
import defaultSettings from '@/config'

export default {
  data() {
    return {
      routerBase: defaultSettings.routerBase
    }
  },
  methods: {
    dataView() {
      window.open(this.routerBase + 'data-view-instance/create')
    },
    dataReport() {
      window.open(this.routerBase + 'data-report-instance/create')
    }
  }
}
</script>
