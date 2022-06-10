<template>
  <v-navigation-drawer
    app 
    v-model="showDrawer"
    v-if="authenticated"  
    :permanent="isLarge"
    class="aside-menu-custom"
    floating
    clipped
    light 
  > 
    <!-- <NavMenuProfile/> -->

    <v-list v-if="isAdmin === true" nav dense class="pa-4">
      <v-list-item v-for="item in items" :key="item.id" :to="item.route" link class="rere rounded-lg" hover-class="pink" active-class="cyan lighten-1 white--text rounded-lg">
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <v-list v-else nav dense class="pa-4">
      <v-list-item v-for="item in items.filter(item => item.requiresAdmin == 'false')"  :key="item.id" :to="item.route" link class="rere rounded-lg" hover-class="pink" active-class="cyan lighten-1 white--text rounded-lg">
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    
  </v-navigation-drawer>
</template>


<script>
  import { mapGetters } from 'vuex'
  // import NavMenuProfile from './NavMenuProfile.vue'

  export default {
    components: {
      // NavMenuProfile
    },
    props: {
      drawer: Boolean,
    },
    computed: {

      ...mapGetters({
        authenticated: 'auth/authenticated',
        isAdmin: 'auth/isAdmin',
      }),

    isLarge() {
      return this.$vuetify.breakpoint.name !== 'xs' && this.$vuetify.breakpoint.name !== 'sm'
    },
    showDrawer() {
      return this.isLarge || this.drawer
    }

    },
    data () {
      return {
        items: [ 
          // { title: 'Главная', icon: 'mdi-home-outline', route: "/", requiresAdmin: 'false' },
          { title: 'Посты РТМ', icon: 'mdi-map-marker-outline', route: "/posts", requiresAdmin: 'false' },
          // { title: 'Профиль', icon: 'mdi-account-outline', route: "", requiresAdmin: 'false' },
          { title: 'Пользователи', icon: 'mdi-account-multiple-outline', route: "/users", requiresAdmin: 'true' },
          { title: 'Состояние РТП', icon: 'mdi-table-edit', route: "/state_of_posts", requiresAdmin: 'true' },
          // { title: 'Состояние РТП-1', icon: '', route: "/postsstate1", requiresAdmin: 'true' },
        ],
      }
    },
  }
</script>


<style scoped>
.theme--light.v-navigation-drawer:not(.v-navigation-drawer--floating) .v-navigation-drawer__border {
  background-color: 5px !important;
}
.rere:hover {
  border-radius: 8px;
}
</style>