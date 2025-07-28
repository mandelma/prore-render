<template>
  <MDBContainer>
    <h2 style="margin-bottom: 27px;">Kuvat omista palveluista!</h2>


    <MDBRow>
      <MDBCol lg="4" v-for="(item, i) in proImages" :key="i">
<!--        require(`/server/uploads/${img.image}`)-->
        <div class="panel">
          <img
              class="proRefLoading"
              :src="item.blob ? item.blob : item.imageUrl"
              :alt="item.name"
          />
          <button class="img_btn" @click="pressEditPanel(i)">Muokkaa</button>
        </div>


<!--        <MDBBtn v-if="!isEdit" block outline="success" @click="pressEditPanel(i)">Muokkaa</MDBBtn>-->
        <div class="edit-panel" v-if="isEditPanel && imgIndex === i">
          <error-message :message = wrongSizeTypeMessage />
          <MDBRow>
            <MDBCol>
              <MDBBtnClose
                  v-if="!value"
                  white
                  class="close-btn"
                  style="float: right;"
                  @click="closeEditPanel"
              />
              <input  id="pro-upload" type="file" @change="handleFileChange($event, i)"/>
              <label  for="pro-upload" class="pro-file-upload">
                  <span v-if="value">
                  Muokka tehtävän kuvausta: {{value.name}}

                   </span>
                <span v-else>Valitse uusi kuva tehtävästä</span>
              </label>
              <MDBBtn v-if="isEdit" block color="success" @click="editRefImage(i, item)">Upload edited image</MDBBtn>
              <MDBBtn class="btn" block size="lg" color="danger" @click="removeRefImage(i, item)">Poista kuva</MDBBtn>
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

      </MDBCol>
    </MDBRow>


    <MDBBtn v-if="!isPressedAdd" block color="warning" @click="pressAddImage" style="margin-top: 13px;">Lisää uusi kuva tehtävästä</MDBBtn>
    <div class="add-panel" v-if="isPressedAdd && isAddPanel">

      <error-message :message = wrongSizeTypeMessage />
      <MDBRow>

        <MDBCol>
          <MDBBtnClose
              v-if="!value"
              white
              class="close-btn"
              @click="closeAddPanel"
          />
          <input   id="add-upload" type="file" @change="handleFileChange($event, i)"/>
          <label  for="add-upload" class="pro-file-upload">
                  <span v-if="value">
                  Muokka tehtävän kuvausta: {{value.name}}
                   </span>
            <span v-else>Valitse lisää kuva tehtävästä</span>
          </label>
          <MDBBtn v-if="isAdd" block outline="primary" @click="addRefImage">Tallenna kuva</MDBBtn>
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

<!--    images {{proImages}}-->
<!--    <MDBBtn color="success" @click="getUser">Get provider booking</MDBBtn>-->



<!--    pro images: {{proImages}}<br>-->
<!--    error message {{wrongSizeTypeMessage}}-->
  </MDBContainer>
</template>

<script>
/* eslint-disable */
import {
  MDBContainer,
    MDBRow,
    MDBCol,
    MDBBtn,
    MDBBtnClose
} from 'mdb-vue-ui-kit'
import imageService from "@/service/image";
import awsUploadService from '@/service/awsUploads'
import providerService from "@/service/providers";
import errorMessage from '../components/notifications/errorMessage'
import socket from "@/socket";
import recipientService from "@/service/recipients";
//import socket from "@/socket";
export default {
  name: "ProGallery",
  props: {
    provider: null,
    proImages: Array
  },
  components: {
    errorMessage,
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBBtn,
    MDBBtnClose,

  },
  data () {
    return {

      IMAGE_SIZE: 1000000,
      value: null,
      showImage: null,
      files: null,
      imgIndex: null,
      isAdd: false,
      isEdit: false,
      isEditPanel: false,
      isPressedAdd: false,
      isAddPanel: false,
      wrongSizeTypeMessage: null
    }
  },
  methods: {
    // getUser () {
    //   this.provider.booking.forEach(b => {
    //     console.log("Booking info " + b.user.username);
    //
    //   })
    // },
    async sendReadableFileToRecipients (imageID, action) {
      let recipients = [];
      this.provider.booking.forEach(b => {
        console.log("Booking info " + b.user.username);
        recipients = [
            ...recipients,
            b.user.id
        ]
      })
      const data = new FormData();
      data.append('file', this.files, this.files.name);

      const reader = new FileReader();

      reader.onload = (e) => {
        const bytes = new Uint8Array(e.target.result);
        console.log("FILES IN gallery.... " + this.files)

        // const imgBytes = {
        //   id: ,
        //   bytes: bytes
        // }

        socket.emit("created file for recipients", imageID, bytes, this.provider.id, recipients, action);
      };
      reader.readAsArrayBuffer(this.files);
    },
    handleFileChange(e, i) {
      this.imgIndex = i;
      try {

        const files = e.target.files[0]
        console.log('event target client ', e.target.files[0])

        if (files) {
          //const tempImage = URL.createObjectURL(files)
          //this.tempImages.push(tempImage);
          this.showImage = URL.createObjectURL(files)
          //this.file = e.target.files[0];
          this.files = e.target.files[0];

          this.isAdd = true;
          this.isEdit = true;
        }

      } catch (err) {
        console.log('Error:', err)
      }

      this.value = e.target.files[0]

    },
    pressAddImage () {
      this.isAdd = false
      this.isEdit = false;
      this.isEditPanel = false;
      this.isPressedAdd = true;
      this.isAddPanel = true;
    },
    pressEditPanel (index) {
      this.isEdit = false;
      this.value = null;
      this.imgIndex = index;
      this.isPressedAdd = false;
      this.isEditPanel = true;
      this.isAddPanel = false
    },
    closeEditPanel () {
      this.isAddPanel = false
      this.isEditPanel = false
      this.isEdit = false;
      this.value = null;
    },
    closeAddPanel () {
      this.isAddPanel = false
      this.isPressedAdd = false;
      this.value = null;
    },
    async addRefImage () {
      this.value = null;
      this.isAddPanel = false;
      this.isAdd = false;
      this.isPressedAdd = false;
      const data = new FormData();

      data.append('file', this.files, this.files.name)
      console.log("IMG pro size - " + this.files.size);

      console.log("Image pro type_ " + this.files.type);
      console.log("AAA " + this.provider.user.id)
      const type = this.files.type;
      if (type ==="image/jpeg" || type === "image/jpg" || type === "image/png" || type === "image/gif") {
        console.log("Pildi formaat on OK")
        if (this.files.size <= this.IMAGE_SIZE) {

          //const reader = new FileReader();

          // const img = await imageService.createProRefImg(this.provider.user.id, data);
          const img = await awsUploadService.uploadProImage(data)

          if (img) {
            console.log("Pro image id is: " + img.id)
            //await recipientService.addImage(this.booking.id, img.imgCreated._id)


            // await providerService.addProSlide(this.provider.id, {slideID: img.imgCreated._id});

            await providerService.addProSlide(this.provider.id, {slideID: img.id});

            //
            const _image = {
              _id: img.id,
              key: img.key,
              blob: this.showImage
            }




            this.$emit("addProImage", _image);

            await this.sendReadableFileToRecipients(img.id, 'add');


            this.isEdit = false;

          }
        } else {

          console.log("Pildi suurus peab olema väiksem kui 1 MB");
          this.isAddPanel = true
          this.isPressedAdd = true;
          this.wrongSizeTypeMessage = "Kuvan maximi koko on 3 MB.";

          setTimeout(() => {
            this.wrongSizeTypeMessage = null;
          }, 3000);
        }
      }
      else {
        console.log("Pildi formaat on FAKE")
        this.isAddPanel = true
        this.isPressedAdd = true;
        this.wrongSizeTypeMessage = "Väärä formaati. Kuva pitäisi olla jpeg, jpg, png tai gif formaatissa!";
        setTimeout(() => {
          this.wrongSizeTypeMessage = null;
        }, 3000);
      }

    },
    async editRefImage (index, img) {

      // imgIndex: null,
      //     isAdd: false,
      //     isEdit: false,
      //     isEditPanel: false,
      //     isPressedAdd: false,
      //     isAddPanel: false,
      //     wrongSizeTypeMessage: null

      console.log("Edited image index is: " + index);

      this.isEditPanel = false;
      this.isEdit = false;

      const data = new FormData();
      data.append('file', this.files, this.files.name)

      console.log("Image id " + this.proImages[index]._id)
      const imgType = this.files.type;
      if (imgType ==="image/jpeg" || imgType === "image/jpg" || imgType === "image/png" || imgType === "image/gif") {
        if (this.files.size <= this.IMAGE_SIZE) {
          // -----------------------------------------------
          //const image = await imageService.updateImage(this.images[index]._id, data);
          console.log("Image id to edit " + this.proImages[index]._id);
          //const changeImg = await imageService.editProRefImage(this.proImages[index]._id, data);
          const changeImg = await awsUploadService.editProImage(img._id, img.key, data);

          if (changeImg) {
            console.log("Edited pro image key: " + changeImg.key);
            this.$emit("editProRefImage", index, img._id, changeImg.key, this.showImage);

            await this.sendReadableFileToRecipients(changeImg.id, 'edit');

            // this.images[this.imageIndex] = {_id: this.images[index]._id, blob: this.showImage}
            //
            // this.images.forEach(img => {
            //   console.log("Image name " + img._id)
            // })

            // console.log("ORDRED in EDIT pikkus " + this.booking.ordered.length)
            // let ordered = [];
            // this.booking.ordered.forEach(b => {
            //   console.log("CVCVCV " + b.user.username);
            //   ordered = ordered.concat(b.user.id);
            // })
            //
            // const reader = new FileReader();
            //
            // if (this.file) {
            //   reader.onload = (e) => {
            //     const bytes = new Uint8Array(e.target.result);
            //     console.log("FILES.... " + this.files)
            //
            //     const image_id = image._id;
            //
            //     socket.emit("display edited booking image", image_id, bytes, this.booking.id, ordered)
            //
            //   };
            //   reader.readAsArrayBuffer(this.files);
            // }

            // console.log("New image id is " + image._id)
            // this.imgId = image._id;
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
    async removeRefImage (index, image) {
      //this.value = null;
      if (!this.proImages[index].blob) {
        console.log("removed image is blob")

      }

      let clients = [];
      this.provider.booking.forEach(pb => {
        console.log("Booking info -- removing " + pb.user.username);
        clients = [
          ...clients,
          pb.user.id
        ]
      })

      console.log("removable image id is " + this.proImages[index]._id)

      //await imageService.removeProRefImage(this.proImages[index]._id, this.provider.id);

      await awsUploadService.deleteImage(image._id, image.key);

      // await recipientService.removeImage(this.booking.id, this.images[id]._id);
      // await imageService.remove(this.images[id]._id, this.booking.id);



      //socket.emit("stop display booking image", this.images[id]._id, this.booking, bIDs);

      this.$emit("removeProRefImage", index);
      socket.emit("remove recipient side pro ref image", image._id, this.provider.id, clients);

      this.isEditPanel = false;

    },
    // transparent
  }
}
</script>

<style scoped>
img.proRefLoading {
  width: 100%;
  margin: 0 13px 13px 0;
  background: #1f1b1b url(https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif) no-repeat scroll center center;
}
input[type="file"] {
  display: none;
}
.pro-file-upload {
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
.btn {
  padding: 20px;
  margin: 20px 0 20px 0;
}
.close-btn {
  float: right;
  padding: 20px;
}


/* Container needed to position the button. Adjust the width as needed */
.panel {
  position: relative;
  width: 100%;
}

/* Make the image responsive */
.panel img {
  width: 100%;
  height: auto;
}

/* Style the button and place it in the middle of the container/image */
.panel .img_btn {
  position: absolute;
  top: 85%;
  left: 80%;
  transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  background-color: #555;
  opacity: 0.5;
  color: white;
  font-size: 16px;
  padding: 12px 24px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}

.panel .btn:hover {
  background-color: black;
}
</style>