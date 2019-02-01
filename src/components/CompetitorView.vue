<template>
  <div class="main">
    <Board></Board>
  </div>
</template>

<script>
  import Board from './plugin/WritingBoard'

  export default {
    name: "CompetitorView",
    components: {
      Board
    }
  }
</script>

<style scoped>

</style>
