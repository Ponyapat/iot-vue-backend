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
  fruits: {},
});

const token = localStorage.getItem("tkfw");

const isModalActive = ref(false);

const isModalDangerActive = ref(false);

const items = ref(1);

const perPage = ref(10);

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
      ApiMain.delete("/breed/" + id, {
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
const read_image = (img_name) => {
  const link = ApiMain.get('/image/' + img_name + '?imageableType=breed').then((data)=>data.request.responseURL)
  console.log('link == ',link);

  return link;


}
const fetchData = () => {
  ApiMain.get("/breed")
    .then((response) => {
      states.fruits = response.data.data;
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
  ApiMain.get("/breed?order=ASC&page=" + (page + 1) + "&take=" + perPage.value, {
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
          <th scope="col" class="text-center py-3 w-[100px]">อายุการเก็บเกี่ยว</th>
          <th scope="col" class="text-center py-3 w-[150px]">อุณหภูมิในอากาศ</th>
          <th scope="col" class="text-center py-3 w-[150px]">อุณหภูมิในดิน</th>
          <th scope="col" class="text-center py-3 w-[150px]">ความชื้นในดิน</th>
          <th scope="col" class="text-center py-3 w-[150px]">pH ในดิน</th>
          <!-- <th scope="col" class="text-center py-3 px-6">EC ในดิน</th> -->
          <!-- <th scope="col" class="text-center py-3 px-6">N</th> -->
          <!-- <th scope="col" class="text-center py-3 px-6">P</th> -->
          <!-- <th scope="col" class="text-center py-3 px-6">K</th> -->
          <!-- <th scope="col" class="text-center py-3 px-6">ปริมาณน้ำ</th> -->
          <!-- <th scope="col" class="text-center py-3 px-6">ความเข้มแสง</th> -->
          <th scope="col" class="text-center py-3 w-[150px]">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in states.fruits" :key="item.id" :class="[tableTrStyle, index % 2 === 0 ? tableTrOddStyle : '']">
          <td class="text-center">{{item.code}}</td>
          <td class="text-center">
            <div class="flex flex-row items-center">
              <div class="bg-white p-1 rounded-lg mr-2 shadow">
                <img v-if="item.image!=''" :src="`/api-main/image/${item.image}?imageableType=breed`" class="w-[30px] h-[30px]" alt="">
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
            </div>
          </td>
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
    <Level>
      <jb-buttons>
        <jb-button v-for="item in pagesList" :key="item" :active="item === currentPage" :label="item + 1"
          :outline="darkMode" small @click="pageNext(item)" />
      </jb-buttons>
      <small>Page {{ currentPageHuman }} of {{ numPages }}</small>
    </Level>
  </div>
</template>
