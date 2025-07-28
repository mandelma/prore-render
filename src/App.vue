<template>
<!--  style="padding: 3px  0 3px 0;"-->
  <MDBNavbar
      v-if="!capacitor.isNativePlatform()"
      id="navbar"
      dark
      size="lg"
      position="top"
      bg="dark"
      container
      bg-secondary bg-gradient text-white
      class="d-flex justify-content-between"
  >
    <div>
      <router-link to="/" @click="onPressedLogoBtn">

        <MDBNavbarBrand>

          <div class="bg-image hover-zoom">

            <MDBIcon class="responsive-icon"><i class="fas fa-home" style="color: #908c8c; margin-top: 5px;" ></i></MDBIcon>
          </div>

        </MDBNavbarBrand>
      </router-link>
    </div>

    <div style="margin-left: 17px;">
      <language />
    </div>

    <MDBNavbarNav right class="mb-2 mb-lg-0 d-flex flex-row"  v-if="loggedUser.token !== undefined">

      <chat-nav
          :chatParticipants = chatParticipants
          :newMessageList = newMessageList
          :isAccessTerminated = isAccessTerminated
          :user = user
          @updateRoom = updateRoom
          @removeTempChatRoom = removeTempChat
      />


<!--      <MDBDropdown-->
<!--          v-if="chatParticipants.filter(navchat => navchat.isActive).length > 0"-->

<!--          v-model="dropDownChat"-->
<!--          class="navChatDD"-->
<!--          variant="none"-->
<!--      >-->
<!--        <div class="navChatContainer">-->
<!--          <MDBDropdownToggle-->
<!--              tag="a"-->
<!--              class="nav-link"-->
<!--              @click="dropDownChat = !dropDownChat"-->
<!--          >-->
<!--            <MDBIcon solid icon="comment" class="responsive-icon"   style="color: white;"/>-->

<!--            <MDBBadge-->
<!--                v-if="newMessageList.length > 0"-->
<!--                class="translate-middle p-1"-->
<!--                style="margin-left: 2px; margin-top: 3px;"-->
<!--                pill-->
<!--                notification-->
<!--                color="danger"><span >{{ newMessageList.length }}</span></MDBBadge>-->
<!--          </MDBDropdownToggle>-->
<!--        </div>-->

<!--        <MDBDropdownMenu  dark style="padding: 0 7px;" >-->

<!--          <div>-->
<!--            <MDBDropdownItem  href="#" v-for="(item, i) in chatParticipants.filter(navchat => navchat.isActive)" :key="i">-->
<!--              <div >-->
<!--                <router-link-->
<!--                    style="color: green;"-->

<!--                    :class="{ disabled: item.proID === user.id && isAccessTerminated}"-->
<!--                    to="/chat"-->
<!--                    @click="updateRoom(item)"-->
<!--                >-->
<!--                  &lt;!&ndash;                nml.userID === item.userID &&&ndash;&gt;-->
<!--                  <div v-if="newMessageList.some(nml => nml.room === item.room)">-->
<!--                    <h4-->
<!--                        v-if="item.proID === user.id"-->
<!--                        class="chat-new-message-provider">-->
<!--                      <b >-->
<!--                        {{item.pro}}&nbsp;&nbsp;(&nbsp;{{item.name}}&nbsp;)-->
<!--                        <MDBBadge-->
<!--                            color="danger"-->
<!--                            class="translate-middle p-1"-->
<!--                            pill-->
<!--                            notification-->
<!--                        >{{t('nav_newMessage')}}</MDBBadge>-->
<!--                      </b>-->

<!--                    </h4>-->
<!--                    <h4-->
<!--                        v-else-->
<!--                        class="chat-new-message-client">-->
<!--                      <b >-->
<!--                        {{item.name}}-->
<!--                        <MDBBadge-->
<!--                            color="danger"-->
<!--                            class="ms-2"-->
<!--                            pill-->
<!--                            notification-->
<!--                        >{{t('nav_newMessage')}}</MDBBadge>-->
<!--                      </b>-->
<!--                    </h4>-->
<!--                  </div>-->


<!--                  <h4-->
<!--                      v-else-if="item.proID === user.id"-->
<!--                      class="chat-user-is-provider"-->
<!--                  >-->
<!--                    {{item.pro}}&nbsp;&nbsp;(&nbsp;{{item.name}}&nbsp;)-->

<!--                  </h4>-->
<!--                  <div v-else style="display: flex; justify-content: space-around" class="chat-user-is-client">-->
<!--                    <h4 >-->
<!--                      <MDBRow>-->
<!--                        <MDBCol >-->
<!--                          {{item.name}}-->
<!--                        </MDBCol>-->

<!--                      </MDBRow>-->


<!--                    </h4>-->
<!--                    <span v-if="item.same_room_counter === 0 && route.name !== 'recipient-public' && route.name !== 'live-chat'" @click.prevent >-->
<!--                      <MDBIcon style="margin-left: 10px; margin-top: 7px; color: palevioletred;"  @click="removeTempChat(item.room, item.name)">-->
<!--                        <i class="fas fa-trash-alt"></i>-->
<!--                      </MDBIcon>-->

<!--                    </span>-->
<!--                  </div>-->

<!--                </router-link>-->

<!--              </div>-->

<!--            </MDBDropdownItem>-->
<!--          </div>-->

<!--        </MDBDropdownMenu>-->
<!--      </MDBDropdown>-->

<!--      <MDBDropdown-->
<!--          v-if="recipientCompletedBookings.length > 0"-->
<!--          v-model="dropDownfeedback"-->

<!--      >-->
<!--        <div class="navFeedbackContainer">-->
<!--          <MDBDropdownToggle-->
<!--              tag="a"-->
<!--              class="nav-link"-->


<!--              @click="dropDownfeedback = !dropDownfeedback"-->
<!--          >-->
<!--            <MDBIcon solid icon="comments" class="responsive-icon"   style="color: white;"/>-->


<!--          </MDBDropdownToggle>-->
<!--          <MDBBadge-->
<!--              class="translate-middle p-1"-->
<!--              style="margin-left: 2px; margin-top: 3px;"-->
<!--              pill-->
<!--              notification-->
<!--              color="danger"><span >{{ recipientCompletedBookings.length }}</span></MDBBadge>-->
<!--        </div>-->



<!--        <MDBDropdownMenu dark style="">-->
<!--          <MDBDropdownItem   href="#" v-for="(item, i) in recipientCompletedBookings" :key="i">-->
<!--            <router-link to="/feedback" @click="handleFeedbackClient(item)" style="font-size: 17px; color: #ddd;">-->

<!--              {{item.date}} - {{item.header}}-->

<!--            </router-link>-->
<!--          </MDBDropdownItem>-->


<!--        </MDBDropdownMenu>-->
<!--      </MDBDropdown>-->

      <feedback-nav
          :recipientCompletedBookings = recipientCompletedBookings
          @feedbackClient = handleFeedbackClient
      />

      <MDBNavbarItem v-if="newOffers.length > 0 && route.name !== 'recipient-panel'" class="me-3 me-lg-0" @click="offerSeen">

        <div class="navClientBellContainer">

          <MDBIcon solid icon="bell" class="responsive-icon"   style="color: lightskyblue;"/>

          <MDBBadge
              notification color="danger"
              class="translate-middle p-1"
              style="margin-left: 2px; margin-top: 3px;"
          >
            {{newOffers.length}}
          </MDBBadge>
        </div>

      </MDBNavbarItem>

      <MDBNavbarItem
          v-if="providerBookings.length > 0"
          to="/notification"

          class="me-3 me-lg-0"
          linkClass="link-secondary"

      >

        <span class="navProBellContainer" :class="{'gentle-hover-shake': isRingBell}" >

          <MDBIcon solid icon="bell" class="responsive-icon"   style="color: orange;"/>

          <MDBBadge v-if="notSeenClientBookings.length > 0"
                    notification color="danger"
                    style="margin-left: 2px; margin-top: 3px;"

                    class="translate-middle p-1"
                    @click="handleNotifications"
                    pill
          >
          <span >{{notSeenClientBookings.length}}</span>
          </MDBBadge>
          <MDBBadge v-else notification color="danger" class="translate-middle p-1" pill></MDBBadge>

        </span>

      </MDBNavbarItem>

      <user-nav
          :showAvatar = showAvatar
          :notes = notes
          :userIsProvider = userIsProvider
          :recipientCompletedBookingsHistory  = recipientCompletedBookingsHistory
          :proCompletedHistory = proCompletedHistory
          :recipientBookings = recipientBookings
          @pressedOnUsericonChildren = onPressedUserIconChildren
          @handleNotes = handleNotes
          @logOut = handleLogOut
      />

    </MDBNavbarNav>


    <MDBNavbarNav right class="mb-2 mb-lg-0 d-flex flex-row" v-else>

      <MDBNavbarItem >
        <router-link to="/login" @click="collapse7 = false" style="color: cornflowerblue;" >{{t('nav_sign_in')}}</router-link>

      </MDBNavbarItem>

    </MDBNavbarNav>

  </MDBNavbar>

  <MDBNavbar
      v-else

      dark
      size="large"
      position="top"
      bg="dark"
      container
      bg-secondary bg-gradient text-white
      class="d-flex justify-content-between"
  >
    <MDBIcon size="2x" @click="$router.go(-1)">
      <i class="fas fa-arrow-circle-left"></i>
    </MDBIcon>
    <MDBNavbarNav right class="mb-2 mb-lg-0 d-flex flex-row">
      <MDBDropdown
          v-if="recipientCompletedBookings.length > 0"
          v-model="dropDownfeedback"

      >
        <div class="navFeedbackContainer">
          <MDBDropdownToggle
              tag="a"
              class="nav-link"


              @click="dropDownfeedback = !dropDownfeedback"
          >
            <MDBIcon solid icon="comments" class="responsive-icon"   style="color: white;"/>
            <MDBBadge
                class="translate-middle p-1"
                style="margin-left: 2px; margin-top: 3px;"
                pill
                notification
                color="danger"><span >{{ recipientCompletedBookings.length }}</span></MDBBadge>

          </MDBDropdownToggle>
        </div>



        <MDBDropdownMenu dark style="">
          <MDBDropdownItem   href="#" v-for="(item, i) in recipientCompletedBookings" :key="i">
            <router-link to="/feedback" @click="handleFeedbackClient(item)" style="font-size: 17px; color: #ddd;">

              {{item.date}} - {{item.header}}

            </router-link>
          </MDBDropdownItem>


        </MDBDropdownMenu>
      </MDBDropdown>
      <MDBNavbarItem v-if="newOffers.length > 0 && route.name !== 'recipient-panel'" class="me-3 me-lg-0" @click="offerSeen">

        <div class="navClientBellContainer">

          <MDBIcon solid icon="bell" class="responsive-icon"   style="color: lightskyblue;"/>

          <MDBBadge
              notification color="danger"
              class="translate-middle p-1"
              style="margin-left: 2px; margin-top: 3px;"
          >
            {{newOffers.length}}
          </MDBBadge>
        </div>

      </MDBNavbarItem>

      <MDBNavbarItem
          v-if="providerBookings.length > 0"
          to="/notification"

          class="me-3 me-lg-0"
          linkClass="link-secondary"

      >

        <span class="navProBellContainer" :class="{'gentle-hover-shake': isRingBell}" >

          <MDBIcon solid icon="bell" class="responsive-icon"   style="color: orange;"/>

          <MDBBadge v-if="notSeenClientBookings.length > 0"
                    notification color="danger"
                    style="margin-left: 2px; margin-top: 3px;"

                    class="translate-middle p-1"
                    @click="handleNotifications"
                    pill
          >
          <span >{{notSeenClientBookings.length}}</span>
          </MDBBadge>
          <MDBBadge v-else notification color="danger" class="translate-middle p-1" pill></MDBBadge>

        </span>

      </MDBNavbarItem>
      <div style="margin-top: 10px;">
        <language />
      </div>
    </MDBNavbarNav>
  </MDBNavbar>

  <success-message
      style="padding: 20px;"
      :message = ratingResult
  />

  <info-message
      style="padding: 20px;"
      :message = offerLimitLoadedMessage
  />

  <prompt-panel
      :promptPanelContent = promptPanelContent
      @prompt:no = handlePromptNo
      @prompt:yes = handlePromptYes
  />
  <div v-if="userIsProvider && loggedUser.token !== undefined">
    <div
        v-if="route.name !== 'recipient-public' && route.name !== 'provider-public'"
        class="availableDrag"
        :style="{ left: pos.x + 'px', top: pos.y + 'px' }"
        @mousedown="startDrag"
        @touchstart="startDrag"
    >
      <div >
        <div >
          <div style="flex-direction: column;">
            <p style="font-size: 11px; ">
              Näkyvyys kalenterissa
              <i :class="isProAvailable ? 'icon-green' : 'icon-red'" style="margin-bottom: 7px; "></i>
            </p>

            <div class="available_btn_panel" style="">
              <MDBBtn  color="success" @click="switchProAvailability">Heti</MDBBtn>
              <MDBBtn  color="danger" @click="undoProAvailability">Pois</MDBBtn>
            </div>
            <div class="small_available_btn_panel">
              <p style="color: lawngreen" @click="switchProAvailability">HETI</p>
              <p style="color: red" @click="undoProAvailability">POIS</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>


<!--  v-if="currentChatRoom-->
<!--  <chat-modal >-->

<!--    <template #header>-->
<!--      <div class="pop">Open Popover</div>-->
<!--    </template>-->
<!--    <template #content>-->
<!--      <div class="pop-content">-->
<!--        <live-chat-->
<!--            :chatusers = users-->
<!--            :messages =conversation-->
<!--            @select:user = onSelectUser-->
<!--            @noSelected = noSelectUser-->
<!--            :selecteduser = onSelectUser-->
<!--            @on:message = handleMessage-->
<!--        />-->
<!--      </div>-->
<!--    </template>-->
<!--  </chat-modal>-->


  <!--  bg="dark"-->


<!--  <div v-if="capacitor.isNativePlatform()" class="bottom-bar">-->
<!--    <button class="bar-button">Home</button>-->
<!--    <button class="bar-button">Search</button>-->
<!--    <button class="bar-button">Profile</button>-->
<!--  </div>-->


  <MDBFooter v-if="capacitor.isNativePlatform()" class="fixed-bottom" bg="dark" :text="['center','white']">
    <div v-if="loggedUser.token !== undefined">
      <!-- Grid container -->
<!--      <MDBContainer class="p-4 pb-0">-->
        <!-- Section: Social media -->
        <section style="display: flex; justify-content: space-around; padding-top: 7px;" >
          <!-- Home -->
          <div style="flex-direction: column;">
            <MDBIcon size="lg" @click="$router.push('/')">
              <i class="fas fa-home" style="color: white;" ></i>
            </MDBIcon>
            <p style="color: #ddd;">Kotisivu</p>
          </div>
          <!-- Calendar -->
          <div style="flex-direction: column;">
            <MDBIcon size="lg" @click="$router.push('/calendar')">
              <i class="fas fa-calendar-alt"></i>
            </MDBIcon>
            <p style="color: #ddd;">Kalenteri</p>
          </div>

          <!-- Profile -->
          <div style="flex-direction: column;">
            <MDBIcon size="lg" @click="$router.push('/')">
              <i class="fas fa-bars"></i>
            </MDBIcon>
            <p style="color: #ddd;">Midagi</p>
          </div>

          <!-- Github -->
          <div style="flex-direction: column;">
            <chat-nav
                :chatParticipants = chatParticipants
                :newMessageList = newMessageList
                :isAccessTerminated = isAccessTerminated
                :user = user
                @updateRoom = updateRoom
                @removeTempChatRoom = removeTempChat
            />
            <p style="color: #ddd; font-size: 11px;">Ja siin</p>
          </div>
          <div>
<!--            <MDBDropdown dropup v-model="footerAvatar">-->
<!--              <MDBDropdownToggle @click="footerAvatar = !footerAvatar" tag="b">-->
<!--                <img-->
<!--                    style=""-->
<!--                    class="navAvatar"-->
<!--                    :src="showAvatar ? showAvatar : avatar"-->
<!--                    alt="user_avatar"-->
<!--                />-->
<!--              </MDBDropdownToggle>-->
<!--              <MDBDropdownMenu dark aria-labelledby="dropdownMenuButton">-->
<!--                <MDBDropdownItem href="#">Action</MDBDropdownItem>-->
<!--                <MDBDropdownItem href="#">Another Action</MDBDropdownItem>-->
<!--                <MDBDropdownItem href="#">Something else here</MDBDropdownItem>-->
<!--              </MDBDropdownMenu>-->
<!--            </MDBDropdown>-->
            <user-nav
                :showAvatar = showAvatar
                :notes = notes
                :userIsProvider = userIsProvider
                :recipientCompletedBookingsHistory  = recipientCompletedBookingsHistory
                :proCompletedHistory = proCompletedHistory
                :recipientBookings = recipientBookings
                @pressedOnUsericonChildren = onPressedUserIconChildren
                @handleNotes = handleNotes
                @logOut = handleLogOut
            />
          </div>
        </section>
        <!-- Section: Social media -->
<!--      </MDBContainer>-->
      <!-- Grid container -->
    </div>
    <div v-else>
      <div style="display: flex; justify-content: right; padding: 13px;">
        <router-link to="/login" @click="collapse7 = false" style="color: cornflowerblue;" >{{t('nav_sign_in')}}</router-link>
      </div>

    </div>

  </MDBFooter>



  <MDBFooter v-else  bg="dark" :text="['center', 'white']" class="fixed-bottom">

    <MDBContainer v-if="clientMapSearchData.length > 0">

      <div id="container" >

        <div >
          <div class="box">{{ sentence }}</div>
        </div>

      </div>
    </MDBContainer>

    <!-- Copyright -->
    <!--    id="footer"-->
    <!--    :class="{footer: route.name !== 'dash-board'}" Displaying footer only small screen nain page-->
    <div   class="text-center p-3" style="background-color: rgba(0, 0, 0, 0.2)">
      © <span @click="pushToUser">2025</span> Copyright: DUVA OY <router-link to="/admin" >
      -------
    </router-link>
    </div>
    <!-- Copyright -->
  </MDBFooter>


  <router-view
      :avatar = avatar
      @delete_avatar = handleDeleteAvatar
      :avatarObject = avatarObject
      :client_filled_days = client_filled_days
      :client_filled = client_filled
      :filled_days = "filled_days"
      :filled = "filled"
      :notes = notes
      @remove_note = handleRemoveNote
      :test = test
      @login:data = "handleLogin"
      @register:data = "createUser"
      :userIsProvider = userIsProvider
      :proImages = proImages
      @addProImage = handleAddProImage
      @editProRefImage = handleEditProRefImage
      @removeProRefImage = handleRemoveProRefImage

      :proRefSlides = proRefSlides
      :isPro = isProOpenGallery
      @add:slide = handleAddSlide
      @remove:slide = handleRemoveSlide
      @update:gallery = handleUpdateGallery
      @updateGalleryRemove = handleUpdateGalleryRemove
      :loggedInUser = loggedUser
      :recipientBookings = recipientBookings
      @addImageToRecipientBookings = handleAddImageRecipientBookings

      :confirmedBookingsByClient = clientAcceptedBookings
      :confirmedBookingsByProvider = providerAcceptedBookings
      @booking:update = handleCreateBooking
      @booking_map:update = handleCreateMapBooking

      @offer_confirmed = handleOfferConfirmed

      @exit:notifications = handleExitNotifications
      @update:status = handleStatusUpdate

      @update:proChatNav = handleUpdateProChatNav

      @update:booking = handleUpdateClientConfirmedBooking

      @get_booking_offers = getBookingOffers
      :offers = offers

      @offer_limit_is_loaded = handleOfferLimitIsLoaded
      @create:offer = handleCreateOffer
      @editOfferStatus = handleEditOfferStatus

      @confirm_client_booking = handleConfirmClientBooking
      @reject_pro_form_booking = handleRejectProFormBooking
      @reject_bookingByPro_no_offers = handleRejectBookingByProNoOffers
      @reject_bookingByClient_no_offers = handleRejectBookingByClientNoOffers
      @removeBookingWithOffers = handleRemoveBookingWithOffers

      @activate:bell = handleActivateBell
      @deactivate:bell = handleDeActivateBell

      :bookings = providerBookings
      :bookingsConfirmed = confirmedProBookings
      :recipientConfirmedBookings = recipientCompletedBookingsHistory
      :proCompletedHistory = proCompletedHistory
      @removeProBookingConfirmed = handleRemoveProBookingConfirmed
      :customer = rateCustomer

      @isRated = handleRated
      @backFromFeedback = handleBackFromFeedbackClient


      @finalinfo = fromFinal
      @initializeChat = handleInitializeChat
      @joinChatPanel = handleJoinChatPanel


      :chatusers = users
      :activeUser = activeUser
      :messages = conversation

      @set:room = handleSetRoom

      :isSelectedByExpiredUser = isSelectedByExpiredUser

      :newMessageRoom = newMessageRoom


      :provider = userIsProvider
      @editPortfolio = handleEditPortfolio
      :proDescription = proDescription
      :recipient = recipientBookings
      @recipient:date_ms = handleUpdateBookingDate_ms
      :creditLeft = proTimeCreditLeft
      @show-created-provider = handleShowCreatedProvider
      @updateProTimeCredit = handleUpdateProTimeCredit


      :isAccessDenied = isAccessTerminated
      @select:user = onSelectUser
      @noSelected = noSelectUser
      :selecteduser = selectedUser

      @join:visitor = handleJoinVisitor

      @on:message = handleMessage

      @otherUser = otherUser

      @bookingWaitingProBack = handleBookingWaitingProBackBtn

      @updateAvatar = handleUpdateAvatar
      @removeAvatar = handleRemoveAvatar

      :recipient-test = recipientTest

      @client:confirmed_provider = handleClientConfirmedUser
      @archiveClientSideBooking = handleArchiveClientSideBooking


      @resetMapSearch = mapSearchReset

      :wentOut = wentOut

      :isDisableProNotOfferBtns = isDisableProNotOfferBtns
      @confirmOfferAbort = handleConfirmOfferAbort
      :isDisableProNotMapBtns = isDisableProNotMapBtns
      @confirmMapOfferAbort = handleConfirmMapOfferAbort
  />


<!--    processed actions {{processedActions}}<br><br>-->
<!--  <MDBBtn color="success" @click="sendUserAction">Send action</MDBBtn><br>-->

<!--  FCM_TOKEN {{fcm_token}}-->

<!--  Recipient filled days: {{client_filled_days}}-->

<!--  is pro available {{isProAvailable}}-->

<!--  provider {{userIsProvider}}-->
<!--  client {{client}}<br><br>-->
<!--  resipient completed bookings {{recipientCompletedBookings}}-->

<!--  PROCESS.ENV {{process.env.VUE_APP_NAME}}-->

<!--  <div v-for="(item, i) in im" :key="i">-->
<!--    <img :src="item.image" alt="xxx"/>-->
<!--  </div>-->


<!--  <div v-if="userIsProvider.reference.length > 0">-->
<!--    <div v-for="(item, i) in userIsProvider.reference" :key="i">-->
<!--      <img src="item.image" alt="xxx" />-->
<!--    </div>-->
<!--  </div>-->

<!--  Current route {{route.name}}-->

<!--  chatroom {{currentChatRoom}}-->

<!--  time {{new Date().getTime()}}-->

<!--  <button @click="getDist">Get distance</button>-->


<!--  not seen bookings {{notSeenClientBookings.length}}-->
<!--BOOKINGS {{recipientBookings}}<br>-->

<!--  providerAcceptedBookings APP {{providerAcceptedBookings}}<br>-->
<!--Distance {{di}}-->
<!--    pro filled days in app {{filled_days}}<br>-->
<!--  provider bookings {{providerBookings}}-->

<!--  route {{route.name}}-->

<!--  Client reject messages {{messageAboutRejectBookingByClient}}-->

<!--      new offers {{newOffers}}-->
<!--  <language />-->

<!--  <h1>{{ t('welcome') }}</h1><br>-->


<!--  language is {{currentLanguage}}-->

  <!--  <img :src="imageSrc"/><br>-->


<!--    selected user {{selectedUser}}<br>-->
<!--    currentChatRoom {{currentChatRoom}}<br>-->

<!--  PRO BOOKINGS {{providerBookingsHistory}}-->


  <!--    users {{users}}-->
  <!--  new message test {{newMessageTest}}-->

  <!--access {{isAccessTerminated}}-->

  <!--  Selected user {{selectedUser}}<br>-->
  <!--  New message list {{newMessageList}}-->

  <!--  Newmessagelist {{newMessageList}}<br>-->


  <!--  &#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;<br>-->


<!--  Chatparticipants {{chatParticipants}}<br>-->

<!--  pro ref slides APP {{proRefSlides}}-->

<!--    OFFERS {{offers}}-->

<!--    CHATPARTICIPANTS {{chatParticipants.length}}<br>-->

  <!--  selected user {{selectedUser}}-->
<!--    Recipient completed bookings {{recipientCompletedBookings}}-->

</template>

<script>
/* eslint-disable */



import imageService from "@/service/image";
import awsUploadService from '@/service/awsUploads';
import fcmService from '@/service/fcmUsers';
import userNav from './components/navigation/UserNav';
import chatNav  from './components/navigation/ChatNav';
import {loadGoogleMaps}  from '@/components/utils/loadGoogleMaps';
import addDays from "date-fns/addDays";

import { PushNotifications } from '@capacitor/push-notifications';
import feedbackNav from './components/navigation/FeedbackNav'
import { Capacitor } from '@capacitor/core';
import { v4 as uuidv4 } from 'uuid';

const initReactiveProperties = (user) => {
  user.hasNewMessages = false;
  user.messages = [];
};
import Notifications from './pages/Notification.vue'
import userService from "./service/users"
import providerService from './service/providers'
import recipientService from './service/recipients'
import loginService from "./service/login"
import conversationService from "./service/conversation"
import chatMemberService from "./service/chatUsers"
import clientHistoryService from "../server/models/clientHistory"
import proHistoryService from "./service/proHistory"
import offerService from "./service/offers"
import messageService from "./service/messages"
import monthConverter from './components/controllers/month-converter'
import gMapData from '@/components/controllers/distance';
import successMessage from "@/components/notifications/successMessage";
import infoMessage from "@/components/notifications/infoMessage";
import promptPanel from './components/PromptPanel'
import modal from './components/ChatModal'

import distanceBetween from "@/components/controllers/distance";

import language from "@/components/Language"
import { className } from '@/components/controllers/recipient'
import '@/css/notification.css'

import { useRoute } from 'vue-router';

import { useI18n } from 'vue-i18n';
import { ref } from 'vue';
import Language from './components/Language'

import User from './components/chatio/User.vue'
import MessagePanel from "./components/chatio/MessagePanel.vue"

import {
  MDBBtn,
  MDBNavbar,
  MDBCollapse,
  MDBNavbarItem,
  MDBNavbarBrand,
  MDBNavbarNav,
  MDBNavbarToggler,
  MDBBadge,
  MDBIcon,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
  MDBFooter,
  MDBRow,
  MDBCol,
  MDBContainer,
  MDBBtnClose,
  MDBAccordion, MDBAccordionItem
} from 'mdb-vue-ui-kit';

import socket from "@/socket";
import chatuserService from '@/service/chatUsers'

import  { onMounted, onUnmounted } from "vue";
import ChatModal from "@/components/ChatModal";

import liveChat from './pages/LiveChat'
import {LocalNotifications} from "@capacitor/local-notifications";
import ChatNav from "@/components/navigation/ChatNav";
import FeedbackNav from "@/components/navigation/FeedbackNav";

export default {
  name: 'App',
  props: {
    //info: String
  },
  components: {
    FeedbackNav,
    ChatNav,
    userNav,
    liveChat,
    ChatModal,
    MDBFooter,
    MDBRow,
    MDBCol,
    MDBContainer,
    MDBBtnClose,

    User,
    MessagePanel,
    Notifications,
    monthConverter,
    successMessage,
    infoMessage,
    promptPanel,
    modal,

    MDBNavbar,
    MDBCollapse,
    MDBNavbarItem,
    MDBNavbarBrand,
    MDBNavbarNav,
    MDBNavbarToggler,
    MDBBadge,
    MDBIcon,
    MDBBtn,
    MDBDropdown,
    MDBDropdownToggle,
    MDBDropdownMenu,
    MDBDropdownItem,
    MDBAccordion,
    MDBAccordionItem,
    Language,
    language
  },

  data () {
    const route = useRoute()

    return {
      capacitor: Capacitor,
      fcm_token: null,
      deviceID: null,
      client: null,
      givenRatingNav: null,
      isPageVisible: true,
      //amp: null,
      o: [],

      route,
      promptPanelContent: null,
      promptRoom: "",
      offers: [],
      di: null,
      du: null,
      offerLimitLoadedMessage: null,
      notes: [],
      res: [],
      clientAcceptedBookings: [],

      providerAcceptedBookings: [],
      client_filled_days: [],
      client_filled: [],

      filled_days: [],
      filled: [],
      //currentLanguage: null,
      currentChatRoom: null,
      newMessageTest: false,
      imageSrc: null,
      unread: null,
      sentence: null,
      i: 0,
      chatParticipants: [],
      test: false,
      //activeTabId4: "",
      recipientTest: null,
      //note: null,
      credit: 0,
      testDialog: ['eka', 'toka', 'pipi'],
      counter: null,
      user: null,
      isNewMessage: true,
      messageInfo: "",
      newMessageList: [],
      rateCustomer: {},
      ratingResult: null,
      newMessageRoom: "",
      tu: [],
      userSocketID: "",
      info: "",
      users: [],
      currentRoom: "",
      messages: [],
      conversation: [],
      selectedUser: null,
      activeUser: null,
      msg: "",
      isBell: false,
      loggedUser: {},

      isAccessTerminated: false,
      messageAboutAccess: "Access denied!",

      recipientBookings: [],

      newOffers: [],

      //messageAboutRejectBooking: null,
      //messageAboutRejectBookingByClient: null,
      //messageAboutOfferConfirmation: null,

      recipientImages: [],

      userIsProvider: null,
      proTimeCreditLeft: null,
      isSelectedByExpiredUser: false,
      isProAvailable: false,
      proImages: [],
      proRefSlides: [],
      isProOpenGallery: true,
      providerBookings: [],
      confirmedProBookings: [],
      recipientCompletedBookings: [],
      recipientCompletedBookingsHistory: [],
      proCompletedHistory: [],

      isNotification: false,
      notSeenClientBookings: [],

      // avatar: {name: "avatar.png"},
      avatar: require(`/server/uploads/avatar/avatar.png`),
      avatarObject: null,
      showAvatar: null,

      newMessage: "",
      otheruser: {},

      proDescription: "",
      isMapSearchData: false,
      isMapSearchActive: false,
      clientMapSearchData: [],
      isRingBell: false,
      processedActions: new Set(),

      isDisableProNotOfferBtns: false,
      abortedOfferOrderId: "",
      isDisableProNotMapBtns: false,
      abortedOfferMapId: ""
    }
  },
  created() {

  },
  beforeMount() {


  },


  setup() {

    onMounted (  async () => {
      if (!window.google) {
        await loadGoogleMaps();
        // const script = document.createElement("script");
        // script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.VUE_APP_MAP_KEY}&libraries=places,geometry&v=beta`;
        // script.async = true;
        // script.defer = true;
        // document.head.appendChild(script);
        console.log("Map is inited in APP!");
      }
    })


    const collapse7 = ref(false);
    const dropDownDialog = ref(false)
    const dropDownChat = ref(false)

    const dropdownLang = ref(false)
    const dropdown2 = ref(false)
    const dropdownBell = ref(false)
    const dropDownfeedback = ref(false)

    const footerAvatar= ref(false)
    const { t } = useI18n();
    //const { locale } = useI18n();
    // watchEffect(() => {
    //   const storedLang = localStorage.getItem('lang');
    //   if (storedLang) {
    //     //console.log("Heeiiiiii")
    //     console.log("Heeiiiiii " + storedLang)
    //     //this.locale = storedLang;
    //   }
    // });

    const pos = ref({ x: 20, y: 70 })
    const offset = { x: 0, y: 0 }
    let isDragging = false

    const getEventPos = (e) => {
      if (e.touches && e.touches.length > 0) {
        return { x: e.touches[0].clientX, y: e.touches[0].clientY }
      }
      return { x: e.clientX, y: e.clientY }
    }

    const startDrag = (e) => {
      const { x, y } = getEventPos(e)
      isDragging = true
      offset.x = x - pos.value.x
      offset.y = y - pos.value.y

      window.addEventListener('mousemove', onDrag)
      window.addEventListener('mouseup', stopDrag)
      window.addEventListener('touchmove', onDrag)
      window.addEventListener('touchend', stopDrag)
    }

    const onDrag = (e) => {
      if (!isDragging) return
      const { x, y } = getEventPos(e)
      pos.value.x = x - offset.x
      pos.value.y = y - offset.y

      const newX = x - offset.x
      const newY = y - offset.y

      // Get element dimensions
      const el = document.querySelector('.availableDrag')
      const elWidth = el.offsetWidth
      const elHeight = el.offsetHeight

      // Clamp position within viewport
      pos.value.x = Math.min(Math.max(0, newX), window.innerWidth - elWidth)
      pos.value.y = Math.min(Math.max(0, newY), window.innerHeight - elHeight)
    }

    // const stopDrag = () => {
    //   isDragging = false
    //   window.removeEventListener('mousemove', onDrag)
    //   window.removeEventListener('mouseup', stopDrag)
    // }

    const stopDrag = () => {
      isDragging = false
      window.removeEventListener('mousemove', onDrag)
      window.removeEventListener('mouseup', stopDrag)
      window.removeEventListener('touchmove', onDrag)
      window.removeEventListener('touchend', stopDrag)
    }

    onUnmounted(() => {
      // Clean up in case component is destroyed while dragging
      stopDrag();
    })

    return {
      collapse7,
      dropDownDialog,
      dropDownChat,
      dropdownLang,
      dropdown2,
      dropdownBell,
      dropDownfeedback,
      t,
      isDragging,
      pos,
      startDrag,
      footerAvatar
      //locale,
      //watchEffect
    }
  },

  mounted() {

    this.handleVisibilityChange();
    document.addEventListener("visibilitychange", this.handleVisibilityChange);

    // Initialize Push Notifications






    if (process.env.NODE_ENV === 'production') {
      console.log('Production mode enabled');
    } else {
      console.log('Development mode enabled');
    }

    // let lastScrollTop; // This Varibale will store the top position
    //
    // let navbar = document.getElementById('navbar'); // Get The NavBar
    //
    // localStorage.setItem('x', document.getElementById('navbar').innerHTML);
    //
    //
    //
    //
    // window.addEventListener('scroll',function(){
    //   //on every scroll this funtion will be called
    //   let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    //   //This line will get the location on scroll
    //
    //   if(scrollTop > lastScrollTop){ //if it will be greater than the previous
    //     navbar.style.top='-200px';
    //     //set the value to the negetive of height of navbar
    //   }
    //
    //   else{
    //     navbar.style.top='0';
    //   }
    //
    //
    //   lastScrollTop = scrollTop; //New Position Stored
    // });

    console.log("ENV " + process.env.VUE_APP_NAME)

    const recipientClass = new className("Hallo");

    console.log("xxx " + recipientClass.response("aaa"));

    //this.validateToken();

    const currentChatRoom = window.localStorage.getItem("currentRoom")
    if (currentChatRoom) {
      const roomNow = JSON.parse(currentChatRoom);
      this.currentChatRoom = JSON.parse(currentChatRoom);
      this.selectedUser = this.users.find(current => current.room === roomNow && current.userID !== this.loggedUser.id);
      socket.emit("update room", roomNow);
    }

    const loggedUserJSON = window.localStorage.getItem('loggedAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      this.user = user;
      const username = user.username;
      const userID = user.id

      this.identifyUserDevice();

      if (Capacitor.isNativePlatform()) {
        this.handleFcm(user.id);
      }

      this.joinServer(username, userID);
    }

    const selectedUserJSON = window.localStorage.getItem('selectedChatUser');
    if (selectedUserJSON) {
      const sUser = JSON.parse(selectedUserJSON)
      //this.selectedUser = JSON.parse(selectedUserJSON)

      this.selectedUser = sUser;
      socket.emit("update room", sUser.room);



    }

    const clientForFeedback = window.localStorage.getItem('customerFeedback')
    if (clientForFeedback) {
      const customer = JSON.parse(clientForFeedback);
      this.rateCustomer = customer;
    }
    //this.runEveryMinite ()


    setInterval(this.runEveryMinite, 10*1000);

  },


  methods: {
    handleVisibilityChange() {
      this.isPageVisible = document.visibilityState === "visible";
      console.log("Page visible:", this.isPageVisible);
      if (this.isPageVisible) {
        //this.setStatusIfVisible();
        this.validateToken();
      } else {
        console.log("Page is not visible!")
        //socket.emit("user leave");
      }
    },
    setStatusIfVisible () {
      console.log("Yes, page is visible!")
    },
    handleConfirmOfferAbort () {
      console.log("Offer abort confirmed");
      this.providerBookings = this.providerBookings.filter(pb => pb.id !== this.abortedOfferOrderId);
      this.isDisableProNotOfferBtns = false;
      this.sendUserAction();
      //this.applyUserAction(this.user.id);
      if (this.providerBookings.length < 1) {
        this.$router.push('/');
      }
    },
    handleConfirmMapOfferAbort () {
      console.log("Map offer abort confirmed in APP and id: " + this.abortedOfferMapId);
      this.providerBookings = this.providerBookings.filter(pb => pb.id !== this.abortedOfferMapId);
      this.isDisableProNotMapBtns = false;
      this.sendUserAction();
      if (this.providerBookings.length < 1) {
        this.$router.push('/');
      }
    },
    identifyUserDevice () {
      const deviceId = localStorage.getItem("deviceId") || uuidv4();
      this.deviceID = deviceId;
      localStorage.setItem("deviceId", deviceId);
    },

    // Will send to own account if another browser is open
    sendUserAction () {
      const action = {
        id: uuidv4(),
        timestamp: Date.now(),
        userId: this.user.id,
        origin: this.deviceID
      }

      this.processedActions.add(action.id);
      socket.emit("user-action", action);
    },
    applyUserAction (userId) {
      console.log("Apply action!!");
      this.handleUpdate(userId);
    },
    // applyUserActionAbortOffer () {
    //   console.log("Applyed user abort about offer");
    //   this.providerBookings = this.providerBookings.filter(pb => pb.id !== this.abortedOfferOrderId);
    // },
    handleEditPortfolio (description) {
      // const fruits = ['apple', 'banana', 'apple'];
      // const count = fruits.reduce((acc, fruit) => {
      //   acc[fruit] = (acc[fruit] || 0) + 1;
      //   return acc;
      // }, {});
      console.log(count); // { apple: 2, banana: 1 }
      console.log("Des content " + description);
      this.proDescription = description;
    },
    async switchProAvailability () {
      console.log("Time is selected!" );
      const isAvailable = await providerService.setAvailability(this.userIsProvider.id, {isAvailable24_7: true});
      this.isProAvailable = true;
    },

    async undoProAvailability () {
      console.log("Not pro available, pending... ");
      const isNotAvailable = await providerService.setAvailability(this.userIsProvider.id, {isAvailable24_7: false});
      this.isProAvailable = false;
    },

    handleDeleteAvatar () {
      console.log("Deleting avatar!!");
      this.avatar = require(`/server/uploads/avatar/avatar.png`);
    },

    async handleFcm (user_id) {
      // await PushNotifications.removeAllListeners();
      // await PushNotifications.unregister(); // force re-registration (not always effective)


      PushNotifications.requestPermissions().then(result => {
        if (result.receive === 'granted') {


          PushNotifications.register();
        }
      });

      PushNotifications.addListener('registration', async token => {
        console.log('Push registration success, token: ' + token.value);
        try {
          this.fcm_token = token.value;

          const fcmResult = await fcmService.handleFcmToken({userId: user_id, token: token.value});
          console.log("FCM result " + fcmResult);
        } catch (e) {
          console.log("Error to save token - " + e.message);
        }

      });

      PushNotifications.addListener('pushNotificationReceived', async notification => {
        console.log('Push Notification received:', notification);

        const id = Math.floor(Math.random() * 1000000); // Must be a Java int!

        // await LocalNotifications.schedule({
        //   notifications: [
        //     {
        //       id,
        //       title: notification.title || 'New Notification',
        //       body: notification.body || '',
        //       smallIcon: 'ic_stat_icon_config',
        //       iconColor: '#488AFF',
        //     }
        //   ]
        // });


      });

      PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
        console.log('Notification action performed', notification);
      });

      // Listen for push notification opened
      PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
        console.log('Push Notification tapped: ', notification);
      });
    },

    async pushToUser () {
      const push = await fcmService.pushToUser({userId: "67ddcf9babceb1d30cb73ab8", title: "Message-x", message: "Hola hola! Sended for test!"});

      console.log("Push result " + push);
      console.log("Push implemented!")
    },

    async handlePromptYes () {
      console.log("Prompt yes App");
      this.promptPanelContent = null;
      const room = this.promptRoom;
      const messages = await conversationService.getRoomMessages(room);

      for (let msg in messages) {
        console.log("Chat_message " + messages[msg].content.body);
        if (messages[msg].is_db_image) {
          await imageService.removeRoomChatImage(messages[msg].imgID)
        }
      }

      const thisRoom = this.chatParticipants.find(chatRoom => chatRoom.room === room);
      const recipient = thisRoom.userID;
      socket.emit("remove temp room", room, recipient);

      await conversationService.deleteRoomMessages(room);
      await chatMemberService.removeChatMembersRoom(room);



      this.chatParticipants = this.chatParticipants.filter(cp => cp.room !== room);
    },
    handlePromptNo () {
      console.log("Prompt no App");
      this.promptPanelContent = null;
    },
    getDist () {
      const start = [60.276416745100214, 24.8582598642488];
      const end = [60.23308429999999, 24.7531404];

      distanceBetween.findDistance(start, end)
      .then(d => {
        this.di = d.distance;
        console.log("DD " + d.distance);
      })

    },

    getBookingOffers (offers) {
      //console.log("Booking with offers " + offers.length);
      this.offers = offers;
    },

    handleAddProImage (image) {
      console.log("But what is image key?? " + image.key);
      this.proImages = this.proImages.concat(image);
    },
    handleEditProRefImage (index, imgID, imgKey, show) {

      console.log("Edit " + index);
      console.log("Edit " + imgID);
      console.log("Edit " + show);

      this.proImages[index] = {_id: imgID, key: imgKey, blob: show};

    },
    handleRemoveProRefImage (index) {
      console.log("Removable pro ref image index is " + index);
      this.proImages.splice(index, 1);
    },

    async removeTempChat (room, name) {
      console.log("Chat room -- " + room);
      this.promptRoom = room;

      if (confirm("Oletko varmaa, että haluat poistaa chatin?") === true) {
        const messages = await conversationService.getRoomMessages(room);

        for (let msg in messages) {
          console.log("Chat_message " + messages[msg].content.body);
          if (messages[msg].is_db_image) {
            //await imageService.removeRoomChatImage(messages[msg].imgID)
            await awsUploadService.deleteImage(messages[msg].imgID, messages[msg].key);
          }
        }

        const thisRoom = this.chatParticipants.find(chatRoom => chatRoom.room === room);
        const recipient = thisRoom.userID;

        socket.emit("remove temp room", room, recipient);

        await conversationService.deleteRoomMessages(room);
        await chatMemberService.removeChatMembersRoom(room);



        this.chatParticipants = this.chatParticipants.filter(cp => cp.room !== room);
      } else {
        console.log("You canceled to remove chat!")
      }

    },

    async createNoteToDisplay (bookingId, content, isLink, reason, sender) {
      const message = {
        bookingId: bookingId,
        isNewMsg: true,
        content: content,
        isLink: isLink,
        sender: sender,
        reason: reason,
        time: new Date()
      };

      try {
        const created_message = await messageService.createMessage(this.loggedUser.id, message);
        console.log("Message sent:", created_message);
        this.notes = this.notes.concat(created_message);
      } catch (error) {
        if (error.response && error.response.status === 409) {
          console.warn("Duplicate message prevented:", error.response.data.messageId);
          console.log("Dublicated message!!!")
          // Optionally notify the user or ignore silently
        } else {
          console.error("Failed to send message:", error.message);
          // Handle other errors
        }
      }

    },
    async handleRemoveNote (note) {
      console.log("Removed note id is: " + note.id);
      this.notes = this.notes.filter(item => item.id !== note.id);
      await messageService.removeSelectedMessage(this.user.id, note.id);


      if (this.notes.length < 1) {
        if (!note.isLink) {
          this.$router.push("/");
        }

      }
    },
    async handleNotes (id) {
      console.log("Clicked on notes");

    },
    offerSeen () {
      //offerService.editStatus()
      console.log("Is here some effect???")
      this.$router.push('/received')
      // this.newOffers = this.newOffers.slice(0, -1);
      // console.log(this.newOffers.length)
    },
    handleJoinVisitor (bookingID, visitor) {
      console.log("VISITOR")
      const inx = this.providerBookings.findIndex(item => item.id === bookingID);
      this.providerBookings[inx].visitors = this.providerBookings[inx].visitors.concat(visitor);

      this.notSeenClientBookings = this.providerBookings.filter(nsb => !nsb.visitors.includes(visitor));

      this.sendUserAction();

    },
    handleEditOfferStatus (offerID) {
      console.log("Offer id in app " + offerID);
      this.newOffers = this.newOffers.filter(offer => offer.id !== offerID);
    },

    async handleOfferConfirmed (booking, proID) {
      console.log("Confirmed booking header is ---- " + booking.header)
      const realtime_booking = await recipientService.getBookingById(booking.id);
      this.newOffers = this.newOffers.filter(offer => offer.bookingID !== booking.id);
      this.recipientBookings = this.recipientBookings.filter(rp => rp.id !== booking.id);

      realtime_booking.ordered = realtime_booking.ordered.filter(pro => pro.id === proID);

      this.providerAcceptedBookings = this.providerAcceptedBookings.concat(realtime_booking);

      this.sendUserAction();

      this.checkClientCalendarFilledDays();

    },

    async handleOfferLimitIsLoaded (room, booking) {
      this.offerLimitLoadedMessage = "Tarjoukset jo lähetetty, olet valitettavasti myöhässä!"
      setTimeout(() => {
        this.offerLimitLoadedMessage = null;
      }, 3000);
      await providerService.removeProviderBooking(this.userIsProvider.id, booking.id);

      this.providerBookings = this.providerBookings.filter(p_booking => p_booking.id !== booking.id);
      await this.updateChatNavCounter(room);


      if (this.providerBookings.length < 1) {
        this.$router.push('/')
      }
    },

    async handleCreateOffer (offer, booking) {
      this.sendUserAction();
      console.log("Offer price is in App - " + booking.user.username);

      const item = await recipientService.getBookingById(booking.id);
      booking.status = "offered";
      booking.offers = booking.offers.concat(offer);

      await recipientService.updateRecipient(booking.id, {status: "offered"});

      this.providerBookings = this.providerBookings.map(pbooking => pbooking.id === booking.id ? booking : pbooking);


      if (this.providerBookings.length < 1) {
        this.$router.push('/')
      }

    },
    handleUpdateBookingDate_ms (booking, date, created, date_ms) {
      console.log("Date_ms " + date_ms);
      console.log("Date_ms booking id " + booking.id);
      const bookingEdited = this.recipientBookings.find(bk => bk.id === booking.id);
      bookingEdited.created = created;
      bookingEdited.created_ms = date_ms;
      bookingEdited.date = date;
      this.recipientBookings.map(item => item.id === booking.id ? bookingEdited : item);
    },
    handleUpdateProChatNav () {
      console.log("Initializing nav chatters...")
      this.initNavChatters();
    },
    callback (response) {
      // This callback will be triggered when the user selects or login to
      // his Google account from the popup
      console.log("Handle the response", response)
    },
    // kustuta () {
    //   window.localStorage.removeItem('newInlineMessage');
    // },
    handleShowCreatedProvider (provider) {
      this.proTimeCreditLeft = 30;
      this.userIsProvider = provider;
      this.proDescription = provider.description;
    },
    // removeChatnavUser (item) {
    //   if (confirm("Oletko varmaa, että haluat poistaa chat käyttäjän?") === true) {
    //     console.log("You pressed OK!")
    //
    //     this.chatParticipants = this.chatParticipants.filter(member => member.name !== item.name);
    //
    //   } else {
    //     console.log("You canceled!")
    //   }
    //
    // },
    removeExpiredRecipientBookings () {
      console.log("Aaaaaaaaaaaaaaaaa")
      this.recipientBookings.forEach(rp => {
        // additional time + 300000
        console.log("Recipient bookings time " + (rp.created_ms - new Date().getTime()))
        if ((rp.created_ms ) - new Date().getTime() >= 0) {
          console.log("booking " + rp.header + " is valid!")
          if (rp.image) {
            rp.image.forEach(img => {
              console.log("Images created ## " + img._id);
            })
          }

        } else {
          //this.o = rp.offers;
          console.log("Booking " + rp.header + " is not valid anymore!")

          this.handleRemoveBookingWithOffers(rp, rp.offers);
        }
      })

    },

    removeExpiredConfirmedBookings () {
      console.log("Confirmed aaaaaaaaaaaaaaaaaaaaaaaaaaaa ")
      this.providerAcceptedBookings.forEach(pab => {
        const bRoom = pab.ordered[0].yritys + pab.user.username;
        if ((pab.created_ms) - new Date().getTime() > 0) {

          console.log("Confirmed booking " + pab.header + " is valid! "  + " room " + bRoom);
        } else {
          console.log("Confirmed booking " + pab.header + " is not valid anymore!")
          this.handleArchiveClientSideBooking(pab, bRoom)
        }
      })
    },
    mapSearchReset () {
      this.mapSearchData = null;
    },
    handleUpdateProTimeCredit (timeLeft) {
      this.proTimeCreditLeft = timeLeft;
      this.isAccessTerminated = false;
    },
    handleAddSlide (image, size) {
      this.proImages = [
        ...this.proImages,
        image
      ]
      //const upload = await imageService.createProRefImg(this.userIsProvider.id, data);
      //this.proImages.push(img);
    },
    handleRemoveSlide (imageID, index) {
      this.proImages = this.proImages.filter((img, inx) => inx !== index)

      //imageService.removeProRefImage(imageID, this.userIsProvider.id);
    },
    handleAddFirstImageRecipientBookings (img, bookingID) {

    },
    handleAddImageRecipientBookings (img, id) {

      // this.recipientImages = [
      //     ...this.recipientImages,
      //     img
      // ]
      console.log("GGGGGGGGGGGGGGGGGGGGGG")
      const booking = this.recipientBookings.find(rb => rb.id = id);
      booking.image = booking.image.concat(img);
      // if (booking.image !== null) {
      //   booking.image = booking.image.concat(img);
      // } else {
      //   booking.image = img;
      // }

      this.recipientBookings.map(item => item.id === id ? booking : item);
    },
    async removeRoom_conversation_images (room) {
      const chat_messages = await conversationService.getRoomMessages(room);
      for (let message in chat_messages) {
        console.log("Chat_message " + chat_messages[message].content.body);
        if (chat_messages[message].is_db_image) {
          //await imageService.removeRoomChatImage(chat_messages[message].imgID)
          await awsUploadService.deleteImage(chat_messages[message].imgID, chat_messages[message].key);
        }
      }
      await conversationService.deleteRoomMessages(room);
      await chatMemberService.removeChatMembersRoom(room);
    },
    // Remove all bookings and included (form done bookings)
    async handleRemoveAllFormBookingsByClient (room) {
      let unit = null;
      console.log("Do we remove chatroom and messages, images?? ROOM " + room );
      console.log("ChatParticipants length " + this.chatParticipants.length);

      for (let cp in this.chatParticipants) {

        if (this.chatParticipants[cp].room === room) {
          console.log("CP handled ---- " + this.chatParticipants[cp].room)
          let _cp = this.chatParticipants[cp];
          if (_cp.same_room_counter > 1) {
            console.log("More than 1 - ")
            await chatuserService.reduceCounter(room);
            this.chatParticipants[cp].same_room_counter -= 1;
          } else {
            console.log("Removing room " + room)
            this.chatParticipants = this.chatParticipants.filter(cp => cp.room !== room);
            //await chatMemberService.removeChatMembersRoom(room);
            await this.removeRoom_conversation_images(room);
          }
          return
        }
      }

    },
    // Removing all bookings under offers ( from form )
    async handleRemoveBookingWithOffers (booking, offers) {

      offers.forEach(o => {
        console.log("---OFFER " + o.provider.user.username);
      })
      booking.ordered.map(ord => {
        console.log("Ord " + ord.user.username);
      });

      console.log("Booking image " + booking.image);


      if (booking.image !== null) {
        for (let item = 0; item < booking.image.length; item ++) {
          const image = booking.image[item];
          console.log("Image to delete ## key " + image.key);
          await awsUploadService.deleteImage(image.id, image.key);
        }

      }
      const username = this.user.username;

      let includedRooms = [];
      let includedRoomsWithOffersDone = [];
      //console.log("booking username 2 is " + current_booking.user.username);


      console.log("You pressed OK!")
      let offerArray = [];
      let offerSenders = [];

      let providerIDArray = [];
      let allMatchedProviders = [];

      //const cBooking = await recipientService.getBookingById(booking.id)

      if (booking) {
        allMatchedProviders = booking.ordered

        offerArray = booking.offers;


      }



      console.log("Offer array length " + offerArray.length);

      console.log("All matched providers length " + allMatchedProviders.length);

      for (let pro in allMatchedProviders) {
        console.log("X " + pro)
        console.log("Yritys " + allMatchedProviders[pro].yritys)
        console.log("zzzz " + allMatchedProviders[pro].user.id)
        console.log("Room ------ " + allMatchedProviders[pro].yritys + username);
        includedRooms = [
          ...includedRooms,
          {id: allMatchedProviders[pro].user.id, room: allMatchedProviders[pro].yritys + username}
          //allMatchedProviders[pro].yritys + username
        ]
        await this.handleRemoveAllFormBookingsByClient(allMatchedProviders[pro].yritys + username);
        await providerService.removeProviderBooking(allMatchedProviders[pro].id, booking.id);


      }


      for (let sender in offerArray) {

        includedRoomsWithOffersDone = [
          ...includedRoomsWithOffersDone,
          offerArray[sender].yritys + username
        ]
        console.log("----------- " + offerArray[sender].provider.user.id);
        console.log("-+-+-+-+- " + offerArray[sender].provider);
        if (offerSenders.id !== offerArray[sender].provider.user.id) {
          offerSenders = offerSenders.concat({id: offerArray[sender].provider.user.id, room: offerArray[sender].room})
        }

        await providerService.removeProviderBooking(offerArray[sender].provider.id, booking.id);
      }

      socket.emit("notice about cansel order", includedRooms, offerSenders, booking);

      this.recipientBookings = this.recipientBookings.filter(b => b.id !== booking.id);
      //console.log("Required booking id is " + id)
      this.newOffers = [];
      await offerService.deleteBookingOffers(booking.id);
      await recipientService.removeBooking(booking.id);

    },
    async load (data) {
      await imageService.createProRefImg(this.userIsProvider.id, data);
    },
    async handleUpdateGallery (data) {
      console.log("Will be updated!!");

      await imageService.createProRefImg(this.userIsProvider.id, data);

    },
    handleUpdateGalleryRemove (removedSlideIdArray) {
      if (removedSlideIdArray.length > 0) {
        removedSlideIdArray.forEach(async remi => {
          await imageService.removeProRefImage(remi, this.userIsProvider.id);
        })
      }
    },
    wentOut () {
      console.log("Went................")
    },
    isSameId (a, b) {
      return a.value === b.value;
    },
    comp () {
      console.log("Comparing");
      console.log("xxx--xxx " + this.chatParticipants.map(p => p.name))
      console.log("yyyy---yyyy " + this.newMessageList.map(nm => nm.userID))

      const a = [
        { value:"4a55eff3-1e0d-4a81-9105-3ddd7521d642", display:"Jamsheer"},
        { value:"644838b3-604d-4899-8b78-09e4799f586f", display:"Muhammed"},
        { value:"b6ee537a-375c-45bd-b9d4-4dd84a75041d", display:"Ravi"},
        { value:"e97339e1-939d-47ab-974c-1b68c9cfb536", display:"Ajmal"},
        { value:"a63a6f77-c637-454e-abf2-dfb9b543af6c", display:"Ryan"}]
      const b = [
        { value:"4a55eff3-1e0d-4a81-9105-3ddd7521d642", display:"Jamsheer", $$hashKey:"008"},
        { value:"644838b3-604d-4899-8b78-09e4799f586f", display:"Muhammed", $$hashKey:"009"},
        { value:"b6ee537a-375c-45bd-b9d4-4dd84a75041d", display:"Ravi", $$hashKey:"00A"},
        { value:"e97339e1-939d-47ab-974c-1b68c9cfb536", display:"Ajmal", $$hashKey:"00B"}]

      const results = a.filter(({ value: id1 }) => b.some(({ value: id2 }) => id2 === id1))
      console.log("results " + results.length)


      //const isSameId = (a, b) => a.userID === b.userID;
      a.forEach((pp, i) => {
        //console.log("Is same value? " + this.isSameId(pp.value, b[i].value));
      })

    },

    handleUpdateAvatar (info, avatar) {
      console.log("Avatar in app is------------- " + info.key);
      this.avatarObject = info;
      this.showAvatar = avatar;
      //socket.emit("avatar", avatar);
    },

    handleRemoveAvatar () {
      //this.avatar = null;
      this.avatar = {
        name: "avatar.png"
      }
      this.showAvatar = null;
    },

    handleJoinChatPanel (room) {
      window.localStorage.setItem('currentRoom', JSON.stringify(room));
      this.currentChatRoom = room;
      socket.emit("update room", room);
    },

    handleInitializeChat (data) {
      this.currentRoom = data.room;


      const mapRoomContent = {
        useCounter: data.chatData.useCounter,
        isActive: data.chatData.isActive,
        bookingID: data.chatData.bookingID,
        same_room_counter: data.chatData.same_room_counter,
        proID: data.chatData.proID,
        pro: data.chatData.pro,
        // userID: data.chatData.userID,
        // name: data.chatData.username,
        userID: data.chatData.proID,
        name: data.initChatRoom.providerUsername,
        room: data.chatData.room
      }

      //console.log("Init chat room " + data.initChatRoom.pro.user.username)
      console.log("Init chat room " + data.chatData.userID)
      // && cp.userID === data.userID
      if (!this.chatParticipants.some(cp => cp.room === data.chatData.room)) {
        console.log("Ei ole olemas tuba - loome toa " + data.chatData.room);
        if (data.initChatRoom.bookingID !== "0") {

          const roomContent = {
            useCounter: data.chatData.useCounter,
            isActive: data.chatData.isActive,
            bookingID: data.chatData.bookingID,
            same_room_counter: data.chatData.same_room_counter,
            //same_room_counter: updatedCounter,
            proID: data.chatData.proID,
            pro: data.chatData.pro,
            userID: data.chatData.userID,
            name: data.chatData.username,
            room: data.chatData.room
          }

          this.chatParticipants = this.chatParticipants.concat(roomContent);

        } else {

          this.chatParticipants = this.chatParticipants.concat(mapRoomContent);
          //this.chatParticipants = this.chatParticipants.concat(roomContent);
        }

      } else {

        this.chatParticipants.forEach(cp => {
          console.log("On olemas tuba " + data.chatData.room)
          if (cp.room === data.chatData.room) {
            if (data.initChatRoom.bookingID !== "0") {
              console.log("Cp counter " + cp.same_room_counter);
              cp.same_room_counter += 1;
            }
          }
        })


      }

      socket.emit("create room users", data.initChatRoom);

      if (data.initChatRoom.bookingID === "0") {
        this.handleJoinChatPanel(data.chatData.room);
      }
    },


    fromFinal (data) {
      this.info = data
      console.log("Data from final in app: " + data)
    },
    // Create new chat user
    submit(id, username, room) {

      console.log("What===")

      let data = {
        userID: id,
        username: username,
        room: room

      }

      socket.emit("new chat user", data);


    },

    async updateChatNavCounter (room) {
      console.log("ROOOOOOOOOOOM " + room)
      if (this.chatParticipants.length > 0) {
        let cpCounter = this.chatParticipants.findIndex(cp => cp.room === room);
        const chatParticipant = this.chatParticipants[cpCounter];
        //this.CP = this.chatParticipants[cpCounter];
        if (chatParticipant.same_room_counter > 1) {
          console.log("found room counter if > 1 " + chatParticipant.same_room_counter);
          await chatuserService.reduceCounter(room);

          this.chatParticipants[cpCounter].same_room_counter -= 1;
        } else {
          console.log("found room counter < 1 " + chatParticipant.same_room_counter);
          this.chatParticipants = this.chatParticipants.filter(cp => cp.room !== room);

          await this.removeRoom_conversation_images(room);


          // await conversationService.deleteRoomMessages(room);

        }
      }
    },

    socket_updateChatNavCounter (room) {
      console.log("#### ROOM " + room)
      if (this.chatParticipants.length > 0) {
        const participantIndex = this.chatParticipants.findIndex(item => item.room === room);
        let counter = this.chatParticipants[participantIndex].same_room_counter;
        console.log("Counter value before: " + counter);
        if (counter > 1) {
          counter -= 1;
          this.chatParticipants[participantIndex].same_room_counter = counter;
        } else {
          this.chatParticipants = this.chatParticipants.filter(cp => cp.room !== room);
        }
        console.log("Counter value after: " + counter);
      }
    },

    joinServer: function (nickname, id) {
      console.log("Joining server: " + nickname + " ja id: " + id)
      socket.on("get socketID", (id) => {
        console.log("user socket id " + id)
        this.userSocketID = id;

      })
      socket.on("get current credentials", () => {
        socket.emit("current credentials", {
          room: this.currentRoom,
          userID: id,
          username: nickname,
        })

      })
      socket.on("connect user", (id) => {


      })
      socket.on("loggedIn", (data) => {

        this.users = []

        data.users.forEach((user) => {
          for (let i = 0; i < this.users.length; i++) {
            const existingUser =  this.users[i];
            if (existingUser.userID === user.userID) {
              existingUser.connected = user.connected;

              return;
            }
          }


          //user.self = user.userID === this.userSocketID;
          user.self = user.userID === this.loggedUser.id;

          if (!user.self) {
            this.activeUser = user;

          }

          initReactiveProperties(user);
          user.messages = [];
          this.users.push(user);
          //this.users.push({userID: "640d9ec449f4c03dc724b428", username: "nipitiri", messages: []})
        });

        // put the current user first, and sort by username
        this.users.sort((a, b) => {
          if (a.self) return -1;
          if (b.self) return 1;
          if (a.username < b.username) return -1;
          return a.username > b.username ? 1 : 0;
        });


        console.log("Room users: " + data.users.map(us => us.username))

      });
      this.listen();
    },
    listen: function () {
      socket.on("user info", (data) => {


      })

      socket.on("user-action", (action) => {
        if (action.origin !== this.deviceID && !this.processedActions.has(action.id)) {
          this.processedActions.add(action.id);
          this.applyUserAction(action.userId);
        }
      })

      socket.on("init new messages", (data) => {
        data.forEach(d => {
          if (d.status === "unsent") {

            this.newMessageList = this.newMessageList.concat(d);

          }

        })

      })

      socket.on("userOnline", (data) => {
        this.users = []
        socket.on("get socketID", (id) => {
          console.log("user socket id " + id)
          this.userSocketId = id;
        })

        data.users.forEach((user) => {
          for (let i = 0; i < this.users.length; i++) {
            const existingUser =  this.users[i];
            if (existingUser.userID === user.userID) {
              existingUser.connected = user.connected;
              console.log("xxxxxxxxxxxxx--xxxxxxxxxxxxxxx")

              return;
            }
          }



          //user.self = user.userID === socket.userID;
          user.self = user.userID === this.loggedUser.id;

          if (this.currentChatRoom) {
            if (user.userID !== this.loggedUser.id) {
              if (user.room === this.currentChatRoom) {
                this.selectedUser = user;
              }

            }
          } else {
            if (user.userID !== this.loggedUser.id)  {
              this.selectedUser = user;
            }
          }

          this.initReactiveProperties(user);
          user.messages = [];


          if (user.room === this.currentChatRoom) {
            this.users.push(user);
          }

        });

        this.users.sort((a, b) => {
          if (a.self) return -1;
          if (b.self) return 1;
          if (a.username < b.username) return -1;
          return a.username > b.username ? 1 : 0;
        });


      });

      socket.on("user connected", (id, user) => {
        for (let i = 0; i < this.users.length; i++) {
          const user = this.users[i];
          if (user.userID === id) {

            user.connected = true;

            break;
          }
        }
      })

      socket.on("userLeft", (id, user, room) => {
        console.log("User left " + id, user, room)

        for (let i = 0; i < this.users.length; i++) {
          const user = this.users[i];
          if (user.userID === id) {
            user.connected = false;
            break;
          }
        }
      });

      socket.on("new message", async (data) => {
        this.newMessageRoom = data.room

        if (!this.currentChatRoom || this.currentChatRoom !== data.room) {
          this.newMessageTest = true;
          if (!this.newMessageList.some(nml => nml.room === data.room)) {


            this.chatParticipants.forEach(cpf => {
              if (cpf.room === data.room) {
                cpf.isActive = true;
              }
            })

            await conversationService.editStatus(data.id, {status: "unsent"});



            this.newMessageList = this.newMessageList.concat(data);
          }
        }

      })

      socket.on("accept provider", async ({id, booking}) => {

        this.providerBookings = this.providerBookings.concat(booking);
        this.notSeenClientBookings.push(booking);

        this.isRingBell = true;

        setTimeout(() => {
          this.isRingBell = false;
        }, 3000);

      })

      socket.on("map pro search", (data) => {
        this.clientMapSearchData = [
          ...this.clientMapSearchData,
          data
        ]
        if (!this.isMapSearchData) {

        }


      })

      socket.on("set chat_nav" , data => {

        let index = this.chatParticipants.findIndex(i => i.room === data.room);
        console.log("Index ----- " + index);
        this.chatParticipants[index] = data;

        if (!this.chatParticipants.some(participant => participant.room === data.room)) {
          this.chatParticipants = this.chatParticipants.concat(data);
        }

      })


      socket.on("accept recipient booking", async ({booking}) => {
        console.log("BOOOOKING ID " + booking.id)
        let proConfirmedBooking = await recipientService.getBookingById(booking.id);

        const foundObject = this.recipientBookings.find(item => item.id === booking.id);

        console.log("xxx status = " + proConfirmedBooking.status);
        proConfirmedBooking.status = "confirmed";
        //foundObject.status = "confirmed";

        //this.recipientBookings = this.recipientBookings.map(rb => rb.id !== booking.id ? rb : proConfirmedBooking);
        this.recipientBookings = this.recipientBookings.filter(rb => rb.status !== "confirmed" && rb.status !== "completed");
        this.recipientBookings = this.recipientBookings.filter(obj => obj.id !== proConfirmedBooking.id);

        //this.providerAcceptedBookings = this.providerAcceptedBookings.concat(proConfirmedBooking);

        this.providerAcceptedBookings = this.providerAcceptedBookings.concat(proConfirmedBooking);
        this.clientAcceptedBookings = this.clientAcceptedBookings.concat(proConfirmedBooking)

        this.checkClientCalendarFilledDays();

        const messageContent = `${proConfirmedBooking.ordered[0].yritys} on vahvistanut tilauksen " ${booking.header} " !`;
        const reason = "";
        const sender = "admin";
        await this.createNoteToDisplay(booking.id, messageContent, false, reason, sender);

      })

      socket.on("send booking for order", (id, booking, proIdArr) => {
        console.log("Order user id for BELL!!! " + id);
        if (this.user.id === id) {
          this.notSeenClientBookings.push(booking);
          this.providerBookings = this.providerBookings.concat(booking);
          this.isRingBell = true;

          setTimeout(() => {
            this.isRingBell = false;
          }, 3000);
        }

      })

      socket.on("send offer limit is loaded", (room) => {
        this.socket_updateChatNavCounter(room);
      })

      socket.on("send offer", async (booking, offer) => {
        console.log("Offer is here! " + booking.user.username);
        if (this.user.id === booking.user.id) {
          this.newOffers = this.newOffers.concat(offer);

          //this.recipientBookings = await recipientService.getOwnBookings(this.loggedUser.id);
          booking.offers.push(offer)

          this.proRefSlides.push({
            pro: offer.provider.id,
            slides: offer.provider.reference
          })

          this.offers.push(offer);

          const index = this.recipientBookings.findIndex(item => item.id === booking.id);
          this.recipientBookings[index].offers = this.recipientBookings[index].offers.concat(offer)
        }


      })

      socket.on("confirm sent offer", async (userId, booking, confirmedOffer) => {
        console.log("Sent offer is confirmed!, booking id is: " + booking.id);
        console.log("APP USER ID " + userId);

        //if (this.user.id === userId) {
          let bookingConfirmData = [];
          this.providerBookings = this.providerBookings.filter(pb => pb.id !== booking.id);

          let realBooking = await recipientService.getBookingById(booking.id);

          this.confirmedProBookings = this.confirmedProBookings.concat(booking);

          this.checkCalendarFilledDays();
          console.log("xxxxxxx asiakas name " + booking.user.username)
          // TODO Asiakas nimi ei tule läbi!!!
          const messageContent = `Asiakas ${realBooking.user.username} on hyväksynyt sinun tarjoukseen. Merkintä on `;
          const reason = "";
          await this.createNoteToDisplay (booking.id, messageContent, true, reason, booking.user.username);
          console.log("Route name in app. " + this.route.name);

          if (this.route.name === "client-notifications") {

          }
        //}

      })

      socket.on("sent deal done notification", (booking, madeOffer) => {
        console.log("Sended notification about deal done!! " + booking.header + " has made this deal. Accepted offer: " + madeOffer.price + " euroa.");

        this.providerBookings = this.providerBookings.filter(pb => pb.id !== booking.id)
        //this.abortedOfferOrderId = booking.id;

        const messageContent = `Lähettämääsi tarjousta "${booking.header}" ei vahvistettu!`;
        const reason = "";
        const sender = "admin";
        this.createNoteToDisplay(booking.id, messageContent, false, reason, sender);




        if (this.route.name === "client-notifications") {
          // if (this.providerBookings.length < 1) {
          //   this.$router.push('/');
          // }
        }

      })
      socket.on("deal done for rest of" , (id, booking) => {
        // await providerService.removeProviderBooking(id, booking.id);
        // await recipientService.removeProviderData(booking.id, id);
        console.log("ID " + id + "Booking id " + booking.id);

        this.providerBookings = this.providerBookings.filter(pb => pb.id !== booking.id);
        //this.abortedOfferOrderId = booking.id;

        this.notSeenClientBookings = this.notSeenClientBookings.filter(nscb => nscb.id !== booking.id);
        // if (this.providerBookings.length < 1) {
        //   this.$router.push('/');
        // }
      })

      socket.on("sent notice about cansel offer", (room, booking) => {
        console.log("Sended booking ---------- " + booking.header);

        let messageContent = `Tilaus "${booking.header}" on valitettavasti poistettu tilaajan toiven mukaan!`;
        const reason = "";
        const sender = "admin";

        this.createNoteToDisplay(booking.id, messageContent, false, reason, sender);





        //this.socket_updateChatNavCounter(room);  ???

        this.notSeenClientBookings = this.notSeenClientBookings.filter(item => item.id !== booking.id);
        //this.providerBookings = this.providerBookings.filter(pb => pb.id !== booking.id)
        this.isDisableProNotOfferBtns = true;
        this.abortedOfferOrderId = booking.id;
        // if (this.providerBookings.length < 1) {
        //   this.$router.push('/');
        // }
      })

      socket.on("handle rest of providers", (room, booking) => {
        this.notSeenClientBookings = this.notSeenClientBookings.filter(item => item.id !== booking.id)
        //this.providerBookings = this.providerBookings.filter(pb => pb.id !== booking.id);
        this.isDisableProNotOfferBtns = true;
        this.abortedOfferOrderId = booking.id;
        this.socket_updateChatNavCounter(room);
        // if (this.providerBookings.length < 1) {
        //   this.$router.push('/');
        // }
      })

      socket.on("set archived booking", (booking, room) => {
        this.socket_updateChatNavCounter(room);
        //this.providerBookings = this.providerBookings.filter(cp => cp.id !== booking.id);
        this.confirmedProBookings = this.confirmedProBookings.filter(cpp => cpp.id !== booking.id);
        this.checkCalendarFilledDays();
      })

      // socket.on("remove archived chat nav user", ({room, booking}) => {
      //   this.chatParticipants = this.chatParticipants.filter(item => item.room !== room);
      //   this.providerBookingsHistory = this.providerBookings.concat(booking);
      // })

      socket.on("reject map booking by_pro", ({id, room, pro, booking, reason}) => {
        // const foundBooking = this.recipientBookings.find(item => item.id === booking.id);
        //
        // foundBooking.status = "waiting";

        console.log("IDIDID " + id);




        if (id === this.user.id) {
          console.log("PRO " + pro)
          this.recipientBookings = this.recipientBookings.filter(re => re.id !== booking.id);

          this.clientAcceptedBookings = this.clientAcceptedBookings.filter(cab => cab.id !== booking.id);

          this.socket_updateChatNavCounter(room);

          const messageContent = `Valitettavasti ${pro} ei varmistanut tilausta '${booking.header}'!`;
          const rejectReason = reason;
          const sender = pro.yritys;
          this.createNoteToDisplay(booking.id, messageContent, false, rejectReason, sender);
        }







      })

      socket.on("reject form booking by_pro", ({room, booking}) => {
        console.log("# room " + room);
        this.socket_updateChatNavCounter(room);

      })

      socket.on("rejected map booking by_client", ({id, room, booking, reason}) => {
        console.log("Client rejected booking! xxxxxxxx " + id);
        //this.providerBookings = this.providerBookings.filter(pb => pb.id !== booking.id);
        this.notSeenClientBookings = this.notSeenClientBookings.filter(item => item.id !== booking.id);

        this.socket_updateChatNavCounter(room);

        this.isDisableProNotMapBtns = true;
        this.abortedOfferMapId = booking.id;

        const messageContent = `Asiakas ${booking.user.username} on poistanut lähetetty tilauksen "${booking.header}"!`;
        const sender = booking.user.username;
        this.createNoteToDisplay(booking.id, messageContent, false, reason, sender);



      })

      socket.emit("online", (this.currentRoom))
      // this.currentRoom
      socket.on("messages", (data) => {
        this.conversation = data.msg;

      })

      socket.on('image', image => {
        // create image with
        const img = new Image();
        // change image type to whatever you use, or detect it in the backend
        // and send it if you support multiple extensions
        //img.src = `data:image/jpg;base64,${image}`;
        this.imageSrc = `data:image/jpg;base64,${image}`;
        // Insert it into the DOM
      });

      socket.on("display booking_image", (image, bookingID) => {
        //console.log("VVV " + image.blob);
        console.log("BID " + bookingID);
        const index = this.providerBookings.findIndex(bb => bb.id === bookingID);
        console.log(" Added image booking INDEX is " + index)
        //this.providerBookings[index].image.push(image);
        const imageStr = image.bytes;
        const showImage = `data:imageStr/jpg;base64,${imageStr}`;
        const addedImageToDisplay = {
          _id: image.id,
          show: showImage
        }
        this.providerBookings[index].image = this.providerBookings[index].image.concat(addedImageToDisplay);
        // if (this.providerBookings[index].image) {
        //
        //   this.providerBookings[index].image.push(image);
        // }

      })

      socket.on("display edited_booking_image", (imageID, image, bookingID) => {
        //console.log("VVV " + image.blob);
        console.log("BID " + bookingID);

        //this.imageSrc = `data:image/jpg;base64,${image}`;
        const imgToDisplay = `data:image/jpg;base64,${image}`;
        const d_img = {
          _id: imageID,
          show: imgToDisplay
        }
        const index = this.providerBookings.findIndex(bb => bb.id === bookingID);
        console.log("INDEX " + index)
        if (this.providerBookings[index].image) {

          const imgIndex = this.providerBookings[index].image.findIndex(im => im._id === imageID);
          console.log("IMAGE INDEX " + imgIndex)

          this.providerBookings[index].image[imgIndex] = d_img;

        }

      })

      socket.on("stop display booking_image", (imageID, booking) => {
        const delIndex = this.providerBookings.findIndex(item => item.id === booking.id);
        if (this.providerBookings[delIndex].image) {
          const imgIndex = this.providerBookings[delIndex].image.findIndex(ii => ii._id === imageID);
          this.providerBookings[delIndex].image.splice(imgIndex, 1);
        }
      })

      socket.on("show pro ref image", (imageID, proID, display, action) => {
        console.log("Show pro ref image id " + imageID);
        console.log("Show pro id " + proID);
        const showImage = `data:display/jpg;base64,${display}`;
        const image = {
          _id: imageID,
          show: showImage
        }

        const proIndex = this.proRefSlides.findIndex(slide => slide.pro === proID);
        console.log("PRO INDEX " + proIndex);
        const sIndex = this.proRefSlides[proIndex].slides.findIndex(s => s._id === imageID);
        if (action === 'edit') {

          console.log("SLIDE INDEX " + sIndex);
          this.proRefSlides[proIndex].slides[sIndex] = image;
        } else if (action === 'add') {
          this.proRefSlides[proIndex].slides = this.proRefSlides[proIndex].slides.concat(image);
        }
      })
      socket.on("remove pro ref image", (imageID, providerID) => {
        const remi = this.proRefSlides.findIndex(slide => slide.pro === providerID);
        const imgIndex = this.proRefSlides[remi].slides.findIndex(s => s._id === imageID);
        this.proRefSlides[remi].slides.splice(imgIndex, 1);
      })

      socket.on("remove temp_room", (room) => {
        this.chatParticipants = this.chatParticipants.filter(member => member.room !== room);
        if (this.route.name === "live-chat") {
          this.$router.go(-1);
        }
        //this.currentChatRoom = null;
      })

      socket.on("private message", ({ content, chatImg, username, date, from, to }) => {
        console.log("Message in app: " + content.body);
        if (content.msg_status === "file")
          this.imageSrc = `data:chatImg/jpg;base64,${chatImg}`;
        //const cPanelImg = `data:chatImg/jpg;base64,${chatImg}`;
        //console.log("S user " + this.selectedUser)
        this.test = true;
        socket.on("messages", (data) => {
          this.conversation = data.msg;

        })

        for (let i = 0; i < this.users.length; i++) {
          const user = this.users[i];



          const fromSelf = this.userSocketId === from;
          if (user.userID === (fromSelf ? to : from)) {

            this.conversation.push({
              content,
              image: this.imageSrc,
              username: username,
              date,
              userID: user.userID,
              fromSelf
            })

            user.messages.push({
              content,
              date,
              fromSelf,
            })




            if (user !== this.selectedUser) {

              user.hasNewMessages = true;

              this.messageSeen = true;

            }
            break;
          }
        }
      });
    },

    initReactiveProperties (user) {

      user.hasNewMessages = false;
      user.messages = [];
    },


    onSelectUser(user) {
      if (!user.self) {
        this.selectedUser = user
        socket.emit("update room", user.room)
      }


      console.log("----------Tuleb läbi--------" + user.username)
      //this.selectedUser = user;
      this.isNewMessage = false;
      user.hasNewMessages = false;

      this.messageInfo = "";

    },
    noSelectUser () {
      this.selectedUser = null;
      this.currentChatRoom = null;
      window.localStorage.removeItem('currentRoom');
    },

    async handleMessage (content, blob, date) {
      console.log("chat status in the app: " + content.msg_status);
      console.log("Message date here - " + date);
      this.conversation.push({
        content,
        image: blob,
        username: this.loggedUser.username,
        date,
        user: this.loggedUser.username,
        userID: this.loggedUser.id
      })

      const chatRoomIndex = this.chatParticipants.findIndex(i => i.room === this.currentChatRoom);
      this.chatParticipants[chatRoomIndex].isActive = true;

    },
    handleProviderActionConfirm () {
    },





    // async updateUserRoom (message) {
    //   //console.log("Message is " + message.id)
    //   //this.newMessageList = this.newMessageList.filter(msg => msg.id !== message.id);
    //
    //   for (let i = 0; i < this.users.length; i++) {
    //     let user = this.users[i];
    //     if (!user.self) {
    //       this.selectedUser = user;
    //     }
    //   }
    //   //window.localStorage.removeItem('newInlineMessage');
    //   //this.unread = null;
    //   if (message.inline) {
    //     // const unreadMsg = window.localStorage.getItem('newInlineMessage');
    //     // if (unreadMsg) {
    //     //   console.log("Yes, here is unread message!")
    //     //   const unreadMsg = JSON.parse(new_message);
    //     //   this.unread = unreadMessage;
    //     //   // JSON.parse(new_message)
    //     //   //this.newMessagelist =  unreadMessage     //this.newMessageList.concat("Hello");
    //     //
    //     //   this.newMessageList.push(unreadMessage)
    //     // }
    //     await conversationService.editStatus(message.id, {status: "sent"});
    //     this.newMessageList = this.newMessageList.filter(msg => msg.id !== message.id);
    //     //this.newMessagelist = this.newMessageList.filter(nml => nml.id !== )
    //
    //     //this.kustuta();
    //
    //   } else {
    //     await conversationService.editStatus(message.id, {status: "sent"});
    //     this.newMessageList = this.newMessageList.filter(msg => msg.id !== message.id);
    //   }
    //
    //   socket.emit("update room", message.room);
    // },

    async handleFeedbackClient (client) {
      if (this.givenRatingNav) {
        client.rating = this.givenRatingNav;
      }

      this.client = client
      console.log("Feedback client is " + client.id)
      this.rateCustomer = client;
      window.localStorage.setItem('customerFeedback', JSON.stringify(client));

    },
    async getRecipientCompletedBookings (userID) {
      const completedBookings = await clientHistoryService.getClientHistory();
      // && cph.status === "rated"
      this.recipientCompletedBookingsHistory = completedBookings.filter(cph => cph.user.id === userID);
      this.recipientCompletedBookings = completedBookings.filter(cp => cp.user.id === userID && cp.status === "no rated");
    },
    async getProCompletedHistory (userID) {
      const proHistory = await proHistoryService.getProHistory();
      this.proCompletedHistory = proHistory.filter(ph => ph.user.id === userID);
    },


    onPressedLogoBtn () {
      this.selectedUser = null;
      this.currentChatRoom = null;
    },
    onPressedUserIconChildren () {
      window.localStorage.removeItem('selectedChatUser');
    },

    handleSetRoom (room) {
      this.currentChatRoom = room;
      window.localStorage.setItem("currentRoom", JSON.stringify(room));
    },

    updateRoom (item) {
      console.log("Mate id " + item.userID)
      // }
      this.currentChatRoom = item.room;
      window.localStorage.setItem('currentRoom', JSON.stringify(item.room));
      // this.users.forEach(user => {
      // })

      this.selectedUser = this.users.find(current => current.room === item.room && current.userID !== this.loggedUser.id);


      this.newMessageList.forEach(async nml  => {
        if (nml.inline) {
          if (nml.room === item.room) {
            await conversationService.editStatus(nml.id, {status: "sent"});
            this.newMessageList = this.newMessageList.filter(msg => msg.room !== item.room);
          }

        } else {

          if (nml.room === item.room) {
            await conversationService.editStatus(nml.id, {status: "sent"});
            this.newMessageList = this.newMessageList.filter(msg => msg.room !== item.room);
          }

        }
      })

      socket.emit("update room", item.room)


    },

    handleNewMessageNotification () {
      socket.emit("update room", this.newMessageRoom);
    },

    handleActivateBell (state) {
      console.log("Bell bell bell " + state)
    },
    // handleDeActivateBell () {
    //
    // },
    profile () {
      this.$router.push('/profile');
      console.log("Pressed profile")
    },
    history () {
      this.$router.push('/history');
    },
    renderPage () {
      this.$router
          .push({ path: '/chat' })
          .then(() => { this.$router.go() })
    },
    renderDialogPage () {
      this.$router
          .push({ path: '/dialog' })
          .then(() => { this.$router.go() })
    },
    reload: () => {
      this.isRouterAlive = false
      setTimeout(()=>{
        this.isRouterAlive = true
      },0)
    },
    async getUsers() {
      this.users = await userService.getAll()

    },
    async createUser (credentials) {
      console.log("User name is here: " + credentials.username);


      this.submit(credentials.id, credentials.username, (credentials.username + credentials.id))
      window.localStorage.setItem('loggedAppUser', JSON.stringify(credentials))
      this.loggedUser = credentials;
      window.location.replace("/");

    },
    async handleLogin(userData) {
      let user

      console.log("userdata: " + userData.username);

      window.localStorage.setItem('loggedAppUser', JSON.stringify(userData));
      this.loggedUser = userData;
      //this.validateToken();

      let username = userData.username;
      let id =  userData.id;
      let room = username + id

      this.joinServer(username, id);

      if(this.$route.query.redirect) {
        this.$router.push(this.$route.query.redirect)
      }else{
        window.location.replace("/");
      }
    },
    handleLogOut () {

      window.localStorage.removeItem('loggedAppUser');
      window.localStorage.removeItem('selectedChatUser');
      this.loginUser = ''
      this.loggedUser = "";
      this.selectedUser = null;
      socket.emit("user leave");
      this.proTimeCreditLeft = null;

      this.user = null;

      this.$router.push('/');
      //location.reload()

    },

    async handleRated (id, ratingResult, yritys, rate) {
      this.givenRatingNav = rate;
      await clientHistoryService.updateRating(this.rateCustomer.id, {rating: rate});
      await clientHistoryService.updateStatus(this.rateCustomer.id, {status: "rated"});
      this.recipientCompletedBookings = this.recipientCompletedBookings.filter(rcb => rcb.id !== this.rateCustomer.id)

      this.sendUserAction();

      window.localStorage.removeItem('customerFeedback')
      if (ratingResult === "rated") {
        this.ratingResult =  `Olet antanut ${rate.positive} tähteä yritykselle - ${yritys} , kiitos 😊`;
      } else {
        this.ratingResult = `Et antanut tällä kerta palautetta yritykselle - ${yritys}.`;
      }

      setTimeout(() => {
        this.ratingResult = null;
      }, 3000);
    },

    // Setting recipient navbar feedback and chat nav members when completed booking expired
    async handleArchiveClientSideBooking (bookingForFeedback, bookingRoom) {

      socket.emit("archive booking", bookingForFeedback.ordered[0].user.id, bookingForFeedback, bookingRoom);

      this.providerAcceptedBookings = this.providerAcceptedBookings.filter(pab => pab.id !== bookingForFeedback.id)

      this.recipientBookings = this.recipientBookings.filter(b => (b.status !== "confirmed") && b.status !== "completed")

      this.recipientCompletedBookings = this.recipientCompletedBookings.filter(rcb => rcb.id !== bookingForFeedback.id)

      const proHistoryData = {
        header: bookingForFeedback.header,
        address: bookingForFeedback.ordered[0].address,
        date:  bookingForFeedback.date,
        userID: bookingForFeedback.ordered[0].user.id
      }

      const clientHistoryData = {
        status: "no rated",
        header: bookingForFeedback.header,
        proID: bookingForFeedback.ordered[0].id,
        company:  bookingForFeedback.ordered[0].yritys,
        id_number:  bookingForFeedback.ordered[0].ytunnus,
        rating: bookingForFeedback.ordered[0].rating,
        address:  bookingForFeedback.ordered[0].address,
        date:  bookingForFeedback.date,
        professional:  bookingForFeedback.ordered[0].profession,
        userID: bookingForFeedback.user.id
      }

      const complitedClientBooking = await clientHistoryService.updateClientHistory(clientHistoryData);
      const complitedProBooking = await proHistoryService.updateProHistory(proHistoryData);

      //this.recipientCompletedBookings = this.recipientCompletedBookings.concat(complited);
      this.recipientCompletedBookingsHistory  = this.recipientCompletedBookingsHistory.concat(complitedClientBooking);
      this.proCompletedHistory = this.proCompletedHistory.concat(complitedProBooking);

      //this.recipientCompletedBookings.push(complitedClientBooking);
      this.recipientCompletedBookings = this.recipientCompletedBookings.concat(complitedClientBooking);

      // chat members room
      const room = bookingForFeedback.ordered[0].yritys + bookingForFeedback.user.username;

      // Chat members room to remove
      const roomToRemove = this.chatParticipants.find(panel => panel.room === room)


      await this.updateChatNavCounter(room);

      // this.images.forEach(img => {
      //   console.log("Images ## " + img._id);
      //   imageService.cleanAllRecipientImages(img._id)
      // })

      await providerService.removeProviderBooking(bookingForFeedback.ordered[0].id, bookingForFeedback.id);
      await offerService.deleteBookingOffers(bookingForFeedback.id);
      await recipientService.removeBooking(bookingForFeedback.id);
    },
    async calculateImageSize (image) {
      let img = new Image();
      img.src = require(`/server/uploads/pro/${image}`)
      await img.decode();
      let width = img.width;
      let height = img.height;
      return {
        width,
        height,
      }
    },
    async initNavChatters () {
      const foundChatMembers = await chatuserService.getChatUser(this.user.id);
      foundChatMembers.forEach(mate => {
        let member = mate.member.find(m => m.userID !== this.user.id);
        //console.log("Chat room + users id-- " + member.username)
        this.chatParticipants = [
          ...this.chatParticipants,
          {
            id: mate.id,
            useCounter: mate.useCounter,
            isActive: mate.isActive,
            bookingID: mate.bookingID,
            same_room_counter: mate.same_room_counter,
            isOnline: mate.isOnline,
            status: "",
            proID: mate.proID,
            pro: mate.pro,
            userID: member.userID,
            name: member.username,
            room: mate.room
          }
        ]
      })

    },
    async handleUser () {
      const myData = await userService.getUser(this.loggedUser.id);
      this.notes = myData.messages;
      if (myData.avatar.isImage === true) {
        console.log("Is avatar image " + myData.avatar.isImage);
        this.avatar = myData.avatar.imageUrl;
        this.avatarObject = myData.avatar;
      } else {
        this.avatarObject = myData.avatar;
      }
      //this.avatar = require(`/server/uploads/avatar/${myData.avatar.name}`);
    },

    async handleProvider () {
      console.log("Current route " + this.route.name)
      this.proImages = [];
      const pro = await providerService.getProvider(this.loggedUser.id)


      if (pro) {
        this.proTimeCreditLeft = ((pro.proTime - new Date().getTime()) / 86400000).toFixed() < 0 ? 0 : ((pro.proTime - new Date().getTime()) / 86400000).toFixed();
        if (this.proTimeCreditLeft <= 0) {
          this.isAccessTerminated = true;
        }
        this.isProAvailable = pro.isAvailable24_7;
        this.userIsProvider = pro;

        this.proDescription = pro.description;
        pro.reference.forEach((item, id) => {
          console.log("IMMM " + item.imageUrl)
          this.proImages = [
              ...this.proImages,
            {
              _id: item._id,
              key: item.key,
              imageUrl: item.imageUrl
              //image: item.image,
              //name: item.name
            }
          ]

        })



        // if (this.userIsProvider.user.avatar) {
        //   console.log("provider user avatar is " + this.userIsProvider.user.avatar.name);
        //   this.avatar = this.userIsProvider.user.avatar
        // } else {
        //   console.log("No avatar is included")
        // }

        // if (this.userIsProvider.user.avatar.isImage) {
        //   console.log("provider user avatar is image" + this.userIsProvider.user.avatar.imageUrl);
        //   this.avatar = this.userIsProvider.user.avatar.name;
        // } else {
        //   console.log("No user avatar image is included");
        //   this.avatar = this.userIsProvider.user.avatar.imageUrl;
        // }




        console.log("User credit " + this.userIsProvider.credit);
        // Set current credit to user
        this.credit = this.userIsProvider.credit;


        this.providerBookings = pro.booking.filter(uipb => uipb.status !== "confirmed"  &&
            uipb.status !== "completed" && uipb.created_ms - new Date().getTime() > 0);


        // TODO here need atention!
        this.confirmedProBookings = this.userIsProvider.booking.filter(uiph => uiph.status === "confirmed" &&
            uiph.created_ms - new Date().getTime() > 0);
        //this.removeProSideExpiredConfirmedBookings();
        this.checkCalendarFilledDays();

      }

      this.notSeenClientBookings = this.providerBookings.filter(nsb => !nsb.visitors.includes(this.userIsProvider.id));
      this.providerBookings.forEach(pb => {

      })
    },

    checkClientCalendarFilledDays () {
      this.client_filled_days = [];
      this.client_filled = [];
      let clientFilled = null;
      this.providerAcceptedBookings.forEach(pAccepted => {
        if ((pAccepted.created_ms) - new Date().getTime() > 0) {
          this.client_filled_days = this.client_filled_days.concat(pAccepted.onTime);
          pAccepted.onTime.forEach(pRes => {
            console.log("DAY in p accepted:  " + pRes.month);
            if (pRes.monthFrom === new Date().getMonth()) {
              clientFilled = addDays(new Date(), pRes.dayFrom - new Date().getDate())
              //this.filled.push(filledDay);
            } else {
              console.log("WHAT???");
              clientFilled = addDays(new Date(pRes.year, pRes.month, 0), pRes.day);
            }
            this.client_filled.push(clientFilled);
          })
        }
      })
    },

    checkCalendarFilledDays () {
      this.filled_days = [];
      this.filled = [];
      let filledDay = null;

      this.confirmedProBookings.forEach(pab => {
        // Check if confirmed booking is valid and add it to pro calendar
        if ((pab.created_ms) - new Date().getTime() > 0) {
          this.filled_days = this.filled_days.concat(pab.onTime);
          pab.onTime.forEach(res => {
            console.log("DAY " + res.month)
            if (res.monthFrom === new Date().getMonth()) {
              filledDay = addDays(new Date(), res.dayFrom - new Date().getDate())
              //this.filled.push(filledDay);
            } else {
              console.log("WHAT");
              filledDay = addDays(new Date(res.year, res.month, 0), res.day);
            }

            // const filledDay = addDays(new Date(), res.day - new Date().getDate())
            this.filled.push(filledDay);
          })
        } else {
          console.log("SORRY, pro booking is expired!!")
        }


      })
    },

    async handleRecipientBookings () {
      let offers = [];
      let recipientbookings = await recipientService.getOwnBookings(this.loggedUser.id);

      if (recipientbookings.length > 0) {
        // if (recipientbookings[0].user.avatar) {
        //   this.avatar = recipientbookings[0].user.avatar
        //
        // }
        // Get all booking included pro ref images


        recipientbookings.forEach(booking => {
          let providerID;
          let pro = booking.ordered;
          let proSlides = [];
          booking.ordered.forEach(ob => {
            providerID = ob.id;
            proSlides.push(ob.reference);
            if (!this.proRefSlides.some(ps => ps.pro === ob.id)) {
              this.proRefSlides.push({
                pro: ob.id,
                slides: ob.reference
              })
            }

          })
        })

        this.newOffers = [];
        recipientbookings.forEach(booking => {
          this.newOffers = this.newOffers.concat(booking.offers.filter(offer => offer.isNewOffer));
        })

        this.providerAcceptedBookings = recipientbookings.filter(booking => booking.status === "confirmed");

        this.clientAcceptedBookings = recipientbookings.filter(cb => cb.status === "notSeen" || cb.status === "seen" || cb.status === "offered")

        this.checkClientCalendarFilledDays();

        let recipientBookingsForNavChat = recipientbookings.filter(rbc => rbc.status !== "completed");

        this.recipientBookings = recipientbookings.filter(b => (b.status !== "confirmed") && b.status !== "completed")

        console.log("Created booking: " )
        this.removeExpiredRecipientBookings();
        this.removeExpiredConfirmedBookings();
        recipientBookingsForNavChat.forEach(rb => {

          if(rb.ordered.length > 0) {
            let pro = rb.ordered[0].user.username;
            console.log("Pro " + pro);

            let index = rb.ordered[0].room.findIndex(item => item.userID === this.loggedUser.id)
          }
        })
      }
    },
    // Add new booking
    async handleCreateBooking (booking, _image, image) {
      console.log("Booking zone - " + booking.zone);
      booking.ordered = [];
      //const createBookingStatus = await recipientService.updateRecipient(booking.id, {status: "notSeen"});
      let origin = [booking.latitude, booking.longitude];
      let destination = [];
      const providersForBooking = await providerService.getProvidersMatchingByProfession(
          {result: booking.professional}
      )
      console.log("Professional. " + booking.professional)
      //let providerArr = [];
      let proIdArr = [];

      let orderedBookings = [];

      for (let i = 0; i < providersForBooking.length; i++) {
        destination = [providersForBooking[i].latitude, providersForBooking[i].longitude];
        console.log("Pro id " + providersForBooking[i].id);
        if (booking.zone === 0) {
          if (providersForBooking[i].user.id !== this.loggedUser.id) {
            console.log("PRP ID, zone is 0: " + providersForBooking[i].user.id)

            orderedBookings = [
                ...orderedBookings,
                providersForBooking[i]
            ]

            proIdArr = [
              ...proIdArr,
              providersForBooking[i].user.id
            ]
            await recipientService.addProviderData(booking.id, providersForBooking[i].id);
            await providerService.addProviderBooking(providersForBooking[i].id, booking.id);
          }
        } else {
          gMapData.findDistance(origin, destination)
              .then(async (data) => {
                console.log("Data distance: " + data.distance)
                console.log("Data distance type - " + typeof data.distance);

                if (parseInt(data.distance) < booking.zone) {
                  booking.ordered = [
                    ...booking.ordered,
                    providersForBooking[i]
                  ]
                  if (providersForBooking[i].user.id !== this.loggedUser.id) {
                    console.log("PRP ID: " + providersForBooking[i].user.id)
                    proIdArr = [
                      ...proIdArr,
                      providersForBooking[i].user.id
                    ]
                    await recipientService.addProviderData(booking.id, providersForBooking[i].id);
                    await providerService.addProviderBooking(providersForBooking[i].id, booking.id);
                  }

                }
              })
        }


      }
      if (_image) {
        booking.image = [];
        booking.image = booking.image.concat(_image);
        console.log("IMAGE DATA " + image.name)
      }



      console.log("proIdArr length is " + proIdArr.length)
      booking.ordered = orderedBookings;
      const proBooking = await recipientService.getBookingById(booking.id);
      socket.emit("send created booking", proIdArr, proBooking);
      this.recipientBookings = this.recipientBookings.concat(booking);

      //this.clientAcceptedBookings = this.clientAcceptedBookings.concat(booking);

      //console.log("recipientBooking orders length " + this.recipientBookings.ordered.length);
    },
    // Add new booking from map
    async handleCreateMapBooking (booking, proID) {
      const bookingStatus = await recipientService.updateRecipient(booking.id, {status: "notSeen"});

      this.recipientBookings = this.recipientBookings.concat(booking);

      this.clientAcceptedBookings = this.clientAcceptedBookings.concat(booking);
    },
    handleNotifications () {
      this.$router.push('/notification');
    },

    handleExitNotifications (state) {
      console.log("State is: " + state)
      this.isNotification = state;
    },
    handleStatusUpdate (id) {
      this.providerBookings = this.providerBookings.filter(nscb => nscb.id !== id)
      this.handleProvider();
    },


    // Confirmed map booking by provider
    handleConfirmClientBooking (booking) {
      console.log("Handling remove booking..." + booking.id)
      this.providerBookings = this.providerBookings.filter(pb => pb.id !== booking.id);
      this.confirmedProBookings = this.confirmedProBookings.concat(booking);

      this.sendUserAction();

      this.checkCalendarFilledDays();

      if (this.providerBookings.length < 1) {
        //this.$router.push('/');
        this.$router.go(-1);
      }

    },

    async handleRejectProFormBooking (room, booking, providerID) {
      console.log("Provider id " + providerID)
      console.log("booking id " + booking.id)
      await providerService.removeProviderBooking(providerID, booking.id);
      await recipientService.removeProviderData(booking.id, providerID);
      this.providerBookings = this.providerBookings.filter(pb => pb.id !== booking.id);
      await this.updateChatNavCounter(room);
      this.sendUserAction();
      if (this.providerBookings.length < 1) {
        //this.$router.push('/');
        this.$router.go(-1);
      }
    },
    async handleRejectBookingByProNoOffers (booking, room, providerID) {

      console.log("Handling rejecting booking by pro..." + booking.user.id)
      console.log("Ordered user id-- " + providerID);


      await providerService.removeProviderBooking(providerID, booking.id);

      await this.updateChatNavCounter(room);

      this.providerBookings = this.providerBookings.filter(pb => pb.id !== booking.id);
      this.sendUserAction();
      if (this.providerBookings.length < 1) {
        //this.$router.push('/');
        this.$router.go(-1);
      }
    },
    async handleRejectBookingByClientNoOffers (booking, proID, room) {
      console.log("room " + room)
      console.log("user id " + proID)
      console.log("booking header " + booking.header)

      await providerService.removeProviderBooking(proID, booking.id);

      await this.updateChatNavCounter(room);

      this.recipientBookings = this.recipientBookings.filter(re => re.id !== booking.id);

      await recipientService.removeBooking(booking.id);

      this.sendUserAction();
    },

    async handleUpdate (userID) {
      await this.handleUser();
      this.chatParticipants = [];
      await this.initNavChatters();

      await this.handleRecipientBookings();
      await this.handleProvider();

      await this.getRecipientCompletedBookings(userID);
      await this.getProCompletedHistory(userID);
    },

    async validateToken () {

      const loggedUserJSON = window.localStorage.getItem('loggedAppUser')
      if (loggedUserJSON) {
        const user = JSON.parse(loggedUserJSON)
        const tokenValid = await loginService.verifyToken(user.token)
        //console.log("Tokenvalid " + tokenValid.error)
        if (tokenValid.result === "token expired") {
          window.localStorage.removeItem('loggedAppUser')
          this.loggedUser = "";
          this.selectedUser = null;
          window.localStorage.removeItem('currentRoom');
          socket.emit("user leave");

          this.$router.push('/login');
        } else {
          this.loggedUser = user

          console.log("Loged, logged user " + user.id)

          await this.handleUpdate(user.id);





          //this.joinServer(user.username, user.id);
        }
      }

    },

    runEveryMinite () {
      //alert("The minute has passed!!")
      //this.arr.forEach(a => )
      let fromMap;
      if (this.clientMapSearchData.length > 0) {
        if (this.i >= this.clientMapSearchData.length) {
          fromMap = this.clientMapSearchData[this.clientMapSearchData.length - 1]
          this.sentence = "Etsitään " + fromMap.pro + " etäisyys " + fromMap.dist + " km.";
        } else {
          fromMap = this.clientMapSearchData[this.i];
          this.sentence = "Etsitään - " + fromMap.pro + " etäisyys " + fromMap.dist + " km.";


          this.i += 1;
        }

        console.log("Index length " + this.i)

      }

    }
  },
  beforeUnmount() {
    document.removeEventListener("visibilitychange", this.handleVisibilityChange);

    socket.emit("user leave");
    this.selectedUser = null;

    //window.localStorage.removeItem('selectedChatUser');
  },
  computed: {
    isValid() {
      return this.msg.length > 0;
    },

    currentRouteName() {
      return this.$route.name;
    }
  }
}
</script>

<style>
html, body {
  background: linear-gradient(#4c4747, #121215);
  margin: 0;
  padding: 0;
  height: 100%;
  /*min-height: 100vh;*/


  overflow-x: hidden;

  overscroll-behavior: none;
  touch-action: manipulation;

  /*min-width: 100vw;*/

  /*min-height: 100vh;*/



  /*overscroll-behavior: none;*/
  /*touch-action: pan-x pan-y;*/



  /*overflow-y: hidden;*/

  /*width: 100%;*/
  /*height: 100%;*/
  /*margin: 0;*/
  /*padding: 0;*/



  /*overflow-y: hidden;*/

  /*  overflow-y: auto;*/
  /*  background-color: #141414;*/
    /*background-image: url('./assets/247.png');*/

}
body {
  min-height: 100vh;
  width: 100vw;

  /*min-height: calc(100vh + 50px); !* Adjust footer height accordingly *!*/
  /*display: flex;*/
  /*flex-direction: column;*/



  /*overflow-x: hidden;*/
}
* {
  /*margin: 0;*/
  /*padding: 0;*/
  /*box-sizing: border-box;*/
}
#app {
  font-family: Roboto, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;

  color: #dddddd;

  min-width: 100vw;
  min-height: 100vh;

  /*clear: both;*/
  padding-top: calc(100px + env(safe-area-inset-top));
  padding-bottom: 100px;
}

#navbar{

  top: 0;
  left: 0;
  right: 0;
  height: 56px; /* Adjust as needed */

  padding-top: env(safe-area-inset-top);

  box-shadow: 0 1px 4px rgba(0,0,0,0.1);

}
.navHome {
  width: 30px;
  padding: 3px;
}

.navProBell {
  width: 30px;
  margin-top: 5px;
}
.navClientBellDD {

}
.navClientBell {
  width: 30px;
  margin-top: 5px;
}
.navClientBell {
  margin-top: 17px;
  margin-left: 15px;
}

.navChat {
  width: 30px;
  margin-top: 5px;
}
.navFeedback {
  width: 30px;
}

/*28px*/
.responsive-icon {
  /*width: 38px;*/
  /*height: 38px;*/
  font-size: 31px; /* Default size */
}
.responsive-icon:hover {
  /*font-size: 36px;*/
  /*transition: 0.5s;*/

}
.avatarContainer {
  margin: 10px 3px 3px 3px;
}
.navAvatar {
  width: 38px;
  /*height: 38px;*/
  //padding-top: 3px;

  padding: 3px 3px;

  /*border: solid grey;*/
  border-radius: 50%;
}
.navProBellContainer {
  margin: 7px 25px 0 10px;
}
.navClientBellContainer {
  margin: 14px 25px 0 10px;
}
.navChatContainer {
  /*margin: 7px 25px 0 10px;*/
  margin: 3px 25px 0 10px;
}
.navFeedbackContainer {
  margin: 7px 25px 0 10px;
}


.availableDrag {
  position: absolute;
  z-index: 1 !important;
  width: 200px;
  height: 75px;
  background-color: rgb(76, 73, 73);
  opacity: 0.9;
  box-shadow: 0.3em 0.3em 1em rgba(104,101,101,0.6);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: move;
  user-select: none;
  border-radius: 8px;
}

@media (max-width: 768px) { /* Smaller size for tablets */

  .availableDrag {
    position: absolute;
    z-index: 1 !important;
    width: 200px;
    height: 75px;
    background-color: rgb(76, 73, 73);
    opacity: 0.9;
    box-shadow: 0.3em 0.3em 1em rgba(104,101,101,0.6);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: move;
    user-select: none;
    border-radius: 8px;
  }
  .responsive-icon {
    /*width: 33px;*/
    /*height: 33px;*/
    font-size: 26px;
  }
  .navAvatar {
    width: 30px;
    /*height: 27px;*/
    /*border: solid grey;*/
    border-radius: 50%;
  }
  .navProBellContainer {
    margin: 8px 10px 0 10px;
  }
  .navClientBellContainer {
    margin: 14px 10px 0 10px;
  }
  .navChatContainer {
    margin: 7px 10px 0 10px;
  }
  .navFeedbackContainer {
    margin: 7px 10px 0 10px;
  }
}


.available_btn_panel {
  display: flex;
  justify-content: space-around;
}

.small_available_btn_panel {
  font-size: 12px;
  display: none;
  justify-content: space-around;
}


@media (max-width: 480px) {

  .availableDrag {
    position: absolute;
    z-index: 1 !important;
    width: 200px;
    height: 75px;
    background-color: rgb(76, 73, 73);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: move;
    user-select: none;
    border-radius: 8px;
  }
  .available_btn_panel {
    display: none;
    justify-content: space-around;
  }
  .small_available_btn_panel {
    display: flex;
    justify-content: space-around;
  }
  .responsive-icon {
    font-size: 20px;
    /*width: 26px;*/
    /*height: 26px;*/
  }
  .navAvatar {
    width: 30px;
    /*height: 25px;*/
    /*border: solid grey;*/
    border-radius: 50%;
  }
  .navProBellContainer {
    margin: 8px 5px 0 10px;
  }
  .navClientBellContainer {
    margin: 14px 5px 0 10px;
  }
  .navChatContainer {
    /*margin: 7px 5px 0 10px;*/
    margin: 3px 5px 0 10px;
  }
  .navFeedbackContainer {
    margin: 7px 5px 0 10px;
  }
}

.homeBtn {

}
.homeBtn:hover {
  color: lightskyblue;
}

.new-message {
  color: #f75959;
  font-size: 17px;
  font-weight: bold;
}
.no-message {
  color: white;
  font-size: 14px;
}
.user {
  color: #dddddd;
  font-size: 18px;
  padding: 10px;
}
.user:hover {
  color: white;
}
/*.dropdown-item:hover {*/
/*  background-color: red;*/
/*}*/

.pill {
  /*font-size: 16px;*/
}
img.loading {
  width: 50px;
  height: 50px;

  background: transparent url(https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif) no-repeat scroll center center;
}

.info {
  color: white;
  background: cornflowerblue;
  font-size: 20px;
  border: solid #2d6588;
  border-radius: 5px;
  padding: 10px;
  margin-top: 70px;
  margin-bottom: 10px;
}
/*.success {*/
/*  color: white;*/
/*  background: #3ca73c;*/
/*  font-size: 20px;*/
/*  border: solid #0e920e;*/
/*  border-radius: 5px;*/
/*  padding: 10px;*/
/*  margin-bottom: 10px;*/
/*}*/


/*table {*/
/*  color: darkslategrey;*/
/*}*/

span {
  /*background: #48abe0;*/
  /*color: white;*/
  /*padding: 1.5rem;*/
  /*font-size: 1rem;*/
  display: inline-block;
}

span.gentle-hover-shake {
  animation: tilt-shaking 0.25s infinite;
}

span.gentle-tilt-move-shake:hover {
  animation: tilt-n-move-shaking 0.25s infinite;
}

span.strong-tilt-move-shake:hover {
  animation: tilt-n-move-shaking 0.15s infinite;
}

@keyframes tilt-shaking {
  0% { transform: rotate(0deg); }
  25% { transform: rotate(20deg); }
  50% { transform: rotate(0deg); }
  75% { transform: rotate(-20deg); }
  100% { transform: rotate(0deg); }
}

@keyframes tilt-n-move-shaking {
  0% { transform: translate(0, 0) rotate(0deg); }
  25% { transform: translate(5px, 5px) rotate(5deg); }
  50% { transform: translate(0, 0) rotate(0deg); }
  75% { transform: translate(-5px, 5px) rotate(-5deg); }
  100% { transform: translate(0, 0) rotate(0deg); }
}

/* Fluid */
@keyframes move-1 {
  to {
    left: -50%;
  //left: -70%;
  }
}
@keyframes move-2 {
  to {
    left: -20%;
  }
}
#container {
  width: 100%;
  height: 30px;
  overflow: hidden;
  position: relative;
}


.box {
  position: absolute;
  display: inline-block;
  width: 40%;
  /*width: 60%;*/
  font-size: 14px;
  height: 30px;
  color: red;
  animation-duration: 15s;
  animation-iteration-count: infinite;
}
.box:nth-child(1) {
  animation-name: move-1;
  left: 100%;
}

/*.box:nth-child(2) {*/
/*    animation-name: move-2;*/
/*    left: 130%;*/
/*}*/

.bookingRejectMessagePanel {
  width: 30%;
  border: solid #f7c160;

  padding: 14px;
  margin-top: 30px;
  margin-left: 60%;
}

.bookingRejectMessage {
  color: #dca478;
}

.bookingRejectMessageClose {
  cursor: pointer;
  color:greenyellow;
  display: flex;
  justify-content: right;
}

.bookingConfirmedMessagePanel {
  width: 30%;
  border: solid #35bbc7;

  padding: 14px;
  margin-top: 30px;
  margin-left: 60%;
}
.bookingConfirmedMessage {
  color: #dca478;
}
.bookingConfirmedMessageClose {
  cursor: pointer;
  color:greenyellow;
  display: flex;
  justify-content: right;
}

.pop {
  backGround-color: #4c423a;
  color: #ea6523;
  z-index: 99 !important;
  font-size: 14px;
  padding: 12px 20px;
  /*width:30%;*/
  /*height: 300px;*/
  display:flex;
  align-items:center;
  justify-content:center;
  top: 70vh;
  left: 95vw; transform: translate(-50%, -50%);
  position:fixed;
}
.pop-content {
  backGround-color: #4c423a;
  position: fixed;
  color: #ea6523;
  z-index: 99 !important;
  font-size: 14px;
  padding: 12px 20px;
  margin-top: 100px;
  width:20%;
  height: 300px;
  display:flex;
  align-items:center;
  justify-content:center;
  top: 68vh;
  left: 80vw; transform: translate(-50%, -50%);
}

.pop:hover {
  background: #2b2b2b;
  color: #fff;
}

@media only screen and (max-width: 1000px) {
  #app {
    font-family: Roboto, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #dddddd;
    min-width: 100vw;
    min-height: 100vh;
    clear: both;
    padding-top: 100px;
  }


  .pop {
    backGround-color: #4c423a;
    color: #ea6523;
    z-index: 99 !important;
    font-size: 14px;
    padding: 12px 20px;
    width:100px;
    /*height: 300px;*/
    display:flex;
    align-items:center;
    justify-content:center;
    top: 40vh;
    left: 85vw; transform: translate(-50%, -50%);
    position:fixed;
  }
  .pop-content {
    backGround-color: #4c423a;
    position: fixed;
    color: #ea6523;
    z-index: 99 !important;
    font-size: 14px;
    padding: 12px 20px;
    margin-top: 100px;
    width:70%;
    height: 300px;
    display:flex;
    align-items:center;
    justify-content:center;
    top: 50vh;
    left: 50vw;
    /*transform: translate(-50%, -50%);*/

  }
  .bookingRejectMessagePanel {
    width: 95%;

    margin: 50px auto;
  }

  .bookingConfirmedMessagePanel {
    width: 95%;
    margin: 50px auto;
  }

  @keyframes move-1 {
    to {
      left: -85%;
      /*left: -70%;*/
    }

  }
  .box {
    position: absolute;
    display: inline-block;
    width: 90%;
    /*width: 60%;*/
    font-size: 14px;
    height: 30px;
    background: #332D2D;
    color: #f04819;
    animation-duration: 10s;
    animation-iteration-count: infinite;

  }
  .box:nth-child(1) {
    animation-name: move-1;
    left: 100%;
  }

  .footer {
    display: none !important;
  }

}

/*.navbar.navbar-dark.bg-dark{*/
/*  background-color: #AABB55!important;*/
/*}*/

.chat-new-message-provider {
  /*color: #f75959;*/
  /*width: 200px;*/
  color: white;
  /*background: palevioletred;*/
  border: 1px solid orange;
  margin-top: 10px;
  padding: 6px
}
.chat-new-message-client {
  /*color: #f75959;*/
  width: 200px;
  color: white;
  /*background: palevioletred;*/
  border: 1px solid deepskyblue;
  margin-top: 10px;
  padding: 5px 15px 5px 15px;
}
.chat-user-is-provider {
  width: 200px;
  color: orange;
  padding: 5px 15px 5px 15px;
  border: 1px solid orange;
  margin-top: 10px;
  max-width: 230px;
  overflow-x: scroll;
}
/*.chat-user-is-provider:hover {*/
/*  */
/*}*/
.chat-user-is-client {
  /*width: 200px;*/
  color: deepskyblue;
  padding: 5px 15px 5px 15px;
  border: 1px solid deepskyblue;
  margin-top: 10px;
}

/*Hide scrollbar for Chrome, Safari and Opera*/
.chat-user-is-provider::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.chat-user-is-provider {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

.dropdown-menu .dropdown-item:not(disabled):not(.disabled):hover {
  font-weight: bold;
  color: yellow;
  background-color: #746f6f;

}

span {

  /*background: #48abe0;*/
  /*color: white;*/
  /*padding: 1.5rem;*/
  /*font-size: 2rem;*/
  display: inline-block;
}


span.strong-tilt-move-shake-x {
  animation: tilt-n-move-shaking 0.15s;
}

@keyframes tilt-n-move-shaking-x {
  0% { transform: translate(0, 0) rotate(0deg); }
  25% { transform: translate(5px, 5px) rotate(5deg); }
  50% { transform: translate(0, 0) rotate(0deg); }
  75% { transform: translate(-5px, 5px) rotate(-5deg); }
  100% { transform: translate(0, 0) rotate(0deg); }
}
.limit-success {
  color: deepskyblue;
}

.limit-warning {
  color: #f2b74b;
}
.limit-refill {
  color: #eec4b4;
  cursor: pointer;
  text-decoration: underline;
}



/*.disabled {*/
/*  opacity: 0.5;*/
/*  pointer-events: none;*/
/*}*/




.popover {

  backGround-color: #4c423a;
  color: #ea6523;
  z-index: 99 !important;
  font-size: 14px;

  width:300px;
  height: 300px;
  display:flex;
  align-items:center;
  justify-content:center;
  top: 50vh;
  left: 50vw; transform: translate(-50%, -50%);
  position:fixed;


}



.popover-content {
  position: absolute;
  background: #fff;
  border-radius: 6px;
  margin-top: 50px;
  padding: 16px;
  color: #333;
  min-width: 200px;
  text-align: left;
  left: 70vw;
}
.icon-green {
  height: 8px;
  width: 8px;
  border-radius: 50%;
  background-color: #86bb71;
  margin-left: 10px;
  display: inline-block;
}
.icon-red {
  height: 8px;
  width: 8px;
  border-radius: 50%;
  background-color: palevioletred;
  margin-left: 20px;
  display: inline-block;
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: #4c423a;
  border-top: 1px solid #ccc;
  display: flex;
  justify-content: space-around;
  padding: 10px 0;
  box-shadow: 0 -2px 5px rgba(0,0,0,0.1);
}

.bar-button {
  background: none;
  border: none;
  font-size: 16px;
  color: #333;
  flex: 1;
}

.bar-button:hover {
  background-color: #5f5d5d;
}

</style>