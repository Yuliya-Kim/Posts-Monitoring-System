<template>
  <v-container fluid class="pa-7 align-self-start">
    <h2 class="text-h5 mb-7">Пользователи</h2>
    <!-- <div class="ma-0 pa-0 posts-header pb-7 d-flex justify-space-between"></div> -->

<v-card class="pa-7 rounded-lg">
    <!-- Сообщения об ошибках -->
    <v-alert v-if="message === true" type="warning" text dismissible>
      Возможно, данные были изменены. Рекомендуется
      <a @click.prevent="getUsers()">обновить</a> таблицу.
    </v-alert>

    <v-alert v-if="errorMessageActions === true" type="warning" text dismissible>
      {{ errorMessageActionsText }}. <a @click.prevent="getUsers()">Обновить</a> таблицу.
    </v-alert>


    <!-- Поиск и добавление пользователя -->
    <v-row class="ma-0 pa-0 mb-3 d-flex align-center">
      
      <v-col cols="12" sm="4" class="pa-0">
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Поиск"
          hide-details
          color="grey"
          outlined
          dense
        ></v-text-field>
      </v-col>
      
      <v-col class="pa-0 d-flex justify-end">
        <v-dialog v-model="dialog" max-width="560px">

          <template v-slot:activator="{ on, attrs }">
            <v-btn v-bind="attrs" v-on="on" large elevation="0" class="green white--text">
              <v-icon class="mr-3">mdi-account-plus</v-icon>
              Добавить пользователя
            </v-btn>
          </template>

          <v-card light>

            <v-toolbar flat dark color="cyan" class="flex-grow-0">
              <v-toolbar-title class="ml-7">Новый пользователь</v-toolbar-title>
              <v-btn icon absolute dark right @click="resetForm(), dialog = false">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-toolbar>

            <!-- <v-btn icon absolute right @click="resetForm(), dialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn> -->
            <!-- <v-card-title class="text-h5">Добавить пользователя</v-card-title> -->

            <validation-observer ref="observer" v-slot="{ invalid }">
              
              <v-card-text class="pa-7">
                <v-form>

                  <validation-provider v-slot="{ errors }" name="Имя" rules="required">
                    <v-text-field
                      color="grey"
                      v-model="form.name"
                      :error-messages="errors"
                      label="Имя"
                      outlined
                      clearable
                      
                    ></v-text-field>
                  </validation-provider>

                  <validation-provider v-slot="{ errors }" name="Фамилия" rules="required">
                    <v-text-field
                      color="grey"
                      v-model="form.surname"
                      :error-messages="errors"
                      label="Фамилия"
                      outlined
                      clearable
                      
                    ></v-text-field>
                  </validation-provider>

                  <validation-provider v-slot="{ errors }" name="E-mail" rules="required|email">
                    <v-text-field
                      color="grey"
                      v-model="form.email"
                      :error-messages="errors"
                      label="E-mail"
                      outlined
                      clearable
                      
                    ></v-text-field>
                  </validation-provider>

                  <validation-provider v-slot="{ errors }" name="Пароль" rules="required|min:6">
                    <v-text-field
                      color="grey"
                      v-model="form.password"
                      label="Пароль"
                      :error-messages="errors"
                      :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                      :type="show ? 'text' : 'password'"
                      @click:append="show = !show"
                      outlined
                      clearable
                      
                    ></v-text-field>
                  </validation-provider>

                  <v-checkbox v-model="form.isAdmin" label="Администратор" class="ma-0 pa-0 checkbox-custom" color="grey"></v-checkbox>
                
                </v-form>
              </v-card-text>

              <v-alert v-if="errorMessageForm" type="warning" text dismissible class="mx-7 mb-7">
                {{ errorMessageForm }}
              </v-alert>

              <!-- <span class="errorMessage mt-3">{{ errorMessageForm }}</span> -->

              <v-card-actions class="pa-7 pt-0">
                <v-spacer></v-spacer>
                <v-btn @click="resetForm(), (dialog = false)" color="pink" text>
                  Отмена
                </v-btn>
                <v-btn :disabled="invalid" @click.prevent="addUser" color="cyan" class="white--text">
                  Добавить
                </v-btn>
              </v-card-actions>

            </validation-observer>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>



    <!-- Таблица -->
    <v-data-table
      :headers="headers"
      :items="users"
      :search="search"
      class="custom-table"
      :footer-props="{
        showFirstLastPage: true,
        firstIcon: 'mdi-arrow-collapse-left',
        lastIcon: 'mdi-arrow-collapse-right',
        prevIcon: 'mdi-minus',
        nextIcon: 'mdi-plus',
        'items-per-page-text':'Количество записей на странице',                   
      }"
    >
      <template v-slot:body="{ items }">
        <tbody>
          <tr v-for="item in items" :key="item.email">

            <td>
              <validation-observer ref="observer">
                <v-edit-dialog
                  class="dialog"
                  :return-value.sync="item.name"
                  cancel-text="Отмена"
                  save-text="Сохранить"
                  large
                  @save="save(item)"
                >
                  <div>{{ item.name }}</div>
                  <template v-slot:input>
                    <div class="mt-4 title">Имя пользователя</div>
                    <validation-provider
                      v-slot="{ errors }"
                      name="Имя"
                      rules="required"
                    >
                      <v-textarea
                        outlined
                        auto-grow
                        v-model="item.name"
                        :error-messages="errors"
                        autofocus
                        rows="4"
                        row-height="15"
                      ></v-textarea>
                    </validation-provider>
                  </template>
                </v-edit-dialog>
              </validation-observer>
            </td>


            <td class="td-custom td-editable">
              <validation-observer ref="observer">
                <v-edit-dialog
                  class="dialog"
                  :return-value.sync="item.surname"
                  cancel-text="Отмена"
                  save-text="Сохранить"
                  large
                  @save="save(item)"
                >
                  <div>{{ item.surname }}</div>
                  <template v-slot:input>
                    <div class="mt-4 title">Фамилия пользователя</div>
                    <validation-provider
                      v-slot="{ errors }"
                      name="Фамилия"
                      rules="required"
                    >  
                      <v-textarea
                        outlined
                        auto-grow
                        v-model="item.surname"
                        :error-messages="errors"
                        autofocus
                        rows="4"
                        row-height="15"
                      ></v-textarea>
                    </validation-provider>
                  </template>
                </v-edit-dialog>
              </validation-observer>
            </td>

            <td>
              <div>{{ item.email }}</div>
            </td>

            <td class="td-custom td-editable">
              <v-edit-dialog
                class="dialog"
                :return-value.sync="item.isAdmin"
                cancel-text="Отмена"
                save-text="Сохранить"
                large
                @save="save(item)"
              >
                <div v-if="item.isAdmin == true">
                  <v-chip label link color="green lighten-5" class="green--text">Администратор</v-chip>
                </div>

                <div v-else>
                  <v-chip label link color="grey lighten-5" class="grey--text">Пользователь</v-chip>
                </div>

                <template v-slot:input>
                  <div class="mt-4 title">Права доступа</div>
                  <v-radio-group v-model="item.isAdmin">
                    <v-radio label="Администратор" :value="true"></v-radio>
                    <v-radio label="Пользователь" :value="false"></v-radio>
                  </v-radio-group>
                </template>
              </v-edit-dialog>
            </td>

            <td class="td-custom td-editable">
              <div class="d-flex justify-center">
                <v-icon color="#fc4b6c" @click="deleteItem(item)">mdi-delete</v-icon>
              </div>
            </td>
          </tr>
        </tbody>
      </template>

      <template v-slot:no-data>
        <v-btn color="primary" @click="initialize">Обновить</v-btn>
      </template>
    </v-data-table>
</v-card>

    <v-snackbar v-model="snackbar" multi-line color="pink" text top timeout="-1">
      К сожалению, сервер недоступен
    </v-snackbar>

  </v-container>
</template>

<script>
import axios from "axios";
import { mapActions } from "vuex";
import { ValidationProvider, ValidationObserver, setInteractionMode, extend, } from "vee-validate";
import { required, email, min } from "vee-validate/dist/rules";

setInteractionMode("aggressive");

extend("required", {
  ...required,
  message: "{_field_} - обязательное поле",
});

extend("email", {
  ...email,
  message: "Неверный формат email",
});

extend("min", {
  ...min,
  message: "Длина пароля должна быть не менее 6 символов",
});

export default {
  name: "UsersView",
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  data() {
    return {
      snackbar: false,
      search: '',
      message: false,
      errorMessageForm: null,
      errorMessageActions: false,
      errorMessageActionsText: null,
      dialog: false,
      show: false,
      form: {
        name: "",
        surname: "",
        email: "",
        password: "",
        isAdmin: false,
      },
      timer: null,
      headers: [
        { text: "Имя", value: "name", align: "start" },
        { text: "Фамилия", value: "surname", align: "start" },
        { text: "E-mail", value: "email", align: "start" },
        { text: "Роль", value: "isAdmin" },
        { text: "", value: "actions" },
      ],
      users: [],
      editedIndex: -1,
      editedItem: {
        name: "",
        surname: "",
        email: "",
        isAdmin: "",
      },
      defaultItem: {
        name: "",
        surname: "",
        email: "",
        isAdmin: "",
      },
    };
  },
  methods: {
    ...mapActions({
      logOut: "auth/logOut",
    }),

    stopRequests() {
      if (this.timer) {
        this.timer = clearInterval(this.timer);
      }
      // if (this.statusTimer) {
      //   console.log('...и запрос состояний постов тоже выключаем!')
      //   this.statusTimer = clearInterval(this.statusTimer);
      // }
      this.snackbar = true
    },

    async getUsers() {
      if (this.timer) {
        this.timer = clearInterval(this.timer);
      }
      await axios
        .post("/", { RFI: 5, token: localStorage.getItem("token") })
        .then((response) => {
          if (response.data.RC == 0) {
            this.users = response.data.users;
            localStorage.setItem("usersCRC", response.data.crc);
            this.message = false;
            this.errorMessageActions = false;
            this.errorMessageActionsText = null;
            this.timer = setInterval(() => this.checkCRC(), 1000);
          } else {
            this.logOut().then(() => {
              this.$router.push({
                path: "/login",
              });
            });
          }         
        })
        .catch(err => { 
          if (err.response) { 
            this.stopRequests()
          } 
        })
    },

    async checkCRC() {
      await axios
        .post("/", { RFI: 10, token: localStorage.getItem("token"), crc: parseInt(localStorage.usersCRC), file_name: "users", })
        .then((response) => {
          if (response.data.NUM_ERR == 13) {
            this.message = true;
          } else if (response.data.NUM_ERR == 12) {
            this.logOut().then(() => {
              this.$router.push({
                path: "/login",
              });
            });            
          }
        })
        .catch(err => { 
          if (err.response) { 
            this.stopRequests()
          } 
        })
    },

    addUser() {
      if (this.timer) {
        this.timer = clearInterval(this.timer);
      }
      axios
        .post("/", {
          RFI: 0,
          isAdmin: this.form.isAdmin,
          name: this.form.name,
          surname: this.form.surname,
          email: this.form.email,
          pass: this.form.password,
        })
        .then((response) => {
          if (response.data.RC == 0) {
            this.errorMessageForm = null;
            // this.errorMessageActions = null;
            this.dialog = false;
            this.resetForm();
            this.getUsers();
          } else {
            this.errorMessageForm = response.data.__ERR;
            this.resetForm();
          }
        })
        .catch(err => { 
          if (err.response) { 
            this.stopRequests()
          } 
        })
    },

    save(item) {
      if (this.timer) {
        this.timer = clearInterval(this.timer);
      }
      axios
        .post("/", {
          RFI: 9,
          token: localStorage.getItem("token"),
          isAdmin: item.isAdmin,
          name: item.name,
          surname: item.surname,
          email: item.email,
        })
        .then((response) => {
          if (response.data.RC == 0) {
            this.getUsers();
          } else if (response.data.__ERR == 11) {
            this.errorMessageActions = true;
            this.errorMessageActionsText = response.data.__ERR;
          } else if (response.data.__ERR == 8) {
            this.errorMessageActions = true;
            this.errorMessageActionsText = "Ошибка записи";
          } else if (response.data.__ERR == 12) {
            this.logOut().then(() => {
              this.$router.push({
                path: "/login",
              });
            });
          }
        })
        .catch(err => { 
          if (err.response) { 
            this.stopRequests()
          } 
        })
    },

    deleteItem(item) {
      if (this.timer) {
        this.timer = clearInterval(this.timer);
      }
      let deleteConfirm = confirm("Вы уверены, что хотите удалить пользователя?");
      if (deleteConfirm == true) {
        axios
          .post("/", { RFI: 6, token: localStorage.getItem("token"), email: item.email })
          .then((response) => {
            if (response.data.RC == 0) {
              if (response.data.current_user == true) {
                this.logOut().then(() => {
                  this.$router.push({
                    path: "/login",
                  });
                });
              } else {
                this.getUsers();
              }
            } else if (response.data.__ERR == 11) {
              this.errorMessageActions = true;
              this.errorMessageActionsText = response.data.__ERR;
            } else if (response.data.__ERR == 8) {
              this.errorMessageActions = true;
              this.errorMessageActionsText = "Ошибка записи";
            } else if (response.data.__ERR == 12) {
              this.logOut().then(() => {
                this.$router.push({
                  path: "/login",
                });
              });
            }
          })
          .catch(err => { 
          if (err.response) { 
            this.stopRequests()
          } 
        })
      }
    },

    resetForm() {
      this.form.name = "";
      this.form.surname = "";
      this.form.email = "";
      this.form.password = "";
      this.form.isAdmin = false;
      requestAnimationFrame(() => {
        this.$refs.observer.reset();
      });
    },
  },

  beforeRouteLeave(to, from, next) {
    if (this.timer) {
      this.timer = clearInterval(this.timer);
    }
    localStorage.removeItem("usersCRC");
    if (this.snackbar == true) {
      window.location.reload()
    } else {
    next();
    }
  },

  created() {
    this.getUsers();
    window.addEventListener("beforeunload", function () {
      localStorage.removeItem("usersCRC");
    });
  },
};
</script>


<style>
/* .errorMessage {
  width: 100%;
  text-align: center;
  color: #ff5f3a;
} */
.checkbox-custom .v-input__slot {
  margin: 0 !important;
}
.checkbox-custom .v-messages {
  display: none !important;
}
</style>