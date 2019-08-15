import Vue from 'vue';
import Vuex from 'vuex';
import {api} from './api';
import tasksD from './dummy';
// import taskRuns from './dummy_run';
import projects from './modules/projects';
import tasks from './modules/tasks';
import taskruns from './modules/taskruns';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {

  },
  mutations: {
  },
  actions: {

  },
  getters: {
  },
  modules: {
    projects,
    tasks,
    taskruns,
  },

});
