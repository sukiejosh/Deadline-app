<template>
  <v-layout justify-center>
    <v-flex xs12 sm8 md6>
      <v-app-bar app clipped-right color="blue" dark>
        <!-- <v-app-bar-nav-icon @click.stop="drawer = !drawer" /> -->
        <v-toolbar-title>DeadLine</v-toolbar-title>
        <v-spacer />
        <!-- <v-app-bar-nav-icon @click.stop="drawerRight = !drawerRight" /> -->
        <!-- <v-btn @click="logout" color="light-blue">Logout</v-btn> -->
      </v-app-bar>

      <v-form v-model="valid" full-width ref="form" lazy-validation @submit="register">
        <v-text-field v-model="form.name" label="Enter Name:" :rules="[rules.required]"></v-text-field>
        <v-text-field
          v-model="form.email"
          type="email"
          label="Enter email address:"
          :rules="[rules.required]"
        ></v-text-field>
        <v-text-field
          v-model="form.password"
          :append-icon="visible ? 'visibility_off' : 'visibility'"
          @click:append="() => (visible = !visible)"
          :type="visible ? 'text' : 'password'"
          label="Enter password:"
          :rules="[rules.required, rules.password]"
        ></v-text-field>
        <v-text-field
          v-model="form.passwordConf"
          :append-icon="visible ? 'visibility_off' : 'visibility'"
          @click:append="() => (visible = !visible)"
          :type="visible ? 'text' : 'password'"
          label="Confirm password:"
          :rules="[rules.required, rules.password]"
        ></v-text-field>

        <v-btn type="submit" :disabled="!valid">Register</v-btn>
      </v-form>
    </v-flex>
  </v-layout>
</template>

<script>
import swal from "sweetalert";
export default {
  data() {
    return {
      valid: true,
      visible: false,
      message: "Looks Good",
      error: "Not Good",
      form: {
        email: "",
        password: "",
        name: "",
        passwordConf: ""
      },
      emailCheck: "",
      rules: {
        required: v => !!v || "Required.",
        email: v => v === this.form.email || "Please check your email address.",
        password: v =>
          /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/.test(v) ||
          "Password must contain at least one lowercase, one uppercase, one number, one special character, and must have between 8 and 35 characters"
      }
    };
  },
  methods: {
    async register(e) {
      e.preventDefault();

      if (this.$refs.form.validate()) {
        try {
          const newLocal = "/";
          let response = await this.$http.post(newLocal, this.form);
          let token = response.data;
          if (token) {
            localStorage.setItem("jwt", token);
            this.$router.push("/");
            swal("Success", "Registration Was successful", "success");
          } else {
            swal("Error", "Something Went Wrong", "Error");
          }
        } catch (err) {
          let error = err.response;
          if (error.status == 409) {
            swal("Error", error.data.message, "error");
          } else {
            swal("Error", error.data.err.message, "error");
          }
        }
      }
    }
  }
};
</script>
