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
const titleStack = ref(["Master Sensors", "Add Sensor"]);

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
  icon: "",
  unit: "",
  unit_th: "",
  unit_en: "",
  type: "",
  status: "",
  category: ""

});

const clearData = () => {
  console.log("clearData");
  form.name_th = "",
  form.name_en = "",
  form.icon ="",
  form.unit = "",
  form.unit_th = "",
  form.unit_en = "",
  form.type = "",
  form.status = "",
  form.category = ""
};

let image_upload = ref('');
let img_file = ref('');
let image_name = ref('');
let formData_img = ref('');


const fetchRole = () => {
  console.log("fetch role");
  ApiMain.get("/sensors?order=ASC&page=1&take=999").then((data) => {
    console.log("DEBUG ROLE: ", data.data.data);
    states.roles = data.data.data;
    // set role default เป็น admin id 2
    form.role_id = "2";
  });
};

const submit = () => {
  console.log("add data sensor");
  //console.log(form)
  ApiMain.post("/sensors/", {
    name: {th:form.name_th , en:form.name_en},
    unit: {th:form.unit_th , en: form.unit , en_name: form.unit_en},
    type: "lan",
    status: form.status,
    category: form.category,
  })
    .then((r) => {
      console.log("success");
      Swal.fire({
        icon: "success",
        title: "เพิ่ม sensor สำเร็จ",
        showConfirmButton: 1,
        timer: 3000,
      });
      router.push("/sensors");
    })
    .catch((error) => {
      console.log(error.response.data.message);
      if (error.response.data.message == "Error: User not registration!") {
        Swal.fire({
          icon: "warning",
          title: "มี sensor ในระบบแล้ว",
          showConfirmButton: 1,
        });
      }
    });
};

const upload_image = (event) => {
  let name = event.target.files[0].name ;
  image_name.value = event.target.files[0].name ;
  let image = event.target.files[0];
  const formdata = new FormData();
  formdata.append('file', image );
  image_upload.value =  URL.createObjectURL(image) ;
  formData_img.value = formdata ;
  ApiMain.post("/image/upload?imageableType=breed",formdata).then((data) => {
      if (data.status == 201) {
        dataform.image = data.data;
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'อัพโหลดรูปสำเร็จ',
          showConfirmButton: false,
          timer: 1500
        })
      } else {
        Swal.fire({
          position: 'top-end',
          icon: "warning",
          title: "ไม่สามารถอัพโหลดรูปได้",
          timer: 1500,
        });
        return false;
      }
    })
    .catch((error) => {
      console.log(error);
    });

};
</script>

<template>
  <title-bar :title-stack="titleStack" />
  <main-section>
    <card-component
      title="กรอกข้อมูล Sensor"
      :icon="mdiBallot"
      form
      @submit.prevent="submit"
    >

    <!-- ชื่อ -->
  <div class="flex w-full gap-2 pb-2">
    <div class="w-full">
      <field label="ชื่อ Sensor" :require="true">
        <control v-model="form.name_th" type="text" placeholder="ชื่อ Sensor" />
      </field>
    </div>

    <!-- Name -->
    <div class="w-full">
      <field label="Sensor Name">
        <control v-model="form.name_en" type="text" placeholder="Sensor name" />
      </field>
    </div>
  </div>

      
      <!-- <field
        label="Username"
        placeholder="กรอก Username ผู้ใช้"
        :require="true"
      >
        <control v-model="form.username" type="text" placeholder="Username" />
      </field> -->

      <!-- unit -->
      <field label="Unit" :require="true">
        <control v-model="form.unit" type="text" placeholder="Unit" />
      </field>
      
      <!-- ชื่อหน่วย -->
      <div class="flex w-full gap-2 pb-2">
        <div class="w-full">
          <field label="ชื่อหน่วย" :require="true">
        <control v-model="form.unit_th" type="text" placeholder="ชื่อหน่วย" />
      </field>
        </div>

        <!-- unit name -->
        <div class="w-full">
          <field label="Unit Name" >
        <control v-model="form.unit_en" type="text" placeholder="Unit Name" />
      </field>
        </div>
      </div>

      <!-- type -->
      <label for="countries" class="block mb-2 text-base font-bold text-gray-900 dark:text-white mt-2">Select Type</label>
        <select id="countries" class=" bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
        <option value = 'null'>-</option>
        <option value="lan">RJ45</option>
      </select>

      <!-- status -->
      <label for="countries" class="block mb-2 text-base font-bold text-gray-900 dark:text-white mt-2">Select Status</label>
        <select id="countries" class=" bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
        <option value = 'null'>-</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>

      <!-- category -->
      <label for="countries" class="block mb-2 text-base font-bold text-gray-900 dark:text-white mt-2">Select Category</label>
        <select id="countries" class=" bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
        <option value = 'null'>-</option>
        <option value="1">กลุ่มดิน</option>
        <option value="2">กลุ่มน้ำ</option>
        <option value="3">กลุ่มอากาศ</option>
        <option value="4">กลุ่มแสง</option>
        <option value="5">กลุ่มเสียง</option>
        <option value="6">กลุ่มพลังงาน</option>
        <option value="7">กลุ่มตำแหน่ง</option>
        <option value="8">อื่นๆ</option>


      </select>

      <div class="flex w-full justify-center ">
        <div class="flex justify-center items-center w-6/12 h-52 mt-8">
            <label v-if="image_upload ==''" for="dropzone-file"
              class="flex flex-col justify-center items-center w-full h-full bg-gray-50 rounded-lg border-2 border-gray-300 border-dashed cursor-pointer dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-white dark:hover:border-white dark:hover:bg-gray-600">
              <div class="flex flex-col justify-center items-center pt-5 pb-6">
                <p class="mb-2 text-sm text-gray-500 dark:text-white"><span class="font-semibold">คลิกเพื่ออัปโหลด</span> หรือ ลากและวาง</p>
                <p class="text-xs text-gray-500 dark:text-white">.Webp, PNG or JPG (MAX. 800x400px)</p>
              </div>
              <input id="dropzone-file" type="file" accept=".webp, .jpg, .jpeg , .png ,.tif" class="hidden" @change="upload_image">
            </label>
            <label v-else for="dropzone-file"
              class="flex flex-col justify-center items-center w-full h-full bg-green-50 rounded-lg border-2 border-gray-300 border-dashed cursor-pointer">
              <div class="flex flex-col justify-center items-center pt-5 pb-6 ">
                <img :src="image_upload" class="mb-2 rounded-md" :alt="image_upload" style="width:100px; height:100px;">
                <span class="text-center truncate w-[250px]">{{image_name}}</span>
              </div>
              <input id="dropzone-file" type="file" accept=".webp, .jpg, .jpeg , .png ,.tif" class="hidden" @change="upload_image">
            </label>
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
