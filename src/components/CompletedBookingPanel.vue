<template>
  <div v-if="status === 'for-recipient'">
    <div class = "waiting-info">
      <div style="display: flex; justify-content: right;">
        <img style="width: 50px;" :src="require(`@/assets/ok.png`)" alt="okay" />
      </div>
      ( <b>{{content.ordered[0].yritys}}</b> )  -
      {{content.header}}<br>
      <monthConverter :num=" content.onTime[0].month" /> {{content.onTime[0].day}} / {{content.onTime[0].year}}<br>
      klo {{content.onTime[0].hours}} : {{content.onTime[0].minutes}}<br>
<!--      <p v-if="content.isIncludeOffers">-->
<!--        Sovittu hinnalla: {{content.offers.find(item => item.provider.id === content.ordered[0].id).price}} eur.-->
<!--      </p>-->

      <div v-if="isMoving">
        <p v-if="isMoving === 'here'">{{content.ordered[0].yritys}} odottaa sinua osoitteseen: {{content.ordered[0].address}}</p>
        <p v-else-if="isMoving === 'go'">{{content.ordered[0].yritys}} tulossa sovittuun osoitteeseen!</p>
      </div>
      <div v-else>
        <p v-if="content.ordered[0].range === 0">{{content.ordered[0].yritys}} odottaa sinua osoitteseen: {{content.ordered[0].address}}</p>
        <p v-else-if="content.ordered[0].range > 0">{{content.ordered[0].yritys}} tulossa sovittuun osoitteeseen!</p>
      </div>


<!--      <p v-if="content.ordered[0].range === 0 || isMoving === 'go'">{{content.ordered[0].yritys}} odottaa sinua osoitteseen: {{content.ordered[0].address}}</p>-->
<!--      <p v-else-if="content.ordered[0].range > 0 || isMoving === 'here'">{{content.ordered[0].yritys}} tulossa sovittuun osoitteeseen!</p>-->

      <MDBBtn block outline="warning" @click="removeComplitedBookingPanel(content)">
        (Kustub muidu kui aeg läbi saab) - Saab eemaldada kohe (ajutine lahendus)
      </MDBBtn>

    </div>

  </div>

  <div v-else>
    <div class="pro-info">
<!--      <MDBBtnClose-->
<!--          white-->
<!--          class="closeConfirmedBooking"-->
<!--          @click="removeCompletedBookingPro(msg)"-->
<!--      />-->
<!--      <div  >-->

      <div style="float: right;">
        <monthConverter :num=" content.onTime[0].month" /> {{content.onTime[0].day}} / {{content.onTime[0].year}}<br>
        klo
        {{content.onTime[0].hours >= 10 ? content.onTime[0].hours : "0" + content.onTime[0].hours }} :
        {{(content.onTime[0].minutes) >= 10 ? content.onTime[0].minutes : "0" + content.onTime[0].minutes}}
      </div>

        <MDBTable v-if="status === 'for-provider'" borderless style="font-size: 18px; color: #ddd; text-align: left; padding: 10px; width: 100%;">
          <tbody>
          <tr>
            <td>
              Sovittu:
            </td>
            <td>
              {{content.header}}
            </td>
          </tr>
          <tr v-if="offer">
            <td>
              Hinnalla:
            </td>
            <td>
              {{offer.price}} Eur.
            </td>
          </tr>
          <tr v-if="offer && provider.range > 0">
            <td>
              Etäisyys:
            </td>
            <td>
              {{offer.distance}} km.
            </td>
          </tr>
          <tr v-if="offer && provider.range > 0">
            <td>
              Matkaiaka:
            </td>
            <td>
              noin {{offer.duration}}.
            </td>
          </tr>
          <tr>
            <td>
              Paikka:
            </td>
            <td v-if="provider.range === 0">
              {{provider.address}}
            </td>
            <td v-else>
              {{content.address}}
            </td>
          </tr>
          <tr v-if="isMoving">
            <td colspan="2" v-if="isMoving === 'here'">

              <p  style="color: deepskyblue;">
                Asiakas tulossa!
              </p>

            </td>
            <td colspan="2" v-else-if="isMoving === 'go'">

              <p  style="color: deepskyblue;">
                Meno asiakkaan luonna!
              </p>
            </td>
          </tr>
          <tr v-else>
            <td colspan="2" v-if="provider.range === 0">

              <p  style="color: deepskyblue;">
                Asiakas tulossa!
              </p>

            </td>
            <td colspan="2" v-else-if="provider.range > 0">

              <p  style="color: deepskyblue;">
                Meno asiakkaan luonna!
              </p>
            </td>
          </tr>



<!--          <tr>-->
<!--            <td colspan="2" v-if="provider.range === 0 || isMoving === 'here'">-->

<!--              <p  style="color: deepskyblue;">-->
<!--                Asiakas tulossa!-->
<!--              </p>-->

<!--            </td>-->
<!--            <td colspan="2" v-else-if="provider.range > 0 || isMoving === 'go'">-->

<!--              <p  style="color: deepskyblue;">-->
<!--                Meno asiakkaan luonna!-->
<!--              </p>-->
<!--            </td>-->
<!--          </tr>-->
          </tbody>
        </MDBTable>


      <!--      </div>-->
<!--      <div v-else-if="status === 'recipient'">-->
<!--        <b>{{msg.provider}}</b> - -->
<!--        {{msg.header}}-->
<!--        <monthConverter :num=" msg.onTime[0].month" />, {{msg.onTime[0].day}}, {{msg.onTime[0].year}}-->
<!--        kello-->
<!--        {{msg.onTime[0].hours}} : {{msg.onTime[0].minutes}}-->
<!--      </div>-->
  </div>



  </div>
</template>

<script>
import {
  //MDBBtnClose,
  MDBBtn,
  MDBTable
} from 'mdb-vue-ui-kit'
import monthConverter from './controllers/month-converter'
export default {
  name: "Info",
  props: {
    index: Number,
    content: Object,
    status: String,
    //msg: Object,
    provider: Object
  },
  components: {
    //MDBBtnClose,
    MDBBtn,
    MDBTable,
    monthConverter
  },
  data() {
    return {
      offer: this.content.isIncludeOffers ? this.content.offers.find(offer => offer.provider === this.content.ordered[0]) : null,
      isMoving: this.content.isIncludeOffers ? this.content.offers[0].place : null
    }
  },
  methods: {
    removeCompletedBookingPro (booking) {
      this.$emit('remove:proConfirmed', booking);
    },
    removeComplitedBookingPanel (booking) {
      this.$emit('remove:complitedBookingPanel', booking)
    }
  }
}
</script>

<style scoped>
.pro-info {
  width: 100%;
  color: #ddd;
  background: #141414;
  font-size: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 10px;

}
.waiting-info {
  width: 100%;
  color: #ddd;
  /*background: #f5f532;*/
  font-size: 20px;
  border: 1px solid #acbbbc;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 10px;
}
.waiting-info b {
  color: #db8932;
}
.waiting-info p {
  color: deepskyblue;
}
.closeConfirmedBooking {
  float: right;
}
</style>