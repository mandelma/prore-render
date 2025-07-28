<template>
<!--  <div style="padding-top: 20px;">Admin sivu:</div>-->
  <MDBContainer style="padding-top: 33px;">

    <MDBRow>
      <MDBCol lg="4">
        <MDBCard style="text-align: left;" text="white" bg="dark" class="mb-3">
          <MDBCardBody>
            <MDBCardTitle>
              <div style="display: flex; justify-content: space-between;">
                <p style="color: #a09d9d;">Sooritatud tehingud</p>
                <MDBIcon size="2x">
                  <i class="far fa-handshake"></i>
                </MDBIcon>
              </div>

            </MDBCardTitle>
            <MDBCardText>
              <h3>{{orders.length}}</h3>
            </MDBCardText>
            <p style="font-size: 17px;">
              <span style="color:limegreen;">{{ doneOrdersToday }}</span>&nbsp;
              <span style="color: #a09d9d;">
                täna
              </span>
            </p>
          </MDBCardBody>
        </MDBCard>
      </MDBCol>
      <MDBCol lg="4">
        <MDBCard style="text-align: left;" text="white" bg="dark" class="mb-3">
          <MDBCardBody>
            <MDBCardTitle>
              <div style="display: flex; justify-content: space-between;">
                <p style="color: #a09d9d;">Teenuse pakkujad</p>
                <MDBIcon size="2x">
                  <i class="fas fa-user-secret"></i>
                </MDBIcon>
              </div>

            </MDBCardTitle>
            <MDBCardText>
              <h3>{{dataList.length}}</h3>
            </MDBCardText>
            <p style="font-size: 17px;"><span style="color:limegreen;">{{ providersToday }}</span> <span style="color: #a09d9d;">täna</span></p>
          </MDBCardBody>
        </MDBCard>
      </MDBCol>
      <MDBCol lg="4">
        <MDBCard style="text-align: left;" text="white" bg="dark" class="mb-3">
          <MDBCardBody>
            <MDBCardTitle>
              <div style="display: flex; justify-content: space-between;">
                <p style="color: #a09d9d;">Aktiivsed tellimused</p>
                <MDBIcon size="2x">
                  <i class="far fa-lightbulb"></i>
                </MDBIcon>
              </div>

            </MDBCardTitle>
            <MDBCardText>
              <h3>{{ bookings.length}}</h3>
            </MDBCardText>
            <p style="font-size: 17px;">
              <span style="color:limegreen;">{{bookingsDoneToday}}</span>&nbsp;
              <span style="color: #a09d9d;">täna</span>
            </p>
          </MDBCardBody>
        </MDBCard>
      </MDBCol>
      <MDBCol lg="4">
        <MDBCard style="text-align: left;" text="white" bg="dark" class="mb-3">
          <MDBCardBody>
            <MDBCardTitle>
              <div style="display: flex; justify-content: space-between;">
                <p style="color: #a09d9d;">Kasutajad</p>
                <MDBIcon size="2x">
                  <i class="fas fa-user-check"></i>
                </MDBIcon>
              </div>

            </MDBCardTitle>
            <MDBCardText>
              <h3>{{ users.length }}</h3>
            </MDBCardText>
            <p style="font-size: 17px;">
              <span style="color:limegreen;">{{usersToday}}</span>&nbsp;
              <span style="color: #a09d9d;">täna</span>
            </p>
          </MDBCardBody>
        </MDBCard>
      </MDBCol>

    </MDBRow>

    <MDBRow>
      <MDBCol>
<!--        aria-label="Search" placeholder="Search"-->

        <MDBInput
            white
            v-model="search1"
            label="Otsi sooritatud tehingud ameti järgi..."
            inputGroup
            :formOutline="true"
            wrapperClass="mb-3"


            aria-describedby="button-addon2"
        >
          <MDBBtn color="success" @click="showAlert">
            <MDBIcon icon="search" />
          </MDBBtn>
        </MDBInput>
        <MDBListGroup v-for="(order, i) in completedOrders" :key="i" style="min-width: 22rem"  >
          <MDBListGroupItem
              class="d-flex justify-content-between align-items-start" color="dark"
          >
            <div class="ms-2 me-auto">
              <div class="fw-bold">{{i + 1 + ". " + order.profession}}</div>
              <p style="color: #a09d9d;"></p>
            </div>
            <MDBBadge class="badge-primary" pill>{{order.count}}</MDBBadge>
          </MDBListGroupItem>

        </MDBListGroup>
      </MDBCol>

    </MDBRow>


<!--    <MDBRow>-->
<!--      <MDBCol>-->
<!--        <MDBBtn-->
<!--            color="secondary"-->
<!--            block-->
<!--            size="lg"-->
<!--            @click="printProviders"-->
<!--        >-->
<!--          Teenuse pakkujad-->
<!--        </MDBBtn>-->

<!--        <MDBBtn-->
<!--            color="secondary"-->
<!--            block-->
<!--            size="lg"-->
<!--            @click="getMore"-->
<!--        >-->
<!--          Teenuse saajad-->
<!--        </MDBBtn>-->
<!--      </MDBCol>-->

<!--      <MDBCol>-->

<!--&lt;!&ndash;        <MDBBtn&ndash;&gt;-->
<!--&lt;!&ndash;            color="secondary"&ndash;&gt;-->
<!--&lt;!&ndash;            block&ndash;&gt;-->
<!--&lt;!&ndash;            @click="filter"&ndash;&gt;-->
<!--&lt;!&ndash;        >&ndash;&gt;-->
<!--&lt;!&ndash;          Suodata&ndash;&gt;-->
<!--&lt;!&ndash;        </MDBBtn>&ndash;&gt;-->

<!--&lt;!&ndash;        <admin-data&ndash;&gt;-->
<!--&lt;!&ndash;            :dataList = dataList&ndash;&gt;-->
<!--&lt;!&ndash;            :more = more&ndash;&gt;-->
<!--&lt;!&ndash;        />&ndash;&gt;-->
<!--        <div v-if="isGetProviders">-->
<!--          <ul v-for="provider in dataList" :key="provider.id">-->
<!--            <li>-->
<!--              {{provider.user.firstName}}-->
<!--            </li>-->
<!--          </ul>-->
<!--        </div>-->
<!--        <div v-else-if="isGetMore">-->
<!--          Here is {{more}}-->
<!--        </div>-->

<!--      </MDBCol>-->
<!--    </MDBRow>-->
<!--    providers {{dataList}}-->

  </MDBContainer>
</template>

<script>
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBIcon,
  MDBListGroup,
  MDBListGroupItem,
  MDBBadge,
  MDBInput,
  MDBBtn
} from 'mdb-vue-ui-kit'
import {ref} from 'vue'
//import adminData from "@/components/AdminData"
import providerTable from "@/service/providers"
import bookingService from "@/service/recipients"
import userService from "@/service/users"
import adminService from "@/service/admin"
export default {
  name: "AdminPanel",
  components: {
    //adminData,
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBCard,
    MDBCardBody,
    MDBCardTitle,
    MDBCardText,
    MDBIcon,
    MDBListGroup,
    MDBListGroupItem,
    MDBBadge,
    MDBInput,
    MDBBtn
  },
  setup () {
    const search1 = ref('');
    const showAlert = () => alert(search1.value);
    return {
      search1,
      showAlert
    }
  },

  data () {
    return {
      isGetProviders: false,
      users: [],
      usersToday: 0,
      newUsersToday: 0,
      orders: [],
      completedOrders: [],
      doneOrdersToday: 0,
      bookings: [],
      bookingsDoneToday: 0,
      isGetmore: "",
      dataList: [],
      providersToday: 0,
      more: ""
    }
  },
  mounted () {
    this.getUsers();
    this.getProviders();
    this.getBookings();
    this.getCompletedOrders();
  },

  methods: {
    async getUsers () {
      this.users = await userService.getAll();
      console.log("Users count " + this.users.length);
      let userCounter = 0;
      this.users.forEach(user => {
        const userToday = new Date();
        let userDate = new Date(user.created);
        if (userDate.getFullYear() === userToday.getFullYear() && userDate.getMonth() === userToday.getMonth() && userDate.getDate() === userToday.getDate()) {
          userCounter += 1;
          this.usersToday = userCounter;
        }
      })
    },
    async getProviders () {
      const providers = await providerTable.getProviders();
      this.dataList = providers;
      let proCounter = 0;
      providers.forEach(pro => {
        const today = new Date();
        let proDate = new Date(pro.created);
        if (proDate.getFullYear() === today.getFullYear() && proDate.getMonth() === today.getMonth() && proDate.getDate() === today.getDate()) {
          proCounter += 1;
          this.providersToday = proCounter;
        }
      })
    },
    async getBookings () {
      this.bookings = await bookingService.getRecipients();
      console.log("Bookings length = " + this.bookings.length);
      let bCounter = 0;
      this.bookings.forEach(booking => {
        const bd = new Date(booking.started);
        const dNow = new Date();

        if (bd.getFullYear() === dNow.getFullYear() && bd.getMonth() === dNow.getMonth() && bd.getDate() === dNow.getDate()) {
          bCounter += 1;
          this.bookingsDoneToday = bCounter;
        }
      })
    },
    async getCompletedOrders () {
      this.orders = await adminService.getCompleted();
      let counter = 0;
      this.orders.forEach(order => {

        if (!this.completedOrders.some(item => item.profession === order.completed.profession)) {
          this.completedOrders = [
              ...this.completedOrders,
            {
              profession: order.completed.profession,
              date: order.completed.date,
              count: this.orders.filter(item => item.completed.profession === order.completed.profession).length
            }
          ]
        }
        const fd = new Date(order.completed.date)
        const dNow = new Date();
        console.log("Order date: " + fd)
        if (fd.getFullYear() === dNow.getFullYear() && fd.getMonth() === dNow.getMonth() && fd.getDate() === dNow.getDate()) {
          counter += 1;
          this.doneOrdersToday = counter;
        }
      })
    },
    async printProviders () {
      const providers = await providerTable.getProviders();
      this.dataList = providers;

      this.isGetProviders = true;
      this.isGetMore = false;
    },
    getMore () {
      this.more = "more info..."
      this.isGetMore = true;
      this.isGetProviders = false;
    },
    filter () {
      console.log("Filtering...")
      const items = [
        {
          item: "Yks",
          isTrue: false
        },
        {
          item: "Kaks",
          isTrue: true
        },
        {
          item: "Kolm",
          isTrue: false
        },
        {
          item: "Neli",
          isTrue: true
        },
        {
          item: "Viis",
          isTrue: true
        },
      ]

      items.map(item => console.log(item.item))

      let selectedFalse = items.filter(item => !item.isTrue);
      selectedFalse.map(item => console.log("selected false: " + item.item));

      let selectedTrue = items.filter(item => item.isTrue)

      selectedTrue.map(item => console.log("selected: " + item.item));

      let finalItems = selectedTrue.concat(selectedFalse);

      finalItems.map(item => console.log("Final items: " + item.item));
    }
  }



}
</script>

<style scoped>

</style>