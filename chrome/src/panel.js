import Vue from 'vue';
import Panel from 'views/panel.vue';

Vue.config.productionTip = false;

new Vue({
  el: '#app',
  render: h => h(Panel)
});
