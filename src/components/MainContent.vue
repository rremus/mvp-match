<template>
  <div class="main-content-wrapper">
    <div class="title-and-dropdowns">
      <div class="title-and-description">
        <h2 class="title">
          Reports
        </h2>
        <p class="description">
          Easily generate a report of your transactions
        </p>
      </div>

      <div class="dropdowns">
        <Dropdown
            placeholder="Select project"
            :options="projectsList"
            option-label="name"
            option-value="projectId"
            v-model="report.projectId"
            @change="onProjectChanged"
            class="dropdown"/>

        <Dropdown
            placeholder="Select gateway"
            :options="gatewaysList"
            option-label="name"
            option-value="gatewayId"
            v-model="report.gatewayId"
            @change="onGatewayChanged"
            class="dropdown"/>

        <Calendar
            placeholder="From date"
            @date-select="fromDateSelected"
            :show-icon="true"
            v-model="report.from"
            date-format="yy-mm-dd"
            class="calendar"/>

        <Calendar
            placeholder="To date"
            @date-select="toDateSelected"
            :show-icon="true"
            v-model="report.to"
            date-format="yy-mm-dd"
            class="calendar"/>


        <div v-tooltip.bottom="getTooltip">
          <Button
              @click="generateReport"
              :disabled="disableSave"
              label="Generate report"
              class="report-button"/>
        </div>
      </div>
    </div>

    <div class="content-area-wrapper">

      <div v-if="isLoading" class="spinner-wrapper">
        <ProgressSpinner />
      </div>
      <div
          :style="dynamicWidth"
          :class="{'white-bg': noReports,
                   'width-50': chartActive,
                   'width-100': !chartActive}"
          class="content-area">
        <div
            v-if="projectSelected && showTable"
            class="all-projects-wrapper">
          <div class="titles">
            <span>{{ this.projectSelected.name }}</span>
            <span
                v-if="gatewaySelected"
                class="divider">
            |
          </span>
            <span>{{ this.gatewaySelected.name }}</span>
          </div>

          <ScrollPanel style="width: 100%; height: 90%;">
            <Accordion>
              <AccordionTab>
                <template #header>
                  <div class="accordion-header">
                    <span>{{ projectSelected.name }}</span>
                    <span v-if="projectTotals > 0">TOTAL: {{projectTotals.toString().split('.')[0]}} USD</span>
                  </div>
                </template>

                <div>
                  <div class="project-wrapper">
                    <div class="project-headers">
                      <span>
                        Date
                      </span>
                      <span>
                        TransactionID
                      </span>
                      <span>
                        Amount
                      </span>
                    </div>
                    <div
                        v-for="(project, index) in reportData"
                        :key="index"
                        class="project-details">
                      <div class="column">
                        <p>
                          {{ project.created }}
                        </p>
                      </div>

                      <div class="column">
                        <p>
                          {{ project.projectId }}
                        </p>
                      </div>

                      <div class="column">
                        <p>
                          {{ project.amount }} USD
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </AccordionTab>

            </Accordion>
          </ScrollPanel>
        </div>

        <div
            v-else-if="gatewaySelected && showTable"
            class="all-gateways-wrapper">
          <div class="titles">
            <span v-if="projectSelected">{{ this.projectSelected.name }}</span>
            <span
                v-if="gatewaySelected && projectSelected"
                class="divider">
            |
          </span>
            <span>{{ this.gatewaySelected.name }}</span>
          </div>
          <Accordion>
            <AccordionTab
                v-for="(gateway, index) in gatewaysList.slice(1)"
                :key="index">
              <template #header>
                <div class="accordion-header">
                  <span>{{ gateway.name }}</span>
                  <span v-if="gatewayTotal > 0">TOTAL: {{gatewayTotal.toString().split('.')[0]}} USD</span>
                </div>
              </template>

              <div>
                <div class="project-wrapper">
                  <div class="project-headers">
                    <span>
                      Date
                    </span>
                    <span>
                    Transaction ID
                    </span>
                    <span>
                      Amount
                    </span>
                  </div>
                  <div
                      v-for="(gateway, index) in reportData"
                      :key="index"
                      class="gateway-details">
                    <div class="column">
                      <p>
                        {{ gateway.created }}
                      </p>
                    </div>

                    <div class="column">
                      <p>
                        {{ gateway.projectId }}
                      </p>
                    </div>

                    <div class="column">
                      <p>
                        {{ gateway.amount }} USD
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </AccordionTab>
          </Accordion>
        </div>

        <div
            v-else
            class="no-reports">
          <h1 class="title">
            No reports
          </h1>
          <p class="description">
            Currently you have no data for the reports to be generated.
            Once you start generating traffic through the Balance application
            the reports will be shown.
          </p>
          <Report/>
        </div>
      </div>

      <div
          v-if="chartActive && showTable"
          :class="{'width-50': chartActive,
                   'hide': !chartActive}"
          class="chart-area-wrapper">
        <Chart
            class="chart-pie"
            type="doughnut"
            :data="chartData"
            :options="chartOptions">
        </Chart>

        <div class="total">
          <span v-if="projectTotals > 0" class="total-text">
            PROJECT TOTAL : {{projectTotals.toString().split('.')[0]}} USD
          </span>

          <span v-else-if="gatewayTotal > 0" class="total-text">
            GATEWAY TOTAL : {{gatewayTotal.toString().split('.')[0]}} USD
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Dropdown from "primevue/dropdown/Dropdown";
import Button from "primevue/button/Button";
import Calendar from "primevue/calendar/Calendar";
import Accordion from "primevue/accordion/Accordion";
import AccordionTab from "primevue/accordiontab/AccordionTab";
import Chart from "primevue/chart/Chart";
import ScrollPanel from 'primevue/scrollpanel';
import ProgressSpinner from 'primevue/progressspinner';
import axios from "axios";
import {ApiPaths} from "@/api";
import Report from "@/components/svg/Report";

export default {
  name: "MainContent",

  components: {
    Report,
    Dropdown,
    Button,
    Calendar,
    Accordion,
    AccordionTab,
    Chart,
    ScrollPanel,
    ProgressSpinner
  },

  mounted() {
    this.getData();
  },

  data() {
    return {
      projectsList: [{name: "All projects", projectId: '00000'}],
      gatewaysList: [{name: "All gateways", gatewayId: '00000'}],
      reportData: [],
      noReports: true,
      allProjects: false,
      allGateways: false,
      projectOne: false,
      gatewayOne: false,
      chartActive: false,
      isLoading: false,
      showTable: false,
      projectLabels: false,
      gatewayLabels: false,
      projectTotals: 0,
      gatewayTotal: 0,
      projectOneTotal: 0,
      projectTwoTotal: 0,
      gatewayOneTotal: 0,
      gatewayTwoTotal: 0,
      projectSelected: '',
      gatewaySelected: '',
      report: {
        projectId: '',
        gatewayId: '',
        from: '',
        to: ''
      },
      chartData: {
        labels: [],
        datasets: [
          {
            data: [],
            backgroundColor: [
              "#A259FF",
              "#F24E1E",
              "#FFC107"
            ],
            hoverBackgroundColor: [
              "#b680fc",
              "#f58666",
              "#ffda6c"
            ]
          }
        ]
      },
      chartOptions: {
        legend: {
          labels: {
            fontColor: '#495057'
          }
        }
      }
    }
  },

  methods: {
    getData() {
      // get users
      axios.get(ApiPaths.getUsers)
          .then((response) => {
            console.log('users', response)
          })
          .catch((error) => console.log('error on getting projects', error));

      // get projects
      axios.get(ApiPaths.getProjects)
          .then((response) => {
            if (response.data.data) {
              this.projectsList.push(...response.data.data)
            }
            console.log('projectsList', this.projectsList)
          })
          .catch((error) => console.log('error on getting projects', error));

      // get gateways
      axios.get(ApiPaths.getGateways)
          .then((response) => {
            if (response.data.data) {
              this.gatewaysList.push(...response.data.data)
            }
            console.log('gatewaysList', this.gatewaysList)
          })
          .catch((error) => console.log('error on getting gateways', error));
    },

    generateReport() {
      this.isLoading = true
      this.chartData.datasets[0].data = []
      this.chartData.labels = []

      if (this.report.projectId === "00000") {
        this.report.projectId = '';
      }

      if (this.report.gatewayId === "00000") {
        this.report.gatewayId = '';
      }

      axios.post(ApiPaths.postReport, this.report)
          .then((response) => {
            this.reportData = response.data.data;
            this.isLoading = false;
            this.showTable = true;

            const tempArr = [...this.reportData]

            this.reportData.forEach((item) => {
              if (this.projectLabels) {
                if (!this.chartData.labels.includes(item.projectId)) {
                  this.chartData.labels.push(item.projectId)
                }


                const proj1Filter = tempArr.filter(item => item.projectId === "ERdPQ")
                const proj2Filter = tempArr.filter(item2 => item2.projectId === "bgYhx")
                this.projectOneTotal = proj1Filter.map(project => project.amount).reduce((first, last) => first + last, 0)
                this.projectTwoTotal = proj2Filter.map(project => project.amount).reduce((first, last) => first + last, 0)

                this.projectTotals = this.projectOneTotal + this.projectTwoTotal

              } else if (this.gatewayLabels){
                if (!this.chartData.labels.includes(item.gatewayId)) {
                  this.chartData.labels.push(item.gatewayId)
                }

                const gate1Filter = tempArr.filter(gate => gate.gatewayId === "i6ssp")
                const gate2Filter = tempArr.filter(gate2 => gate2.gatewayId === "GzFF8")
                this.gatewayOneTotal = gate1Filter.map(project => project.amount).reduce((first, last) => first + last, 0)
                this.gatewayTwoTotal = gate2Filter.map(project => project.amount).reduce((first, last) => first + last, 0)

                this.projectTotals = this.gatewayOneTotal + this.gatewayTwoTotal
              }
            })

            if (this.projectLabels) {
              this.chartData.datasets[0].data.push(this.projectOneTotal, this.projectTwoTotal)
            } else if (this.gatewayLabels) {
              this.chartData.datasets[0].data.push(this.gatewayOneTotal, this.gatewayTwoTotal)
            }
          })
          .catch((error) => console.log('error on generating report', error))

      if(this.allProjects && this.gatewayOne) {
        this.chartActive = true;
      }
      if(this.allGateways && this.projectOne) {
        this.chartActive = true;
      }
    },

    onProjectChanged(inEvent) {
      this.projectSelected = this.projectsList.find(item => item.projectId === inEvent.value);

      switch (this.projectSelected.name) {
        case 'All projects':
          this.allProjects = true;
          this.projectOne = false;
          this.projectLabels = true;
          this.gatewayLabels = false;
          break;
        case 'Project 1':
          this.projectOne = true;
          this.allProjects = false;
          this.allGateways = false;
          break;
        case 'Project 2':
          this.projectOne = true;
          this.allProjects = false;
          this.allGateways = false;
          this.gatewayOne = false;
          break;
      }
    },

    onGatewayChanged(inEvent) {
      this.gatewaySelected = this.gatewaysList.find(item => item.gatewayId === inEvent.value)

      switch (this.gatewaySelected.name) {
        case 'All gateways':
          this.allGateways = true;
          this.gatewayOne = false;
          this.projectLabels = false;
          this.gatewayLabels = true;
          break;
        case 'Gateway 1':
          this.allGateways = false;
          this.gatewayOne = true;
          break;
        case 'Gateway 2':
          this.allGateways = false;
          this.allProjects = false;
          this.projectOne = false;
          this.gatewayOne = true;
          break;
      }
    },

    fromDateSelected(dateTime) {
      if (dateTime != null) {
        const dt = new Date(dateTime);
        this.report.from = dt.toISOString().split('T')[0];
      }
    },

    toDateSelected(dateTime) {
      if (dateTime != null) {
        const dt = new Date(dateTime);
        this.report.to = dt.toISOString().split('T')[0];
      }
    }
  },

  computed: {
    disableSave() {
      return this.report.from === '' || this.report.to === '';
    },

    dynamicWidth() {
      return window.innerWidth + 'px';
    },

    getTooltip() {
      if (this.disableSave === true) {
        return 'Select dates to enable button'
      } else {
        return 'Click to generate report'
      }
    }
  },

}
</script>

<style scoped
       lang="scss">

.main-content-wrapper {
  height: 75%;

  .title-and-dropdowns {
    display: flex;
    justify-content: space-between;

    .title-and-description {
      margin-top: 35px;

      .title {
        font-weight: bold;
        font-size: 24px;
        line-height: 28px;
        color: #011F4B;
        margin: 0;
      }

      .description {
        font-weight: bold;
        font-size: 16px;
        line-height: 19px;
        color: #7E8299;
      }
    }

    .dropdowns {
      display: flex;
      align-items: center;

      .dropdown {
        background-color: #1BC5BD;
        margin-right: 23px;
      }

      .calendar {
        margin-right: 23px;
        width: 160px;
      }

      .report-button {
        width: 148px;
        height: 32px;
        background-color: #005B96;

      }
    }
  }

  .content-area-wrapper {
    display: flex;
    width: 100%;
    height: 100%;

    .spinner-wrapper {
      width: 100%;
      height: 100%;
      background-color: rgba(0,0,0,0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      position: absolute;
      z-index: 20;
      top: 0;
      left: 0;
      border-radius: 12px;
    }

    .width-50 {
      width: 50%;
    }

    .width-100 {
      width: 100%;
    }

    .hide {
      display: none;
    }

    .show {
      display: flex;
    }

    .content-area {
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;

      &.white-bg {
        background-color: white !important;
      }

      .no-reports {
        text-align: center;

        h1 {
          font-weight: bold;
          font-size: 24px;
          line-height: 28px;
          color: #011F4B;
          margin: 0;
        }

        p {
          width: 470px;
          font-weight: bold;
          font-size: 16px;
          line-height: 19px;
          color: #7E8299;
          margin: 4px 0 50px 0;
        }
      }

      .all-projects-wrapper,
      .all-gateways-wrapper {
        width: 100%;
        height: 100%;
        padding: 20px;
        background-color: #f1fafe;
        border-radius: 10px;

        .titles {
          display: flex;
          align-items: center;
          font-weight: bold;
          font-size: 16px;
          line-height: 19px;
          color: #011F4B;
          margin: 0 0 34px 4px;

          .divider {
            margin: 0 4px;
          }
        }

        .project-wrapper {
          width: 100%;

          .project-headers {
            display: flex;
            align-items: center;

            span {
              width: 33%;
              text-align: center;
              text-decoration: underline;
              font-size: 16px;
              color: #011F4B;


              &:first-child {
                text-align: left;
              }

              &:last-child {
                text-align: right;
              }
            }
          }

          .project-details,
          .gateway-details {
            display: flex;

            .column {
              width: 33%;
              text-align: center;

              p {
                height: 34px;
                line-height: 32px;

                &:nth-child(odd) {
                  background: #F1FAFE;
                }
              }

              &:first-child {
                text-align: left;
              }

              &:last-child {
                text-align: right;
              }
            }
          }
        }
      }
    }

    .chart-area-wrapper {
      display: flex;
      height: 100%;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      padding-left: 20px;

      .chart-pie {
        width: 400px;
        height: 400px;
        margin: auto 0;
      }

      .total {
        width: 100%;
        height: 54px;
        border-radius: 10px;
        background-color: #f1fafe;
        display: flex;
        align-items: center;
        justify-self: flex-end;

        .total-text {
          padding: 20px;
          font-size: 16px;
          font-weight: bold;
          line-height: 19px;
          color: #011F4B;
        }
      }
    }
  }

}

.accordion-header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;

  span {
    font-weight: bold;
    font-size: 16px;
    line-height: 19px;
    color: #011F4B;
  }
}
</style>

<style lang="scss">
.p-accordion .p-accordion-header .p-accordion-header-link {
  height: 70px;
  border: 0 !important;
  background: white !important;


  &:hover {
    background: rgba(27, 197, 189, 0.1) !important;
  }
}

.p-button,
.dropdown,
.p-calendar .p-inputtext {
  border: 0 !important;
}

.p-scrollpanel .p-scrollpanel-bar {
  background-color: #1BC5BD !important;
  opacity: 0.5;
  transition: background-color .3s;
}

@keyframes p-progress-spinner-color {
  100%,
  0% {
    stroke: #1BC5BD;
  }
  40% {
    stroke: #FFC107;
  }
  66% {
    stroke: #1BC5BD;
  }
  80%,
  90% {
    stroke: #FFC107;
  }
}
</style>
