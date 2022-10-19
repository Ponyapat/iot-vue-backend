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
  username: "sonicnong@hotmail.com",
  password: "123456",
  remember: ["remember"],
});

const router = useRouter();

const submit = () => {
  axios
    .post(import.meta.env.VITE_API_MAIN+"/auth/login", {
      email: form.username,
      password: form.password,
    })
    .then((data) => {
      //console.log(data.data);
      if (data.data.status == 200) {
        mainStore.setUser({
          name: data.data.user.name,
          email: data.data.user.email,
          avatar: 'https://avatars.dicebear.com/api/avataaars/example.svg?options[top][]=shortHair&options[accessoriesChance]=93'
        });
        localStorage.setItem("tkfw", data.data.accessToken);
        localStorage.setItem("userid", data.data.user.id);
        router.push("/dashboard");
      }else{
        ck_login.value = 1;
      }
    })
    .catch((error) => {
      //console.log("Fail");
      //console.log(error.response.data.statusCode);
      if (error.response.data.statusCode == 400) {
        ck_login.value = 1;
      }
    });
};
</script>

<template>
  <full-screen-section v-slot="{ cardClass, cardRounded }" bg="login">
    <card-component
      :class="cardClass"
      :rounded="cardRounded"
      form
      @submit.prevent="submit"
    >
      <div class="flex justify-center pb-2">
        <div>
          <img src="/logo.png" class="h-20" />
        </div>
      </div>

      <div class="flex justify-center pb-2">
        <div class="text-lg"><b>FarmWorld Login</b></div>
      </div>

      <div
        v-if="ck_login"
        class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-5 mt-2"
      >
        <span class="block sm:inline"
          >ไม่สามารถเข้าระบบได้ กรุณาเช็ค Useranme หรือ Password</span
        >
      </div>

      <field label="Username" help="Please enter your login">
        <control
          v-model="form.username"
          :icon="mdiAccount"
          name="login"
          autocomplete="username"
        />
      </field>

      <field label="Password" help="Please enter your password..">
        <control
          v-model="form.password"
          :icon="mdiAsterisk"
          type="password"
          name="password"
          autocomplete="current-password"
        />
      </field>

      <check-radio-picker
        v-model="form.remember"
        name="remember"
        :options="{ remember: 'Remember' }"
      />

      <divider />

      <jb-buttons>
        <jb-button type="submit" color="info" label="Login" />
        <jb-button to="/register" color="info" outline label="Sing up" />
      </jb-buttons>
    </card-component>
  </full-screen-section>
</template>
