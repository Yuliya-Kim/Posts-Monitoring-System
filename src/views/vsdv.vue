<template>
  <v-container fluid class="pa-7 align-self-start ">
   
      <v-data-table :headers="headers" :items="posts" class="elevation-1" fixed-header height="350px">

        
        <template v-slot:item.state="{ item }">
          <v-textarea v-model="editedItem.state" :hide-details="true" dense single-line :autofocus="true" v-if="item.id === editedItem.id"></v-textarea>
          <span v-else>{{item.state}}</span>
        </template>

        <template v-slot:item.exePeriod="{ item }">
          <v-textarea v-model="editedItem.exePeriod" :hide-details="true" dense single-line :autofocus="true" v-if="item.id === editedItem.id"></v-textarea>
          <span v-else>{{item.exePeriod}}</span>
        </template>

        <template v-slot:item.scopeOfwork="{ item }">
          <v-text-field v-model="editedItem.scopeOfwork" :hide-details="true" dense single-line :autofocus="true" v-if="item.id === editedItem.id"></v-text-field>
          <span v-else>{{item.scopeOfwork}}</span>
        </template>
        
        <template v-slot:item.actions="{ item }">
          <div v-if="item.id === editedItem.id">
            <v-icon color="red" class="mr-3" @click="close">
              mdi-window-close
            </v-icon>
            <v-icon color="green"  @click="save">
              mdi-content-save
            </v-icon>
          </div>
          <div v-else>
            <v-icon color="green" class="mr-3" @click="editItem(item)">
              mdi-pencil
            </v-icon>
            <v-icon color="red" @click="deleteItem(item)">
              mdi-delete
            </v-icon>
          </div>
        </template>
        
        <template v-slot:no-data>
          <v-btn color="primary" @click="initialize">Reset</v-btn>
        </template>
        
      </v-data-table>
   

  </v-container>
</template>


<script>
  import axios from 'axios'

  export default {
    name: 'PostsStateView',
    data () {
      return {
        dialog: false,
        dialogDelete: false,
        headers: [
          { text: '№', value: 'id', align: 'center' },
          { text: 'Расположение РТП', value: 'location' },
          { text: 'Текущее состояние (примечания)', value: 'currentState', sortable: false },
          { text: 'Планируемый срок выполнения/текущее состояние', value: 'exePeriod', sortable: false },
          { text: 'Состав работ', value: 'scopeOfwork', sortable: false },
          { text: '', value: 'actions', sortable: false, width: "50px" },
        ],
        posts: [],
        editedIndex: -1,
        editedItem: {
          id: null,
          location: '',
          state: '',
          exePeriod: '',
          scopeOfwork: '',
        },
        defaultItem: {
          id: null,
          location: '',
          state: '',
          exePeriod: '',
          scopeOfwork: '',
        },
      }
    },
    // computed: {
    //   formTitle () {
    //     return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    //   },
    // },
    // watch: {
    //   dialog (val) {
    //     val || this.close()
    //   },
    //   dialogDelete (val) {
    //     val || this.closeDelete()
    //   },
    // },
    created () {
      this.initialize();
    },

    methods: {

      async initialize () {
        await axios.post('/', {RFI: 7, token: localStorage.getItem('token')}).then(response => {
          this.posts = response.data.targets
        }
      )},

    editItem (item) {
      this.editedIndex = this.posts.indexOf(item);
      this.editedItem = Object.assign({}, item);
    },

    deleteItem (item) {
      const index = this.posts.indexOf(item);
      confirm('Are you sure you want to delete this item?') && this.posts.splice(index, 1);
    },

    close () {
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300)
    },

    save () {
      if (this.editedIndex > -1) {
        Object.assign(this.posts[this.editedIndex], this.editedItem)
        axios.post('/', {RFI: 8, token: localStorage.getItem('token'), id: this.editedItem.id, state: this.editedItem.state, exePeriod: this.editedItem.exePeriod, scopeOfwork: this.editedItem.scopeOfwork}).then(response => {
        if (response.data.RC == 0) {
          this.initialize()
        }
      })
      }
      this.close()
    }
//       editItem (item) {
//         this.editedIndex = this.posts.indexOf(item);
//         this.editedItem = Object.assign({}, item);
//         this.dialog = true
//       },

//       close () {
//         this.dialog = false
//         this.$nextTick(() => {
//           this.editedItem = Object.assign({}, this.defaultItem)
//           this.editedIndex = -1
//         })
//       },

// save () {
//   if (this.editedIndex > -1) {
//     Object.assign(this.posts[this.editedIndex], this.editedItem)
//   } else {
//     console.log('SAVE')
//     axios.post('/', {RFI: 8, token: localStorage.getItem('token'), id: this.editedItem.id, state: this.editedItem.state, exePeriod: this.editedItem.exePeriod, scopeOfwork: this.editedItem.scopeOfwork}).then(response => {
//       if (response.data.RC == 0) {
//         this.initialize()
//       }
//     })
//   }
//   this.close()
// },


    },
  }

</script>



<style scoped>

  th.th-custom {
    background: #e2e3f2;
    color: black;
  }
  td.td-num {
    text-align: center !important;
  }
  td.td-custom {
    white-space: pre-wrap !important; 
    word-wrap: break-word !important;
  }

  .theme--light.v-data-table.v-data-table--fixed-header thead th {
    background: #e8e8e8;
    color: #000 !important;
  }
  .w-100 {
    width: 100%
  }

</style>