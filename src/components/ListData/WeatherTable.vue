<script setup>
import { computed, ref, onBeforeMount, reactive  } from "vue";
import { useMainStore } from "@/stores/main";
import { useRouter } from "vue-router";
import { mdiEye, mdiTrashCan , mdiGreasePencil } from "@mdi/js";
import ModalBox from "@/components/ModalBox.vue";
import CheckboxCell from "@/components/CheckboxCell.vue";
import Level from "@/components/Level.vue";
import JbButtons from "@/components/JbButtons.vue";
import JbButton from "@/components/JbButton.vue";
import UserAvatar from "@/components/UserAvatar.vue";
import Swal from "sweetalert2";
import moment from 'moment'

defineProps({
  checkable: Boolean,
});

const router = useRouter();
const mainStore = useMainStore();
const date_format = (date) => { 
      return date
}

const lightBorderStyle = computed(() => mainStore.lightBorderStyle);
const lightBgStyle = computed(() => mainStore.lightBgStyle);
const tableTrStyle = computed(() => mainStore.tableTrStyle);
const tableTrOddStyle = computed(() => mainStore.tableTrOddStyle);
const darkMode = computed(() => mainStore.darkMode);

const states = reactive({
  weather: {},
});

const isModalActive = ref(false);
const isModalDangerActive = ref(false);
const items = ref(0);
const perPage = ref(10);
const currentPage = ref(0);

onBeforeMount(() => {
    ApiMain.get("/weather")
    .then((data) => {
      states.weather = data.data.data;
      items.value = data.data.meta.itemCount
    })
    .catch((error) => {
      console.log(error);
    });
});

const del = (id) => {
  Swal.fire({
    title: "ยืนยันการลบ",
    text: "คุณต้องการลบ ภูมิอากาศนี้ใช้หรือไม่",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Ok",
  }).then((result) => {
    if (result.isConfirmed) {
        ApiMain.delete("/weather/"+id)
        .then((data) => {
          Swal.fire("Deleted!", "Your file has been deleted.", "success");
          //console.log("del" + id);
          ApiMain.get("/weather").then((data) => {
            states.weather = data.data.data;
            items.value = data.data.meta.itemCount
          })
        })
        .catch((error) => {
          console.log(error);
        })
    }
  });
};

const edit = (id) => {
 router.push("/weather/edit/"+id); 
}

const numPages = computed(() => {
  return Math.ceil(items.value / perPage.value)
  }
)

const currentPageHuman = computed(() => currentPage.value + 1)

const pagesList = computed(() => {
  const pagesList = []

  for (let i = 0; i < numPages.value; i++) {
    pagesList.push(i)
  }

  return pagesList
})

const pageNext = (page) => {
  currentPage.value = page;
  ApiMain.get("/weather?order=ASC&page=" + (page + 1) + "&take=" + perPage.value, {
    })
    .then((data) => {
      states.weather = data.data.data;
    });
};
</script>

<template>
  <table>
    <thead>
      <tr>
        <th v-if="checkable" />
        <th>ID</th>
        <th>หัวข้อ</th>
        <th>รายละเอียด</th>
        <th>วันที่วัดค่า</th>
        <th>ปริมาณฝนรวม24ชม.</th>
        <th>สภาพอากาศ</th>
        <th>ความเร็วลม</th>
        <th>วันที่สร้าง</th>
        <th />
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(client, index) in states.weather"
        :key="client.id"
        :class="[tableTrStyle, index % 2 === 0 ? tableTrOddStyle : '']"
      >
        <td>
          {{ client.id }}
        </td>
        <td data-label="title">
          {{ client.title }}
        </td>
        <td data-label="detail">
          {{ client.detail }}
        </td>
        <td data-label="date">
          {{ moment(client.date).format('HH:mm:ss DD/MM/YYYY') }}
        </td>
        <td data-label="rain_volume">
          {{ client.rainVolume }}
        </td>
        <td data-label="weather_condition">
          {{ client.weatherCondition }}
        </td>
        <td data-label="windSpeed">
          {{ client.windSpeed }}
        </td>
        <td data-label="createdAt">
          {{ moment(client.createdAt).format('DD-MM-YYYY') }}
        </td>
        <td class="actions-cell">
          <jb-buttons type="justify-start lg:justify-end" no-wrap>
            <jb-button
              color="info"
              :icon="mdiGreasePencil"
              small
              @click="edit(client.id)"
            />
            <jb-button
              color="danger"
              :icon="mdiTrashCan"
              small
              @click="del(client.id)"
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