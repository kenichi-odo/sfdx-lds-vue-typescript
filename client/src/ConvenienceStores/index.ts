import Vue from 'vue'

Vue.config.productionTip = false

export default class {
  constructor() {
    new Vue({
      el: '#app',
      components: { app: require('./app.vue').default },
      // data: {
      //   config: config_,
      //   attributes: attributes_,
      // },
      template: '<app />',
    })
  }
}
