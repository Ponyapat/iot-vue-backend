<script setup>
import VueMultiselect from 'vue-multiselect'
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from "vue-router";
import Swal from "sweetalert2";

import { useVuelidate } from '@vuelidate/core'
import { required, helpers } from '@vuelidate/validators'

const router = useRouter();
let url = new URL(window.location.href);
const id = url.searchParams.get("id");
// const groupline_name = url.searchParams.get("groupline_name");


const state = reactive({
  board_id: '',
  access_token: '',
  groupline_name: '',
  select_board_serial: [],
  board_options: [],
  check_type_form: 'add',
  is_admin:false
});

let form_type = ref('add');



onMounted(async () => {

  // Group Line Show in Select
  await ApiMain.get("board?order=ASC&page=1&take=99999").then((response) => {

    let obj_group = response.data.data;
    obj_group.forEach(element => {
      state.board_options.push({ value: element.id, label: element.name });
    });
  }).catch((error) => {
    console.log(error);
  });

  ApiMain.get(`line-access-token/${id}`).then((res)=>{
      console.log(res);
      if(res.data.status == 200){
        state.groupline_name = res.data.data.name ;
        state.access_token = res.data.data.access_token ;
        state.is_admin = res.data.data.is_admin
      
        const boards_obj = res.data.data.boards;
        boards_obj.forEach(item=>{
          console.log(item);
          state.select_board_serial.push({"value":item.id,"label":item.name});
        });

        form_type.value = 'edit' ;
      }
      else{
        form_type.value = 'add' ;
      }

  }).catch((error)=>{
    console.log(error.message);
  })

  // Check Group Line in Board
  // await ApiMain.get(`board/serial_number/${access_token}`).then((response) => {
  //   // ให้เช็คว่ามีข้อมูลมาไหม ถ้ามีให้ put
    
  //   if(response.data.status == 200){
  //     state.board_id = response.data.data.id;
  //     state.board_name = response.data.data.name;
  //     const obj_groupline = response.data.data.line_access_tokens;
  //     let line_select = [];
  //     obj_groupline.forEach(element => {
  //       line_select.push({ value: element.id, label: element.name });
  //     })

  //     console.log(line_select);
  //     state.select_board_serial = line_select;
  //     state.check_type_form = 'edit' ;

  //     console.log('board id == '+state.board_id +' || '+'board name == '+state.board_name);
  //     console.log('type form = ' + state.check_type_form);
  //   }

  // }).catch((error) => {

  //   if (error.response.status == 404) {
  //     state.check_type_form = 'add' ;

  //   }
  // });
})

const submit = async () => {

  // ต้องเช็คบอร์ดก่อน ถ้ามีบอร์ดก็ให้ Edit  ถ้าไม่มีบอร์ดก็ให้ add
  const boardlist_serial = state.select_board_serial.map(num => num.value) ;

  if(form_type.value == 'edit'){

    Swal.fire({
    title: "บันทึกข้อมูล",
    text: "ต้องการบันทึกหรือไม่ ?",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#31C48D",
    confirmButtonText: "ยืนยัน",
    cancelButtonColor: "#F98080",
    cancelButtonText: "ยกเลิก",
  }).then((result) => {
    if (result.isConfirmed) {
      ApiMain.put(`line-access-token/${id}`,{
      name: state.groupline_name,
      access_token: state.access_token ,
      board_ids:boardlist_serial,
      is_admin: state.is_admin
    }).then(res=>{
      if(res.data.status == 204){
        Swal.fire({
        icon: 'success',
        title: 'อัปเดตสำเร็จ',
        text: 'อัปเดตข้อมูลสำเร็จ',
        confirmButtonColor:'#31C48D'
      });
        router.push('/linegroup-list');
      }
    });
    }
  });
    
  }else{

    Swal.fire({
    title: "บันทึกข้อมูล",
    text: "ต้องการบันทึกหรือไม่ ?",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#31C48D",
    confirmButtonText: "ยืนยัน",
    cancelButtonColor: "#F98080",
    cancelButtonText: "ยกเลิก",
  }).then((result) => {
    if (result.isConfirmed) {
      ApiMain.post('line-access-token',{
      name: state.groupline_name,
      access_token: state.access_token ,
      board_ids: boardlist_serial,
      is_admin:state.is_admin
    }).then(res=>{
      console.log(res);
      Swal.fire({
        icon: 'success',
        title: 'เพิ่มสำเร็จ',
        text: 'เพิ่มข้อมูลสำเร็จ',
        confirmButtonColor:'#31C48D'
      });
      router.push('/linegroup-list');
    });
    }
  });


   
  }
};

const closeForm = () => {
  router.push('/linegroup-list');
};

</script>
<template>
  <div class="bg-white p-4 rounded-lg m-4 shadow-lg flex flex-row justify-center">
    <div class="w-1/2 mb-4">
      <h1 class="text-2xl text-center font-medium my-4">
        <span v-if="form_type == 'edit'">แก้ไข</span>
        <span v-else>เพิ่ม</span>
        บอร์ดในกลุ่มไลน์</h1>
      <form @submit.prevent="submit()">
        <div class="mb-6">
          <label for="serial_num" class="block mb-2 text-base font-medium text-gray-900 dark:text-white">Access token</label>
          <input type="text" id="serial_num" v-model="state.access_token"
            class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full h-[36px] p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
            readonly>
        </div>
        <div class="mb-6">
          <label for="groupline_name" class="block mb-2 text-base font-medium text-gray-900 dark:text-white">ชื่อกลุ่มไลน์</label>
          <input type="text" id="groupline_name" v-model="state.groupline_name" 
            class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light">
        </div>
        
        <div class="mb-6">
          <label for="repeat-password"
            class="block mb-2 text-base font-medium text-gray-900 dark:text-white ">บอร์ด</label>
          <VueMultiselect :multiple="true" label="label" track-by="value" :close-on-select="true" class="border-1 border-gray-100 rounded-md shadow-none"
            v-model="state.select_board_serial" :options="state.board_options">
          </VueMultiselect>
        </div>
        <div class="mb-6">
            <label for="adminstatus" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Group Admin</label>
            <select id="adminstatus" v-model="state.is_admin" class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
              <option :value="true">true</option>
              <option :value="false" selected>false</option>
            </select>
        </div>
        <div class="flex flex-row justify-center gap-4">
          <div>
            <button type="submit"
              class="w-[200px] h-[36px] text-base text-white bg-green-500 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg  px-5 py-1 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">บันทึก</button>
          </div>
          <div>
            <button type="button" @click="closeForm()"
              class="w-[200px] h-[36px] text-base text-white bg-red-500 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg  px-5 py-1 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">ยกเลิก</button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>



<style src="vue-multiselect/dist/vue-multiselect.css"></style>