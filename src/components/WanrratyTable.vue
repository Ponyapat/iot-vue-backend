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


const states = reactive({
  warrranty: [],
  my_email: '',
  select_status: 'all'
});

const warrranty_list = ref([]);

const items = ref(0);

const perPage = ref(10);

const currentPage = ref(0);

const per_edit = ref(false);
const per_del = ref(false);

onMounted(() => {
  fetchData();

  ApiMain.get("/users/myprofile").then((response) => {

    states.email = response.data.email;

  })
})

const fetchData = async () => {

  ApiCore.get("/v2/warranty").then((response) => {

    states.warranty = response.data.data;
    warrranty_list.value = response.data.data;

    console.log(states.warranty);
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

const warranty = computed(() => {
  currPage.value = 1;
  let response = warrranty_list.value;
  // return  response.filter(data => {
  //   const serial = data.serial.toLowerCase();
  //   const firstname = data.firstname.toLowerCase();
  //   const mobile = data.mobile.toLowerCase();
  //   const email = data.email.toLowerCase();

  //   return serial.includes((searchName.value).toLowerCase()) || firstname.includes((searchName.value).toLowerCase())|| mobile.includes((searchName.value).toLowerCase())|| email.includes((searchName.value).toLowerCase())
  // });
  response = response.filter(item => {
    const serial = item.serial.toLowerCase();
    const firstname = item.firstname.toLowerCase();
    const mobile = item.mobile.toLowerCase();
    const email = item.email.toLowerCase();
    const isExpired = new Date(item.expire_date) < new Date(); // Check if the item has expired

    if (states.select_status === 'false') {
      return (isExpired && (serial.includes(searchName.value.toLowerCase()) ||
        firstname.includes(searchName.value.toLowerCase()) ||
        mobile.includes(searchName.value.toLowerCase())));
    } else if (states.select_status === 'true') {
      return (!isExpired && (serial.includes(searchName.value.toLowerCase()) ||
        firstname.includes(searchName.value.toLowerCase()) ||
        mobile.includes(searchName.value.toLowerCase())));
    } else {
      return (serial.includes(searchName.value.toLowerCase()) ||
        firstname.includes(searchName.value.toLowerCase()) ||
        mobile.includes(searchName.value.toLowerCase()));
    }
  });

  return response ;

});

const pageStart = computed(() => {
  return (currPage.value - 1) * perPage.value;
});
const totalPage = computed(() => {
  let x = warranty.value;
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



const exportExcel = () => {

  console.log(states.email, 'keyword : ' + searchName.value);
  ApiCore.post(`/v2/export-warranty?keyword=${searchName.value}`, {
    email: states.email,
    keyword: searchName.value,

  }).then((response) => {
    console.log('status send file CSV = ' + response.status);
    if (response.status == 200) {
      Swal.fire({
        title: "ส่งไฟล์ CSV เรียบร้อย",
        text: `ส่งไฟล์ เข้า email : ${states.email}`,
        icon: "success",
        confirmButtonColor: "#31C48D",
        confirmButtonText: "ตกลง",
      })
    }
  }).catch((error) => {
    console.log(error);
  });
};


const expiredateStatus = (expire_date) => {
  let expiredate = new Date(expire_date);
  let now = new Date();
  let timeDiff = expiredate.getTime() - now.getTime();

  let days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  let hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  let minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
  let seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

  if (days >= 0) {
    if (hours > 0 && minutes > 0) {
      return 'ยังไม่หมดอายุ'
    }
  } else {
    return 'หมดอายุ'
  }

};

const filter_status = (event) => {
  states.select_status = event.target.value;
};
</script>

<template>
  <div class="w-1/2 m-4 ">
    <form>
      <!-- <div class="flex flex-row">
        <div>
          <div class="relative">
         
          <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg aria-hidden="true" class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor"
              viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
        </div>
        <small class="opacity-60">ค้นหาด้วย serial ,ชื่อ, เบอร์โทรศัพท์มือถือ หรือ email</small>
    
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
      </div> -->
      <div class="flex flex-row">
        <div class=" mr-[40px] mt-10">
          <div class="relative">
            <input v-model="searchName" id="search_input" type="text"
              class="block w-[90px] md:w-full p-2.5 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="ค้นหา serial,ชื่อ, เบอร์โทรศัพท์มือถือ หรือ email">

            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg aria-hidden="true" class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor"
                viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
          </div>
          <small class="opacity-60 hidden lg:flex">ค้นหาด้วย serial ,ชื่อ, เบอร์โทรศัพท์มือถือ หรือ email</small>
        </div>
        <div>
          <div class="mt-5">
            <label for="categories"
              class="block text-sm font-medium text-gray-900 dark:text-white opacity-70">สถานะประกัน</label>
            <select id="categories" v-model="states.select_status" @change="filter_status($event)"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-22 md:w-[200px] p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
              <option value="all">ทั้งหมด</option>
              <option value="true">ยังไม่หมดอายุ</option>
              <option value="false">หมดอายุ</option>
            </select>
          </div>
        </div>
      </div>



    </form>
  </div>
  <div class="ml-4 mb-4 flex flex-row justify-between">
    <div>
      <span class="text-xs md:text-base font-medium">จำนวนทั้งหมด : {{ warranty.length }}</span>
    </div>
    <div class="mb-4 mr-4">
      <button type="button" @click="exportExcel"
        class="bg-orange-300 text-sm md:text-base font-medium px-4 py-1 rounded-lg text-black"><i class="fa-solid fa-file"></i>
        Export Excel</button>
    </div>
  </div>

  <div class="overflow-x-auto	max-w-full pb-4">
    <table class="w-full">
    <thead class="bg-gray-600">
      <tr class="text-sm text-white whitespace-nowrap ">
        <th class="text-center py-1">Serial Number</th>
        <th class="text-center">ชื่อ-นามสกุล</th>
        <th class="text-center">เบอร์โทรศัพท์มือถือ</th>
        <th class="text-center">Email</th>
        <th class="text-center">วันที่หมดประกันสินค้า</th>
        <th class="text-center">สถานะประกัน</th>
        <th class="text-center">Action</th>
      </tr>
    </thead>
    <tbody>
      <!-- <tr
        v-for="(item, index) in states.warranty"
        :key="item.id"
        :class="[tableTrStyle, index % 2 === 0 ? tableTrOddStyle : '', 'text-sm ']"
      > -->
      <tr v-for="(item, index) in warranty.slice(pageStart, pageStart + perPage)" :key="item.id"
        :class="[tableTrStyle, index % 2 === 0 ? tableTrOddStyle : '', 'text-sm ']">
        <td class="text-center font-bold text-xs md:text-base px-4 lg:px-0">
          {{ item.serial }}
        </td>
        <td class="text-center text-xs md:text-base whitespace-nowrap px-3 lg:px-0">
          {{ item.firstname }} {{ item.lastname }}
        </td>
        <td class="text-center text-xs md:text-base">
          {{ item.mobile }}
        </td>
        <td class="text-center text-xs md:text-base px-4 lg:px-0">
          {{ item.email }}
        </td>
        <td class="text-center text-xs md:text-base ">
          <span v-if="item.expire_date">{{ moment.utc(item.expire_date).format('DD/MM/YYYY') }}</span>
          <span v-else>-</span>
        </td>
        <td class="text-center text-xs md:text-base px-4 lg:px-0">
          <span v-if="item.expire_date" class="text-black font-medium whitespace-nowrap"
            :class="expiredateStatus(item.expire_date, 'show') == 'ยังไม่หมดอายุ' ? 'bg-green-300 py-1 px-2 rounded-lg' : 'bg-red-300 py-1 px-2 rounded-lg'">{{
              expiredateStatus(item.expire_date) }}</span>
          <span v-else>-</span>
        </td>
        <td class="text-center">

          <div class="flex flex-row justify-center items-center">
            <router-link :to="`/warranty-list/warranty?warranty_detail=${item.id}`"
              class="bg-gray-300 text-black hover:bg-gray-600 hover:text-white mr-3 px-2 py-1.5 rounded-md">
              <i class="fa-solid fa-eye text-base"></i>
            </router-link>
            <div>
              <button @click="edit(item.id)" class="bg-blue-600 mr-3 px-2 py-1.5 rounded-md">
                <i class="fa-solid fa-pen text-white text-base"></i>
              </button>
            </div>
            <!-- <div>
                  <button @click="del(item.id)" class="bg-red-600 px-2 py-1.5 rounded-md">
                    <i class="fa-solid fa-trash text-white text-base"></i>
                  </button>
              </div> -->
          </div>
        </td>
      </tr>
    </tbody>
  </table>
  </div>
  <nav aria-label="Page navigation example" class="flex flex-col md:flex-row justify-center items-center py-2 mx-3 lg:mx-6 border-t border-b ">
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
</template>
<style scoped>
li.active,
li.active:hover {
  background-color: rgb(48, 48, 48);
  color: white;
}
</style>
