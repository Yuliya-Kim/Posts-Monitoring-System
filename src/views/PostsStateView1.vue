<template>
  <v-container fluid class="pa-7 align-self-start">
    
    <div class="ma-0 pa-0 posts-header pb-7 d-flex justify-space-between align-center">
      <h2 class="text-h5">Текущее состояние РТП</h2>
      <div class="d-flex align-center">
        <v-icon dense class="mr-1">mdi-update</v-icon>
        <span class="text-subtitle-1">Обновлено {{dayF}} {{month1}} {{yearF}} в {{time}}</span>
      </div>      
    </div>

  <v-card class="pa-7 rounded-lg">   
    <!-- Сообщение об ошибке -->
    <v-alert v-if="message === true" type="warning" text dismissible>
      Возможно, данные были изменены. Рекомендуется
      <a @click.prevent="initialize(), (dialog = false)">обновить</a> таблицу.
    </v-alert>

    <!-- Таблица "Состояние постов" -->
    <v-data-table
      :headers="headers" 
      :items="posts"
      item-key="id"
      show-expand 
      hide-default-footer 
      class="custom-table"
      :header-props="{ sortIcon: null }"
    >

      <!-- Редактирование в окне -->
      <!-- <template v-slot:top>

        <v-dialog v-model="editDialog" :fullscreen="$vuetify.breakpoint.smAndDown" max-width="1300" retain-focus='false'>   
          <v-card light>
            <v-toolbar flat dark color="cyan" class="flex-grow-0">
              <v-toolbar-title class="ml-7">{{editedItem.location}}</v-toolbar-title>
              <v-btn icon absolute dark right @click="editDialog = false">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-toolbar>

            <v-div class="ma-7 pa-0">
              <v-row justify="space-between">
                
                <v-col cols="12" md="4">
                  <v-card height="100%">
                    <v-card-title class="title-background title-aligment text-body-1 ">Текущее состояние РТП (примечания)</v-card-title>
                    <v-divider></v-divider>
                    <v-textarea
                      color="grey"
                      class="textarea-custom"
                      v-model="editedItem.state_post"
                    >                      
                    </v-textarea>
                  </v-card>
                </v-col>
                
                <v-col cols="12" md="4">
                  <v-card height="100%">
                    <v-card-title class="title-background title-aligment text-body-1 ">Планируемый срок выполнения работ</v-card-title>
                    <v-divider></v-divider>
                    <v-textarea
                      color="grey"
                      class="textarea-custom"
                      v-model="editedItem.exePeriod"
                    >                      
                    </v-textarea>                    
                  </v-card>
                </v-col>
                
                <v-col cols="12" md="4">
                  <v-card height="100%">
                    <v-card-title class="title-background title-aligment text-body-1 ">Состав работ</v-card-title>
                    <v-divider></v-divider>
                    <v-textarea
                      color="grey"
                      class="textarea-custom"
                      v-model="editedItem.scopeOfwork"
                    >                      
                    </v-textarea>                    
                  </v-card>
                </v-col>
              </v-row>
            </v-div>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">
                Отмена
              </v-btn>
              <v-btn color="blue darken-1" text @click="save">
                Сохранить
              </v-btn>
            </v-card-actions>

          </v-card>
        </v-dialog>
  
      </template> -->

<!-- 
      <template v-slot:header.id="props">
        <div class="th-id">{{ props.header.id }}</div>
      </template> -->


      <!-- Поле "№" -->
      <template v-slot:item.id="props">
        <div >{{ props.item.id }}</div>
      </template>

      <!-- Поле "Статус" -->
      <template v-slot:item.status="props">
        <div v-if="props.item.status == true">
          <v-chip label color="green lighten-5" class="green--text">НОРМА</v-chip>
        </div>
        <div v-else>
          <v-chip label color="pink lighten-5" class="pink--text">ОШИБКА</v-chip>
        </div>
      </template>

      <!-- Поле "Расположение РТП" -->
      <template v-slot:item.location="props">
        <div class="d-flex flex-column">
          <span>{{ props.item.location }}</span>
          <!-- <div class="d-flex align-center text-caption">
            <v-icon size="16" class="mr-1">mdi-map-marker-outline</v-icon>
            <span>{{ props.item.ip }}</span>
          </div> -->
        </div>
      </template>

      <!-- Редактируемое поле "Текущее состояние" -->
      <template v-slot:item.state_post="props">
        <v-edit-dialog
          class="dialog"
          :return-value.sync="props.item.state_post"
          cancel-text="Отмена"
          save-text="Сохранить"
          large
          @save="save(props.item)"
        >
          <div>{{ props.item.state_post }}</div>

          <template v-slot:input>
            <div class="mt-4 title">Текущее состояние</div>
            <v-textarea
              outlined
              auto-grow
              v-model="props.item.state_post"
              autofocus
              rows="4"
              row-height="15"
            ></v-textarea>
          </template>
        </v-edit-dialog>
      </template>

      <!-- Редактируемое поле "Планируемый срок выполнения" -->
      <template v-slot:item.exePeriod="props">
        <v-edit-dialog
          class="dialog"
          :return-value.sync="props.item.exePeriod"
          cancel-text="Отмена"
          save-text="Сохранить"
          large
          @save="save(props.item)"
        >
          <div>{{ props.item.exePeriod }}</div>

          <template v-slot:input>
            <div class="mt-4 title">Планируемый срок выполнения</div>
            <v-textarea
              outlined
              auto-grow
              v-model="props.item.exePeriod"
              autofocus
              rows="4"
              row-height="15"
            ></v-textarea>
          </template>
        </v-edit-dialog>
      </template>

      <!-- Редактируемое поле "Состав работ" -->
      <template v-slot:item.scopeOfwork="props">
        <v-edit-dialog
          class="dialog"
          :return-value.sync="props.item.scopeOfwork"
          cancel-text="Отмена"
          save-text="Сохранить"
          large
          @save="save(props.item)"
        >
          <div>{{ props.item.scopeOfwork }}</div>

          <template v-slot:input>
            <div class="mt-4 title">Состав работ</div>
            <v-textarea
              outlined
              auto-grow
              v-model="props.item.scopeOfwork"
              autofocus
              rows="4"
              row-height="15"
            ></v-textarea>
          </template>
        </v-edit-dialog>
      </template>

      <template #item.data-table-expand="{ expand, isExpanded }">
        <td>
          <v-btn icon 
                 @click="expand(!isExpanded)" 
                 class="v-data-table__expand-icon"
                 :class="{'v-data-table__expand-icon--active' : isExpanded}">
            <v-icon>mdi-chart-timeline-variant</v-icon>
          </v-btn>
        </td>
      </template>


      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length">

          <activityChart :selectedItem="item"></activityChart>

        </td>
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
import activityChart from "../components/activityChart.vue"

export default {
  name: "PostsStateView1",
  components: {
    activityChart,
  },
  data() {
    return {
      snackbar: false,

      expanded: [],

      editDialog: false,
      date: '',
      date1: '',
      // dateArr: [],

      updatedAt: null,
      day: '',
      time: '',
      month1: '',
      yearF: '', month: '', dayF: '',

      timer: null,
      statusTimer: null,
      dialog: false,
      dialogDelete: false,
      
      posts: [],
      headers: [
        { text: "№", value: "id", align: "center" },
        { text: "Статус", value: "status", align: "center" },
        { text: "Расположение РТП", value: "location" },
        { text: "Текущее состояние (примечания)", value: "state_post", sortable: false, },
        { text: "Планируемый срок выполнения/текущее состояние", value: "exePeriod", sortable: false, },
        { text: "Состав работ", value: "scopeOfwork", sortable: false },
        { text: "", value: "actions", sortable: false },
        { text: "", value: 'data-table-expand' },
      ],
      
      postsCRC: null,
      message: false,

      // editedIndex: -2,
      // editedItem: {
      //   id: -1,
      //   location: '',
      //   state_post: '',
      //   exePeriod: '',
      //   scopeOfwork: '',
      // },
      // defaultItem: {
      //   id: 0,
      //   location: '',
      //   state_post: '',
      //   exePeriod: '',
      //   scopeOfwork: '',
      // },
    };
  },

  created() {
    this.initialize();
    window.addEventListener("beforeunload", function () {
      localStorage.removeItem("postsCRC");
    });
  },

  methods: {

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


    async initialize() {
      if (this.timer) {
        this.timer = clearInterval(this.timer);
      }
      await axios
        .post("/", { RFI: 7, token: localStorage.getItem("token") })
        .then((response) => {
          if (response.data.RC == 0) {
            this.message = false
            this.posts = response.data.targets;

            // if (this.statusTimer) {
            //   this.statusTimer = clearInterval(this.statusTimer);
            // }
            // this.statusTimer = setInterval(() => this.getPostStatus(), 1000);
            // this.getPostStatus()
            this.date = response.data.last_mod_date;
            this.transformDate()

            localStorage.setItem("postsCRC", response.data.crc);

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
        .post("/", { RFI: 10, token: localStorage.getItem("token"), crc: parseInt(localStorage.postsCRC), file_name: "posts", })
        .then((response) => {
          if (response.data.RC == 0) {
            for (let i=0; i<this.posts.length; i+=1) {
              for (let j=0; j<response.data.targets.length; j+=1) {
                if (this.posts[i].id == response.data.targets[j].id) {
                  this.posts[i].status = response.data.targets[j].status
                }
              }
            }
          } else if (response.data.NUM_ERR == 13) {
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

    async save(item) {
      if (this.timer) {
        this.timer = clearInterval(this.timer);
      }
      await axios
        .post("/", {
          RFI: 8,
          token: localStorage.getItem("token"),
          id: item.id,
          state_post: item.state_post,
          exePeriod: item.exePeriod,
          scopeOfwork: item.scopeOfwork,
        })
        .then((response) => {
          if (response.data.RC == 0) {
            this.initialize();
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

    close () {
      this.editDialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -2
      })
    },

    transformDate () {
      this.dateArr = this.date.split(' ')
//    ------------------------------------
      this.day = this.dateArr[0]
      this.time = this.dateArr[1]

      this.dayArr = this.day.split('-')

      this.yearF = this.dayArr[0]
      this.month = this.dayArr[1]
      this.dayF = this.dayArr[2]
      this.transformMonth()
    },
    transformMonth() {
      if (this.month == 'May') {
        this.month1 = 'мая'
      } else if (this.month == 'Jun') {
        this.month1 = 'июня'
      } else if (this.month == 'Jul') {
        this.month1 = 'июля'
      }
    }
  },
  beforeRouteLeave(to, from, next) {
    if (this.timer) {
      this.timer = clearInterval(this.timer);
    }
    localStorage.removeItem("postsCRC");
    if (this.snackbar == true) {
      window.location.reload()
    } else {
    next();
    }
  },
};
</script>



<style scoped>

.theme--light.v-data-table.v-data-table--fixed-header thead th {
  background: #e8e8e8;
  color: #000 !important;
}
.w-100 {
  width: 100%;
}

.v-small-dialog__content .v-small-dialog__actions {
  padding-top: 0 !important;
}
.v-small-dialog__content .v-small-dialog__content title {
  margin-bottom: 16px;
}

.title-background {
  background: #EEEEEE;
}
.title-aligment {
  word-break: break-word;
  text-align: justify;
}

>>>.textarea-custom .v-input__slot {
  margin: 0 !important;
}
>>>.textarea-custom .v-input__slot textarea {
  padding: 0 16px;
}
>>>.textarea-custom .v-text-field__details {
  display: none !important;
}

>>>.th-id {

}
</style>