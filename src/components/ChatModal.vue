<template>
  <MDBContainer>
<!--    <div >-->
<!--      <div class="modal__wrapper">-->
<!--        <h2 class="modal" style="color: #ddd;">Here is displayed chat modal panel!</h2>-->
<!--      </div>-->
<!--    </div>-->
    <div  ref="customDiv">
      <div @click="toggle">
        <slot name="header"/>
      </div>

      <div v-if="showPopup" @click.stop>
        <slot name="content"/>
      </div>
    </div>
  </MDBContainer>
</template>

<script>
import {
  MDBContainer
} from 'mdb-vue-ui-kit'
import { onMounted, onUnmounted, ref } from 'vue'
export default {
  name: "ChatModal",
  components: {
    MDBContainer
  },
  setup () {
    const showPopup = ref(false)
    const customDiv = ref(null)
    const toggle = () => {
      showPopup.value = !showPopup.value
    }

    const handleClickOutside = (event) => {
      if (customDiv.value && !customDiv.value.contains(event.target)) {
        showPopup.value = false
      }
    }

    onMounted(() => {
      document.addEventListener("click", handleClickOutside)
    })

    onUnmounted(() => {
      document.removeEventListener("click", handleClickOutside)
    })
    return {
      showPopup,
      customDiv,
      toggle,
      handleClickOutside
    }
  }
}
</script>

<style scoped>

.modal {
  backGround-color: #4c423a;
  color: #ea6523;
  z-index: 99 !important;
  font-size: 14px;

  width:300px;
  height: 300px;
  display:flex;
  align-items:center;
  justify-content:center;
  /*top: 50vh;*/
  /*left: 50vw; transform: translate(-50%, -50%);*/
  position:fixed;
}
</style>