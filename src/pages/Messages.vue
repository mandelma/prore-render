<template>
  <MDBContainer style="padding-top: 50px;">
    <div v-if="notes.length > 0">
      <div v-for="note in notes" :key="note.id">
        <MDBCard text="white"  bg="dark" class="msgCardStyle" >
          <MDBCardBody>
            <MDBCardTitle style="display: flex; justify-content: right; color: limegreen; padding-right: 20px;"
            >
              <p style="cursor:pointer;" @click="removeNote(note)">Selvä</p>
            </MDBCardTitle>

            <MDBCardText  v-if="note.isLink">

              {{note.content}} <router-link to="/calendar" @click="removeNote(note)">kalenterissa!</router-link>
            </MDBCardText>
            <!--          <MDBCardText v-else-if="note.reason !== ''">-->
            <!--            {{note.reason}}-->
            <!--          </MDBCardText>-->
            <MDBCardText v-else>
              {{note.content}}
              <msg-content v-if="note.reason !== ''" :reason = note.reason />
            </MDBCardText>
            <!--          {{dateStr(note.time)}}-->
            <MDBCardFooter class="text-muted"><df :date = "note.time" /></MDBCardFooter>

          </MDBCardBody>

        </MDBCard>
      </div>

    </div>
    <div v-else>
      <h3 style="color: #ddd">Ei tietoja!</h3>
    </div>

  </MDBContainer>

</template>

<script>
import {
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  //MDBCardHeader,
  MDBCardText,
  MDBCardFooter,
  //MDBBtn

} from 'mdb-vue-ui-kit'
import df from '../components/controllers/formatDate';
import msgContent from '../components/MessageReasonContent'
//import messageService from "@/service/messages";
export default {
  name: "Messages",
  props: {
    notes: Array
  },
  components: {
    df,
    MDBContainer,
    MDBCard,
    MDBCardBody,
    MDBCardTitle,
    //MDBCardHeader,
    MDBCardText,
    MDBCardFooter,
    msgContent
    //MDBBtn
  },
  data () {
    return {
      user: null,
      messages: this.notes,
      //dateStr: df
    }
  },
  mounted () {
    const loggedUserJSON = window.localStorage.getItem('loggedAppUser')
    if (loggedUserJSON) {
      this.user = JSON.parse(loggedUserJSON)
    }

  },
  methods: {
    async removeNote (note) {
      //console.log("Note id is: " + id);
      //await messageService.removeSelectedMessage(this.user.id, id);
      this.$emit("remove_note", note);
    },
  }
}
</script>

<style scoped>
.msgCardStyle {
  margin: 10px auto;
}
@media only screen and (min-width: 1000px) {
  .msgCardStyle {
    margin: 10px auto;
    width: 50%;
  }
}

</style>