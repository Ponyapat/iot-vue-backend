<script setup>
import { computed, ref, onBeforeMount, reactive, onMounted } from "vue";
import { useMainStore } from "@/stores/main";
import { useRouter } from "vue-router";
import JbButtons from "@/components/JbButtons.vue";
import JbButton from "@/components/JbButton.vue";
import CheckRadioPicker from "@/components/CheckRadioPicker.vue";
import { mdiTrashCan, mdiGreasePencil } from "@mdi/js";
import Swal from "sweetalert2";

const mainStore = useMainStore();

const router = useRouter();

const lightBorderStyle = computed(() => mainStore.lightBorderStyle);

const tableTrStyle = computed(() => mainStore.tableTrStyle);

const tableTrOddStyle = computed(() => mainStore.tableTrOddStyle);

const darkMode = computed(() => mainStore.darkMode);


const edit = (id) => {
  console.log('Edit', id)
  const url = router.push("/user/edit/" + id);
  console.log('DEBUG: ', url)
}
const del = (id) => {
  console.log('Delete', id)
  Swal.fire({
    title: "ยืนยันการลบ",
    text: "คุณต้องการลบ Admin ท่านนี้ใช่หรือไม่",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Ok",
  }).then(() => {
    console.log('ยืนยันการลบ')
    // ส่งการลบไปยัง data base
  })
}
const onChangeActive = (id, isActive) => {
  console.log('DEBUG:', id, isActive)
  // ส่งค่าไปยัง data base
}

const users = ref([
  {
    id: 1,
    username: "inkink1",
    name: "ink1",
    email: "ink1@gmailcom",
    status: "admin",
    is_active: 0
  },
  {
    id: 2,
    username: "inkink2",
    name: "ink2",
    email: "ink2@gmailcom",
    status: "super_admin",
    is_active: 1
  },
  {
    id: 3,
    username: "inkink3",
    name: "ink3",
    email: "ink3@gmailcom",
    status: "admin",
    is_active: 1
  }
]);
</script>
<template>
  <div>
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Admin ID</th>
          <th>Username</th>
          <th>Name</th>
          <th>Email</th>
          <th>Status</th>
          <th>Active</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(user, index) in users" :key="index" :class="[tableTrStyle, index % 2 === 0 ? tableTrOddStyle : '']">
          <td data-label="#">
            {{ index + 1 }}
          </td>
          <td data-label="ID">
            {{ user.id }}
          </td>
          <td data-label="Username">
            {{ user.username }}
          </td>
          <td data-label="Name">
            {{ user.name }}
          </td>
          <td data-label="E-mail">
            {{ user.email }}
          </td>
          <td data-label="Status">
            {{ user.status }}
          </td>
          <td data-label="Active">
            <check-radio-picker
              v-model="user.is_active"
              name="sample-switch"
              type="switch"
              @change="onChangeActive(user.id, user.is_active)"
            />
          </td>
          <td class="actions-cell">
            <jb-buttons type="justify-start lg:justify-end" no-wrap>
              <jb-button color="info" :icon="mdiGreasePencil" small @click="edit(user.id)" />
              <jb-button color="danger" :icon="mdiTrashCan" small @click="del(user.id)"/>
            </jb-buttons>
          </td>
        </tr>
      </tbody>
    </table>
    <div
      :class="lightBorderStyle"
      class="p-3 lg:px-6 border-t dark:border-gray-800"
    >
      <!-- <level>
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
      </level> -->
    </div>
  </div>
</template>
