<template>
  <div class="sidebar-wrapper">
    <IconCharts />
    <IconApps />
    <IconDesktop />
    <IconPie />
    <IconLogout />
  </div>
</template>

<script>
import IconCharts from "@/components/Icons/IconCharts";
import IconApps from "@/components/Icons/IconApps";
import IconDesktop from "@/components/Icons/IconDesktop";
import IconPie from "@/components/Icons/IconPie";
import IconLogout from "@/components/Icons/IconLogout";
export default {
  name: "Sidebar",
  components: {IconLogout, IconPie, IconDesktop, IconApps, IconCharts}
}
</script>

<style scoped lang="scss">
.sidebar-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 100px;
  height: 218px;
  margin-top: 40px;

  > * {
    cursor: pointer;
  }
}
</style>
