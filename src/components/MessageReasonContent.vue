<template>
  <div>
    <p style="color: cadetblue" ><span style="color: #35bbc7;">Syynä:</span>  {{reason}}</p>
  </div>
</template>

<script>
export default {
  name: "MessageContent",
  props: {
    reason: String
  }
}
</script>

<style scoped>

</style>