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

const perPage = ref(2);

const currentPage = ref(0);

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
  ApiMain.get("/breed-categorise?order=ASC&page=" + (currentPage.value  + 1) + "&take=" + perPage.value).then((response) => {
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

  console.log(pagesList);

  return pagesList;
});

const pageNext = (page) => {
  currentPage.value = page;
  //console.log("pageNext " + (page+1));
  ApiMain.get("/breed-categorise?order=ASC&page=" + (page + 1) + "&take=" + perPage.value)
    .then((data) => {
      states.categorise = data.data.data;

    });
};


//------------- Next step by step ----------------
const nextPage = () =>{
  console.log('value current_page  Next Page : '+currentPage.value);
  if(currentPage.value <= items.value){
    let x = currentPage.value++ ;
    // ApiMain.get("/breed-categorise?order=ASC&page=" + (x + 1) + "&take=" + perPage.value)
    //   .then((data) => {
    //     states.categorise = data.data.data;
    // });
  }
  else {
    currentPage.value = items.value ;
    console.log('else work');
  }
};
const previousPage = () =>{
  let x = currentPage.value-- ;
  if(x >= 0){
  //   ApiMain.get("/breed-categorise?order=ASC&page=" + (x + 1) + "&take=" + perPage.value)
  //   .then((data) => {
  //     states.categorise = data.data.data;
  // });

  }
  else {
    currentPage.value = 0 ;
  }


};

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
        <tr v-for="(item, index) in states.categorise" :key="item.id" :class="[tableTrStyle, index % 2 === 0 ? tableTrOddStyle : '']">
          <td class="text-center">{{item.id}}</td>
          <td class="text-center">{{item.name}}</td>
          <td class="text-center">{{item.prefix}}</td>
          <td class="actions-cell">
            <jb-buttons  class="justify-center" no-wrap>
              <jb-button color="info" :icon="mdiGreasePencil" small @click="edit(item.id)" />
              <jb-button color="danger" :icon="mdiTrashCan" small @click="del(item.id)" />
            </jb-buttons>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

<nav aria-label="Page navigation example" class="py-2 mx-3 lg:mx-6 border-t border-b">
  <ul class="inline-flex items-center -space-x-px">
    <li  @click="previousPage">
      <a href="#" class="block px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
        <span class="sr-only">Previous</span>
        <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
      </a>
    </li>
    <li v-for="item in pagesList" :key="item" :active="item === currentPage" :label="item + 1" @click="pageNext(item)"  >
      <a href="#" class="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">{{item+1}}</a>
    </li>
    <li @click="nextPage">
      <a href="#" class="block px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
        <span class="sr-only">Next</span>
        <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path></svg>
      </a>
    </li>
  </ul>
</nav>

  <div :class="lightBorderStyle" class="p-3 lg:px-6 border-t dark:border-gray-800">
    <Level>
      <jb-buttons>
        <jb-button v-for="item in pagesList" :key="item" :active="item === currentPage" :label="item + 1"
          :outline="darkMode" small @click="pageNext(item)" />
      </jb-buttons>
      <small>Page {{ currentPageHuman }} of {{ numPages }}</small>
    </Level>
  </div>
</template>
