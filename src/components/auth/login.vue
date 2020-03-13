 <template>
  <v-app id="inspire" dark>
    <v-app-bar app clipped-right color="blue" dark>
      <!-- <v-app-bar-nav-icon @click.stop="drawer = !drawer" /> -->
      <v-toolbar-title>DeadLine</v-toolbar-title>
      <v-spacer />
      <!-- <v-app-bar-nav-icon @click.stop="drawerRight = !drawerRight" /> -->
      <!-- <v-btn @click="logout" color="light-blue">Logout</v-btn> -->
    </v-app-bar>
    <v-content>
      <v-container fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-card class="elevation-12">
              <v-toolbar color="primary" dark flat>
                <v-toolbar-title>Login</v-toolbar-title>
                <v-spacer />
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field
                    dark
                    label="Enter your e-mail address"
                    v-model="login.logemail"
                    :rules="emailRules"
                    required
                    autocomplete
                  ></v-text-field>
                  <v-text-field
                    label="Enter your password"
                    v-model="login.logpassword"
                    min="8"
                    :append-icon="visible ? 'visibility_off' : 'visibility'"
                    @click:append="() => (visible = !visible)"
                    :type="visible ? 'text' : 'password'"
                    :rules="passwordRules"
                    counter
                    required
                    autocomplete
                  ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <span>Dont have an Account <a href="/register">Sign up</a> </span>
                <v-spacer />
                <v-btn color="primary" @click="loginUser">Login</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import swal from "sweetalert";
export default {
  data() {
    return {
      login: {
        logemail: "",
        logpassword: ""
      },
      valid: false,
      visible: false,
      password: "",
      passwordRules: [v => !!v || "Password is required"],
      email: "",
      emailRules: [
        v => !!v || "E-mail is required",
        v =>
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
          "E-mail must be valid"
      ]
    };
  },
  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        this.loginUser();
      }
    },

    async register() {
      try {
        this.$router.push("/register");
      } catch (err) {
        swal("Error", "Something Went Wrong", "error");
        console.log(err.response);
      }
    },
    clear() {
      this.$refs.form.reset();
    },
    async loginUser() {
      try {
        let response = await this.$http.post("/", this.login);
        let token = response.data;

        if (token) {
          swal("Success", "Login Successful", "success");
          localStorage.setItem("jwt", token);
          this.$router.push("/home");
        }
      } catch (err) {
        swal("Error", "Login or Password is incorrect", "error");
        console.log(err.response);
      }
    }
  },
  created() {
    //this.$vuetify.theme.dark = true;
  }
};
</script>
<style scoped>
#app {
  background-size: cover;
  overflow: hidden;
}

.loginOverlay {
  background: rgba(33, 150, 243, 0.3);
}

.photoCredit {
  position: absolute;
  bottom: 15px;
  right: 15px;
}
</style>