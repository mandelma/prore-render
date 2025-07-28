<template>
  <div class="pro-panel-feedback" >
    <p style="text-align: right; cursor: pointer; color: orangered;" @click="$emit('closeFeedbackList')">Poistu</p>
    <div v-if="feedback.length > 0">
      <div style="text-align: left;" v-for="fb in feedback" :key="fb.id">
        <p style="margin-bottom: 10px;">{{fb.neg ? fb.neg : fb.pos}}</p>
      </div>
    </div>
    <div v-else>
      <p>Ei arvostelua vielä!</p>
    </div>

<!--    <p>{{feedback.length > 0 ? feedback.pos  : "Ei arvostelua vielä!"}}</p>-->

  </div>
</template>

<script>
export default {
  name: "FeedbackList",
  props: {
    feedback: Array
  }
}
</script>

<style scoped>

</style>