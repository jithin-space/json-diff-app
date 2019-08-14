<template lang="html">
  <div class="">

  <ul class="error-messages">
    <li v-for="error in errors">{{error.message}}</li>
  </ul>

  <div class="" v-if="projects.length">
    <h2> Available Projects:{{projects.length}}</h2>

      <div class="md-layout md-gutter">
        <div class="md-layout-item" v-for="project in projects">

          <md-card md-with-hover>
             <md-ripple>
               <md-card-header>
                 <div class="md-title">
                   <a @click="setProject(project.id)">{{project.name}}</a>
                 </div>
                 <div class="md-subhead">It also have a ripple</div>
               </md-card-header>

               <md-card-content>
                 Detailed Description of the Project Goes Here
               </md-card-content>

               <md-card-actions>
                 <md-button class="md-primary" @click="setProject(project.id)">View Details</md-button>
               </md-card-actions>
             </md-ripple>
           </md-card>

        </div>
      </div>

  </div>
  <div class="" v-else>
    <md-empty-state
     md-rounded
     md-icon="access_time"
     md-label="No Projects"
     md-description="Unable to find/fetch any projects">
   </md-empty-state>
  </div>
  <router-view></router-view>
  </div>
</template>

<script>
import {mapState} from 'vuex';
import { mapGetters } from 'vuex';
import { mapActions } from 'vuex';
export default {

  data: function(){
    return {
      errors: []
    }
  },
  mounted(){
    this.$store.dispatch('projects/getProjectsApi').catch(err=>{this.erors.push(err)});
  },
  computed:{
    ...mapState({
      projects: (state) => state.projects.projectList || [],

    })
  },
  methods:{
    setProject(id){
      this.$store.commit('tasks/setCurrentProject',id);
      this.$router.push({ name: 'project', params: { id: id}});
    }
  }
}
// console.log(this.$store);
</script>

<style lang="css" scoped>

  .md-card{
    /* max-width: 50%; */
  }
</style>
