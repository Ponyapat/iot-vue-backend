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
  fruits: {},
});

const token = localStorage.getItem("tkfw");

const isModalActive = ref(false);

const isModalDangerActive = ref(false);

const items = ref(0);

const perPage = ref(10);

const currentPage = ref(0);

onBeforeMount(() => {
  ApiMain.get("/breed?order=ASC&page=1&take=10", {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
    .then((result) => {

      states.fruits = result.data.data;
      console.log(states.fruits);
    })
    .catch((error) => {
      console.log(error);
    });
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
      axios.delete(import.meta.env.VITE_API_ENDPOINT + "/api/breed/" + id, {
          headers: {
            Authorization: "Bearer " + token,
          },
        })
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
  let path = '/fruits/edit?data_id=' + id;
  router.push(path);
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
  //console.log("pageNext " + (page+1));
  ApiMain.get("/fruits?order=ASC&page=" + (page + 1) + "&take=" + perPage.value, {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
    .then((data) => {
      states.fruits = data.data.data;
    });
};
</script>

<template>
  <div class="overflow-x-auto relative">
    <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead class="text-base text-black uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" class="text-center py-3 px-6">ID</th>
          <th scope="col" class="text-center py-3 px-6">ชื่อ</th>
          <th scope="col" class="text-center py-3 px-6">สายพันธุ์</th>
          <!-- <th scope="col" class="text-center py-3 px-6">ชื่อวิทยาศาสตร์</th>
          <th scope="col" class="text-center py-3 px-6">ชื่อสามัญ</th> -->
          <!-- <th scope="col" class="text-center py-3 px-6">รายละเอียด</th> -->
          <th scope="col" class="text-center py-3 px-6">อายุการเก็บเกี่ยว</th>
          <th scope="col" class="text-center py-3 px-6">อุณหภูมิในอากาศ</th>
          <th scope="col" class="text-center py-3 px-6">อุณหภูมิในดิน</th>
          <th scope="col" class="text-center py-3 px-6">ความชื้นในดิน</th>
          <th scope="col" class="text-center py-3 px-6">pH ในดิน</th>
          <!-- <th scope="col" class="text-center py-3 px-6">EC ในดิน</th> -->
          <!-- <th scope="col" class="text-center py-3 px-6">N</th> -->
          <!-- <th scope="col" class="text-center py-3 px-6">P</th> -->
          <!-- <th scope="col" class="text-center py-3 px-6">K</th> -->
          <!-- <th scope="col" class="text-center py-3 px-6">ปริมาณน้ำ</th> -->
          <!-- <th scope="col" class="text-center py-3 px-6">ความเข้มแสง</th> -->
          <th scope="col" class="text-center py-3 px-6">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in states.fruits" :key="item.id" :class="[tableTrStyle, index % 2 === 0 ? tableTrOddStyle : '']">
          <td class="text-center">{{item.code}}</td>
          <td class="text-center">{{item.name}}</td>
          <td class="text-center">{{item.species}}</td>
          <td class="text-center">{{item.harvestPeriod}}</td>
          <td class="text-center">{{item.airTemperatureMin}} - {{item.airTemperatureMax}}</td>
          <td class="text-center">{{item.soilTemperatureMin}} - {{item.soilTemperatureMax}}</td>
          <td class="text-center">{{item.soilMoistureMin}} - {{item.soilMoistureMax}}</td>
          <td class="text-center">{{item.soilPhMin}} - {{item.soilPhMax}}</td>
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

  <div :class="lightBorderStyle" class="p-3 lg:px-6 border-t dark:border-gray-800">
    <level>
      <jb-buttons>
        <jb-button v-for="page in pagesList" :key="page" :active="page === currentPage" :label="page + 1"
          :outline="darkMode" small @click="pageNext(page)" />
      </jb-buttons>
      <small>Page {{ currentPageHuman }} of {{ numPages }}</small>
    </level>
  </div>
</template>
