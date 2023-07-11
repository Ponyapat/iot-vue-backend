<script setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import {
  mdiAccount,
  mdiAsterisk,
  mdiCheckboxMultipleMarkedCircleOutline,
} from "@mdi/js";
import FullScreenSection from "@/components/FullScreenSection.vue";
import CardComponent from "@/components/CardComponent.vue";
import CheckRadioPicker from "@/components/CheckRadioPicker.vue";
import Field from "@/components/Field.vue";
import Control from "@/components/Control.vue";
import Divider from "@/components/Divider.vue";
import JbButton from "@/components/JbButton.vue";
import JbButtons from "@/components/JbButtons.vue";
import Notification from "@/components/Notification.vue";
import axios from "axios";
import { useMainStore } from "@/stores/main";

const mainStore = useMainStore();

let ck_login = ref(0);

const form = reactive({
  username: "", //sonicnong@hotmail.com
  password: "", //123456
  remember: ["remember"],
});

const router = useRouter();

const submit = () => {
  ApiMain.post("/auth/login", {
    email: form.username,
    password: form.password,
  }).then((data) => {
    console.log(data.data.status);
    if (data.data.status == 200) {
      mainStore.setUser({
        name: data.data.user.name,
        email: data.data.user.email,
        avatar: '/images/avataaars.svg'
      });
      localStorage.setItem("tkfw", data.data.accessToken);
      localStorage.setItem("userid", data.data.user.id);

      //console.log("user.id",data.data.user.id);
      ApiMain.get("/users/" + data.data.user.id + "/profile", {
        headers: { 'Authorization': `Bearer ` + data.data.accessToken }
      })
        .then((res) => {
          localStorage.setItem("roleid", res.data.user.roleId);
          window.location.replace("/dashboard");
        }).catch((error) => {
          router.push("/login");
        });
      //router.push("/dashboard");
    } else {
      ck_login.value = 1;
    }
  })
    .catch((error) => {
      console.log("Fail");
      console.log(error.response.data.statusCode);
      if (error.response.data.statusCode == 400) {
        ck_login.value = 1;
      }
    });
};
</script>

<template>
  <full-screen-section v-slot="{ cardClass, cardRounded }" bg="login">
    <card-component :class="cardClass" :rounded="cardRounded" form @submit.prevent="submit">
      <div class="flex justify-center pb-2">
        <div>
          <img src="../assets/icons/axons_logo_light.svg" class="h-20 w-20" />
        </div>
      </div>
      <div v-if="ck_login" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-5 mt-2">
        <span class="block sm:inline">ไม่สามารถเข้าระบบได้ กรุณาเช็ค Useranme หรือ Password</span>
      </div>
      <div class="my-6">
        <label for="username" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
        <input type="text" id="username" v-model="form.username" autocomplete="username"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="firstname.abc@axonstech.com" required>
      </div>
      <div class="mb-6">
        <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
        <input type="password" id="password" v-model="form.password" autocomplete="current-password"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="••••••••" required>
      </div>
      <divider />
      <div class="flex flex-row justify-center items-center">
        <div class="w-1/2">
          <button type="submit"
            class=" bg-green-500  hover:bg-green-600 text-white text-base font-medium w-full p-2 rounded-lg">Sign
            In</button>
        </div>
      </div>
    </card-component>
  </full-screen-section>
</template>
