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

onBeforeMount(() => {
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
}
</script>

<template>
  <table>
    <thead>
      <tr class="text-sm">
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
              color="info"
              :icon="mdiGreasePencil"
              small
              @click="edit(item.id)"
            />
            <!-- <jb-button
              class="mt-2"
              color="danger"
              :icon="mdiTrashCan"
              small
              @click="del(item.id)"
            /> -->
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
<style scope>
label {
  font-weight: bold;
}
</style>