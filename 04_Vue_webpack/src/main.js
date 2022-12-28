import { createApp } from 'vue';
import App from './App';
import router from './router'

// element-plus 完整引入
// import ElementPlus from 'element-plus'
// import 'element-plus/dist/index.css'

createApp(App).use(router)
  // .use(ElementPlus)
  .mount(document.querySelector('#app'));