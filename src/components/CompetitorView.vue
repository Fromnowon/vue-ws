<template>
  <div class="main">
    <Board></Board>
  </div>
</template>

<script>
  import Board from './plugin/WritingBoard'

  export default {
    name: "CompetitorView",
    mounted() {

    },
    components: {
      Board
    },
    beforeDestroy() {

    }
  }
</script>

<style scoped>
  .main {
  }
</style>
