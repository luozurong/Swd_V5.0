<template>
  <div>
    <no-data-view scene="noData"></no-data-view>
  </div>
</template>

<script>
import NoDataView from "../components/noData";
export default {
  components: {
    NoDataView
  },
  mounted() {
      this.$global.showToast('你错了')
  }
};
</script>

<style lang="scss" scoped>
</style>