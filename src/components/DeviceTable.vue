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

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';


pdfMake.vfs = pdfFonts.pdfMake.vfs;

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
  device: [],
  select_status: 'all',
  categories:[]
});

let status_filter = reactive([
  { id: 1, status: 'active' }, { id: 2, status: 'inactive' }
]);

let kafka_filter = reactive([
  { id: 1, kafkaTopic: 'controlWaterPump' }, { id: 2, status: 'controlMotor' } ,{ id: 3, kafkaTopic: 'controlWaterValve' }, { id: 4, kafkaTopic: 'controlLight' }, { id: 5, kafkaTopic: 'controlFanIn' }, 
  { id: 6, kafkaTopic: 'controlFanOut' }, { id: 7, kafkaTopic: 'controlWaterPump' }, { id: 8, kafkaTopic: 'controlWaterPump' }, 
]);

const token = localStorage.getItem("tkfw");

const isModalActive = ref(false);

const isModalDangerActive = ref(false);

const items = ref(1);

const perPage = ref(10);

const currentPage = ref(0);
let url = new URL(window.location.href);
const page_current = url.searchParams.get("page");

let searchName = ref('');

const per_edit = ref(false);
const per_del = ref(false);

onBeforeMount(() => {
  if(ck_pms("update","device-mgr")){
    per_edit.value = true
  }
  if(ck_pms("delete","device-mgr")){
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
      ApiMain.delete("/devices/" + id).then((res) => {
          setInterval(function () {
            location.reload();
          }, 1500);
          Swal.fire("Deleted!", "Your Device has been deleted.", "success");
          console.log("del" + id);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  });
};

const edit = (id) => {
  let path = '/device-list/edit?device_edit=' + id;
  router.push(path);
};

const fetchData = () => {
  ApiMain.get("/devices?order=ASC&page=1&take=9999").then((response) => {
    states.device = response.data.data;

  }).catch((error) => {
    console.log(error);
  });;
};


let status_select = ref('all');

//--------------------   Filter ------------------------

const filter_status = (event) => {
  states.select_status = event.target.value;
};


let currPage = ref(1);

const device_list = computed(()=>{
    currPage.value = 1 ;
    let response = states.device ;
    return response.filter(item => {
    const dev = item.name.th.toUpperCase();

    if (searchName.value == '' && states.select_status == 'all') {
      return item
    }
    else if (searchName.value != '' && states.select_status == 'all') {
      return dev.includes((searchName.value).toUpperCase())
    }else {
      if (item.status) {
        console.log(item.status);
        return dev.includes((searchName.value).toUpperCase()) && (item.status == states.select_status)
      }
      else {
        return dev.includes((searchName.value).toUpperCase()) && ('active' == states.select_status)
      }
    }
    // if(searchName.value == ''){
    //   if(states.select_status == 'all'){
    //   return item
    // }
    // else{
    //   if(item.getStatusBoard){
    //     return (item.getStatusBoard && item.getStatusBoard.noti_status_text == states.select_status)
    //   }
    //   else{
    //     return ('ออฟไลน์' == states.select_status )
    //   }
    // }
    // }
    // else{
    //   return serial.includes(searchName.value)
    // }

  });
});


const pageStart = computed(()=>{
    return (currPage.value - 1) * perPage.value;
});
const totalPage = computed(()=>{
  let x =device_list.value ;
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
    let numShown = 3;
    let pagelist = pagesList.value ;
    numShown = Math.min(numShown, pagelist.length);

    let first = (currPage.value) - Math.floor(numShown / 2);

    first = Math.max(first, 1);

    first = Math.min(first, pagelist.length - numShown + 1);
    return [...Array(numShown)].map((k,i) => i + first);
});

const dynamicSelect = computed(()=>{

});

const getImage = (img_name) => {

if (img_name) {
  let image = import.meta.env.VITE_API_MAIN + `/image/${img_name}?folder=devices`;
  return image;
} else {
  return '/sensors/default_sensor.svg'
}
};

const generatePDF = async () => {
  try {
    // ดึงข้อมูลจาก API โดยใช้ Axios หรือไลบรารี HTTP อื่น ๆ
    const response = await ApiMain.get("/devices?order=ASC&page=1&take=9999");

    // ดึงข้อมูลที่ได้จาก response.data
    const data = response.data;

    // สร้างเอกสาร PDF จากข้อมูล
    const docDefinition = {
      content: [
        'สวัสดี, นี่คือเอกสาร PDF ที่สร้างด้วย Vue.js',
        { text: 'ข้อมูลจาก API:', style: 'subheader' },
        { text: JSON.stringify(data, null, 2) },
      ],
      styles: {
        subheader: {
          fontSize: 16,
          bold: true,
        },
      },
    };

    pdfMake.createPdf(docDefinition).download('example.pdf');
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการดึงข้อมูลหรือสร้าง PDF', error);
  }
};

</script>

<template>
  <div class="w-full flex flex-col md:flex-row">
    <div class=" flex flex-row md:flex-col w-full  justify-center ml-0 md:ml-4 mr-[40px] mt-5 sm:mt-10 px-4" >
        <div class="relative w-full px-4 sm:px-0">
          <input v-model="searchName" id="search_input" type="text"
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

    <div class="flex flex-col  md:flex-row gap-2 sm:gap-6 lg:gap-10 mx-5">
    <div class="sm:mt-5 flex flex-col items-center">
      <label for="categories" class="block text-sm font-medium text-gray-900 dark:text-white opacity-70">สถานะ</label>
      <select id="categories" @change="filter_status($event)"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full md:w-28 lg:w-[200px] p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
        <option value="all" >ทั้งหมด</option>
        <option v-for="(item,index) of status_filter" :key="index" :value="item.status">{{item.status}}</option>
      </select>
      
    </div>
   
  </div>
  
  </div>

 <div class="flex justify-between ">
    <div class="m-4">จำนวนทั้งหมด  : {{device_list.length}}</div>
  
 </div>


  <div class="relative overflow-x-auto  min-w-full pb-4 whitespace-nowrap ">
    <table class="w-full text-sm text-left text-black dark:text-white">
      <thead class="text-base text-white  bg-gray-600 dark:bg-gray-700 dark:text-white whitespace-nowrap text-center">
        <tr>
          <th scope="col" class="text-xs md:text-sm">ID</th>
          <th scope="col" class="text-xs md:text-sm">ชื่อ</th>
          <th scope="col" class="text-xs md:text-sm">Icon</th>
          <th scope="col" class="text-xs md:text-sm">Name</th>
          <th scope="col" class="text-xs md:text-sm">Kafka Topic</th>
          <th scope="col" class="text-xs md:text-sm">Status</th>
          <th></th>
        </tr>
      </thead>
      <tbody >
        <tr v-for="(item, index) in device_list.slice(pageStart, pageStart + perPage)" :key="item.id" :class="[tableTrStyle, index % 2 === 0 ? tableTrOddStyle : '']">
          <!-- id -->
          <td class="text-center py-2">{{item.id}}</td>

          <!-- ชื่อ -->
          <td >
            <div class="flex justify-center text-sm font-medium px-4 md:px-0" >
              <span v-if="item.name.th !=''">{{item.name.th}}</span>
              <span v-else>-</span>
            </div>
          </td>

          <!-- icon -->
            <td>
              <div class="flex justify-center text-sm font-medium " v-if="item.imageName != null ">
                <img :src="getImage(item.imageName, 'devices')" :width="40" alt="devices">
              </div>
              <span v-else class="mr-3">-</span>
            </td>

          <!-- Name -->
          <td >
              <div class="flex justify-center text-sm font-medium px-4 md:px-0" >
              <span v-if="item.name.en !=''">{{item.name.en}}</span>
              <span v-else>-</span>
            </div>
          </td>

          <!-- Kafka -->
          <td >
              <div class="flex justify-center text-sm font-medium " >
              <span v-if="item.kafkaTopic !=''">{{item.kafkaTopic}}</span>
              <span v-else>-</span>
            </div>
          </td>
          
           <!-- status -->
           <td class="text-center w-20 px-2">
            <div class=" bg-green-200 rounded-lg text-sm text-black font-medium p-2" v-if="item.status == 'active'">Active
            </div>
            <div class="bg-[#e45e5e] rounded-lg text-sm text-black font-medium p-2" v-else-if="item.status == 'inactive' || ''">
              Inactive</div>
              <div class="bg-[#B4B4B3] rounded-lg text-sm text-black font-medium p-2" v-else>
              -</div>
          </td>


          <!-- Action -->
          <td class="text-center">
            <div class="flex flex-row justify-center items-center">
              <div  title="แก้ไขข้อมูล" >
                <button v-if="per_edit" @click="edit(item.id)" class="bg-blue-600 mr-3 px-2 py-1.5 rounded-md">
                  <i class="fa-solid fa-pen text-white text-base"></i>
                </button>
              </div>
              <div title="ลบข้อมูลลูกค้า">
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


  <nav :class="lightBorderStyle" aria-label="Page navigation example" class="flex flex-col lg:flexrow justify-center items-center py-2 mx-3 lg:mx-6 border-t border-b ">
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
      <li v-for="item in pages" :key="item" :class="{ active: currPage == item}"
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

</template>
<style scoped>

li.active,li.active:hover {
  background-color: rgb(48, 48, 48);
  color: white;
}
</style>


