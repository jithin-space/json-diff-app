import { pybossa_api, lumen_api } from '../api';

export default{
  namespaced: true,
  state: {
    taskList: [],
    currentProjectId: null,
    taskStatus: {},
    lumenSync: false,
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
    getTaskStatusById: (state) => (id) => state.taskStatus[id],
  },
  actions: {
    getTasksFromApi({ commit, state }) {
      let route = '/task';
      route += `?project_id=${state.currentProjectId}`;
      pybossa_api.get(route).then((value) => {
        console.log(value);
        commit('setTasks', value.data);
      }).catch((error) => {
        console.log('error');
        console.log(error);
      });
    },

    setTasksToLumen({commit, state}, payload){

       lumen_api.post('/tasks', payload)
      .then(function (response) {
          console.log(response);
        })
      .catch(function (error) {
        console.log(error);
      });
    },

    getTasksFromLumen({ commit, state}) {
      lumen_api.get('/tasks').then(function(response){
        for(let task in response.data){
          let value =response.data[task];
          let temp={};
          temp[value['task_id']]=value['status'];
          commit('setTaskStatus',temp);
        }
      }).catch(function(error){
        console.log(error);
      });
    },

    getTaskFromLumen({commit, state},payload){
      lumen_api.get(`/tasks/${payload}`).then(function(response){
        console.log(response);
      })
      .catch(function(error){
        console.log(error);
      });
    }


  },
};
