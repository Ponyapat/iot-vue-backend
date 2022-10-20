import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { useMainStore } from '@/stores/main'
import { darkModeKey, styleKey } from '@/config.js'
import axios from "axios";
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

import './css/main.css'

const token = localStorage.getItem("tkfw")

window.ApiMain= axios.create({
  baseURL: import.meta.env.VITE_API_MAIN ,
  headers: {
    'Authorization' : `Bearer `+token
  }
});
window.ApiSso= axios.create({
  baseURL: import.meta.env.VITE_API_SSO ,
  headers: {
    'Authorization' : `Bearer `+token
  }
});
window.ApiCore= axios.create({
  baseURL: import.meta.env.VITE_API_CORE ,
  headers: {
    'Authorization' : `Bearer `+token
  }
});

/* Init Pinia */
const pinia = createPinia()

/* Create Vue app */
createApp(App).use(router).use(pinia).use(VueSweetalert2).mount('#app')

/* Init Pinia main store */
const mainStore = useMainStore(pinia)

/* Fetch sample data */
mainStore.fetch('clients')
mainStore.fetch('history')

/* App style */
mainStore.setStyle(localStorage[styleKey] ?? 'basic')

/* Dark mode */
if ((!localStorage[darkModeKey] && window.matchMedia('(prefers-color-scheme: dark)').matches) || localStorage[darkModeKey] === '1') {
  mainStore.setDarkMode(true)
}

/* Default title tag */
const defaultDocumentTitle = 'FarmWorld'

/* Collapse mobile aside menu on route change */
router.beforeEach(to => {
  mainStore.asideMobileToggle(false)
  mainStore.asideLgToggle(false)
})

router.afterEach(to => {
  /* Set document title from route meta */
  if (to.meta && to.meta.title) {
    document.title = `${to.meta.title} — ${defaultDocumentTitle}`
  } else {
    document.title = defaultDocumentTitle
  }

  /* Full screen mode */
  mainStore.fullScreenToggle(!!to.meta.fullScreen)
})
