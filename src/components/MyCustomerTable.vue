<script setup>
import { computed, ref, onMounted, reactive } from "vue";
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
  categories: []
});

const token = localStorage.getItem("tkfw");

const isModalActive = ref(false);

const isModalDangerActive = ref(false);


const perPage = ref(10);

const currPage = ref(0);

let searchName = ref('');


let select_status = ref('');

let pageAll = ref(0);
let totalRecord = ref(0);

let filter_result = ref(0);


onMounted(() => {
  fetchData();

});

const config = {
  auth: {
    username: 'admin',
    password: import.meta.env.VITE_PASS_CUSTOMER
  },
  headers: {
    Authorization: "Bearer " + localStorage.getItem("tkfw"),
  }

};
const fetchData = () => {

  //  ต้องการ take ข้อมุลทั้งหมดมาทีละเยอะๆ
  // รอการแก้ไข
  ApiSso.get("/api/mgr/users?page=1", {
    auth: {
      username: 'admin',
      password: import.meta.env.VITE_PASS_CUSTOMER
    },
    headers: {
      Authorization: "Bearer " + token,
    }

  }).then((respones) => {

    pageAll.value = respones.data.total_page;
    totalRecord.value = respones.data.total_record;
    filter_result.value = respones.data.total_record;
    states.customers = respones.data.data;

    console.log(states.customers);

  }).catch((error) => {
    console.log(error);
  });
};


//--------------------   Filter ------------------------

// const customers_list = computed(() => {
//   currPage.value = 1;
//   let response = states.customers;

//   return response.filter(data => {
//     let firstname = '';
//     let phone = '';
//     let email = '';

//     // มี filter ตอนกด Select
//     if (select_status.value != '' && searchName.value == '') {
//       return data.activated == select_status.value;
//     } else if ((select_status.value == '' && searchName.value != '')) {
//       if (data.first_name != null) {
//         firstname = data.first_name.toLowerCase();
//         phone = data.username.toLowerCase();
//         email = data.email;
//         if (firstname == null) {
//           firstname = '-';
//         }
//         if (email == null) {
//           email = "-";
//         }
//         return phone.includes(searchName.value) || firstname.includes(searchName.value) || email.includes(searchName.value);

//       } else {
//         return response;
//       }
//     } else if ((select_status.value != '' && searchName.value != '')) {
//       if (data.activated == select_status.value) {
//         if (data.first_name != null) {
//           firstname = data.first_name.toLowerCase();
//           phone = data.username.toLowerCase();
//           email = data.email;
//           if (firstname == null) {
//             firstname = '-';
//           }
//           if (email == null) {
//             email = "-";
//           }
//           return (data.activated == select_status.value) && phone.includes(searchName.value) || firstname.includes(searchName.value) || email.includes(searchName.value)
//         } else {
//           return response;
//         }
//       } else {
//         console.log('Null array');
//       }
//     } else if ((select_status.value == '' && searchName.value == '')) {
//       return response;
//     }
//   });
// });


// const statusFilter = (event) => {
//   select_status.value = event.target.value;
// };

// const pageStart = computed(() => {
//   return (currPage.value - 1) * perPage.value;
// });
// const totalPage = computed(() => {
//   let x = totalRecord.value ;
//   return Math.ceil(x / perPage.value);
// });

// const setPage = (idx) => {
//   if (idx <= 0 || idx > totalPage.value) {
//     return;
//   }
//   currPage.value = idx;

//   console.log('Page = '+currPage.value);

//   states.customers= [];
//   ApiSso.get(`/api/mgr/users?page=${idx}`, {
//     auth: {
//       username: 'admin',
//       password: import.meta.env.VITE_PASS_CUSTOMER
//     },
//     headers: {
//       Authorization: "Bearer " + token,
//     }

//   }).then((respones) => {
//     states.customers = respones.data.data;

//   }).catch((error) => {
//     console.log(error);
//   });



//   console.log('current page =='+currPage.value);
// };

// const pagesList = computed(() => {
//   const pagesList = []

//   for (let i = 0; i < totalPage.value; i++) {
//     pagesList.push(i)
//   }

//   return pagesList
// });
// const pages = computed(() => {
//   let numShown = 10;
//   let pagelist = pagesList.value;
//   numShown = Math.min(numShown, pagelist.length);

//   let first = (currPage.value) - Math.floor(numShown / 2);

//   first = Math.max(first, 1);

//   first = Math.min(first, pagelist.length - numShown + 1);
//   return [...Array(numShown)].map((k, i) => i + first);
// });



// ------------ New Solution ------------------
const numPages = computed(() => {
  return Math.ceil(totalRecord.value / perPage.value);
});

const currentPageHuman = computed(() => currPage.value + 1);

const pagesList = computed(() => {
  const pagesList = [];

  for (let i = 0; i < numPages.value; i++) {
    pagesList.push(i);
  }
  return pagesList;
});

const pageNext = (page) => {
  currPage.value = page;
  ApiSso.get("/api/mgr/users?page=" + (page + 1) + `&keyword=${searchName.value}&take=` + perPage.value, config).then((res) => {
    states.customers = res.data.data;
  });
};
const nextPage = () => {
  let x = currPage.value++;
  let pagelist = pagesList.value;
  if (x < pagelist.slice(-1)[0]) {

    ApiSso.get("/api/mgr/users?page=" + (x + 1) + `&keyword=${searchName.value}&take=` + perPage.value, config).then((res) => {
      states.customers = res.data.data;
    });
  }
  else {
    currPage.value = pagelist.slice(-1)[0];
  }
};
const previousPage = () => {
  let x = currPage.value--;
  if (x > 0) {

    ApiSso.get("/api/mgr/users?page=" + (x + 1) + `&keyword=${searchName.value}&take=` + perPage.value, config).then((res) => {
      states.customers = res.data.data;
    });
  }
  else {
    currPage.value = 0;
  }
};

const lastPage = () => {
  let pagelist = pagesList.value;
  currPage.value = pagelist.slice(-1)[0];

  ApiSso.get("/api/mgr/users?page=" + (currPage.value + 1) + `&keyword=${searchName.value}&take=` + perPage.value, config).then((res) => {
    states.customers = res.data.data;
  });
};
const firstPage = () => {
  let pagelist = pagesList.value;
  console.log(pagelist[0]);
  currPage.value = pagelist[0];
  ApiSso.get("/api/mgr/users?page=" + (currPage.value + 1) + `&keyword=${searchName.value}&take=` + perPage.value, config).then((res) => {
    states.customers = res.data.data;
  });
};
const pages = computed(() => {
  let numShown = 10; // This sets the number of page tabs
  let pagelist = pagesList.value;
  numShown = Math.min(numShown, pagelist.length);

  let first = (currPage.value) - Math.floor(numShown / 2);

  first = Math.max(first, 1);

  first = Math.min(first, pagelist.length - numShown + 1);
  return [...Array(numShown)].map((k, i) => i + first);
});


// Search Text

const searchText = () => {
  currPage.value = 0;
  states.customers = [];

  ApiSso.get(`/api/mgr/users?page=1&keyword=${searchName.value}`, config).then((res) => {
    states.customers = res.data.data;

    filter_result.value = res.data.total_record ;


    console.log(res.data.data.total_record);
  });


};
const myButton = ref(null);
const emptySearch = computed(()=>{
  if(searchName.value == ''){
    ApiSso.get(`/api/mgr/users?page=1`, config).then((res) => {
    states.customers = res.data.data;
  });
  }
  // else{
  //   myButton.value.click();
  // }
});


</script>

<template>
  <div class="hidden">{{ emptySearch }} </div>
  <div class="flex flex-row">
    <div class="w-1/4 ml-4 mr-[40px] mt-10">
      <form class="flex items-center">
        <label for="simple-search" class="sr-only">Search</label>
        <div class="relative w-full">
          <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg aria-hidden="true" class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor"
              viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clip-rule="evenodd"></path>
            </svg>
          </div>
          <input type="text" id="simple-search" v-model="searchName"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="อีเมล หรือ เบอร์โทรศัพท์มือถือ ">
        </div>
        <button ref="myButton" type="button" @click="searchText"
          class="p-2.5 ml-1 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          <span class="sr-only">Search</span>
        </button>
      </form>
      <small class="opacity-60">ค้นหาด้วย อีเมล หรือ เบอร์โทรศัพท์มือถือ </small>
    </div>
  </div>
  <div class="m-4 font-medium">จำนวนผู้ใช้งานทั้งหมด  : {{filter_result}}</div>
  <div class="relative mt-4">
    <!-- <div class="ml-4 my-4 font-bold">จำนวนลูกค้าทั้งหมด : <span class="font-medium">{{ customers_list.length }} คน</span></div> -->
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
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in states.customers" :key="item.id"
          :class="[tableTrStyle, index % 2 === 0 ? tableTrOddStyle : '']">
          <td class="text-center">{{ item.id }}</td>
          <td class="text-center">
            <div v-if="item.first_name == null || ''">-</div>
            <div v-else>{{ item.first_name }} {{ item.last_name }}</div>
          </td>
          <td class="text-center">
            <div v-if="item.email">{{ item.email }}</div>
            <div v-else>-</div>
          </td>
          <td class="text-center">{{ item.username }}</td>
          <td class="text-center">
            <div v-if="item.user_details.address == null || ''">-</div>
            <div v-else>{{ item.user_details.address }}</div>
          </td>
          <td class="text-center">
            <div v-if="item.createdAt == null">-</div>
            <div v-else>{{ moment(new Date(item.createdAt)).format('DD/MM/YYYY') }}</div>
          </td>
          <td class="text-center w-[200px]">
            <div v-if="item.activated == 0" class="text-orange-500 rounded-2xl py-1"><i
                class="fa-solid fa-exclamation bg-orange-200 px-2.5 py-1 rounded-full mr-1"></i>ยังไม่ได้ยืนยันตัวตน
            </div>
            <div v-if="item.activated == 1" class="text-green-500 rounded-2xl py-1"><i
                class="fa-solid fa-check text-green-700 bg-green-200 p-1 rounded-full mr-1"></i>ยืนยันตัวตนแล้ว</div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <nav :class="lightBorderStyle" aria-label="Page navigation example" class="py-2 mx-3 lg:mx-6 border-t border-b ">
    <ul class="inline-flex items-center -space-x-px">
      <li @click="firstPage">
        <a href="#"
          class="flex flex-row  px-2 py-2 ml-0 leading-tight text-white bg-gray-600 border border-gray-300  hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-white dark:text-white dark:hover:bg-gray-700 dark:hover:text-white rounded-l-lg">
          <i class="fa-solid fa-less-than  text-sm"></i>
          <i class="fa-solid fa-less-than  text-sm"></i>
        </a>
      </li>
      <li @click="previousPage">
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
      <li v-for="item in pages" :key="item" :class="{ active: item == currPage+1}" @click="pageNext(item-1)"
        class=" px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-400 dark:border-white dark:text-white dark:hover:bg-gray-700 dark:hover:text-white">
        <a href="#">{{item}}</a>
      </li>
      <li @click="nextPage">
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
      <li @click="lastPage">
        <a href="#"
          class="flex flex-row  px-2 py-2 ml-0 leading-tight text-white bg-gray-600 border border-gray-300  hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-white dark:text-white dark:hover:bg-gray-700 dark:hover:text-white rounded-r-lg">
          <i class="fa-solid fa-greater-than text-sm"></i>
          <i class="fa-solid fa-greater-than text-sm"></i>
        </a>
      </li>
    </ul>
    <small class="ml-4 text-sm font-medium">Page {{ currentPageHuman }} of {{ numPages }}</small>
  </nav>

</template>
<style scoped>
li.active,
li.active:hover {
  background-color: rgb(48, 48, 48);
  color: white;
}
</style>

