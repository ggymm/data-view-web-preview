<!--suppress JSUnresolvedVariable, JSUnusedLocalSymbols -->
<template>
  <a-layout class="data-view-container">
    <a-layout-header class="data-view-header">
      <a-icon class="back" type="left-circle" @click="handleBack()" />
      <a-menu class="data-view-menu" mode="horizontal" theme="dark">
        <a-sub-menu v-for="menu in menus" :key="menu.key">
          <span slot="title">{{ menu.title }}<a-icon type="caret-down" style="margin-left: 5px" /></span>
          <template v-for="child in menu.children">
            <a-menu-item v-if="child.children === undefined" :key="child.key" :draggable="true" @dragstart="handleDragStart($event, child.key, child.version)">
              <icon class="chart-type-icon" :type="`icon-${child.icon}`" />
              <span>{{ child.title }}</span>
            </a-menu-item>
            <a-sub-menu v-else :key="child.key" :title="child.title">
              <a-menu-item v-for="grandson in child.children" :key="grandson.key" :draggable="true" @dragstart="handleDragStart($event, grandson.key, grandson.version)">
                <icon class="chart-type-icon" :type="`icon-${grandson.icon}`" />
                <span>{{ grandson.title }}</span>
              </a-menu-item>
            </a-sub-menu>
          </template>
        </a-sub-menu>
      </a-menu>
      <div class="handler">
        <a-icon type="save" />
        <a-icon type="eye" />
        <a-icon type="bug" />
      </div>
    </a-layout-header>
    <a-layout class="data-view-main">
      <a-layout-sider v-model="layerCollapsed" collapsed-width="0" collapsible>
        <layer />
      </a-layout-sider>
      <a-layout class="data-view-screen">
        <a-layout-content
          id="screenWrapper"
          class="data-view-screen-wrapper"
          @mousedown="handleItemUnClick"
          @mouseup="handleItemUnChoose"
        >
          <layout @dragover.native="handleDragOver" @drop.native="handleDrop">
            <item
              v-for="(item, index) in items"
              :key="index"
              :item="item"
              :index="index"
              :active="item === currentItem"
            >
              <chart
                :id="item.elId"
                :item="item"
                :theme="screenConfig.theme"
              />
            </item>
          </layout>
        </a-layout-content>
        <a-layout-footer class="data-view-screen-footer toolbox">
          <a-space>
            <div class="tool-item">
              <span class="label">参考线</span>
              <a-switch v-model="refLine" />
            </div>
            <div class="tool-item">
              <span class="label">指示线</span>
              <a-switch v-model="indicatorLine" />
            </div>
            <div class="tool-item">
              <span class="label" style="margin-right: 15px">缩放比例</span>
              <a-slider
                v-model="scale"
                class="data-view-scale"
                :min="20"
                :max="200"
                :marks="{ 100:{} }"
              />
              <span class="tool-btn" @click="$store.commit('autoCanvasScale')">自适应</span>
              <span class="tool-btn" @click="scale = 100">实际大小</span>
            </div>
          </a-space>
        </a-layout-footer>
      </a-layout>
      <a-layout-sider
        v-model="optionCollapsed"
        class="data-view-option-panel"
        width="400"
        collapsed-width="0"
        :reverse-arrow="true"
        collapsible
      >
        <div v-if="currentItem === null" class="data-view-screen-option dark-theme">
          <div class="screen-option-header">
            <span>页面设置</span>
          </div>
          <div class="screen-option-body">
            <a-form class="dark" :model="screenConfig" layout="horizontal" :label-col="{span: 6}" :wrapper-col="{span: 14, offset: 1}">
              <a-form-item label="大屏标题">
                <a-input v-model="screenConfig.title" />
              </a-form-item>
              <a-form-item label="画板大小">
                <a-row :gutter="20">
                  <a-col :span="12">
                    <a-input-number v-model="screenConfig.width" :min="1" :step="10" />
                  </a-col>
                  <a-col :span="12">
                    <a-input-number v-model="screenConfig.height" :min="1" :step="10" />
                  </a-col>
                </a-row>
              </a-form-item>
              <a-form-item label="背景图">
                <a-select v-model="screenConfig.backgroundImg">
                  <a-select-option
                    v-for="image in backgroundImgList"
                    :key="image.image_path"
                    :value="image.image_path"
                  >
                    {{ image.image_name }}
                  </a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item label="吸附距离">
                <a-input-number v-model="screenConfig.diff" :min="1" :precision="0" />
              </a-form-item>
            </a-form>
          </div>
        </div>
        <chart-option v-else class="data-view-chart-option dark-theme" :data-source-list="dataSourceList" />
      </a-layout-sider>
    </a-layout>
  </a-layout>
</template>

<script>
import { mapState } from 'vuex'
import { menus } from './menu'
import defaultSettings from '@/config'

import '@/components/DataView/global-components'
import OptionConfigMap from '@/components/DataView/components/config'
import Layout from '@/components/DataView/layout/layout'
import Item from '@/components/DataView/layout/item'
import Chart from '@/components/DataView/common/chart'
import Layer from '@/components/DataView/common/layer'
import ChartOption from '@/components/DataView/common/option'

export default {
  name: 'Index',
  components: {
    Layout,
    Item,
    Chart,
    Layer,
    ChartOption
  },
  data() {
    return {
      menus,
      routerBase: defaultSettings.routerBase,
      layerCollapsed: false,
      optionCollapsed: false,
      loading: true,
      instanceId: null,
      isCopy: null,
      dataSourceList: [],
      backgroundImgList: [],
      instanceVersion: 1
    }
  },
  computed: {
    scale: {
      get() {
        return this.$store.state.canvasConfig.scale * 100
      },
      set(val) {
        this.$store.commit('setCanvasScale', {
          scale: val
        })
      }
    },
    refLine: {
      get() {
        return this.$store.state.canvasConfig.refLine
      },
      set(val) {
        this.$store.commit('setRefLine', val)
      }
    },
    indicatorLine: {
      get() {
        return this.$store.state.canvasConfig.indicatorLine
      },
      set(val) {
        this.$store.commit('setIndicatorLine', val)
      }
    },
    screenConfig: {
      get() {
        return this.$store.state.screenConfig
      },
      set(val) {
        this.$store.commit('setScreenConfig', val)
      }
    },
    ...mapState([
      'items',
      'canvasConfig',
      'clickItem',
      'currentItem'
    ])
  },
  created() {
    // 初始化默认缩放比例
    this.$store.commit('autoCanvasScale')
  },
  methods: {
    handleDragStart(event, key, version) {
      event.dataTransfer.setData('type', `${key}_${version}`)
    },
    handleDragOver(event) {
      event.preventDefault()
    },
    handleDrop(event) {
      const type = event.dataTransfer.getData('type')
      const newItem = OptionConfigMap[type]()
      newItem.x = event.offsetX - newItem.width / 2
      newItem.y = event.offsetY - newItem.height / 2
      newItem.hover = false
      this.$store.commit('addItem', newItem)
    },
    handleItemUnClick() {
      this.$store.commit('setClickItem', false)
    },
    handleItemUnChoose(e) {
      if (!this.clickItem) {
        this.$store.commit('setCurrentItem', { item: null, index: -1 })
      }
      if (e.button !== 2) {
        this.$store.commit('hideContextmenu')
      }
    },
    handleBack() {
      this.$router.push('/')
    }
  }
}
</script>
<style lang="less">
@import "index.less";
</style>
