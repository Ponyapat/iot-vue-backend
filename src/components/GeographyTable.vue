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
  geo: {},
});

const token = localStorage.getItem("tkfw");

const isModalActive = ref(false);

const isModalDangerActive = ref(false);

const items = ref(0);

const perPage = ref(10);

const currentPage = ref(0);

onBeforeMount(() => {
  axios
    .get(import.meta.env.VITE_API_ENDPOINT + "/api/geo", {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
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
      axios
        .delete(import.meta.env.VITE_API_ENDPOINT + "/api/geo/" + id, {
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
  //console.log("pageNext " + (page+1));
  axios
    .get(import.meta.env.VITE_API_ENDPOINT + "/api/geo?order=ASC&page="+(page+1)+"&take="+perPage.value, {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
    .then((data) => {
      states.geo = data.data.data;
    });
};
</script>

<template>
  <table>
    <thead>
      <tr class="text-base">
        <th v-if="checkable" />
        <th>#</th>
        <th>Project Id</th>
        <th>Lat, Lon</th>
        <th>รายละเอียด</th>
        <th>ดินชั้นบน</th>
        <th>ดินชั้นล่าง</th>
        <th>ความลาดชันของดิน</th>
        <th>ข้อจำกัดของดิน</th>
        <th></th>
        <th />
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(item, index) in states.geo"
        :key="item.id"
        :class="[tableTrStyle, index % 2 === 0 ? tableTrOddStyle : '', 'text-xs']"
      >
        <td>
          {{ key }}
        </td>
        <td data-label="">
          {{ item.projectId }}
        </td>
        <td data-label="">
          {{ item.lat }}, {{ item.lon}}
        </td>
        <td data-label="">
          <!-- รายละเอียด -->
          <p v-html="item.soilProperties"></p>
        </td>
        <td data-label="">
          <!-- รายละเอียด ดินชั้นบน -->
          <p>{{ item.topsoilDetail }}</p>
          <p>pH ในดิน {{ item.topsoilValueMin }} - {{ item.topsoilValueMax}}</p>
        </td>
        <td data-label="">
          <!-- รายละเอียด ดินชั้นล่าง -->
          <p>{{ item.subsoilDetail }}</p>
          <p>pH ในดิน {{ item.subsoilValueMin }} - {{ item.subsoilValueMax}}</p>
        </td>
        <td data-label="">
          {{ item.slope }}
        </td>
        <td data-label="">
          {{ item.soilRestrictions }}
        </td>
        <td data-label="">
          
        </td>
        <td class="actions-cell">
          <jb-buttons type="justify-start lg:justify-end" no-wrap>
            <jb-button
              color="info"
              :icon="mdiGreasePencil"
              small
              @click="edit(item.id)"
            />
            <jb-button
              color="danger"
              :icon="mdiTrashCan"
              small
              @click="del(item.id)"
            />
          </jb-buttons>
        </td>
      </tr>
    </tbody>
  </table>
  <div
    :class="lightBorderStyle"
    class="p-3 lg:px-6 border-t dark:border-gray-800"
  >
    <level>
      <jb-buttons>
        <jb-button
          v-for="page in pagesList"
          :key="page"
          :active="page === currentPage"
          :label="page + 1"
          :outline="darkMode"
          small
          @click="pageNext(page)"
        />
      </jb-buttons>
      <small>Page {{ currentPageHuman }} of {{ numPages }}</small>
    </level>
  </div>
</template>
