<script setup>
import VueMultiselect from 'vue-multiselect'
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from "vue-router";
import Swal from "sweetalert2";

const router = useRouter();
let url = new URL(window.location.href);
const serial_number = url.searchParams.get("serial_number");

const state = reactive({
  board_id: '',
  serialNumber: serial_number,
  board_name: '',
  select_line_group_id: null,
  line_groupname_options: [],
  check_type_form: 'add'
});


onMounted(async () => {

  // Group Line Show in Select
  await ApiMain.get("line-access-token").then((response) => {

    let obj_group = response.data.data;
    obj_group.forEach(element => {
      state.line_groupname_options.push({ value: element.id, label: element.name });
    });
  }).catch((error) => {
    console.log(error);
  });

  // Check Group Line in Board
  await ApiMain.get(`board/serial_number/${serial_number}`).then((response) => {


    // ให้เช็คว่ามีข้อมูลมาไหม ถ้ามีให้ put
    
    if(response.data.status == 200){
      state.board_id = response.data.data.id;
      state.board_name = response.data.data.name;
      const obj_groupline = response.data.data.line_access_tokens;
      let line_select = [];
      obj_groupline.forEach(element => {
        line_select.push({ value: element.id, label: element.name });
      })

      console.log(line_select);
      state.select_line_group_id = line_select;
      state.check_type_form = 'edit' ;


      console.log('board id == '+state.board_id +' || '+'board name == '+state.board_name);
      console.log('type form = ' + state.check_type_form);
    }


  }).catch((error) => {

    if (error.response.status == 404) {
      state.check_type_form = 'add' ;

    }
  });
})

const submit = () => {

  // console.log(state.select_line_group_id);
  if (state.check_type_form == 'edit') {
    console.log('Edit Line Group');
    console.log(state.select_line_group_id);
    const groupline_id = state.select_line_group_id.map(num => num.value)

    // EDIT API
    ApiMain.put(`board/${state.board_id}`, {
      name: state.board_name,
      serial_number: serial_number,
      line_access_token_ids: groupline_id
    }).then(response => {

      if (response.data.status == 204) {
        console.log('edit successfully !!!');
        Swal.fire({
        icon: 'success',
        title: 'อัปเดตสำเร็จ',
        text: 'อัปเดตบอร์ดสำเร็จ',
        confirmButtonColor:'#31C48D'
      });
        router.push('/board-list');
      }

    }).catch((error) => {
      console.log(error);
    });

  } else {
    const groupline_id = state.select_line_group_id.map(num => num.value)
    console.log('add data line group ==', groupline_id);
    //Add
    ApiMain.post('board', {
      name: state.board_name,
      serial_number: serial_number,
      line_access_token_ids: groupline_id
    }).then(response => {
      console.log(response.data)

      Swal.fire({
        icon: 'success',
        title: 'เพิ่มสำเร็จ',
        text: 'เพิ่มไลน์กลุ่มในบอร์ดสำเร็จ',
        confirmButtonColor:'#31C48D'
      });
      router.push('/board-list');
    }).catch((error) => console.log(error));
    console.log('Add Line Group');
  }

};

const closeForm = () => {
  router.push('/board-list');
};

</script>
<template>
  <div class="bg-white p-4 rounded-lg m-4 shadow-lg flex flex-row justify-center">
    <div class="w-1/2 mb-4">
      <h1 class="text-2xl text-center font-medium my-4">เพิ่ม Group Line</h1>
      <form @submit.prevent="submit()">
        <div class="mb-6">
          <label for="serial_num" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Serial
            Number</label>
          <input type="text" id="serial_num" v-model="state.serialNumber"
            class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full h-[36px] p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
            readonly>
        </div>
        <div class="mb-6">
          <label for="board_name" class="block mb-2 text-base font-medium text-gray-900 dark:text-white">ชื่อบอร์ด</label>
          <input type="text" id="board_name" v-model="state.board_name"
            class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light">
        </div>
        <div class="mb-6">
          <label for="repeat-password"
            class="block mb-2 text-base font-medium text-gray-900 dark:text-white ">กลุ่มไลน์</label>
          <VueMultiselect :multiple="true" label="label" track-by="value" :close-on-select="true"
            v-model="state.select_line_group_id" :options="state.line_groupname_options">
          </VueMultiselect>
          
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