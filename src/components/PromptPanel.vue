<template>
  <MDBContainer>
    <div v-if="promptPanelContent" class="ask-prompt-action">
      <h3 class="prompt-header">{{promptPanelContent}}</h3>


      <div style="float: right;">
        <div style="display: flex;  justify-content: space-around; margin-right: 10px;">

          <MDBBtn class="btn-yes" color="success" size="large" @click="actionYes">Kyllä</MDBBtn>
          <MDBBtn class="btn-no" color="danger" size="large" @click="actionNo">Poistu</MDBBtn>
        </div>
      </div>
    </div>
  </MDBContainer>
</template>

<script>
import {
  MDBContainer,
    MDBBtn
} from 'mdb-vue-ui-kit'
export default {
  name: "ActionPanel",
  props: {
    promptPanelContent: null
  },
  components: {
    MDBContainer,
    MDBBtn
  },
  data () {
    return {

    }
  },
  methods: {
    actionNo () {
      this.$emit("prompt:no");
    },
    actionYes () {
      this.$emit("prompt:yes");
    }
  }
}
</script>

<style scoped>
.ask-prompt-action{
  backGround-color: #4c423a;
  color: #ea6523;
  z-index: 99 !important;
  font-size: 14px;

  width:70%;
  height: auto;
  /*display:flex;*/
  align-items:center;
  justify-content:center;
  top: 50vh;
  left: 50vw; transform: translate(-50%, -50%);
  position:fixed;

}
.ask-prompt-action .prompt-header {
  margin: 7px 0 13px 13px;
  text-align: left;
}

.ask-prompt-action .btn-yes {
  width: 70px;
  margin-left: 20px;
  margin-bottom: 13px;
}

.ask-prompt-action .btn-no {
  width: 70px;
  margin-bottom: 13px;
}

/*@media only screen and (max-width: 1000px) {*/
/*  .ask-prompt-action {*/
/*    height:125px;*/
/*    width:300px;*/
/*  }*/
/*}*/

.disabled {
  opacity: 0.5;
  pointer-events: none;
}
</style>