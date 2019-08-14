<template>
  <div id="app" class="page-container">

    <md-app >
      <md-app-toolbar class="md-primary">
        <md-button class="md-icon-button" @click="toggleMenu" v-if="!menuVisible">
          <md-icon>menu</md-icon>
        </md-button>
        <span class="md-title">My Title</span>
        <!-- <span class="md-title">Home<dd/span> -->
      </md-app-toolbar>

      <md-app-drawer :md-active.sync="menuVisible" md-persistent="full">
        <md-toolbar class="md-transparent" md-elevation="0" >
          Navigation
          <div class="md-toolbar-section-end">
           <md-button class="md-icon-button md-dense" @click="toggleMenu">
             <md-icon>keyboard_arrow_left</md-icon>
           </md-button>
         </div>
        </md-toolbar>
        <md-list>
          <md-list-item to="/">
            <md-icon>move_to_inbox</md-icon>
            <span class="md-list-item-text">Home</span>
          </md-list-item>
          <md-list-item to="/about">
            <md-icon>send</md-icon>
            <span class="md-list-item-text">
              About
            </span>
          </md-list-item>
          <md-list-item to="/projects">
            <md-icon>delete</md-icon>
            <span class="md-list-item-text">
              Projects
            </span>
          </md-list-item>

          <md-list-item to="/tasks">
            <md-icon>error</md-icon>
            <span class="md-list-item-text">
              Tasks
            </span>
          </md-list-item>
        </md-list>
      </md-app-drawer>

      <md-app-content>
        <router-view/>
      </md-app-content>
    </md-app>
  </div>

</template>

<style lang="css">
.md-app {
    /* max-height: 400px; */
    height:100vh;
    border: 1px solid rgba(#000, .12);
  }

  .md-app-toolbar {
    height: 106px;
  }

   // Demo purposes only
  .md-drawer {
    width: 123px !important;
    max-width: calc(100vw - 125px);
  }
</style>s
<script>
export default{
  data: () => ({
     menuVisible: false
   }),
   methods: {
      toggleMenu () {
        this.menuVisible = !this.menuVisible
      }
    },
}

</script>
