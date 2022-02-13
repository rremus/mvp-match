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

    <div
        :style="dynamicWidth"
        :class="{'white-bg': noReports}"
        class="content-area">
      <div
          v-if="allProjects"
          class="all-projects-wrapper">
        <div class="titles">
          <span>{{this.projectSelected.name}}</span>
          <span
              v-if="gatewaySelected"
              class="divider">
            |
          </span>
          <span>{{this.gatewaySelected.name}}</span>
        </div>
        <Accordion>
          <AccordionTab
              v-for="(project, index) in projectsList.slice(1)"
              :key="index">
            <template #header>
              <div class="accordion-header">
                <span>{{ project.name }}</span>
                <span>TOTAL: 10,040 USD</span>
              </div>
            </template>

            <div>
              <div class="project-wrapper">
                <div class="project-headers">
                  <span>
                    Date
                  </span>
                  <span>
                    Gateway
                  </span>
                  <span>
                    Transction
                    ID</span>
                  <span>
                    Amount
                  </span>
                </div>
                <div class="project-details">
                  <div class="column">
                    <p>
                      01/21/2021
                    </p>
                    <p>
                      01/24/2021
                    </p>
                  </div>

                  <div class="column">
                    <p>
                      Gateway 1
                    </p>
                    <p>
                      Gateway 2
                    </p>
                  </div>

                  <div class="column">
                    <p>
                      a732b
                    </p>
                    <p>
                      fa242
                    </p>
                  </div>

                  <div class="column">
                    <p>
                      5040 USD
                    </p>
                    <p>
                      5000 USD
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </AccordionTab>
        </Accordion>
      </div>

      <div
          v-else-if="allGateways"
          class="all-gateways-wrapper">
        <div class="titles">
          <span>{{this.projectSelected.name}}</span>
          <span
              v-if="gatewaySelected"
              class="divider">
            |
          </span>
          <span>{{this.gatewaySelected.name}}</span>
        </div>
        <Accordion>
          <AccordionTab
              v-for="(project, index) in gatewaysList.slice(1)"
              :key="index"
              :header="project.name">
            <span>
              {{project}}
            </span>
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
  </div>
</template>

<script>
import Dropdown from "primevue/dropdown/Dropdown";
import Button from "primevue/button/Button";
import Calendar from "primevue/calendar/Calendar";
import Accordion from "primevue/accordion/Accordion";
import AccordionTab from "primevue/accordiontab/AccordionTab";
import axios from "axios";
import {ApiPaths} from "@/api";
import Report from "@/components/svg/Report";

export default {
  name: "MainContent",

  components: {Report, Dropdown, Button, Calendar, Accordion, AccordionTab},

  mounted() {
    this.getData();
  },

  data() {
    return {
      projectsList: [{name: 'All projects', projectId: 'p1024e'}],
      gatewaysList: [{name: 'All gateways', gatewayId: 'ggw224'}],
      noReports: true,
      allProjects: false,
      allGateways: false,
      projectOne: false,
      gatewayOne: false,
      projectSelected: '',
      gatewaySelected: '',
      report: {
        projectId: '',
        gatewayId: '',
        from: '',
        to: ''
      }
    }
  },

  methods: {
    getData() {
      axios.get(ApiPaths.getProjects)
          .then((response) => {
            if (response.data.data) {
              this.projectsList.push(...response.data.data)
            }
            console.log('projectsList', this.projectsList)
          })
          .catch((error) => console.log('error on getting projects', error));

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
      axios.post(ApiPaths.postReport, this.report).then((response) => console.log(response))
    },

    onProjectChanged(inEvent) {
      this.projectSelected = this.projectsList.find(item => item.projectId === inEvent.value)

      switch (this.projectSelected.name) {
        case 'All projects':
          this.allProjects = true;
          this.allGateways = false;
          this.projectOne = false;
          this.gatewayOne = false;
          console.log('All projects selected')
          break;
        case 'Project 1':
          this.projectOne = true;
          this.gatewayOne = false;
          console.log('Project 1 selected')
          break;
        case 'Project 2':
          console.log('Project 2 selected')
          break;
      }

    },

    onGatewayChanged(inEvent) {
      this.gatewaySelected = this.gatewaysList.find(item => item.gatewayId === inEvent.value)

      switch (this.gatewaySelected.name) {
        case 'All gateways':
          this.allGateways = true;
          this.allProjects = false;
          this.projectOne = false;
          this.gatewayOne = false;
          console.log('All gateways selected')
          break;
        case 'Gateway 1':
          this.gatewayOne = true;
          this.projectOne = false;
          console.log('Gateway 1 selected')
          break;
        case 'Gateway 2':
          console.log('gateway 2 selected')
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
      return window.innerWidth + 'px'
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
            width: 25%;
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

        .project-details {
          display: flex;

          .column {
            width: 25%;
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
</style>
