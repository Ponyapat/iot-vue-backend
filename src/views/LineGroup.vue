<template>
    <div class="bg-white h-[500px] m-4 rounded-lg shadow p-4">
        <h1 class="font-medium text-xl text-center my-6">เพิ่มกลุ่มไลน์</h1>
        <div class="flex flex-row items-center justify-center">
            <div class="w-2/5">
                <form @submit.prevent="submitForm" >
            <div class="mb-6">
                <label for="access_token" class="block mb-2 text-base font-medium text-gray-900 dark:text-white">Access token</label>
                <input type="text" id="access_token" v-model="state.access_token" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" readonly>
            </div>
            <div class="mb-6">
                <label for="group_name" class="block mb-2 text-base font-medium text-gray-900 dark:text-white">ชื่อกลุ่มไลน์</label>
                <input type="text" id="group_name" v-model="state.groupname" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" >
            </div>
            <div class="text-center">
                <button type="submit" class="w-[120px] h-[36px] bg-green-500 hove:bg-green-600 py-1 px-4 text-white rounded-lg">บันทึก</button>
            </div>
        </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import {ref,reactive, onMounted} from 'vue'
import Swal from "sweetalert2";
import { useRouter } from "vue-router";

let url = new URL(window.location.href);
const access_token = url.searchParams.get("access_token");

const router = useRouter();
const state = reactive({
    access_token:access_token,
    groupname:''
})

const line_access_token = ref('');
onMounted(()=>{
    console.log('access_token == ',access_token);

    
})
const submitForm = () =>{
    console.log('submit form');
    ApiMain.get(`line-access-token/get-token/${access_token}`).then((response) => {
    console.log(response);
    console.log('line access token ==',response.data.access_token)

    line_access_token.value = response.data.access_token ;

    ApiMain.post('line-access-token',{
        name:state.groupname,
        access_token:line_access_token.value,
        board_ids:[]
    }).then((res)=>{
        console.log(res);

    Swal.fire({
        title: "เพิ่มกลุ่มไลน์สำเร็จ",
        icon: "success",
        showCancelButton: false,
        confirmButtonColor: "#0E9F6E",
        confirmButtonText: "ตกลง",
    });
    router.push('/board-list');

        
    }).catch(error=>{

    console.log(error);
    });

}).catch(error => console.log(error));

};
</script>

<style>

</style>