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
import vagetable from "@/assets/images/cabbage.png";

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
  categorise: {},
});

const token = localStorage.getItem("tkfw");

const isModalActive = ref(false);

const isModalDangerActive = ref(false);

const items = ref(1);

const perPage = ref(10);

const currentPage = ref(0);

const per_edit = ref(false);
const per_del = ref(false);


onBeforeMount(() => {
  if(ck_pms("update","breed-categorise")){
    per_edit.value = true
  }
  if(ck_pms("delete","breed-categorise")){
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
      ApiMain.delete("/breed-categorise/" + id)
        .then((data) => {
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
  let path = '/fruits-type/edit?type=' + id;
  router.push(path);
};

const fetchData = () => {
  ApiMain.get("/breed-categorise?order=ASC&page=" + (currentPage.value + 1) + "&take=" + perPage.value).then((response) => {
    states.categorise = response.data.data;
    items.value = response.data.meta.itemCount;
  });
};

const numPages = computed(() => {
  return Math.ceil(items.value / perPage.value);
});

const currentPageHuman = computed(() => currentPage.value + 1);

const pagesList = computed(() => {
  const pagesList = [];

  for (let i = 0; i < numPages.value; i++) {
    pagesList.push(i);
  }

  // console.log(pagesList);

  return pagesList;
});

const pageNext = (page) => {
  currentPage.value = page;
  ApiMain.get("/breed-categorise?order=ASC&page=" + (page + 1) + "&take=" + perPage.value)
    .then((data) => {
      states.categorise = data.data.data;
    });
};


//------------- Next step by step ----------------
const nextPage = () => {
  let x = currentPage.value++;
  let pagelist = pagesList.value;
  if (x < pagelist.slice(-1)[0]) {
    ApiMain.get("/breed-categorise?order=ASC&page=" + (x + 1) + "&take=" + perPage.value)
      .then((data) => {
        states.categorise = data.data.data;
      });
  }
  else {
    currentPage.value = pagelist.slice(-1)[0];
  }
};
const previousPage = () => {
  let x = currentPage.value--;
  if (x > 0) {
    ApiMain.get("/breed-categorise?order=ASC&page=" + (x + 1) + "&take=" + perPage.value).then((data) => {
      states.categorise = data.data.data;
    });
  }
  else {
    currentPage.value = 0;
  }
};

const lastPage = () => {
  let pagelist = pagesList.value;
  currentPage.value = pagelist.slice(-1)[0];
  ApiMain.get("/breed-categorise?order=ASC&page=" + (currentPage.value+1)  + "&take=" + perPage.value).then((data) => {
      states.categorise = data.data.data;
    });
};
const firstPage = () => {
  let pagelist = pagesList.value;
  console.log(pagelist[0]);
  currentPage.value = pagelist[0];
  ApiMain.get("/breed-categorise?order=ASC&page=" + (currentPage.value+1)  + "&take=" + perPage.value).then((data) => {
      states.categorise = data.data.data;
    });
};
const pages = computed(() => {
    let numShown = 10; // This sets the number of page tabs
    let pagelist = pagesList.value ;
    numShown = Math.min(numShown, pagelist.length);

    let first = (currentPage.value) - Math.floor(numShown / 2);

    first = Math.max(first, 1);

    first = Math.min(first, pagelist.length - numShown + 1);
    return [...Array(numShown)].map((k,i) => i + first);
});

</script>

<template>
  <div class=" relative">
    <table class="w-full text-sm text-left text-black dark:text-white">
      <thead class="text-base text-black bg-gray-50 dark:bg-gray-700 dark:text-white">
        <tr>
          <th scope="col" class="text-center py-3 w-[100px]">ID</th>
          <th scope="col" class="text-center py-3 w-[200px]">ชื่อ</th>
          <th scope="col" class="text-center py-3 w-[200px]">prefix</th>
          <th scope="col" class="text-center py-3 w-[150px]">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in states.categorise" :key="item.id"
          :class="[tableTrStyle, index % 2 === 0 ? tableTrOddStyle : '']">
          <td class="text-center">{{item.id}}</td>
          <td class="text-center">{{item.name}}</td>
          <td class="text-center">{{item.prefix}}</td>
          <td class="actions-cell">
            <jb-buttons class="justify-center" no-wrap>
              <jb-button v-if="per_edit" color="info" :icon="mdiGreasePencil" small @click="edit(item.id)" />
              <jb-button v-if="per_del" color="danger" :icon="mdiTrashCan" small @click="del(item.id)" />
            </jb-buttons>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <!-- start Paging -->
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
  </nav>
</template>
<style>

li.active,li.active:hover {
  background-color: rgb(48, 48, 48);
  color: white;
}
</style>
