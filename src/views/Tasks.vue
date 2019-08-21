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
          <md-table-cell md-label="Submissions">{{ item.n_answers }}</md-table-cell>
          <md-table-cell md-label="Completed" >{{ item.state }}</md-table-cell>
          <md-table-cell md-label="Actions">
            <!-- :disabled="['conflict','ok'].includes(taskStatus[item.id])" -->
            <md-button @click="checkConflict(item.id)" :class="classObj(item.id)" v-show="item.state == 'completed'" >{{taskStatus[item.id]}}</md-button>
            <!-- <md-button class="md-primary" v-if="['conflict','ok'].includes(taskStatus[item.id])">View</md-button> -->
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
import {pybossa_api} from '../store/api';
export default {
  data: function(){
    return {
      classStatus: {
        'check': {'md-raised':true},
        'resolve':{'md-accent':true,'md-raised':true},
        'view': {'md-primary':true,'md-raised':true},
        'retrying...':{'md-accent':true},
        'checking...': {'md-primary':true},
      }
    }
  },
  computed: {
    ...mapState('tasks',['taskList','currentProjectId','taskStatus']),
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
    this.$store.dispatch('tasks/getTasksFromLumen');
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
        // this.$set(this.taskStatus,id,'check');
        let temp={};
        temp[id]='check';
        this.$store.commit('tasks/setTaskStatus',temp);
      }
      return true;
    },
    classObj(id){
      let temp={};
      temp[id]='check';
      if(!this.taskStatus[id]){
        this.$store.commit('tasks/setTaskStatus',temp);
      }
      if(!this.classStatus[id]){
          this.$set(this.classStatus,id,{});
      }
      return this.classStatus[this.taskStatus[id]];
    },
    checkConflict(id){

      // customize into a generic button

      let status = this.tasksStatus;
      let temp ={};


      switch(this.taskStatus[id]){

        case 'check':
            //proceed with remote checking;
            // this.taskStatus[id] ="checking...";
            temp[id]='checking...';
            this.$store.commit('tasks/setTaskStatus',temp);
            this.classStatus[id]['md-primary']=true;
            this.getRunsFromApi(id);
            break;
        case 'error':
            // this.taskStatus[id] ="retrying...";
            temp[id]='retrying...';
            this.$store.commit('tasks/setTaskStatus',temp);
            this.classStatus[id]['md-accent']=true;
            this.getRunsFromApi(id);
            break;
        case 'view':
            // change to view
            this.goToTask(id);
            break;
        case 'resolve':
            //change label to resolve
            this.goToTask(id);
            break;
          }

      },

      getRunsFromApi(id){

        let route= '/taskrun';
        route+=`?task_id=${id}`;
        let temp ={};

        pybossa_api.get(route).then((value)=>{
          console.log(value.data[1].info.data);
          console.log(value.data[0].info.data);
          console.log(diff(value.data[0].info.data,value.data[1].info.data));
           // console.log(Object.keys(diff(value.data[1].info.data,value.data[0].info.data)));
          let taskStatus = (! diff(value.data[1].info.data,value.data[0].info.data)) ? 'view':'resolve';

           this.classStatus[id]['md-raised']= true;
           if(taskStatus === 'view'){
             temp[id]= 'view';
             this.$store.commit('tasks/setTaskStatus',temp);
             this.classStatus[id]['md-raised']= true;
           }
           else{
             temp[id]= 'resolve';
             this.$store.commit('tasks/setTaskStatus',temp);
             this.classStatus[id]['md-accent']= true;
           }
        }).catch((error)=>{
          // this.taskStatus[id] ='error';
          console.log(error);
          temp[id]= 'error';
          this.$store.commit('tasks/setTaskStatus',temp);
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
