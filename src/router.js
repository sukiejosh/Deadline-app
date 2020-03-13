import Vue from "vue";
import VueRouter from "vue-router";
import Home from "./views/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/home",
    name: "home",
    component: Home,
    meta: { requiresAuth: true }
  },
  {
    path: "/",
    name: "login",
    component: () => import("./views/login.vue")
  },
  {
    path: "/register",
    name: "register",
    component: () => import("./views/register.vue"),
    meta: { notLoggedIn: true }
  },
  {
    path: "/clients",
    name: "clients",
    component: () => import("./views/deadline.vue"),
    meta: { notLoggedIn: true }
  },
  {
    path: '/viewclient/:id',
    name: 'ViewPost',
    component: () => import("./views/ViewClient.vue"),
    // meta: { requiresAuth: true }
  },
  {
    path: '*',
    redirect: '/'
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});



router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (localStorage.getItem("jwt") == null) {
      next({
        path: '/login'
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.notLoggedIn)) {
    if (localStorage.getItem("jwt") == null) {
      next()
    } else {
      next({
        path: '/home'
      })
    }
  } else {
    next()
  }
})

export default router;
