<template>
  <div>
    <MDBDropdown
        v-if="recipientCompletedBookings.length > 0"
        v-model="dropdownFeedback"

    >
      <div class="navFeedbackContainer">
        <MDBDropdownToggle
            tag="a"
            class="nav-link"


            @click="dropdownFeedback = !dropdownFeedback"
        >
          <MDBIcon solid icon="comments" class="responsive-icon"   style="color: white;"/>


        </MDBDropdownToggle>
        <MDBBadge
            class="translate-middle p-1"
            style="margin-left: 2px; margin-top: 3px;"
            pill
            notification
            color="danger"><span >{{ recipientCompletedBookings.length }}</span></MDBBadge>
      </div>



      <MDBDropdownMenu dark style="">
        <MDBDropdownItem   href="#" v-for="(item, i) in recipientCompletedBookings" :key="i">
          <router-link to="/feedback" @click="handleFeedbackClient(item)" style="font-size: 17px; color: #ddd;">

            {{item.date}} - {{item.header}}

          </router-link>
        </MDBDropdownItem>


      </MDBDropdownMenu>
    </MDBDropdown>
  </div>
</template>

<script>
import { ref } from 'vue';
import {
    MDBDropdown,
    MDBDropdownToggle,
    MDBDropdownMenu,
    MDBDropdownItem,
    MDBIcon,
    MDBBadge
} from "mdb-vue-ui-kit";

export default {
  name: "FeedbackNav",
  props: {
    recipientCompletedBookings: Array
  },
  components: {
    MDBDropdown,
    MDBDropdownToggle,
    MDBDropdownMenu,
    MDBDropdownItem,
    MDBIcon,
    MDBBadge
  },
  setup () {
    const dropdownFeedback = ref(false)
    return {
      dropdownFeedback
    }
  },
  methods: {
    handleFeedbackClient (item) {
      this.$emit("feedbackClient", item);
    }
  }
}
</script>

<style scoped>

</style>