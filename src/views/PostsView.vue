<template>

  <div fluid class="d-flex flex-column ma-0 pa-7 align-self-start">
    <div class="d-flex flex-column mb-7 postsCards">
      <div class="pb-7 d-flex align-center">
        <h2 class="text-h5">Посты РТМ</h2>
        <v-btn icon large color="green" @click.prevent="getPostsInfo()">
          <v-icon>mdi-cached</v-icon>
        </v-btn>
      </div>

      <div class="postsOverviw">

        <v-dialog v-model="dialog" :fullscreen="$vuetify.breakpoint.smAndDown" max-width="1300">   
          <template v-slot:activator="{ on, attrs }">
            <v-container fluid class="ma-0 pa-0">
              <v-row>
                <template v-for="(post, i) in postsRes.targets">
                  <v-col :key="i" cols="12" sm="6" md="4" lg="3"> 
                    <v-hover v-slot:default="{ hover }">
                      <v-card :elevation="hover ? 2 : 0"  
                        @click="getSelectedPost(post)"
                        class="pa-4 post-card rounded-lg unfocus hover"                 
                        v-bind="attrs"
                        v-on="on"
                        flat
                      >
                        <div class="status-info">
                          <v-chip v-if="post.status == true" color="#03a809" outlined pill small>НОРМА</v-chip>
                          <v-chip v-else color="#fc4b6c" outlined pill small>ОШИБКА</v-chip>
                        </div>                
                        <v-card-title class="font-weight-regular">{{ post.location }}</v-card-title>
                        <v-card-subtitle class="d-flex">
                          <v-icon size="18" class="mr-1">mdi-map-marker-outline</v-icon>
                          {{ post.ip }}
                        </v-card-subtitle>               
                      </v-card>
                    </v-hover>

                  </v-col>
                </template>
              </v-row>
            </v-container>
          </template>
         
          <SelectedPostInfo v-if="dialog" :selectedItem="selectedItem" @closeDialog='closeDialog'/>

        </v-dialog>

      </div>
    </div>

    <div>
      <div class="d-flex justify-space-between align-center pb-7">
        <h2 class="text-h5">Состояние постов РТМ</h2>
        <div class="d-flex align-center">
          <v-icon dense class="mr-1">mdi-update</v-icon>
          <span class="text-subtitle-1">Обновлено {{dayF}} {{month1}} {{yearF}} в {{time}}</span>
        </div>
      </div>

      <div class="postsTable">
        <v-data-table
          :headers="headers"
          :items="posts"
          class="elevation-1 custom-table"
          hide-default-footer
        >
        </v-data-table>
      </div>
    </div>

    <v-snackbar v-model="snackbar" multi-line color="pink" text top timeout="-1">
      К сожалению, сервер недоступен
    </v-snackbar>

  </div>

</template>

<script>
import axios from "axios";
import { mapActions } from "vuex";
import SelectedPostInfo from "@/components/SelectedPostInfo.vue";

export default {
  name: "PostsView",
  components: {
    SelectedPostInfo,
  },
  data: () => ({
    snackbar: false,
    selectedItemStatistics: [],
    dataDraft: [],
    dateArr: [],
    tableArr: [],
    timer: null,
    timerTable: null,
    selectedItem: Object,

    dialog: false,
    selectedPost: true,
    postsRes: Object,
    headers: [
      { text: "№", value: "id", align: "center" },
      { text: "Расположение РТП", value: "location" },
      { text: "Текущее состояние (примечания)", value: "state_post", sortable: false },
      { text: "Планируемый срок выполнения/текущее состояние", value: "exePeriod", sortable: false },
      { text: "Состав работ", value: "scopeOfwork", sortable: false },
    ],
    posts: [],
    postsDraft: []  
  }),
  computed: {
    // ...mapGetters({
    //   authenticated: "auth/authenticated",
    // }),
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

    async getPostsInfo() {
      this.postsDraft = []
      await axios
        .post("/", { RFI: 2, token: localStorage.getItem("token") })
        .then((response) => {
          if (response.data.RC == 0) {
            this.postsRes = response.data;

            this.tableArr = response.data.targets
            this.date = response.data.last_mod_date;
            this.transformDate()
            
            for (let i=0; i<this.tableArr.length; i+=1) {
              let ttt = {
                id: this.tableArr[i].id,
                location: this.tableArr[i].location,
                state_post: this.tableArr[i].current_state.state_post,
                exePeriod: this.tableArr[i].current_state.exePeriod,
                scopeOfwork: this.tableArr[i].current_state.scopeOfwork,
              }
              this.postsDraft.push(ttt)
            }
            this.posts = this.postsDraft
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

    // async getStatistics(postId) {
    //   console.log('хэллё')
    //   this.dataDraft = []
    //   await axios
    //     .post("/", { RFI: 11, token: localStorage.getItem("token"), id: postId })
    //     .then((response) => {
    //       if (response.data.RC == 0) {
    //         this.dateArr = response.data.statistics;
            
    //         for (let i=0; i<this.dateArr.length; i+=1) {
              
    //           if (this.dateArr[i].value == true) {
    //             this.dateArr[i].value = 1
    //           } else {
    //             this.dateArr[i].value = 0
    //           }

    //           let ttt = [+(this.dateArr[i].data + '000'), this.dateArr[i].value]

    //           this.dataDraft.push(ttt)
    //         }
    //         this.selectedItemStatistics = this.dataDraft

    //       } else {
    //         this.logOut().then(() => {
    //           this.$router.push({
    //             path: "/login",
    //           });
    //         });
    //       }
    //     });
    // },

    getSelectedPost(post) {
      this.selectedItem = post;
      // this.getStatistics(post.id)
    },

    async getPostsTable() {
      await axios
        .post("/", { RFI: 7, token: localStorage.getItem("token") })
        .then((response) => {
          if (response.data.RC == 0) {
            this.posts = response.data.targets;
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
    },


    closeDialog() {
      this.dialog = false
    },

  },
  mounted() {
    this.getPostsInfo();
    this.timer = setInterval(() => this.getPostsInfo(), 1000);
  },
  beforeRouteLeave(to, from, next) {
    if (this.timer) {
      this.timer = clearInterval(this.timer);
    }
    if (this.timerTable) {
      this.timerTable = clearInterval(this.timerTable);
    }
    if (this.snackbar == true) {
      window.location.reload()
    } else {
    next();
    }
  },
};
</script>

<style lang="sass">
.postsCards
  flex: 0 1 400px
  min-height: 400px
  overflow-y: scroll

  .posts-wrap
    display: grid
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr))
    grid-gap: 30px

  .status-info
    position: absolute
    top: 16px
    right: 16px
    display: flex
    flex-flow: row nowrap
    align-items: center

    .dot
      margin-right: 5px
      width: 15px
      height: 15px
      border-radius: 50%

    .green
      background-color: #76FF03

    .orange
      background-color: #FF5722

  .posts-header
    display: flex
    align-items: center
    gap: 12px

  .post-card__title
    display: flex
    margin-left: 16px

.theme--light.v-chip:hover::before 
    opacity: 0



</style>