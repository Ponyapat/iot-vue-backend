<script setup>
import { reactive } from "vue";
import { useRouter } from "vue-router";
import { mdiAccount, mdiAsterisk, mdiEmail } from "@mdi/js";
import FullScreenSection from "@/components/FullScreenSection.vue";
import CardComponent from "@/components/CardComponent.vue";
import CheckRadioPicker from "@/components/CheckRadioPicker.vue";
import Field from "@/components/Field.vue";
import Control from "@/components/Control.vue";
import Divider from "@/components/Divider.vue";
import JbButton from "@/components/JbButton.vue";
import JbButtons from "@/components/JbButtons.vue";
import axios from "axios";
import Swal from "sweetalert2";

const router = useRouter();

const form = reactive({
  username: "",
  email: "",
  password: "",
});

const submit = () => {
  axios
    .post("http://localhost:3000/api/auth/register", {
      name: form.username,
      username: form.username,
      email: form.email,
      password: form.password,
    })
    .then((r) => {
      console.log("success");
      Swal.fire({
        icon: "success",
        title: "สมัครสมาชิก สำเร็จ",
        showConfirmButton: 1,
        //timer: 3000,
      });
      router.push("/login");
    })
    .catch((error) => {
      console.log(error.response.data.message);
      if (error.response.data.message == "Error: User not registration!"){
        Swal.fire({
          icon: "warning",
          title: "มีผู้ใช้งานในระบบนี้แล้ว",
          showConfirmButton: 1
        });
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
        <div class="text-lg"><b>FarmWorld Register</b></div>
      </div>

      <field label="Username" help="Please enter your login">
        <control
          :icon="mdiAccount"
          name="login"
          autocomplete="username"
          required
          v-model="form.username"
        />
      </field>

      <field label="Email" help="Please enter your email">
        <control
          :icon="mdiEmail"
          type="email"
          name="email"
          autocomplete="email"
          required
          v-model="form.email"
        />
      </field>

      <field label="Password" help="Please enter your password">
        <control
          :icon="mdiAsterisk"
          type="password"
          name="password"
          autocomplete="current-password"
          required
          v-model="form.password"
        />
      </field>

      <divider />

      <jb-buttons>
        <jb-button type="submit" color="info" label="Register" />
      </jb-buttons>
      <div class="flex justify-end -mt-10">
        <a href="/login" class="text-sm"> Have an account? </a>
      </div>
    </card-component>
  </full-screen-section>
</template>
