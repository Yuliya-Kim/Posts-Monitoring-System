<template>
  <div v-if="authenticated">
    <v-menu v-model="menu" :close-on-content-click="false" min-width="200px" rounded-lg offset-y>
      
      <template v-slot:activator="{ on }">
        <v-btn icon v-on="on">
          <v-avatar color="white" size="44">
            <!-- <img src="../assets/yulya_kim.jpg"> -->
            <span class="blue--text">{{ userInitials }}</span>
          </v-avatar>
        </v-btn>
      </template>

      <v-list nav dense class="pa-4 rounded-lg">
        <v-list-item class="d-flex align-center mb-4">
          <v-avatar color="blue" size="56">
            <!-- <img src="../assets/yulya_kim.jpg"> -->
            <span class="white--text">{{ userInitials }}</span>
          </v-avatar>
          <div class="ml-3">
            <h3 class="text-body-1 font-weight-medium text-no-wrap">{{ authenticated.name }} {{ authenticated.surname }}</h3>
            <span class="text-body-2" v-if="authenticated.isAdmin == true">Администратор</span>
            <div class="d-flex align-center mt-1 text-body-2 font-weight-light">
              <v-icon dense>mdi-email-outline</v-icon>
              <span class="ml-1">{{ authenticated.email }}</span>
            </div>                     
          </div>
        </v-list-item>

        <v-list-item link class="rounded-lg cyan">
          <v-list-item-content>
            <v-list-item-title @click.prevent="logOut" class="text-button white--text text-center">ВЫЙТИ</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script>

  import { mapGetters, mapActions } from 'vuex'
  
  export default {
    name: 'HeaderUserMenu',
    components: {
      //
    },
    props: {
      //
    },
    data: () => ({
      menu: false,
      user: {
        initials: 'ЮК',
        email: 'kim.uo@niistt.ru',
      },
    }),
    computed: {
      ...mapGetters({
        authenticated: 'auth/authenticated',
        userInitials: 'auth/userInitials'
      }),
    },
    methods: {
      ...mapActions({
        logOutAction: 'auth/logOut',
      }),
      logOut() {
        this.menu = false
        this.logOutAction().then(() => {
          this.$router.replace({
            name: 'login'
          })
        })
      }
    }
  }
</script>


<style >
</style>