<template>
  <v-card class="d-flex flex-column" >

    <v-toolbar flat dark color="cyan" class="flex-grow-0">
      <v-toolbar-title class="ml-7">{{selectedItem.location}}</v-toolbar-title>
      <v-btn icon absolute dark right @click="closeDialog()">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-toolbar>

    <v-container fluid>

      <v-row class="ma-0">
        <v-col cols="12" sm="6" md="4">
          <v-select
            v-model="selected"
            :items="selectItems"
            label="Тип графика"
            class="chartTypeSelect"
            color="grey"
            outlined
            dense
          ></v-select>
        </v-col>
      </v-row>


      <v-row class="ma-0">
        <v-col>
          <!-- <v-sheet  class="mx-7 px-5"> -->
          <v-sheet>

       
              <apexChart key="1" v-show="selected == 'Ступенчатый'" ref="chart1" :series="series1" :options="chart1Options" height="149"></apexChart>
            
            
              <apexChart key="2" v-show="selected == 'Диапазоны'" ref="chart2" :series="series2" :options="chart2Options" height="150"></apexChart>
     
          
          </v-sheet>
        </v-col>
      </v-row>


      <v-row class="ma-0" justify="space-between">
        <v-col cols="12" md="4">
          <v-card height="100%">
            <v-card-title class="title-background title-aligment text-body-1 ">Текущее состояние РТП (примечания)</v-card-title>
            <v-divider></v-divider>
            <v-card-text v-if="selectedItem.current_state.state_post == ''" class="text-body-1 text-justify">Нет данных</v-card-text>
            <v-card-text v-else class="text-body-1 text-justify">{{selectedItem.current_state.state_post}}</v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card height="100%">
            <v-card-title class="title-background title-aligment text-body-1 ">Планируемый срок выполнения работ</v-card-title>
            <v-divider></v-divider>
            <v-card-text v-if="selectedItem.current_state.exePeriod == ''" class="text-body-1 text-justify">Нет данных</v-card-text>
            <v-card-text v-else class="text-body-1 text-justify">{{selectedItem.current_state.exePeriod}}</v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card height="100%">
            <v-card-title class="title-background title-aligment text-body-1 ">Состав работ</v-card-title>
            <v-divider></v-divider>
            <v-card-text v-if="selectedItem.current_state.scopeOfwork == ''" class="text-body-1 text-justify">Нет данных</v-card-text>
            <v-card-text v-else class="text-body-1 text-justify">{{selectedItem.current_state.scopeOfwork}}</v-card-text>
          </v-card>
        </v-col>
      </v-row>

    </v-container>
  <v-snackbar v-model="snackbar" multi-line color="pink" text top timeout="-1">
    К сожалению, сервер недоступен
  </v-snackbar>

  </v-card>
</template>


<script>
  import axios from "axios"
  import ru from "apexcharts/dist/locales/ru.json"

  export default {
    name: 'SelectedPostInfo',
    props: {
      selectedItem: Object,
    },

    data: () => ({
      snackbar: false,
      dataDraft: [],
      dataDraft2: [],
      dateArr: [],

      selected: 'Диапазоны',
      selectItems: ['Ступенчатый', 'Диапазоны'],

      // Первый график
      series1: [{
        name: 'Состояние поста РТМ',
        data: [],
      }],
      chart1Options: {

        chart: {
          type: 'line',
          zoom: {
            type: 'x',
            enabled: true,
          },
          locales: [ru],
          defaultLocale: 'ru',
          toolbar: {
            tools: {
              download: false,
              selection: true,
              zoom: true,
              zoomin: true,
              zoomout: true,
              pan: true,
              reset: true | '<img src="/static/icons/reset.png" width="20">',
              customIcons: []
            },
          },
        },

        dataLabels: { enabled: false },

        grid: {
          padding: {
            left: -10,
          },
          borderColor: '#BDBDBD',
          strokeDashArray: 5,
          xaxis: {
            lines: { show: true }
          },   
          yaxis: {
            lines: { show: true }
          },
        },

        stroke: {
          curve: 'stepline',
          width: 2,
          colors: '#93bcd6',
        },

        markers: { 
          size: 1,
          colors: '#1565C0',
          strokeColors: '#1565C0',
          strokeWidth: 2,
          strokeOpacity: 0.9,
          strokeDashArray: 0,
          fillOpacity: 1,
          discrete: [],
          shape: "circle",
          radius: 2,
          offsetX: 0,
          offsetY: 0,
          onClick: undefined,
          onDblClick: undefined,
          showNullDataPoints: true,
          hover: {
            size: undefined,
            sizeOffset: 3
          }
        },

        yaxis: {
          min: 0,
          max: 1,
          tickAmount: 1,
          axisBorder: {
            show: false,
          },
          labels: {
            show: false,
            // align: 'left',
            // formatter: function(val) {
            //   if (val == 1) {
            //     return val = 'НОРМА'
            //   } else if (val == 0) {
            //     return val = 'ОШИБКА'
            //   }             
            // }
          }
        },

        xaxis: {
          type: 'datetime',
          tooltip: {
            enabled: false,
          },
        },

        tooltip: {
          custom: function({ dataPointIndex, w}) {
            const months = ["янв","фев","мар","апр","мая","июн","июл","авг","сен","окт","ноя","дек"];

            // Состояние поста
            let state = w.config.series[0].data[dataPointIndex][1]
            if (state == 1) {
              state = "НОРМА"
            } else if (state == 0) {
              state = "ОШИБКА"
            }
            // Дата
            let date = new Date(w.config.series[0].data[dataPointIndex][0]-10800000)
            let day = date.getDate();
            let month = months[date.getMonth()]; 
            let hours = date.getHours();
            let minutes = "0" + date.getMinutes();
            let seconds = "0" + date.getSeconds();             
            let formattedDate = day + ' ' + month + ', ' + hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

            // Вывод 
            return '<div class="px-3 py-1 white tip-wrapper">' +

            '<div class="my-2 tip-row">' +
              '<span class="text-caption">' + 'Дата: ' + '</span>' + '<span>' + formattedDate + '</span>' +
            '</div>' +

            '<div class="my-2 tip-row">' +
              '<span class="text-caption">' + 'Состояние: ' + '</span>' +
              (state == 'НОРМА' ? '<span class="green--text font-weight-medium">' : '<span class="pink--text font-weight-medium">') + state + '</span>' +
            '</div>' +

            '</div>'
          },
        },
      },

      // Второй график
      series2: [{
        name: 'Состояние поста РТМ',
        data: [],
      }],
      chart2Options: {

        chart: {
          type: 'rangeBar',
          stacked: false,
          locales: [ru],
          defaultLocale: 'ru',
          
          toolbar: {
            tools: {
              download: false,
              selection: true,
              zoom: true,
              zoomin: true,
              zoomout: true,
              pan: true,
              reset: true | '<img src="/static/icons/reset.png" width="20">',
              customIcons: []
            },
          },
        },

        plotOptions: {
          bar: {
            horizontal: true,
            barHeight: '100%',
          }
        },

        grid: {
          padding: {
            left: -10,
          },
        },


        dataLabels: { enabled: false },

        yaxis: {
          axisBorder: { show: false, },
          labels: { offsetX: -15, show: false, }
        },

        xaxis: {
          type: 'datetime',
          tooltip: {
            enabled: true,
            formatter: undefined,
            offsetY: 0,
            style: {
              fontSize: 1,
              fontFamily: 0,
            },
          },
        },

        tooltip: {
          custom: function({ dataPointIndex, w}) {

            const months = ["янв","фев","мар","апр","мая","июн","июл","авг","сен","окт","ноя","дек"];
            let dateArr = [w.config.series[0].data[dataPointIndex].y[0]-10800000, w.config.series[0].data[dataPointIndex].y[1]-10800000]
            let newArr = []

            // Состояние поста
            let state = w.config.series[0].data[dataPointIndex].z.desc
            if (state == 1) {
              state = "НОРМА"
            } else if (state == 0) {
              state = "ОШИБКА"
            }

            // Длительность состояния

            var date1 = new Date(dateArr[0]);
            var date2 = new Date(dateArr[1]);
              
            var Difference_In_Time = date2.getTime() - date1.getTime();

            var durationDay = Math.trunc((Difference_In_Time / ((1000 * 3600))) / 24);

            let duration = new Date((dateArr[1] - dateArr[0]) - 10800000)  


            let durationHours = duration.getHours()
            let durationMinutes = duration.getMinutes();
            let durationSeconds = duration.getSeconds();
            
            let formattedDuration = ''

            if (durationDay == 0) {
              if (durationHours == 0) {
                if (durationMinutes != 0 && durationSeconds != 0) {
                  formattedDuration = durationMinutes + 'м' + ' ' + durationSeconds + 'c'
                }
                if (durationMinutes != 0 && durationSeconds == 0) {
                  formattedDuration = durationMinutes + 'м'
                }
                if (durationMinutes == 0 && durationSeconds != 0) {
                  formattedDuration = durationSeconds + 'c'
                }
              } else if (durationHours != 0) {
                if (durationMinutes == 0 && durationSeconds == 0) {
                  formattedDuration = durationHours + 'ч'
                }
                if (durationMinutes != 0 && durationSeconds == 0) {
                  formattedDuration = durationHours + 'ч'  + ' ' + durationMinutes + 'м'
                }
                if (durationMinutes == 0 && durationSeconds != 0) {
                  formattedDuration = durationHours + 'ч'  + ' ' + durationSeconds + 'с'
                }
                if (durationMinutes != 0 && durationSeconds != 0) {
                  formattedDuration = durationHours + 'ч'  + ' ' + durationMinutes + 'м' + ' ' + durationSeconds + 'с'
                }
              }
            } else if ((durationDay != 0)) {
              if (durationHours == 0) {
                if (durationMinutes != 0 && durationSeconds != 0) {
                  formattedDuration = durationDay + 'д' + ' ' +  durationMinutes + 'м' + ' ' + durationSeconds + 'c'
                }
                if (durationMinutes != 0 && durationSeconds == 0) {
                  formattedDuration = durationDay + 'д' + ' ' +  durationMinutes + 'м'
                }
                if (durationMinutes == 0 && durationSeconds != 0) {
                  formattedDuration = durationDay + 'д' + ' ' +  durationSeconds + 'c'
                }
              } else if (durationHours != 0) {
                if (durationMinutes == 0 && durationSeconds == 0) {
                  formattedDuration = durationDay + 'д' + ' ' +  durationHours + 'ч'
                }
                if (durationMinutes != 0 && durationSeconds == 0) {
                  formattedDuration = durationDay + 'д' + ' ' +  durationHours + 'ч'  + ' ' + durationMinutes + 'м'
                }
                if (durationMinutes == 0 && durationSeconds != 0) {
                  formattedDuration = durationDay + 'д' + ' ' +  durationHours + 'ч'  + ' ' + durationSeconds + 'с'
                }
                if (durationMinutes != 0 && durationSeconds != 0) {
                  formattedDuration = durationDay + 'д' + ' ' +  durationHours + 'ч'  + ' ' + durationMinutes + 'м' + ' ' + durationSeconds + 'с'
                }
              }
            }

            // Период состояния
            for (let i=0; i<dateArr.length; i+=1) {

              let date = new Date(dateArr[i])

              let day = date.getDate();
              let month = months[date.getMonth()]; 
              let hours = date.getHours();
              let minutes = "0" + date.getMinutes();
              let seconds = "0" + date.getSeconds();
              
              let formattedTime = day + ' ' + month + ', ' + hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
              newArr.push(formattedTime)
            }
            let formatedDate = newArr.join(' - ')

            // Вывод 
            return '<div class="px-3 py-1 white tip-wrapper">' +

            '<div class="my-2 tip-row">' +
              '<span class="text-caption">' + 'Состояние: ' + '</span>' +
              (state == 'НОРМА' ? '<span class="green--text font-weight-medium">' : '<span class="pink--text font-weight-medium">') + state + '</span>' +
            '</div>' +

            '<div class="my-2 tip-row">' +
              '<span class="text-caption">' + 'Период: ' + '</span>' + '<span>' + formatedDate + '</span>' +
            '</div>' +

            '<div class="my-2 tip-row">' +
              '<span class="text-caption">' + 'Продолжительность: ' + '</span>' + '<span>' + formattedDuration + '</span>' +
            '</div>' +

            '</div>'
          },
        },

        states: {
          active: {
            filter: {
              type: 'none',
              value: 0.35,
            }
          },
        }         
      },
    }),   
    

    methods: {

    stopRequests() {
      this.snackbar = true
    },
    
    
      async getStatistics() {

        await axios
          .post("/", { RFI: 11, token: localStorage.getItem("token"), id: this.selectedItem.id })
          .then((response) => {
            if (response.data.RC == 0) {

              this.dateArr = response.data.statistics;

              for (let i=0; i<this.dateArr.length; i+=1) {
                
                if (this.dateArr[i].value == true) {
                  this.dateArr[i].value = 1
                } else {
                  this.dateArr[i].value = 0
                }

                let ttt = [(this.dateArr[i].data*1000), this.dateArr[i].value]

                this.dataDraft.push(ttt)

                if(i<this.dateArr.length-1) {
                  let color = ''
                  if (this.dateArr[i].value == true) {
                    color = '#8BC34A'
                  } else if (this.dateArr[i].value == false) {
                    color = '#fc4b6c'
                  }

                  let arrObj = {
                    x: 'Состояние поста РТМ',
                    y: [this.dateArr[i].data*1000, this.dateArr[i+1].data*1000],
                    z: { name : 'value', desc : String(this.dateArr[i].value) },
                    fillColor: color                 
                  }
                  this.dataDraft2.push(arrObj)
                }

              }

              this.$refs.chart1.updateSeries([{
                name: 'Состояние поста РТМ',
                data: this.dataDraft
              }])
              this.$refs.chart2.updateSeries([{
                name: 'Состояние поста РТМ',
                data: this.dataDraft2
              }])              
              
            } else {
              this.logOut().then(() => {
                this.$router.push({
                  path: "/login",
                })
              })
            }
          })
          .catch(err => { 
            if (err.response) { 
              this.stopRequests()
            } 
          })          

      },


      closeDialog() {
        this.$emit('closeDialog')
      },


      onClickOutside() {
        this.$emit('onClickOutside')
      }
    },

    mounted() {
      this.getStatistics()
    },

    destroyed() {

    }
  }

</script>


<style scoped>
  .panels-custom {
    width: calc(100% - 56px);
  }
  .title-background {
    background: #EEEEEE;
  }
  .title-aligment {
    word-break: break-word;
    text-align: justify;
  }
  >>>.chartTypeSelect .v-input__slot {
    margin: 0;
  }
  >>>.chartTypeSelect .v-text-field__details {
    display: none;
  }
  
  .tip-wrapper {
    display: flex;
    flex-direction: column;
  }
  .tip-row {
    display: flex;
  }
  .tip-row .green--text {
    color: #4CAF50;
  }
    .tip-row .pink--text {
    color: #E91E63;
  }
</style>