<template>
  <v-container fluid fill-height class="login-page d-flex justify-center align-center" >
    <v-card class="pa-7">
      <h1 class="mb-2 text-h5 grey--text">Вход в систему</h1>
<!-- color="cyan darken-2" -->
      <validation-observer ref="observer" v-slot="{ invalid }">
        <form @submit.prevent="submit" class="d-flex flex-column" height="300px">
            <validation-provider
              v-slot="{ errors }"
              name="Email"
              rules="required|email"
            >
              <v-text-field
                color="grey"
                v-model="form.email"
                :error-messages="errors"
                label="E-mail"
                prepend-inner-icon="mdi-account"
                outlined
                clearable 
                required
              ></v-text-field>
            </validation-provider>

          <validation-provider
            v-slot="{ errors }"
            name="Пароль"
            rules="required|min:6"
          >
            <v-text-field
              color="grey"
              v-model="form.password"
              label="Пароль"
              prepend-inner-icon="mdi-lock"
              :error-messages="errors"
              :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
              :type="show ? 'text' : 'password'"
              @click:append="show = !show"
              outlined
              clearable
              required
            ></v-text-field>
          </validation-provider>

          <v-btn 
            :disabled="invalid" 
            @click.prevent="submit"  
            color="blue" 
            class="white--text"
            type="submit"
          >
            Войти
          </v-btn>

          <span class="errorMessage mt-3">{{ errorMessage }}</span>

        </form>
      </validation-observer>
    </v-card>
  
  </v-container>
</template>


<script>
  import { mapGetters, mapActions } from 'vuex'
  import { ValidationProvider, ValidationObserver, setInteractionMode, extend } from 'vee-validate'
  import { required, email, min } from 'vee-validate/dist/rules'

  setInteractionMode('aggressive')

  extend('required', {
    ...required,
    message: '{_field_} - обязательное поле',
  })

  extend('email', {
    ...email,
    message: 'Неверный формат email',
  })

  extend('min', {
    ...min,
    message: 'Длина пароля должна быть не менее 6 символов',
  })

  export default {
    name: 'LogIn',
    components: {
      ValidationProvider,
      ValidationObserver,
    },
    computed: {
      ...mapGetters({
        errorMessage: 'auth/errorMessage',
        // isAdmin: 'auth/isAdmin',
      }),
    },
    data () {
      return {
        form: {
          email: '',
          password: ''
        },
        show: false,
        rules: {
          required: value => !!value || 'Обязательное поле',
          password: value => value.length >= 6 || 'Длина пароля должна быть не менее 6 символов',
          email: value => {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return pattern.test(value) || 'Недопустимый формат email'
          },
        },
      }
    },
    methods: {
      ...mapActions({
        signIn: 'auth/signIn'
      }),
      submit() {
        this.signIn(this.form)
        .then( () => {
          if (this.errorMessage == null) {
            this.$router.replace({
              path: '/posts'
            })
          } else {
            this.form.email = null
            this.form.password = null
            requestAnimationFrame(() => {
              this.$refs.observer.reset();
            })
          }
        })
      }
    }
  }
</script>

<style scoped>
  .login-page {
    background: url(../assets/background.png);
    background-size: cover;
  }

  .errorMessage {
    width: 100%;
    text-align: center;
    color: #ff5f3a;
  }
</style>