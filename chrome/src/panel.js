import Vue from 'vue';
import Panel from 'views/panel.vue';

import components from 'components';

components.forEach(component => {
  Vue.component(component.name, component);
});

Vue.config.productionTip = false;

new Vue({
  el: '#app',
  render: h => h(Panel)
});
