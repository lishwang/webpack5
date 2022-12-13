import { createRouter, createWebHistory } from 'vue-router';

const home = () => import('../view/home')
const about = () => import('../view/about')

export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/home',
      component: home,
    },
    {
      path: '/about',
      component: about,
    }
  ]
})