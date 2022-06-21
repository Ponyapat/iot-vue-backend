<script setup>
import { reactive } from "vue";
import { useRouter } from "vue-router";
import { mdiAccount, mdiAsterisk } from "@mdi/js";
import FullScreenSection from "@/components/FullScreenSection.vue";
import CardComponent from "@/components/CardComponent.vue";
import CheckRadioPicker from "@/components/CheckRadioPicker.vue";
import Field from "@/components/Field.vue";
import Control from "@/components/Control.vue";
import Divider from "@/components/Divider.vue";
import JbButton from "@/components/JbButton.vue";
import JbButtons from "@/components/JbButtons.vue";

const form = reactive({
  login: "Demo",
  pass: "123456",
  remember: ["remember"],
});

const router = useRouter();

const submit = () => {
  router.push("/dashboard");
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
        <img 
        src="/logo.png"
        class="h-20" 
        />
        </div>
      </div>

      <div class="flex justify-center pb-2">
        <div class="text-lg"><b>FarmWorld Login</b></div>
      </div>

      
      <field label="Username" help="Please enter your login">
        <control
          v-model="form.login"
          :icon="mdiAccount"
          name="login"
          autocomplete="username"
        />
      </field>

      <field label="Password" help="Please enter your password">
        <control
          v-model="form.pass"
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
