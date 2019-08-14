import { api } from '../api'

export default{
  namespaced:true,
  state:{
    taskList: [],
    currentProjectId:null,
  },
  mutations:{
    setTasks(state: any , tasks: any){
      state.taskList = tasks;
    },
    setCurrentProject ( state, id){
      state.currentProjectId = id;
    },
  },
  getters:{
    doneTasks: state => state.taskList.filter(task => task.state === 'completed'),
    doneTasksCount: (state, getters) => getters.doneTasks.length,
    getTaskById: (state) => (id) => { return state.taskList.find(task => task.id === id)}
  },
  actions:{
    getTasksFromApi({ commit, state }){
      let route='/task';
      route+=`?project_id=${state.currentProjectId}`;
      api.get(route).then((value)=>{
        console.log(value);
        commit('setTasks', value.data);
      }).catch((error)=>{
        console.log('error');
        console.log(error);
      })
    }
  }
}
