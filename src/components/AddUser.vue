<template>
  <div>
    <v-btn  @click="overlay = !overlay" large class="green white--text">
      <v-icon class="mr-3">mdi-account-plus</v-icon>
      Добавить
    </v-btn>

    <v-overlay
      :absolute="absolute"
      :value="overlay"
    >
      <v-card light  class="pa-7" min-width="400px">

        <v-btn icon absolute right @click="overlay = !overlay">
          <v-icon>mdi-close</v-icon>
        </v-btn>

        <h1 class="mb-2 text-h5 grey--text">Добавить пользователя</h1>
        <v-form  class="d-flex flex-column" height="300px">
          <div class="my-3">
            <v-text-field
              color="cyan darken-2"
              v-model="form.name"
              label="Имя"
              outlined
              clearable 
            ></v-text-field>

            <v-text-field
              color="cyan darken-2"
              v-model="form.surname"
              label="Фамилия"
              outlined
              clearable 
            ></v-text-field>

            <v-text-field
              color="cyan darken-2"
              v-model="form.email"
              label="E-mail"
              outlined
              clearable 
            ></v-text-field>
                       
            <v-text-field
              color="cyan darken-2"
              v-model="form.password"
              label="Пароль"
              :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
              :type="show ? 'text' : 'password'"
              @click:append="show = !show"
              outlined
              clearable 
            ></v-text-field>

            <v-checkbox label="Администратор" v-model="form.isAdmin"></v-checkbox>
          </div>

          <v-btn @click.prevent="addUser"  color="success" class="white--text">Добавить</v-btn>

        </v-form>   
      </v-card>       
    </v-overlay>
  </div>
</template>

<script>
  import axios from 'axios'
  // import { mapGetters, mapActions } from 'vuex'
  
  export default {
    name: 'AddUser',
    components: {
      //
    },
    props: {
      //
    },
    data: () => ({
      absolute: true,
      overlay: false,
      checkbox: false,
      show: false,
      form: {
        name: '',
        surname: '',
        email: '',
        password: '',
        isAdmin: false,
      },
    }),
    computed: {
      // ...mapGetters({
      //   authenticated: 'auth/authenticated',
      //   userInitials: 'auth/userInitials'
      // }),
    },
    methods: {
      addUser() {
              if(this.timer) {
        clearInterval(this.timer);
      }
        axios.post('/', {RFI: 0, isAdmin: this.form.isAdmin, name: this.form.name, surname: this.form.surname, email: this.form.email, pass: this.form.password,})
        this.overlay = false
        this.$emit("refreshTable")
      }
    }
  }
</script>


<style >
</style>