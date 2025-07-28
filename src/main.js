
import { createApp } from 'vue'
import App from './App.vue'

import 'mdb-vue-ui-kit/css/mdb.min.css';
import router from './router'
import i18n from './i18n';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import "@fortawesome/fontawesome-free/css/all.min.css";

import "vue-search-select/dist/VueSearchSelect.css"
//import 'primevue/resources/themes/aura-light-green/theme.css'


import PrimeVue from 'primevue/config';
//import ConfirmationService from 'primevue/confirmationservice';


//import 'url(https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.0/css/select2.min.css)';
// ,{ unstyled: true }
createApp(App).component('VueDatePicker', VueDatePicker)    ;

//Vue.prototype.$clientId = '359901037732-2jilg1shqd0md47hjrilsb7p84k46h9u.apps.googleusercontent.com'
createApp(App).use(router).use(PrimeVue).use(i18n).mount('#app')
