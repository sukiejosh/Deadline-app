<template>
  <v-row class="fill-height">
    <v-col>
      <v-sheet height="64">
        <v-toolbar flat color="white">
          <v-btn outlined class="mr-4" color="grey darken-2" @click="setToday">Today</v-btn>

          <v-spacer></v-spacer>
          <v-menu bottom right>
            <template v-slot:activator="{ on }">
              <v-btn outlined color="grey darken-2" v-on="on">
                <span>{{ typeToLabel[type] }}</span>
                <v-icon right>mdi-menu-down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="type = 'day'">
                <v-list-item-title>Day</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'week'">
                <v-list-item-title>Week</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'month'">
                <v-list-item-title>Month</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = '4day'">
                <v-list-item-title>4 days</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-toolbar>
      </v-sheet>
      <v-row justify="center">
        <div style="text-align:center">
          <p>{{title}}</p>
          <v-btn fab text small color="grey darken-2" @click="prev">
            <v-icon small>mdi-chevron-left</v-icon>
          </v-btn>
          <v-btn fab text small color="grey darken-2" @click="next">
            <v-icon small>mdi-chevron-right</v-icon>
          </v-btn>
        </div>
      </v-row>
      <v-sheet height="600">
        <v-calendar
          ref="calendar"
          v-model="focus"
          color="primary"
          :events="events"
          :event-color="getEventColor"
          :now="today"
          :type="type"
          @click:event="showEvent"
          @click:more="viewDay"
          @click:date="viewDay"
          @change="updateRange"
        ></v-calendar>
        <v-menu
          v-model="selectedOpen"
          :close-on-content-click="false"
          :activator="selectedElement"
          offset-y
        >
          <v-card color="grey lighten-4" flat>
            <v-toolbar :color="selectedEvent.color" dark>
              <v-btn icon @click="editContact">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon>
                <v-icon>mdi-heart</v-icon>
              </v-btn>
              <v-btn icon>
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </v-toolbar>
            <v-card-text>
              <p style="text-align:center">
                <flip-countdown :deadline="selectedEvent.end"></flip-countdown>
                <span v-html="selectedEvent.description"></span>
              </p>
              <p style="text-align:center">
                Ends
                <kbd>{{new Date(selectedEvent.date).toDateString()}}</kbd> by
                <kbd>{{selectedEvent.deadlineTime}}</kbd>
              </p>
            </v-card-text>
            <v-card-actions>
              <v-btn text color="secondary" @click="selectedOpen = false">Cancel</v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-sheet>
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
                <v-combobox
                  v-model="d.type"
                  :items="deadlineType"
                  label="DeadLine Type"
                  multiple
                  chips
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
    </v-col>
  </v-row>
</template>
<script>
import FlipCountdown from "vue2-flip-countdown";
import swal from "sweetalert";
export default {
  props: ["clients"],
  components: {
    FlipCountdown
  },
  data: () => ({
    focus: "",
    type: "month",
    typeToLabel: {
      month: "Month",
      week: "Week",
      day: "Day",
      "4day": "4 Days"
    },
    editCurrentContact: false,
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
    deadlineType: ["Assignment", "Job", "Projects"],
    peoples: {
      name: "",
      email: "",
      phonenumber: "",
      relationship: ""
    },
    editMode: [],
    addpeople: false,
    today: undefined,
    start: null,
    end: null,
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    events: [],
    colors: [
      "blue",
      "indigo",
      "deep-purple",
      "cyan",
      "green",
      "orange",
      "grey darken-1"
    ],
    names: [
      "Meeting",
      "Holiday",
      "PTO",
      "Travel",
      "Event",
      "Birthday",
      "Conference",
      "Party"
    ],
    details: "",
    reg: {
      loggedinUser: ""
    }
  }),
  computed: {
    title() {
      const { start, end } = this;
      if (!start || !end) {
        return "";
      }

      const startMonth = this.monthFormatter(start);
      const endMonth = this.monthFormatter(end);
      const suffixMonth = startMonth === endMonth ? "" : endMonth;

      const startYear = start.year;
      const endYear = end.year;
      const suffixYear = startYear === endYear ? "" : endYear;

      const startDay = start.day + this.nth(start.day);
      const endDay = end.day + this.nth(end.day);

      switch (this.type) {
        case "month":
          return `${startMonth} ${startYear}`;
        case "week":
        case "4day":
          return `${startMonth} ${startDay} ${startYear} - ${suffixMonth} ${endDay} ${suffixYear}`;
        case "day":
          return `${startMonth} ${startDay} ${startYear}`;
      }
      return "";
    },
    monthFormatter() {
      return this.$refs.calendar.getFormatter({
        timeZone: "UTC",
        month: "long"
      });
    }
  },
  mounted() {
    this.$refs.calendar.checkChange();
    if (localStorage.getItem("jwt")) {
      this.loggedinUser = localStorage.getItem("jwt");
      this.reg.loggedinUser = this.loggedinUser;
      this.getAllClients();
      this.getEvents();
    }
  },
  async created() {
    await setInterval(() => {
      this.getAllClients();
      this.getEvents();
    }, 5000);
    //this.updateRange();
  },
  methods: {
    viewDay({ date }) {
      this.focus = date;
      this.type = "day";
    },
    getEventColor(event) {
      return event.color;
    },
    setToday() {
      this.focus = this.today;
    },
    prev() {
      this.$refs.calendar.prev();
    },
    next() {
      this.$refs.calendar.next();
    },
    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event;
        this.selectedElement = nativeEvent.target;
        setTimeout(() => (this.selectedOpen = true), 10);
      };

      if (this.selectedOpen) {
        this.selectedOpen = false;
        setTimeout(open, 10);
      } else {
        open();
      }

      nativeEvent.stopPropagation();
    },
    async getAllClients() {
      //this.skeleton = true
      try {
        let allClients = await this.$http.put("/getDeadline", this.reg);
        this.details = allClients.data.deadlines;
      } catch (error) {
        console.log(error);
        this.loading = true;
        this.skeleton = true;
      }
    },
    async test() {
      try {
        this.editMode[0].peopleInvolved.push(this.peoples);
        this.update();
        swal("Success", "Updated Successfully", "success");
        this.addpeople = false;
      } catch (error) {}
    },
    updateRange({ start, end }) {
      this.start = start;
      this.end = end;
    },
    async getEvents() {
      const events = [];

      for (let i = 0; i < this.details.length && i < this.colors.length; i++) {
        const e = this.details[i];
        const el = this.colors[this.rnd(0, this.colors.length - 1)];
        const formatFirstDate = e.calenderStartTime.substr(0, 10);
        const formatFirstTime = e.calenderStartTime.substr(11, 5);
        const firstTime = new Date(`${formatFirstDate} ${formatFirstTime}`);
        const formatSecondDate = e.calenderEndTime.substr(0, 10);
        const formatSecondTime = e.calenderEndTime.substr(11, 5);
        const secondTime = new Date(`${formatSecondDate} ${formatSecondTime}`);

        // this.colors[this.rnd(0, this.colors.length - 1)],

        events.push({
          name: e.name,
          start: this.formatDate(firstTime, true),
          end: this.formatDate(secondTime, true),
          color: el,
          description: e.description,
          date: e.date,
          deadlineTime: e.deadlineTime,
          type: e.type,
          peopleInvolved: e.peopleInvolved,
          id: e.id
        });
      }
      this.events = events;
    },
    async update() {
      try {
        this.editMode[0].loggedinUser = localStorage.getItem("jwt");
        let post = await this.$http.post("/update", this.editMode[0]);

        let dat = post.data;

        if (dat) {
          this.editCurrentContact = false;
          this.addpeople = false;
          // this.updateRange();
          swal("Success", "Update Was successful", "success");
          this.getAllClients();
        } else {
          swal("Error", "Something Went Wrong with Updating", "Error");
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
    editContact() {
      this.editMode.push(this.selectedEvent);
      this.editCurrentContact = true;
    },
    nth(d) {
      return d > 3 && d < 21
        ? "th"
        : ["th", "st", "nd", "rd", "th", "th", "th", "th", "th", "th"][d % 10];
    },
    rnd(a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a;
    },
    formatDate(a, withTime) {
      return withTime
        ? `${a.getFullYear()}-${a.getMonth() +
            1}-${a.getDate()} ${a.getHours() + 1}:${a.getMinutes()}`
        : `${a.getFullYear()}-${a.getMonth() + 1}-${a.getDate()}`;
    }
  },
  watch: {
    editCurrentContact: {
      deep: true,
      immediate: true,
      handler: function() {
        if (this.editCurrentContact == false) {
          return (this.editMode = []);
        } else return;
      }
    }
  }
};
</script>