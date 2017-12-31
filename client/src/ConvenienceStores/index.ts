import Vue from 'vue'
import App from './app.vue'

Vue.config.productionTip = false

export default class {
  constructor() {
    new Vue({ el: '#app', components: { app: App }, template: '<app />' })
  }
}
