<template>
  <div>
    <div class="flex items-center justify-center bg-white h-[500px] m-4 rounded-lg shadow p-4">
        <div>
            <h1 class="font-bold text-xl text-center mb-10">Line Group</h1>
            <div class="flex flex-row items-center justify-center">
                <img src="../assets/images/line.png" alt="line icon">
            </div>
            <div class="text-center mt-10">
                <a :href="url" class="text-base font-medium rounded-lg border-2 border-gray-300 bg-white hover:bg-green-50  py-2.5 px-4 w-[200px]">เพิ่มกลุ่มไลน์</a>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup>

import { ref } from 'vue'


const cliend_id = import.meta.env.VITE_LINE_NOTI_CLIENT_ID ;
const url_redirect = import.meta.env.VITE_LINE_NOTI_REDIRECT_URI ;
let url = ref(`https://notify-bot.line.me/oauth/authorize?response_type=code&client_id=${cliend_id}&redirect_uri=${url_redirect}&state=code&scope=notify`) ;


</script>

<style>

</style>