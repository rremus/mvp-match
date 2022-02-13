<template>
  <div class="header-wrapper">
    <div class="logo-and-menu">
      <Logo class="logo"/>
      <IconMenu class="menu-icon"/>
    </div>

    <div class="profile-wrapper">
      <div class="profile-initials">
        <span class="text">{{ initials }}</span>
      </div>

      <span class="name">John Doe</span>
    </div>
  </div>
</template>

<script>
import Logo from "@/components/Logo";
import IconMenu from "@/components/Icons/IconMenu";
export default {
  name: 'Header',
  components: {IconMenu, Logo},

  computed: {
    initials() {
      return "JD"
    }
  }
}
</script>

<style scoped lang="scss">
.header-wrapper {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 100px 0 38px;
  border-bottom: 2px solid #F3F6F9;

  .logo-and-menu {
    display: flex;
    align-items: center;

    .logo {
      margin-right: 37px;
    }

    .logo,
    .menu-icon {
      cursor: pointer;
    }
  }

  .profile-wrapper {
    display: flex;
    align-items: center;

    .profile-initials {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 43px;
      height: 43px;
      background-color: #F6CA65;
      border-radius: 5px;
      margin-right: 12px;
      cursor: pointer;


      .text {
        color: white;
        font-weight: 600;
        font-size: 23px;
        line-height: 27px;
      }
    }

    .name {
      font-weight: bold;
      font-size: 16px;
      line-height: 19px;
      color: #005B96;
      cursor: pointer;
    }
  }

}
</style>
