import { api } from '../api'

export default{
  namespaced: true,
  state:{
    projectList: [],
  },
  mutations:{
    setProjects(state: any , payload: any){
      state.projectList = payload.projects;
    },
  },
  getters:{
    getProjectById: (state) => (id) => { return state.projectList.find(project => project.id === id)},
    getProjectStatus: (state)=> (id) => { return 'Pending'},
  },
  actions:{
    async getProjectsApi( { commit }) {

        let route = '/project';
        api.get(route).then(
          (value)=>{
          console.log('success');
          commit('setProjects',{projects: value.data})
        }
      ).catch((error)=>{
        console.log('error');
      });
    }
  }
}
