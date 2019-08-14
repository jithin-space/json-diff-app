import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import 'typeface-roboto';
import 'material-icons-font/material-icons-font.css';
import 'vue-material/dist/vue-material.min.css';
import 'vue-material/dist/theme/default.css';
import VueMaterial from 'vue-material';


Vue.config.productionTip = false;
Vue.use(VueMaterial);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
