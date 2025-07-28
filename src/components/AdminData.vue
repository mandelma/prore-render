<template>
  <MDBContainer style="margin-top: 200px;">
    <MDBRow>
      <MDBCol>
        <MDBCard>

        </MDBCard>
      </MDBCol>
    </MDBRow>
    <div class="col-span-12 lg:col-span-6 xl:col-span-3">
      <div class="card mb-0">
        <div class="flex justify-between mb-4">
          <div>
            <span class="block text-muted-color font-medium mb-4">Orders</span>
            <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">152</div>
          </div>
          <div class="flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
            <i class="pi pi-shopping-cart text-blue-500 !text-xl"></i>
          </div>
        </div>
        <span class="text-primary font-medium">24 new </span>
        <span class="text-muted-color">since last visit</span>
      </div>
    </div>
    <h2>Admin</h2>
    <ol v-for="provider in dataList" :key="provider.id">
      <li>
        provider {{provider.user.username}}
      </li>
    </ol>
    <h3>Else more {{more}}</h3>
  </MDBContainer>
</template>

<script>
import {
  MDBContainer,
  MDBRow,
  MDBCol,
    MDBCard
  //MDBBtn
} from 'mdb-vue-ui-kit'
export default {
  name: "AdminData",
  props: {
    dataList: Array,
    more: String
  },
  components: {
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBCard
    //MDBBtn
  },
}
</script>

<style scoped>

</style>