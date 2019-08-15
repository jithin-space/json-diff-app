import { api } from '../api';

export default{
  namespaced: true,
  state: {
    taskList: [],
    currentProjectId: null,
    taskStatus: {},
  },
  mutations: {
    setTasks(state: any , tasks: any) {
      state.taskList = tasks;
    },
    setCurrentProject( state, id) {
      state.currentProjectId = id;
    },
    setTaskStatus(state: any, payload){
        // if(!state.taskStatus[payload.id]){
        //   state.$set(state.taskStatus,payload.id, payload.status);
        // }
        // else{
        //   state.taskStatus[payload.id]=payload.status;
        // }
        state.taskStatus= {...state.taskStatus, ...payload};

    },
  },
  getters: {
    doneTasks: (state) => state.taskList.filter((task) => task.state === 'completed'),
    doneTasksCount: (state, getters) => getters.doneTasks.length,
    getTaskById: (state) => (id) => state.taskList.find((task) => task.id === id),
  },
  actions: {
    getTasksFromApi({ commit, state }) {
      let route = '/task';
      route += `?project_id=${state.currentProjectId}`;
      api.get(route).then((value) => {
        console.log(value);
        commit('setTasks', value.data);
      }).catch((error) => {
        console.log('error');
        console.log(error);
      });
    },
  },
};
