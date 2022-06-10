<template>
  <v-app id="app">
    <SiteHeader @drawer="drawer1"/>
    <NavMenu :drawer.sync="drawer"/>

    <v-main class="main-content flex-grow-1 flex-shrink-1">
      <v-container fluid class="pa-0 fill-height">
        <v-slide-x-transition mode="out-in">
          <router-view />
        </v-slide-x-transition>
      </v-container>
    </v-main>
    
  </v-app>
</template>


<script>
import { mapGetters } from "vuex";
import SiteHeader from "@/components/SiteHeader.vue";
import NavMenu from "@/components/NavMenu/NavMenu.vue";

export default {
  components: {
    SiteHeader,
    NavMenu,
  },
  data() {
    return {
      drawer: false,
      items: [
        { title: "Посты РТМ", icon: "mdi-view-dashboard" },
        { title: "Профиль", icon: "mdi-image" },
        { title: "Пользователи", icon: "mdi-help-box" },
      ],
      right: null,
    };
  },
  computed: {
    ...mapGetters({
      authenticated: "auth/authenticated",
    }),
  },
  methods: {
    drawer1() {
      this.drawer = !this.drawer
      console.log(this.drawer)
    }
  }
};
</script>


<style lang="scss">
@import './assets/styles/styles.scss';
html,
body {
  margin: 0;
  height: 100%;
  overflow: hidden;
}

* {
  // font-family: "Montserrat", sans-serif !important;
  // font-weight: 400 !important;
}

.main-content {
  // margin-left: 256px;
  background-color: #f1f1f1;
  overflow-y: scroll;
  height: 100vh;
}
</style>
