<template>
  <div>
<!--    <MDBNavbarItem class="me-3 me-lg-0">-->
      <MDBDropdown v-model="dropdownUser"  style=" ">
        <div class="avatarContainer">
          <MDBDropdownToggle
              class="bg-image hover-zoom"
              tag="a"

              @click="dropdownUser = !dropdownUser"
          >

            <img
                style=""
                class="navAvatar"
                :src="showAvatar ? showAvatar : avatar"
                alt="user_avatar"
            />

          </MDBDropdownToggle>
<!--          v-if="notes.filter(note => note.isNewMsg).length > 0"-->
          <MDBBadge

              notification color="info"
              style="margin-top: 3px;"
              class="translate-middle p-1"
              pill
          >
            {{notes.filter(note => note.isNewMsg).length}}
          </MDBBadge>
        </div>


        <MDBDropdownMenu dark  style="width: 200px; padding: 12px;">
          <MDBDropdownItem href="#" v-if="notes.length > 0">
            <router-link to="/message" class="user" @click="handleNotes" >
              {{t('nav_user_messages')}}
              <MDBBadge v-if="notes.filter(note => note.isNewMsg).length" color="info" class="ms-2" >
                {{notes.filter(note => note.isNewMsg).length}}
              </MDBBadge>
            </router-link>
          </MDBDropdownItem>
          <MDBDropdownItem  href="#" class="x" style=" border-radius: 0; :hover: background-color: blue;">
            <router-link to="/profile" class="user" @click="onPressedIconChildren">
              {{t('nav_user_profile')}}
            </router-link>
          </MDBDropdownItem>

          <MDBDropdownItem  href="#" class="x" style=" border-radius: 0; :hover: background-color: blue;">
            <router-link to="/manual" class="user" @click="onPressedIconChildren">
              {{t('nav_user_manual')}}
            </router-link>
          </MDBDropdownItem>

          <MDBDropdownItem v-if="userIsProvider"   href="#">
            <router-link to="/pro-gallery" class="user"  @click="onPressedIconChildren">
              {{t('nav_user_gallery')}}
            </router-link>
          </MDBDropdownItem>
          <MDBDropdownItem href="#" v-if="recipientCompletedBookingsHistory.length > 0 || proCompletedHistory.length > 0" >
            <router-link to="/history" class="user"  @click="onPressedIconChildren">
              {{t('nav_user_history')}}
            </router-link>
          </MDBDropdownItem>
          <MDBDropdownItem
              v-if="recipientBookings.length > 0"
              href="#">
            <router-link to="/received" class="user"  @click="onPressedIconChildren">
              {{t('nav_user_orders')}}
            </router-link>

          </MDBDropdownItem>
          <MDBDropdownItem

              href="#"
          >
            <router-link to="/calendar"  class="user" @click="onPressedIconChildren">
              Calendar
            </router-link>
          </MDBDropdownItem>
          <MDBDropdownItem
              v-if="userIsProvider"
              href="#">
            <router-link to="/pay-plan" class="user"  @click="onPressedIconChildren">
              {{t('nav_user_billing')}}
            </router-link>

          </MDBDropdownItem>
          <MDBDropdownItem
              href="#">
            <router-link to="/rules"  class="user"  @click="onPressedIconChildren">
              {{t('nav_user_rules')}}
            </router-link>

          </MDBDropdownItem>

          <MDBDropdownItem
              href="#"
              @click="logOut">
            <p class="user">{{t('nav_logout')}}</p>
          </MDBDropdownItem>


        </MDBDropdownMenu>
      </MDBDropdown>
<!--    </MDBNavbarItem>-->
  </div>
</template>

<script>
import { ref } from 'vue'
import {
    //MDBNavbarItem,
    MDBDropdown,
    MDBDropdownToggle,
    MDBDropdownMenu,
    MDBDropdownItem,
    MDBBadge
} from 'mdb-vue-ui-kit';
import { useI18n } from 'vue-i18n';
export default {
  name: "UserNav",
  props: {
    showAvatar: null,
    notes: Array,
    userIsProvider: null,
    recipientCompletedBookingsHistory: Array,
    proCompletedHistory: Array,
    recipientBookings: Array
  },
  components: {
    //MDBNavbarItem,
    MDBDropdown,
    MDBDropdownToggle,
    MDBDropdownMenu,
    MDBDropdownItem,
    MDBBadge
  },
  setup () {
    const { t } = useI18n();
    const dropdownUser = ref(false)
    const avatar = ref(require(`/server/uploads/avatar/avatar.png`))
    return {
      t,
      dropdownUser,
      avatar
    }
  },
  methods: {
    onPressedIconChildren () {
      this.$emit("pressedOnUsericonChildren");
    },
    handleNotes () {
      this.$emit("handleNotes");
    },
    logOut () {
      this.$emit("logOut");
    }
  }
}
</script>

<style scoped>
.dropdown-toggle::after {
  display: none !important;
}
</style>