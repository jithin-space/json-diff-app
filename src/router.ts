import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue'),
    },
    {
      path: '/projects',
      name: 'projects',
      component: () => import ('./views/Projects.vue'),
    },
    {


          path: '/projects/:id',
          name: 'project',
          component: () => import('./views/Tasks.vue'),
          // children:[
          //     {
          //       path:'tasks/:t_id',
          //       name: 'task',
          //       component: () => import('./views/TaskRun.vue'),
          //     },
          // ]
    },
    {
      path: '/projects/:id/tasks/:t_id',
      name: 'task',
      component: ()=> import('./views/TaskRun.vue'),
    },
  ],
});
