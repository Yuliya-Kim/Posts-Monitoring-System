<template>
  <div class="profile">
    
    <div v-if="authenticated" class="d-flex align-center ma-4">
     
      <!-- <v-avatar class="mr-3" color="blue" size="52">
        <span class="white--text">{{ userInitials }}</span>
      </v-avatar> -->
      <v-avatar color="blue" size="50">
        <span class="white--text">{{ userInitials }}</span>
      </v-avatar>

      <div class="d-flex flex-column ml-4">
        <h3 class="text-body-1 font-weight-medium">{{ authenticated.name }} {{ authenticated.surname }}</h3>
        <span class="text-body-2" v-if="authenticated.isAdmin == true">Администратор</span>
        <!-- <div class="d-flex align-center text-body-2 font-weight-light">
          <v-icon dense>mdi-email-outline</v-icon>
          <span class="ml-1 mt-1">{{ authenticated.email }}</span>
        </div> -->
      </div>

      
    </div>

    <v-divider></v-divider>
  </div>
</template>


<script>

  import { mapGetters } from 'vuex'
  
  export default {
    name: 'NavMenuProfile',
    components: {
      //
    },
    props: {
      //
    },
    data: () => ({

    }),
    computed: {
      ...mapGetters({
        authenticated: 'auth/authenticated',
        userInitials: 'auth/userInitials'
      }),
    },
    methods: {
      //
    }
  }
</script>


<style scoped>
.profile {
  /* background: url('../../assets/22.jpg') no-repeat; */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.profile-name {
  
  
margin-top: 40px;
  background: rgba(0,0,0,.2);
}
</style>