<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-col cols="12" v-if="skeleton == true">
          <v-sheet
            elevation="6"
            class="mx-auto"
            max-width="12000"
            v-for="(n,i) in 4"
            :key="i"
            style="margin-bottom:20px"
          >
            <v-skeleton-loader class="mx-auto" max-width="12000" type="card" v-model="skeleton"></v-skeleton-loader>
          </v-sheet>
        </v-col>
        <v-card
          color="grey lighten-4"
          flat
          v-for="(c,i) in details"
          :key="i"
          style="margin-bottom:20px"
          raised
          extended
        >
          <v-toolbar dark color="blue">
            <v-toolbar-title>{{c.name | capitalize(c.name)}}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn @click="viewContact(i)" icon>
              <v-icon>mdi-eye</v-icon>
            </v-btn>
            <v-btn icon @click="editContact(i)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon>
              <v-icon>mdi-heart</v-icon>
            </v-btn>
            <v-btn icon>
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
            <!-- <v-checkbox
              v-model="c.completedDeadline"
              :label="`Completed: ${c.completedDeadline}`"
              style="margin-left:20px"
            ></v-checkbox>
            <v-btn
              style="margin-left:30px"
              color="light-blue"
              :ripple="true"
              @click="completedDeadline(i)"
              :disabled="c.completedDeadline == false"
              :hidden="!c.completedDeadline"
            >Update</v-btn>-->
          </v-toolbar>
          <v-card-text>
            <p style="text-align:center">
              <flip-countdown :deadline="c.remainingtime"></flip-countdown>
              <span v-html="c.description"></span>
            </p>
            <p style="text-align:center">
              Ends
              <kbd>{{new Date(c.date).toDateString()}}</kbd> by
              <kbd>{{c.deadlineTime}}</kbd>
            </p>
            <p style="text-align:center">
              <v-chip class="ma-2" color="green" text-color="white">
                <v-avatar left class="green darken-4">{{c.peopleInvolved.length}}</v-avatar>
                {{c.peopleInvolved.length > 1 ? 'People Involved' : 'Person Involved' }}
              </v-chip>
            </p>
          </v-card-text>
          <v-card-actions>
            <!-- <v-btn text color="secondary" @click="selectedOpen = false">Cancel</v-btn> -->
          </v-card-actions>
        </v-card>
        <v-snackbar v-model="snackbar" right bottom>{{snackbarText}}</v-snackbar>
      </v-col>
    </v-row>

    <v-dialog v-model="editCurrentContact" width="800px">
      <v-card v-for="(d , i) in editMode" :key="i">
        <v-card-title class="light-blue">Edit Deadline</v-card-title>
        <v-container>
          <v-row class="mx-2">
            <v-col cols="12">
              <v-text-field label="Name" required v-model="d.name"></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-textarea
                persistent-hint
                label="Description"
                hint="Describe the Job/Task/assignment"
                v-model="d.description"
              ></v-textarea>
            </v-col>
            <v-col cols="12">
              <v-combobox v-model="d.type" :items="items" label="DeadLine Type" multiple chips>
                <template v-slot:selection="data">
                  <v-chip
                    :key="JSON.stringify(data.item)"
                    v-bind="data.attrs"
                    :input-value="data.selected"
                    :disabled="data.disabled"
                    @click:close="data.parent.selectItem(data.item)"
                  >
                    <v-avatar
                      class="accent white--text"
                      left
                      v-text="data.item.slice(0, 1).toUpperCase()"
                    ></v-avatar>
                    {{ data.item }}
                  </v-chip>
                </template>
              </v-combobox>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-text-field label="Date" required type="date" v-model="d.date"></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-text-field label="Time" required type="time" v-model="d.deadlineTime"></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-btn @click="addpeople = true" color="light-blue">ADD PEOPLE</v-btn>
            </v-col>
            <v-col cols="12">
              <p>{{d.peopleInvolved.length}} People are involved</p>
            </v-col>
          </v-row>
        </v-container>
        <v-card-actions>
          <!-- <v-btn text color="primary">More</v-btn> -->
          <v-spacer />
          <v-btn text color="primary" @click="editCurrentContact = false">Cancel</v-btn>
          <v-btn text @click="update(i)">Save</v-btn>
          <!-- <v-btn text @click="findindex">Save</v-btn> -->
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="addpeople" width="500px" height="200px">
      <v-card>
        <v-card-title class="grey darken-2">ADD PEOPLE</v-card-title>
        <v-container>
          <v-row class="mx-2">
            <v-col cols="12">
              <v-text-field label="Name" required v-model="peoples.name"></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field label="Email" type="email" required v-model="peoples.email"></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-autocomplete
                :items="relationships"
                label="Relationship"
                multiple
                required
                v-model="peoples.relationship"
              ></v-autocomplete>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-text-field
                label="Phone Number"
                type="number"
                min="11"
                required
                v-model="peoples.phonenumber"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
        <v-card-actions>
          <!-- <v-btn text color="primary">More</v-btn> -->
          <v-spacer />
          <v-btn text color="primary" @click="addpeople = false">Cancel</v-btn>
          <v-btn text @click="test">Save</v-btn>
          <!-- <v-btn text @click="findindex">Save</v-btn> -->
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="viewCurrentContact" width="3000px" height="1000px">
      <v-card v-for="(details , i) in clientD" :key="i">
        <v-card-title class="grey darken-2">Deadline Details</v-card-title>
        <v-container>
          <v-row class="mx-2">
            <v-col class="align-center justify-space-between" cols="12">
              <v-row align="center" class="mr-0">
                <v-avatar size="40px" class="mx-3">
                  <img src="//ssl.gstatic.com/s2/oz/images/sge/grey_silhouette.png" alt />
                </v-avatar>
                <v-text-field placeholder="Name" v-model="details.name" />
              </v-row>
            </v-col>
            <v-col cols="12">
              <v-text-field placeholder="age" v-model="details.age" />
            </v-col>
            <v-col cols="12">
              <v-text-field
                type="email"
                prepend-icon="mdi-mail"
                placeholder="Email"
                v-model="details.email"
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                type="number"
                prepend-icon="mdi-phone"
                placeholder="(000) 000 - 0000"
                v-model="details.phonenumber"
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                prepend-icon="mdi-text"
                placeholder="description"
                v-model="details.description"
              />
            </v-col>
          </v-row>
        </v-container>
        <v-card-actions>
          <v-btn text color="primary">More</v-btn>
          <v-spacer />
          <v-btn text color="primary" @click="viewCurrentContact = false">Cancel</v-btn>
          <!-- <v-btn text @click="update(i)">Save</v-btn> -->
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import swal from "sweetalert";
import moment from "moment";
import FlipCountdown from "vue2-flip-countdown";

var timeLeft;
export default {
  props: ["clients", "items"],
  components: { FlipCountdown },
  data: () => ({
    flex: 12,
    loading: false,
    fab: false,
    editCurrentContact: false,
    viewCurrentContact: false,
    reg: {
      loggedinUser: ""
    },
    timeTillDate: "",
    timeFormat: "YYYY MM DD, h:mm a",
    newDetails: {
      loggedinUser: "",
      newClientName: "",
      newClientAge: "",
      newClientEmail: "",
      newClientPhoneNumber: "",
      newClientDescription: "",
      Currentdate: new Date()
    },
    relationships: [
      "Friend",
      "Coleugue",
      "Teacher",
      "Team mate",
      "Class mate",
      "Family",
      "Team leader",
      "Course Reps"
    ],
    peoples: {
      name: "",
      email: "",
      phonenumber: "",
      relationship: ""
    },
    addpeople: false,
    days: "",
    hours: "",
    minutes: "",
    seconds: "",
    currentId: "",
    clientindex: "",
    details: "",
    clientD: [],
    editMode: [],
    //interval: ""
    timeLeft: [],
    completed: false,
    showss: false,
    snackbarText: "",
    snackbar: true,
    overlay: true,
    skeleton: false
  }),
  methods: {
    async test() {
      this.editMode[0].peopleInvolved.push(this.peoples);

      this.update();
    },
    stillCounting(diff, i) {
      for (let i = 0; i < this.details.length; i++) {
        const e = this.details[i];
        return (e.secondLeft = diff);
      }
      diff == 120 ? console.log("2 Minutes Remaining") : console.log();
      //this.details[i].secondLeft = diff
    },
    view(i) {
      this.details[i].showss = !this.details[i].showss;
    },
    completedTime(i) {
      console.log("completed time");
      this.details[i].completedDeadline = true;
      this.snackbar = true;
      this.snackbarText = `${this.details[i].name} is Closed`;
      setTimeout(() => {
        this.details[i].completedDeadline = true;
        this.completedDeadline(i);
        console.log("updated time");
      }, 2000);
    },
    async completedDeadline(i) {
      this.loading = true;
      this.showss = false;
      try {
        const el = this.details[i];
        el.loggedinUser = localStorage.getItem("jwt");
        if (el.completedDeadline == true) {
          let post = await this.$http.post("/update", el);
          let dat = post.data;
          if (dat) {
            this.editCurrentContact = false;
            this.loading = false;

            //location.reload(true);
            swal("Success", "Completed", "success");
            this.getAllClients();
          } else {
            swal("Error", "Something Went Wrong with Updating", "error");
          }
          return;
        } else {
          console.log("must be true");
        }
      } catch (errors) {
        console.log("errr", errors);
        let error = err.response;
        if (error.status == 409) {
          swal("Error", error.data.message, "error");
        } else {
          swal("Error", error.data.err.message, "error");
        }
      }
    },
    async deleteCompletedDeadline(i) {},
    async getAllClients() {
      //this.skeleton = true
      try {
        let allClients = await this.$http.put("/getDeadline", this.reg);
        this.getdeadline();
        this.details = allClients.data.deadlines;
        this.loading = false;
        this.skeleton = false;
        for (let i = 0; i < this.details.length; i++) {
          const el = this.details[i];
          if (this.details.length > 0) {
            return;
          }

          el.showss = false;
        }
      } catch (error) {
        console.log(error);
        this.loading = true;
        this.skeleton = true;
      }
    },

    async getdeadline(i, j) {
      for (let i = 0; i < this.details.length; i++) {
        const e = this.details[i];

        const date = e.date;
        const time = e.deadlineTime;
        this.timeLeft.push({
          date: `${date} ${time}`
        });
      }
    },
    async checkDetails(i, j) {
      this.clientD.push(this.details[i]);
    },

    async clientDetails(i) {
      try {
        this.loggedinUser = localStorage.getItem("jwt");
        let post = await this.$http.put("/client", {
          id: this.$route.params.id,
          enemail: this.loggedinUser
        });
        this.editMode.push(post.data.deadlines[i]);
      } catch (error) {
        console.log("errr", error);
      }
    },
    async editContact(i) {
      this.editCurrentContact = true;
      //this.checkDetails(i)
      this.clientDetails(i);
    },

    async update() {
      try {
        this.editMode[0].loggedinUser = localStorage.getItem("jwt");
        let post = await this.$http.post("/update", this.editMode[0]);

        let dat = post.data;

        if (dat) {
          this.editCurrentContact = false;
          this.addpeople = false;
          swal("Success", "Update Was successful", "success");
          this.getAllClients();
        } else {
          swal("Error", "Something Went Wrong with Updating", "error");
        }
      } catch (errors) {
        console.log("errr", errors);
        let error = err.response;
        if (error.status == 409) {
          swal("Error", error.data.message, "error");
        } else {
          swal("Error", error.data.err.message, "error");
        }
      }
    },
    async viewContact(i) {
      this.viewCurrentContact = true;
      this.checkDetails(i);
    }
  },
  filters: {
    capitalize(string) {
      var capitalFirst = string.charAt(0).toUpperCase();
      var noCaseTail = string.slice(1, string.length);
      return capitalFirst + noCaseTail;
    }
  },
  async mounted() {
    this.getAllClients();
    this.getdeadline();
    if (localStorage.getItem("jwt")) {
      this.loggedinUser = localStorage.getItem("jwt");
      this.reg.loggedinUser = this.loggedinUser;
    }
  },
  watch: {
    editCurrentContact: {
      handler() {
        if (this.editCurrentContact == false) {
          this.clientD.pop();
          this.editMode = [];
        } else return;
      }
    },
    viewCurrentContact: {
      handler() {
        if (this.viewCurrentContact == false) {
          this.clientD.pop();
        } else return;
      }
    }
  },
  async created() {
    await setInterval(() => {
      this.getAllClients();
    }, 5000);
  }
};
</script>
<style scoped>
* {
  box-sizing: border-box;
}

body {
  font-family: "Lato", sans-serif;
}

h1 {
  letter-spacing: 2px;
  text-align: center;
  text-transform: uppercase;
}

.countdown-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
}

.countdown-item {
  color: #111;
  font-size: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  line-height: 30px;
  margin: 10px;
  padding-top: 10px;
  position: relative;
  width: 100px;
  height: 100px;
}

.countdown-item span {
  color: #333;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}
</style>