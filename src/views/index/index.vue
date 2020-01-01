<template>
    <div>
    </div>
</template>
<script>
import {mapState,mapMutations } from 'vuex'
export default {
   data() {
      return {
      }
   },
   computed:{
       ...mapState({
           testFlag: state => state.mall.testFlag
       })
   },
   methods:{
       ...mapMutations({
            setTestFlag: 'testFlag', 
       })
   },
   mounted() {
       this.setTestFlag(true);
   }
}
</script>
<style scoped>
*{
    margin:0;
    padding: 0;
}
.add{
    width: 100px;
    height: 100px;
    position: relative;
    border: 1px solid #ccc;
}
.add::before{
    content: "";
    position: absolute;
    left: 50%;
    top: 50%;
    width: 80px;
    margin: -5px 0  0 -40px;
    border-top: 10px solid yellow;
}
.add::after{
    content: "";
    position: absolute;
    left: 50%;
    top: 50%;
    height: 80px;
    margin: -40px 0  0 -5px;
    border-left: 10px solid yellow;

}
/* css */
</style>
