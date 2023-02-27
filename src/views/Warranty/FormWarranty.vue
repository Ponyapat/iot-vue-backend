<script setup>

import { computed,reactive, ref, onMounted } from "vue";
import moment from 'moment';

import TitleBar from "@/components/TitleBar.vue";
import CardComponent from "@/components/CardComponent.vue";
import WanrratyTable from '@/components/WanrratyTable.vue'
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
let url = new URL(window.location.href);
const id = url.searchParams.get("id");

const router = useRouter();
const titleStack = ref(["แก้ไขระยะเวลาประกันผลิตภัณฑ์"]);

const state = reactive({
  expire_date:'' ,
});

onMounted(()=>{
  if(id){
    ApiCore.get(`/v2/warranty/${id}`).then((response) => {
      state.expire_date = moment(response.data.data.expire_date).format('YYYY-MM-DD') ;
      }).catch((error) => {
        console.log(error);
      });
  }

});

const closeForm = () => {
  router.push('/warranty-list');
};


const submitForm = () => {

  ApiCore.put(`/v2/warranty/${id}`,{
    expire_date:state.expire_date
  }).then((response) => {
    if(response.status == 200) {
      Swal.fire({
        icon: "success",
        title: "แก้ไขระยะเวลาประกันสำเร็จ",
        confirmButtonText:'ตกลง',
        confirmButtonColor:'#31C48D',
        showConfirmButton: true,
        allowOutsideClick:false,
        timer:2000
      }).then(()=>{
        router.push('/warranty-list')
      })
    }
    else{
      Swal.fire({
        icon: "error",
        title: "แก้ไขข้อมูลไม่สำเร็จ",
        timer: 2000,
        showConfirmButton: 1,
      });
    }

  }).catch((error) => {

    console.log(error);

  });
};

</script>
<template>
  <title-bar class="p-4 pb-4 bg-white " :title-stack="titleStack" />
    <div class="bg-white p-10 shadow m-4 rounded-lg">
      <div class="flex flex-row justify-center items-center">
        <div class="w-1/2">
          <h1 class="text-center font-semibold text-black text-2xl mb-10 dark:text-white">แก้ไขระยะเวลาประกัน</h1>
          <form @submit.prevent="submitForm">
            <div class="mb-6">
              <label for="expire_date" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">ระยะเวลาประกัน</label>
              <input type="date" id="expire_date" v-model="state.expire_date"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            </div>
            <div class="flex flex-row items-center justify-center mt-10">
              <button type="submit"
                class="text-white bg-green-500 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-base w-full px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 mr-2"><i
                  class="fa-solid fa-check mr-3"></i>แก้ไขข้อมูล</button>
              <button type="button" @click="closeForm()"
                class="text-white bg-red-500 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-base w-full  px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800 ml-2"><i
                  class="fa-solid fa-xmark mr-3"></i>ยกเลิก</button>
            </div>
          </form>
        </div>
      </div>
  </div>
</template>



<style>
</style>
