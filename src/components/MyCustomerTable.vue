<script setup>
import { computed, ref, onBeforeMount, reactive } from "vue";
import { useMainStore } from "@/stores/main";
import { useRouter } from "vue-router";
import { mdiEye, mdiTrashCan, mdiGreasePencil } from "@mdi/js";
import ModalBox from "@/components/ModalBox.vue";
import CheckboxCell from "@/components/CheckboxCell.vue";
import Level from "@/components/Level.vue";
import JbButtons from "@/components/JbButtons.vue";
import JbButton from "@/components/JbButton.vue";
import UserAvatar from "@/components/UserAvatar.vue";
import axios from "axios";
import Swal from "sweetalert2";
import moment from "moment";
import vagetable from "/images/cabbage.png";

defineProps({
  checkable: Boolean,
});


const router = useRouter();

const mainStore = useMainStore();

const lightBorderStyle = computed(() => mainStore.lightBorderStyle);

const lightBgStyle = computed(() => mainStore.lightBgStyle);

const tableTrStyle = computed(() => mainStore.tableTrStyle);

const tableTrOddStyle = computed(() => mainStore.tableTrOddStyle);

const darkMode = computed(() => mainStore.darkMode);

const states = reactive({
  customers: [],
  categories:[]
});

const token = localStorage.getItem("tkfw");

const isModalActive = ref(false);

const isModalDangerActive = ref(false);

const items = ref(1);
const perPage = ref(10);
const currentPage = ref(0);

let searchName = ref('');

onBeforeMount(() => {
  fetchData();

});

const fetchData = () => {
  ApiSso.get("/api/mgr/users",{
        auth: {
          username: 'admin',
          password: import.meta.env.VITE_PASS_CUSTOMER
        },
        headers: {
          Authorization: "Bearer " + token,
        }

      }).then((respones)=>{
        console.log(respones);
        states.customers = respones.data.data;
      }).catch((error) => {
        console.log(error);
  });
};


//--------------------   Filter ------------------------
let currPage = ref(1);

const customers_list = computed(()=>{
    currPage.value = 1 ;
    let response = states.customers ;
    return  response.filter(data => {
      let firstname = '' ;
      let phone = '' ;
      if(data.first_name != null ){
        firstname = data.first_name.toLowerCase();
        phone = data.username.toLowerCase();
        return phone.includes(searchName.value) ||firstname.includes(searchName.value);
      }
      else{
        return response;
      }

    });
});


const pageStart = computed(()=>{
    return (currPage.value - 1) * perPage.value;
});
const totalPage = computed(()=>{
  let x =customers_list.value ;
  return Math.ceil(x.length / perPage.value);
});

const setPage = (idx) =>{
    console.log('currPage == '+idx);
    if( idx <= 0 || idx > totalPage.value ){
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
    let pagelist = pagesList.value ;
    numShown = Math.min(numShown, pagelist.length);

    let first = (currPage.value) - Math.floor(numShown / 2);

    first = Math.max(first, 1);

    first = Math.min(first, pagelist.length - numShown + 1);
    return [...Array(numShown)].map((k,i) => i + first);
});


</script>

<template>
  <div class="flex flex-row">
    <div class="w-1/4 ml-4 mr-[40px] mt-10" >
        <div class="relative">
          <input v-model="searchName" id="search_input" type="text"
            class="block w-full p-2.5 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="ค้นหา ชื่อลูกค้า,เบอร์โทรศัพท์มือถือ">
          <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg aria-hidden="true" class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor"
              viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
        </div>
        <small class="opacity-60">ค้นหาด้วย ชื่อลูกค้า , เบอร์โทรศัพท์มือถือ </small>
    </div>
  </div>
  <div class="relative mt-4">
    <table class="w-full text-sm text-left text-black dark:text-white">
      <thead class="text-base text-white uppercase bg-gray-600 dark:bg-gray-700 dark:text-white">
        <tr>
          <th scope="col" class="text-center py-3 w-[100px]">ID</th>
          <th scope="col" class="text-center py-3 w-[200px]">ชื่อลูกค้า</th>
          <th scope="col" class="text-center py-3 w-[200px]">อีเมล</th>
          <th scope="col" class="text-center py-3 w-[100px]">เบอร์โทร</th>
          <th scope="col" class="text-center py-3 w-[100px]">ที่อยู่</th>
          <th scope="col" class="text-center py-3 w-[100px]">วันที่สมัคร</th>
          <th scope="col" class="text-center py-3 w-[100px]">สถานะ</th>
          <!-- <th scope="col" class="text-center py-3 w-[150px]">Action</th> -->
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in customers_list.slice(pageStart, pageStart + perPage)" :key="item.id" :class="[tableTrStyle, index % 2 === 0 ? tableTrOddStyle : '']">
          <td class="text-center">{{item.id}}</td>
          <td class="text-center">
            <div v-if="item.first_name==null">-</div>
            <div v-else>{{item.first_name}} {{item.last_name}}</div>
          </td>
          <td class="text-center">
            <div v-if="item.email">{{item.email}}</div>
            <div v-else>-</div>
          </td>
          <td class="text-center">{{item.username}}</td>
          <td class="text-center">
            <div v-if="item.user_details.address == null">-</div>
            <div v-else>{{item.user_details.address }}</div>
          </td>
          <td class="text-center">
            <div v-if="item.createdAt == null">-</div>
            <div v-else>{{ moment(new Date(item.createdAt)).format('DD/MM/YYYY') }}</div>
          </td>
          <td class="text-center">
            <div v-if="item.activated==0" class="bg-orange-300 rounded-2xl py-1">ยังไม่ได้ยืนยันตัวตน</div>
            <div v-if="item.activated==1" class="bg-green-500 rounded-2xl py-1">ยืนยันตัวตนแล้ว</div>
          </td>
          <!-- <td class="text-center">
            <div class="flex flex-row justify-center items-center">
              <div>
                <button @click="edit(item.id)" class="bg-blue-600 mr-3 px-2 py-1.5 rounded-md">
                  <i class="fa-solid fa-pen text-white text-base"></i>
                </button>
              </div>
              <div>
                  <button @click="del(item.id)" class="bg-red-600 px-2 py-1.5 rounded-md">
                    <i class="fa-solid fa-trash text-white text-base"></i>
                  </button>
              </div>
            </div>
          </td> -->
        </tr>
      </tbody>
    </table>
  </div>
  <nav :class="lightBorderStyle" aria-label="Page navigation example" class="py-2 mx-3 lg:mx-6 border-t border-b ">
    <ul class="inline-flex items-center -space-x-px">
      <li v-bind:class="{ disabled: currPage === 1  }" @click.prevent="setPage(1)">
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
      <li v-for="item in totalPage" :key="item" :class="{ active: currPage == item}"
        @click="setPage(item)" class=" px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-400 dark:border-white dark:text-white dark:hover:bg-gray-700 dark:hover:text-white">
        <a href="#">{{item}}</a>
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

</template>
<style>

li.active,li.active:hover {
  background-color: rgb(48, 48, 48);
  color: white;
}
</style>

