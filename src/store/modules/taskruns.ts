import { pybossa_api,lumen_api } from '../api';

export default{
  namespaced: true,
  state: {
    taskRuns: [],
    currentTaskId: null,
  },
  mutations: {
    setTaskRuns(state, payload) {
      state.taskRuns = payload;
    },
    setCurrentTask(state, id) {
      state.currentTaskId = id;
    },
  },
  getters: {
    getCurrentRuns: (state) => state.taskRuns.filter( (run) => run.task_id === state.currentTaskId),
  },
  actions: {
    async getTaskRunsFromApi({commit, state}) {

      let route = '/taskrun';
      route += `?task_id=${state.currentTaskId}`;

      pybossa_api.get(route).then((value) => {
        commit('setTaskRuns', value.data);
      }).catch((error) => {
        console.log('fetch error');
      });
    },
  },
};
