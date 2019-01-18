import Vue from 'vue';
import Popup from 'views/popup.vue';

Vue.config.productionTip = false;

new Vue({
  el: '#app',
  render: (h) => h(Popup)
});
