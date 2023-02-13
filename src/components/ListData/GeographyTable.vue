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

const states = reactive({
  geo: {},
});

const isModalActive = ref(false);

const isModalDangerActive = ref(false);

const items = ref(0);

const perPage = ref(10);

const currentPage = ref(0);
const per_edit = ref(false);

onBeforeMount(() => {
    if(ck_pms("update","geography")){
      per_edit.value = true
    }

    ApiMain.get("/geo?order=DESC&page=1&take="+perPage.value)
    .then((data) => {
      console.log(data.data.meta.itemCount);
      states.geo = data.data.data;
      items.value = data.data.meta.itemCount;
    })
    .catch((error) => {
      console.log(error);
    });
});

const del = (id) => {
  Swal.fire({
    title: "ยืนยันการลบ",
    text: "คุณต้องการลบ ภูมิศาสตร์(ที่ดิน)นี้ใช้หรือไม่",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Ok",
  }).then((result) => {
    if (result.isConfirmed) {
        ApiMain.delete("/geo"+id)
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
  router.push("/geography/edit/" + id);
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

  return pagesList;
});

const pageNext = (page) => {
  currentPage.value = page;
    ApiMain.get("/geo?order=DESC&page="+(page+1)+"&take="+perPage.value)
    .then((data) => {
      states.geo = data.data.data;
    });
};

const nextPage = () => {
  let x = currentPage.value++;
  let pagelist = pagesList.value;
  if (x < pagelist.slice(-1)[0]) {
    ApiMain.get("/geo?order=DESC&page=" + (x + 1) + "&take=" + perPage.value)
      .then((data) => {
        states.geo = data.data.data;
      });
  }
  else {
    currentPage.value = pagelist.slice(-1)[0];
  }
};
const previousPage = () => {
  let x = currentPage.value--;
  if (x > 0) {
    ApiMain.get("/geo?order=DESC&page=" + (x + 1) + "&take=" + perPage.value).then((data) => {
      states.geo = data.data.data;
    });
  }
  else {
    currentPage.value = 0;
  }
};

const lastPage = () => {
  let pagelist = pagesList.value;
  currentPage.value = pagelist.slice(-1)[0];
  ApiMain.get("/geo?order=DESC&page=" + (currentPage.value+1)  + "&take=" + perPage.value).then((data) => {
      states.geo = data.data.data;
    });
};
const firstPage = () => {
  let pagelist = pagesList.value;
  console.log(pagelist[0]);
  currentPage.value = pagelist[0];

  ApiMain.get("/geo?order=DESC&page=" + (currentPage.value+1)  + "&take=" + perPage.value).then((data) => {
      states.geo = data.data.data;
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
const spaceNatureDetail = (data) => {
  if (!data) {
    return 'ไม่มีข้อมูล'
  } else {
    if (data === 'low') {
      return 'ต่ำ'
    } else if ( data === 'medium') {
      return 'ปานกลาง'
    } else if (data === 'high') {
      return 'สูง'
    } else {
      return 'ไม่มีข้อมูล'
    }
  }
}
const drainage = (data) => {
  if (!data) {
    return 'ไม่มีข้อมูล'
  } else {
    if (data === 'low') {
      return 'ต่ำ'
    } else if ( data === 'medium') {
      return 'ปานกลาง'
    } else if (data === 'high') {
      return 'สูง'
    } else {
      return 'ไม่มีข้อมูล'
    }
  }
};
</script>

<template>
  <table>
    <thead>
      <tr class="text-sm bg-gray-700 text-white">
        <th v-if="checkable" />
        <th>FarmID</th>
        <th>ละติจูด</th>
        <th>ลองติจูด</th>
        <th>สถานะ</th>
        <th>ความอุดมสมบูรณ์</th>
        <th>การระบายน้ำ</th>
        <th>ความลาดชัน</th>
        <th width="200">ข้อจํากัดของดิน</th>
        <th />
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(item, index) in states.geo"
        :key="item.id"
        :class="[tableTrStyle, index % 2 === 0 ? tableTrOddStyle : '', 'text-sm ']"
      >
        <td class="align-top font-bold">
          {{ item.projectId }}
        </td>
        <td  class="align-top">
          {{ item.lat }}
        </td>
        <td  class="align-top">
          {{ item.lon }}
        </td>
        <td  class="align-top">
          <span v-if="item.status=='waiting'" class="bg-orange-300 px-2 py-1 border-0 rounded-2xl">รอกรอกข้อมูล</span>
          <span v-else-if="item.status=='active'" class="bg-green-200 px-2 py-1 border-0 rounded-2xl">กรอกข้อมูลแล้ว</span>
          <span v-else-if="item.status=='inactive'" class="bg-green-200 px-2 py-1 border-0 rounded-2xl">ไม่แสดงข้อมูล</span>
        </td>
        <td >
          {{ item.soilFertility }}
        </td>
        <td >
          {{ item.drainage }}
        </td>
        <td >
          {{ item.slope }}
        </td>
        <td >
          {{ item.soilRestrictions }}
        </td>
        <td class="actions-cell align-top">
            <jb-button
              v-if="per_edit"
              color="info"
              :icon="mdiGreasePencil"
              small
              @click="edit(item.id)"
            />
        </td>
      </tr>
    </tbody>
  </table>
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
<style >
li.active,li.active:hover {
  background-color: rgb(48, 48, 48);
  color: white;
}
</style>
