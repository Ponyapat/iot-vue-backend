<script setup>

import { computed, onMounted, reactive, ref } from 'vue'
import TitleBar from "@/components/TitleBar.vue";
import moment from 'moment';


const titleStack = ref(["ข้อมูลลูกค้าที่ลงทะเบียนรับประกัน"]);
let url = new URL(window.location.href);
const id = url.searchParams.get("warranty_detail");

const state = reactive({
  serial: "",
  purchase_date: "",
  file_bill: "",
  titlename: "",
  titlename_note: null,
  firstname: "",
  lastname: "",
  email: "",
  mobile: "",
  gender: "",
  birth_date: "",
  address_no: "",
  address: "",
  address_alley: null,
  address_road: null,
  province: "",
  district: "",
  subdistrict: "",
  zipcode: "",
});



onMounted(() => {

  ApiCore.get(`/v2/warranty/${id}`).then((res) => {

    console.log(res.data.data);
    state.serial = res.data.data.serial;
    state.purchase_date = res.data.data.purchase_date;
    state.file_bill = res.data.data.file_bill;
    state.titlename = res.data.data.titlename;
    state.firstname = res.data.data.firstname;
    state.lastname = res.data.data.lastname;
    state.email = res.data.data.email;
    state.mobile = res.data.data.mobile;
    state.gender = res.data.data.gender;
    state.birth_date = res.data.data.birth_date;
    state.address_no = res.data.data.address_no;
    state.address = res.data.data.address;
    state.address_alley = res.data.data.address_alley;
    state.address_road = res.data.data.address_road;
    state.province = res.data.data.province;
    state.district = res.data.data.district;
    state.subdistrict = res.data.data.subdistrict;
    state.zipcode = res.data.data.zipcode;

  }).catch((error) => {
    console.log(error.message);
  });
});
</script>
<template>
  <title-bar class="p-4 pb-4 bg-white " :title-stack="titleStack" />
  <hr>
  <div class=" m-4">

    <div class="flex justify-center">
      <div class=" bg-white rounded-lg shadow w-full h-auto p-4 m-4">
        <h1 class="text-xl font-bold  text-center my-4">รายละเอียดลูกค้า</h1>
        <div class="flex flex-col items-center justify-center mt-4">
          <div>
            <img v-if="state.titlename == 'mr'" src="../../assets/images/mr.png" alt=""
              class="w-18 h-18 shadow bg-gray-100 p-2 rounded-full">
            <img v-else-if="state.titlename == 'mrs'" src="../../assets/images/woman_mrs.png" alt=""
              class="w-18 h-18 shadow bg-gray-100 p-2 rounded-full">
            <img v-else-if="state.titlename == 'miss'" src="../../assets/images/woman_miss.png" alt=""
              class="w-18 h-18 shadow bg-gray-100 p-2 rounded-full">
          </div>
          <!-- ชื่อใต้รูป -->
          <!-- <p class="font-semibold text-lg text-center mt-2">
            <span v-if="state.titlename == 'mrs'">นาง</span>
            <span v-else-if="state.titlename == 'mr'">นาย</span>
            <span v-else-if="state.titlename == 'miss'">นางสาว</span>
            {{ state.firstname }} {{ state.lastname }}
          </p> -->
          <div class="w-[450px]  mt-8">
            <div class="mb-3">
                <p class="font-bold text-base">
                    ชื่อ - นามสกุล :
                    <span class="font-normal">
                      <span v-if="state.titlename == 'mrs'">นาง</span>
                      <span v-else-if="state.titlename == 'mr'">นาย</span>
                      <span v-else-if="state.titlename == 'miss'">นางสาว</span>
                        {{ state.firstname }} {{ state.lastname }}
                    </span>
                </p>
            </div>
            <div class="mb-2">
              <span class="font-bold text-base">วันที่ซื้อผลิตภัณฑ์ : <span class="font-normal text-base">{{ moment.utc(state.purchase_date).format('DD/MM/YYYY') }}</span></span>
            </div>
            <div class="mb-2">
              <span class="font-bold text-base">อีเมล : <span class="font-normal text-base">{{ state.email}}</span></span>
            </div>
            <div class="mb-2">
              <span class="font-bold text-base">เบอร์โทรศัพท์ : <span class="font-normal text-base">{{ state.mobile
              }}</span></span>
            </div>
            <div class="mb-2">
              <span class="font-bold text-base">เพศ :
                <span v-if="state.gender == 'male'" class="font-normal text-base">ชาย</span>
                <span v-else class="font-medium text-base">หญิง</span>
              </span>
            </div>
            <div class="mb-2">
              <span class="font-bold text-base">วันเกิด : <span class="font-normal text-base">{{
                moment(state.birth_date).format('DD/MM/YYYY') }}</span></span>
            </div>
            <div class="mb-2">
              <span class="font-bold text-base">ที่อยู่ : <span class="font-normal text-base">{{ state.address }}</span></span>
              <!-- <span class="font-bold text-base">ที่อยู่ : <span class="font-normal text-base">
                  {{ state.address_no }} {{ state.address }}
                  <span v-if="state.address_alley != ''"> ซอย {{ state.address_alley }}</span>
                  <span v-if="state.address_road != ''"> ถนน {{ state.address_road }}</span>
                  <span class="mx-2">ตำบล {{ (state.subdistrict).substring(0, (state.subdistrict).indexOf(' ')) }}</span>
                  <span class="mx-2">อำเภอ {{ (state.district).substring(0, (state.district).indexOf(' ')) }}</span>
                  <span class="mx-2">จังหวัด {{ (state.province).substring(0, (state.province).indexOf(' ')) }}</span>
                  <span class="">รหัสไปรษณีย์ {{ state.zipcode }}</span>
                </span></span> -->
            </div>
            <div class="mt-10" >
              <h1 class="text-lg text-black font-bold mb-2"><i class="fa-solid fa-paperclip"></i> ไฟล์แนบ</h1>
              <div class="flex flex-row gap-2 items-center">
                <div class="flex flex-col justify-center items-center" >
                  <a :href="state.file_bill" target="_blank" class="cursor-pointer hover:opacity-70">
                    <img :src="state.file_bill" alt="" class="object-cover rounded-md w-[150px] h-[150px]">
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>



<style></style>
