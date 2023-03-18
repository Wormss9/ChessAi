import { createApp } from "vue";
import App from "./App.vue";
import Vue3Toastify, { toast } from "vue3-toastify";

createApp(App)
  .use(Vue3Toastify, {
    autoClose: 3000,
    position: toast.POSITION.TOP_CENTER,
    className: "foo-bar",
    theme: "dark",
  })
  .mount("#app");
