<template>

  <MDBContainer style="padding-top: 50px;">

    <div style="display: flex; justify-content: right; padding: 13px;">
      <MDBBtnClose
          white
          @click="backFromFeedbackClient"
      />
    </div>

    <warning-message
        :message = rateWarning
    />
    <error-message
        :message = ratingError
    />



    <div class="container mt-5">
      <MDBCard  text="white" bg="dark" class="p-4">
        <MDBCardBody >
          <h3  class="text-center mb-4">{{customer.company}} odottaa palautetta tarjoamastaan palvelusta!</h3>

          <div class="starContainer">
            <span
                v-for="star in 5"
                :key="star"
                @click="rating = star"
                style="font-size: 33px; cursor: pointer;"
                :class="star <= rating ? 'text-yellow' : 'text-gray'"
            >★</span>
          </div>

          <!-- Comment Box -->
          <MDBTextarea
              white
              v-if="rating > 0"
              v-model="feedbackContent"
              type="textarea"
              label="Anna haluttaessa arvostelua!"
              rows="3"
              class="mb-3"
          />

          <!-- Submit Button -->

          <button
              class="mt-4 w-full bg-blue-500 text-white py-2 rounded-md disabled:opacity-50"
              @click="confirmFeedback"
              :disabled="feedbackContent === '' && rating === 0"
          >
            Lähettää palaute
          </button>


        </MDBCardBody>

      </MDBCard><br>
      <p style="float: right; color: #e4548e; cursor: pointer;" @click="noRatingToConfirm">En halua antaa palautetta</p><br><br>
    </div>

  </MDBContainer>

</template>

<script>
/* eslint-disable */
import {
  MDBContainer,
  MDBBtn,
  MDBRow,
  MDBCol,
  MDBIcon,
  MDBBadge,
  MDBTextarea,
  MDBTable,
  MDBBtnClose,
    MDBCard,
    MDBCardBody,
    MDBInput,
    MDBRadio
} from 'mdb-vue-ui-kit'
import monthConverter from '../components/controllers/month-converter'
import warningMessage from "@/components/notifications/warningMessage";
import errorMessage from "@/components/notifications/errorMessage";
import recipientService from "@/service/recipients";
import providerService from "@/service/providers"
import clientHistoryService from "../../server/models/clientHistory"
import '@/css/notification.css';
import dateFormat from "dateformat";
export default {
  name: "Feedback",
  props: {
    customer: Object
  },
  components: {
    monthConverter,

    warningMessage,
    errorMessage,
    MDBContainer,
    MDBBtn,
    MDBRow,
    MDBCol,
    MDBIcon,
    MDBBadge,
    MDBTextarea,
    MDBTable,
    MDBBtnClose,
    MDBCard,
    MDBCardBody,
    MDBInput,
    MDBRadio
  },
  data () {
    return {
      author: null,
      fbc: {},
      isRatingGiven: false,
      isReview: false,
      ratedTimes: 0,
      isRatedPos: false,
      isRatedMinus: false,
      positiveRating: 0,
      negativeRating: 0,
      rateWarning: null,
      ratingError: null,

      feedbackContent: "",
      rating: 0,

    }
  },
  methods: {
    reload() {
      location.reload();
    },
    async getClient (id) {
      const bookings = await clientHistoryService.getClientHistory();
      const feedback = bookings.find(booking => booking.status === "no rated")
      this.positiveRating = feedback.rating.positive;
      this.negativeRating = feedback.rating.negative;
      this.fbc= feedback;

    },
    ratePlus () {
      this.isRated = true;
      console.log("Pos rating before " + this.positiveRating)
      if (!this.isRatedMinus) {
        this.ratedTimes+=1;

        if (this.ratedTimes === 1) {
          this.positiveRating = this.positiveRating + 1;
          console.log("Pos rating after " + this.positiveRating)
          this.isRatingGiven = true;
        } else {
          console.log("Not, only one time is allowed!")

          this.rateWarning = "Arvostella saa vain kerran!"
          setTimeout(() => {
            this.rateWarning = null;
          }, 3000);
        }
        this.isRatedPlus = true;
        this.isRatedMinus = false;
      } else {
        console.log("Not, only one time is allowed!")

        this.rateWarning = "Arvostella saa vain kerran!"
        setTimeout(() => {
          this.rateWarning = null;
        }, 3000);
      }

    },
    rateMinus () {
      this.isRated = true;

      if (!this.isRatedPlus) {
        this.ratedTimes += 1

        if (this.ratedTimes === 1) {
          this.negativeRating = this.negativeRating + 1;
          this.isRatingGiven = true;
        } else {

          this.rateWarning = "Arvostella saa vain kerran, negatiivisen tai positiivisen!"
          setTimeout(() => {
            this.rateWarning = null;
          }, 3000);
        }

        this.isRatedPlus = false;
        this.isRatedMinus = true;
      } else {
        this.rateWarning = "Arvostella saa vain kerran, negatiivisen tai positiivisen!"
        setTimeout(() => {
          this.rateWarning = null;
        }, 3000);
      }

    },

    async confirmFeedback () {
      const id = this.customer.proID;
      const now = new Date();
      const date = dateFormat(now, 'dd-mm-yyyy,  HH:MM')

      const posFeedback = {
        pos: date + ": " + "( " + this.author.username + " ) " +  this.feedbackContent
      }
      const negFeedback = {
        neg: date + ": " + "( " + this.author.username + " ) " + this.feedbackContent
      }
      const givenRating = {
        positive: this.rating,
        negative: this.negativeRating
      }
      if (this.feedbackContent.length > 0) {
        await providerService.addPositiveFeedback(id, posFeedback);
        this.feedbackContent = "";

      }
      // Add rating to provider to database
      await providerService.setPositiveRating(id, {star: this.rating});
      this.$emit("isRated", this.customer.proID, "rated", this.customer.company, givenRating)
      this.$router.go(-1)

    },
    noRatingToConfirm () {
      this.$emit("isRated", this.customer.proID, "no-rating", this.customer.company)
      this.$router.go(-1)
    },
    backFromFeedbackClient () {
      this.$router.go(-1);
    },

  },
  mounted () {
    //console.log("Customer data " + this.customer.ordered[0].rating.positive)

    const loggedUserJSON = window.localStorage.getItem('loggedAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      this.author = user;
      this.positiveRating = this.customer.rating.positive;
      this.negativeRating = this.customer.rating.negative;
    } else {
      this.$router.push('/')
    }
  }
}
</script>

<style>
.starContainer {
  display: flex;
  justify-content: space-around;

  margin-bottom: 13px;
}
.text-yellow {
  color: yellow;
}
.text-gray {
  color: gray;
}

.rating {
  padding: 20px;
}
</style>