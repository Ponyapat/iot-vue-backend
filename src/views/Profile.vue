<script setup>
import { ref, reactive } from "vue";
import { useMainStore } from "@/stores/main";
import {
  mdiAccount,
  mdiAccountCircle,
  mdiLock,
  mdiMail,
  mdiAsterisk,
  mdiFormTextboxPassword,
} from "@mdi/js";
import MainSection from "@/components/MainSection.vue";
import CardComponent from "@/components/CardComponent.vue";
import TitleBar from "@/components/TitleBar.vue";
import Divider from "@/components/Divider.vue";
import Field from "@/components/Field.vue";
import Control from "@/components/Control.vue";
import FilePicker from "@/components/FilePicker.vue";
import JbButton from "@/components/JbButton.vue";
import JbButtons from "@/components/JbButtons.vue";
import UserCard from "@/components/UserCard.vue";
import Notification from "@/components/Notification.vue";
import axios from "axios";
import Swal from "sweetalert2";

const mainStore = useMainStore();

const titleStack = ref(["Admin", "Profile"]);

const ck_edit = ref(0);

const profileForm = reactive({
  name: mainStore.userName,
  username: mainStore.userName,
  email: mainStore.userEmail,
});

const passwordForm = reactive({
  password_current: "",
  password: "",
  password_confirmation: "",
});

const submitProfile = () => {
  const token = localStorage.getItem("tkfw");
  const userid = localStorage.getItem("userid");
  axios
    .put(
      import.meta.env.VITE_API_ENDPOINT + "/api/users/" + userid + "/profile",
      profileForm,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    )
    .then((data) => {
      console.log(data);
      mainStore.setUser(profileForm);
      Swal.fire({
        icon: "success",
        title: "แก้ไขข้อมูล Profile สำเร็จ",
        timer: 2000,
        showConfirmButton: 1,
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

const submitPass = () => {
  const token = localStorage.getItem("tkfw");
  if(passwordForm.password != passwordForm.password_confirmation){
     Swal.fire({
        icon: "warning",
        title: "รหัสผ่านใหม่ไม่ตรงกัน",
        timer: 3000,
        showConfirmButton: 1,
      });
      return false

  }else{
    console.log(passwordForm.password)
    console.log(passwordForm.password_confirmation)
      axios.post(import.meta.env.VITE_API_ENDPOINT+"/api/auth/change-password", {
        email: profileForm.email,
        password: passwordForm.password,
      },{
        headers: {
          Authorization: "Bearer " + token,
        },
      }).then((data) => {
      console.log(data.data);
      if (data.data.status == 200) {
          console.log(data.data.status);
          Swal.fire({
            icon: "success",
            title: "แก้ไขรหัสผ่าน สำเร็จ",
            timer: 2500,
            showConfirmButton: 1,
          });
      }else{
        Swal.fire({
            icon: "warning",
            title: "ไม่สามารถเปลี่ยนรหัสผ่านได้",
            timer: 3000,
            showConfirmButton: 1,
        });
        return false
      }}).catch((error) => {
        console.log(error);
      });
  }
};
</script>

<template>
  <title-bar :title-stack="titleStack" />

  <user-card />

  <main-section>

    <!-- <div >
      <notification  color="success" :icon="mdiTableBorder">
      แก้ไขข้อมูล Profile สำเร็จ
      </notification>
    </div> -->
    
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <card-component
        title="Edit Profile"
        :icon="mdiAccountCircle"
        form
        @submit.prevent="submitProfile"
      >
        <!-- <field
          label="Avatar"
          help="Max 500kb"
        >
          <file-picker />
        </field> -->
        <field label="E-mail">
          <control
            v-model="profileForm.email"
            :icon="mdiMail"
            type="email"
            name="email"
            required
            disabled
            autocomplete="email"
          />
        </field>

        <field label="Name" help="Required. Your name">
          <control
            v-model="profileForm.name"
            :icon="mdiAccount"
            name="username"
            required
            autocomplete="username"
          />
        </field>

        <divider />

        <jb-buttons>
          <jb-button color="info" type="submit" label="Submit" />
          <!-- <jb-button
            color="info"
            label="Options"
            outline
          /> -->
        </jb-buttons>
      </card-component>

      <card-component
        title="Change Password"
        :icon="mdiLock"
        form
        @submit.prevent="submitPass"
      >
        <!-- <field label="Current password" help="Required. Your current password">
          <control
            v-model="passwordForm.password_current"
            :icon="mdiAsterisk"
            name="password_current"
            type="password"
            required
            autocomplete="current-password"
          />
        </field>

        <divider /> -->

        <field label="New password" help="Required. New password">
          <control
            v-model="passwordForm.password"
            :icon="mdiFormTextboxPassword"
            name="password"
            type="password"
            required
            autocomplete="new-password"
          />
        </field>

        <field
          label="Confirm password"
          help="Required. New password one more time"
        >
          <control
            v-model="passwordForm.password_confirmation"
            :icon="mdiFormTextboxPassword"
            name="password_confirmation"
            type="password"
            required
            autocomplete="new-password"
          />
        </field>

        <divider />

        <jb-buttons>
          <jb-button type="submit" color="info" label="Submit" />
          <!-- <jb-button
            color="info"
            label="Options"
            outline
          /> -->
        </jb-buttons>
      </card-component>
    </div>
  </main-section>
</template>
