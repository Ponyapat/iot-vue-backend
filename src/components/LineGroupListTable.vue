<script setup>
import { computed, ref, onBeforeMount, reactive, onMounted } from "vue";
import { useMainStore } from "@/stores/main";
import { useRouter } from "vue-router";
import { mdiEye, mdiTrashCan, mdiGreasePencil } from "@mdi/js";
import ModalBox from "@/components/ModalBox.vue";
import CheckboxCell from "@/components/CheckboxCell.vue";
import Level from "@/components/Level.vue";
import JbButtons from "@/components/JbButtons.vue";
import JbButton from "@/components/JbButton.vue";
import UserAvatar from "@/components/UserAvatar.vue";
import Swal from "sweetalert2";
import moment from "moment";

defineProps({
  checkable: Boolean,
});

const router = useRouter();
const mainStore = useMainStore();
const tableTrStyle = computed(() => mainStore.tableTrStyle);
const tableTrOddStyle = computed(() => mainStore.tableTrOddStyle);
const darkMode = computed(() => mainStore.darkMode);
const token = localStorage.getItem("tkfw");

const config = {
  auth: {
    username: 'admin',
    password: import.meta.env.VITE_PASS_CUSTOMER
  },
  headers: {
    Authorization: "Bearer " + token,
  }

};

const states = reactive({
  linegroup: [],
  select_status: 'all',
  
});

let showModal = ref(false);
const items = ref(0);

const perPage = ref(10);

const currentPage = ref(0);

const per_edit = ref(false);
const per_del = ref(false);


const cliend_id = import.meta.env.VITE_LINE_NOTI_CLIENT_ID;
const url_redirect = import.meta.env.VITE_LINE_NOTI_REDIRECT_URI;
let url = ref(`https://notify-bot.line.me/oauth/authorize?response_type=code&client_id=${cliend_id}&redirect_uri=${url_redirect}&state=code&scope=notify`);


onMounted(() => {
  fetchData();
})

const fetchData = async () => {

  ApiMain.get("line-access-token/?take=9999&page=1").then((response) => {

    const obj = response.data.data ;
    // เอาเฉพาะกลุ่มไลน์ แอดมิน
    // let filter_isadmin = obj.filter(item=>item.is_admin === true) ;
    // console.log(filter_isadmin);
    // states.linegroup =filter_isadmin;
    states.linegroup =obj;
    console.log(response.data.data);

  }).catch((error) => {


    console.log(error);
  });
};

const del = (id) => {
  Swal.fire({
    title: "ยืนยันการลบ",
    text: "คุณต้องการลบ ภูมิศาสตร์(ข้อมูลกลาง)นี้ใช้หรือไม่",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Ok",
  }).then((result) => {
    if (result.isConfirmed) {
      ApiMain.delete("/geobase/" + warranty)
        .then((data) => {
          setInterval(function () {
            location.reload();
          }, 1500);
          Swal.fire("Deleted!", "ลบข้อมูลสำเร็จ", "success");
          console.log("del" + id);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  });
};

const edit = (id) => {
  router.push("/warranty-list/form?id=" + id);
};


let currPage = ref(1);
let searchName = ref('');


// filter dynamic
const linegroup_list = computed(() => {
  currPage.value = 1;
  let response = states.linegroup;

  return response.filter(item => {
    const linegroup_name = item.name.toUpperCase();
    const line_access_token = item.access_token.toUpperCase();
    return linegroup_name.includes((searchName.value).toUpperCase()) || line_access_token.includes((searchName.value).toUpperCase()) 

  });
});

const pageStart = computed(() => {
  return (currPage.value - 1) * perPage.value;
});
const totalPage = computed(() => {
  let x = linegroup_list.value;
  return Math.ceil(x.length / perPage.value);
});

const setPage = (idx) => {
  console.log('currPage == ' + idx);
  if (idx <= 0 || idx > totalPage.value) {
    return;
  }
  currPage.value = idx;
};
const pagesList = computed(() => {
  const pagesList = []

  for (let i = 0; i < totalPage.value; i++) {
    pagesList.push(i)
  }

  return pagesList
})
const pages = computed(() => {
  let numShown = 10;
  let pagelist = pagesList.value;
  numShown = Math.min(numShown, pagelist.length);

  let first = (currPage.value) - Math.floor(numShown / 2);

  first = Math.max(first, 1);

  first = Math.min(first, pagelist.length - numShown + 1);
  return [...Array(numShown)].map((k, i) => i + first);
});



const groupline = (serial_number) => {

  router.push('/board-list/groupline?serial_number=' + serial_number);
};


</script>

<template>
  <div v-if="showModal == true" class="fixed inset-0 z-40 bg-opacity-50 transition-opacity"
    style="background: rgba(0, 0, 0, 0.2);"></div>
  <div class="relative">
    <div class="flex flex-row justify-between">
      <div class="flex flex-row w-full">
        <div class="w-[400px] ml-4 mr-[40px] mt-10">
        <div class="relative">
          <input v-model="searchName" id="search_input" type="text"
            class="block w-full p-2.5 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="ค้นหาด้วย ชื่อกลุ่มไลน์, access token">
          <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg aria-hidden="true" class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor"
              viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
        </div>
        <small class="opacity-60">ค้นหาด้วย ชื่อกลุ่มไลน์, access token</small>
      </div>
      <div class="flex flex-row gap-2 ml-5">
        <div class="mt-5">
          <label for="categories"
            class="block text-sm font-medium text-gray-900 dark:text-white opacity-70">สถานะบอร์ด</label>
          <select id="categories" v-model="states.select_status" @change="filter_status($event)"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[200px] p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <option value="all">ทั้งหมด</option>
            <option value="ออนไลน์">ออนไลน์</option>
            <option value="ออฟไลน์">ออฟไลน์</option>
          </select>
        </div>
      </div>
    </div>
    
    <div class="flex flex-row justify-end w-full items-center mr-4">
        <div class="mt-3">
          <a :href="url"
            class="flex flex-row items-center justify-center  text-base font-medium rounded-lg border-2 border-gray-300 bg-white hover:bg-green-50  text-black dark:text-black py-2 px-4 ">
            <img src="../assets/images/line_button.png" alt="logo line" class="w-6 h-6 mr-2">สร้างกลุ่มไลน์</a>
        </div>
      </div>
    </div>
    <div class="ml-4 mb-4">
      <span class="text-base font-medium">จำนวนทั้งหมด : {{ linegroup_list.length }}</span>
    </div>
    <table>
      <thead class="bg-gray-600">
        <tr class="text-sm text-white ">
          <th class="text-center">ชื่อกลุ่มไลน์</th>
          <th class="text-center">Access Token</th>
          <th class="text-center">status</th>
          <th class="text-center">Board</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in linegroup_list.slice(pageStart, pageStart + perPage)" :key="item.id"
          :class="[tableTrStyle, index % 2 === 0 ? tableTrOddStyle : '', 'text-sm ']">
          <td class="text-center">
            {{ item.name}}
          </td>
          <td class="text-center">
            {{ item.access_token}}
          </td>
          <td class="text-center">
            <span v-if=" item.is_admin == true" class="bg-red-200 py-1 px-2 font-medium text-xs rounded-lg">แอดมิน</span>
            <span v-else class="bg-green-200 py-1 px-2 font-medium text-xs rounded-lg">กลุ่มธรรดา</span>
          </td>
          <td class="text-center">
            <div class="flex flex-row justify-center items-center">
              <router-link :to="`/linegroup-list/form-board?id=${item.id}`"
                class="bg-orange-300 text-black hover:bg-gray-600 hover:text-white mr-3 px-2 py-1 rounded-md">
                <i class="fa-solid fa-pen"></i>
              </router-link>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- Pagination -->
    <nav aria-label="Page navigation example" class="py-2 mx-3 lg:mx-6 border-t border-b ">
      <ul class="inline-flex items-center -space-x-px">
        <li v-bind:class="{ disabled: currPage === 1 }" @click.prevent="setPage(1)">
          <a href="#"
            class="flex flex-row  px-2 py-2 ml-0 leading-tight text-white bg-gray-600 border border-gray-300  hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-white dark:text-white dark:hover:bg-gray-700 dark:hover:text-white rounded-l-lg">
            <i class="fa-solid fa-less-than  text-sm"></i>
            <i class="fa-solid fa-less-than  text-sm"></i>
          </a>
        </li>
        <li v-bind:class="{ disabled: currPage === 1 }" @click.prevent="setPage(currPage - 1)">
          <a href="#"
            class="block px-2 py-2 ml-0 leading-tight text-white bg-gray-600 border border-gray-300  hover:bg-gray-500 hover:text-gray-700 dark:bg-gray-800 dark:border-white dark:hover:bg-gray-700 dark:hover:text-white">
            <span class="sr-only">Previous</span>
            <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" class="fill-white dark:fill-white"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clip-rule="evenodd"></path>
            </svg>
          </a>
        </li>
        <li v-for="item in pages" :key="item" :class="{ active: currPage == item }" @click="setPage(item)"
          class=" px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-400 dark:border-white dark:text-white dark:hover:bg-gray-700 dark:hover:text-white">
          <a href="#">{{ item }}</a>
        </li>
        <li v-bind:class="{ disabled: currPage === totalPage }" @click.prevent="setPage(currPage + 1)">
          <a href="#"
            class="block px-2 py-2 ml-0 leading-tight text-white bg-gray-600 border border-gray-300  hover:bg-gray-500 hover:text-gray-700 dark:bg-gray-800 dark:border-white dark:hover:bg-gray-700 dark:hover:text-white">
            <span class="sr-only">Next</span>
            <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg">
              <path fill="#FFF" fill-rule="evenodd" class="fill-white dark:fill-white"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clip-rule="evenodd"></path>
            </svg>
          </a>
        </li>
        <li v-bind:class="{ disabled: currPage === totalPage }" @click.prevent="setPage(totalPage)">
          <a href="#"
            class="flex flex-row  px-2 py-2 ml-0 leading-tight text-white bg-gray-600 border border-gray-300  hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-white dark:text-white dark:hover:bg-gray-700 dark:hover:text-white rounded-r-lg">
            <i class="fa-solid fa-greater-than text-sm"></i>
            <i class="fa-solid fa-greater-than text-sm"></i>
          </a>
        </li>
      </ul>

      <small class="ml-4 text-sm font-medium">Page {{ currPage }} of {{ totalPage }}</small>
    </nav>
    <div>
      
  </div>
  <!-- Modal -->
</div></template>
<style scoped>li.active,
li.active:hover {
  background-color: rgb(48, 48, 48);
  color: white;
}</style>
