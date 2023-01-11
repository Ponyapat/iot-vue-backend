<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required, helpers } from '@vuelidate/validators'
import axios from "axios";
import Swal from "sweetalert2";
import { useRouter } from "vue-router";

let url = new URL(window.location.href);
const id = url.searchParams.get("customer_edit");
let type_form = ref('');
const router = useRouter();
const token = localStorage.getItem("tkfw");


let check_firstname = ref(false);
let check_lastname = ref(false);
let check_email = ref(false);
let check_username = ref(false);

const config = {
        auth: {
          username: 'admin',
          password: 'password'
        },
        headers: {
          Authorization: "Bearer " + token,
        }

      } ;

const dataform = reactive({
  first_name: "",
  last_name: "",
  email: "",
  username: "",
  address: "",
});

onMounted(() => {
  if (id) {
    type_form.value = 'แก้ไข';
    ApiSso.get("/api/mgr/users/"+id,config).then((response)=>{
        if(response.data.data.email != null){
          check_email.value = true ;
        }
        if(response.data.data.username){
          check_username.value = true ;
        }
        dataform.first_name = response.data.data.first_name ;
        dataform.last_name = response.data.data.last_name ;
        dataform.email = response.data.data.email ;
        dataform.username = response.data.data.username ;
        dataform.address = response.data.data.user_details.address ;
      }).catch((error) => {
        console.log(error);
    });
  }
  else {
    type_form.value = 'เพิ่ม';

  }
})


const submit = async () => {

  if (id) {
    const data ={
    first_name : dataform.first_name,
    last_name : dataform.last_name,
    email : dataform.email,
    username : dataform.username,
    user_details:{
      address: dataform.address
    }
  }
    ApiSso.put("/api/mgr/users/"+id,data,config).then((res)=>{
      if (res.status == 200) {
          Swal.fire({
            icon: "success",
            title: "เพิ่มข้อมูลสถานะสำเร็จ",
            timer: 2500,
            showConfirmButton: 1,
          });
          router.push("/my-customers");
        } else {
          Swal.fire({
            icon: "warning",
            title: "ไม่สามารถเพิ่มข้อมูลได้",
            timer: 3000,
            showConfirmButton: 1,
          });
        }
      }).catch((error) => {
        console.log(error);
    });
  }
  else {
    ApiMain.post("/api/mgr/users",data,config).then((data) => {
      if (data.data.status == 200) {
        console.log('add successfully');
      }
    });
  }

};
const closeForm = () => {
  router.push('/my-customers');
};

</script>
<template>
  <div class="flex justify-center bg-white dark:bg-slate-700 m-4 p-10 rounded-2xl shadow-custom">
    <div class="w-full md:w-[800px] h-full">
      <h1 class="text-center font-semibold text-black text-2xl mb-6 dark:text-white">{{ type_form }}ข้อมูลลูกค้า</h1>
      <form @submit.prevent="submit">
        <div class="flex flex-row gap-2">
          <div class="mb-4 w-full">
          <label for="firstname" class="block mb-2 text-base font-medium text-black dark:text-white">ชื่อ</label>
          <input type="text" id="firstname" v-model="dataform.first_name"  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
        </div>
          <div class="mb-4 w-full">
          <label for="lastname" class="block mb-2 text-base font-medium text-black dark:text-white">นามสกุล</label>
          <input type="text" id="lastname" v-model="dataform.last_name"   class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
        </div>
        </div>
        <div class="mb-4 w-full ">
          <label for="email" class="block mb-2 text-base font-medium text-black dark:text-white">อีเมล</label>
          <input type="email" id="email" v-model="dataform.email" :readonly="check_email==true"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
        </div>
        <div class="mb-4 w-full ">
          <label for="username" class="block mb-2 text-base font-medium text-black dark:text-white">เบอร์โทรศัพท์มือถือ</label>
          <input type="text" id="username" v-model="dataform.username" :readonly="check_username==true" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
        </div>
        <div class="mb-4 w-full ">
          <label for="address" class="block mb-2 text-base font-medium text-black dark:text-white">ที่อยู่ <span class="text-red-500">*</span></label>
          <textarea id="address" rows="1" v-model="dataform.address"
            class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"></textarea>
        </div>
        <div class="flex flex-row items-center justify-center">
          <button type="submit"
            class="text-white bg-green-500 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-base w-full sm:w-[256px] px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 mr-2"><i
              class="fa-solid fa-check mr-3"></i>บันทึกข้อมูล</button>
          <button type="button" @click="closeForm()"
            class="text-white bg-red-500 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-base w-full sm:w-[256px] px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800 ml-2"><i
              class="fa-solid fa-xmark mr-3"></i>ยกเลิก</button>
        </div>
      </form>
    </div>
  </div>
</template>



<style scoped>
.shadow-custom {
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
}
</style>
