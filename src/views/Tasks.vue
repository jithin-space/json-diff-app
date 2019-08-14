<template lang="html">
  <div class="">

  <!-- <h1>Welcome To Task Section</h1> -->

  <md-tabs md-active-tab="tab-pages">

    <template slot="md-tab" slot-scope="{ tab }">
       {{ tab.label }} <i class="badge" v-if="tab.data.badge">{{ tab.data.badge }}</i>
     </template>

  <md-tab id="tab-home" md-label="General Info"  exact>
    <md-card md-with-hover>
      <md-card-content>
        <md-list v-if="project">
          <md-list-item>Name <code>{{project.name}}</code></md-list-item>
          <md-list-item>Created <code>{{project.created}}</code></md-list-item>
          <md-list-item>Tasks <code>{{taskList.length}}</code></md-list-item>
          <md-list-item>Completed <code>{{doneTasksCount}}</code></md-list-item>
        </md-list>
        <p v-else> No information Available</p>
      </md-card-content>
    </md-card>

  </md-tab>

  <md-tab id="tab-pages" md-label="Tasks" :md-template-data="{badge : taskList.length}" >
    <md-table v-model="taskList" md-card v-if="taskList.length">
        <md-table-toolbar>
          <h1 class="md-title">Tasks</h1>
        </md-table-toolbar>

        <md-table-row slot="md-table-row" slot-scope="{ item }">
          <md-table-cell md-label="ID" md-sort-by="id" md-numeric>{{ item.id }}</md-table-cell>
          <md-table-cell md-label="Document" md-sort-by="name">
            <a :href="item.info.url">view doc</a>
          </md-table-cell>
          <md-table-cell md-label="Submissions" md-sort-by="email">{{ item.n_answers }}</md-table-cell>
          <md-table-cell md-label="Completed" md-sort-by="gender">Yes</md-table-cell>
          <md-table-cell md-label="Actions" md-sort-by="title">
            <md-button @click="checkConflict(item.id)" :class="classObj(item.id)" :disabled="['conflict','ok'].includes(taskStatus[item.id])">{{taskStatus[item.id]}}</md-button>
          </md-table-cell>
        </md-table-row>
    </md-table>
    <p v-else> No Tasks Found </p>
  </md-tab>

</md-tabs>



<router-view></router-view>
  </div>
</template>

<script>
import { diffString, diff } from 'json-diff';
import {mapState} from 'vuex';
import { mapGetters } from 'vuex';
import {api} from '../store/api';
export default {
  data: function(){
    return {
      taskStatus: {},
      classStatus: {}
    }
  },
  computed: {
    ...mapState('tasks',['taskList','currentProjectId']),
    ...mapGetters('tasks',['getTaskById','doneTasksCount']),
    project(){
      return this.$store.getters['projects/getProjectById'](this.currentProjectId);
    },
  },
  mounted(){
    if(this.currentProjectId !== parseInt(this.$route.params.id) ){
      this.$store.dispatch('projects/getProjectsApi');
      this.$store.commit('tasks/setCurrentProject',parseInt(this.$route.params.id));
    }
    this.$store.dispatch('tasks/getTasksFromApi');
  },
  watch:{
    $route(to,from){
      if(this.currentProjectId !== parseInt(to.params.id) ){
        this.$store.dispatch('projects/getProjectsApi');
        this.$store.commit('tasks/setCurrentProject',parseInt(to.params.id));
        this.$store.dispatch('tasks/getTasksFromApi');
    }
  }
  },
  methods: {
    goToTask(id){
      this.$store.commit('taskruns/setCurrentTask',id);
      this.$router.push({ name: 'task', params: { t_id: id} });
    },
    conflictStatus(id){
      if(!this.taskStatus[id]){
        this.$set(this.taskStatus,id,'check');
      }
      return true;
    },
    classObj(id){
      if(!this.taskStatus[id]){
        this.$set(this.taskStatus,id,'check');
        this.$set(this.classStatus,id,{'md-raised':true});
      }

      return this.classStatus[id];
    },
    checkConflict(id){

     let status = this.tasksStatus;
      this.taskStatus[id] ="checking...";
      this.classStatus[id]['md-primary']=true;

       let route= '/taskrun';
       route+=`?task_id=${id}`;

       api.get(route).then((value)=>{
          this.taskStatus[id] = (Object.keys(diff(value.data[0].info.data,value.data[1].info.data)).length === 0) ? 'ok':'conflict';
          if(this.taskStatus[id]=== 'ok'){
            this.classStatus[id]['md-raised']= false;

          }
          else{
            this.classStatus[id]['md-accent']= true;
          }
       }).catch((error)=>{
         this.taskStatus[id] ='error';
         this.classStatus[id]['md-accent']=true;
       });
    }
  }
}
</script>

<style lang="css" scoped>

.badge {
    width: 19px;
    height: 19px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 2px;
    right: 2px;
    background: red;
    border-radius: 100%;
    color: #fff;
    font-size: 10px;
    font-style: normal;
    font-weight: 600;
    letter-spacing: -.05em;
    font-family: 'Roboto Mono', monospace;
  }
</style>
