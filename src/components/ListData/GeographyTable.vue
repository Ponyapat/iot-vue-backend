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
    ApiMain.get("/geo")
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
    ApiMain.get("/geo?order=ASC&page="+(page+1)+"&take="+perPage.value)
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
        <th>ID Project</th>
        <th>Lat, Lon</th>
        <th>รายละเอียดดิน</th>
        <th>ลักษณะของพื้นที่</th>
        <th>แหล่งน้ำใกล้เคียง</th>
        <th />
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(item, index) in states.geo"
        :key="item.id"
        :class="[tableTrStyle, index % 2 === 0 ? tableTrOddStyle : '', 'text-sm ']"
      >
        <td data-label="ID Project" class="align-top font-bold">
          {{ item.projectId }}
        </td>
        <td data-label="Lat, Lon" class="align-top">
          {{ item.lat }}, {{ item.lon}}
        </td>
        <td data-label="รายละเอียดดิน" class="align-top">
          <!-- รายละเอียด -->
          <div>
            <div>
              <label>คุณสมบัติของดิน</label>
              <p v-html="item.soilProperties"></p>
            </div>
            <hr class="mt-2"/>
            <div class="mt-2">
              <label>ข้อจำกัดของดิน</label>
              <p>{{ item.soilRestrictions }}</p>
            </div>
            <hr class="mt-2"/>
            <div class="mt-2">
              <label>การระบายน้ำ: </label><span>{{ drainage(item.drainage) }}</span>
            </div>
            <hr class="mt-2"/>
            <div class="mt-2">
              <label>ความอุดมสมบูรณ์:&nbsp;</label><span>{{ spaceNatureDetail(item.soilFertility) }}</span>
            </div>
            <hr class="mt-2"/>
            <div class="mt-2">
              <label>ดินชั้นบน</label>
              <p>{{ item.topsoilDetail }}</p>
              <p>ค่า pH ในดิน:&nbsp;{{ item.topsoilValueMin }} - {{ item.topsoilValueMax}}</p>
            </div>
            <hr class="mt-2"/>
            <div class="mt-2">
              <label>ดินชั้นล่าง</label>
              <p>{{ item.subsoilDetail }}</p>
              <p>ค่า pH ในดิน:&nbsp;{{ item.subsoilValueMin }} - {{ item.subsoilValueMax}}</p>
            </div>
          </div>
        </td>
        <td data-label="ลักษณะของพื้นที่" class="align-top">
          <!-- ลักษณะของพื้นที่ -->
          <div>
            <label>ลักษณะ</label>
            <ul class="list-disc mt-2">
              <li v-if="item.spaceNaturePlain === 'true'">ที่ราบเรียบ</li>
              <li v-if="item.spaceNaturePlateau === 'true'">ที่ราบสูง</li>
              <li v-if="item.spaceNatureHill === 'true'">เนินเขา</li>
              <li v-if="item.spaceNatureMountain === 'true'">ภูเขา</li>
            </ul>
          </div>
          <div class="mt-2">
            <label>รายละเอียด: </label>
            {{ item.spaceNatureDetail }}
          </div>
          <div><label>ความลาดชัน: </label> <span>{{ item.slope }}</span></div>
        </td>
        <td data-label="แหล่งน้ำใกล้เคียง" class="align-top">
          <!-- แหล่งน้ำใกล้เคียง -->
          <ul class="list-disc">
            <li>แหล่งน้ำธรรมชาติ : {{ item.nearbyNaturalWater }}</li>
            <li>แหล่งน้ำในไร่นานอกเขตชลประทาน : {{ item.nearbyInfarmWater }}</li>
            <li>แหล่งน้ำขนาดเล็ก : {{ item.nearbySmallWater }}</li>
            <li>บ่อน้ำบาดาล : {{ item.nearbyGroundWater }}</li>
          </ul>
        </td>
        <td data-label="">
          
        </td>
        <td class="actions-cell align-top">
            <jb-button
              color="info"
              :icon="mdiGreasePencil"
              small
              @click="edit(item.id)"
            />
            <jb-button
              class="mt-2"
              color="danger"
              :icon="mdiTrashCan"
              small
              @click="del(item.id)"
            />
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