import Vue from 'vue';
import VueRouter from 'vue-router';
import MainPage from './views/MainPage.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '*/',
    component: MainPage,
  },
  {
    path: '*/other',
    component: () => import('./views/OtherPage.vue'),
  },
  {
    path: '*',
    redirect: '',
  },
];

const basePath =
  '/' + (location.pathname.substr(1) || location.hash.replace('#/', ''));
const router = new VueRouter({
  mode: 'hash',
  routes,
});

// Always prepend the basePath to the route
router.beforeEach((to, from, next) => {
  if (!to.path.includes(basePath)) {
    next(basePath + to.path);
  } else {
    next();
  }
});

export default router;
