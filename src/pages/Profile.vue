<template>
  <div >
    <MDBContainer style="margin-top: 70px;">

      <div v-if="!userData" class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <div v-else>
        <MDBRow>
          <file-error
              :message = fileSizeError
          />
          <file-error
              :message = fileTypeError
          />
          <file-error
              :message = emailErrorMessage
          />
          <MDBCol lg="4">

            <MDBCol lg="6">

              <MDBRow>

                <MDBCol  >
<!--                  require(`/server/uploads/avatar/${avatar}`)-->
<!--                  :src="showImage ? showImage : (avatar.name !== 'avatar.png' ? avatar.image : require(`/server/uploads/avatar/${avatar.name}`))"-->
<!--                  :src="showImage ? showImage : require(`/server/uploads/avatar/${avatar.name}`)"-->
                  <img

                      :src="showImage ? showImage : avatar"
                      alt="profile_img_blob"
                      style="width: 100px; height: 100px; border: 1px solid darkgrey; border-radius: 50px; margin-bottom: 20px;"
                  />
                </MDBCol>

<!--                <div v-if="showImage && !isOpenSetAvatar && isPressedEditProfile">-->
<!--                  <p @click="isOpenSetAvatar = true">Muokkaa</p>-->
<!--                </div>-->
<!--                <div v-else>-->
<!--                  <p v-if="isPressedEditProfile && !isOpenSetAvatar" @click="isOpenSetAvatar = true">Lisa avatar</p>-->
<!--                </div>-->

<!--                <div v-if="(showImage) && !isOpenSetAvatar && isPressedEditProfile">-->
<!--                  <p @click="isOpenSetAvatar = true">Muokkaa</p>-->
<!--                </div>-->
<!--                <div v-else>-->
<!--                  <div v-if="avatarObject.isImage === false">-->
<!--                    <p v-if="isPressedEditProfile && !isOpenSetAvatar" @click="isOpenSetAvatar = true">Lisa avatar</p>-->
<!--                  </div>-->

<!--                </div>-->
                    <div v-if="showImage">
                      <div v-if="!isOpenSetAvatar && isPressedEditProfile">
                        <p @click="editProfileAvatar">Muokkaa</p>
                      </div>
                      <div v-else>
                        <p v-if="isPressedEditProfile && !isOpenSetAvatar" @click="addNewAvatar">Lisää avatar</p>
                      </div>
                    </div>
                    <div v-else>
                      <div v-if="avatarObject.isImage === true">
                        <div v-if="isPressedEditProfile">
                          <p @click="editProfileAvatar">Muokkaa</p>
                        </div>

                      </div>
                      <div v-else>
                        <p v-if="isPressedEditProfile && !isOpenSetAvatar" @click="addNewAvatar">Lisää avatar</p>
                      </div>
                    </div>





                <div class="edit-panel" v-if="(isOpenSetAvatar)  ">
                  <!--                <error-message :message = wrong_SizeType_Message />-->
                  <div style="display: flex; justify-content: right;">
                    <MDBBtnClose
                        white
                        class="close-btn"
                        style="float: right;"
                        @click="closeEditPanel"
                    />
                  </div>
                  <MDBRow >
                    <MDBCol>
                      <input  id="avatar-upload" type="file" @change="handleFileChange($event, i)"/>
                      <label  for="avatar-upload" class="profile-file-upload">
                  <span v-if="value">
                  Muokka tehtävän kuvausta

                   </span>
                        <span v-else>Valitse avatar</span>
                      </label>
<!--                      <MDBBtn v-if="isEditImage" block color="success" @click="uploadEditedImage(i)">Upload edited image</MDBBtn>-->
                      <MDBBtn v-if="showImage || avatarObject.isImage === true" class="btn" block size="lg" color="danger" @click="removeProfileImage">Poista kuva</MDBBtn>
                    </MDBCol>

                  </MDBRow>

                </div>

                <MDBCol>

                  <div v-if="!isPressedEditProfile">
                    <div style="float: right; padding: 10px; width: 100%;">

                      <div class="profile-info">
                        <div v-if="pro" >
                          <h3 >{{ pro.yritys }}</h3>
                          <div style=" color: cadetblue;">

                            <div
                                v-if="((pro.proTime - new Date().getTime()) / 86400000).toFixed() <= 0"
                            >
                              <p>Valitettavasti käyttö on päättynyt!</p>
                              <p style="color: orangered; cursor: pointer;" @click="$router.push('/pay-plan')">Lattaa lisää aikaa!</p>
                            </div>
                            <div v-else-if="((pro.proTime - new Date().getTime()) / 86400000).toFixed() <= 3
                          && ((pro.proTime - new Date().getTime()) / 86400000).toFixed() > 0">
                              <p>Käyttö</p>
                              <p>{{((pro.proTime - new Date().getTime()) / 86400000).toFixed()}} päivää</p>
                              <p style="color: orangered;  cursor: pointer;" @click="$router.push('/pay-plan')">Lattaa lisää aikaa!</p>
                            </div>
                            <div v-else>
                              <div v-if="((pro.proTime - new Date().getTime()) / 86400000).toFixed() === 'NaN'" class="spinner-border" role="status">
                                <span class="visually-hidden">Loading...</span>
                              </div>
                              <div v-else>
                                <p>Käyttö: </p>
                                <p>{{((pro.proTime - new Date().getTime()) / 86400000).toFixed()}} päivää</p>
                              </div>
                            </div>
                          </div>


                        </div>

                        <p v-if="client">Sinulla on varauksia ({{client.length}})</p>
                      </div>

                    </div>
                  </div>

                </MDBCol>
              </MDBRow>

            </MDBCol>

          </MDBCol>
          <MDBCol  lg="8">
            <div class="profile-main">
              <MDBBtnClose
                  v-if="!isPressedEditProfile"
                  white
                  style="float: right; padding: 13px;"
                  @click="$router.go(-1)"
              />
              <!--            <MDBBtnClose-->
              <!--                -->
              <!--                white-->
              <!--                style="float: right;"-->
              <!--                @click="isPressedEditProfile = false"-->
              <!--            />-->
              <MDBTable v-if="!isPressedEditProfile" borderless style="font-size: 14px; text-align: left;">
                <tbody>
                <tr>
                  <td>
                    Etunimi:
                  </td>
                  <td>
                    {{userData.firstName}}
                  </td>
                </tr>
                <tr>
                  <td>
                    Sukunimi:
                  </td>
                  <td>
                    {{loggedInUser.lastName}}
                  </td>
                </tr>
                <tr>
                  <td>
                    Käyttäjätunnus:
                  </td>
                  <td>
                    {{loggedInUser.username}}
                  </td>
                </tr>
                <tr>
                  <td>
                    Osoite:
                  </td>
                  <td>
                    {{userData.address}}
                  </td>
                </tr>
                <tr>
                  <td>
                    Sähköposti
                  </td>
                  <td>
                    <!--              <div style="word-wrap: break-word;">this_is_a_long_email@some_domain.net</div>-->
                    {{userData.email}}
                  </td>
                </tr>
                <tr>
                  <td colspan="2">
                    <MDBBtn block size="lg" outline="success" @click="pressedEditProfile">Muokkaa tiotosi</MDBBtn>
                  </td>
                </tr>
                </tbody>
              </MDBTable>

              <edit-profile
                  v-else
                  :loggedInUser = loggedInUser
                  :userData=" userData"
                  @goBackFromEditProfile = handleCloseEditProfile
                  @profile:data = handleSaveProfile
                  @saveProfileImg = handleSaveProfileImage
              />

            </div>


          </MDBCol>
        </MDBRow>
      </div>

<!--      show image {{showImage}}<br>-->
<!--      avatar {{avatar}}<br>-->
<!--      Avatar obj {{avatarObject}}<br>-->
<!--      isEditProfImage {{isEditProfileImage}}<br>-->
<!--      isAddProfileImage {{isAddProfileImage}}-->
<!--      file {{file}}-->

    </MDBContainer>
  </div>

</template>

<script>
/* eslint-disable */
import {
  MDBContainer,
  MDBTable,
  MDBBtn,
  MDBRow,
  MDBCol,
  MDBIcon,
  MDBBtnClose
  //MDBInput
}from "mdb-vue-ui-kit";
import editProfile from "../components/EditProfile";
import providerService from "@/service/providers";
import recipientService from "@/service/recipients";
import imageService from "@/service/image"
import awsUploadService from '@/service/awsUploads'
import userService from "@/service/users"
import fileError from "@/components/notifications/errorMessage"
import '@/css/style.css';
import '@/css/notification.css'
import socket from "@/socket"
export default {
  name: "user-profile",
  props: {
    avatar:  Object,
    avatarObject: Object,
    loggedInUser: Object,
    provider: Object,
    recipient: Array
  },
  components: {
    editProfile,
    fileError,
    MDBContainer,
    MDBTable,
    MDBBtn,
    MDBRow,
    MDBCol,
    MDBIcon,
    MDBBtnClose
    //MDBInput
  },
  data () {
    return {
      isOpenSetAvatar: false,
      isOpenAdd: false,
      isOpenEdit: false,
      user: null,
      userData: null,
      isPressedEditProfile: false,
      isAddProfileImage: false,
      isEditProfileImage: false,
      isEditData: false,
      pro: null,
      client: [],
      mail: "",
      address:"",
      osoite:null,
      lat: null,
      long: null,
      showImage: null,
      value: null,
      file: null,
      isProfileImageSelected: false,
      isUploaded: false,
      user_profile_image: [],
      //avatar: {name: "avatar.png", image: ""} ,
      image_id: null,
      fileSizeError: null,
      fileTypeError: null,
      emailErrorMessage: null
    }
  },
  mounted () {
    this.getUserData();

  },
  methods: {
    // Get user
    addNewAvatar () {
      this.isOpenSetAvatar = true;
      this.isAddProfileImage = true;
    },
    editProfileAvatar () {
      this.isOpenSetAvatar = true;
      this.isEditProfileImage = true;
    },
    async getUserData () {
      const loggedUserJSON = window.localStorage.getItem('loggedAppUser')
      if (!loggedUserJSON) {
        this.$router.push('/');
      } else {
        this.user = JSON.parse(loggedUserJSON)

        const pro = await providerService.getProvider(this.user.id)
        const client = await recipientService.getOwnBookings(this.user.id);

        if (pro && client.length > 0) {
          //this.avatar = pro.user.avatar;
          this.pro = pro
          this.userData = {
            firstName: this.user.firstName,
            address: pro.address,
            email: pro.user.email
          }
        } else if (pro) {
          //this.avatar = pro.user.avatar;
          this.pro = pro
          this.userData = {
            firstName: this.user.firstName,
            address: pro.address,
            email: pro.user.email
          }
        } else if(client.length > 0) {
          //if (client[0].user.avatar)
            //this.avatar = client[0].user.avatar;
          this.client = client
          //console.log("Client avatar: " + client[0].user.avatar.name)

          this.userData = {
            firstName: this.user.firstName,
            address: client[0].address,
            email: client[0].user.email
          }
        } else {
          this.userData = {
            firstName: this.user.firstName,
            address: "",
            email: this.user.email
          }
        }



      }

    },
    async getUserPro () {
      const provider = await providerService.getProvider(this.user.id)
      //const client = await recipientService.getOwnBookings(this.user.id);

      if (provider) {
        console.log("User pro username " + provider.user.username)
        this.pro = provider
        this.userData = {
          firstName: this.loggedInUser.firstName,
          address: this.pro.address
        }
      }


    },
    async getUserRecipient () {
      const client = await recipientService.getOwnBookings(this.user.id);
      if (client && client.length > 0) {
        this.client = client
        this.userData = {
          firstName: this.user.firstName,
          address: client[0].address
        }
      }
    },
    pressedEditProfile () {
      this.isPressedEditProfile = true;
    },
    handleSaveProfileData () {

    },
    // getPro (pro) {
    //   if (pro.yritys) {
    //     this.pro = pro;
    //   } else {
    //     this.pro = null;
    //   }
    //   // setTimeout(() => {
    //   //   if (pro.yritys) {
    //   //     this.pro = pro;
    //   //   } else {
    //   //     this.pro = null;
    //   //   }
    //   // }, 2000)
    // },

    async validateUploadErrors (data, file, status) {
      console.log("FILE " + file.type);
      console.log("Status: " + status);
      console.log("Is true or false " + file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/jpg" || file.type === "image/gif")
      const acceptedTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif"];
      if (acceptedTypes.includes(file.type)) {
        console.log("KUNNOSSA")
        console.log("File size " + file.size);
        if (file.size < 1000000) {
          if (status === "add") {
            console.log("_____Add image")
            const uploadedAvatar = await awsUploadService.uploadAvatarImage(this.user.id, data);
            const info = {
              isImage: true,
              key: uploadedAvatar.key,
              imageUrl: uploadedAvatar.imageUrl
            }
            this.$emit("updateAvatar", info,  this.showImage); // to app, for navbar avatar adding

          } else {

            const key = this.avatarObject.key;

            const editedAvatar = await awsUploadService.editAvatarImage(this.user.id, key, data);
            const editInfo = {
              isImage: true,
              key: editedAvatar.key,
              imageUrl: editedAvatar.imageUrl
            }
            console.log("_____Edit image " + editedAvatar.key);
            this.$emit("updateAvatar", editInfo, this.showImage); // to app, for navbar avatar update

          }
        } else {
          this.showImage = null;
          this.value = null;
          this.isPressedEditProfile = false;
          this.openSetAvatar = false;

          this.fileSizeError = "Kuvan koko on oltava pienempi kun 1 MB!"
          setTimeout(() => {
            this.fileSizeError = null;
          }, 3000)

        }
      } else {
        console.log("EI KUNNOSSA")

        this.fileTypeError = "Pitäisi käyttää kuvan formaatti (jpeg, jpg, png, gif)!"
        setTimeout(() => {
          this.fileTypeError = null;
        }, 3000)
        this.showImage = null;
        this.isAddProfileImage = false;
        this.isEditProfileImage = false;
        this.value = null;
      }
    },
    async handleSaveProfile (newAddress, newEmailAddress) {
      console.log("Is new address?? " + newAddress.latitude)
      // Edit address if address is choosen, otherwice do nothing
      if (newEmailAddress !== "") {
        const emailAlreadyExists = await userService.editEmail(this.user.id, {email: newEmailAddress});
        if (emailAlreadyExists.error !== "email existing") {
          this.userData.email = newEmailAddress;
        } else {
          this.emailErrorMessage = "Antamasi sähköpostiosoite on jo olemassa!"
          setTimeout(() => {
            this.emailErrorMessage = null;
          }, 2000);
        }
      }
      if (newAddress.latitude !== null) {
        if (this.pro) { // If client is provider
          await providerService.editAddress(this.pro.id, newAddress);
          this.userData.address = newAddress.address;
        }
        if (this.client.length > 0) { // If client is recipient
          for (let booking in this.client) {
            const bookingID = this.client[booking].id;
            await recipientService.editBookingAddress(bookingID, newAddress);
            this.userData.address = newAddress.address;
          }
        }

      }
      const data = new FormData();
      if (this.value !== null) {
        if (this.isAddProfileImage) {
          console.log("Saving image type " + this.file.type);


          data.append('file', this.file, this.file.name)

          await this.validateUploadErrors(data, this.file, "add");
          //this.$router.go(-1);

        } else if (this.isEditProfileImage) {
          console.log("Editing image here")
          data.append('file', this.file, this.file.name);
          await this.validateUploadErrors(data, this.file, "edit");
          //this.$router.go(-1);

        }

        this.isAddProfileImage = false;
        this.isEditProfileImage = false;

      }

    },
    saveEditedName () {
      this.userData.firstName = this.name;
      this.isEditName = false;
    },
    handleCloseEditProfile () {
      this.isPressedEditProfile = false;
      this.isAddProfileImage = false;
      this.isEditProfileImage = false;
    },
    handleFileChange(e) {
      //this.$emit('input', e.target.client[0])

      try {

        const files = e.target.files[0]
        this.file = files;
        console.log('event target client ', e.target.files[0])
        if (files){
          //const tempImage = URL.createObjectURL(files)
          //this.tempImages.push(tempImage);



          //this.isAddProfileImage = true;



          this.file = e.target.files[0];

          this.isOpenEdit = true;
          //this.showImage = URL.createObjectURL(files)
          this.showImage = URL.createObjectURL(files);

          //this.avatar = URL.createObjectURL(files)






          // console.log("Image type: " +  this.file.type)
          // console.log("Image size: " + typeof this.file.size)
        }

      } catch (err) {
        console.log('Error:', err)
      }

      this.value = e.target.files[0]
      if (e.target.files[0]) {
        this.isProfileImageSelected = true;
      } else {
        this.isProfileImageSelected = false;
      }
    },
    addProfileImage () {
      this.isAddProfileImage = true;
    },
    editProfileImage () {
      this.isEditProfileImage = true;
    },
    closeEditPanel () {
      this.isOpenSetAvatar = false;
      this.isAddProfileImage = false;
      this.isEditProfileImage = false;
    },
    async removeProfileImage () {
      //this.avatar = null;
      this.openSetAvatar = false;
      if (!this.showImage) {
        console.log("Deleting real image...");
        await awsUploadService.deleteAvatar(this.user.id, this.avatarObject.key);
        this.$emit('delete_avatar');
      } else {
        //this.avatar = {name: "avatar.png", image: ""};
        this.value = null;
        this.showImage = null;
        this.isOpenSetAvatar = false;
        //this.isEditProfileImage = false;

      }
      // this.avatar = "avatar.png"
      // this.showImage = null;
      // this.$emit("removeAvatar")
      // await userService.removeAvatar(this.user.id);
      // this.isEditProfileImage = false;
      // this.isPressedEditProfile = false;




      // if (this.avatar) {
      //   // Removing avatar will take place in User router
      //   await userService.removeAvatar(this.loggedInUser.id);
      // }

    },
    async handleSaveProfileImage () {
      //this.isUploaded = true;
      this.isPressedEditProfile = false;
      this.isOpenSetAvatar = false;
      // this.isAddProfileImage = false;
      // this.isEditProfileImage = false;
    }


  }
}
</script>

<style scoped>
html, body {
  /*overflow-y: auto;*/
  background-color: #141414;
  /*background-image: url('../assets/247.png');*/
  background-image: url('../assets/247.png');

}

.profile_image {
  width: 160px;
  text-align: center;
  color: cadetblue;
  margin-top: 50px;
  cursor:pointer;
}
img.loading {
  width: 100px;
  height: 100px;
  background: transparent url(https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif) no-repeat scroll center center;
}
input[type="file"] {
  display: none;
}
.profile-file-upload {
  width: 100%;

  text-align: center;
  color: white;
  background-color: #2e2b2b;

  display: inline-block;
  padding: 10px 12px;
  margin-bottom: 10px;
  cursor: pointer;
}

.profile-main table {
  color: #ddd;
}
</style>