<template>
  <v-app-bar app clipped-left color="cyan darken-3" class="px-4">
    <v-container fluid class="px-0 d-flex justify-space-between align-center">    
      <div class="d-flex align-center">
        <v-app-bar-nav-icon v-if="$vuetify.breakpoint.smAndDown" @click.stop="$emit('drawer')" color="white"></v-app-bar-nav-icon>
        <a href="/posts" v-if="$vuetify.breakpoint.mdAndUp" class="d-flex align-start text-decoration-none">
          <v-img   max-height="30" max-width="30" src="../assets/logo.png" class="align-self-center"></v-img>
          <h2 class="text-h6 pl-3 white--text d-flex align-center">Система мониторинга постов РТМ</h2>
        </a>
        <v-chip v-if="$vuetify.breakpoint.mdAndUp" small label class="ml-3">alpha</v-chip>        
      </div>
      <HeaderUserMenu/>
    </v-container>
  </v-app-bar>
  
</template>


<script>
  import { mapGetters } from 'vuex'
  import HeaderUserMenu from '@/components/HeaderUserMenu.vue'
  
  export default {
    name: 'SiteHeader',
    components: {
      HeaderUserMenu
    },
    computed: {
      ...mapGetters({
        authenticated: 'auth/authenticated',
      })
    },
    methods: {
      // drawer() {
      //   this.$emit('drawer')
      // }
    }
  }
</script>


<style>
  .v-toolbar__content {
    padding: 16px 0 !important;
  }

  .theme--light.v-chip:hover::before {
    opacity: 0;
  }
</style>