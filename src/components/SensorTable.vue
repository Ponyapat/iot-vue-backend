
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
import axios from "axios";
import Swal from "sweetalert2";
import moment from "moment";

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

const user_email = localStorage.getItem('email');

const states = reactive({
  email: '',
  sensor: [],
  search: '',
  select_status1: 'all',
  select_status2: 'all',
  select_status3: 'all',
  categories: [],
});

const filterKey1 = ref('type');
const filterKey2 = ref('category');
const filterKey3 = ref('status');

const searchName = ref('');
const selectedTypeFilter = ref('all');
const selectedCategoryFilter = ref('all');
const selectedStatusFilter = ref('all');


const filterAll = {type:'',}

const token = localStorage.getItem("tkfw");

const isModalActive = ref(false);

const isModalDangerActive = ref(false);

const items = ref(1);

const perPage = ref(10);

const currentPage = ref(0);
let url = new URL(window.location.href);
const page_current = url.searchParams.get("page");


let type_filter = reactive([
  { id: 1, type: 'lan' }, ]);

let status_filter = reactive([
  { id: 1, status: 'active' }, { id: 2, status: 'inactive' }
]);

let category_filter = reactive([
  { id: 1, name: 'กลุ่มดิน' },{ id: 2, name: 'กลุ่มน้ำ' },{ id: 3, name: 'กลุ่มอากาศ' },{ id: 4, name: 'กลุ่มแสง' },
  { id: 5, name: 'กลุ่มเสียง' }, { id: 6, name: 'กลุ่มพลังงาน' }, { id: 7, name: 'กลุ่มตำแหน่ง' }, { id: 8, name: 'อื่นๆ' },
]);


const per_edit = ref(false);
const per_del = ref(false);

onBeforeMount(() => {
  if (ck_pms("update", "sensor-mgr")) {
    per_edit.value = true
  }
  if (ck_pms("delete", "sensor-mgr")) {
    per_del.value = true
  }
  fetchData();
});

const del = (id) => {
  Swal.fire({
    title: "ยืนยันการลบ",
    text: "คุณต้องการลบใช่หรือไม่",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Ok",
  }).then((result) => {
    console.log(result);
    if (result.isConfirmed == true) {
      ApiMain.delete("/sensors/" + id).then((res) => {
        setInterval(function () {
          location.reload();
        }, 1500);
        Swal.fire("Deleted!", "Your sensor has been deleted.", "success");
        console.log("del" + id);
      })
        .catch((error) => {
          console.log(error);
        });
    }
  });
};

//serch name by keyword
// const searchText = () => {
//   currPage.value = 1;
//   ApiMain.get(`/sensors?order=ASC&page=1&take=999&name=${searchName.value}`).then((response) => {
//     states.sensor = response.data.data;

//     console.log(searchName.value)
//   });
// };

const edit = (id) => {
  let path = '/sensor-list/edit?sensor_edit=' + id;
  router.push(path);
};
const fetchData = () => { 

  ApiMain.get("/sensors?order=ASC&page=1&take=9999").then((response) => {
    states.sensor = response.data.data;
    
    console.log(response.data.data);



  }).catch((error) => {
    console.log(error);
  });
};


let type_select = ref('all');
let category_select = ref('all');
let status_select = ref('all');

//--------------------   Filter ------------------------


const filterData = () => {

  const typeValue = selectedTypeFilter.value;
  const categoryValue = selectedCategoryFilter.value;
  const statusValue = selectedStatusFilter.value;

  const category_id = categoryValue === 'all' ? '' : `&category_id=${categoryValue}`;
  const name = searchName.value === '' ? '' : `&name=${searchName.value}`;
  const type = typeValue === 'all' ? '' : `&type=${typeValue}`;
  const status = statusValue === 'all' ? '' : `&status=${statusValue}`;

  const url = `/sensors?order=ASC&page=1&take=9999${category_id}${name}${type}${status}`;

  ApiMain.get(url)
    .then((response) => {
      states.sensor = response.data.data;
      console.log(url);
      console.log(status);
    })
    .catch((error) => {
      console.log(error);
    });
};


let currPage = ref(1);

const sensor_list = computed(() => {
  currPage.value = 1;
  let response = states.sensor;
  return response;
})



const pageStart = computed(() => {
  return (currPage.value - 1) * perPage.value;
});
const totalPage = computed(() => {
  let x = sensor_list.value;
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
  let numShown = 3;
  let pagelist = pagesList.value;
  numShown = Math.min(numShown, pagelist.length);

  let first = (currPage.value) - Math.floor(numShown / 2);

  first = Math.max(first, 1);

  first = Math.min(first, pagelist.length - numShown + 1);
  return [...Array(numShown)].map((k, i) => i + first);
});

const dynamicSelect = computed(() => {

});

const getImage = (img_name) => {

  if (img_name) {
    let image = import.meta.env.VITE_API_MAIN + `/image/${img_name}?folder=sensors`;
    return image;
  } else {
    return '/sensors/default_sensor.svg'
  }
};

// const exportExcel = () => {

// console.log(states.email);

// ApiMain.post(`/reports/export-sensor`, {
//   email: user_email,

// }).then((response) => {
//   console.log('status send file CSV = ' + response.status);
//   if (response.status == 200) {
//     Swal.fire({
//       title: "ส่งไฟล์ CSV เรียบร้อย",
//       text: `ส่งไฟล์ เข้า email : ${user_email}`,
//       icon: "success",
//       confirmButtonColor: "#31C48D",
//       confirmButtonText: "ตกลง",
//     })
//   }
// }).catch((error) => {
//   console.log(error);
// }); 
// };

const exportExcel = () => {

console.log(states.email, 'name : ' + searchName.value);
ApiMain.post(`/reports/export-sensor`, {
  email: user_email,
  name: searchName.value,

}).then((response) => {
  console.log('status send file CSV = ' + response.status);
  if (response.status == 200) {
    Swal.fire({
      title: "ส่งไฟล์ CSV เรียบร้อย",
      text: `ส่งไฟล์ เข้า email : ${user_email}`,
      icon: "success",
      confirmButtonColor: "#31C48D",
      confirmButtonText: "ตกลง",
    })
  }
}).catch((error) => {
  console.log(error);
});
};


</script>

<template>
  <div class="w-full flex flex-col md:flex-row">
    <div class=" flex flex-row md:flex-col w-full  justify-center ml-0 md:ml-4 mr-[40px] mt-5 sm:mt-10 ">
      <div class="relative w-full px-4 sm:px-0 mx-5 md:mx-0">
        <input v-model="searchName" @keydown="filterData($event)" id="search_input" type="text"
          class="block w-full  pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="ค้นหาด้วย ชื่ออุปกรณ์">
        <div class="absolute w-full inset-y-0 left-0 flex items-center pl-7 sm:pl-3 lg:pl-3 pointer-events-none">
          <svg aria-hidden="true" class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor"
            viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
      </div>
      <small class="hidden lg:flex opacity-60 ">ค้นหาด้วย ชื่ออุปกรณ์</small>
    </div>

    <div class="flex flex-col mt-5 md:flex-row gap-2 sm:gap-6 lg:gap-10 mx-9 sm:mx-5">

      <!-- type filter -->
      <div class=" flex flex-col items-center">
        <label for="categories" class="block text-sm font-medium text-gray-900 dark:text-white opacity-70">ประเภท</label>
        <select id="categories"  @change="filterData($event, filterKey1)" v-model="selectedTypeFilter"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full md:w-28 lg:w-[200px] p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
          <option value="all">ทั้งหมด</option>
          <option v-for="(item, index) of type_filter" :key="index" :value="item.type">{{ item.type }}</option>
        </select>
      </div>

      <!-- category filter -->
      <div class=" flex flex-col items-center" >
      <label for="categories" class="block text-sm font-medium text-gray-900 dark:text-white opacity-70">กลุ่ม</label>
      <select id="categories" @change="filterData($event, filterKey2)" v-model="selectedCategoryFilter"
      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full md:w-28 lg:w-[200px] p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
        <option value="all" >ทั้งหมด</option>
        <option v-for="(item, index) of category_filter" :key="index" :value="item.id">{{ item.name }}</option>
      </select>
    </div>
      
      <!-- status filter -->
      <div class=" flex flex-col items-center">
        <label for="categories" class="block text-sm font-medium text-gray-900 dark:text-white opacity-70">สถานะ</label>
        <select id="categories" @change="filterData($event, filterKey3)" v-model="selectedStatusFilter"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full md:w-28 lg:w-[200px] p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
          <option value="all">ทั้งหมด</option>
          <option v-for="(item, index) of status_filter" :key="index" :value="item.status">{{ item.status }}</option>
        </select>
      </div>
    </div>
  </div>


  <div class="flex justify-between ">
    <div class="m-4">จำนวนทั้งหมด : {{ sensor_list.length }}</div>
    <div class="mr-4">
      <button type="button" @click="exportExcel"
        class="bg-orange-300 text-sm md:text-base font-medium px-4 py-1 m-4 rounded-lg text-black"><i
          class="fa-solid fa-file"></i>
        Export Excel</button>
    </div>
  </div>


  <div class="relative overflow-x-auto  min-w-full pb-4 ">
    <table class="w-full text-sm text-left text-black dark:text-white whitespace-nowrap">
      <thead class="text-base text-white  bg-gray-600 dark:bg-gray-700 dark:text-white whitespace-nowrap text-center">
        <tr class="py-1">
          <th scope="col" class="text-xs md:text-sm px-2">ID</th>
          <div class="flex justify-between w-60 px-2">
            <th scope="col" class="text-xs md:text-sm">ชื่อ</th>
            <th scope="col" class="text-xs md:text-sm">Icon</th>
          </div>
          <th scope="col" class="text-xs md:text-sm">Name</th>
          <th scope="col" class="text-xs md:text-sm">Unit abbrv</th>
          <th scope="col" class="text-xs md:text-sm">Unit full th</th>
          <th scope="col" class="text-xs md:text-sm">Unit full en</th>
          <th scope="col" class="text-xs md:text-sm">Input type</th>
          <th scope="col" class="text-xs md:text-sm">Status</th>
          <th scope="col" class="text-xs md:text-sm">Category</th>
          <th></th>

        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in sensor_list.slice(pageStart, pageStart + perPage)" :key="item.id"
          :class="[tableTrStyle, index % 2 === 0 ? tableTrOddStyle : '']" >
          <td class="text-center">{{ item.id }}</td>

          <!-- ชื่อไทย -->
          <td class="flex justify-between px-0 py-8 lg:px-2 w-54 lg:w-60 h-[40px] items-center">
            <div class="flex text-sm  font-medium items-center">
              <span v-if="item.name != ''" >
                {{ item.name.th }}</span>
              <span v-else>-</span>
            </div>
            <div v-if="item.imageWithBackgroundName !=  null && item.imageName != '' ">
              <img :src="getImage(item.imageWithBackgroundName, 'sensors')" :width="40" alt="sensors">
            </div>
            <span v-else class="mr-4">-</span>
          </td>

          <!-- img -->

          <!-- <td class=" ">
              <div >
                <span v-if="item.image_name !=''">{{ item.image_with_background_name }}</span>
                <span v-else>-</span>
              </div>
            </td> -->


          <!-- name -->
          <td>
            <div class="text-sm font-medium px-6 lg:px-4 text-center">
              <span v-if="item.name != ''">{{ item.name.en? item.name.en : "-" }}</span>
              <span v-else>-</span>
            </div>
          </td>

          <!-- unit abbrv -->
          <td>
            <div class="text-sm font-medium px-2 text-center">
              <span v-if="item.unit != ''">{{ item.unit.en ? item.unit.en : "-" }}</span>
              <span v-else>-</span>
            </div>
          </td>

          <!-- unit full th -->
          <td>
            <div class="text-sm font-medium px-2 text-center">
              <span v-if="item.unit != ''">{{ item.unit.th ? item.unit.th : "-" }}</span>
              <span v-else>-</span>
            </div>
          </td>

          <!-- unit full en -->
          <td>
            <div class="text-sm font-medium px-2 text-center">
              <span v-if="item.unit != ''">{{ item.unit.en_name ? item.unit.en_name : "-" }}</span>
              <span v-else>-</span>
            </div>
          </td>

          <!-- type -->
          <td class="text-center w-20 px-2">
            <div class="text-center" v-if="item.type">
              <div v-if="item.type == 'lan'">
                <span class="bg-[#d7fcf8] rounded-lg text-sm text-black font-medium p-2 ">Lan</span>
              </div>
              <div v-if="item.type == ''">
                <span class="bg-[#d7e3fc] rounded-lg text-sm text-black font-medium p-2 "><i
                    class="fa-solid fa-building-circle-arrow-right mr-2"></i> {{ item.type }}</span>
              </div>
            </div>
            <div v-else class="text-center">-</div>
          </td>

          <!-- status -->
          <td class="text-center w-20 px-2">
            <div class=" bg-green-200 rounded-lg text-sm text-black font-medium p-2" v-if="item.status == 'active'">Active
            </div>
            <div class="bg-[#B4B4B3] rounded-lg text-sm text-black font-medium p-2" v-else-if="item.status == 'inactive'">
              <span>Inactive</span>
            </div>
          </td>

          <!-- <td class="text-center">
            <div class="truncate w-[120px]">
              <span v-if="item.note !=''">{{item.note}}</span>
              <span v-else>-</span>
            </div>
          </td> -->

          <!-- category -->
          <td>
            <div class="text-sm font-medium px-4 text-center">
       
              <span v-if="item.category?.name.th">{{ item.category.name.th ? item.category.name.th : '-' }}</span>
              
            </div>
          </td>

          <!-- action -->
          <td class="text-center pr-2">
            <div class="flex flex-row justify-center items-center">
              <div title="แก้ไขข้อมูล">
                <button v-if="per_edit" @click="edit(item.id)" class="bg-blue-600 mr-3 px-2 py-1.5 rounded-md">
                  <i class="fa-solid fa-pen text-white text-base"></i>
                </button>
              </div>
              <div title="ลบข้อมูล">
                <button v-if="per_del" @click="del(item.id)" class="bg-red-600 px-2 py-1.5 rounded-md">
                  <i class="fa-solid fa-trash text-white text-base"></i>
                </button>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>


  <nav :class="lightBorderStyle" aria-label="Page navigation example"
    class="flex flex-col lg:flexrow justify-center items-center py-2 mx-3 lg:mx-6 border-t border-b ">
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
    <!-- <small class="ml-4 text-sm font-medium">Page {{ currentPageHuman }} of {{ numPages }}</small> -->
    <small class="ml-4 text-sm font-medium">Page {{ currPage }} of {{ totalPage }}</small>
  </nav>
</template>
<style scoped>
li.active,
li.active:hover {
  background-color: rgb(48, 48, 48);
  color: white;
}</style>


