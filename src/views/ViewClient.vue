<template>
  <v-container fluid>
    <v-row dense>
      <v-col v-for="(c,i) in clients" :key="i" cols="12">
        <v-card>
          <v-img
            class="white--text align-end"
            gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
            height="100px"
          ></v-img>
          <v-card-title v-text="c.name.toUpperCase()"></v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn icon>
              <v-icon>mdi-heart</v-icon>
            </v-btn>

            <v-btn icon>
              <v-icon>mdi-bookmark</v-icon>
            </v-btn>

            <v-btn icon>
              <v-icon>mdi-share-variant</v-icon>
            </v-btn>

            <v-btn @click="editContact(i)" icon>
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog v-model="editCurrentContact" width="800px">
      <v-card>
        <v-card-title class="grey darken-2">Add Clients</v-card-title>
        <v-container>
          <v-row class="mx-2">
            <v-col class="align-center justify-space-between" cols="12">
              <v-row align="center" class="mr-0">
                <v-avatar size="40px" class="mx-3">
                  <img src="//ssl.gstatic.com/s2/oz/images/sge/grey_silhouette.png" alt />
                </v-avatar>
                <v-text-field placeholder="Name" v-model="newDetails.newClientName" />
              </v-row>
            </v-col>
            <v-col cols="12">
              <v-text-field placeholder="age" v-model="newDetails.newClientAge" />
            </v-col>
            <v-col cols="12">
              <v-text-field
                type="email"
                prepend-icon="mdi-mail"
                placeholder="Email"
                v-model="newDetails.newClientEmail"
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                type="number"
                prepend-icon="mdi-phone"
                placeholder="(000) 000 - 0000"
                v-model="newDetails.newClientPhoneNumber"
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                prepend-icon="mdi-text"
                placeholder="description"
                v-model="newDetails.newClientDescription"
              />
            </v-col>
          </v-row>
        </v-container>
        <v-card-actions>
          <v-btn text color="primary">More</v-btn>
          <v-spacer />
          <v-btn text color="primary" @click="editCurrentContact = false">Cancel</v-btn>
          <v-btn text @click="registerClient">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>


<script>
export default {
  name: "ViewPost",
  
  data() {
    return {
      valid: true,
      loggedinUser: "",
      form: "",
      rules: {
        required: v => !!v || "Required."
      }
    };
  },
  methods: {
    async editPost(e) {
      e.preventDefault();
      this.$store.dispatch("setError", null);
      this.$store.dispatch("setMessage", null);
      if (this.$refs.form.validate()) {
        try {
          const editPostResponse = await AppService.editPost(this.form);
          this.$store.dispatch(
            "setMessage",
            editPostResponse.data.message + " ... Redirecting"
          );
          setTimeout(() => {
            this.$router.push({ name: "Dashboard" });
          }, 2000);
        } catch (e) {
          this.$store.dispatch("setError", e.response.data.message);
        }
      }
    }
  },
  async mounted() {
    try {
      this.loggedinUser = localStorage.getItem("jwt");
      const post = await this.$http.put("/client", {
        id: this.$route.params.id,
        enemail: this.loggedinUser
      });
      console.log("post", post.data.clients[this.$route.params.id]);
      this.form = post;
      console.log("form", this.form);
    } catch (error) {
      console.log("errr", error);
    }
  }
};
</script>

<style lang="css">
</style>
