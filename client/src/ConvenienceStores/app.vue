<style scoped>

@import url('../../../node_modules/@salesforce-ux/design-system/assets/styles/salesforce-lightning-design-system.css');

</style>



<template lang="pug">

div
  .slds-page-header.slds-has-bottom-magnet.slds-is-fixed.slds-size_1-of-1(:style="{ zIndex: 1 }")
    .slds-grid
      .slds-col.slds-has-flexi-truncate
        .slds-media.slds-no-space.slds-grow
          .slds-media__figure
            span.slds-icon_container.slds-icon-standard-home(title="コンビニ情報")
              img.slds-icon(src="../../../node_modules/@salesforce-ux/design-system/assets/icons/standard/home.svg")
          .slds-media__body
            nav
              ol.slds-breadcrumb.slds-line-height_reset
                li.slds-breadcrumb__item
                  span コンビニ情報
            h1.slds-page-header__title.slds-p-right_x-small
              span.slds-grid.slds-has-flexi-truncate.slds-grid_vertical-align-center
                span.slds-truncate(title="Recently Viewed") すべて表示

  table.slds-table.slds-table_bordered.slds-table_cell-buffer(:style="{ position: 'absolute', top: '68px' }")
    thead
      tr.slds-text-title_caps
        th(scope="col")
          .slds-truncate(title="名前") 名前
        th(scope="col")
          .slds-truncate(title="住所") 住所
        th(scope="col")
          .slds-truncate(title="緯度") 緯度
        th(scope="col")
          .slds-truncate(title="経度") 経度
    tbody
      tr(v-for="cs_ in convenience_stores")
        th(scope="row", data-label="名前")
          .slds-truncate(:title="cs_.name") {{ cs_.name }}
        td(data-label="住所")
          .slds-truncate(:title="cs_.location_name") {{ cs_.location_name }}
        td(data-label="緯度")
          .slds-truncate(:title="cs_.lat") {{ cs_.lat }}
        td(data-label="経度")
          .slds-truncate(:title="cs_.lng") {{ cs_.lng }}

  .slds-spinner.slds-spinner_brand.slds-spinner_large(v-if="is_loading")
    .slds-spinner__dot-a
    .slds-spinner__dot-b

</template>



<script lang="ts">

import Vue from 'vue'
import { Component } from 'vue-property-decorator'

import SObjectModel from './s-object-model'


@Component({})
export default class extends Vue {
  is_loading = false
  convenience_stores = [] as any[]

  async mounted() {
    try {
      this.is_loading = true
      const css = await SObjectModel.ConvenienceStores.Gets({})
      this.is_loading = false

      this.convenience_stores = css.map(_ => {
        return { location_name: _.get('location_name__c'), name: _.get('Name'), lat: _.get('point__Latitude__s'), lng: _.get('point__Longitude__s') }
      })
    } catch (_) {
      console.error(_)
    }
  }
}

</script>
