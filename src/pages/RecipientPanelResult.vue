<template>


  <MDBContainer v-if="isProviderSelected">
    <recipientFinal
        @cansel:final = handleCanselFinal
        @provider:ordered = orderSuccess
        :proRefSlides = proRefSlides
        :test = test
        :provider = selectedProvider
        :offer = offer
        :proSlides = slides
        :room = room
        :available = availability
        :booking = booking

        :chatusers = chatusers

        :initialize_chat = handleInitializeChat

        :selecteduser = selecteduser
        :messages = messages
        @message = onMessage
        @select = selectUser
        @noSelect = noSelectUser
        @join_chat_panel = handleJoinChatPanel

    />

  </MDBContainer>
  <MDBContainer v-else>
    <div style="display: flex; justify-content: right; padding: 20px;">
      <MDBBtnClose
          white
          style="cursor: pointer;"
          @click="canselResult"
      />
    </div>

    <prompt-panel
        :promptPanelContent = promptPanelContent
        @prompt:no = handlePromptNo
        @prompt:yes = handlePromptYes
    />

<!--    <MDBIcon-->
<!--        style="float:right; cursor: pointer;"-->
<!--        @click="canselResult"-->
<!--        size="3x"-->
<!--    >-->
<!--      <i class="fas fa-undo"></i>-->
<!--    </MDBIcon>-->

    <h2 class="client-result-header">{{t('recipient_result_need_a_pro')}} - {{line}}</h2>

    <h5 v-if="booking.created_ms - new Date().getTime() <= 0 && booking.offers.length < 1" class="expired_date">
      {{t('recipient_result_order_is_expired')}}
    </h5>
    <successMessage
        :message = orderMessage
    />

    <MDBRow style="margin-top: 50px;">
      <MDBCol class="client-result">

        <MDBTable borderless style="font-size: 17px; color: #dddddd; text-align: left;">
          <tbody>
          <tr>
            <td v-if="!isEditDescription">
              <p>{{booking.description}}</p>


            </td>
            <td v-else>
              <MDBRow>

                <MDBCol >
                  <MDBTextarea
                      :label="t('recipient_result_edit_description')"
                      white
                      rows="4" v-model="description"
                      style="font-size: 14px; padding: 20px;"
                  />
                </MDBCol>
                <MDBCol col="1">
                  <div style="display: flex; justify-content: right; cursor: pointer">
                    <MDBBtnClose
                        white
                        @click="isEditDescription = false"
                    />
                  </div>

                </MDBCol>
              </MDBRow>




            </td>
          </tr>
          <tr v-if="booking.offers.length < 1">
            <td v-if="!isEditDescription">
              <MDBBtn outline="info" block size="lg" @click="pressedEditDescription">Muokkaa tehtävän kuvausta</MDBBtn>
            </td>
            <td v-else>
              <MDBBtn outline="info" block size="lg" @click="saveEditedDescription">Tallenna tehtävän kuvaus</MDBBtn>
            </td>
          </tr>
          <tr>
            <td v-if="!isEditDate">
              <p :class="{expired_date: booking.created_ms - new Date().getTime() <= 0 && booking.offers.length < 1}">
                {{bookingDateToDisplay}} &emsp;
                klo &nbsp;
                {{new Date(booking.created).getHours() < 10 ? "0" + new Date(booking.created).getHours() : new Date(booking.created).getHours()}}
                :
                {{new Date(booking.created).getMinutes() < 10 ? "0" + new Date(booking.created).getMinutes() : new Date(booking.created).getMinutes()}}

              </p>
              <MDBBtn v-if="booking.offers.length < 1" block size="lg" outline="info" @click="editDate">
                <span :class="{expired_warning: booking.created_ms - new Date().getTime() <= 0}">{{t('recipient_result_edit_date')}}</span>
              </MDBBtn>
            </td>
            <td v-else>
              <MDBRow>
                <MDBCol col="8">
                  <h4 :class="{expired_date: booking.created_ms - new Date().getTime() <= 0}">
                    {{bookingDateToDisplay}}<br>
                    klo &nbsp;
                    {{new Date(booking.created).getHours() < 10 ? "0" + new Date(booking.created).getHours() : new Date(booking.created).getHours()}}
                    :
                    {{new Date(booking.created).getMinutes() < 10 ? "0" + new Date(booking.created).getMinutes() : new Date(booking.created).getMinutes()}}
                  </h4>

                  <VueDatePicker
                      style="margin-bottom: 20px;"
                      dark
                      v-model="bookingDate"
                      :min-date="new Date()"
                      :placeholder="t('recipient_result_select_date')"
                      @internal-model-change="handleInternalDate"
                      :state="isNoDate ? false : null"
                  >

                  </VueDatePicker>
                </MDBCol>
                <MDBCol col="4">
                  <MDBBtnClose
                      white
                      @click="isEditDate = false"
                      style="float: right; cursor: pointer"

                  />
                </MDBCol>
              </MDBRow>

            </td>

          </tr>

          </tbody>
        </MDBTable>
<!--require(`/server/uploads/${im.name}`)        -->
        <div v-if="booking.offers.length < 1">
          <div v-for="(item, i) in images" :key="i">
            <img
                class="loading"
                style="width: 100%;"
                :src="item.blob ? item.blob : item.imageUrl"
                :alt="item.id"
            />

            <MDBBtn v-if="!isEditPanel" block outline="success" @click="pressEditPanel(i)">{{t('recipient_result_edit_picture')}}</MDBBtn>
            <div class="edit-panel" v-if="isEditPanel && imageIndex === i">
              <error-message :message = wrong_SizeType_Message />
              <MDBRow v-if="booking.offers.length < 1">
                <MDBCol>
                  <MDBBtnClose
                      v-if="!value"
                      white
                      class="close-btn"
                      style="float: right;"
                      @click="closeEditPanel"
                  />
                  <input  id="file-upload" type="file" @change="handleFileChange($event, i)"/>
                  <label  for="file-upload" class="custom-file-upload">
                  <span v-if="value">
                  {{t('recipient_result_edit_order_picture')}}: {{value.name}}

                   </span>
                    <span v-else>{{t('recipient_result_select_new_image')}}</span>
                  </label>
                  <MDBBtn v-if="isEditImage" block color="success" @click="uploadEditedImage(i, item.key)">{{ t('recipient_result_upload_edited_image') }}</MDBBtn>
                  <MDBBtn class="btn" block size="lg" color="danger" @click="removeImg(i, item.key)">{{ t('recipient_result_remove_image') }}</MDBBtn>
                </MDBCol>
                <MDBCol v-if="value">
                  <MDBBtnClose
                      white
                      class="close-btn"
                      style="float: right;"
                      @click="closeEditPanel"
                  />
                  <img
                      style="width:100px; padding-top: 20px;"
                      :src="this.showImage"
                      alt="addEdit"
                  />
                </MDBCol>
              </MDBRow>

            </div>

          </div>
        </div>

        <!--New image-->
        <MDBBtn v-if="!isPressedAddlmage & booking.offers.length < 1" block color="primary" @click="pressedAddImage">{{ t('recipient_result_add_image') }}</MDBBtn>
        <div class="add-panel" v-if="isPressedAddlmage && isAddImagePanel">

          <error-message :message = wrong_SizeType_Message />
          <MDBRow>

            <MDBCol>
              <MDBBtnClose
                  v-if="!value"
                  white
                  class="close-btn"
                  @click="closeAddPanel"
              />
              <input   id="file-upload-x" type="file" @change="handleFileChange($event, i)"/>
              <label  for="file-upload-x" class="custom-file-upload">
                  <span v-if="value">
                  Muokka tehtävän kuvausta: {{value.name}}
+
                   </span>
                <span v-else>Valitse lisää kuva tehtävästä</span>
              </label>
              <MDBBtn v-if="isAddImage" block outline="primary" @click="addAdditionalImage">Tallenna kuva</MDBBtn>
            </MDBCol>
            <MDBCol v-if="value">
              <MDBBtnClose
                  class="close-btn"
                  white
                  @click="closeAddPanel"
              />
              <img
                  style="width:100px"
                  :src="this.showImage"
                  alt="addShow"
              />
            </MDBCol>
          </MDBRow>

        </div>

      </MDBCol>

      <MDBCol lg="6">
        <div v-if="booking_offers.length > 0">
          <div class="ui large form">
            <div class="field">
              <h3 style="margin-bottom: 20px;">{{ t('recipient_result_offers') }}</h3>
              <select style="padding: 20px; background-color: #3c3535; color: lightgrey; font-size: 18px;" id="listOfProviders" v-model="filterResult" @click="addFilter">
                <option value="">{{ t('recipient_result_filter') }}</option>
                <option value="distance">{{ t('recipient_result_filter_by_distance') }}</option>
                <option value="rating">{{ t('recipient_result_filter_by_rating') }}</option>
                <option value="price">{{ t('recipient_result_filter_by_price') }}</option>
              </select>

            </div>

          </div>
          <br>

          <MDBTable  style="font-size: 18px; text-align: center; position: relative;">
            <tbody>
            <tr v-for="offer in booking_offers" :key="offer.id">

              <td>

                <MDBBtn
                    class="provider-selection"
                    outline="info"
                    size="lg"
                    @click="getProviderInfo(offer.provider, offer, 'orange')"
                >

                  {{offer.provider.yritys}} <br>
                  <span style="font-size: 14px;">{{ t('recipient_result_distance') }} {{offer.distance}} km</span><br>

                </MDBBtn>



                <MDBBadge
                    v-if="offer.isNewOffer"
                    color="danger"
                    class="translate-middle p-3"
                    pill
                    notification
                >
                  <span style=" font-size: 14px; ">
                    {{t('recipient_result_new')}} <br>{{offer.price}} eur
                  </span>
                </MDBBadge>
                <MDBBadge
                    v-else
                    color="info"
                    class="translate-middle p-3"
                    pill
                    notification
                >
                  <span style=" font-size: 14px; ">
                    {{offer.price}} eur
                  </span>
                </MDBBadge>

              </td>

            </tr>
            </tbody>
          </MDBTable>

        </div>
        <div v-else>
          <h2 style="width: 100%; margin-top: 17px;">{{ t('recipient_result_waiting_offers') }}</h2>
        </div>

      </MDBCol>

      <MDBBtn block color="danger" size="sm" @click="removeOfferedBookings">{{ t('recipient_result_remove_order') }}</MDBBtn>
    </MDBRow>

<!--    Booking offers {{booking_offers}}-->
<!--  images {{images}}-->

  </MDBContainer>

</template>

<script>
/* eslint-disable */
import {
  MDBBtn, MDBContainer, MDBTable, MDBRow,
  MDBBtnClose,
  MDBCol, MDBTextarea,
  MDBIcon,
  MDBBadge,
}from "mdb-vue-ui-kit";
import dt from '../components/controllers/datetime'
import recipientFinal from '../pages/RecipientPanelFinal'
import successMessage from '../components/notifications/successMessage'
import errorMessage from '../components/notifications/errorMessage'
import dist from '../components/controllers/distance'
import providerService from '../service/providers'
import offerService from '../service/offers'
import imageService from '../service/image'
import awsUploadService from '../service/awsUploads';
import promptPanel from '../components/PromptPanel'
import VueDatePicker from '@vuepic/vue-datepicker';
import '@/css/style.css';
import '@/css/notification.css'
//import socket from "@/socket";
import {ref} from 'vue'
import recipientService from "@/service/recipients";
import { useI18n } from 'vue-i18n';
import socket from "@/socket";
import uploadService from "@/service/image";
import dateFormat from "dateformat";

export default {
  name: "recipient-panel-result",
  props: {
    test: Boolean,
    chatusers: Array,
    proRefSlides: Array,
    selecteduser: null,
    messages: Array,
    loggedInUser: Object,
    booking: null,
    booking_offers: [],
    images: Array,

    bookingTime: null,
    providers: Array,
    confirmedBookings: Array,
    line: String
  },
  data () {
    const { t } = useI18n();
    return {
      t,
      //image: [],
      IMAGE_SIZE: 1000000,
      offer: null,
      chatUser: null,
      //initializeChatRoom: {},
      //chatRoomData: {},
      count: 0,
      //confirmPanel: null,
      promptPanelContent: null,


      wrong_SizeType_Message: null,

      datetime: dt,
      distance: dist,
      selectedProvider: null,
      proSlides: [],

      isProviderSelected: false,
      availability: "",
      orderMessage: null,
      isOrdered: false,
      isEditDescription: false,
      description: this.booking.description,

      isEditDate: false,
      bookingDate:  new Date(this.booking.created),        //null,
      bookingDateToDisplay: this.booking.date,
      //isAddImage: false,
      isAddFirstImage: false,
      isPressedAddlmage: false,
      isAddImage: false,
      isAddImagePanel: false,
      isEditImage: false,


      isUploadImage: false,
      isUploaded: false,
      isImageCreated: false,
      isAddNewImage: false,
      isEditPanel: false,

      value: null,
      imageIndex: 0,
      file: null,
      files: null,
      isImageSelected: false,
      isAdditionalImageSelected: false,
      showImage: null,
      tempImages: [],
      imagesx: [],
      imagesxxx: [],
      room: "",
      roomUserCount: 0,
      filterResult: "",
    }
  },

  components: {
    successMessage,
    errorMessage,
    VueDatePicker,
    promptPanel,
    dist,
    recipientFinal,
    MDBBtn,
    MDBBtnClose,
    MDBContainer,
    MDBTable,
    MDBRow,
    MDBCol,
    MDBTextarea,
    MDBIcon,
    MDBBadge
  },

  methods: {
    handlePromptNo () {
      console.log("Said NO!")
      this.promptPanelContent = null;
    },
    handlePromptYes () {
      console.log("Said YES!");
      this.promptPanelContent = null;
      this.$emit("removeOfferedBooking", this.booking, this.booking.offers);
    },
    editDate () {
      this.isEditDate = true;


    },
    async handleInternalDate () {

      if (this.bookingDate) {
        console.log("new date: " +  new Date(this.bookingDate).getTime());
        this.bookingDateToDisplay = (this.bookingDate.getMonth() + 1) + "/" + this.bookingDate.getDate() + "/" +  this.bookingDate.getFullYear();
        console.log("eeeeee " + (this.bookingDate.getMonth() + 1) + "/" + this.bookingDate.getDate() + "/" +  this.bookingDate.getFullYear());
        const dateInMs = new Date(this.bookingDate).getTime();
        const renewCreated = new Date(this.bookingDate);
        await recipientService.newDate(this.booking.id, {
          year: this.bookingDate.getFullYear(),
          month: this.bookingDate.getMonth(),
          day: this.bookingDate.getDate(),
          hours: this.bookingDate.getHours(),
          minutes: this.bookingDate.getMinutes(),
          date_ms: dateInMs
        })

        const updatedDate = {
          year: this.bookingDate.getFullYear(),
          month: this.bookingDate.getMonth(),
          day: this.bookingDate.getDate(),
          hours: this.bookingDate.getHours(),
          minutes: this.bookingDate.getMinutes()
        }
        //this.isEditDate = false;
        this.$emit("updateBookingDate", this.booking, updatedDate);
      }
      //this.isEditDate = false;
      console.log("Date is handled")
     // console.log("Selected date: " + this.date)
    },
    handleFileChange(e, i) {
      //this.$emit('input', e.target.client[0])
      console.log("i in file change " + i)
      this.imageIndex = i;
      try {

        const files = e.target.files[0]
        console.log('event target client ', e.target.files[0])

        if (files) {
          const tempImage = URL.createObjectURL(files)
          this.tempImages.push(tempImage);
          this.showImage = URL.createObjectURL(files)
          this.file = e.target.files[0];
          this.files = e.target.files[0];

          this.isAddImage = true;
          this.isEditImage = true;
        }

      } catch (err) {
        console.log('Error:', err)
      }

      this.value = e.target.files[0]
      // if (e.target.files[0]) {
      //   this.isImageSelected = true;
      // } else {
      //   this.isImageSelected = false;
      // }
    },
    pressedAddImage () {
      this.isAddImage = false
      this.isEditImage = false;
      this.isEditPanel = false;
      this.isPressedAddlmage = true;
      this.isAddImagePanel = true;
    },
    async addImage () {


    },
    pressEditPanel (index) {
      this.isEditImage = false;
      this.value = null;
      this.imageIndex = index;
      this.isPressedAddlmage = false;
      this.isEditPanel = true;
      this.isAddImagePanel = false
    },
    closeEditPanel () {
      this.isAddImagePanel = false
      this.isEditPanel = false
      this.isEditImage = false;
      this.value = null;
    },
    closeAddPanel () {
      this.isAddImagePanel = false
      this.isPressedAddlmage = false;
      this.value = null;
    },
    async uploadEditedImage (index, key) {

      console.log("Edited image index is: " + index);
      console.log("Edited image key is: " + key);

      this.isEditPanel = false;
      this.isEditImage = false;

      const data = new FormData();
      data.append('file', this.file, this.file.name)

      console.log("Image id " + this.images[index]._id)
      const editImgType = this.file.type;
      if (editImgType ==="image/jpeg" || editImgType === "image/jpg" || editImgType === "image/png" || editImgType === "image/gif") {
        if (this.file.size <= this.IMAGE_SIZE) {
          // const image = await imageService.updateImage(this.images[index]._id, data);
          const editedClientImg = await awsUploadService.editClientImage(this.images[index]._id, key, data);
          console.log("Edited client image key is: " + editedClientImg.key);
          if (editedClientImg) {
            this.$emit("editImage", index, this.images[index]._id, editedClientImg.key, this.showImage);
            // this.images[this.imageIndex] = {_id: this.images[index]._id, blob: this.showImage}
            //
            // this.images.forEach(img => {
            //   console.log("Image name " + img._id)
            // })

            console.log("ORDRED in EDIT pikkus " + this.booking.ordered.length)
            let ordered = [];
            this.booking.ordered.forEach(b => {
              console.log("CVCVCV " + b.user.username);
              ordered = ordered.concat(b.user.id);
            })

            const reader = new FileReader();

            if (this.file) {
              reader.onload = (e) => {
                const bytes = new Uint8Array(e.target.result);
                console.log("FILES.... " + this.files)

                //const image_id = editedClientImg.id;

                socket.emit("display edited booking image", this.images[index]._id, bytes, this.booking.id, ordered)

              };
              reader.readAsArrayBuffer(this.files);
            }

            console.log("New image id is " + this.images[index]._id)
            this.imgId = this.images[index]._id;
            this.file = null;

            this.isEditPanel = false;


            this.closeAddPanel();

          }
        } else {
          this.isEditPanel = true;
          this.closeAddPanel();
          this.wrong_SizeType_Message = "Väärä formaati. Kuva pitäisi olla jpeg, jpg, png tai gif formaatissa!";
          setTimeout(() => {
            this.wrong_SizeType_Message = null;
          }, 3000);
        }

      }else {
        this.isEditPanel = true;
        this.closeAddPanel();
        this.wrong_SizeType_Message = "Kuvan maximi koko on oltava 3 MB!";
        setTimeout(() => {
          this.wrong_SizeType_Message = null;
        }, 3000);
      }


    },

    // Add booking image
    async addAdditionalImage () {
      this.value = null;
      //this.file = null;
      this.isAddImagePanel = false;
      this.isAddImage = false;
      this.isPressedAddlmage = false;
      const data = new FormData();

      data.append('file', this.file, this.file.name)
      console.log("IMG size - " + this.file.size);

      console.log("Image type_ " + this.file.type);

      const type = this.file.type;
      if (type ==="image/jpeg" || type === "image/jpg" || type === "image/png" || type === "image/gif") {
        console.log("Pildi formaat on OK")
        if (this.file.size <= this.IMAGE_SIZE) {

          const reader = new FileReader();

          //const img = await imageService.create(data);
          // {userId: this.booking.id},
          const img = await awsUploadService.uploadClientImage(data);

          if (img) {
            console.log("AWS image id: " + img.id);
            console.log("AWS image key: " + img.key);
            //await recipientService.addImage(this.booking.id, img.imgCreated._id)
            await recipientService.addImage(this.booking.id, img.id)

            // const _image = {
            //   _id: img.imgCreated._id,
            //   blob: this.showImage
            // }
            const _image = {
              _id: img.id,
              key: img.key,
              blob: this.showImage
            }
            this.$emit("addImage", _image, this.booking.id);
            console.log("ORDRED pikkus " + this.booking.ordered.length)
            let ordered = [];
            this.booking.ordered.forEach(b => {
              console.log("CVCVCV " + b.user.username);
              ordered = ordered.concat(b.user.id);
            })

            reader.onload = (e) => {
              const bytes = new Uint8Array(e.target.result);
              console.log("FILES IN UPLOAD.... " + this.files)

              // const image_bytes = {
              //   id: img.imgCreated._id,
              //   bytes: bytes
              // }
              const image_bytes = {
                id: img._id,
                bytes: bytes
              }
              socket.emit("display booking image", image_bytes, this.booking.id, ordered)

            };
            reader.readAsArrayBuffer(this.files);
            // image_id, bytes, this.booking.id, ordered
            //socket.emit("display booking image", new_image, this.booking.id, ordered)
          }
        } else {

          console.log("Pildi suurus peab olema väiksem kui 1 MB");
          this.isAddImagePanel = true
          this.isPressedAddlmage = true;
          this.wrong_SizeType_Message = "Kuvan maximi koko on 3 MB.";

          setTimeout(() => {
            this.wrong_SizeType_Message = null;
          }, 3000);
        }
      } else {
        console.log("Pildi formaat on FAKE")
        this.wrong_SizeType_Message = "Väärä formaati. Kuva pitäisi olla jpeg, jpg, png tai gif formaatissa!";
        setTimeout(() => {
          this.wrong_SizeType_Message = null;
        }, 3000);
      }

    },
    async removeImg (id, key) {
      //this.value = null;
      if (!this.images[id].blob) {
        console.log("removed image is blob")

      }

      console.log("removable image id is " + this.images[id]._id)
      console.log("Removing image by key: " + key);
      await recipientService.removeImage(this.booking.id, this.images[id]._id);
      //await imageService.remove(this.images[id]._id, this.booking.id);
      await awsUploadService.deleteImage(this.images[id]._id, key);
      let bIDs = [];

      this.booking.ordered.forEach(bo => {
        bIDs = bIDs.concat(bo.user.id);
      })

      socket.emit("stop display booking image", this.images[id]._id, this.booking, bIDs);

      this.$emit("removeImage", id);

      this.isEditPanel = false;

    },
    getDistance () {
      //console.log("Distance +++++??? " + dist.distance())
      console.log("sss " + dist.test())
    },
    selectUser (user) {
      this.$emit('select', user);
    },
    noSelectUser () {
      this.$emit("noSelect");
    },
    onMessage (content, date) {
      this.$emit("message", content, date);
    },
    // initializeChat () {
    //   this.$emit("initializeChat", {
    //     initChatRoom: this.initializeChatRoom,
    //     chatData: this.chatRoomData
    //   });
    // },
    handleJoinChatPanel () {
      console.log("Final info in result pressed ");

      this.$emit("joinChatPanel", this.room);
    },

    async pressAddFirstImage () {
      this.isAddFirstImage = true;
      this.imageIndex = 0;
    },

    pressAdditionalImage (index) {
      //this.imageIndex = this.booking[0].image.length - 1;
      this.isAddImage = true;
      this.imageIndex = this.images.length;
      //this.imageIndex = "new";
      //this.isAddNewImage = true;

      console.log("Images index = " + this.imageIndex);
      this.isAddImage = true;
    },



    // async uploadFirstImage (index) {
    //   const data = new FormData();
    //   this.isUploadImage = true;
    //   this.imageIndex = 0;
    //   //this.isUploaded = true;
    //   //isUploaded && imageIndex === i
    //   data.append('file', this.file, this.file.name)
    //   console.log("IMG size - " + this.file.size);
    //   //const img = await imageService.create(data);
    //   //console.log("ABOUT: " + img);
    //   //await recipientService.addImage(this.booking.id, img.imgCreated._id);
    //
    //   // if (img) {
    //   //   this.file = null;
    //   //
    //   //   const image = {
    //   //     _id: img.imgCreated._id,
    //   //     image: img.imgCreated.image,
    //   //     name: img.imgCreated.name
    //   //   }
    //   //
    //   //   this.$emit("addImage", image);
    //   //
    //   //   this.imageIndex = 0;
    //   //
    //   //   this.isImageSelected = false;
    //   //   this.isUploaded = true;
    //   //
    //   //
    //   // }
    //
    //
    //
    // },

    // Ei toimi ilmselt!!!
    async uploadAdditionalImage () {
      this.isAdditionalImageSelected = false;
      this.isAddImage = false;
      this.value = null;
      //this.isEditImage = false;
      //this.imageIndex = null;
      //this.imageIndex = this.booking[0].image.length - 1;
      console.log("Image index index " + this.imageIndex)
      const data = new FormData();

      this.isUploadImage = true;
      //this.imageIndex = 0;
      this.isUploaded = true;
      //isUploaded && imageIndex === i
      data.append('file', this.file, this.file.name)
      const img = await imageService.create(data);
      await recipientService.addImage(this.booking.id, img.imgCreated._id);

      if (img) {
        //this.imgId = img.imgCreated._id;
        this.file = null;
        //this.showImage = null;
        //this.value = null;

        //console.log("xxx " + img.imgCreated._id)
        //console.log("Image itself " + img.imgCreated.image)
        //await recipientService.addImage(this.booking[0].id, img.imgCreated._id);
        const image = {
          _id: img.imgCreated._id,
          image: img.imgCreated.image,
          name: img.imgCreated.name,
          blob: this.showImage,
        }

        //this.imagesxxx.push(image);

        this.$emit("addImage", image);

        //this.images.push(image);

        // const booking = await recipientService.getBookingById(this.booking[0].id);
        //
        // setTimeout( async () => {
        //   booking[0].image.forEach(im=> {
        //     this.images.push(im)
        //   })
        //   //this.images = this.images.concat(booking[0].image)
        // }, 500)


        /*const booking = await recipientService.getBookingById(this.booking[0].id);

        this.imagesxxx = booking[0].image
*/

        this.isImageSelected = false;
        this.isUploaded = true;



        //this.imageIndex = null;
      }



    },

    pressedEditDescription () {
      this.isEditDescription = true
      console.log("Descripton: " + this.description);
    },
    saveEditedDescription () {
      this.isEditDescription = false;
      const description = {
        description: this.description
      }
      this.$emit("editDescription", this.description);
      recipientService.editDescription(this.booking.id, description)
      //this.description = "";
    },
    cancelEditDescription () {
      console.log("Is here something happening??")
    },
    providerGetBooking (id, booking) {
      //const id = this.provider.user.id;
      console.log("Sended to user id... " + id)
      socket.emit("accept provider", {
        id,
        booking: booking
      })
    },

    // For just confirm provider
    async orderSuccess (prov) {
      console.log("Include offers? " + this.booking.isIncludeOffers)
      if (this.booking.isIncludeOffers) {
        this.canselResult();

        // TODO teised offerid maha võtta

        console.log("## bef " + this.booking.ordered.length)



        this.$emit("offer_confirmed", this.booking , prov.id);
        console.log("## aft " + this.booking.ordered.length)
        const pro = await providerService.getProvByProvId(prov.id);

        console.log("Offer confirmation user id " + pro.user.id);

        const providerID = {
          providerID: this.selectedProvider.id
        };

        await recipientService.updateRecipient(this.booking.id, {status: "confirmed"});

        //const res = await recipientService.getBookingById(this.booking.id);

        const recipientId = this.booking.id;


        console.log("Username here???? " + this.booking.user.username);


        let bookingOffers = [];
        let offerMakers = [];
        let ampIDs = [];
        let restProsNoOfferDone = [];

        if (this.booking) {
          bookingOffers = this.booking.offers;
          const allMatchedPros = this.booking.ordered;
          for (let id in allMatchedPros) {

            if (allMatchedPros[id].user.id !== pro.user.id) {


              ampIDs.push(allMatchedPros[id])

              // console.log("Removing this pro from DB: " + allMatchedPros[id].user.id)
              // await providerService.removeProviderBooking(allMatchedPros[id].id, this.booking.id);
              // await recipientService.removeProviderData(this.booking.id, allMatchedPros[id].id);



            }
          }
          for (let i in bookingOffers) {
            if (bookingOffers[i].room !== this.room) {
              await offerService.removeBookingOffer(bookingOffers[i].id, this.booking.id);
            }
          }
        }

        let madeOffer = {};

        for (let sender in bookingOffers) {

          console.log("Offer maker id heeeeeere " + bookingOffers[sender].provider.user.id);



          if (bookingOffers[sender].provider.user.id !== pro.user.id) {
            //offerMakers = offerMakers.concat(bookingOffers[sender].provider.user);

            offerMakers = offerMakers.concat(bookingOffers[sender]);

            //offerMakers = offerMakers.concat(bookingOffers[sender]);
            console.log("eeeeeeeeeeeeeeeeeeeee " + bookingOffers[sender].provider.user.id)

            await providerService.removeProviderBooking(bookingOffers[sender].provider.id, this.booking.id);
            await recipientService.removeProviderData(this.booking.id, bookingOffers[sender].provider.id);

          } else {
            madeOffer = bookingOffers[sender];
          }

        }
        console.log("offerMakers length " + offerMakers.length)
        ampIDs.forEach(ai => {

          if (!offerMakers.some(om => om.provider.id === ai.id)) {
            restProsNoOfferDone.push(ai);
          }
          // offerMakers.forEach(om => {
          //   if (ai !== om.provider.user.id) {
          //     restProsNoOfferDone.push(ai);
          //   }
          // })
        })

        console.log("ampIDs " + ampIDs.map(mi => mi.id))
        console.log("REST OF PROS " + restProsNoOfferDone.map(ma => ma));

        for (let id in restProsNoOfferDone) {
          console.log("Test id " + restProsNoOfferDone[id].id)
          await providerService.removeProviderBooking(restProsNoOfferDone[id].id, this.booking.id);
          await recipientService.removeProviderData(this.booking.id, restProsNoOfferDone[id].id);
        }

        // TODO kui tellija tilab yrityse siis tellija peab teiste juures kustuma!! Ordered juures peavad kustuma teised id:d

        socket.emit("confirm offer", pro.user.id, this.booking, madeOffer);


        socket.emit("deal done notification", offerMakers, restProsNoOfferDone, this.booking, madeOffer);

      } else {
        this.isProviderSelected = false;

        console.log("No booking with offers here!")

      }

    },
    // For price offers
    async orderSuccess_standing (prov) {
      this.isProviderSelected = false;

      console.log("Provider id " + prov.id);
      console.log("Recpient id: " + this.booking.id);

      this.canselResult();

      this.$emit("offer_confirmed", this.booking);
      const providerID = {
        providerID: this.selectedProvider.id
      };

      const createBookingStatus = await recipientService.updateRecipient(this.booking.id, {status: "confirmed"});

      const recipientId = this.booking.id;
    },
    async getProviderInfo (provider, offer, marker) {
      this.proSlides = [];
      this.offer = offer;
      this.selectedProvider = provider
      if (this.booking.isIncludeOffers) {
        if (offer.isNewOffer) {
          this.$emit("editBookingOfferStatus", offer)
        }
      }
      provider.reference.forEach(slide => {
        this.proSlides = [
            ...this.proSlides,
            slide
        ]
      })
      // provider.reference.forEach(slide => {
      //   this.proSlides = [
      //       ...this.proSlides,
      //     {
      //       id: slide.id,
      //       size: '1400-933',
      //       src: require(`/server/uploads/pro/${slide.name}`),
      //       thumb: require(`/server/uploads/pro/${slide.name}`),
      //       subHtml: `<div class="lightGallery-captions">
      //           <h2>Terve</h2>
      //
      //       </div>"`
      //     }
      //   ]
      // })
      this.availability = marker;
      this.isProviderSelected = true;


      let room = "";
      let username = "";

      if (this.chatUser) {
        username = this.chatUser.username;
        room = provider.yritys + username;
        this.room = room;
      }

    },
    async roomToDb (id, room) {
      await providerService.addRoom(id, room)
    },
    addFilter () {
      const filterListedProviders = document.getElementById("listOfProviders")

      filterListedProviders.addEventListener("change", (event) => {
        console.log("Filtered provider: " + event.target.value);
        this.$emit("filter_provider", event.target.value);

      })
    },
    handleCanselFinal (result) {
      this.isProviderSelected = result;
    },
    canselResult () {
      this.$emit('cansel:result', false)
    },
    async removeOfferedBookings () {

      if (confirm("Oletko varmaa, että haluat poistaa tilauksen!?") === true) {

        this.$emit("removeOfferedBooking", this.booking, this.booking.offers);

      } else {
        console.log("You canceled!")
      }
    },
  },

  async mounted() {
    const loggedUserJSON = window.localStorage.getItem('loggedAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      this.chatUser = user;

    }


  }
}
</script>


<style scoped>
.edit-panel {
  border: solid grey;
  padding: 20px;
  margin: 20px 0 20px 0;
}
.add-panel {
  border: solid grey;
  padding: 20px;
  margin: 20px 0 20px 0;
}
.add-additional-panel {
  border: solid blue;
}
.btn {
  padding: 20px;
  margin: 20px 0 20px 0;
}
.close-btn {
  float: right;
  padding: 20px;
}
img.loading {
  width: 100%;
  height: 400px;
  background: transparent url(https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif) no-repeat scroll center center;
}

input[type="file"] {
  display: none;
}
.custom-file-upload {
  width: 100%;

  color: white;
  font-size: 18px;
  background-color: #87958e;
  border: 1px solid #ccc;
  display: inline-block;
  padding: 20px 12px;
  margin-bottom: 0;
  cursor: pointer;
}
.imageSection {
  margin-bottom: 20px;
}
.provider-selection {
  width: 300px;
  padding: 20px;
  background-color: darkslategrey;
  border: solid #4c4949;
  color: #f0eeee;
  font-size: 150%;
}

@media only screen and (max-width: 1000px) {
  .provider-selection {
    width: 250px;
    padding: 20px;
    background-color: darkslategrey;
    border: solid #4c4949;
    color: #f0eeee;
    font-size: 150%;
  }
}

select option {
  border: solid red;
}
.expired_warning {
  color: palevioletred;
}
.expired_date {
  color: palevioletred;
  border: 1px solid #F05C5CFF;
  margin-top: 17px;
  padding: 7px;
}

.confirmation {
  width: 80%;
  height: 200px;
  margin: auto;
  color: white;
  background: #a5a1a1;
  font-size: 20px;
  border: solid #6e716e;
  border-radius: 5px;
  padding: 10px;
  /*margin-bottom: 10px auto;*/
}

</style>