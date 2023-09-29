<script setup>
import { useRouter } from "vue-router";
import { useMainStore } from "@/stores/main";
import TitleBar from "@/components/TitleBar.vue";
import { reactive, ref, onMounted } from "vue";
import MainSection from "@/components/MainSection.vue";
import CardComponent from "@/components/CardComponent.vue";
import Field from "@/components/Field.vue";
import Control from "@/components/Control.vue";
import { mdiBallot } from "@mdi/js";
import BottomOtherPagesSection from "@/components/BottomOtherPagesSection.vue";
import Divider from "@/components/Divider.vue";
import JbButton from "@/components/JbButton.vue";
import JbButtons from "@/components/JbButtons.vue";
import Swal from "sweetalert2";
// import CheckRadioPicker from '@/components/CheckRadioPicker.vue'

const router = useRouter();
const titleStack = ref(["Master Categories", "Add Category"]);

const states = reactive({
  roles: [],
});

onMounted(() => {
  //clearData()
  fetchRole();
});

const form = reactive({
    name_th: "",
    name_en: "",
});

const clearData = () => {
  console.log("clearData");
  form.name_th = "";
  form.name_en = "";
};

const fetchRole = () => {
  console.log("fetch role");
  ApiMain.get("/sensor-category?order=ASC&page=1&take=999").then((data) => {
    console.log("DEBUG ROLE: ", data.data.data);
    states.roles = data.data.data;
    // set role default เป็น admin id 2
    form.role_id = "2";
  });
};

const submit = () => {
  console.log("add category");
  //console.log(form)
  ApiMain.post("/sensor-category", {
    name_th: form.name_th,
    name_en: form.name_en,
  })
    .then((r) => {
      console.log("success");
      Swal.fire({
        icon: "success",
        title: "เพิ่ม Category สำเร็จ",
        showConfirmButton: 1,
        timer: 3000,
      });
      router.push("/sensor-category");
    })
    .catch((error) => {
      console.log(error.response.data.message);
      if (error.response.data.message == "Error: User not registration!") {
        Swal.fire({
          icon: "warning",
          title: "มี Category นี้แล้ว",
          showConfirmButton: 1,
        });
      }
    });
};
</script>

<template>
  <title-bar :title-stack="titleStack" />
  <main-section>
    <card-component
      title="กรอกข้อมูล Category"
      :icon="mdiBallot"
      form
      @submit.prevent="submit"
    >
  <div class="flex w-full gap-2 ">
    <div class="w-full">
      <field label="ชื่อ Category" :require="true">
        <control v-model="form.name_th" type="text" placeholder="ชื่อ Category" />
      </field>
    </div>

    <div class="w-full">
      <field label="Category Name" :require="true">
        <control v-model="form.name_en" type="text" placeholder="Category name" />
      </field>
    </div>
      
  </div>

      <divider />

      <jb-buttons>
        <jb-button type="submit" color="info" label="เพิ่ม" />
        <jb-button type="reset" color="info" outline label="รีเซต" />
      </jb-buttons>
    </card-component>
  </main-section>

  <bottom-other-pages-section />
</template>
