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



      <md-tabs >
         <md-tab id="tab-all" md-label="ALL" v-if="task.state === 'completed'">
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
                      <md-button class="md-raised md-primary" v-show="resolved">View Resolved</md-button>
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
                  <md-table-row slot="md-table-row" v-for="(value,key) in diffObj" :key="key">
                     <md-table-cell md-label="Field" md-numeric>{{key}}</md-table-cell>
                     <md-table-cell md-label="Pass1" >
                       <md-radio :id="key+'_pass1'" :name="key" v-model="resolveCopy[key]"
                       :value="value['__old']"  >{{value['__old']}}</md-radio>
                     </md-table-cell>
                     <md-table-cell md-label="Pass2" >
                       <md-radio :id="key+'_pass2' " :name="key" v-model="resolveCopy[key]"
                       :value="value['__new']" >{{value['__new']}}</md-radio>
                     </md-table-cell>
                     <md-table-cell md-label="Action" >
                       <md-radio :id="key+'_pass2' " :name="key" v-model="resolveCopy[key]"
                       value="__unresolved" >Cannot Resolve</md-radio>
                     </md-table-cell>
                  </md-table-row>
               </md-table>
             </div>
          </md-tab>
          <md-tab id="resolve" md-label="Resolved" v-if="resolved">
            <h1>{{resolved}}</h1>

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

          </md-tab>
        </md-tabs>
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
      resolveCopy: {},
      finalCopy:{},
      resolved:false,
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
      return (Object.keys(this.diffObj).length !== 0)?true:false;
    },
    finalDiff(){
      let copy = this.resolveCopy;
      for (let key in this.diffObj){
        this.$set(copy,key,null);
      }
      return this.resolveCopy;
    },
    finalPass(){
      return Object.assign({},this.runs[0].info.data,this.resolveCopy);
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
    resolveCopy:{
      handler: function(oldValue,newValue){

          let temp = newValue ;
          if(Object.keys(temp).length === 0){
            this.resolved=false;
          }
          this.resolved = Object.keys(temp).filter((el)=>{
            return !(temp[el] || temp[el]!= null);
          }).length === 0;
        },
        deep:true,
    },
  },
  methods:{
    resolveClick(){
      Object.assign(this.finalCopy,this.runs[0].info.data,this.copy);
    }
  },

}
</script>

<style lang="css" scoped>
</style>
