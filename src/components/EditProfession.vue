<template>
  <div >
    <MDBContainer>
      <div class="edit-profession">
<!--        <MDBIcon-->
<!--            style="float:right; cursor: pointer;"-->
<!--            @click="cancelEditProfession"-->

<!--        >-->
<!--          <i class="fas fa-undo"></i>-->
<!--        </MDBIcon>-->
        <MDBBtnClose
            white
            style="float:right; cursor: pointer;"
            @click="cancelEditProfession"
        />
        <div v-if="provider && provider.profession.length === 1">

          <MDBRow v-for="(pro, index) in provider.profession" :key="index">
            <MDBCol col="12">
              <p style="color: #ddd;">{{pro}}</p>
            </MDBCol>
            <MDBCol col="12">
              <form @submit.prevent="submit">

                <div style=" margin-bottom: 20px;" >
                  <Dropdown @change="changeCurrentProfession(index)" v-model="selected" :options="proList"   filter optionLabel="label" optionGroupLabel="label" optionGroupChildren="items" placeholder="Valitse ammattilainen" class="w-full md:w-100rem">

                    <template value="slotProps" >
                      <div v-if="slotProps.value" >
                        <div >{{ slotProps.value.label }}</div>
                      </div>
                      <span v-else>
                        {{ slotProps.placeholder }}
                      </span>
                    </template>
                    <template  #optiongroup="slotProps"  >
                      <div style="" class="flex align-items-center">
                        <div >{{ slotProps.option.label }}</div>
                      </div>
                    </template>
                  </Dropdown>
                </div>

              </form>
            </MDBCol>
          </MDBRow>

<!--          <MDBTable  borderless style="font-size: 18px;  text-align: left;">-->
<!--            <tbody>-->
<!--            <tr>-->
<!--              <td>-->
<!--                <p style="color: #ddd;">{{pro}}</p>-->
<!--              </td>-->
<!--            </tr>-->
<!--            <tr v-for="(pro, index) in provider.profession" :key="index">-->
<!--              <td>-->
<!--                <form @submit.prevent="submit">-->

<!--                  <div style=" margin-bottom: 20px;" >-->
<!--                    <Dropdown @change="changeCurrentProfession(index)" v-model="selected" :options="proList"   filter optionLabel="label" optionGroupLabel="label" optionGroupChildren="items" placeholder="Valitse ammattilainen" class="w-full md:w-100rem">-->

<!--                      <template value="slotProps" >-->
<!--                        <div v-if="slotProps.value" >-->
<!--                          <div >{{ slotProps.value.label }}</div>-->
<!--                        </div>-->
<!--                        <span v-else>-->
<!--                          {{ slotProps.placeholder }}-->
<!--                        </span>-->
<!--                      </template>-->
<!--                      <template  #optiongroup="slotProps"  >-->
<!--                        <div style="" class="flex align-items-center">-->
<!--                          <div >{{ slotProps.option.label }}</div>-->
<!--                        </div>-->
<!--                      </template>-->
<!--                    </Dropdown>-->
<!--                  </div>-->

<!--                </form>-->
<!--              </td>-->

<!--            </tr>-->
<!--            </tbody>-->
<!--          </MDBTable>-->
        </div>

        <div v-else>
<!--          <MDBRow v-for="(pro, index) in provider.profession" :key="index">-->
<!--            <MDBCol>-->
<!--              <p style="color: #ddd;">{{pro}}</p>-->
<!--            </MDBCol>-->
<!--            <MDBCol>-->
<!--              -->
<!--            </MDBCol>-->
<!--          </MDBRow>-->

          <MDBTable  borderless style="font-size: 18px; text-align: left;">
            <tbody>
            <tr v-for="(pro, index) in provider.profession" :key="index">
              <td>
                {{pro}}
              </td>
              <td>
                <MDBBtnClose white @click="removeProfession(index, pro)"/>
              </td>
            </tr>
            </tbody>
          </MDBTable>
        </div>

        <MDBBtn block color="primary" size="lg" style="margin-bottom: 20px;" @click="addProfessionPressed">Lisää ammatti</MDBBtn>

        <div v-if="isAddProfession" style="margin-top: 13px; margin-bottom: 20px;" >
          <Dropdown @change="changeNewProfession" v-model="selectedNewProfession" :options="proList"   filter optionLabel="label" optionGroupLabel="label" optionGroupChildren="items" placeholder="Valitse ammattilainen" class="w-full md:w-100rem">

            <template value="slotProps" >
              <div v-if="slotProps.value" >
                <div >{{ slotProps.value.label }}</div>
              </div>
              <span v-else>
              {{ slotProps.placeholder }}
            </span>
            </template>
            <template  #optiongroup="slotProps"  >
              <div style="" class="flex align-items-center">
                <div >{{ slotProps.option.label }}</div>
              </div>
            </template>
          </Dropdown>
        </div>

        <MDBBtn v-if="additionalProfession.length > 2" outline="success" block size="lg" @click="handleAddAdditionalProfession">Kinnita uus amet</MDBBtn>
        <!--      <MDBBtn outline="danger" block size="lg" style="margin-top: 20px;" @click="cancelEditProfession">Poistu</MDBBtn>-->
      </div>

    </MDBContainer>
  </div>

</template>

<script>


import {
  MDBContainer,
  MDBBtn,
  //MDBInput,
  MDBRow,
  MDBCol,
  MDBTable,
  //MDBIcon,
  MDBBtnClose
}from "mdb-vue-ui-kit";
import {ref} from "vue";
import list from '@/components/profession/proList'
import Dropdown from 'primevue/dropdown';
import '@/css/style.css'
import '@/css/pro.css'
export default {
  name: "editProfession",
  props: {
    provider: Object
  },
  components: {
    Dropdown,
    MDBContainer,
    MDBBtn,
    //MDBInput,
    MDBRow,
    MDBCol,
    MDBTable,
    //MDBIcon,
    MDBBtnClose
  },
  setup () {
    const profession = ref("")
    const selected = ref(null)
    const selectedNewProfession = ref(null)
    const isAddProfession = ref(false)
    const additionalProfession = ref("")
    const proList = ref(list)
    return {
      profession,
      selected,
      selectedNewProfession,
      isAddProfession,
      additionalProfession,
      proList
    }
  },
  methods: {
    changeCurrentProfession (index) {
      console.log("Selected xx " + index + " " + this.selected.label);
      this.$emit("editProfession", index, this.selected.label);
      this.selected = null;
    },
    changeNewProfession () {
      console.log("New new " + this.selectedNewProfession.label);
      this.isAddProfession = false;
      this.$emit("additionalProfession", this.selectedNewProfession.label);
      this.selectedNewProfession = null;
    },
    addProfessionPressed () {
      this.selectedNewProfession = "";
      this.isAddProfession = true;

      //this.$emit("add:profession", this.profession);
    },
    addNewProfession () {
      this.selectedNewProfession = "";
      const newProfession = document.getElementById("new_profession");

      newProfession.addEventListener("change", (event) => {

        this.isAddProfession = false;
        this.$emit("additionalProfession", event.target.value);

      })
      this.selectedNewProfession = "";

    },
    // If only one profession
    editProfession (index) {
      this.isAddProfession = false;
      const profession = document.getElementById("edit_profession");

      profession.addEventListener("change", (event) => {

        this.$emit("editProfession", index, event.target.value);
      })
      this.selected = "";
    },

    removeProfession (index, profession) {
      this.isAddProfession = false;
      this.$emit("removeProfession", index, profession);
      //this.selected = ""
      this.selected = null;
    },
    cancelEditProfession () {
      this.$emit("cancel:editProfession")
    },

    // cancelEdit () {
    //   console.log("Heiii")
    //   this.$emit('cancel:editPrice' , false)
    //   this.errorMessage = "Here is some error!"
    //
    // }
  }

}
</script>

<style scoped>

</style>