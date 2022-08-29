<script setup>
import { ref, reactive, onBeforeMount } from "vue";
import axios from "axios";
import Swal from "sweetalert2";
import { useRouter } from "vue-router";
import TitleBar from "@/components/TitleBar.vue";
import MainSection from "@/components/MainSection.vue";
import CardComponent from "@/components/CardComponent.vue";
import Field from "@/components/Field.vue";
import Control from "@/components/Control.vue";
import Divider from "@/components/Divider.vue";
import JbButton from "@/components/JbButton.vue";
import JbButtons from "@/components/JbButtons.vue";
import { mdiBallot } from "@mdi/js";

const router = useRouter();
const url = window.location.href;
const id = url.split("/")[5];
const token = localStorage.getItem("tkfw");
const titleStack = ref(id ? ["Admin", "แก้ไขสถานะ Admin"] : ["Admin", "เพิ่มสถานะ Admin"]);
const buttonLabel = (id ? "อัพเดท" : "เพิ่ม");
const form = reactive({
  id: '',
  name: ''
})
const fetchRoleDataId = () => {
  console.log(url)
  if (id) {
    axios
      .get(import.meta.env.VITE_API_ENDPOINT + "/api/role/"+id,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        })
      .then((response) => {
        if (response.data) {
          form.id = response.data.data.id
          form.name = response.data.data.name
        }
      })
  }
}
const submit = () => {
  if (id) {
    axios
      .put(import.meta.env.VITE_API_ENDPOINT + "/api/role/" + id, {
        name: form.name
      },
      {
        headers: {
          Authorization: "Bearer " + token,
        }
      })
      .then((data) => {
        if (data.data.status == 204 || data.data.status == 200) {
          console.log(data.data.status);
          Swal.fire({
            icon: "success",
            title: "แก้ไขข้อมูลสถานะ สำเร็จ",
            timer: 2500,
            showConfirmButton: 1,
          });
          router.push("/roles");
        } else {
          Swal.fire({
            icon: "warning",
            title: "ไม่สามารถแก้ไขข้อมูลสถานะได้",
            timer: 3000,
            showConfirmButton: 1,
          });
          return false;
        }
      })
  } else {
    axios
      .post(import.meta.env.VITE_API_ENDPOINT + "/api/role", {
        name: form.name
      },
      {
        headers: {
          Authorization: "Bearer " + token,
        }
      })
      .then((data) => {
        if (data.data.status == 204 || data.data.status == 200 || data.data.status == 201) {
          console.log(data.data.status);
          Swal.fire({
            icon: "success",
            title: "เพิ่มข้อมูลสถานะ สำเร็จ",
            timer: 2500,
            showConfirmButton: 1,
          });
          router.push("/roles");
        } else {
          Swal.fire({
            icon: "warning",
            title: "ไม่สามารถเพิ่มข้อมูลสถานะได้",
            timer: 3000,
            showConfirmButton: 1,
          });
          return false;
        }
      })
  }
}

const clearData = () => {
  form.name = ""
}

onBeforeMount(() => {
  fetchRoleDataId()
})

</script>
<template>
  <div>
    <title-bar :title-stack="titleStack" />
    <main-section
      title="สถานะการเข้าถึงข้อมูล"
      :icon="mdiBallot"
      form
    >
      <card-component>
        <field label="ชื่อ">
          <control
            v-model="form.name"
            type="text"
          />
        </field>
        <divider />
        <jb-buttons>
          <jb-button type="submit" color="info" :label="buttonLabel" v-on:click="submit()"/>
          <jb-button v-if="!id" type="reset" color="info" outline label="Reset" v-on:click="clearData()"/>
        </jb-buttons>
      </card-component>
    </main-section>
  </div>
</template>
