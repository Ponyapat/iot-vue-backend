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
const per_edit = ref(false);
const per_del = ref(false);

const states = reactive({
  fruits: [],
  categories:[]
});

const token = localStorage.getItem("tkfw");

const isModalActive = ref(false);

const isModalDangerActive = ref(false);

const items = ref(1);

const perPage = ref(10);

const currentPage = ref(0);
let url = new URL(window.location.href);
const page_current = url.searchParams.get("page");

let fruits_ = ref([]);
let data_all = ref([]);
let searchName = ref('');

onBeforeMount(() => {
  if(ck_pms("update","breed")){
    per_edit.value = true
  }
  if(ck_pms("delete","breed")){
    per_del.value = true
  }
  fetchData();
});

const del = (id) => {
  Swal.fire({
    title: "ยืนยันการลบ",
    text: "คุณต้องการลบใช้หรือไม่",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Ok",
  }).then((result) => {
    console.log(result);
    if (result.isConfirmed == true) {
      ApiMain.delete("/breed/" + id).then((res) => {
          setInterval(function () {
            location.reload();
          }, 1500);
          Swal.fire("Deleted!", "Your file has been deleted.", "success");
          console.log("del" + id);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  });
};

const edit = (id) => {
  let path = '/fruits/edit?data_id=' + id;
  router.push(path);
};
const fetchData = () => {
  // ApiMain.get("/breed?order=DESC&page=" + (currentPage.value  + 1) + "&take=" + perPage.value).then((response) => {
  //     states.fruits = response.data.data;
  //     fruits_.value = response.data.data;
  //     items.value = response.data.meta.itemCount;
  //   });
  ApiMain.get("/breed?order=DESC&take=999999").then((response) => {
    states.fruits = response.data.data;
    console.log(states.fruits);

  });
  ApiMain.get("breed-categorise?order=ASC&page=1&take=999").then((response) => {
    states.categories = response.data.data;
  });
};


//--------------------   Filter ------------------------
const filter_categories = (event) => {
  states.fruits = [] ;
  let selected = event.target.value;
  if(selected == 'all'){
    ApiMain.get("breed?order=DESC&page=1&take=99999").then((res) => {
      states.fruits = res.data.data;
    });
  }
  else {
    ApiMain.get("breed?order=DESC&page=1&take=99999&breedCategoryId=" + selected).then((res) => {
      states.fruits = res.data.data;
    });
  }
};

let currPage = ref(1);

const fruits_list = computed(()=>{
    currPage.value = 1 ;
    let response = states.fruits ;
    return  response.filter(data => {
      const code = data.code.toLowerCase();
      const name = data.name.toLowerCase();
      return code.includes(searchName.value) || name.includes(searchName.value)
    });
});


const pageStart = computed(()=>{
    return (currPage.value - 1) * perPage.value;
});
const totalPage = computed(()=>{
  let x =fruits_list.value ;
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
  const pagesList = [];

  for (let i = 0; i < totalPage.value; i++) {
    pagesList.push(i);
  }
  return pagesList;
});

const pages = computed(() => {
    let numShown = 10;
    let pagelist = pagesList.value ;
    numShown = Math.min(numShown, pagelist.length);

    let first = (currentPage.value) - Math.floor(numShown / 2);

    first = Math.max(first, 1);

    first = Math.min(first, pagelist.length - numShown + 1);
    return [...Array(numShown)].map((k,i) => i + first);
});

// custom solution
// const numPages = computed(() => {
//   return Math.ceil(items.value / perPage.value);
// });

// const currentPageHuman = computed(() => currentPage.value + 1);

// const pagesList = computed(() => {
//   const pagesList = [];

//   for (let i = 0; i < numPages.value; i++) {
//     pagesList.push(i);
//   }
//   return pagesList;
// });

// const pageNext = (page) => {
//   currentPage.value = page;
//   ApiMain.get("/breed?order=DESC&page=" + (page + 1) + "&take=" + perPage.value).then((res) => {
//       states.fruits = res.data.data;
//       fruits_.value = res.data.data;
//     });
// };
// const nextPage = () => {
//   let x = currentPage.value++;
//   let pagelist = pagesList.value;
//   if (x < pagelist.slice(-1)[0]) {
//     ApiMain.get("/breed?order=DESC&page=" + (x + 1) + "&take=" + perPage.value)
//       .then((res) => {
//         states.fruits = res.data.data;
//         fruits_.value = res.data.data;
//       });
//   }
//   else {
//     currentPage.value = pagelist.slice(-1)[0];
//   }
// };
// const previousPage = () => {
//   let x = currentPage.value--;
//   if (x > 0) {
//     ApiMain.get("/breed?order=DESC&page=" + (x + 1) + "&take=" + perPage.value).then((res) => {
//       states.fruits = res.data.data;
//       fruits_.value = res.data.data;
//     });
//   }
//   else {
//     currentPage.value = 0;
//   }
// };

// const lastPage = () => {
//   let pagelist = pagesList.value;
//   currentPage.value = pagelist.slice(-1)[0];
//   ApiMain.get("/breed?order=DESC&page=" + (currentPage.value+1)  + "&take=" + perPage.value).then((res) => {
//       states.fruits = res.data.data;
//       fruits_.value = res.data.data;
//     });
// };
// const firstPage = () => {
//   let pagelist = pagesList.value;
//   console.log(pagelist[0]);
//   currentPage.value = pagelist[0];

//   ApiMain.get("/breed?order=DESC&page=" + (currentPage.value+1)  + "&take=" + perPage.value).then((res) => {
//       states.fruits = res.data.data;
//       fruits_.value = res.data.data;
//     });
// };
// const pages = computed(() => {
//     let numShown = 10; // This sets the number of page tabs
//     let pagelist = pagesList.value ;
//     numShown = Math.min(numShown, pagelist.length);

//     let first = (currentPage.value) - Math.floor(numShown / 2);

//     first = Math.max(first, 1);

//     first = Math.min(first, pagelist.length - numShown + 1);
//     return [...Array(numShown)].map((k,i) => i + first);
// });




</script>

<template>
  <div class="flex flex-row ">
    <div class="w-1/4 m-4 mt-10">
      <form>
        <div class="relative">
          <input v-model="searchName" id="search_input" type="text"
            class="block w-full p-2.5 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="ค้นหาชื่อพืชพันธุ์">
            <!-- <input v-model="states.searchName" id="search_input" v-on:keyup="myFunction()" type="text"
            class="block w-full p-2.5 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="ค้นหาชื่อพืชพันธุ์">-->
          <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg aria-hidden="true" class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor"
              viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
        </div>
        <small class="opacity-60">ค้นหาด้วย ชื่อ, รหัส</small>
      </form>
    </div>
    <div class="m-4 mt-5">
      <label for="categories" class="block text-sm font-medium text-gray-900 dark:text-white opacity-70">ประเภท</label>
      <select id="categories" @change="filter_categories($event)"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[200px] p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
        <option value="" disabled selected>เลือกประเภท</option>
        <option value="all" >ทั้งหมด</option>
        <option v-for="(item,index) of states.categories" :key="index" :value="item.id">{{item.name}}</option>
      </select>
    </div>
  </div>
  <div class=" relative">
    <table class="w-full text-sm text-left text-black dark:text-white">
      <thead class="text-base text-black uppercase bg-gray-50 dark:bg-gray-700 dark:text-white">
        <tr>
          <th scope="col" class="text-center py-3 w-[100px]">ID</th>
          <th scope="col" class="text-center py-3 w-[200px]">ชื่อ</th>
          <th scope="col" class="text-center py-3 w-[100px]">สายพันธุ์</th>
          <!-- <th scope="col" class="text-center py-3 px-6">ชื่อวิทยาศาสตร์</th>
          <th scope="col" class="text-center py-3 px-6">ชื่อสามัญ</th> -->
          <!-- <th scope="col" class="text-center py-3 px-6">รายละเอียด</th> -->
          <th scope="col" class="text-center py-3 w-[150px]">ประเภท</th>
          <th scope="col" class="text-center py-3 w-[150px]">อายุการเก็บเกี่ยว</th>
          <th scope="col" class="text-center py-3 w-[150px]">อุณหภูมิในอากาศ (°C)</th>
          <th scope="col" class="text-center py-3 w-[150px]">อุณหภูมิในดิน (°C)</th>
          <th scope="col" class="text-center py-3 w-[150px]">ความชื้นในดิน (%)</th>
          <th scope="col" class="text-center py-3 w-[150px]">pH ในดิน</th>
          <th scope="col" class="text-center py-3 px-6">EC ในดิน (μs/cm)</th>
          <!-- <th scope="col" class="text-center py-3 px-6">N</th> -->
          <!-- <th scope="col" class="text-center py-3 px-6">P</th> -->
          <!-- <th scope="col" class="text-center py-3 px-6">K</th> -->
          <!-- <th scope="col" class="text-center py-3 px-6">ปริมาณน้ำ</th> -->
          <!-- <th scope="col" class="text-center py-3 px-6">ความเข้มแสง</th> -->
          <th scope="col" class="text-center py-3 w-[150px]">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in fruits_list.slice(pageStart, pageStart + perPage)" :key="item.id" :class="[tableTrStyle, index % 2 === 0 ? tableTrOddStyle : '']">
          <td class="text-center">{{item.code}}</td>
          <td class="text-center">
            <div class="flex flex-row items-center">
              <div class="bg-white p-1 rounded-lg mr-2 shadow">
                <img v-if="item.image" :src="`/api-main/image/${item.image}?imageableType=breed`" class="w-[30px] h-[30px]" alt="">
                <img v-else :src="vagetable" alt="" class="w-[30px] h-[30px]">
              </div>
              <span class="truncate w-[100px]">{{item.name}}</span>
            </div>
          </td>
          <td class="text-center">{{item.species}}</td>
          <td class="text-center">
            <div :class="item.breedCategoryId==1?'bg-red-200':item.breedCategoryId==2?'bg-green-200':item.breedCategoryId==3?'bg-purple-200':'bg-pink-200'" class="px-2 py-1 border-0 rounded-2xl">
              <span v-if="item.breedCategoryId==1" class="dark:text-black"><i class="fa-sharp fa-solid fa-seedling text-red-600"></i> ผลไม้</span>
              <span v-else-if="item.breedCategoryId==2" class="dark:text-black"><i class="fa-sharp fa-solid fa-seedling text-green-600"></i> พืชผัก</span>
              <span v-else-if="item.breedCategoryId==3" class="dark:text-black"><i class="fa-sharp fa-solid fa-seedling text-green-800"></i> พืชไร่</span>
              <span v-else-if="item.breedCategoryId==4" class="dark:text-black"><i class="fa-sharp fa-solid fa-seedling text-pink-600"></i> ไม้ดอก</span>
              <span v-else class="dark:text-black"><i class="fa-sharp fa-solid fa-seedling text-pink-600"></i> อื่นๆ</span>
            </div>
          </td>
          <td class="text-center">{{item.harvestPeriod}}</td>
          <td class="text-center">{{parseFloat(item.airTemperatureMin)}} - {{parseFloat(item.airTemperatureMax)}}</td>
          <td class="text-center">{{parseFloat(item.soilTemperatureMin)}} - {{parseFloat(item.soilTemperatureMax)}}</td>
          <td class="text-center">{{parseFloat(item.soilMoistureMin)}} - {{parseFloat(item.soilMoistureMax)}}</td>
          <td class="text-center">{{parseFloat(item.soilPhMin)}} - {{parseFloat(item.soilPhMax)}}</td>
          <td class="text-center">{{parseFloat(item.soilEcMin)}} - {{parseFloat(item.soilEcMax)}}</td>
          <td class="text-center">
            <div class="flex flex-row justify-center items-center">
              <div>
                <button v-if="per_edit" @click="edit(item.id)" class="bg-blue-600 mr-3 px-2 py-1.5 rounded-md">
                  <i class="fa-solid fa-pen text-white text-base"></i>
                </button>
              </div>
              <div>
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
    <!-- <small class="ml-4 text-sm font-medium">Page {{ currentPageHuman }} of {{ numPages }}</small> -->
    <small class="ml-4 text-sm font-medium">Page {{ currPage }} of {{ totalPage }}</small>
  </nav>

  <!-- <nav :class="lightBorderStyle" aria-label="Page navigation example" class="py-2 mx-3 lg:mx-6 border-t border-b ">
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
      <li v-for="item in pages" :key="item" :class="{ active: item == currentPage+1}"
        @click="pageNext(item-1)" class=" px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-400 dark:border-white dark:text-white dark:hover:bg-gray-700 dark:hover:text-white">
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
  </nav> -->
</template>
<style>

li.active,li.active:hover {
  background-color: rgb(48, 48, 48);
  color: white;
}
</style>
