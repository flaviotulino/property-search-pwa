import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import VueOnsen from 'vue-onsenui'; // This imports 'onsenui', so no need to import it separately

import * as components from 'vue-onsenui/esm/components';

// Webpack CSS import
import 'onsenui/css/onsenui.css';
import 'onsenui/css/onsen-css-components.css';

// Register all vue-onsenui components


const pinia = createPinia();
const app = createApp(App);

app.use(router);
app.use(pinia);
app.use(VueOnsen)


// PWA install prompt snippet
// let deferredPrompt;

// window.addEventListener('beforeinstallprompt', (e) => {
//     e.preventDefault(); // prevent Chrome’s default prompt
//     deferredPrompt = e;

//     // optional: create a button dynamically
//     const btn = document.createElement('button');
//     btn.textContent = 'Install App';
//     btn.style.position = 'fixed';
//     btn.style.bottom = '20px';
//     btn.style.right = '20px';
//     btn.style.zIndex = '999';
//     btn.style.padding = '0.5rem 1rem';
//     btn.style.backgroundColor = '#2563eb';
//     btn.style.color = 'white';
//     btn.style.borderRadius = '0.5rem';
//     document.body.appendChild(btn);

//     btn.addEventListener('click', async () => {
//         deferredPrompt.prompt(); // show install prompt
//         const choice = await deferredPrompt.userChoice;
//         console.log('User choice:', choice.outcome);
//         deferredPrompt = null;
//         btn.remove(); // remove button after install
//     });
// });

// Register all vue-onsenui components
Object.values(components).forEach(component =>
    app.component(component.name, component));

app.mount('#app');
