<template>
  <div class="data-view-chart">
    <component
      :is="item.chartType + '_' + item.chartVersion"
      :item="item"
      :update-options="updateOptions"
      :theme="ThemeConfigMap[theme]"
      @init="chartInit"
    />
  </div>
</template>
<!--suppress JSUnresolvedVariable -->
<script>
import '../components/index'
import ThemeConfigMap from '@/components/DataView/themes/theme-config-map'

export default {
  name: 'Chart',
  props: {
    item: {
      type: Object,
      default() {
        return {}
      }
    },
    theme: {
      type: String,
      default() {
        return ''
      }
    }
  },
  data() {
    return {
      updateOptions: {
        notMerge: true,
        lazyUpdate: false
      },
      chart: null,
      timer: null,
      changeTimer: null,
      ThemeConfigMap
    }
  },
  computed: {
    refresh() {
      return this.item.refresh
    }
  },
  watch: {
    refresh: function(newVal) {
      if (newVal === 'true') {
        if (this.timer === null) {
          this.setTimer(this.item.interval)
        }
      } else if (newVal === 'false') {
        if (this.timer !== null) {
          clearInterval(this.timer)
          this.timer = null
        }
      }
    }
  },
  destroyed() {
    if (this.timer !== null) {
      clearInterval(this.timer)
    }
    if (this.changeTimer !== null) {
      clearInterval(this.changeTimer)
    }
  },
  mounted() {
    const instanceId = this.$route.params.instance_id
    if (instanceId) {
      if (this.item.chartData.dataSourceType === 'Static') {
        this.handleStaticData()
      } else {
        alert('暂不支持')
      }
    }
    this.$bus.$on('handleStaticData', this.handleStaticData)
  },
  methods: {
    setTimer: function(interval) {
      this.timer = setInterval(() => {
      }, interval)
    },
    setChangeTimer: function() {
      let index = 0
      this.changeTimer = setInterval(() => {
        this.changeHighLightItem(index)
        index++
      }, 2000)
    },
    handleDataBaseData() {
      const config = this.item.chartData
      config.chartType = this.item.chartType
      getChartData(config).then(response => {
        this.item.data = response.data
      })
    },
    handleStaticData() {
      let staticData
      try {
        staticData = JSON.parse(this.item.chartData.staticData)
      } catch (e) {
        return
      }
      if (Object.keys(staticData).length > 0) {
        this.item.data = JSON.parse(JSON.stringify(staticData))
      }
    },
    handleRestData() {
    },
    handleFileData() {
    },
    /**
     * 轮播ECharts组件
     * @param index 用来计算当前Index
     */
    changeHighLightItem(index) {
      const length = this.item.option.series[0].data.length
      if (this.chart !== null) {
        this.chart.dispatchAction({
          type: 'downplay',
          seriesIndex: 0
        })
        this.chart.dispatchAction({
          type: 'highlight',
          seriesIndex: 0,
          dataIndex: (index) % length
        })
      }
    },
    chartInit({ chart }) {
      this.chart = chart
    }
  }
}
</script>

