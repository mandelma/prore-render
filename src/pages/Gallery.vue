<template>
 <MDBContainer style="padding-top: 150px;">
   <h2 v-if="!inspectingBooking" style="text-align: center;">Kuvia tehtyistä työistä</h2>
   <h2 v-else >Kuvat tehtävästä</h2>
<!--   :data-sub-html="`<h2 >Hei </h2><button type = 'button' onclick = 'delImage' >Delete image ${item.id}</button>`"-->
<!--   <button v-on:click="updateSlides">Lisää uusi kuva</button>-->
   <div v-if="isPro">
     <input  id="pro-file-upload" type="file" @change="handleFileChange($event, i)"/>
     <label  for="pro-file-upload" class="pro-file-upload">

       <span>Lataa uusi kuva tehtävästä</span>
     </label>
   </div>


   <lightgallery
       style="text-align: left;"
       id="update"
       :settings="{ speed: 500,  plugins: plugins }"
       :onInit="onInit"
       :onBeforeSlide="onBeforeSlide"
   >
     <a
         v-for="(item, id) in proImages"

         :key="id"
         :data-lg-size="item.size"

         class="gallery-item"
         :data-src="item.src"
     >
       <img

           style="margin-bottom: 10px; width: 140px;  margin-left: 0;"
           class="img-responsive"
           alt="Image"
           :src= "item.thumb"
       />


     </a>

   </lightgallery>
   <MDBBtn
       v-if="isImageEdited || removedImages.length > 0"
       block
       color="success"
       size="lg"
       @click="uploadProSlides">Vahvista tehtyt muokkaukset ja sulje</MDBBtn>

<!--   user provider {{userIsProvider}}-->
<!--   images {{images}}<br>-->


 </MDBContainer>
</template>

<script>
/* eslint-disable */
import providerService from '../service/providers'
import Lightgallery from 'lightgallery/vue';
//import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgZoom from 'lightgallery/plugins/zoom';
import imageService from '../service/image'
let lightGallery = null


import {
  MDBContainer,
  MDBBtn
} from 'mdb-vue-ui-kit'
import {ref} from 'vue'
export default {
  name: "Gallery",
  props: {
    isPro: Boolean,
    inspectingBooking: Boolean,
    userIsProvider: Object,
    proImages: Array
  },
  components: {
    Lightgallery,
    MDBContainer,
    MDBBtn
  },
  watch: {
    proImages(newVal, oldVal) {
      this.$nextTick(() => {
        lightGallery.refresh();
      });
    },
  },
  // setup () {
  //   const lightGallery = ref(null)
  //   return {
  //     lightGallery
  //   }
  // },
  data () {
    return {
      pro: null,
      showImage: null,
      file: null,
      value: null,
      plugins: [lgZoom],
      height:' 100px',
      id: null,
      index: 1,
      isImageEdited: false,
      images: [],
      //images: this.proImages,
      addedSlides: [],
      removedImages: [],

      items: [
        {
          id: '1',
          size: '1400-933',
          src:
              'https://images.unsplash.com/photo-1542103749-8ef59b94f47e?ixid=MXwxMjA3fDB8MH,xwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80',
          thumb:
              'https://images.unsplash.com/photo-1542103749-8ef59b94f47e?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=240&q=80',
          subHtml: `<div class="lightGallery-captions">
                <h4>Photo by <a href="https://unsplash.com/@dann">Dan</a></h4>
                <p>Published on November 13, 2018</p>
            </div>`,
        },

        {
          id: '2',
          size: '1400-933',
          src:
              'https://images.unsplash.com/photo-1473876988266-ca0860a443b8?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80',
          thumb:
              'https://images.unsplash.com/photo-1473876988266-ca0860a443b8?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=240&q=80',
          subHtml: `<div class="lightGallery-captions">
                <h4>Photo by <a href="https://unsplash.com/@kylepyt">Kyle Peyton</a></h4>
                <p>Published on September 14, 2016</p>
            </div>`,
        },
        {
          id: '3',
          size: '1400-932',
          src:
              'https://images.unsplash.com/photo-1588953936179-d2a4734c5490?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1400&q=80',
          thumb:
              'https://images.unsplash.com/photo-1588953936179-d2a4734c5490?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=240&q=80',
          subHtml: `<div class="lightGallery-captions">
                <h4>Photo by <a href="https://unsplash.com/@jxnsartstudio">Garrett Jackson</a></h4>
                <p>Published on May 8, 2020</p>
            </div>`,
        },
        {
          id: '4',
          size: '1000-400',
          src: require(`@/assets/avatar/avatar.png?w=200`),
          thumb:  require(`@/assets/avatar/avatar.png?w=200`),
          subHtml: `<div class="lightGallery-captions">


            </div>"`
        }
      ],
    }
  },

  beforeMount () {
    //this.images = this.proImages;
    // providerService.getProvider(this.userIsProvider.id);

    const loggedUserJSON = window.localStorage.getItem('loggedAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      this.pro = user;
      //this.handleProvider(user.id);
    }


  },
  methods: {
    async handleProvider (id) {
      //this.images = this.proImages;

      // console.log("prov " + id)
      // const provider = await providerService.getProvider(id);
      // provider.reference.forEach(item => {
      //   this.images = [
      //     ...this.images,
      //     {
      //       id: item._id,
      //       size: '1400-933',
      //       src: require(`/server/uploads/pro/${item.name}`),
      //       thumb: require(`/server/uploads/pro/${item.name}`),
      //       subHtml: `<div class="lightGallery-captions">
      //           <h2>Terve</h2>
      //
      //       </div>"`
      //     }
      //   ]
      // })

    },
    async getImageDimensions(file) {
      let img = new Image();
      img.src = URL.createObjectURL(file);
      await img.decode();
      let width = img.width;
      let height = img.height;
      return {
        width,
        height,
      }
    },
    handleFileChange(e, i) {
      //this.$emit('input', e.target.client[0])
      console.log("i in file change " + i)
      //this.imageIndex = i;
      try {

        const files = e.target.files[0]
        console.log('event target client ', e.target.files[0])

        const data = new FormData();



        if (files) {
          const tempImage = URL.createObjectURL(files)
          //this.tempImages.push(tempImage);
          this.showImage = URL.createObjectURL(files)
          const show_img = URL.createObjectURL(files)
          this.file = e.target.files[0]
          const file = e.target.files[0]

          data.append('file', file, file.name)

          
          //console.log("Image sizes: " + getImageDimensions(file))

          this.getImageDimensions(file).then(im => {
            const size = {
              width: im.width,
              height: im.height
            }
            const image = {
              id: null, //upload.imgCreated._id,

              size: im.width + '-' + im.height,
              data: data,
              src: show_img,    //require(`/server/uploads/pro/${upload.imgCreated.name}`),
              thumb: show_img, //? this.showImage : require(`/server/uploads/pro/${upload.imgCreated.name}`),
              subHtml: `<div class="lightGallery-captions">


            </div>"`
            }

            // this.addedSlides = [
            //     ...this.addedSlides,
            //   {
            //
            //   }
            // ]
            this.$emit("add:slide", image, size)
            // this.images = [
            //   ...this.images,
            //   {
            //     id: null, //upload.imgCreated._id,
            //     status: "add",
            //     size: im.width + '-' + im.height,
            //     data: data,
            //     src: show_img,    //require(`/server/uploads/pro/${upload.imgCreated.name}`),
            //     thumb: show_img, //? this.showImage : require(`/server/uploads/pro/${upload.imgCreated.name}`),
            //     subHtml: `<div class="lightGallery-captions">
            //
            //
            // </div>"`
            //   }
            //
            // ]

          })
          this.isImageEdited = true;
        }

      } catch (err) {
        console.log('Error:', err)
      }

      this.value = e.target.files[0]

    },
    async updateSlides (item) {

      let x = await imageService.createProRefImg(this.userIsProvider.id,  item.data);
      await providerService.addProSlide(this.userIsProvider.id, {slideID: x.imgCreated._id})
      console.log("lkdfanvoöinaeäofvnaespvns ")

    },
    uploadProSlides () {
      // TODO teha pro piltide laadimine ja kustutamine App lehel homme!!!
      this.$router.go(-1);
      this.$emit("updateGalleryRemove", this.removedImages)

      for (let i = 0; i < this.proImages.length; i++) {
        if (this.proImages[i].id === null) {
          this.updateSlides(this.proImages[i])
        }

      }


    },

    onInit (detail)  {

      //console.log("Slide " + plugin.slide())
      console.log("Details " + detail.instance.index)
      lightGallery = detail.instance;

      if (this.isPro) {
        const $btn = '<button style="margin-left: 100px; color: #ddd; background-color: red;" type="button" aria-label="View source" id="lg-delete">Poista kuva</button>';
        lightGallery.outer.find('.lg-toolbar').append($btn);
        document.getElementById("lg-delete").addEventListener("click", () => {
          console.log("custom button click " + this.index);

          const removedImageId = this.proImages[this.index].id;
          if (removedImageId) {
            //this.isImageEdited = true;
            this.removedImages = [
              ...this.removedImages,
              removedImageId
            ]
          }

          console.log("Image id " + removedImageId)

          this.$emit("remove:slide", removedImageId, this.index)

          console.log("prov id... "  + this.userIsProvider.id)
          //this.images = this.images.filter((item, i) => i !== this.index);
          const plugin = lightGallery;
          plugin.closeGallery();

          plugin.refresh();

        });
      }
    },
    // async updateSlides () {
    //
    //   //this.uploadProImage();
    //   const data = new FormData();
    //
    //   data.append('file', this.file, this.file.name)
    //
    //   const imageForUpload = {
    //
    //     id: 5,    //upload.imgCreated._id,
    //     size: '100-100',
    //
    //     src: this.showImage,    //require(`/server/uploads/pro/${upload.imgCreated.name}`),
    //     thumb: this.showImage, //? this.showImage : require(`/server/uploads/pro/${upload.imgCreated.name}`),
    //     subHtml: `<div class="lightGallery-captions">
    //
    //
    //         </div>"`
    //   }
    //
    //   this.images = [
    //       ...this.images,
    //     {
    //       id: 5, //upload.imgCreated._id,
    //       size: '100-100',
    //       src: this.showImage,    //require(`/server/uploads/pro/${upload.imgCreated.name}`),
    //       thumb: this.showImage, //? this.showImage : require(`/server/uploads/pro/${upload.imgCreated.name}`),
    //       subHtml: `<div class="lightGallery-captions">
    //
    //
    //         </div>"`
    //     }
    //
    //   ]
    //
    //   lightGallery.refresh();
    // },
    onBeforeSlide(index)  {
      console.log('calling before slide ' + typeof index.index);
      let selectedIndex = index.index;
      console.log("Tasku " + selectedIndex + typeof selectedIndex)
      this.index = selectedIndex;


    },
  }
}
</script>

<style scoped>
body, html {
  padding: 0;
  margin: 0;
  width: 100%;
  min-height: 100vh;
}
body {
  background-color: black;
}
/*@import url("https://cdn.jsdelivr.net/npm/lightgallery@2.0.0-beta.4/css/lightgallery.css");*/
/*@import url("https://cdn.jsdelivr.net/npm/lightgallery@2.0.0-beta.4/css/lg-zoom.css");*/
/*@import url("https://cdn.jsdelivr.net/npm/lightgallery@2.0.0-beta.4/css/lg-video.css");*/

body {
  margin: 0;
}

.gallery-item {
  margin: 20px;

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
  margin-bottom: 10px;
  cursor: pointer;
}
</style>