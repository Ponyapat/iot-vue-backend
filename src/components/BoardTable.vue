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

      } ;

const states = reactive({
  board: [],
  select_status:'all',
  user_data:[
    {
      first_name:'',
      last_name:'',
      email:'',
      phone:''
    }
  ]
});

let showModal = ref(false);
const items = ref(0);

const perPage = ref(10);

const currentPage = ref(0);

const per_edit = ref(false);
const per_del = ref(false);



onMounted(() => {
  fetchData();
})

const fetchData = async () => {

  ApiCore.get("/v2/boards-customer/?limit=9999&page=1").then((response) => {

    states.board = response.data.data;
    console.log(states.board);

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
const board_list = computed(() => {
  currPage.value = 1;
  let response = states.board;

  return response.filter(item => {
    const serial = item.serial.toUpperCase();

    if(searchName.value == '' && states.select_status == 'all'){
      return item
    }
    else if(searchName.value != '' && states.select_status == 'all'){
      return serial.includes((searchName.value).toUpperCase())
    }
   else{
    if(item.getStatusBoard){
        return  serial.includes((searchName.value).toUpperCase()) && (item.getStatusBoard && item.getStatusBoard.noti_status_text == states.select_status)
      }
      else{
        return serial.includes((searchName.value).toUpperCase()) && ('ออฟไลน์' == states.select_status )
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

const pageStart = computed(() => {
  return (currPage.value - 1) * perPage.value;
});
const totalPage = computed(() => {
  let x = board_list.value;
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

const showPopup =(data)=>{
  states.user_data.user_id = data.project.user_id ;
  ApiSso.get(`/api/mgr/users/${data.project.user_id}`,config).then((result) => {

    states.user_data.first_name = result.data.data.first_name;
    states.user_data.last_name = result.data.data.last_name;
    states.user_data.email = result.data.data.email;
    states.user_data.phone = result.data.data.username;
  })

  showModal.value = true ;
};
const closeModal = () => {
  showModal.value = false;
};


const filter_status = (event)=>{

  states.select_status  = event.target.value ;
  // const test =  states.board.filter(item => {
  //  if(states.select_status == 'all'){
  //   return item
  //  }
  //  else{
  //   if(item.getStatusBoard){
  //     return item.getStatusBoard && item.getStatusBoard.noti_status_text == states.select_status
  //   }
  //   else{
  //     return 'ออฟไลน์' == states.select_status
  //   }
  //  }
  // });

  // console.log(test);
  // states.board = test ;
};

const groupline = (serial_number) =>{
  console.log(serial_number);
  router.push('/board-list/groupline?serial_number='+serial_number);
};


</script>

<template>
  <div v-if="showModal == true" class="fixed inset-0 z-40 bg-opacity-50 transition-opacity" style="background: rgba(0, 0, 0, 0.2);"></div>
  <div class="relative">
    <div class="flex flex-row">
    <div class="w-1/4 ml-4 mr-[40px] mt-10" >
        <div class="relative">
          <input v-model="searchName" id="search_input" type="text"
            class="block w-full p-2.5 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="ค้นหา serials number">
          <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg aria-hidden="true" class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor"
              viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
        </div>
        <small class="opacity-60">ค้นหาด้วย serials number</small>
    </div>

    <div class="flex flex-row gap-2 ml-5">

    <div class="mt-5">
      <label for="categories" class="block text-sm font-medium text-gray-900 dark:text-white opacity-70">สถานะบอร์ด</label>
      <select id="categories" v-model="states.select_status" @change="filter_status($event)"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[200px] p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
        <option value="all" >ทั้งหมด</option>
        <option value="ออนไลน์">ออนไลน์</option>
        <option value="ออฟไลน์">ออฟไลน์</option>
      </select>
    </div>
  </div>
  </div>
    <div class="ml-4 mb-4">
      <span class="text-base font-medium">จำนวนทั้งหมด : {{board_list.length }}</span>
    </div>
    <table>
      <thead class="bg-gray-600">
        <tr class="text-sm text-white ">
          <th class="text-center">User ID</th>
          <th class="text-center">Serial Number</th>
          <th class="text-center">สถานะของบอร์ด</th>
          <th class="text-center">วันที่หมดประกันสินค้า</th>
          <th class="text-center">สถานะการรับประกันสินค้า</th>
          <th class="text-center">เวลาที่ออนไลน์ล่าสุด</th>
          <th class="text-center">ข้อมูลเพิ่มเติม</th>
          <th class="text-center">Group Line</th>
        </tr>
      </thead>
      <tbody>

        <tr v-for="(item, index) in board_list.slice(pageStart, pageStart + perPage)" :key="item.id"
          :class="[tableTrStyle, index % 2 === 0 ? tableTrOddStyle : '', 'text-sm ']">
          <td class="text-center">
            {{ item.project.user_id }}
          </td>
          <td class="text-center font-bold">
            {{ item.serial }}
          </td>
          <td class="text-center">
            <span v-if="item.getStatusBoard == null"
              class="bg-red-100 text-black font-bold px-4 py-2 rounded-full "><i class="fa-solid fa-power-off text-red-500 mr-0.5"></i> ออฟไลน์</span>
            <span v-else  :class="item.getStatusBoard.noti_status_text == 'ออนไลน์'?'bg-green-100':'bg-red-100'" class=" text-black font-bold px-4 py-2 rounded-full ">
              <span v-if="item.getStatusBoard.noti_status_text == 'ออนไลน์'" ><i class="fa-solid fa-circle-dot text-green-500 mr-0.5"></i> {{  item.getStatusBoard.noti_status_text }}</span>
              <span v-else><i class="fa-solid fa-power-off text-red-500 mr-0.5"></i> ออฟไลน์</span>
            </span>
          </td>
          <td class="text-center">
            <span v-if="item.warranty == null" class="">-</span>
            <span v-else-if="item.warranty.expire_date == null || item.warranty.expire_date == ''" class="text-gray-500">-</span>
            <span v-else>{{ moment(item.warranty.expire_date).format('DD/MM/YYYY') }}</span>
          </td>
          <td class="text-center">
            <span v-if="item.warranty == null" class="text-orange-500"><i class="fa-solid fa-circle-exclamation mr-0.5"></i>ไม่ได้ลงทะเบียน</span>
            <span v-else class="text-green-500"><i class="fa-solid fa-circle-dot text-green-500 mr-0.5"></i>อยู่ระหว่างการรับประกัน</span>
          </td>
          <td class="text-center">
            <span v-if="item.getOnlineLasted == null" class=" text-black font-bold px-4 py-2 rounded-full ">-</span>
            <span v-else class="text-sm font-medium">
              <span class="mr-2">{{ moment(item.getOnlineLasted.updated_at).format("DD/MM/YYYY")}}</span><span>{{ moment.utc(item.getOnlineLasted.updated_at).format("HH:mm") }} น.</span>
            </span>
          </td>
          <td class="text-center">
            <div class="flex flex-row justify-center items-center">
              <button type="button" @click="showPopup(item)"
                class="bg-gray-300 text-black hover:bg-gray-600 hover:text-white mr-3 px-2 py-1.5 rounded-md">
                <i class="fa-solid fa-eye text-base"></i>
              </button>
            </div>
          </td>
          <td class="text-center">
            <div class="flex flex-row justify-center items-center">
              <router-link :to="`/board-list/group-line?serial_number=${item.serial}`"
                class="bg-orange-300 text-black hover:bg-gray-600 hover:text-white mr-3 px-2 py-1 rounded-md">
                <i class="fa-solid fa-plus text-base"></i>
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
    <div >
      <div id="staticModal" :class="showModal == true ? '' : 'hidden'"
      class="absolute top-28 left-1/4 right-1/4 z-50  w-full p-4 overflow-x-hidden overflow-y-auto h-[calc(100%-1rem)] md:h-full">
      <div class="relative w-full h-full max-w-2xl md:h-auto">
        <!-- Modal content -->
        <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
          <!-- Modal header -->
          <div class="flex items-start justify-between px-4 py-2.5 border-b rounded-t dark:border-gray-600">
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
              ข้อมูลลูกค้า
            </h3>
            <button type="button" @click="closeModal()"
              class="text-white bg-red-500  hover:bg-red-700 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
              data-modal-hide="staticModal">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"></path>
              </svg>
            </button>
          </div>
          <!-- Modal body -->
          <div class="p-6 pb-10 space-y-6">
            <div class="flex justify-center ">
              <img src="../assets/images/mr.png" alt="user" class="w-18 h-18 shadow bg-gray-100 p-2 rounded-full">
            </div>
            <div class="flex flex-col items-center">
              <div class="w-[250px] flex flex-col">
                <span class="font-medium mb-2">User ID : <span class="font-normal text-basse">{{ states.user_data.user_id }}</span></span>
                <span class="text-base font-medium mb-2" >ชื่อ :
                  <span v-if="states.user_data.first_name ">{{states.user_data.first_name}}  {{states.user_data.last_name}}</span>
                  <span v-else class="font-normal text-gray-500">ไม่ได้ระบุ</span>
                  </span>
                <span class="text-base font-medium whitespace-nowrap mb-2" >Email :
                  <span v-if="states.user_data.email != null || states.user_data.email == ''" class="font-normal">{{states.user_data.email}}</span>
                  <span v-else class="font-normal text-gray-500">ไม่ได้ระบุ</span>
                </span>
                <span class="text-base font-medium" >เบอร์โทร :
                  <span v-if="states.user_data.phone != null || states.user_data.phone == ''" class="font-normal">{{states.user_data.phone}}</span>
                  <span v-else class="font-normal text-gray-500">ไม่ได้ระบุ</span>
                </span>
              </div>
              <!-- <span >ชื่อ : {{states.user_data.name}}</span> -->
            </div>

          </div>

        </div>
      </div>
    </div>
    </div>
    <!-- Modal -->
  </div>
</template>
<style scoped>
li.active,
li.active:hover {
  background-color: rgb(48, 48, 48);
  color: white;
}
</style>
