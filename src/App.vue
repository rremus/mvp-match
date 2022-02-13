<template>
  <div id="app">
    <Header />
    <div class="sidebar-and-content">
      <Sidebar class="sidebar"/>

      <div class="content-wrapper">
        <MainContent />
        <Footer />
      </div>
    </div>
  </div>
</template>

<script>
import Header from './components/Header.vue'
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import MainContent from "@/components/MainContent";

export default {
  name: 'App',
  components: {
    MainContent,
    Footer,
    Sidebar,
    Header
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
    height: calc(100vh - 82px);

  & .sidebar-and-content {
    display: flex;
    height: 100%;

    & .sidebar {
      flex-shrink: 0;
    }

    & .content-wrapper {
      display: flex;
      width: 100%;
      height: 100%;
      flex-direction: column;
      justify-content: space-between;
      margin-right: 100px;
    }
  }
}

body {
  margin: 0;
}

.debug {
  border: 2px dotted red;
}

.p-dropdown {
  height: 32px !important;
  display: flex;
  justify-content: center;
  align-items: center;
}

.p-dropdown .p-dropdown-trigger {
  color: white !important;
}

.p-dropdown .p-dropdown-label.p-placeholder,
.p-dropdown .p-dropdown-label,
.p-calendar .p-inputtext {
  color: white !important;
  font-size: 14px;
}

.p-calendar .p-inputtext,
.p-button.p-button-icon-only {
  background-color: #1BC5BD;
  height: 32px;

  &::placeholder {
    color: white !important;
    font-size: 14px;
  }
}

.p-button-label {
  font-size: 14px !important;
  font-weight: 400 !important;
}



</style>
