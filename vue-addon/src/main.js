import Vue from 'vue';
import App from './App.vue';
import wrap from '@vue/web-component-wrapper';

Vue.config.productionTip = false;

const CustomElement = wrap(Vue, App);
window.customElements.define('vue-addon', CustomElement);
