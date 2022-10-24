<script setup>
import { computed, ref, onBeforeMount, reactive, onMounted } from "vue";
import { useMainStore } from "@/stores/main";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import JbButtons from "@/components/JbButtons.vue";
import JbButton from "@/components/JbButton.vue";
import Level from "@/components/Level.vue";
import { mdiTrashCan, mdiGreasePencil } from "@mdi/js";

const mainStore = useMainStore();
const router = useRouter();
// const lightBorderStyle = computed(() => mainStore.lightBorderStyle)
const tableTrStyle = computed(() => mainStore.tableTrStyle);
const tableTrOddStyle = computed(() => mainStore.tableTrOddStyle);
const lightBorderStyle = computed(() => mainStore.lightBorderStyle);
const darkMode = computed(() => mainStore.darkMode);
const items = ref(0);
const perPage = ref(10);
const currentPage = ref(0);

const states = reactive({
  roles: {},
});

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
  ApiMain.get("/role?order=ASC&page=" + (page + 1) + "&take=" + perPage.value)
  .then((data) => {
    states.roles = data.data.data;
  });
};

const fetchRoleData = () => {
  ApiMain.get("/role")
    .then((response) => {
      states.roles = response.data.data;
      items.value = response.data.meta.itemCount;
    });
};

const edit = (id) => {
  router.push("/role/edit/" + id);
};

const del = (role) => {
  //console.log("del", role.id);
  Swal.fire({
    title: "ยืนยันการลบ",
    text: `คุณต้องการลบสถานะ ${role.name} ใช่หรือไม่`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Ok",
  }).then((result) => {
    console.log(result);
    if (result.isConfirmed) {
      console.log("ยืนยันการลบ");
      ApiMain.delete("/role/" + role.id)
        .then((data) => {
          setInterval(function () {
            location.reload();
          }, 1500);
          Swal.fire("Deleted!", "Your file has been deleted.", "success");
          // console.log("del" + id);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  });
};

onBeforeMount(() => {
  fetchRoleData();
});
</script>

<template>
  <div>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>NAME</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(role, index) in states.roles"
          :key="index"
          :class="[tableTrStyle, index % 2 === 0 ? tableTrOddStyle : '']"
        >
          <td class="p-3" data-label="ID">{{ role.id }}</td>
          <td class="p-3" data-label="Name">{{ role.name }}</td>
          <td class="actions-cell">
            <jb-buttons type="justify-start lg:justify-end" no-wrap>
              <jb-button
                color="info"
                :icon="mdiGreasePencil"
                small
                @click="edit(role.id)"
              />
              <jb-button
                color="danger"
                :icon="mdiTrashCan"
                small
                @click="del(role)"
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
  </div>
</template>
