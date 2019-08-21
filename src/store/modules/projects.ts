import { pybossa_api,lumen_api } from '../api';

export default{
  namespaced: true,
  state: {
    projectList: [],
  },
  mutations: {
    setProjects(state: any , payload: any) {
      state.projectList = payload.projects;
    },
  },
  getters: {
    getProjectById: (state) => (id) => state.projectList.find((project) => project.id === id),
    getProjectStatus: (state) => (id) => 'Pending',
  },
  actions: {
    async getProjectsApi( { commit }) {

        const route = '/project';
        pybossa_api.get(route).then(
          (value) => {
          console.log('success');
          commit('setProjects', {projects: value.data});
        },
      ).catch((error) => {
        console.log('error');
      });
    },
  },
};
