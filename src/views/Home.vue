<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawerRight" app clipped right>
      <v-list shaped>
        <v-list-item @click.stop="right = !right">
          <v-list-item-action>
            <v-icon>mdi-exit-to-app</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Open Temporary Drawer</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-subheader>
          <v-badge color="green" :content="completed.length">Completed DeadLines</v-badge>
        </v-subheader>
        <v-list-item v-for="(c,i) in completed" :key="c.id" @click="deadlineDetails(i)">
          <v-list-item-action>
            <v-icon>mdi-restart</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{c.name | capitalize(c.name)}}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app clipped-right color="blue" dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>DeadLine</v-toolbar-title>
      <v-spacer />
      <v-app-bar-nav-icon @click.stop="drawerRight = !drawerRight" />
      <v-btn @click="logout" color="light-blue">Logout</v-btn>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" clipped mini-variant.sync="true" app>
      <v-list>
        <v-list-item @click="addCLientsButton">
          <v-list-item-action>
            <v-icon>mdi-plus</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Add DeadLine</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="showCalenderView">
          <v-list-item-action>
            <v-icon>mdi-exit-to-app</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>DeadLines (Calendar)</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item @click="showSimpleView">
          <v-list-item-action>
            <v-icon>mdi-exit-to-app</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Deadlines (Simple View)</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click.stop="left = !left">
          <v-list-item-action>
            <v-icon>mdi-exit-to-app</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Send Completion Mail</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click.stop="left = !left">
          <v-list-item-action>
            <v-icon>mdi-exit-to-app</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Completed DeadLines</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-navigation-drawer v-model="left" fixed temporary>
      <v-list shaped>
        <v-subheader>All DeadLine</v-subheader>
        <v-list-item-group color="danger">
          <v-list-item v-for="(c) in clients" :key="c._id">
            <v-list-item-icon>
              <v-icon></v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{c.name | capitalize(c.name)}}</v-list-item-title>
            </v-list-item-content>
            <v-list-item-avatar>
              <v-img :src="c.avatar"></v-img>
            </v-list-item-avatar>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
    <allDeadline v-if="showCalender" :clients="clients"></allDeadline>

    <clients :clients="clients" :items="deadlineType" v-if="simpleView == true"></clients>
    <v-snackbar
      v-model="snackbar"
      :timeout="timeout"
      color="success"
      right
      bottom
      v-for="(c) in clients"
      :key="c._id"
    >{{c.name | capitalize(c.name)}} is in Progress</v-snackbar>
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card ref="form" v-model="valid" lazy-validation>
        <v-card-title>
          <span class="headline">New DeadLine</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  label="Name"
                  :rules="[v => !!v || 'Field is required']"
                  required
                  outlined
                  v-model="newDeadline.name"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  persistent-hint
                  outlined
                  :rules="[v => !!v || 'Field is required']"
                  auto-grow
                  label="Description"
                  hint="Describe the Job/Task/assignment"
                  v-model="newDeadline.description"
                ></v-textarea>
              </v-col>
              <v-col cols="12">
                <v-combobox
                  v-model="newDeadline.type"
                  :items="deadlineType"
                  label="DeadLine Type"
                  multiple
                  outlined
                  chips
                  :rules="[v => !!v || 'Field is required']"
                >
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
                <v-text-field label="Time" required type="time" outlined v-model="newDeadline.time"></v-text-field>
              </v-col>
              <v-expansion-panels>
                <v-expansion-panel>
                  <v-expansion-panel-header v-slot="{ open }">
                    <v-row no-gutters>
                      <v-col cols="12" class="text--secondary">
                        <v-fade-transition leave-absolute>
                          <span v-if="open">What Time do you want to end</span>
                          <v-row v-else no-gutters style="width: 100%">
                            <v-col cols="12">End date: {{ newDeadline.Currentdate || 'Not set' }}</v-col>
                          </v-row>
                        </v-fade-transition>
                      </v-col>
                    </v-row>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <v-row justify="space-around" no-gutters>
                      <v-col cols="12">
                        <v-menu
                          ref="startMenu"
                          :close-on-content-click="false"
                          :return-value.sync="newDeadline.Currentdate"
                          offset-y
                          min-width="290px"
                        >
                          <template v-slot:activator="{ on }">
                            <v-text-field
                              v-model="newDeadline.Currentdate"
                              label="End date"
                              prepend-icon="event"
                              readonly
                              outlined
                              v-on="on"
                              :rules="[v => !!v || 'Field is required']"
                            ></v-text-field>
                          </template>
                          <v-date-picker v-model="date" :min="minDate" no-title scrollable>
                            <v-spacer></v-spacer>
                            <v-btn
                              text
                              color="primary"
                              @click="$refs.startMenu.isActive = false"
                            >Cancel</v-btn>
                            <v-btn text color="primary" @click="$refs.startMenu.save(date)">OK</v-btn>
                          </v-date-picker>
                        </v-menu>
                      </v-col>
                    </v-row>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
              <!-- 
              <v-col cols="12" sm="6" md="4">
                <v-text-field label="Date" required readonly v-model="newDeadline.Currentdate"></v-text-field>
              </v-col>-->
            </v-row>
          </v-container>
          <!-- <small>*indicates required field</small> -->
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog = false">Close</v-btn>
          <v-btn color="blue darken-1" text @click="registerDeadline">Save</v-btn>
        </v-card-actions>
        <span class="spinner" v-show="inProgress">IN PROGRESS</span>
      </v-card>
    </v-dialog>
    <v-navigation-drawer v-model="right" fixed right temporary>
      <v-subheader>Details</v-subheader>
      <v-row dense v-for="(c) in detail" :key="c._id">
        <v-col>
          <v-card
            :cols="flex"
            extended
            raised
            style="margin-left:12px;margin-right:12px;padding:10px"
          >
            <p>Name => {{c.name | capitalize(c.name)}}</p>
            <p>Description => {{c.description | capitalize(c.description)}}</p>
            <p>Completed => {{new Date(c.date).toDateString()}} {{c.deadlineTime}}</p>
            <v-btn text color="primary">Restart</v-btn>
            <v-btn text color="danger">Delete</v-btn>
          </v-card>
        </v-col>
      </v-row>
      <div></div>
    </v-navigation-drawer>

    <v-footer app color="blue" class="white--text">
      <v-progress-linear
        :active="loading"
        :indeterminate="loading"
        absolute
        top
        height="10"
        color="red"
      ></v-progress-linear>
      <span>JoshLabs</span>
      <v-spacer />
      <span>&copy; 2020</span>
    </v-footer>
  </v-app>
</template>

<script>
import swal from "sweetalert";

import axios from "axios";
import clients from "../views/deadline";
import allDeadline from "../views/allDeadline";

export default {
  props: {
    source: String
  },
  components: {
    clients,
    allDeadline
    //    panel
  },

  data: () => ({
    inProgress: false,
    snackbar: false,
    date: "",
    simpleView: false,
    showCalender: false,
    snackbarText: "",
    counter: 0,
    impatientAxios: undefined,
    flex: 12,
    drawer: null,
    drawerRight: null,
    minDate: new Date().toISOString().substr(0, 10),
    right: false,
    left: false,
    dialog: false,
    deadlineType: ["Assignment", "Job", "Projects"],
    loggedinUser: "",
    newDeadline: {
      id: Date.now(),
      loggedinUser: "",
      name: "",
      type: "",
      description: "",
      Currentdate: "",
      time: ""
    },
    clients: "",
    loading: false,
    completed: "",
    detail: [],
    timeout: 10000,
    valid: false
  }),
  methods: {
    deadlineDetails(i) {
      this.right = true;
      this.checkDetails(i);
    },
    async delete(){
      
    },
    async checkDetails(i) {
      this.detail.push(this.completed[i]);
    },
    showCalenderView() {
      this.showCalender = true;
      this.simpleView = false;
      this.drawer = false;
    },
    showSimpleView() {
      this.simpleView = true;
      this.showCalender = false;
      this.drawer = false;
    },
    addCLientsButton() {
      (this.drawer = false), (this.dialog = true);
    },
    async getAllDeadline() {
      this.loading = true;
      try {
        const allClients = await this.$http.put(
          "/getDeadline",
          this.newDeadline
        );
        this.completed = allClients.data.completed;
        this.clients = allClients.data.deadlines;
        this.loading = false;
      } catch (error) {
        console.log(error);
      }
    },
    async registerDeadline(e) {
      e.preventDefault();
      this.loading = true;
      let p = this.newDeadline;
      if (p.name && p.description && p.type && p.Currentdate && p.time) {
        try {
          let response = await this.$http.post(
            "/newDeadline",
            this.newDeadline
          );

          let dat = response.data;
          if (dat) {
            this.dialog = false;
            this.loading = true;
            this.snackbar = true;
            swal("Success", "Deadline Added", "success");
            this.getAllDeadline();
          } else {
            swal(
              "Error",
              "Something Went Wrong, Check your Connection",
              "error"
            );
          }
        } catch (err) {
          let error = err.response;
          if (error.status == 409) {
            swal("Error", error.data.message, "error");
          } else {
            swal("Error", error.data.err.message, "error");
          }
        }
      } else {
        swal("Error", "All Fields are compulsory", "error");
      }
    },
    async logout() {
      swal({
        title: "Are you sure?",
        text: "Are you sure that you want to Logout?",
        icon: "warning",
        dangerMode: true
      }).then(logout => {
        if (logout) {
          try {
            //let response = await this.$http.get("/user/logout");
            localStorage.removeItem("jwt");
            swal("Logged Out", "You have successfully Logged out", "success");
            this.$router.push("/");
          } catch (err) {
            swal("Error", "Something Went Wrong", "error");
            console.log(err.response);
          }
        }
      });
    },
    async register() {
      try {
        this.$router.push("/register");
      } catch (err) {
        swal("Error", "Something Went Wrong", "error");
        console.log(err.response);
      }
    }
  },
  async mounted() {
    if (localStorage.getItem("jwt")) {
      this.loggedinUser = localStorage.getItem("jwt");
      this.newDeadline.loggedinUser = this.loggedinUser;
      this.getAllDeadline();
      setTimeout(() => {
        this.showCalenderView();
      }, 1000);
    }
  },
  async created() {
    this.impatientAxios = axios.create({
      timeout: 3000
    });
    await setInterval(() => {
      this.getAllDeadline();
    }, 5000);
  },
  watch: {
    right: {
      handler() {
        if (this.right == false) {
          this.detail = [];
          this.drawerRight = true;
          return;
        } else return;
      }
    },
    showCalender: {
      handler() {
        if (this.showCalender == true) {
          return this.simpleView == false;
        } else return;
      }
    },
    simpleView: {
      handler() {
        if (this.simpleView == true) {
          return this.showCalender == false;
        } else return;
      }
    }
  },
  filters: {
    capitalize(string) {
      var capitalFirst = string.charAt(0).toUpperCase();
      var noCaseTail = string.slice(1, string.length);
      return capitalFirst + noCaseTail;
    }
  }
};
</script>
<style scoped>
@keyframes spin {
  100% {
    transform: rotate(360deg);
  }
}
.spinner {
  width: 1em;
  height: 1em;
  padding-bottom: 12px;
  display: inline-block;
  animation: spin 2s linear infinite;
}
</style>