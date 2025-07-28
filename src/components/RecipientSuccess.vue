<template>
  <div>
    <MDBContainer >
      <h2>-Tiedot ammattilaisesta-</h2>
      <MDBListGroup light style="text-align:left; font-size: 16px;">
        <MDBListGroupItem>Yritys:&nbsp;&nbsp;&nbsp;&nbsp;{{provider.yritys}}</MDBListGroupItem>
        <MDBListGroupItem>y-tunnus:&nbsp;&nbsp;&nbsp;&nbsp;{{provider.ytunnus}}</MDBListGroupItem>
        <MDBListGroupItem>Osoite:&nbsp;&nbsp;&nbsp;&nbsp;{{provider.address}}</MDBListGroupItem>
        <MDBListGroupItem>Ammatti:&nbsp;&nbsp;&nbsp;&nbsp;{{provider.profession[0]}}</MDBListGroupItem>

      </MDBListGroup>
      <MDBBtn outline="success"  block size="lg">Tilaa palvelu</MDBBtn>
      <MDBBtn outline="danger" @click="$router.push({path: '/received'})" block size="lg">Poistu</MDBBtn>
    </MDBContainer>



  </div>
</template>

<script>
import {
  MDBBtn,
  MDBContainer,
  MDBListGroup,
  MDBListGroupItem
}from "mdb-vue-ui-kit";
import {ref} from "vue";


export default {
  name: "recipient-success",
  props: {
    provider: Object
  },
  setup () {
    const isAvailable = ref(false)
    return {
      isAvailable
    }
  },
  components: {
    MDBContainer,
    MDBBtn,
    MDBListGroup,
    MDBListGroupItem
  },
  mounted () {
    //console.log("Providers::: " + this.providers.map(p => p.yritys))
  }

}
</script>

<style scoped>

</style>