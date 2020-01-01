<template>
  <div id="app">
    <keep-alive include="mall">
       <router-view></router-view>
    </keep-alive>
   
  </div>
</template>

<script>
export default {
  name: 'App',
  computed: {
    // key() {
    //     return this.$route.name !== undefined? this.$route.name + +new Date():this.$route + +new Date()
    // }
  }
}
</script>
