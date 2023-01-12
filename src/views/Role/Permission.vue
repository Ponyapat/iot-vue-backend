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
let titleStack = ref(["Admin", "ตั้งค่า Permission"]);
const form = reactive({
  id: '',
  name: '',
  objects:{},
  userRoles:[]
})

onBeforeMount(() => {
  if (id) {
    ApiMain.get("/role/"+id)
      .then((response) => {
        if (response.data) {
          form.id = response.data.data.id
          form.name = response.data.data.name
          titleStack.value = ["ตั้งค่า Permission", form.name]
        }
    })

    ApiMain.get("/role/"+id+"/role-permission")
    .then((response) => {
        let permission_arr = []
        for (const [key, val] of Object.entries(response.data.data.rolePermission)) {
            permission_arr.push(val.permissionId)
        }
        form.userRoles = permission_arr
    })

    ApiMain.get("/role/objects/lists")
    .then((response) => {
      form.objects = response.data
      //console.log(form.objects)
    })
  }
})

const submit = () => {
  const propertyValues = Object.values(form.userRoles);
  console.log(propertyValues); 
  
  if (id) {
    ApiMain.post("/role/"+id+"/role-permission",{
    permissionId:propertyValues})
    .then((response) => {
        if (response.data.status == 201) {
          Swal.fire({
            icon: "success",
            html: "แก้ไข Permission สำเร็จ",
            timer: 2000,
            showConfirmButton: 1,
          });
          router.push("/roles");
        } else {
          Swal.fire({
            icon: "warning",
            title: "ไม่สามารถแก้ไข Permission ได้",
            timer: 3000,
            showConfirmButton: 1,
          });
          return false;
        }
    })
  } else {

  }
}

</script>
<template>
  <div>
    <title-bar :title-stack="titleStack" />
    <form @submit.prevent="submit" class="mt-6 ml-3">
    <template  v-for="(objects, index) in form.objects" :key="index">
    <ul class="items-center mt-1 w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
    <li class="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
        <div class="flex items-center pl-3">
            <label v-if="objects.name=='geography'" class="w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">ภูมิศาสตร์(ข้อมูลลูกค้า)</label>
            <label v-else-if="objects.name=='weather'" class="w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">ภูมิอากาศ</label>
            <label v-else-if="objects.name=='breed'" class="w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">พืชพันธุ์ผลไม้</label>
            <label v-else-if="objects.name=='breed-categorise'" class="w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">ประเภทพืชพันธุ์ผลไม้</label>
            <label v-else-if="objects.name=='geography-base'" class="w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">ภูมิศาสตร์(ข้อมูลกลาง)</label>
            <label v-else-if="objects.name=='customer'" class="w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">ข้อมูลลูกค้า</label>
            <label v-else-if="objects.name=='other-customer'" class="w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">ข้อมูลลูกค้าสำหรับฝ่ายขาย</label>
            <label v-else-if="objects.name=='user'" class="w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">ผู้ใช้งาน</label>
            <label v-else for="vue-checkbox-list" class="w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">{{ objects.name }}</label>
        </div>
    </li>
    <li class="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
        <div class="flex items-center pl-3">
            <input id="vue-checkbox-list" v-model="form.userRoles" type="checkbox" :value=objects.permission[0].id class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500">
            <label for="vue-checkbox-list" class="w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">ดูข้อมูล</label>
        </div>
    </li>
    <li class="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
        <div class="flex items-center pl-3">
            <input id="react-checkbox-list" v-model="form.userRoles"  type="checkbox" :value=objects.permission[1].id class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500">
            <label for="react-checkbox-list" class="w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">เพิ่มข้อมูล</label>
        </div>
    </li>
    <li class="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
        <div class="flex items-center pl-3">
            <input id="angular-checkbox-list" v-model="form.userRoles" type="checkbox" :value=objects.permission[2].id class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500">
            <label for="angular-checkbox-list" class="w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">แก้ไขข้อมูล</label>
        </div>
    </li>
    <li class="w-full dark:border-gray-600">
        <div class="flex items-center pl-3">
            <input id="laravel-checkbox-list" v-model="form.userRoles"  type="checkbox" :value=objects.permission[3].id class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500">
            <label for="laravel-checkbox-list" class="w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">ลบข้อมูล</label>
        </div>
    </li>
</ul>
</template>

    <div class="mt-4 mb-2">
    <button type="submit"
            class="text-white bg-green-500 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-base w-full sm:w-[220px] px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mr-2"><i
              class="fa-solid fa-check mr-3"></i>บันทึกข้อมูล</button>
   </div>
  </form>
  </div>
</template>
