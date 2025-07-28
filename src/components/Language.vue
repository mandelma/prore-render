<template>
  <!--          style="  background-color: #342e2e; color: white;"-->
    <MDBDropdown style="" v-model="dropdownLang" >
      <MDBDropdownToggle
          tag="a"
          @click="dropdownLang = !dropdownLang"

      >




        <span v-if="currentLanguage === 'fin' || currentLanguage === null">
          <img style="width: 20px;" :src="require(`@/assets/fin_1.png`)" alt="fin" />
        </span>
        <span v-else-if="currentLanguage === 'est'" >
          <img style="width: 20px;" :src="require(`@/assets/est_flag.png`)" alt="en"/>
        </span>
        <span v-else-if="currentLanguage === 'en'">
          <img style="width: 20px;" :src="require(`@/assets/en.png`)" alt="en"/>
        </span>

        &nbsp;

      </MDBDropdownToggle>
      <MDBDropdownMenu dark aria-labelledby="dropdownMenuLinkx">
        <MDBDropdownItem ><MDBBtn color="dark" block @click="setLanguage('fin')"><img style="width: 20px;" :src="require(`@/assets/fin_1.png`)" alt="fin" > &nbsp;fin</MDBBtn></MDBDropdownItem>
        <MDBDropdownItem ><MDBBtn color="dark" block @click="setLanguage('en')"><img  style="width: 20px;" :src="require(`@/assets/en.png`)" alt="en" > &nbsp;en</MDBBtn></MDBDropdownItem>
        <MDBDropdownItem><MDBBtn color="dark" block @click="setLanguage('est')"><img style="width: 20px;" :src="require(`@/assets/est_flag.png`)" alt="est" /> &nbsp;est</MDBBtn></MDBDropdownItem>
      </MDBDropdownMenu>
    </MDBDropdown>



</template>

<script>
/* eslint-disable */
import {
  //MDBContainer,
  MDBBtn,
  MDBNavbarItem,
    MDBDropdown,
    MDBDropdownToggle,
    MDBDropdownMenu,
    MDBDropdownItem
} from 'mdb-vue-ui-kit'
import { useI18n } from 'vue-i18n';
//import { ref,  watchEffect } from 'vue';
import { ref } from 'vue'
export default {
  name: "Language",
  props: {
    //language: null,
  },
  components: {
    //MDBContainer,
    MDBBtn,
    MDBNavbarItem,
    MDBDropdown,
    MDBDropdownToggle,
    MDBDropdownMenu,
    MDBDropdownItem
  },

  setup () {
    //const { locale } = useI18n;
    //const { t } = useI18n();
    const dropdownLang = ref(false)
    return {
      dropdownLang
    }
  },

  data () {
    const { locale } = useI18n();


    // watchEffect(() => {
    //   const storedLang = localStorage.getItem('lang');
    //   if (storedLang) {
    //
    //     this.locale = storedLang;
    //   }
    // });
    return {
      currentLanguage: localStorage.getItem('lang' ) || null,
      locale,
      //t,
      //watchEffect
    }
  },

  methods: {
    setLanguage (newLang) {
      //console.log("New language is " + newLang)
      this.dropdownLang = false;
      this.locale = newLang;
      localStorage.setItem('lang', newLang);
      this.currentLanguage = newLang;
    }
  },
}
</script>

<style scoped>

</style>