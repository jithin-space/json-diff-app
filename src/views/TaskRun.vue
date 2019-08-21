<template lang="html">
  <div class="">

    <div class="" v-if="task && project">



      <div class="md-layout md-gutter">
                 <div class="md-layout-item md-size-30">
                 </div>
                 <div class="md-layout-item"></div>
                 <div class="md-layout-item"></div>
                 <div class="md-layout-item md-size-15">
                         <md-button  class="md-raised md-primary" :href="task.info.url">View Doc</md-button>
                 </div>
      </div>



      <md-tabs v-if="task.state === 'completed'" :md-active-tab="activeTab" @md-changed="tabChanged">
         <md-tab id="tab-all" md-label="ALL" >
            <h2>Total Runs: {{runs.length}}</h2>
            <div  class="md-layout md-gutter">
              <md-table  v-for="run in runs" md-card class="md-layout-item">
                <md-table-toolbar>
                  <h1>Pass1: By User</h1>
                </md-table-toolbar>
                <md-table-row slot="md-table-row" v-for="(value,key) in run.info.data" :key="key">
                  <md-table-cell>{{key}}</md-table-cell>
                  <md-table-cell>{{value}}</md-table-cell>
                </md-table-row>
              </md-table>
            </div>
         </md-tab>
         <md-tab id="tab-conflict" md-label="Conflict" v-if="haveConflict">

              <div >
                 <div class="md-layout md-gutter">
                    <div class="md-layout-item md-size-30">
                        <h2> Number of Conflict Fields : {{ Object.keys(diffObj).length }}</h2>
                    </div>
                    <div class="md-layout-item"></div>
                    <div class="md-layout-item"></div>
                    <div class="md-layout-item md-size-15">
                      <md-button class="md-raised md-primary" @click="changeToResolve" v-if="finalized">View finalized</md-button>
                    </div>
                  </div>


               <md-table   md-card>
                  <md-table-toolbar>
                     <h1 class="md-title">Differences Table</h1>
                  </md-table-toolbar>
                  <md-table-row>
                     <md-table-head md-numeric>Key</md-table-head>
                     <md-table-head>Pass1</md-table-head>
                     <md-table-head>Pass2</md-table-head>
                     <md-table-head>Action</md-table-head>
                  </md-table-row>
                  <md-table-row slot="md-table-row" v-for="(value,key,i) in diffObj" :key="key">
                     <md-table-cell class="forLabel" md-label="Field" md-numeric>{{key}}</md-table-cell>
                     <md-table-cell md-label="Pass1" >
                       <md-radio :id="key+'_pass1'" :name="key" v-model="finalDiff[key]"
                       :value="Array.isArray(value)?runs[0]['info']['data'][key]:value['__old']"  >{{Array.isArray(value)?runs[0]['info']['data'][key]:value['__old']}}</md-radio>
                     </md-table-cell>
                     <md-table-cell class="forLabel" md-label="Pass2" >
                       <md-radio :id="key+'_pass2' " :name="key" v-model="finalDiff[key]"
                       :value="Array.isArray(value)?runs[1]['info']['data'][key]:value['__new']" >{{Array.isArray(value)?runs[1]['info']['data'][key]:value['__new']}}</md-radio>
                     </md-table-cell>
                     <md-table-cell md-label="Action" >
                       <md-radio :id="key+'_pass2' " :name="key" v-model="finalDiff[key]"
                       value="__unresolved" >Cannot Resolve</md-radio>
                     </md-table-cell>
                  </md-table-row>
               </md-table>
             </div>
          </md-tab>
          <md-tab id="tab-resolve" md-label="Finalized" v-if="finalized">
            <h1>Status To Confirm: {{tempStatus}}</h1>

            <md-table   md-card>
                  <md-table-toolbar>
                     <h1 class="md-title">Finalized Output</h1>
                  </md-table-toolbar>
                  <md-table-row>
                     <md-table-head md-numeric>Key</md-table-head>
                     <md-table-head>Value</md-table-head>
                  </md-table-row>
                  <md-table-row slot="md-table-row" v-for="(value,key) in finalPass" :key="key">
                     <md-table-cell md-label="Field" md-numeric>{{key}}</md-table-cell>
                     <md-table-cell md-label="Pass1" >
                       {{value}}
                     </md-table-cell>
                  </md-table-row>
               </md-table>

          <md-button  @click="statusChange" class="md-raised md-accent"> Confirm </md-button>
          </md-tab>
        </md-tabs>
        <div v-else>Task is not yet completed. Please try once it gets completed </div>
    </div>

    <div v-else>Invalid Parameters</div>

  </div>

</template>

<script>
import { diffString, diff } from 'json-diff';
import { mapState } from 'vuex';
import { mapGetters } from 'vuex';
export default {
  data: function(){
    return {
      finalDiff:{},
      tempStatus: null,
      activeTab: 'tab-all'
    }
  },
  computed: {
    ...mapState('taskruns',{
      taskId:'currentTaskId',
    }),
    ...mapState('tasks',{
      projectId: 'currentProjectId',
    }),
    task(){
      return this.$store.getters['tasks/getTaskById'](this.taskId);
    },
    project(){
      return this.$store.getters['projects/getProjectById'](this.projectId);
    },
    taskStatus(){
      let tem = this.$store.getters['tasks/getTaskStatusById'](this.taskId);
      this.tempStatus = tem;
      if (!tem || tem == 'view'|| tem == 'error'){
        let temp ={};
        temp[this.taskId] = (this.haveConflict)? 'resolve': 'view';
        this.$store.commit('tasks/setTaskStatus',temp);
        return temp[this.taskId];
      }
      return tem;
    },
    ...mapGetters('taskruns',{
      runs: 'getCurrentRuns',
    }),
    diffObj(){
      if(this.runs[0]&& this.runs[1]){

        return diff(this.runs[0].info.data,this.runs[1].info.data);
      }
      return {};
    },
    haveConflict(){
      return (this.diffObj)?true:false;
    },
    finalPass(){
      return Object.assign({},this.runs[0].info.data,this.finalDiff);
    },
    finalized(){
      let test = this.finalDiff;
      let vm = this;
      if(this.diffObj){
        return Object.keys(this.diffObj).filter((el)=>{
          if(!test[el]){
            vm.$set(test,el,null)
          }
          return test[el] == null;
        }).length === 0;
      }

      return true;

    }
  },
  mounted(){
    if(this.taskId !== parseInt(this.$route.params.t_id)){
      if(this.projectId !== parseInt(this.$route.params.id)){
        this.$store.dispatch('projects/getProjectsApi');
        this.$store.commit('tasks/setCurrentProject',parseInt(this.$route.params.id));
        this.$store.dispatch('tasks/getTasksFromApi');
      }
      this.$store.commit('taskruns/setCurrentTask',parseInt(this.$route.params.t_id));
    }
    this.$store.dispatch('taskruns/getTaskRunsFromApi');


  },
  watch:{
    $route(to,from){

      if(this.projectId !== parseInt(to.params.id)){
        this.$store.dispatch('projects/getProjectsApi');
        this.$store.commit('tasks/setCurrentProject',parseInt(to.params.id));
        this.$store.dispatch('tasks/getTasksFromApi');
      }

      if(this.taskId !== parseInt(to.params.t_id)){
        this.$store.commit('taskruns/setCurrentTask',parseInt(to.params.t_id));
        this.$store.dispatch('taskruns/getTaskRunsFromApi');
      }
    },
    finalDiff:{
      handler: function(oldValue,newValue){
        if(this.finalized === true){
          let temp={};
          let test = this.finalDiff;
          this.tempStatus = Object.keys(test).filter((el)=>{
            return test[el]== '__unresolved'
          }).length > 0 ? 'escalated':'resolved';

        }
      },
      deep: true
    }
  },
  methods:{
    resolveClick(){
      Object.assign(this.finalCopy,this.runs[0].info.data,this.copy);
    },
    statusChange(){
      let temp={};

      if(this.tempStatus){
        //alert to show
        temp[this.taskId]= this.tempStatus;
        this.$store.dispatch('tasks/setTasksToLumen',{
          'task_id': this.taskId,
          'status': this.tempStatus,
          'final_output': this.finalPass
        });
        this.$store.commit('tasks/setTaskStatus', temp);
        this.$router.push({name:'project',params:{ id: this.projectId}});

      }
    },
    changeToResolve(){
      this.activeTab='tab-resolve';
    },
    tabChanged(str){
      this.activeTab= str;
    }
  },

}
</script>

<style lang="scss" >

 .md-radio-label{
    height: auto  !important;
  }
</style>
