import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import './scss/_base.scss';

const app = createApp(App);
app.config.productionTip = false;

app
    .use(store)
    .use(router)
    .mount('#app')
