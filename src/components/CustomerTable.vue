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
import vagetable from "../../public/images/cabbage.png";

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
let url = new URL(window.location.href);
const page_current = url.searchParams.get("page");

let searchName = ref('');

let type_filter = reactive([
  {id:1,type:'B2C'},{id:2,type:'B2B'},
  {id:3,type:'Dealer'},{id:4,type:'Seller'},
  {id:5,type:'Dropship'}]);

let product_filter = reactive([
  {id:1,product:'XS-3CH'},{id:2,product:'S-1CH (A)'},{id:3,product:'S-1CH (B)'},{id:4,product:'S-3CH (A)'},{id:5,product:'S-3CH (B)'},{id:6,product:'S-3CH++'},
  {id:7,product:'SET A XS-3CH'},{id:8,product:'SET A S-1CH'},{id:9,product:'SET A S-3CH'},{id:10,product:'SET A S-3CH++'},
  {id:11,product:'SET B XS-3CH'},{id:12,product:'SET B S-1CH'},{id:13,product:'SET B S-3CH'},{id:14,product:'SET B S-3CH++'},
  {id:15,product:'2061 (Weather station)'},{id:16,product:'2053 (MA+AP)'},{id:17,product:'2053 (MA)'},{id:18,product:'2053 (AP)'},{id:19,product:'Smart garden A'},{id:20,product:'Smart garden B'},{id:21,product:'Smart Bag'}
]);

let contactby_filter = reactive([{id:1,data:'Facebook'},{id:2,data:'Line'},{id:3,data:'Walk in'},{id:4,data:'By phone'},{id:5,data:'M2M'},{id:6,data:'M2ตัวแทนจำหน่ายM'}]);
let status_filter = reactive([{id:1,status:'ปิดการขาย'},{id:2,status:'กำลังดำเนินการ'},{id:3,status:'จัดเตรียมสินค้า'},{id:4,status:'ติดตามผล'},{id:5,status:'สอบถามข้อมูล'}]);

onBeforeMount(() => {
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
      ApiMain.delete("/other-customer/" + id).then((res) => {
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
  let path = '/customers/edit?customer_edit=' + id;
  router.push(path);
};
const viewDetail = (id) => {
  let path = '/customers/view-detail?detail=' + id;
  router.push(path);
};
const fetchData = () => {
  ApiMain.get("/other-customer?order=DESC&page=1&take=99999").then((response) => {
    states.customers = response.data.data;

    console.log(states.customers);
  }).catch((error) => {
    console.log(error);
  });;
};

let type_select = ref('all');
let product_select = ref('all');
let contactby_select = ref('all');
let status_select = ref('all');

//--------------------   Filter ------------------------

const filter_type = (event) => {
  states.customers = [] ;
  let type = event.target.value;
  type_select.value = type ;
  if(type == 'all' ){
    ApiMain.get("/other-customer?order=DESC&page=1&take=99999").then((res) => {
      states.customers = res.data.data;
    }).catch((error) => {
        console.log(error);
    });
  }
  else {
    ApiMain.get("/other-customer?order=DESC&page=1&take=99999&type=" + type).then((res) => {
      states.customers = res.data.data;

      console.log('select filter type : '+type ,states.customers);
    }).catch((error) => {
      console.log(error);
    });
  }
};
const filter_product = (event) => {

  let product = event.target.value;
  product_select.value =  product ;
  if(product == 'all'){
    ApiMain.get("/other-customer?order=DESC&page=1&take=99999").then((res) => {
      states.customers = res.data.data;
    });
  }
  else {
    let url_filter = ''
    if(type_select.value != 'all'){
      url_filter = '/other-customer?order=DESC&page=1&take=99999&type='+event.target.value ;
    }
    else {
      url_filter="/other-customer?order=DESC&page=1&take=99999&product=" + product ;
    }
    ApiMain.get(url_filter).then((res) => {
      states.customers = res.data.data;
    }).catch((error) => {
      console.log(error);
    });
    // ApiMain.get("/other-customer?order=DESC&page=1&take=99999&product=" + product).then((res) => {
    //   states.customers = res.data.data;
    // }).catch((error) => {
    //   console.log(error);
    // });
  }
};
const filter_contactby = (event) => {
  // states.customers = [] ;
  let contactby = event.target.value;
  contactby_select.value = contactby ;
  if(contactby == 'all'){
    ApiMain.get("/other-customer?order=DESC&page=1&take=99999").then((res) => {
      states.customers = res.data.data;
    }).catch((error) => {
      console.log(error);
    });
  }
  else {
    ApiMain.get("other-customer?order=DESC&page=1&take=99999&contactBy=" + contactby).then((res) => {
      states.customers = res.data.data;
    }).catch((error) => {
      console.log(error);
    });
  }
};
const filter_status = (event) => {
  // states.customers = [] ;
  let status = event.target.value;
  status_select.value = status ;
  if(status == 'all'){
    ApiMain.get("/other-customer?order=DESC&page=1&take=99999").then((res) => {
      states.customers = res.data.data;
    }).catch((error) => {
      console.log(error);
    });
  }
  else {
    ApiMain.get("other-customer?order=DESC&page=1&take=99999&status=" + status).then((res) => {
      states.customers = res.data.data;
    }).catch((error) => {
      console.log(error);
    });
  }
};


let currPage = ref(1);

const customers_list = computed(()=>{
    currPage.value = 1 ;
    let response = states.customers ;
    return  response.filter(data => {
      const name = data.name.toLowerCase();
      const phone = data.phone.toLowerCase();

      return name.includes(searchName.value) || phone.includes(searchName.value);
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

const dynamicSelect = computed(()=>{

});



</script>

<template>
  <div class="flex flex-row">
    <div class="w-1/4 ml-4 mr-[40px] mt-10" >
        <div class="relative">
          <input v-model="searchName" id="search_input" type="text"
            class="block w-full p-2.5 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="ค้นหา ชื่อลูกค้า, ชื่อผู้ติดต่อ , เบอร์โทรศัพท์มือถือ">
          <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg aria-hidden="true" class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor"
              viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
        </div>
        <small class="opacity-60">ค้นหาด้วย ชื่อลูกค้า, ชื่อผู้ติดต่อ , เบอร์โทรศัพท์มือถือ </small>
    </div>

    <div class="flex flex-row gap-2 ml-5">

    <div class="mt-5">
      <label for="categories" class="block text-sm font-medium text-gray-900 dark:text-white opacity-70">ประเภท</label>
      <select id="categories" @change="filter_type($event)"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[200px] p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
        <option value="all" >ทั้งหมด</option>
        <option v-for="(item,index) of type_filter" :key="index" :value="item.type">{{item.type}}</option>
      </select>
    </div>
    <!-- <div class="mt-5">
      <label for="categories" class="block text-sm font-medium text-gray-900 dark:text-white opacity-70">สินค้า</label>
      <select id="categories" @change="filter_product($event)"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[200px] p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
        <option value="all" >ทั้งหมด</option>
        <option v-for="(item,index) of product_filter" :key="index" :value="item.product">{{item.product}}</option>
      </select>
    </div> -->
    <div class="mt-5">
      <label for="categories" class="block text-sm font-medium text-gray-900 dark:text-white opacity-70">ช่องทาง</label>
      <select id="categories" @change="filter_contactby($event)"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[200px] p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
        <option value="all" >ทั้งหมด</option>
        <option v-for="(item,index) of contactby_filter" :key="index" :value="item.data">{{item.data}}</option>
      </select>
    </div>
    <div class="mt-5">
      <label for="categories" class="block text-sm font-medium text-gray-900 dark:text-white opacity-70">สถานะ</label>
      <select id="categories" @change="filter_status($event)"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[200px] p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
        <option value="all" >ทั้งหมด</option>
        <option v-for="(item,index) of status_filter" :key="index" :value="item.status">{{item.status}}</option>
      </select>
    </div>
  </div>
  </div>
  <div class="m-4">จำนวนทั้งหมด  : {{customers_list.length}}</div>
  <div class="relative mt-4">
    <table class="w-full text-sm text-left text-black dark:text-white">
      <thead class="text-base text-white uppercase bg-gray-600 dark:bg-gray-700 dark:text-white">
        <tr>
          <th scope="col" class="text-center py-3 w-[100px]">ID</th>
          <th scope="col" class="text-center py-3 w-[200px]">ชื่อลูกค้า</th>
          <th scope="col" class="text-center py-3 w-[200px]">เบอร์โทร</th>
          <th scope="col" class="text-center py-3 w-[150px]">จังหวัด</th>
          <th scope="col" class="text-center py-3 w-[150px]">ประเภท</th>
          <th scope="col" class="text-center py-3 w-[150px]">ช่องทาง</th>
          <th scope="col" class="text-center py-3 w-[150px]">สถานะ</th>
          <th scope="col" class="text-center py-3 w-[150px]">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in customers_list.slice(pageStart, pageStart + perPage)" :key="item.id" :class="[tableTrStyle, index % 2 === 0 ? tableTrOddStyle : '']">
          <td class="text-center">{{item.id}}</td>
          <td >
            <div >
              <span v-if="item.name !=''">{{item.name}}</span>
              <span v-else>-</span>
            </div>
          </td>
          <td class="text-center">
            <span v-if="item.phone !=''">{{item.phone}}</span>
              <span v-else>-</span>
          </td>
            <td class="text-center relative">
              <div >
                <span v-if="item.province !=''">{{ item.province }}</span>
                <span v-else>-</span>
              </div>
            </td>
          <td class="text-center ">
          <div v-if="item.type=='B2C'">
            <span class="bg-[#b1a3eb] rounded-2xl text-black font-medium py-1.5 px-4">{{item.type}}</span>
          </div>
          <div v-if="item.type=='B2B'">
            <span class="bg-[#9aedee]  rounded-2xl text-black font-medium py-1.5 px-4">{{item.type}}</span>
          </div>
          <div v-if="item.type=='Dealer'">
            <span class="bg-[#ea96cc] rounded-2xl text-black font-medium py-1.5 px-4">{{item.type}}</span>
          </div>
          <div v-if="item.type=='Seller'">
            <span class="bg-[#a4f392] rounded-2xl text-black font-medium py-1.5 px-4">{{item.type}}</span>
          </div>
          <div v-if="item.type=='Dropship'">
            <span class="bg-[#f7ab40] rounded-2xl text-black font-medium py-1.5 px-4">{{item.type}}</span>
          </div>
          </td>
          <td class="text-center">
            <div class="bg-[#3e64ec] rounded-2xl text-black font-medium py-1.5 px-2" v-if="item.contactBy=='Facebook'">{{item.contactBy}}</div>
            <div class="bg-[#a1f67f] rounded-2xl text-black font-medium py-1.5 px-2" v-else-if="item.contactBy == 'Line'">{{item.contactBy}}</div>
            <div class="bg-[#3dcca6] rounded-2xl text-black font-medium py-1.5 px-2" v-else-if="item.contactBy == 'Walk in'">{{item.contactBy}}</div>
            <div class="bg-[#4ecc3d] rounded-2xl text-black font-medium py-1.5 px-2" v-else-if="item.contactBy == 'By phone'">{{item.contactBy}}</div>
            <div class="bg-[#cc4b3d] rounded-2xl text-black font-medium py-1.5 px-2" v-else-if="item.contactBy == 'M2M'">{{item.contactBy}}</div>
            <div class="bg-[#cc873d] rounded-2xl text-black font-medium py-1.5 px-2" v-else-if="item.contactBy == 'ตัวแทนจำหน่าย'">{{item.contactBy}}</div>
          </td>
          <td class="text-center">
            <div class="bg-[#f17171] rounded-2xl text-xs text-black font-medium py-2 px-2 " v-if="item.status=='ปิดการขาย'">{{item.status}}</div>
            <div class="bg-[#ffc34a] rounded-2xl text-xs text-black font-medium py-2 px-2" v-else-if="item.status == 'กำลังดำเนินการ'">{{item.status}}</div>
            <div class="bg-[#4aa1ff] rounded-2xl text-xs text-black font-medium py-2 px-2" v-else-if="item.status == 'สอบถามข้อมูล'">{{item.status}}</div>
            <div class="bg-[#4affa4] rounded-2xl text-xs text-black font-medium py-2 px-2" v-else-if="item.status == 'จัดเตรียมสินค้า'">{{item.status}}</div>
            <div class="bg-[#ff4ab4] rounded-2xl text-xs text-black font-medium py-2 px-2" v-else-if="item.status == 'ติดตามผล'">{{item.status}}</div>
          </td>

          <!-- <td class="text-center">
            <div class="truncate w-[120px]">
              <span v-if="item.note !=''">{{item.note}}</span>
              <span v-else>-</span>
            </div>
          </td> -->

          <td class="text-center">
            <div class="flex flex-row justify-center items-center">
              <div title="ดูรายละเอียด">
                <button  @click="viewDetail(item.id)" class="bg-gray-300 text-black hover:bg-gray-600 hover:text-white mr-3 px-2 py-1.5 rounded-md">
                  <i class="fa-solid fa-eye text-base"></i>
                </button>
              </div>
              <div  title="แก้ไขข้อมูล" >
                <button @click="edit(item.id)" class="bg-blue-600 mr-3 px-2 py-1.5 rounded-md">
                  <i class="fa-solid fa-pen text-white text-base"></i>
                </button>
              </div>
              <div title="ลบข้อมูลลูกค้า">
                  <button @click="del(item.id)" class="bg-red-600 px-2 py-1.5 rounded-md">
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
<style>

li.active,li.active:hover {
  background-color: rgb(48, 48, 48);
  color: white;
}
</style>

