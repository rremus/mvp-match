import Vue from 'vue'
import App from './App.vue'
import PrimeVue from 'primevue/config';
import 'primevue/resources/themes/lara-light-teal/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'
import Tooltip from 'primevue/tooltip';

Vue.use(PrimeVue);
Vue.directive('tooltip', Tooltip);

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
