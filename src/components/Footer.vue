<template>
  <div class="footer-wrapper">
    <span>Terms & Conditions</span>
    <span class="divider">|</span>
    <span>Privacy Policy</span>
  </div>
</template>

<script>
export default {
  name: "Footer"
}
</script>

<style scoped lang="scss">
  .footer-wrapper {
    display: flex;
    margin-bottom: 22px;

    > * {
      font-weight: 600;
      font-size: 16px;
      line-height: 19px;
      color: #005B96;
    }

    .divider {
      margin: 0 8px;
    }
  }
</style>
