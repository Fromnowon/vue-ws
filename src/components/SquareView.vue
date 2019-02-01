<template>
  <div class="main">
    <img v-if="imgSrc" :src="imgSrc" alt="">
  </div>
</template>

<script>
  export default {
    name: "SquareView",
    data() {
      return {
        imgSrc: null,
      }
    },
    mounted() {
      WS.onmessage = (e) => {
        let data = JSON.parse(e.data);
        if (data.code === 10) {
            this.imgSrc=data.data
        }
      };
    }
  }
</script>

<style scoped>

</style>
