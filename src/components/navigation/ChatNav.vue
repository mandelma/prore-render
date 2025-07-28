<template>
  <div>
<!--    v-if="chatParticipants.filter(navchat => navchat.isActive).length > 0"-->
    <MDBDropdown
        v-if="chatParticipants.filter(chat => chat.isActive).length > 0"

        v-model="dropdownChat"
        class="navChatDD"
        variant="none"
    >
      <div class="navChatContainer">
        <MDBDropdownToggle
            tag="a"
            class="nav-link"
            @click="dropdownChat = !dropdownChat"
        >
          <MDBIcon solid icon="comment" class="responsive-icon"   style="color: white; margin-top: 7px;"/>
<!--          v-if="newMessageList.length > 0"-->

        </MDBDropdownToggle>
        <MDBBadge

            class="translate-middle p-1"
            style="margin-left: 2px; margin-top: 8px;"
            pill
            notification
            color="danger">
          <span >
            {{ newMessageList.length }}
          </span>
        </MDBBadge>
      </div>

      <MDBDropdownMenu  dark style="padding: 0 7px;" >

        <div>
          <MDBDropdownItem  href="#" v-for="(item, i) in chatParticipants.filter(navchat => navchat.isActive)" :key="i">
            <div >
              <router-link
                  style="color: green;"

                  :class="{ disabled: item.proID === user.id && isAccessTerminated}"
                  to="/chat"
                  @click="updateRoom(item)"
              >
                <!--                nml.userID === item.userID &&-->
                <div v-if="newMessageList.some(nml => nml.room === item.room)">
                  <h4
                      v-if="item.proID === user.id"
                      class="chat-new-message-provider">
                    <b >
                      {{item.pro}}&nbsp;&nbsp;(&nbsp;{{item.name}}&nbsp;)
                      <MDBBadge
                          color="danger"
                          class="translate-middle p-1"
                          pill
                          notification
                      >{{t('nav_newMessage')}}</MDBBadge>
                    </b>

                  </h4>
                  <h4
                      v-else
                      class="chat-new-message-client">
                    <b >
                      {{item.name}}
                      <MDBBadge
                          color="danger"
                          class="ms-2"
                          pill
                          notification
                      >{{t('nav_newMessage')}}</MDBBadge>
                    </b>
                  </h4>
                </div>


                <h4
                    v-else-if="item.proID === user.id"
                    class="chat-user-is-provider"
                >
                  {{item.pro}}&nbsp;&nbsp;(&nbsp;{{item.name}}&nbsp;)

                </h4>
                <div v-else style="display: flex; justify-content: space-around" class="chat-user-is-client">
                  <h4 >
                    <MDBRow>
                      <MDBCol >
                        {{item.name}}
                      </MDBCol>

                    </MDBRow>


                  </h4>
                  <span v-if="item.same_room_counter === 0 && route.name !== 'recipient-public' && route.name !== 'live-chat'" @click.prevent >
                      <MDBIcon style="margin-left: 10px; margin-top: 7px; color: palevioletred;"  @click="removeTempChat(item.room, item.name)">
                        <i class="fas fa-trash-alt"></i>
                      </MDBIcon>

                    </span>
                </div>

              </router-link>

            </div>

          </MDBDropdownItem>
        </div>

      </MDBDropdownMenu>
    </MDBDropdown>
  </div>
</template>

<script>
import { ref } from 'vue';
import {
    MDBDropdown,
    MDBDropdownToggle,
    MDBIcon,
    MDBBadge,
    MDBDropdownMenu,
    MDBDropdownItem,
    MDBRow,
    MDBCol
} from 'mdb-vue-ui-kit';
import { useI18n } from 'vue-i18n';
import {useRoute} from "vue-router/dist/vue-router";
export default {
  name: "ChatNav",
  props: {
    chatParticipants: Array,
    newMessageList: Array,
    isAccessTerminated: Boolean,
    user: null
  },
  components: {
    MDBDropdown,
    MDBDropdownToggle,
    MDBIcon,
    MDBBadge,
    MDBDropdownMenu,
    MDBDropdownItem,
    MDBRow,
    MDBCol
  },

  setup () {
    const route = useRoute()
    const { t } = useI18n()
    const dropdownChat = ref(false)
    return {
      route,
      t,
      dropdownChat
    }
  },
  methods: {
    updateRoom (item) {
      this.$emit("updateRoom", item);
    }
  },
  removeTempChat (room, name) {
    this.$emit("removeTempChatRoom", room, name);
  }
}
</script>

<style scoped>
.dropdown-toggle::after {
  display: none !important;
}
</style>