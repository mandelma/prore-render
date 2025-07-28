<template>
  <MDBContainer style="margin-top:100px;">
    <div v-if="recipientConfirmedBookings.length > 0 || proCompletedHistory.length > 0">
      <div v-if="recipientConfirmedBookings.length > 0" style="margin: auto; padding: 12px; border: 1px solid deepskyblue; ">
        <h4 v-if="isHistoryData" style="display: flex; justify-content: right; color: greenyellow; cursor: pointer;" @click="isHistoryData = false">Valmis</h4>


        <h3 v-if="!isHistoryData">Tilatut palvelut</h3>

        <MDBTable v-if="!isHistoryData" borderless style="font-size: 14px; width: 100%; text-align: left; color: #ddd;">
          <tbody>
          <tr v-for="booking in recipientConfirmedBookings" :key="booking.id">
            <td>
              {{ booking.date }}
            </td>

            <td>
              {{booking.company}}
            </td>
            <td>
              <MDBBtn block outline="info" @click="handleData(booking)">Tiedot</MDBBtn>
            </td>
          </tr>
          </tbody>
        </MDBTable>
        <MDBTable v-else borderless style="font-size: 14px; text-align: left; color: #ddd;">
          <tbody>
          <tr >
            <td>
              Päivämäärä
            </td>
            <td>
              {{booking.date}}
            </td>
          </tr>
          <tr>
            <td>
              Tehtävä
            </td>
            <td>
              {{booking.header}}
            </td>
          </tr>
          <tr>
            <td>
              Yritys
            </td>
            <td>
              {{booking.company}}
            </td>
          </tr>
          <tr>
            <td>
              Y-tunnus
            </td>
            <td>
              {{booking.id_number}}
            </td>
          </tr>
          <tr>
            <td>
              Osoite
            </td>
            <td>
              {{booking.address}}
            </td>
          </tr>
          <tr>
            <td>
              Ammati
            </td>
            <td>
              <div v-for="(pro, i) in booking.professional" :key="i">
                {{pro}}
              </div>
            </td>
          </tr>
          <tr>
<!--            <td colspan="2">-->
<!--              <MDBBtn block outline="success" size="lg">Tilaa</MDBBtn>-->
<!--            </td>-->
          </tr>
          </tbody>
        </MDBTable>
      </div>

<!--      <div v-if="proCompletedHistory.length < 1 && recipientConfirmedBookings.length === 0" class="spinner-border" role="status">-->
<!--        <span class="visually-hidden">Loading...</span>-->
<!--      </div>-->


      <div v-if="proCompletedHistory.length > 0" style="margin-top: 13px; padding: 12px; border: 1px solid orange;">
        <h3>Tarjottuja palveluita</h3>
        <MDBTable style="font-size: 14px; text-align: left; color: #ddd;">
          <tbody>
          <tr v-for="item in proCompletedHistory" :key="item.id">
            <td>
              1
            </td>
            <td>
              {{item.date}}
            </td>
            <td>
              {{item.header}}
            </td>
          </tr>
          </tbody>
        </MDBTable>

      </div>



    </div>




  </MDBContainer>

</template>

<script>
/* eslint-disable */
//NB ordered to make !!
import {
  MDBTable,
  MDBBtn,
  MDBRow,
  MDBCol,
  MDBIcon,
  MDBBadge,
    MDBContainer
} from 'mdb-vue-ui-kit'
//import monthConverter from '.././components/controllers/month-converter.js'
import providerService from '../service/providers'
export default {
  name: "historia",
  props: {
    recipientConfirmedBookings: Array,
    proCompletedHistory: Array,
    tere: String,
    bookings: Array
  },
  components: {
    //monthConverter,
    MDBTable,
    MDBBtn,
    MDBRow,
    MDBCol,
    MDBIcon,
    MDBBadge,
    MDBContainer
  },
  data () {
    return {
      isFeedbackOpen: false,
      isRated: false,
      providerID: "",
      provider: {},
      isHistoryData: false,
      booking: null
    }
  },
  methods: {
    handleData (booking) {
      this.isHistoryData = true;
      this.booking = booking;
    },
    async openFeedbackPanel (id) {
      this.isFeedbackOpen = true;

      let provider = await providerService.getProvByProvId(id)
      console.log("Provider positive rating: " + provider.yritys)
      this.providerID = id;
    },
    ratePos () {
      console.log("Rated ++ " + this.providerID);
      providerService.setPositiveRating(this.providerID);
    },
    rateMinus () {
      console.log("You rated --");
    }
  }
}
</script>

<style scoped>
/*Make table scroll horizontally*/
.table_wrapper{
  /*display: block;*/
  /*overflow-x: auto;*/
  /*white-space: nowrap;*/
}

</style>