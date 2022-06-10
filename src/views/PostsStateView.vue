<template>
  <v-data-table :headers="headers" :items="posts" class="elevation-1" hide-default-footer>


        <template v-slot:item.state_post="{ item }">
          <v-textarea outlined auto-grow v-model="editedItem.state_post" :hide-details="true" dense single-line :autofocus="true" v-if="item.id === editedItem.id"></v-textarea>
          <span v-else>{{item.state_post}}</span>
        </template>
        
        <template v-slot:item.exePeriod="{ item }">
          <v-textarea outlined auto-grow v-model="editedItem.exePeriod" :hide-details="true" dense single-line v-if="item.id === editedItem.id" ></v-textarea>
          <span v-else>{{item.exePeriod}}</span>
        </template>

        <template v-slot:item.scopeOfwork="{ item }">
          <v-textarea outlined auto-grow v-model="editedItem.scopeOfwork" :hide-details="true" dense single-line v-if="item.id === editedItem.id" ></v-textarea>
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
          </div>
        </template>

        <template v-slot:no-data>
          <v-btn color="primary" @click="initialize">Обновить</v-btn>
        </template>

      </v-data-table>
</template>


<script>
  import axios from 'axios'

export default ({
 
  name: 'PostsStateView',
  data: () => ({
    headers: [
      { text: '№', value: 'id', align: 'center' },
      { text: 'Расположение РТП', value: 'location' },
      { text: 'Текущее состояние (примечания)', value: 'currentState', sortable: false },
      { text: 'Планируемый срок выполнения/текущее состояние', value: 'exePeriod', sortable: false },
      { text: 'Состав работ', value: 'scopeOfwork', sortable: false },
      { text: '', value: 'actions', sortable: false },
    ],    
    posts: [],
    editedIndex: -2,
    editedItem: {
      id: -1,
      location: '',
      state_post: '',
      exePeriod: '',
      scopeOfwork: '',
    },
    defaultItem: {
      id: -1,
      location: '',
      state_post: '',
      exePeriod: '',
      scopeOfwork: '',
    }
  }),
  created () {
    this.initialize();
    window.addEventListener('beforeunload', function() {
      localStorage.removeItem('postsCRC')
    })
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

    close () {
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -2;
      }, 300)
    },

    save () {
      if (this.editedIndex > -2) {
        Object.assign(this.posts[this.editedIndex], this.editedItem)
      }
      this.close()
    },
  },
})
</script>


<style scoped>
  th.th-custom {
    background: #e2e3f2;
    color: black;
  }
  td.td-num {
    text-align: center !important;
    padding: 10px !important;
    border:1px solid #dddddd
  }
  td.td-custom {
    white-space: pre-wrap !important; 
    word-wrap: break-word !important;
    padding: 10px !important;
    border:1px solid #dddddd
  }

  .theme--light.v-data-table.v-data-table--fixed-header thead th {
    background: #e8e8e8;
    color: #000 !important;
  }
  .w-100 {
    width: 100%
  }
</style>